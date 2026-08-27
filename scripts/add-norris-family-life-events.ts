// Adds the missing Norris family life events (1920-2011) from
// docs/source-timeline.md, per Jerry's default-include instruction
// (2026-08-27). Content adapted from the sandbox doc's own text.
// Run: npx tsx scripts/add-norris-family-life-events.ts

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
  // ── New entities ──────────────────────────────────────────────────────
  await upsertEntity({ entityType: "person", name: "Gregory Eaton", description: "Delivered groceries with young Monty Norris at Norris Grocery, 1327 Olds Ave, circa 1950-53. Went on to become a significant Lansing civic figure.", mapPin: false, domains: ["housing"], sourceTier: "FM" });
  await upsertEntity({ entityType: "person", name: "Raven Norris", description: "Daughter of Jerry and Shannon Norris. Studied genetics at MSU; went to work at Cedars-Sinai in Los Angeles. Fought Grand Ledge government alongside Jerry and Shannon for the right to raise chickens.", mapPin: false, domains: ["education"], sourceTier: "FM" });
  await upsertEntity({ entityType: "person", name: "Rain Norris", description: "Son of Jerry and Shannon Norris, born May 25, 2001 — the same date Kevin Jones died in 1999. The rebel skater of Grand Ledge; co-founded Yoor Mom Skateboards with Jerry around 2011.", mapPin: false, domains: ["education"], sourceTier: "FM" });

  // ── Family births ─────────────────────────────────────────────────────
  await addEvent({
    title: "Keith Norris born",
    description: "Richard Keith Norris is born in Lansing, son of Montie and Lucy (McEldowney) Norris — born into a city at the peak of its industrial confidence. REO and Oldsmobile are thriving; the UAW does not yet exist.",
    eventType: "family", eventDate: new Date("1920-11-29"), datePrecision: "day", era: "industrial_rise", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing"], familyStory: true, isPublic: true,
  }, [{ name: "Richard Keith Norris", role: "born" }]);

  await addEvent({
    title: "Thelma Arnold born, Boyne Falls",
    description: "Thelma E. Arnold is born in Boyne Falls, Michigan, to Jesse and Maude Arnold. Her family's roots run to Beaver Island — the Irish Gaelic fishing community, George T. Arnold, and the older story underneath it.",
    eventType: "family", eventDate: new Date("1923-09-06"), datePrecision: "day", era: "industrial_rise", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing"], familyStory: true, isPublic: true,
  }, [{ name: "Thelma Arnold Norris", role: "born" }]);

  await addEvent({
    title: "Old Everett Area annexed into Lansing",
    description: "The Old Everett Area on Lansing's Southside is annexed into the city. The boundary expands; no new governance node is created. Around this time, Keith Norris begins working the REO Olds factory floor.",
    eventType: "civic", eventDate: new Date("1948-01-01"), datePrecision: "year", era: "postwar", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  }, [{ name: "Richard Keith Norris", role: "joins REO Olds" }]);

  await addEvent({
    title: "Monty delivers groceries on Olds Avenue with Gregory Eaton",
    description: "Young Monty Norris — in elementary school, growing up on the Norris family's street — delivers groceries for Uncle Robert's store at 1327 Olds Avenue alongside his friend Gregory Eaton. Monty will later manage the state agency that acquires this street; Gregory Eaton will become a significant Lansing civic figure.",
    eventType: "family", eventDate: new Date("1950-01-01"), eventDateEnd: new Date("1953-12-31"), datePrecision: "approximate", era: "postwar", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing"], familyStory: true, isPublic: true,
  }, [{ name: "Monty L. Norris", role: "delivered groceries" }, { name: "Gregory Eaton", role: "delivered groceries" }]);

  // ── 1969-1984 ─────────────────────────────────────────────────────────
  await addEvent({
    title: "Divorce; family moves to Armstrong Street",
    description: "Jerry's parents divorce. Jerry's mother Margot moves the boys to a duplex on Armstrong Street; his father Monty moves to the Co-op Town Houses on Hughes Road and soon remarries Joina Combs, who becomes a significant, steady parent to Jerry and his brother.",
    eventType: "family", eventDate: new Date("1969-01-01"), eventDateEnd: new Date("1971-12-31"), datePrecision: "approximate", era: "highway", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing"], familyStory: true, isPublic: true,
  }, [{ name: "Monty L. Norris", role: "parent" }, { name: "Margot DeWeese Norris", role: "parent" }]);

  await addEvent({
    title: "Family moves to Julia Street",
    description: "The family moves to Julia Street. Jerry is approximately 5. The house is 30 feet from Kendon Elementary School. The Jones family lives between the Norrises and the Kendon playground — Kevin Jones is Jerry's neighbor. The neighborhood is working class, tight, built around the schools and the auto plants — recent history for a community shaped by I-496 displacement.",
    eventType: "family", eventDate: new Date("1971-01-01"), datePrecision: "year", era: "highway", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing"], familyStory: true, isPublic: true,
  }, [{ name: "Jerry Norris", role: "resident" }, { name: "Kevin Jones", role: "neighbor" }]);

  await addEvent({
    title: "Monty gives Jerry the instruction: \"Wrestle, get a scholarship, and study computer science.\"",
    description: "Monty Norris looks at his 6-year-old son and gives him the instruction that will define the next twelve years. It is 1972 — the personal computer does not yet exist as a consumer product, and the internet is a Defense Department experiment. Monty has watched the REO floor, the MDOT office, and the eminent domain files long enough to know the next economy will not be built on factory work. Jerry will follow this instruction exactly, twelve years later, enrolling at the University of Michigan on a wrestling scholarship in computer science.",
    eventType: "family", eventDate: new Date("1972-01-01"), datePrecision: "year", era: "highway", significance: 5,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["education"], familyStory: true, isPublic: true,
  }, [{ name: "Monty L. Norris", role: "gave the instruction" }, { name: "Jerry Norris", role: "received the instruction, age 6" }]);

  await addEvent({
    title: "Jerry attends Kendon Elementary",
    description: "Jerry attends Kendon Elementary — the school 30 feet from his house. Kevin Jones attends Kendon too. At every school Jerry attends, he is sent to a higher-level institution for math classes — the container never adequate to the ability.",
    eventType: "family", eventDate: new Date("1972-01-01"), eventDateEnd: new Date("1976-12-31"), datePrecision: "approximate", era: "highway", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["education"], familyStory: true, isPublic: true,
  }, [{ name: "Jerry Norris", role: "student" }]);

  await addEvent({
    title: "The Lansing busing fight — NAACP v. Lansing Board of Education",
    description: "The Lansing School Board voluntarily adopts a desegregation plan in 1972; five board members — including Hortense Canady, the first African American elected to the Lansing School Board — are recalled by voters for supporting it. The NAACP files suit in 1972 (NAACP v. Lansing Board of Education); a federal court issues a preliminary injunction in August 1973 restraining the board from reversing the plan. In 1974, Milliken v. Bradley — the Supreme Court decision protecting Detroit's suburbs from cross-district desegregation orders — ensures Lansing's suburban ring (DeWitt, Okemos, East Lansing) will never be required to participate. In 1975 a federal judge orders Lansing Public Schools to submit a plan eliminating \"a purposeful pattern of racial segregation\"; Chief Judge Fox issues the full ruling in May 1976. Jerry Norris is bused under this program in September 1976.",
    eventType: "legal", eventDate: new Date("1972-01-01"), eventDateEnd: new Date("1976-05-01"), datePrecision: "approximate", era: "highway", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["education", "justice"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Atwood Elementary, then Gardner Junior High",
    description: "Jerry attends Atwood Elementary on Haag Road, then moves to Gardner Junior High, grades 7 through 9. Wrestling begins to take shape. At every school, Jerry is sent elsewhere for math.",
    eventType: "family", eventDate: new Date("1978-01-01"), eventDateEnd: new Date("1980-12-31"), datePrecision: "approximate", era: "deindustrial", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["education"], familyStory: true, isPublic: true,
  }, [{ name: "Jerry Norris", role: "student" }]);

  await addEvent({
    title: "Wrestling coaches advocate for Eastern transfer; Joel Ferguson opens the door via Sadie Court",
    description: "Jerry is finishing his sophomore year at Everett High School — the school where Kevin Jones was shot — because his family is in the Haag Road Section 8 district. His wrestling coaches advocate for him to transfer to Lansing Eastern High School, which has a stronger wrestling program, but the family's Haag Road address is in the wrong district. Joel Ferguson — developer and civic figure — has a new Section 8 development on Sadie Court, in the Eastern district, and gives the family access to an apartment there. One developer's decision about one apartment changes everything downstream: Jerry gets to Eastern, Eastern's wrestling program develops him, the scholarship becomes possible. Joel Ferguson is later documented in the Chamber/development network this project critiques — both things are true.",
    eventType: "family", eventDate: new Date("1980-01-01"), datePrecision: "year", era: "deindustrial", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing", "education"], familyStory: true, isPublic: true,
  }, [{ name: "Jerry Norris", role: "transferred" }, { name: "Joel Ferguson", role: "provided the Sadie Court apartment" }]);

  await addEvent({
    title: "Lansing Eastern — the scholarship takes shape",
    description: "Jerry attends Lansing Eastern. The wrestling program is everything the coaches said it was. Mentors appear: Don Johnson, Kevin Jackson, Greg Johnson, Don Beam — men who hand Jerry frameworks for discipline and excellence that will carry him for decades; some are Olympians.",
    eventType: "family", eventDate: new Date("1980-01-01"), eventDateEnd: new Date("1984-12-31"), datePrecision: "approximate", era: "deindustrial", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["education"], familyStory: true, isPublic: true,
  }, [{ name: "Jerry Norris", role: "student" }]);

  // ── 1985-2011 ─────────────────────────────────────────────────────────
  await addEvent({
    title: "Jerry graduates Michigan; joins Unisys",
    description: "Jerry Norris graduates from the University of Michigan, approximately age 22. He joins Unisys Corporation, where he works from 1988 to 1993 — a corporate technology career bridging the Michigan degree and the next chapter.",
    eventType: "family", eventDate: new Date("1988-01-01"), datePrecision: "year", era: "deindustrial", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["education"], familyStory: true, isPublic: true,
  }, [{ name: "Jerry Norris", role: "graduated" }]);

  await addEvent({
    title: "One of the youngest ISO 9000 auditors in the world, age 23",
    description: "Jerry Norris, age 23, becomes one of the youngest ISO 9000 auditors in the world while working at Cascade Engineering in the Grand Rapids area. What he learns: \"Control and standardization is the opposite of diversity and innovation. The shop floor knows a lot more about solving problems than the officers in the offices do.\" He starts and runs the Cascade Engineering incubator, winning Clinton-era awards for welfare-to-work programs — his first cooperative infrastructure, before he has the name for it.",
    eventType: "family", eventDate: new Date("1989-01-01"), datePrecision: "year", era: "deindustrial", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["labor"], familyStory: true, isPublic: true,
  }, [{ name: "Jerry Norris", role: "ISO 9000 auditor" }]);

  await addEvent({
    title: "Ottawa Street Power Station decommissioned",
    description: "After 52 years of operation, the Ottawa Street Power Station is decommissioned. It sits mostly vacant for 15 years — a public asset in limbo — until AF Group purchases it in 2007.",
    eventType: "civic", eventDate: new Date("1992-01-01"), datePrecision: "year", era: "repackaging", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["energy"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Jackson Field opens downtown",
    description: "The baseball stadium opens as an economic development anchor for a post-industrial downtown. Named Oldsmobile Park, then Cooley Law School Stadium, then Jackson Field — each rename a corporate sponsorship turnover. Public amenity, private naming rights.",
    eventType: "civic", eventDate: new Date("1994-01-01"), datePrecision: "year", era: "repackaging", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Mayor Hollister's Blue Ribbon Committee keeps GM in Lansing",
    description: "David Hollister, Lansing mayor, leads a Blue Ribbon Committee that persuades GM to stay in Lansing and build three new plants rather than leave entirely — a genuine civic win, Hollister's signature achievement in office. But there is no binding community benefit agreement, no environmental cleanup bond, no transition fund in the event GM leaves anyway. The city gives; GM stays on its own terms.",
    eventType: "civic", eventDate: new Date("1997-01-01"), eventDateEnd: new Date("1999-12-31"), datePrecision: "approximate", era: "repackaging", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["labor", "governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Raven Norris born",
    description: "Raven Norris is born to Jerry and Shannon. She will grow up in Grand Ledge, study genetics at MSU, and go to work at Cedars-Sinai in Los Angeles. She fights Grand Ledge government alongside Jerry and Shannon for the right to raise chickens.",
    eventType: "family", eventDate: new Date("1999-01-01"), datePrecision: "year", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing"], familyStory: true, isPublic: true,
  }, [{ name: "Raven Norris", role: "born" }]);

  await addEvent({
    title: "Kevin Jones dies",
    description: "Kevin Jones, Jerry's neighbor from Julia Street, dies at age 37. He never returned to a classroom after the 1978 Everett shooting. He developed juvenile diabetes, lost a leg, and nearly went blind. He dies one month and five days after Columbine.",
    eventType: "family", eventDate: new Date("1999-05-25"), datePrecision: "day", era: "current", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["healthcare"], familyStory: true, isPublic: true,
  }, [{ name: "Kevin Jones", role: "died" }]);

  await addEvent({
    title: "Rain Norris born",
    description: "Rain Norris is born to Jerry and Shannon on May 25, 2001 — the same date Kevin Jones died in 1999. The rebel skater of Grand Ledge.",
    eventType: "family", eventDate: new Date("2001-05-25"), datePrecision: "day", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing"], familyStory: true, isPublic: true,
  }, [{ name: "Rain Norris", role: "born" }]);

  await addEvent({
    title: "Yoor Mom Skateboards founded",
    description: "When Rain is approximately 10 years old, Jerry and Rain start Yoor Mom Skateboards in Grand Ledge together. Grand Ledge said no to skateboarding in a public park; they fight the town for the right and lose, then build the company anyway. Joy as resistance — the Grand Ledge battles (chickens, skateboards, Yoor Mom) are The Fledge in miniature, a decade before The Fledge.",
    eventType: "family", eventDate: new Date("2011-01-01"), datePrecision: "approximate", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["labor"], familyStory: true, isPublic: true,
  }, [{ name: "Jerry Norris", role: "co-founder" }, { name: "Rain Norris", role: "co-founder" }]);

  console.log("\nDone.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
