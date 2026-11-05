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

  /* 3. 실적 공정률 — 추후 입력 (주간공정보고 실측값. 입력 시 기성 기준값보다 우선 표시)
   *    예) { date: "2026-10-31", actual: 70.5, source: "주간공정보고 10월 5주차" }      */
  actualProgress: [],

  /* 4. 관리기준 — 현장 내부 관리기준값 (법정 기준 아님, 현장 방침에 따라 수정) */
  thresholds: {
    progressGapWarn: -3.0,   // 공정 차이(%p) 이 값 이하이면 '주의'
    progressGapCrit: -5.0,   // 이 값 이하이면 '경고'
    spiWarn: 0.95, spiCrit: 0.90
  },

  /* 5. 품질관리 — 추후 입력 (품질시험 실적보고서 기준)
   *    monthlyTests: { month: "2026-10", pass: 0, fail: 0 }
   *    testItems   : { item: "콘크리트 압축강도", total: 0, fail: 0 }  — 판정은 품질관리계획서·해당 KCS 기준
   *    ncr         : { no: "NCR-001", date: "2026-10-21", trade: "조적공사", title: "내용", status: "open" | "closed" } */
  quality: {
    monthlyTests: [],
    testItems: [],
    ncr: []
  },

  /* 6. 안전관리 — 추후 입력 (안전일지·출역일보 기준)
   *    accidentFreeSince: "2025-02-24"   — 무재해 기산일 (최종 재해 발생 익일)
   *    monthly       : { month: "2026-10", workers: 0, workDays: 0, tbmDays: 0 }
   *    riskAssessment: { total: 0, done: 0 }  — 위험성평가 개선대책 이행 누계
   *    findings      : { date: "2026-10-30", source: "자체 정기점검", title: "내용", status: "open" | "closed" } */
  safety: {
    accidentFreeSince: "",
    monthly: [],
    riskAssessment: null,
    findings: []
  }
};
