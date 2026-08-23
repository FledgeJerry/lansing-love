// Adds the new entities named in Case 0 ("The Land Before the Cases") and Case 12
// (Deep Green / data center moratorium), plus a documented-but-uncounted ledger line
// for Case 10's $800M UM-Sparrow pledge (see the categorization note below).
// Source: entities.md and lansing-full-accounting-MASTER.md (2026-08-23 updates).
// Coordinates from OpenStreetMap Nominatim, geoSource "geocoded" unless noted.
// Run: npx tsx scripts/add-case0-case12-entities.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function upsertEntity(data: Parameters<typeof prisma.entity.create>[0]["data"]) {
  const existing = await prisma.entity.findFirst({ where: { name: data.name } });
  if (existing) {
    console.log(`Skip (exists): ${data.name}`);
    return existing;
  }
  const created = await prisma.entity.create({ data });
  console.log(`Created entity: ${created.name}`);
  return created;
}

async function main() {
  // ── Case 0 ──────────────────────────────────────────────────────────────
  await upsertEntity({
    entityType: "organization",
    name: "Anishinaabeg — Three Fires Confederacy",
    altNames: ["Ojibwe, Odawa, and Potawatomi peoples"],
    description: "Original inhabitants of the land ceded via the 1819 Treaty of Saginaw and 1836 treaties. No institutional address — listed as the central party whose land and consent this case concerns.",
    mapPin: false,
    domains: ["governance", "housing"],
    sourceTier: "S",
    sourceNote: "MSU American Indian and Indigenous Studies Program (aiis.msu.edu)",
    bookChapter: null,
  });

  await upsertEntity({
    entityType: "organization",
    name: "Saginaw Band of Chippewa",
    altNames: [],
    description: "Specifically named party to the 1819 Treaty of Saginaw.",
    mapPin: false,
    domains: ["governance"],
    sourceTier: "S",
    sourceNote: "MSU American Indian and Indigenous Studies Program (aiis.msu.edu)",
  });

  await upsertEntity({
    entityType: "institution",
    name: "Michigan State University / Michigan Agricultural College",
    altNames: ["Michigan Agricultural College", "MSU"],
    description: "Founded 1855; land-grant beneficiary of the 1862 Morrill Act, funded by land taken via the 1819/1836 treaty cessions. Source of this project's own land-acknowledgment research.",
    address: "426 Auditorium Rd",
    city: "East Lansing",
    state: "MI",
    zip: "48824",
    lat: 42.702379,
    lng: -84.480387,
    geoSource: "geocoded",
    mapPin: true,
    domains: ["education", "governance"],
    sourceTier: "S",
    sourceNote: "MSU American Indian and Indigenous Studies Program (aiis.msu.edu); MSU Today, \"Land-Grant Roots\" (2018)",
  });

  await upsertEntity({
    entityType: "person",
    name: "Governor Kinsley Bingham",
    altNames: [],
    description: "Signed the 1855 bill creating Michigan Agricultural College.",
    mapPin: false,
    domains: ["governance", "education"],
    sourceTier: "S",
    sourceNote: "MSU Today, \"Land-Grant Roots\" (2018)",
  });

  await upsertEntity({
    entityType: "person",
    name: "Justin Morrill",
    altNames: [],
    description: "Vermont congressman; author of the 1862 Morrill Act, modeled on Michigan Agricultural College.",
    mapPin: false,
    domains: ["governance", "education"],
    sourceTier: "S",
    sourceNote: "National Archives — Morrill Act, Public Law 37-108, July 2, 1862",
  });

  // ── Case 12 ─────────────────────────────────────────────────────────────
  await upsertEntity({
    entityType: "person",
    name: "Jeremy Garza",
    altNames: [],
    description: "At-large City Council; Committee on Development and Planning chair; VP, UA Plumbers and Pipefitters Local 333; lone \"no\" vote on the data center moratorium.",
    address: "124 W. Michigan Ave",
    city: "Lansing",
    state: "MI",
    zip: "48933",
    lat: 42.7340573,
    lng: -84.5534370,
    geoSource: "manual",
    mapPin: true,
    domains: ["governance"],
    sourceTier: "RC",
    sourceNote: "Institutional office address (Lansing City Hall) — Jeremy Garza's personal address is not used per this project's standing rule.",
  });

  await upsertEntity({
    entityType: "organization",
    name: "Deep Green",
    altNames: [],
    description: "UK-based data center developer; withdrew a $120M downtown Lansing proposal in April 2026.",
    mapPin: false,
    domains: ["technology", "energy"],
    sourceTier: "RC",
    sourceNote: "Not yet researched (UK-based, no known Lansing office)",
  });

  await upsertEntity({
    entityType: "organization",
    name: "UA Plumbers and Pipefitters Local 333",
    altNames: ["Local 333"],
    description: "Union that publicly backed the Deep Green project; Garza is VP.",
    address: "5405 S. Martin Luther King Jr. Blvd",
    city: "Lansing",
    state: "MI",
    zip: "48911",
    lat: 42.678673,
    lng: -84.571775,
    geoSource: "geocoded",
    mapPin: true,
    domains: ["labor", "energy"],
    sourceTier: "RC",
  });

  await upsertEntity({
    entityType: "organization",
    name: "Bloom Energy",
    altNames: [],
    description: "Fuel-cell manufacturer; national Oracle partnership (up to 2.8 GW, April 2026). No confirmed Michigan-specific deployment as of this writing — flagged as a risk to monitor, not a confirmed Lansing fact.",
    address: "4353 N. First St",
    city: "San Jose",
    state: "CA",
    zip: "95134",
    lat: 37.397325,
    lng: -121.936281,
    geoSource: "approximate",
    mapPin: true,
    domains: ["energy", "technology"],
    sourceTier: "RC",
  });

  await upsertEntity({
    entityType: "organization",
    name: "Oracle",
    altNames: [],
    description: "Tenant behind the Saline Township Stargate project; separately holds a national fuel-cell master agreement with Bloom Energy.",
    address: "2300 Oracle Way",
    city: "Austin",
    state: "TX",
    zip: "78741",
    lat: 30.243505,
    lng: -97.721831,
    geoSource: "geocoded",
    mapPin: true,
    domains: ["technology", "energy"],
    sourceTier: "RC",
  });

  await upsertEntity({
    entityType: "institution",
    name: "Michigan Public Service Commission (MPSC)",
    altNames: ["MPSC"],
    description: "State regulator approving DTE's Saline Township Stargate contracts (3-0, Dec. 18, 2025); regulates DTE and Consumers Energy rates statewide. Notably headquartered in the same city this project otherwise tracks.",
    address: "6545 Mercantile Way",
    city: "Lansing",
    state: "MI",
    zip: "48911",
    lat: 42.663881,
    lng: -84.535228,
    geoSource: "geocoded",
    mapPin: true,
    domains: ["energy", "governance"],
    sourceTier: "RC",
    sourceNote: "Geocoded by name (OSM) to 6545 Mercantile Way — differs from the 7109 W. Saginaw Hwy address in entities.md; flagged for verification, see feedback doc.",
  });

  await upsertEntity({
    entityType: "organization",
    name: "DTE Energy",
    altNames: [],
    description: "Utility supplying the Saline Township Stargate data center (1.4 GW, 19-year contract); CEO Joi Harris has stated additional load beyond 1.4 GW may require new gas generation.",
    address: "One Energy Plaza (Walker Cisler Building)",
    city: "Detroit",
    state: "MI",
    zip: "48226",
    lat: 42.333619,
    lng: -83.056958,
    geoSource: "geocoded",
    mapPin: true,
    domains: ["energy"],
    sourceTier: "RC",
  });

  await upsertEntity({
    entityType: "organization",
    name: "Consumers Energy / CMS Energy",
    altNames: ["CMS Energy"],
    description: "Utility with a separate, large data-center pipeline (9 GW total reported mid-2026); no confirmed Lansing-area site yet — flagged to monitor.",
    address: "One Energy Plaza",
    city: "Jackson",
    state: "MI",
    zip: "49201",
    lat: 42.246675,
    lng: -84.402289,
    geoSource: "geocoded",
    mapPin: true,
    domains: ["energy"],
    sourceTier: "RC",
  });

  await upsertEntity({
    entityType: "property",
    name: "Deep Green proposed site",
    altNames: [],
    description: "Corner of Kalamazoo St and Cedar St, Stadium District, Lansing — city-owned parking land. Proposal withdrawn April 2026.",
    address: "Kalamazoo St & S. Cedar St (Stadium District)",
    city: "Lansing",
    state: "MI",
    lat: 42.733057,
    lng: -84.545668,
    geoSource: "approximate",
    mapPin: true,
    domains: ["technology", "governance"],
    sourceTier: "RC",
    sourceNote: "Approximate — Stadium District centroid; exact parcel intersection did not resolve via geocoder.",
  });

  // ── Ledger note: Case 10's $800M UM-Sparrow pledge ─────────────────────
  // Recorded for completeness, but NOT marked isPublicCost or isPrivateGain:
  // this is UM's own capital investment INTO Sparrow, which Case 10's own prose
  // lists under "What the community genuinely received," not "what it cost."
  // The master doc's Cumulative Ledger table sums it into "documented socialized
  // costs" anyway — see the feedback doc for why that looks like a category error
  // worth Jerry's call before it's summed that way anywhere public.
  const existingPledge = await prisma.dollarFlow.findFirst({ where: { description: { contains: "UM-Sparrow capital pledge" } } });
  if (!existingPledge) {
    await prisma.dollarFlow.create({
      data: {
        description: "UM-Sparrow capital pledge (2023, 8-year)",
        flowType: "public_investment",
        amountCents: BigInt(80000000000),
        flowDate: new Date("2023-01-01"),
        flowDateEnd: new Date("2031-01-01"),
        isPublicCost: false,
        isPrivateGain: false,
        sourceTier: "RC",
        sourceNote: "UM's own committed capital investment into Sparrow — not a cost borne by the public, and not counted in the Accounting tab's public-cost total. Recorded for completeness only.",
        isPublic: true,
      },
    });
    console.log("Created dollar flow: UM-Sparrow capital pledge (uncounted, isPublicCost=false)");
  } else {
    console.log("Skip (exists): UM-Sparrow capital pledge");
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
