/* =====================================================================
 * 현장 직접 입력 데이터 (엑셀 자동 추출 대상이 아닌 항목)
 * ---------------------------------------------------------------------
 *  - data/schedule.js, data/billing.js 는 tools/extract_data.py 로 자동 생성
 *  - 이 파일은 현장에서 직접 입력·수정
 * ===================================================================== */
window.SITE_DATA = {

  /* 1. 현장개요 */
  project: {
    name: "송산 마을어울림센터 건립공사",
    location: "경기도 화성시 송산면 사강리 687-8 외",
    client: "화성도시공사",
    contractor: "일신건설㈜",
    startDate: "2025-02-24",
    endDate: "2026-12-19",
    baseDate: "2026-11-05"          // 대시보드 기준일 (비우면 오늘 날짜)
  },

  /* 2. 기성 기준일 — 실적 공정률(기성 기준)을 공정표 계획과 비교하는 시점
   *    ※ 제6회 기성검사원 작성일이 '2026년 10월 일'로 일자 미기재 → 10월 말로 가정.
   *       실제 기성 기준일(기성 산정 마감일)로 수정할 것.                          */
  billingCutoff: "2026-10-31",

  /* 3. 실적 공정률 (주간공정보고 등 실측 실적이 있으면 입력 — 기성 기준값보다 우선 표시)
   *    예) { date: "2026-10-31", actual: 70.5, source: "주간공정보고 10월 5주차" }      */
  actualProgress: [],

  /* 4. 관리기준 — 현장 내부 관리기준값 (법정 기준 아님, 현장 방침에 따라 수정) */
  thresholds: {
    progressGapWarn: -3.0,   // 공정 차이(%p) 이 값 이하이면 '주의'
    progressGapCrit: -5.0,   // 이 값 이하이면 '경고'
    spiWarn: 0.95, spiCrit: 0.90
  },

  /* 5. 품질관리 [샘플 — 품질시험 실적보고서 수령 후 교체] */
  quality: {
    SAMPLE: true,
    monthlyTests: [
      { month: "2026-05", pass: 42, fail: 1 },
      { month: "2026-06", pass: 38, fail: 0 },
      { month: "2026-07", pass: 45, fail: 2 },
      { month: "2026-08", pass: 40, fail: 1 },
      { month: "2026-09", pass: 36, fail: 0 },
      { month: "2026-10", pass: 31, fail: 1 }
    ],
    /* 시험종목별 누계 — 판정 기준은 품질관리계획서 및 해당 KCS 기준 적용 */
    testItems: [
      { item: "콘크리트 압축강도", total: 186, fail: 2 },
      { item: "콘크리트 슬럼프",   total: 214, fail: 3 },
      { item: "콘크리트 공기량",   total: 214, fail: 1 },
      { item: "염화물 함유량",     total: 92,  fail: 0 },
      { item: "철근 인장시험",     total: 24,  fail: 0 },
      { item: "성토 다짐도",       total: 38,  fail: 1 }
    ],
    /* 부적합(NCR) — status: open / closed */
    ncr: [
      { no: "NCR-012", date: "2026-10-21", trade: "조적공사",     title: "치장벽돌 줄눈 불량",       status: "open" },
      { no: "NCR-011", date: "2026-10-08", trade: "기계설비공사", title: "배관 지지간격 미준수",     status: "open" },
      { no: "NCR-010", date: "2026-09-17", trade: "방수공사",     title: "방수층 들뜸",              status: "closed" },
      { no: "NCR-009", date: "2026-06-29", trade: "철근콘크리트공사", title: "피복두께 부족(스페이서 누락)", status: "closed" }
    ]
  },

  /* 6. 안전관리 [샘플 — 안전일지·출역일보 수령 후 교체] */
  safety: {
    SAMPLE: true,
    accidentFreeSince: "2025-02-24",   // 무재해 기산일 (최종 재해 발생 익일)
    monthly: [
      { month: "2026-05", workers: 1120, workDays: 26, tbmDays: 26 },
      { month: "2026-06", workers: 1185, workDays: 25, tbmDays: 25 },
      { month: "2026-07", workers: 970,  workDays: 23, tbmDays: 22 },
      { month: "2026-08", workers: 1210, workDays: 24, tbmDays: 24 },
      { month: "2026-09", workers: 1350, workDays: 25, tbmDays: 25 },
      { month: "2026-10", workers: 1290, workDays: 24, tbmDays: 24 }
    ],
    riskAssessment: { total: 248, done: 231 },   // 위험성평가 개선대책 이행 (누계)
    findings: [
      { date: "2026-10-30", source: "자체 정기점검",   title: "외부 비계 작업발판 고정 불량",    status: "open" },
      { date: "2026-10-24", source: "건설사업관리단",  title: "개구부 덮개 미설치",              status: "closed" },
      { date: "2026-10-15", source: "자체 정기점검",   title: "이동식 사다리 아웃트리거 미사용", status: "closed" },
      { date: "2026-10-02", source: "발주처 합동점검", title: "분전반 접지 불량",                status: "closed" }
    ]
  }
};
