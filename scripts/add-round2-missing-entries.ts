// Adds the ~19 (17 actual) entries identified as missing from HistoryEvent in
// the round-2 source-timeline diff, grouped by thread per Jerry's request:
// Eastern High School (3 gen.), UM-Sparrow granular sub-dates, charter
// revision, NOVA earlier phases, Deep Green/Flock. Text adapted from
// docs/lansing-merged-timeline-MASTER.md. Standard default-include applies
// (2026-08-27): real date + real sourcing goes in; nothing here was
// ambiguous enough to flag and exclude.
// Run: npx tsx scripts/add-round2-missing-entries.ts

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
    else console.log(`  WARNING: entity "${er.name}" not found, link skipped`);
  }
  return event;
}

async function main() {
  // ── New entities needed across this batch ───────────────────────────
  await upsertEntity({
    entityType: "person", name: "Grandma Brett",
    description: "Jerry's grandmother; graduated Lansing Eastern High School in 1950 — the same Pennsylvania Avenue building Jerry later graduated from in 1984.",
    mapPin: false, domains: ["family"], sourceTier: "FM", familyStory: true, isPublic: true,
  });
  await upsertEntity({
    entityType: "organization", name: "Sparrow Health System",
    description: "Lansing-based hospital system; affiliated with the University of Michigan Health system in a 2022-2023 merger, renamed University of Michigan Health-Sparrow in April 2024.",
    mapPin: false, domains: ["healthcare"], sourceTier: "S", familyStory: false, isPublic: true,
  });
  await upsertEntity({
    entityType: "organization", name: "University of Michigan Health",
    description: "University of Michigan's health system; acquired Sparrow Health System in a 2022-2023 merger (completed April 2023, $7B, structured as a 'member substitution agreement' with no disclosed purchase price).",
    mapPin: false, domains: ["healthcare"], sourceTier: "S", familyStory: false, isPublic: true,
  });
  await upsertEntity({
    entityType: "organization", name: "McLaren Greater Lansing — Collins Road campus",
    description: "McLaren's $600M replacement hospital near MSU, opened 2024. Its predecessor, the historic Greenlawn campus (including the 1930 building originally built as the county TB sanitorium), was vacated and demolition began the same year.",
    mapPin: false, domains: ["healthcare"], sourceTier: "S", familyStory: false, isPublic: true,
  });
  await upsertEntity({
    entityType: "organization", name: "Flock Safety",
    description: "Vendor of automated license plate reader cameras deployed by the Lansing Police Department starting September 2025 — 20+ cameras citywide, with zero Council vote, zero Board of Police Commissioners review, and zero written policy at the time of deployment.",
    mapPin: false, domains: ["governance"], sourceTier: "S", familyStory: false, isPublic: true,
  });
  await upsertEntity({
    entityType: "organization", name: "Lansing Charter Commission (2024)",
    description: "36-candidate field elected in 2024 to revise Lansing's city charter. The revision — approved by voters in November 2025 — added an independent internal auditor, a mandatory three-year strategic plan, a public financial transparency dashboard, procurement reform, and a five-ward 'Super-Election' expansion effective 2029. Board/commission mayoral appointment authority, the concentration of power documented in this project's Case 13, was not restructured.",
    mapPin: false, domains: ["governance"], sourceTier: "S", familyStory: false, isPublic: true,
  });

  // ── Thread 1: Eastern High School, three generations ─────────────────
  await addEvent({
    title: "Jerry graduates Lansing Eastern — three generations, two buildings",
    description: "Jerry Norris graduates from Lansing Eastern High School — the building on Pennsylvania Avenue, one block north of Michigan Avenue, the original 1928 structure. One thread in a three-generation family relationship with this specific institution, which by 2025 will no longer physically exist: Grandma Brett graduated Eastern in 1950; Jerry graduates in 1984, the same Pennsylvania Avenue building; Jerry's grandson Christopher Norris (Daniella's son) graduates Eastern in 2023 — but from an entirely different building, the relocated Eastern on Marshall Street at Saginaw, funded by the $120 million bond voters approved in 2016 (see Case 10). The Pennsylvania Avenue building Jerry and Grandma Brett knew was sold to Sparrow in that same 2016 vote and demolished in early 2025.",
    eventType: "family", eventDate: new Date("1984-01-01"), datePrecision: "year", era: "deindustrial", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["family", "housing"], familyStory: true, isPublic: true,
  }, [{ name: "Jerry Norris", role: "graduate" }, { name: "Grandma Brett", role: "graduate (1950)" }, { name: "Christopher Norris", role: "graduate (2023, different building)" }]);

  await addEvent({
    title: "Sparrow acquires Lansing Eastern's 18-acre Pennsylvania Ave. site",
    description: "Sparrow submits a purchase bid in 2015 for Lansing Eastern High School's 18-acre Pennsylvania Avenue site — the same building Jerry graduated from in 1984. In January 2016, the Lansing School Board votes unanimously to sell for $2.475 million; voters approve a $120 million bond the same year funding a modernized replacement Eastern inside the former Pattengill Middle School. In 2013 — three years before any vote — then-Mayor Virg Bernero called the sale a 'done deal' while still publicly floating a preservation alternative for the building's auditorium. See Case 10 for the full account, including the Coalition to Preserve Eastern High School's later fight over the 2024-2025 demolition.",
    eventType: "civic", eventDate: new Date("2015-01-01"), eventDateEnd: new Date("2016-12-31"), datePrecision: "year", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["housing", "healthcare"], familyStory: false, isPublic: true,
  }, [{ name: "Virg Bernero", role: "mayor, called sale a 'done deal' in 2013" }]);

  await addEvent({
    title: "McLaren's new Collins Road campus opens; both hospital systems erase their old buildings",
    description: "McLaren's new $600M replacement hospital opens on Collins Road near MSU; the historic Greenlawn campus — including the 1930 building built as the original county TB sanitorium — is vacated and demolition begins. On the Sparrow side, planning begins for a new $83-97 million, 64-bed psychiatric facility on the Eastern High School site; a preservation coalition forms to fight for at least the building's west wing and auditorium.",
    eventType: "civic", eventDate: new Date("2024-01-01"), datePrecision: "year", era: "current", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["healthcare", "housing"], familyStory: false, isPublic: true,
  }, [{ name: "McLaren Greater Lansing — Collins Road campus", role: "new campus" }, { name: "Sparrow Health System", role: "began psychiatric facility planning" }]);

  await addEvent({
    title: "Eastern High School demolished; UM Health Plan wound down",
    description: "Early 2025: Lansing Eastern High School is demolished, the preservation coalition's fight over — City Council declined to pursue historic designation 'under pressure from both UM-Sparrow and trade unions.' Separately: UM Health Plan (formerly Sparrow's Physicians Health Plan), covering 64,000 Lansing-area members, is wound down after UM fails to find a buyer.",
    eventType: "civic", eventDate: new Date("2025-01-01"), datePrecision: "year", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["housing", "healthcare"], familyStory: false, isPublic: true,
  }, [{ name: "Sparrow Health System", role: "site owner" }]);

  // ── Thread 2: UM-Sparrow merger, granular sub-dates ───────────────────
  await addEvent({
    title: "UM Regents, Sparrow board approve affiliation agreement",
    description: "The University of Michigan Board of Regents and Sparrow's board approve an affiliation agreement — the first formal step in what becomes a $7 billion merger, completed the following April.",
    eventType: "financial", eventDate: new Date("2022-12-01"), datePrecision: "month", era: "current", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["healthcare"], familyStory: false, isPublic: true,
  }, [{ name: "University of Michigan Health", role: "acquirer" }, { name: "Sparrow Health System", role: "acquired" }]);

  await addEvent({
    title: "UM Health-Sparrow $7B merger completes",
    description: "The merger completes — Sparrow's CEO calls it a 'member substitution agreement,' no purchase price disclosed. UM pledges $800 million in capital investment over eight years. Within two years, 2,000 nurses and caregivers vote 98.7% to authorize a strike; federal unfair labor practice charges are filed. The union ratifies a new contract in January 2025 (95% approval); in January 2026, 213 advanced practice providers vote 86% to unionize — the same capital-versus-labor dynamic, the shop floor organizing itself again in Lansing, 88 years after the Lansing Labor Holiday.",
    eventType: "financial", eventDate: new Date("2023-04-01"), datePrecision: "month", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["healthcare", "labor"], familyStory: false, isPublic: true,
  }, [{ name: "University of Michigan Health", role: "acquirer" }, { name: "Sparrow Health System", role: "acquired" }]);

  await addEvent({
    title: "Sparrow renamed University of Michigan Health-Sparrow",
    description: "One year after the merger completed, Sparrow Health System is formally renamed University of Michigan Health-Sparrow.",
    eventType: "civic", eventDate: new Date("2024-04-01"), datePrecision: "month", era: "current", significance: 1,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["healthcare"], familyStory: false, isPublic: true,
  }, [{ name: "University of Michigan Health", role: "renamed entity" }]);

  // ── Thread 3: Charter revision, full arc ──────────────────────────────
  await addEvent({
    title: "Lansing's Charter Commission elected",
    description: "36 candidates run for seats on the Charter Commission tasked with revising Lansing's city charter. One candidate tells WKAR directly that the Mayor appoints 'all 200+ individuals' across the city's boards and commissions, and campaigns on splitting that appointment power with City Council — a reform that does not make it into the final revision. See Case 13 (the Assessor/Board of Review self-review loop) for the structural finding this candidate statement helps document.",
    eventType: "political", eventDate: new Date("2024-01-01"), datePrecision: "year", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  }, [{ name: "Lansing Charter Commission (2024)", role: "elected body" }]);

  await addEvent({
    title: "Voters approve the Lansing charter revision",
    description: "The revision passes: an independent internal auditor, a mandatory three-year strategic plan with measurable goals, a public financial transparency dashboard, procurement reform, and a five-ward expansion effective 2029 that will put the Mayor, all nine Council seats, and the Clerk on one ballot simultaneously for the first time — the 'Super-Election.' Board and commission appointment authority — the Mayor's concentrated power documented in Case 13 — is not restructured.",
    eventType: "political", eventDate: new Date("2025-11-01"), datePrecision: "month", era: "current", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  }, [{ name: "Lansing Charter Commission (2024)", role: "proposing body" }]);

  await addEvent({
    title: "New Lansing charter takes effect; Schor sworn in for third term",
    description: "Andy Schor begins his third term as the first mayor to govern under the revised charter. The independent auditor position sits vacant for months afterward; the mandatory strategic plan's one-year deadline runs to roughly January 2027.",
    eventType: "political", eventDate: new Date("2026-01-01"), datePrecision: "day", era: "current", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  }, [{ name: "Andy Schor", role: "mayor, sworn in" }]);

  // ── Thread 4: NOVA/ModPod, earlier phases ─────────────────────────────
  await addEvent({
    title: "NOVA/ModPod initiative begins; DRMM emerges as sole applicant",
    description: "City Council approves $640,000 for 50 modular pod units, framed publicly as offering 'wrap-around services to include job assistance, housing support, health care and mental and substance use counseling.' HRCS Director Kim Coleman leads planning. Detroit Rescue Mission Ministries — founded 1909, Detroit — later emerges as the sole applicant for the operations contract.",
    eventType: "civic", eventDate: new Date("2025-08-01"), datePrecision: "month", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "RC", domains: ["housing"], familyStory: false, isPublic: true,
  }, [{ name: "Kimberly Coleman", role: "HRCS Director, led planning" }, { name: "Detroit Rescue Mission Ministries", role: "sole applicant" }]);

  await addEvent({
    title: "NOVA site selection meetings — Letts and Foster Community Centers",
    description: "Public meetings at Letts and Foster Community Centers narrow 48 candidate properties to 5, then to the Ingham County Human Services building parking lot at 5303 S. Cedar St, after parks are removed from consideration due to neighborhood opposition.",
    eventType: "civic", eventDate: new Date("2025-11-01"), eventDateEnd: new Date("2025-12-31"), datePrecision: "month", era: "current", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "RC", domains: ["housing"], familyStory: false, isPublic: true,
  });

  // ── Thread 5: Deep Green / Flock surveillance, complete thread ────────
  await addEvent({
    title: "Deep Green proposes downtown data center; Flock cameras deployed with no public process",
    description: "UK-based Deep Green proposes a $120 million, 24-megawatt data center at Kalamazoo and Cedar Streets. Separately, the Lansing Police Department deploys 20+ automated license plate reader cameras (Flock Safety) citywide in September, with zero Council vote, zero Board of Police Commissioners review, and zero written policy — funded partly through a 2023 grant originally intended to reduce motor vehicle theft. First public discussion of the cameras: seven months later.",
    eventType: "civic", eventDate: new Date("2025-01-01"), datePrecision: "year", era: "current", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  }, [{ name: "Deep Green", role: "proposer" }, { name: "Flock Safety", role: "camera vendor" }]);

  await addEvent({
    title: "Deep Green hearing draws 200+ opposed",
    description: "Roughly 200 residents pack Lansing City Hall to capacity; nearly 90 give public comment, most opposed. A PR operation using template letters and an astroturf coalition ('Michigan for Responsible Data Centers') competes with the real turnout — 58% of formal written support letters are later found to be Chamber-affiliated.",
    eventType: "civic", eventDate: new Date("2026-02-10"), datePrecision: "day", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  }, [{ name: "Deep Green", role: "applicant" }]);

  await addEvent({
    title: "Deep Green withdraws its data center proposal",
    description: "The rezoning application is withdrawn with no public explanation given.",
    eventType: "civic", eventDate: new Date("2026-04-01"), datePrecision: "month", era: "current", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  }, [{ name: "Deep Green", role: "withdrew proposal" }]);

  await addEvent({
    title: "Data center moratorium passes 7-1",
    description: "City Council passes a 182-day moratorium on new data center permits, effective July 27, expiring Jan. 25, 2027. Jeremy Garza — VP of UA Plumbers and Pipefitters Local 333, the union that publicly backed Deep Green — casts the lone dissenting vote. The moratorium does not close the underlying loophole: a data center remains a by-right use on privately owned heavy-industrial land, requiring no Council vote, no Planning Commission review, and no public hearing. The ordinance that would close that loophole stalls in the committee Garza chairs.",
    eventType: "political", eventDate: new Date("2026-07-13"), datePrecision: "day", era: "current", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  }, [{ name: "Jeremy Garza", role: "lone dissenting vote" }]);

  await addEvent({
    title: "Council votes 7-1 to request Flock contract termination",
    description: "A non-binding resolution, sponsored by Ryan Kost, directs Mayor Schor and LPD to terminate the Flock contracts and pause future AI-camera agreements pending a privacy policy. Council President Peter Spadafore casts the lone dissent, citing a rushed process. Schor's office is non-committal the next day. Eight other Michigan communities have canceled or rejected Flock contracts in the past year.",
    eventType: "political", eventDate: new Date("2026-08-24"), datePrecision: "day", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  }, [{ name: "Ryan Kost", role: "sponsor" }, { name: "Peter Spadafore", role: "lone dissent" }, { name: "Flock Safety", role: "subject of resolution" }]);

  console.log("\nDone.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
