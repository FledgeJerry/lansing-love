// Adds the remaining missing civic/legal/corporate events (1958-2026) from
// docs/source-timeline.md, per Jerry's default-include instruction
// (2026-08-27). Content adapted from the sandbox doc's own text.
// The 2009 "framework clicks" entry is intentionally marked approximate —
// the source doc itself says "the exact moment is Jerry's to place."
// The 1982 "Right to Work seeds planted" entry and the Pleasant Lake family
// story are intentionally excluded — too vague to date honestly; flagged
// back to Jerry rather than guessed.
// Run: npx tsx scripts/add-remaining-civic-legal-events.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

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
  await addEvent({
    title: "I-496 route planned through the Black neighborhood",
    description: "The city's 1958 Comprehensive Master Plan identifies the route for what becomes I-496 — directly through the St. Joseph–Main Street corridor, the neighborhood that grew up around the auto plants, including the streets where Norris Grocery stood and where Lucy Norris lived for 44 years. The decision is made by state highway planners; the neighborhood in its path has no binding council, no veto, no right of first refusal. Construction begins in 1963 (see that event).",
    eventType: "civic", eventDate: new Date("1958-01-01"), datePrecision: "year", era: "highway", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["housing", "governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "North District annexed",
    description: "A 4.5-square-mile area of northern Delhi Township votes to join Lansing, driven by the need for Lansing School District access. After annexation, Lansing absorbs responsibility for I-96 construction costs through the area. No neighborhood council created.",
    eventType: "civic", eventDate: new Date("1960-01-01"), datePrecision: "year", era: "highway", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "I-496 fully opens",
    description: "Seven years after construction began, the final section between Logan Street and US 127 opens. The freeway is complete. The neighborhood — 840+ homes and businesses, 600+ families, nearly all Black — is gone. The highway is named the R.E. Olds Freeway, after the man whose plant generated the jobs that built the neighborhood the highway just destroyed.",
    eventType: "civic", eventDate: new Date("1970-12-18"), datePrecision: "day", era: "highway", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["housing", "governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "The framework clicks: Ostrom, Mondragon, polycentric governance",
    description: "At some point in the Dubai years — the source material itself notes the exact moment is Jerry's to place, so this date is approximate — the intellectual framework clicks: Elinor Ostrom and the Bloomington School, the Mondragon cooperative model, ICA cooperative principles, community wealth building, the Cleveland and Preston models. The thing Jerry has been watching his whole life — the machine that ate the grocery store, the highway, the housing commission, the Chamber PAC — has a name: polycentric governance. Multiple centers of power, cooperative ownership, binding community authority, decisions made by the people who live with their consequences.",
    eventType: "family", eventDate: new Date("2009-01-01"), datePrecision: "approximate", era: "repackaging", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["governance"], familyStory: true, isPublic: true,
  }, [{ name: "Jerry Norris", role: "arrived at the framework" }]);

  await addEvent({
    title: "Right to Work passes in Lansing",
    description: "The Michigan legislature passes Right to Work in a lame-duck session; thousands of protesters fill the Capitol building. The union Lester Washburn built in 1937 — through a sit-down strike at REO, through the Lansing Labor Holiday, through 12,000 people blocking downtown streets with 18-wheelers — is legally weakened in Lansing 75 years after the building where the governor signs the bill was surrounded by those same 12,000 people.",
    eventType: "political", eventDate: new Date("2012-12-01"), datePrecision: "month", era: "current", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["labor", "governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Rotary Park opens; City Market closes",
    description: "The privately funded riverfront park opens — Delta Dental, Auto-Owners, the Rotary Club, corporate donors for talent retention; the beach cannot be used for swimming due to E. coli. The same year, the WPA-built City Market closes after 81 years — a public food commons, built by government workers during the Depression, starved out by big-box retail. No cooperative transition, no community land trust. The building goes dark.",
    eventType: "civic", eventDate: new Date("2019-01-01"), datePrecision: "year", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["housing", "governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Detroit Rising signs City Market lease with purchase option",
    description: "The city leases the former City Market building to Detroit Rising Development. A purchase option is written into the lease at signing, with no public discussion of that clause and no independent reappraisal requirement built in. $4.2 million in private investment converts the public food commons into the Lansing Shuffle, a shuffleboard bar. By 2026, when the option is exercised, the capital is sunk and reversal looks irrational — the moment to stop it passes quietly, years before anyone gets to vote on it.",
    eventType: "civic", eventDate: new Date("2021-01-01"), datePrecision: "year", era: "current", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["housing", "governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "UM Health acquires Sparrow; nurses organize",
    description: "University of Michigan Health acquires Sparrow Health System in Lansing. Within two years, 2,000 nurses and caregivers vote 98.7% to authorize a strike; federal unfair labor practice charges are filed. The union ratifies a new contract in January 2025, 95% approval. In January 2026, 213 advanced practice providers vote 86% to unionize — the same capital-versus-labor dynamic, the shop floor organizing itself again in Lansing, 88 years after the Lansing Labor Holiday.",
    eventType: "civic", eventDate: new Date("2023-01-01"), datePrecision: "year", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["healthcare", "labor"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "$1M federal grant awarded to study capping I-496",
    description: "Lansing is awarded a $1 million federal grant to develop a plan to cap portions of I-496 between MLK Jr. Boulevard and Walnut Street. The grant does not cover construction costs. Sixty-two years after construction began on the highway that displaced 600 families, the government funds a study of whether to cover it.",
    eventType: "civic", eventDate: new Date("2025-01-01"), datePrecision: "month", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["housing", "governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "AF Group sold to Enstar, backed by Sixth Street",
    description: "Blue Cross Blue Shield of Michigan announces the sale of AF Group to Enstar Group, backed by Sixth Street, a global investment firm headquartered in Bermuda. The full arc: Michigan public institution (1912) → Michigan private insurer (1990) → global investment vehicle (2026) — 114 years from public creation to international financial asset.",
    eventType: "financial", eventDate: new Date("2026-02-01"), datePrecision: "month", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  });

  // ── Legal/corporate ───────────────────────────────────────────────────
  await addEvent({
    title: "Capital City Wrecking Company founded",
    description: "Michigan LARA records (ID #800031437): Capitol City Wrecking Company founded September 1, 1928. Corporate name changes: Capitol City Wrecking Company → Capitol City Lumber Co. → Hayhoe, Inc. → Capitol City Home Centers, Inc. Dissolved August 28, 2000, after a final report that year. Registered office: 1600 Boston Blvd, Lansing MI 48910 (REO Town). 72 years of operation — the company the sheriff tried to crush during the 1937 Lansing Labor Holiday operated as a going concern through demolition, lumber, and home improvement until the big-box era ended it.",
    eventType: "financial", eventDate: new Date("1928-09-01"), eventDateEnd: new Date("2000-08-28"), datePrecision: "day", era: "labor", significance: 2,
    timelineVisible: true, mapVisible: false, address: "1600 Boston Blvd", city: "Lansing", state: "MI",
    sourceTier: "S", sourceNote: "Michigan LARA corporate record #800031437; Three Rivers Historical Scrapbook Vol. 1", domains: ["labor"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Bolt v. City of Lansing — Michigan Supreme Court",
    description: "Bolt v. City of Lansing, 459 Mich. 152 (1998): Lansing's stormwater service charge — intended to fund the $176M combined sewer separation required by the Clean Water Act — is ruled an unconstitutional tax requiring voter approval. Establishes a three-part test for valid user fees: regulatory purpose, proportionate to costs, voluntary. The Lansing Regional Chamber of Commerce filed the amicus brief for the challenging taxpayer, against the city's ability to fund public stormwater infrastructure — the same Chamber whose members' development patterns helped create the runoff problem. The ruling remains controlling Michigan law today; $50M in public remediation follows.",
    eventType: "legal", eventDate: new Date("1998-12-28"), datePrecision: "day", era: "repackaging", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", sourceNote: "459 Mich. 152", domains: ["governance", "environment"], familyStory: false, isPublic: true,
  });

  // ── July 27, 2026 session addition ──────────────────────────────────────
  await addEvent({
    title: "Michigan Stories event at The Fledge",
    description: "Jerry was scheduled to tell the water/Pleasant Lake/Line 5 story at Michigan Stories at The Fledge. He didn't tell it — the room organically themed around homelessness, so Jerry told the story of the warming shelter being shut down by the city instead. The water story remains ready for a future telling.",
    eventType: "family", eventDate: new Date("2026-07-27"), datePrecision: "day", era: "current", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing"], familyStory: true, isPublic: true,
  }, [{ name: "Jerry Norris", role: "storyteller" }]);

  console.log("\nDone.");
  console.log("Intentionally NOT added (flagged, not guessed):");
  console.log("- 1982 'Right to Work seeds planted' — too vague to date; the real 2012 passage is already added above.");
  console.log("- Pleasant Lake / Grandma Brett family story — no date given anywhere in the source beyond 'as a child'.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
