// Adds the Environmental Governors, Line 5, and property tax material from
// docs/source-timeline.md as discrete HistoryEvent rows, per Jerry's explicit
// list (2026-08-27) resolving the "reference material vs. dated events" scope
// question in favor of inclusion. Content adapted from the sandbox doc's own
// already-written text, not written fresh.
// Run: npx tsx scripts/add-governors-line5-property-tax-events.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function upsertEntity(data: Parameters<typeof prisma.entity.create>[0]["data"]) {
  const existing = await prisma.entity.findFirst({ where: { name: data.name } });
  if (existing) return existing;
  const created = await prisma.entity.create({ data });
  console.log(`Created entity: ${created.name}`);
  return created;
}

async function addEvent(data: Parameters<typeof prisma.historyEvent.create>[0]["data"], entityRoles: { name: string; role: string }[] = []) {
  const existing = await prisma.historyEvent.findFirst({ where: { title: data.title as string } });
  if (existing) { console.log(`Skip (exists): ${data.title}`); return existing; }
  const event = await prisma.historyEvent.create({ data });
  console.log(`Created: ${event.title}`);
  for (const er of entityRoles) {
    const entity = await prisma.entity.findFirst({ where: { name: er.name } });
    if (entity) await prisma.entityEvent.createMany({ data: [{ entityId: entity.id, eventId: event.id, role: er.role }], skipDuplicates: true });
  }
  return event;
}

async function main() {
  // ── Entities ──────────────────────────────────────────────────────────
  await upsertEntity({ entityType: "person", name: "William Milliken", description: "Michigan Governor, 1969–1983. Signed the Michigan Environmental Protection Act (1970); widely regarded as the state's most consequential environmental governor.", mapPin: false, domains: ["governance", "environment"], sourceTier: "S" });
  await upsertEntity({ entityType: "person", name: "John Engler", description: "Michigan Governor, 1991–2003. Systematically dismantled the environmental protection framework Milliken built — split DNR into two agencies, gutted DEQ funding/staffing, covered up the Dow Chemical dioxin contamination in the Tittabawassee River.", mapPin: false, domains: ["governance", "environment"], sourceTier: "S" });
  await upsertEntity({ entityType: "person", name: "Rick Snyder", description: "Michigan Governor, 2011–2019. Authorized the Flint Emergency Manager's 2014 water source switch to the Flint River, the direct trigger of the Flint water crisis.", mapPin: false, domains: ["governance", "environment"], sourceTier: "S" });
  await upsertEntity({ entityType: "person", name: "Gretchen Whitmer", description: "Michigan Governor, 2019–present. Revoked Enbridge's Line 5 easement (2020), signed the 100% Clean Energy law (2023), later approved the Line 5 tunnel permit and a voluntary (non-mandatory) data center pledge the same afternoon (July 15, 2026).", mapPin: false, domains: ["governance", "environment", "energy"], sourceTier: "S" });
  await upsertEntity({ entityType: "organization", name: "Enbridge", altNames: ["Lakehead Pipeline Company"], description: "Operator of Line 5, the Straits of Mackinac oil pipeline. Received the original 1953 easement without Tribal consultation; defied Michigan's 2021 shutdown order and continued operating.", mapPin: false, domains: ["environment", "energy"], sourceTier: "S" });

  // ── Environmental Governors + Line 5 ──────────────────────────────────
  await addEvent({
    title: "William Milliken becomes governor; signs the Michigan Environmental Protection Act",
    description: "William Milliken becomes Michigan Governor in 1969. On January 22, 1970, he issues a 20-point environmental policy plan and signs the Michigan Environmental Protection Act — any citizen can now sue to prevent pollution, impairment, or destruction of natural resources. Michigan becomes the first state to ban most uses of DDT. Milliken begins the Bottle Bill process, creates the Michigan Natural Resources Trust Fund, and convenes the first Great Lakes governors summit against water diversion. This is the infrastructure of environmental protection that Engler will spend 12 years tearing down.",
    eventType: "political", eventDate: new Date("1970-01-22"), datePrecision: "day", era: "deindustrial", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["environment", "governance"], familyStory: false, isPublic: true,
  }, [{ name: "William Milliken", role: "signed the act" }]);

  await addEvent({
    title: "John Engler becomes governor; begins 12-year dismantling of environmental protection",
    description: "John Engler becomes Michigan Governor in 1991. Over his 12 years in office, he systematically rolls back the environmental protection framework Milliken built: splits DNR into two agencies (MDNR and MDEQ) to reduce oversight capacity, guts DEQ revenue and staffing until illegal activity goes unchecked by 1996, and covers up Dow Chemical's dioxin contamination of the Tittabawassee River (80x the cleanup standard) through a sweetheart consent order later found illegal by a court. Creates the structural conditions for 27,000+ contaminated sites statewide and, a decade later, the Flint water crisis. His approach becomes the national Republican template for anti-environmental governance.",
    eventType: "political", eventDate: new Date("1991-01-01"), datePrecision: "year", era: "repackaging", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["environment", "governance"], familyStory: false, isPublic: true,
  }, [{ name: "John Engler", role: "governor" }]);

  await addEvent({
    title: "Rick Snyder becomes governor",
    description: "Rick Snyder becomes Michigan Governor in 2011. His administration will authorize the 2014 Flint Emergency Manager water switch that triggers the Flint water crisis, and sign lame-duck legislation making it harder for Michigan to protect its own water beyond federal minimums.",
    eventType: "political", eventDate: new Date("2011-01-01"), datePrecision: "year", era: "repackaging", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["environment", "governance"], familyStory: false, isPublic: true,
  }, [{ name: "Rick Snyder", role: "governor" }]);

  await addEvent({
    title: "Snyder authorizes Flint's water switch — direct trigger of the Flint water crisis",
    description: "Governor Snyder authorizes Flint's Emergency Manager to switch the city's water supply from the Detroit system to the Flint River as a cost-cutting measure, despite expert warnings the river is unsafe. The state insists the water is safe for 18 months while residents report illness and GM stops using it because it corrodes machinery. Children are lead-poisoned. The state later prevents Flint from switching back under the terms of a $7M loan from Snyder's administration.",
    eventType: "political", eventDate: new Date("2014-01-01"), datePrecision: "year", era: "repackaging", significance: 5,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["environment", "governance", "healthcare"], familyStory: false, isPublic: true,
  }, [{ name: "Rick Snyder", role: "authorized the switch" }]);

  await addEvent({
    title: "Gretchen Whitmer becomes governor",
    description: "Gretchen Whitmer becomes Michigan Governor in 2019. Restructures EGLE, leads on PFAS, and will later revoke Enbridge's Line 5 easement, sign the state's 100% Clean Energy law, and approve the Line 5 tunnel permit the same afternoon she announces a voluntary data center pledge.",
    eventType: "political", eventDate: new Date("2019-01-01"), datePrecision: "year", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["environment", "governance"], familyStory: false, isPublic: true,
  }, [{ name: "Gretchen Whitmer", role: "governor" }]);

  await addEvent({
    title: "Whitmer revokes Enbridge's Line 5 easement",
    description: "Governor Whitmer issues a Notice of Revocation and Termination of Easement to Enbridge, stating Line 5 poses \"an unacceptable risk of a catastrophic oil spill in the Great Lakes that could devastate our economy and way of life.\" Orders operations to cease no later than May 12, 2021. The pipeline had run since a 1953 easement granted without Tribal consultation; a 2018 anchor strike had already gouged it in three places with no shutdown.",
    eventType: "political", eventDate: new Date("2020-11-13"), datePrecision: "day", era: "current", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["environment", "energy"], familyStory: false, isPublic: true,
  }, [{ name: "Gretchen Whitmer", role: "issued the revocation" }, { name: "Enbridge", role: "subject of the order" }]);

  await addEvent({
    title: "Enbridge defies the Line 5 shutdown order",
    description: "The deadline Whitmer set for Line 5 to stop operating. An Enbridge executive sends a letter to Whitmer and the DNR stating the company will continue operating the pipeline while it pursues its tunnel project instead. The pipeline keeps pumping 23 million gallons per day through the Straits of Mackinac. The state ultimately drops its enforcement case; the pipeline is still running as of July 2026.",
    eventType: "political", eventDate: new Date("2021-05-12"), datePrecision: "day", era: "current", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["environment", "energy"], familyStory: false, isPublic: true,
  }, [{ name: "Enbridge", role: "defied the order" }, { name: "Gretchen Whitmer", role: "issued the original order" }]);

  await addEvent({
    title: "Whitmer signs Michigan's 100% Clean Energy law",
    description: "Signed at Detroit's Eastern Market. Michigan requires 50% renewable energy by 2030, 60% by 2035, and 100% clean energy by 2040 — projected to save households $145/year, create 160,000 jobs, and bring $8B in federal investment. Critical caveat: natural gas plants with carbon capture can continue operating past 2040, which environmental advocates call a loophole for DTE and Consumers Energy.",
    eventType: "political", eventDate: new Date("2023-11-28"), datePrecision: "day", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["environment", "energy"], familyStory: false, isPublic: true,
  }, [{ name: "Gretchen Whitmer", role: "signed the law" }]);

  const tunnelEvent = await addEvent({
    title: "EGLE approves the Line 5 tunnel permit — same afternoon as Whitmer's voluntary data center pledge",
    description: "Michigan's EGLE reissues the wetlands permit for Enbridge's Great Lakes Tunnel Project after a 16-month review; DNR issues a separate permit for impacts to rare plants and animals the same afternoon. 70,000 public comments were submitted, the majority opposing the permit. Tribal nations denounce the approval; EGLE acknowledges destruction of tribal ancestral remains is likely and requires a mitigation plan, which Bay Mills Indian Community President Whitney Gravelle calls \"false penitence.\" The same afternoon, Whitmer announces a 10-part voluntary (non-mandatory) pledge asking data center companies to bear their own costs, secure new power, and hire locally — Google and Oracle sign immediately; Sierra Club Michigan calls pledges \"not enough.\" Rep. Rashida Tlaib: \"Michigan's Governor ran on a campaign promise to shutdown Line 5. Remember that? After 70,000 comments opposing the permit, she greenlit oil in our Great Lakes.\" See the companion event on the same date for the data center pledge itself.",
    eventType: "political", eventDate: new Date("2026-07-15"), datePrecision: "day", era: "current", significance: 5,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["environment", "energy", "governance"], familyStory: false, isPublic: true,
  }, [{ name: "Enbridge", role: "permit recipient" }, { name: "Gretchen Whitmer", role: "same-day pledge announcement" }]);

  await addEvent({
    title: "Whitmer unveils voluntary data center pledge — same afternoon as the Line 5 tunnel permit approval",
    description: "Michigan Affordable and Responsible Growth Action Plan: a 10-part voluntary pledge asking data center companies to bear their own infrastructure costs, secure new power, protect water, and hire local workers. Google and Oracle sign immediately. Sierra Club Michigan: \"Pledges and promises are not enough. Michigan needs strong, enforceable data center regulations now.\" New York's governor signs a yearlong moratorium on data center development the same period; Whitmer declines to. Announced the same afternoon EGLE approved the Line 5 tunnel permit — see the companion event on that date.",
    eventType: "political", eventDate: new Date("2026-07-15"), datePrecision: "day", era: "current", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["environment", "energy", "governance"], familyStory: false, isPublic: true,
  }, [{ name: "Gretchen Whitmer", role: "announced the pledge" }]);
  void tunnelEvent;

  // ── Property tax ──────────────────────────────────────────────────────
  await addEvent({
    title: "Michigan voters approve Proposal A — the property tax uncapping mechanism",
    description: "Michigan voters approve Proposal A, establishing the taxable-value cap: taxable value is capped at 5% or CPI (whichever is lower) annually while the same owner holds a property, and uncaps to the current State Equalized Value (half of market value) when the property transfers. Applies to all property types, rental and owner-occupied alike. This is the single most load-bearing date underneath the property tax findings in Case 13 (Assessor/Board of Review) and elsewhere in the Full Accounting: long-term owners hold at capped values well below market, while new buyers and landlords uncap immediately at full market value — and for renters, that new full-rate tax bill passes through as rent with no cap protection of their own.",
    eventType: "legal", eventDate: new Date("1994-01-01"), datePrecision: "year", era: "repackaging", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance", "housing"], familyStory: false, isPublic: true,
  });

  console.log("\nDone. Millage renewal dates (2011/2016/2021) intentionally left for a follow-up pass — lower priority per Jerry's note.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
