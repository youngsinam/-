"""엑셀 원자료 → 대시보드 데이터(JS) 변환 스크립트.

사용법:
    python3 tools/extract_data.py --schedule <예정공정표.xlsx> --billing <기성내역서.xlsx>

생성 파일:
    data/schedule.js  : 예정공정표 '네트워크' 시트의 주간 계획 누계 공정률, 공종별 주간 보할
    data/billing.js   : 기성내역서의 기성검사원·기성금청구서·선급금정산·원가계산서·집계표

※ 셀 위치는 '송산 마을어울림센터 예정공정표(Rev.3)'와 '제6회 기성내역서' 양식 기준이다.
   양식(행·열)이 바뀌면 이 스크립트의 셀 주소를 함께 수정해야 한다.
"""
import argparse
import datetime as dt
import json
import os
import re

import openpyxl
from openpyxl.utils import column_index_from_string as ci

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def norm(s):
    """공종명 비교용: 공백·번호·괄호 제거."""
    s = str(s or "")
    s = re.sub(r"^\s*[\d.]+\)?\s*", "", s)
    return re.sub(r"[\s()（）.]", "", s)


def write_js(path, var, obj, header):
    body = json.dumps(obj, ensure_ascii=False, indent=2)
    with open(path, "w", encoding="utf-8") as f:
        f.write(header + f"window.{var} = {body};\n")


# ---------------------------------------------------------------------------
# 1. 예정공정표
# ---------------------------------------------------------------------------
def extract_schedule(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb["네트워크"]
    info = wb["정보"]

    c0, c1 = ci("F"), ci("CW")          # 주간 열 범위
    # 주차 시작일: 3행(월), 4행(일). 연도는 월이 감소할 때 +1
    weeks, yr, mon = [], 2025, None
    for c in range(c0, c1 + 1):
        m = ws.cell(3, c).value
        if isinstance(m, str) and m.strip().endswith("월"):
            nm = int(m.strip()[:-1])
            if mon is not None and nm < mon:
                yr += 1
            mon = nm
        d = int(ws.cell(4, c).value)
        weeks.append(dt.date(yr, mon, d))

    cum = [ws.cell(54, c).value or 0 for c in range(c0, c1 + 1)]  # 합계 누계(직접비+간접비)

    # 공종별 주간 보할 (63~192행). 'n) 공종' 머리행 아래 세부공종을 묶는다.
    groups, cur = [], None
    for r in range(63, 193):
        a, b = ws.cell(r, 1).value, ws.cell(r, 2).value
        name = b or a
        if not name:
            continue
        name = str(name).strip()
        w = ws.cell(r, 4).value
        vals = [ws.cell(r, c).value or 0 for c in range(c0, c1 + 1)]
        # 머리행: '1) 공통가설공사', '12. 유리공사'(원본 표기) 등 — 번호 뒤 공백 필수('0.5B'는 제외)
        is_header = bool(re.match(r"^\d+[.)]\s", name)) or a in ("품질관리비", "안전관리비", "고재처리비", "ps공사")
        if a in ("건축", "토목", "기계"):      # '1. 건축공사' 같은 대분류 행
            division = a
            cur = None
            continue
        if is_header:
            cur = {"name": re.sub(r"^\d+[.)]\s*", "", name).strip(), "division": division if a not in ("품질관리비", "안전관리비", "고재처리비", "ps공사") else "기타",
                   "amount": ws.cell(r, 3).value or 0, "weekly": [0.0] * len(weeks)}
            if a == "ps공사":
                cur["name"] = "P.S공사"
            groups.append(cur)
        if cur is not None and isinstance(w, (int, float)):
            for i, v in enumerate(vals):
                if isinstance(v, (int, float)):
                    cur["weekly"][i] += v

    out_groups = []
    for g in groups:
        tot = sum(g["weekly"])
        if abs(tot) < 1e-12:
            continue
        idx = [i for i, v in enumerate(g["weekly"]) if abs(v) > 0]
        out_groups.append({
            "name": g["name"], "division": g["division"], "amount": g["amount"],
            "weight": round(tot * 100, 4),
            "start": weeks[idx[0]].isoformat(),
            "finish": (weeks[idx[-1] + 1] - dt.timedelta(days=1) if idx[-1] + 1 < len(weeks) else weeks[-1]).isoformat(),
            "weekly": [round(v * 100, 5) for v in g["weekly"]],
        })

    return {
        "title": ws["A1"].value,
        "projectName": info["I21"].value,
        "location": info["I22"].value,
        "contractDate": info["I23"].value.date().isoformat() if info["I23"].value else None,
        "writtenDate": info["I27"].value.date().isoformat() if info["I27"].value else None,
        "baseAmount": ws["C45"].value,            # 공정표 보할 산정 기준 금액
        "weeks": [w.isoformat() for w in weeks],  # 각 주차 시작일(월요일)
        "planCum": [round(v * 100, 3) for v in cum],
        "groups": out_groups,
    }


# ---------------------------------------------------------------------------
# 2. 기성내역서
# ---------------------------------------------------------------------------
def extract_billing(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    g = wb["기성검사원"]
    q = wb["기성금청구서"]
    p = wb["선급금정산"]
    oc = wb["원가계산서(취합)"]
    mj = wb["기성주요내용"]

    round_no = int(re.search(r"(\d+)\s*회", g["B1"].value).group(1))
    date_txt = re.sub(r"\s+", " ", str(g["B23"].value or "")).strip()

    # 원가계산서 비목 (계약 / 전회 / 금회 / 누계)
    cost_rows = []
    for r, label in [(8, "재료비"), (11, "노무비"), (26, "경비"), (28, "일반관리비"), (29, "이윤"),
                     (30, "고재처리비"), (31, "P.S 제외공사"), (32, "공급가액"), (33, "부가가치세"),
                     (34, "합계금액"), (35, "물가변동(ES)"), (36, "도급공사비")]:
        cost_rows.append({"item": label, **{k: oc.cell(r, c).value or 0 for k, c in
                                              (("contract", 4), ("prev", 5), ("cur", 6), ("cum", 7))}})

    # 공종별 집계 (건축·기계: H/J/M/P, 토목: K/M/P/S)
    trades = []
    for sheet, division, cols in [("집계표(건축)", "건축", (8, 10, 13, 16)),
                                  ("집계표(토목)", "토목", (11, 13, 16, 19)),
                                  ("집계표(기계)", "기계", (8, 10, 13, 16))]:
        ws = wb[sheet]
        cur = None
        for row in ws.iter_rows(min_row=4, values_only=True):
            row = list(row) + [None] * 25
            code = str(row[1] or "").strip()
            m = re.match(r"^(\d+)\s+(.*)$", code)
            if m:
                cur = (m.group(1), m.group(2))
            if row[5] == "합" and cur:
                code_no, name = cur
                cur = None
                if len(code_no) != 6:          # 6자리 = 중공종
                    continue
                vals = [row[c - 1] for c in cols]
                if not all(isinstance(v, (int, float)) for v in vals):
                    continue
                trades.append({"division": division if code_no[:4] in ("0101", "0102", "0103") and len(code_no) == 6 else division,
                               "code": code_no, "name": re.sub(r"\s+", "", name),
                               "contract": vals[0], "prev": vals[1], "cur": vals[2], "cum": vals[3]})
    # 건축 집계표 안의 품질/안전/고재/PS(0102~0105)는 '기타'로 분류
    for t in trades:
        if t["division"] == "건축" and not t["code"].startswith("0101"):
            t["division"] = "기타"

    # 금회 기성 주요내용
    major, sect, trade = [], None, None
    for r in range(4, 35):
        b, c, d, e = (mj.cell(r, k).value for k in (2, 3, 4, 5))
        if b and str(b).strip() in ("건축공사", "기계설비공사"):
            sect = str(b).strip()
        if c and not str(c).strip().startswith("-"):
            trade = str(c).strip()
        if c and str(c).strip().startswith("-") and isinstance(d, (int, float)):
            major.append({"division": sect, "trade": trade, "desc": str(c).strip(" -"), "amount": d,
                          "note": (str(e).strip() if e and str(e).strip() else "")})

    return {
        "round": round_no,
        "dateText": date_txt,
        "contractAmount": g["H7"].value,
        "prevCum": g["H9"].value, "cur": g["H10"].value, "cum": g["H11"].value, "remain": g["H12"].value,
        "advance": {"amount": q["H7"].value, "settledPrev": p["E7"].value, "settledCur": p["F7"].value,
                    "settledCum": p["G7"].value, "balance": p["H7"].value,
                    "byRound": [v for v in (p.cell(8, c).value for c in range(10, 20)) if isinstance(v, (int, float))]},
        "claim": {"laborDeduction": q["H11"].value, "advanceDeduction": q["H12"].value, "net": q["H13"].value},
        "es": {"contract": oc["D35"].value, "cum": oc["G35"].value or 0},
        "costSheet": cost_rows,
        "trades": trades,
        "majorWorks": major,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--schedule", required=True)
    ap.add_argument("--billing", required=True)
    a = ap.parse_args()
    stamp = dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    hdr = "/* 자동 생성 파일 — tools/extract_data.py 로 재생성. 직접 수정하지 말 것. */\n/* 원본: {src} / 생성: " + stamp + " */\n"
    write_js(os.path.join(ROOT, "data", "schedule.js"), "SCHEDULE_DATA", extract_schedule(a.schedule),
             hdr.format(src=os.path.basename(a.schedule)))
    write_js(os.path.join(ROOT, "data", "billing.js"), "BILLING_DATA", extract_billing(a.billing),
             hdr.format(src=os.path.basename(a.billing)))
    print("ok")


if __name__ == "__main__":
    main()
