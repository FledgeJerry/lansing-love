// ALICE = Asset Limited, Income Constrained, Employed — a United Way framework
// for households above the federal poverty line but still unable to afford
// a basic cost-of-living budget. These figures come from published annual
// reports, not a live API — there's nothing to fetch, so they need a manual
// update when a new report comes out. Re-verify before bumping the year.
//
// Sources (checked 2026-06-21):
// - Lansing city ALICE %: United Way of South Central Michigan, "The State of
//   ALICE in UWSCMI" 2025 Report (2023 data) — unitedforscmi.org
// - Ingham County poverty/ALICE breakdown: UWSCMI, 2021 data released 2023 —
//   more granular but older than the city figure above; county and city
//   numbers don't perfectly reconcile since they're from different report years.
// - Homeless count: HUD Point-in-Time Count, MI-508 CoC (Lansing/East Lansing/
//   Ingham County), night of 1/28/2025 — capitalregionhousing.org
// - Utility rate increases: Lansing Board of Water & Light, approved Aug 2024,
//   residential rates effective Oct 1, 2025 — lbwl.com / WKAR
export const ALICE_SNAPSHOT = {
  lansingAlicePct: 50,
  lansingAlicePctYear: 2023,
  inghamPovertyPct: 17,
  inghamAlicePct: 24,
  inghamCombinedPct: 41,
  inghamYear: 2021,
  homelessCount: 643,
  homelessChronicCount: 104,
  homelessCountDate: "2025-01-28",
  utilityElectricIncreasePct: 6.8,
  utilityWaterIncreasePct: 9.2,
  utilityIncreaseEffective: "2025-10-01",
};
