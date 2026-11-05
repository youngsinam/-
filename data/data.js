/* =====================================================================
 * 건설현장 대시보드 데이터 파일
 * ---------------------------------------------------------------------
 * ※ 현재 값은 화면 구성 확인용 [샘플 데이터]입니다.
 *    - project(현장개요)의 공사기간·도급액만 실제 값입니다.
 *    - 공정표·계약내역서·실행예산 수령 후 각 항목을 실제 값으로 교체합니다.
 *    - 교체 완료 시 SAMPLE 플래그를 false 로 바꾸면 상단 경고띠가 사라집니다.
 * 단위: 금액 = 원(KRW, VAT 포함 여부는 계약서 기준으로 기재), 비율 = %
 * ===================================================================== */
window.DASHBOARD_DATA = {
  SAMPLE: true,

  /* 1. 현장개요 (실제 값) */
  project: {
    name: "○○ 건설공사",            // 공사명 (실제 공사명으로 교체)
    startDate: "2025-02-24",        // 착공일
    endDate: "2026-12-19",          // 준공예정일
    contractAmount: 5360776269,     // 도급액 (원)
    baseDate: "2026-11-05"          // 대시보드 기준일 (비우면 오늘 날짜)
  },

  /* 2. 관리기준 — 현장 내부 관리기준값 (법정 기준 아님, 현장 방침에 따라 수정) */
  thresholds: {
    progressGapWarn: -3.0,   // 공정 차이(%p) 이 값 이하이면 '주의'
    progressGapCrit: -5.0,   // 이 값 이하이면 '경고'
    spiWarn: 0.95, spiCrit: 0.90,
    cpiWarn: 0.97, cpiCrit: 0.93,
    execRateWarn: 95, execRateCrit: 100   // 공종별 실행 집행률(%)
  },

  /* 3. 공정관리 — 월말 누계 공정률 (%) [샘플]
   *    plan    : 계획 누계 공정률 (공정표 기준)
   *    actual  : 실적 누계 공정률 (주간/월간 공정보고 기준)
   *    costCum : 실투입원가 누계 (원) — 원가관리 EVM의 AC                 */
  progress: [
    {"month": "2025-02", "plan": 0.5, "actual": 0.4, "costCum": 19685000},
    {"month": "2025-03", "plan": 2.0, "actual": 1.8, "costCum": 87713000},
    {"month": "2025-04", "plan": 4.5, "actual": 4.0, "costCum": 192988000},
    {"month": "2025-05", "plan": 8.0, "actual": 7.2, "costCum": 343905000},
    {"month": "2025-06", "plan": 12.0, "actual": 11.0, "costCum": 530717000},
    {"month": "2025-07", "plan": 16.5, "actual": 15.2, "costCum": 740688000},
    {"month": "2025-08", "plan": 21.5, "actual": 20.0, "costCum": 964940000},
    {"month": "2025-09", "plan": 27.0, "actual": 25.3, "costCum": 1208443000},
    {"month": "2025-10", "plan": 32.5, "actual": 30.6, "costCum": 1446831000},
    {"month": "2025-11", "plan": 38.0, "actual": 36.0, "costCum": 1719523000},
    {"month": "2025-12", "plan": 43.5, "actual": 41.2, "costCum": 1987776000},
    {"month": "2026-01", "plan": 49.0, "actual": 46.5, "costCum": 2265920000},
    {"month": "2026-02", "plan": 54.5, "actual": 51.8, "costCum": 2499195000},
    {"month": "2026-03", "plan": 60.0, "actual": 57.0, "costCum": 2722578000},
    {"month": "2026-04", "plan": 65.0, "actual": 62.0, "costCum": 2931488000},
    {"month": "2026-05", "plan": 70.0, "actual": 67.1, "costCum": 3205000000},
    {"month": "2026-06", "plan": 75.0, "actual": 72.0, "costCum": 3473784000},
    {"month": "2026-07", "plan": 80.0, "actual": 76.8, "costCum": 3742423000},
    {"month": "2026-08", "plan": 84.5, "actual": 81.0, "costCum": 3947087000},
    {"month": "2026-09", "plan": 89.0, "actual": 85.2, "costCum": 4192857000},
    {"month": "2026-10", "plan": 93.5, "actual": 89.4, "costCum": 4399547000},
    {"month": "2026-11", "plan": 97.5},
    {"month": "2026-12", "plan": 100.0}
  ],

  /* 주요 마일스톤 [샘플] — status: done / ongoing / planned / delayed */
  milestones: [
    { name: "착공",               plan: "2025-02-24", actual: "2025-02-24", status: "done" },
    { name: "가설공사 완료",       plan: "2025-04-15", actual: "2025-04-22", status: "done" },
    { name: "기초공사 완료",       plan: "2025-07-31", actual: "2025-08-12", status: "done" },
    { name: "골조공사 완료",       plan: "2026-04-30", actual: "2026-05-20", status: "done" },
    { name: "외부 마감 완료",      plan: "2026-09-30", actual: "",           status: "delayed" },
    { name: "내부 마감 완료",      plan: "2026-11-30", actual: "",           status: "ongoing" },
    { name: "시운전·준공검사",     plan: "2026-12-10", actual: "",           status: "planned" },
    { name: "준공",               plan: "2026-12-19", actual: "",           status: "planned" }
  ],

  /* 4. 원가관리 [샘플] */
  cost: {
    executionBudget: 4824700000,   // 실행예산 총액 (원) = EVM의 BAC
    /* 기성 청구 내역 — month: 기성 대상월, amount: 금회 기성금액(원) */
    billings: [
    {"no": 1, "month": "2025-03", "amount": 21443000},
    {"no": 2, "month": "2025-04", "amount": 75051000},
    {"no": 3, "month": "2025-05", "amount": 117937000},
    {"no": 4, "month": "2025-06", "amount": 171545000},
    {"no": 5, "month": "2025-07", "amount": 203709000},
    {"no": 6, "month": "2025-08", "amount": 225153000},
    {"no": 7, "month": "2025-09", "amount": 257317000},
    {"no": 8, "month": "2025-10", "amount": 284121000},
    {"no": 9, "month": "2025-11", "amount": 284122000},
    {"no": 10, "month": "2025-12", "amount": 289481000},
    {"no": 11, "month": "2026-01", "amount": 278761000},
    {"no": 12, "month": "2026-02", "amount": 284121000},
    {"no": 13, "month": "2026-03", "amount": 284121000},
    {"no": 14, "month": "2026-04", "amount": 278760000},
    {"no": 15, "month": "2026-05", "amount": 268039000},
    {"no": 16, "month": "2026-06", "amount": 273400000},
    {"no": 17, "month": "2026-07", "amount": 262678000},
    {"no": 18, "month": "2026-08", "amount": 257317000},
    {"no": 19, "month": "2026-09", "amount": 225153000},
    {"no": 20, "month": "2026-10", "amount": 225152000}
    ],
    /* 공종별 실행예산 대비 투입원가 (원) */
    trades: [
      { name: "공통가설공사",     budget: 385000000,  spent: 352000000 },
      { name: "토공·기초공사",    budget: 610000000,  spent: 628500000 },
      { name: "철근콘크리트공사", budget: 1520000000, spent: 1462000000 },
      { name: "마감공사",         budget: 1180000000, spent: 905000000 },
      { name: "기계설비공사",     budget: 640000000,  spent: 552000000 },
      { name: "전기·통신공사",    budget: 489700000,  spent: 500047000 }
    ]
  },

  /* 5. 품질관리 [샘플] — 월별 품질시험 건수 */
  quality: {
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
      { no: "NCR-012", date: "2026-10-21", trade: "마감공사",         title: "외벽 실링 시공 불량",          status: "open" },
      { no: "NCR-011", date: "2026-10-08", trade: "기계설비공사",     title: "배관 지지간격 미준수",         status: "open" },
      { no: "NCR-010", date: "2026-09-17", trade: "마감공사",         title: "방수층 들뜸",                  status: "closed" },
      { no: "NCR-009", date: "2026-08-29", trade: "철근콘크리트공사", title: "피복두께 부족(스페이서 누락)", status: "closed" },
      { no: "NCR-008", date: "2026-07-14", trade: "철근콘크리트공사", title: "슬럼프 시험 불합격 — 반송",   status: "closed" }
    ]
  },

  /* 6. 안전관리 [샘플] */
  safety: {
    accidentFreeSince: "2025-02-24",   // 무재해 기산일 (최종 재해 발생 익일)
    monthly: [
      { month: "2026-05", workers: 3120, workDays: 26, tbmDays: 26 },
      { month: "2026-06", workers: 3285, workDays: 25, tbmDays: 25 },
      { month: "2026-07", workers: 2970, workDays: 23, tbmDays: 22 },
      { month: "2026-08", workers: 2810, workDays: 24, tbmDays: 24 },
      { month: "2026-09", workers: 3050, workDays: 25, tbmDays: 25 },
      { month: "2026-10", workers: 2890, workDays: 24, tbmDays: 24 }
    ],
    /* 위험성평가 개선대책 이행 현황 (누계) */
    riskAssessment: { total: 248, done: 231 },
    /* 안전점검 지적사항 — status: open / closed */
    findings: [
      { date: "2026-10-30", source: "자체 정기점검",   title: "외부 비계 작업발판 고정 불량",   status: "open" },
      { date: "2026-10-24", source: "감리단 점검",     title: "개구부 덮개 미설치(3층)",        status: "closed" },
      { date: "2026-10-15", source: "자체 정기점검",   title: "이동식 사다리 아웃트리거 미사용", status: "closed" },
      { date: "2026-10-02", source: "발주처 합동점검", title: "분전반 접지 불량",               status: "closed" }
    ]
  }
};
