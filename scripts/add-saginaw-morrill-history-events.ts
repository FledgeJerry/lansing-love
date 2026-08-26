// Adds the Treaty of Saginaw (1819) and Michigan Agricultural College /
// Morrill Act (1855-1862) as HistoryEvent entries, so /history's Timeline
// and Map cover the same pre-founding material Case 0 already covers in
// BoardCaseStudy benefit/cost form. Positioned chronologically before the
// existing Biddle City event (1835) — confirmed already present in the DB.
//
// Content adapted from Case 0's own sourced BoardCaseStudy text (already
// verified/cited there), not fabricated fresh. Entities (Anishinaabeg,
// Saginaw Band of Chippewa, MSU/Michigan Agricultural College, Bingham,
// Morrill) already exist from the Case 0 build — linked here via EntityEvent.
// Run: npx tsx scripts/add-saginaw-morrill-history-events.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const entities = await prisma.entity.findMany({
    where: { name: { in: [
      "Anishinaabeg — Three Fires Confederacy",
      "Saginaw Band of Chippewa",
      "Michigan State University / Michigan Agricultural College",
      "Governor Kinsley Bingham",
      "Justin Morrill",
    ] } },
    select: { id: true, name: true },
  });
  const byName = Object.fromEntries(entities.map((e) => [e.name, e.id]));

  // ── Treaty of Saginaw (1819) ─────────────────────────────────────────────
  const existingTreaty = await prisma.historyEvent.findFirst({ where: { title: { contains: "Treaty of Saginaw" } } });
  let treatyEvent = existingTreaty;
  if (existingTreaty) {
    console.log("Treaty of Saginaw event already exists, skipping creation.");
  } else {
    treatyEvent = await prisma.historyEvent.create({
      data: {
        title: "Treaty of Saginaw cedes Anishinaabe land — the region that becomes Lansing opens to settlement",
        description: "The land that became Lansing, East Lansing, and the surrounding region — including what is now Michigan State University's campus — entered U.S. federal control through the 1819 Treaty of Saginaw, negotiated with the Anishinaabeg (Three Fires Confederacy: Ojibwe, Odawa, Potawatomi) and the Saginaw Band of Chippewa specifically named in the treaty. Michigan State University's own current land acknowledgment materials state plainly that the treaty was negotiated \"under coercive or violent circumstances,\" and that \"settler and Indigenous signatories understood the terms of the treaties in starkly different terms.\" An Anishinaabe \"Indian Encampment\" is documented on university archive maps as still present just south of the Red Cedar River when the first MSU classes were held in 1857 — displacement was visibly ongoing on the same ground, not a distant historical abstraction. This land became the basis for state formation, township organization, and eventually every institution documented in this project.",
        eventType: "civic",
        eventDate: new Date("1819-09-24"),
        datePrecision: "day",
        era: "colonial",
        significance: 5,
        timelineVisible: true,
        mapVisible: false,
        sourceTier: "S",
        sourceNote: "MSU American Indian and Indigenous Studies Program (aiis.msu.edu); MSU Native American Institute (nai.msu.edu)",
        domains: ["governance", "housing"],
        familyStory: false,
        isPublic: true,
      },
    });
    console.log(`Created: ${treatyEvent.title}`);
  }

  if (treatyEvent && byName["Anishinaabeg — Three Fires Confederacy"] && byName["Saginaw Band of Chippewa"]) {
    await prisma.entityEvent.createMany({
      data: [
        { entityId: byName["Anishinaabeg — Three Fires Confederacy"], eventId: treatyEvent.id, role: "ceding party" },
        { entityId: byName["Saginaw Band of Chippewa"], eventId: treatyEvent.id, role: "named signatory" },
      ],
      skipDuplicates: true,
    });
  }

  // ── Michigan Agricultural College / Morrill Act (1855-1862) ─────────────
  const existingMAC = await prisma.historyEvent.findFirst({ where: { title: { contains: "Agricultural College" } } });
  let macEvent = existingMAC;
  if (existingMAC) {
    console.log("Michigan Agricultural College event already exists, skipping creation.");
  } else {
    macEvent = await prisma.historyEvent.create({
      data: {
        title: "Michigan Agricultural College founded, funded by land taken from 245 tribal nations under the 1862 Morrill Act",
        description: "In 1855, Governor Kinsley Bingham signed the bill creating the Agricultural College of the State of Michigan — the institution that became Michigan State University, and the direct model for the 1862 Morrill Act, the federal law that created the entire American land-grant university system. The Morrill Act funded these colleges with granted federal public land — or \"land scrip\" where a state lacked enough public land of its own — to be sold, with proceeds funding the colleges. Nationally, this drew from roughly 10.7 million acres taken from 245 tribal nations. Michigan's specific grant was drawn from parcels ceded in the 1819 Treaty of Saginaw and the 1836 treaties. Using the Act's own formula (30,000 acres per congressional seat, valued at $1.25/acre; Michigan held roughly 8 seats around 1862), Michigan's grant was worth approximately $300,000 in 1862 dollars — an illustrative order-of-magnitude figure pending direct archival confirmation, not a verified transaction record. In 2026 dollars, using an extended historical price index (in2013dollars.com, blended with official BLS CPI-U data from 1913 forward), that's approximately $9.9 million — the estimated value of land transferred without the consent of the nations it was taken from, to fund the founding of what is now a multi-billion-dollar public research university two miles from the State Capitol.",
        eventType: "civic",
        eventDate: new Date("1855-01-01"),
        eventDateEnd: new Date("1862-07-02"),
        datePrecision: "year",
        era: "founding",
        significance: 4,
        timelineVisible: true,
        mapVisible: true,
        address: "426 Auditorium Rd",
        city: "East Lansing",
        state: "MI",
        lat: 42.702379,
        lng: -84.480387,
        sourceTier: "S",
        sourceNote: "MSU American Indian and Indigenous Studies Program (aiis.msu.edu); National Archives, Morrill Act Public Law 37-108, July 2, 1862; MSU Today, \"Land-Grant Roots\" (2018)",
        domains: ["governance", "education"],
        familyStory: false,
        isPublic: true,
      },
    });
    console.log(`Created: ${macEvent.title}`);
  }

  if (macEvent && byName["Michigan State University / Michigan Agricultural College"] && byName["Governor Kinsley Bingham"] && byName["Justin Morrill"]) {
    await prisma.entityEvent.createMany({
      data: [
        { entityId: byName["Michigan State University / Michigan Agricultural College"], eventId: macEvent.id, role: "institution founded" },
        { entityId: byName["Governor Kinsley Bingham"], eventId: macEvent.id, role: "signed founding bill" },
        { entityId: byName["Justin Morrill"], eventId: macEvent.id, role: "authored the 1862 federal act" },
      ],
      skipDuplicates: true,
    });
  }

  const total = await prisma.historyEvent.count();
  console.log(`\nTotal HistoryEvents: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
