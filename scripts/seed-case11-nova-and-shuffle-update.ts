// Seed script — Case 11 (NOVA Lansing Housing Initiative / ModPods) + Case 6 (Lansing Shuffle) outcome update
// Source: lansing-full-accounting-MASTER.md, entities.md (2026-08-22 rebuild)
// Run: npx tsx scripts/seed-case11-nova-and-shuffle-update.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding Case 11 (NOVA) + Case 6 (Shuffle) update…");

  // ── LOOK UP EXISTING ENTITIES WE NEED TO REFERENCE ─────────────────────
  const existing = await prisma.entity.findMany({
    where: { name: { in: ["Ryan Kost", "Detroit Rising Development", "Ingham Medical / McLaren — closed"] } },
  });
  const existingByName = Object.fromEntries(existing.map((r) => [r.name, r.id]));

  const existingEvents = await prisma.historyEvent.findMany({
    where: { title: "Lansing Shuffle sale referred to August 2026 ballot" },
  });
  const shuffleReferralEventId = existingEvents[0]?.id;

  // ── NEW PEOPLE ───────────────────────────────────────────────────────────
  const pRows = await prisma.entity.createManyAndReturn({ data: [
    { entityType: "person", name: "Kimberly Coleman", description: "Director, Human Relations & Community Services (HRCS), Feb. 2020 – Feb. 13, 2026. Led NOVA/ModPod planning from its Aug. 2025 start. Resigned mid-project (Mayor's office cited personal reasons, no wrongdoing reported) but was retained specifically as NOVA project coordinator in a non-director capacity — an unusual structure. Defended DRMM's sole-bidder selection by citing the organization's roughly 115-year institutional history managing unhoused populations (paraphrased, not a direct quote).", city: "Lansing", state: "MI", sourceTier: "RC", sourceNote: "CBS News Detroit; City of Lansing NOVA public comment doc; Jerry Norris paraphrase of DRMM defense", domains: ["housing", "governance"], timelineEntry: true },
    { entityType: "person", name: "Delvata Moses", description: "Deputy Director, HRCS; became interim HRCS Director when Kimberly Coleman resigned Feb. 2026 (Coleman was retained separately as NOVA coordinator).", city: "Lansing", state: "MI", sourceTier: "RC", sourceNote: "City of Lansing HRCS org structure", domains: ["housing", "governance"] },
    { entityType: "person", name: "Joan Jackson Johnson", description: "Prior HRCS Director, retired Feb. 2020 amid a HUD audit finding the department had awarded funds to charities connected to her without proper disclosure. Noted as context/contrast to Coleman's later departure, not an equivalent situation — no comparable finding has been reported against Coleman.", city: "Lansing", state: "MI", sourceTier: "RC", sourceNote: "HUD OIG audit records", domains: ["housing", "governance"] },
    { entityType: "person", name: "Chad Audi", description: "President/CEO, Detroit Rescue Mission Ministries (DRMM), the sole bidder selected to run NOVA/ModPod operations and case management.", city: "Detroit", state: "MI", sourceTier: "RC", sourceNote: "DRMM organizational records", domains: ["housing"] },
    { entityType: "person", name: "Dr. Deyanira Nevarez Martinez", description: "Lansing City Council Ward 2 (contains the NOVA site); MSU professor. Calculated that the original $645,000 pod purchase alone could have covered a full year of market-rate rent for every unhoused person in Lansing, and warned that transitional housing only works if there is a funded 'next step' for residents to move to — which NOVA has not publicly quantified or funded.", city: "Lansing", state: "MI", sourceTier: "RC", sourceNote: "User collaborator notes; not yet independently verified against a direct council-meeting citation", domains: ["housing", "governance"] },
    { entityType: "person", name: "Jon Hartzell", description: "Co-owner/operator, Detroit Rising Development; runs the Lansing Shuffle. After voters rejected the Aug. 4, 2026 sale ballot question 53–47, said he intends to push to put the sale back on a future ballot, framing the loss as a narrative problem to be solved through 'relationship building' rather than a signal about the price or process.", city: "Lansing", state: "MI", sourceTier: "RC", sourceNote: "Lansing City Pulse Lansing Shuffle lease/ballot reporting", domains: ["food", "governance"] },
  ] });
  const p2 = Object.fromEntries(pRows.map((r) => [r.name, r.id]));
  console.log(`  ${pRows.length} people`);

  // ── NEW ORGANIZATIONS ──────────────────────────────────────────────────
  const oRows = await prisma.entity.createManyAndReturn({ data: [
    { entityType: "organization", name: "Human Relations & Community Services (HRCS)", altNames: ["HRCS"], description: "City of Lansing department running the NOVA/ModPod initiative and homeless services coordination. Working on NOVA since Aug. 2025. Lost its director mid-project (Kimberly Coleman resigned Feb. 2026).", city: "Lansing", state: "MI", sourceTier: "RC", sourceNote: "City of Lansing NOVA public comment document, Dec. 18, 2025", domains: ["housing", "governance"] },
    { entityType: "organization", name: "Detroit Rescue Mission Ministries", altNames: ["DRMM"], description: "Detroit-based nonprofit, founded 1909 (~117 years of institutional history as of 2026). Sole bidder selected for the NOVA/ModPod operations and case management contract; already runs Lansing's emergency winter warming center.", city: "Detroit", state: "MI", activeStart: new Date("1909-01-01"), sourceTier: "RC", sourceNote: "DRMM organizational history (drmm.org)", sourceUrl: "https://www.drmm.org", domains: ["housing"] },
  ] });
  const o2 = Object.fromEntries(oRows.map((r) => [r.name, r.id]));
  console.log(`  ${oRows.length} organizations`);

  // ── NEW PROPERTY ────────────────────────────────────────────────────────
  const prRows = await prisma.entity.createManyAndReturn({ data: [
    { entityType: "property", name: "NOVA / ModPod site — 5303 S. Cedar St", description: "Ingham County Human Services Building parking lot. Recommended Jan. 2026 after the city screened 48 properties down to a shortlist and held public meetings (Letts Community Center, Foster Community Center, Nov.–Dec. 2025); parks were removed from consideration after neighborhood opposition. Site for 50 modular pods housing ~66 people, plus a resource center (showers, computer lab, case management via DRMM).", address: "5303 S Cedar St", city: "Lansing", state: "MI", zip: "48910", lat: 42.6790, lng: -84.5490, geoSource: "approximate", activeStart: new Date("2026-01-01"), sourceTier: "RC", sourceNote: "WLNS/WILX NOVA site-selection reporting, 2025–2026", domains: ["housing"], timelineEntry: true },
  ] });
  const pr2 = Object.fromEntries(prRows.map((r) => [r.name, r.id]));
  console.log(`  ${prRows.length} properties`);

  // ── NEW EVENTS ──────────────────────────────────────────────────────────
  const evRows = await prisma.historyEvent.createManyAndReturn({ data: [
    { title: "NOVA site selection — Ingham Co. Human Services lot recommended", description: "City screens 48 properties down to a shortlist; two appointed advisory boards (HRCS Advisory Board, Mayor's Neighborhood Advisory Board) hold public meetings before recommending the Ingham County Human Services Building parking lot (5303 S. Cedar St) — after parks were removed from consideration due to neighborhood opposition.", eventType: "civic", eventDate: new Date("2026-01-01"), datePrecision: "month", sourceTier: "RC", sourceNote: "WLNS/WILX NOVA site-selection reporting", domains: ["housing"], significance: 3, era: "current" },
    { title: "Kim Coleman resigns as HRCS Director mid-NOVA planning", description: "HRCS Director Kimberly Coleman announces her resignation effective Feb. 13, 2026 — roughly six months into NOVA's most consequential planning year, before construction began. Mayor Schor's office cites personal reasons; no wrongdoing reported. Coleman is retained specifically to keep coordinating NOVA in a non-director capacity; Deputy Director Delvata Moses becomes interim HRCS director for everything else — an unusual split of continuity.", eventType: "civic", eventDate: new Date("2026-02-02"), eventDateEnd: new Date("2026-02-13"), datePrecision: "day", sourceTier: "RC", sourceNote: "City of Lansing personnel announcement", domains: ["housing", "governance"], significance: 3, era: "current" },
    { title: "City Council approves $1.93M NOVA site/construction budget", description: "City Council approves $1,925,900 for NOVA site prep, construction, permitting, and facility costs (bathrooms, showers, laundry), with annual operating costs revised up to $952,335/year — neither figure includes the original $645,000 pod purchase. A separate April 2026 budget discussion had put the first-year all-in total closer to $2.9M; city officials said the figures 'are not directly comparable.' No single stable public number has existed for this project at any point.", eventType: "financial", eventDate: new Date("2026-07-01"), datePrecision: "month", sourceTier: "RC", sourceNote: "City Council budget records; WLNS reporting", domains: ["housing", "governance"], significance: 5, era: "current", dollarAmount: BigInt(192590000), dollarNote: "$1,925,900 site/construction + $952,335/yr operating approved" },
    { title: "NOVA community update meeting — Foster Community Center", description: "Public update meeting, 6:00–7:30pm. When asked what happens to residents after their 6-month-to-2-year stay, the answer given: a website landlords can register properties on. One HRCS Advisory Board member compares the transition to 'going off to college' — figuring out laundry, figuring out transportation. When asked directly, the full panel affirms housing is a human right. The stated value and the operational mechanism do not match.", eventType: "civic", eventDate: new Date("2026-08-18"), datePrecision: "day", sourceTier: "FM", sourceNote: "Jerry Norris, direct notes from the meeting", domains: ["housing"], significance: 4, era: "current" },
    { title: "Sample ModPod unit displayed in City Hall lobby", description: "A sample ModPod unit is placed on display in the City Hall lobby so residents can see what the units will look like before construction begins — over a year after planning started, with WLNS reporting 'no exact timeline for installation' as of this update.", eventType: "civic", eventDate: new Date("2026-08-01"), datePrecision: "month", sourceTier: "RC", sourceNote: "WLNS NOVA update reporting, Aug. 2026", domains: ["housing"], significance: 2, era: "current" },
    { title: "Voters reject Lansing Shuffle sale, 53–47", description: "Voters reject the ballot question asking whether the city could negotiate the sale of the former City Market / Lansing Shuffle property to Detroit Rising Development at $953,000. The Lansing Park Board had voted against recommending the sale go to the ballot at all; the Planning Commission voted in favor. City Council placed it on the ballot anyway, 6-1, with Ryan Kost as the lone dissent, citing the outdated 2018 appraisal and the financially unreachable buy-back clause. Detroit Rising co-owner Jon Hartzell says he intends to bring the sale back to a future ballot.", eventType: "financial", eventDate: new Date("2026-08-04"), datePrecision: "day", sourceTier: "S", sourceNote: "Certified Aug. 4, 2026 ballot results", domains: ["food", "governance"], significance: 5, era: "current" },
  ] });
  const ev2 = Object.fromEntries(evRows.map((r) => [r.title, r.id]));
  console.log(`  ${evRows.length} events`);

  // ── ENTITY–EVENT LINKS ─────────────────────────────────────────────────
  const eeLinks = [
    { entityId: o2["Human Relations & Community Services (HRCS)"], eventId: ev2["NOVA site selection — Ingham Co. Human Services lot recommended"], role: "organization" },
    { entityId: p2["Kimberly Coleman"], eventId: ev2["Kim Coleman resigns as HRCS Director mid-NOVA planning"], role: "director" },
    { entityId: p2["Delvata Moses"], eventId: ev2["Kim Coleman resigns as HRCS Director mid-NOVA planning"], role: "interim_director" },
    { entityId: o2["Detroit Rescue Mission Ministries"], eventId: ev2["City Council approves $1.93M NOVA site/construction budget"], role: "contractor" },
    { entityId: p2["Chad Audi"], eventId: ev2["City Council approves $1.93M NOVA site/construction budget"], role: "contractor" },
    { entityId: p2["Dr. Deyanira Nevarez Martinez"], eventId: ev2["City Council approves $1.93M NOVA site/construction budget"], role: "critic" },
    { entityId: p2["Kimberly Coleman"], eventId: ev2["NOVA community update meeting — Foster Community Center"], role: "panelist" },
    { entityId: p2["Jon Hartzell"], eventId: ev2["Voters reject Lansing Shuffle sale, 53–47"], role: "operator" },
    { entityId: existingByName["Ryan Kost"], eventId: ev2["Voters reject Lansing Shuffle sale, 53–47"], role: "dissenter" },
    { entityId: existingByName["Detroit Rising Development"], eventId: ev2["Voters reject Lansing Shuffle sale, 53–47"], role: "would_be_buyer" },
  ].filter((l) => l.entityId != null && l.eventId != null);

  await prisma.entityEvent.createMany({ data: eeLinks as { entityId: number; eventId: number; role: string }[], skipDuplicates: true });
  console.log(`  ${eeLinks.length} entity-event links`);

  // ── RELATIONSHIPS ──────────────────────────────────────────────────────
  const relData = [
    { fromEntityId: o2["Detroit Rescue Mission Ministries"], toEntityId: pr2["NOVA / ModPod site — 5303 S. Cedar St"], relationshipType: "contracted_by", description: "DRMM selected as sole bidder for NOVA operations & case management contract.", isConflict: false, weight: 4, sourceTier: "RC", sourceNote: "Sole-bidder selection — competitive process not independently verified" },
    { fromEntityId: p2["Chad Audi"], toEntityId: o2["Detroit Rescue Mission Ministries"], relationshipType: "employed_by", description: "Chad Audi is President/CEO of DRMM.", weight: 3, sourceTier: "RC" },
    { fromEntityId: p2["Kimberly Coleman"], toEntityId: o2["Human Relations & Community Services (HRCS)"], relationshipType: "employed_by", description: "Kimberly Coleman directed HRCS Feb. 2020–Feb. 2026; retained afterward as NOVA project coordinator.", weight: 4, sourceTier: "RC" },
    { fromEntityId: p2["Delvata Moses"], toEntityId: o2["Human Relations & Community Services (HRCS)"], relationshipType: "employed_by", description: "Delvata Moses became interim HRCS Director after Coleman's Feb. 2026 resignation.", weight: 3, sourceTier: "RC" },
    { fromEntityId: p2["Joan Jackson Johnson"], toEntityId: o2["Human Relations & Community Services (HRCS)"], relationshipType: "employed_by", description: "Joan Jackson Johnson, prior HRCS Director, retired Feb. 2020 amid a HUD audit finding undisclosed department funding to charities connected to her — context/contrast to Coleman's later departure, not an equivalent finding.", weight: 3, sourceTier: "RC" },
    { fromEntityId: p2["Jon Hartzell"], toEntityId: existingByName["Detroit Rising Development"], relationshipType: "employed_by", description: "Jon Hartzell co-owns/operates Detroit Rising Development, which runs the Lansing Shuffle.", weight: 3, sourceTier: "RC" },
    existingByName["Ingham Medical / McLaren — closed"] ? {
      fromEntityId: existingByName["Ingham Medical / McLaren — closed"],
      toEntityId: pr2["NOVA / ModPod site — 5303 S. Cedar St"],
      relationshipType: "alternative_considered",
      description: "UNVERIFIED — a Dec. 2025 public comment alleges McLaren offered its vacant Greenlawn hospital building to the city for free around 2021 (the same building now being demolished). If real, the city passed on a free existing building and has since spent an escalating multi-million-dollar sum building NOVA elsewhere. Needs direct confirmation with the city or McLaren before treating as fact.",
      isConflict: true,
      conflictNote: "Unverified — sourced to a single public comment, not a primary source",
      weight: 3,
      sourceTier: "RC",
      sourceNote: "City of Lansing NOVA public comment document, Dec. 18, 2025",
    } : null,
  ].filter((r): r is NonNullable<typeof r> => r != null && r.fromEntityId != null && r.toEntityId != null);

  await prisma.entityRelation.createMany({ data: relData as Parameters<typeof prisma.entityRelation.createMany>[0]["data"], skipDuplicates: true });
  console.log(`  ${relData.length} relationships`);

  // ── DOLLAR FLOWS ───────────────────────────────────────────────────────
  await prisma.dollarFlow.createMany({ data: [
    { description: "NOVA initial pod purchase (50 units)", flowType: "public_investment", amountCents: BigInt(64500000), flowDate: new Date("2025-08-01"), toEntityId: pr2["NOVA / ModPod site — 5303 S. Cedar St"], isPublicCost: true, isPrivateGain: false, sourceTier: "RC", sourceNote: "Below-market purchase — pods acquired after Kalamazoo's own project backed out" },
    { description: "NOVA site prep, construction & permitting", flowType: "public_investment", amountCents: BigInt(192590000), flowDate: new Date("2026-07-01"), toEntityId: pr2["NOVA / ModPod site — 5303 S. Cedar St"], eventId: ev2["City Council approves $1.93M NOVA site/construction budget"], isPublicCost: true, isPrivateGain: false, sourceTier: "RC", sourceNote: "City Council approved figure, July 2026" },
    { description: "NOVA projected annual operating cost", flowType: "public_cost", amountCents: BigInt(95233500), flowDate: new Date("2026-07-01"), flowDateEnd: new Date("2027-07-01"), toEntityId: pr2["NOVA / ModPod site — 5303 S. Cedar St"], eventId: ev2["City Council approves $1.93M NOVA site/construction budget"], isPublicCost: true, isPrivateGain: false, sourceTier: "RC", sourceNote: "$952,335/year projected, revised up from initial $750,000/year estimate" },
    { description: "Ingham County Housing Trust contribution to NOVA", flowType: "public_investment", amountCents: BigInt(60000000), flowDate: new Date("2026-01-01"), toEntityId: pr2["NOVA / ModPod site — 5303 S. Cedar St"], isPublicCost: true, isPrivateGain: false, sourceTier: "RC", sourceNote: "County-level cross-jurisdictional funding commitment via Ingham County Housing Trust" },
  ], skipDuplicates: true });
  console.log("  4 dollar flows");

  // ── UPDATE: Lansing Shuffle sale — mark as rejected, not a realized private gain ──
  const shuffleUpdate = await prisma.dollarFlow.updateMany({
    where: { description: "Lansing Shuffle proposed sale" },
    data: {
      description: "Lansing Shuffle proposed sale — rejected by voters",
      isPrivateGain: false,
      eventId: ev2["Voters reject Lansing Shuffle sale, 53–47"] ?? shuffleReferralEventId,
      sourceTier: "S",
      sourceNote: "Ballot question rejected 53%–47%, Aug. 4, 2026 — proposed sale never occurred, so no private gain was realized. Hartzell (Detroit Rising) has stated intent to bring it back to a future ballot.",
    },
  });
  console.log(`  ${shuffleUpdate.count} dollar flow(s) updated (Shuffle sale outcome)`);

  const [entityCount, eventCount, relCount, flowCount] = await Promise.all([
    prisma.entity.count(),
    prisma.historyEvent.count(),
    prisma.entityRelation.count(),
    prisma.dollarFlow.count(),
  ]);
  console.log(`\nSeed complete: ${entityCount} entities · ${eventCount} events · ${relCount} relationships · ${flowCount} dollar flows`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
