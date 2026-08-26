// Merges the three gap-fill pieces confirmed 2026-08-26 against the sandbox
// version of lansing-full-accounting-MASTER.md:
//   1. Case 10 (ingham-medical-sparrow) — Lansing Eastern High School material
//   2. Case 12 (deep-green-data-center-moratorium) — Garza April 20/May 18 detail
//   3. Case 0 (case-0-land-before-the-cases) — explicit CPI methodology citation
// Idempotent-ish: checks for the new text before appending so a re-run doesn't
// double the content. Entities are upserted by exact-name match.
// Run: npx tsx scripts/merge-eastern-garza-cpi-gaps.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { cast } from "../src/lib/caseStudyTypes";

type SectionItem = { label: string; desc: string; url?: string };
type Section = { eyebrow: string; heading: string; description: string; items: SectionItem[] };

async function upsertEntity(data: Parameters<typeof prisma.entity.create>[0]["data"]) {
  const existing = await prisma.entity.findFirst({ where: { name: data.name } });
  if (existing) { console.log(`Skip (exists): ${data.name}`); return existing; }
  const created = await prisma.entity.create({ data });
  console.log(`Created entity: ${created.name}`);
  return created;
}

const EASTERN_BULLET_DESC = `The 1930 McLaren building — literally constructed with Ingham County public funds as the TB sanitorium's flagship structure — is currently being demolished (2024) to make way for "greenspace and future redevelopment." And on the Sparrow side: Lansing Eastern High School — Lansing School District's longest-continuously-operating school, open 91 years from 1928 to its final class in 2019 — was sold to Sparrow in a unanimous January 2016 school board vote for $2.475 million (18 acres), passed to UM Health via the 2023 merger, and demolished in early 2025 to clear the site for a new $83–97 million, 64-bed psychiatric hospital (sources differ on the exact figure between the project's initial announcement and its final approved budget). Jerry Norris is a Lansing Eastern alumnus; this is not an abstract case for him — it's the building where his own wrestling scholarship path was built, and it's now gone.

The precise finding here is sharper than "the public didn't want to sell it": the 2016 sale itself drew little public opposition at the time, and there's a genuine documented public benefit to weigh in — voters approved a $120 million bond that same year which funded a modernized replacement Eastern inside the former Pattengill Middle School, and the old building reportedly needed $60–80 million in code repairs it was never going to get as a functioning school. The sharper problem is timing: in 2013, three years before any sale vote occurred, then-Mayor Virg Bernero floated a performing-arts-center concept for Eastern's historic auditorium at a public preservation event — then, when asked afterward, admitted the Sparrow sale was already a "done deal." The public conversation about saving the building predates the actual decision being real by three years; the decision was privately settled before the public discussion of alternatives ever happened. Real opposition only organized around the 2024–2025 demolition, not the original sale — by which point City Council member Peter Spadafore, who had been school board president at the time of the 2016 sale vote, explicitly declined to support a historic-district study, saying "we had 12 years to do that" and nothing happened until UM-Sparrow's demolition plan forced the issue. Sparrow's own original 2015 purchase bid stated it would "maintain aspects of the historic value" of the facility while separately acknowledging the building would be "razed for all practical purposes" — both claims made in the same document.

A community preservation coalition (the Coalition to Preserve Eastern High School and Promote Mental Health, led in part by local historian Linda Peckham) fought specifically to save the building's west wing and auditorium on Pennsylvania Avenue, not to block the mental health facility itself. City Council rejected the historic-designation effort that would have preserved at least the façade — City Pulse reported this happened "under pressure from both UM-Sparrow and trade unions," a detail worth naming alongside Case 12's Jeremy Garza/Local 333 conflict as a second possible instance of union interest in construction work aligning against a preservation effort, though the specific union(s) involved here haven't been confirmed. Mayor Schor stated the city was legally obligated to issue the demolition permit once requirements were met, and warned that blocking it would likely trigger a lawsuit at taxpayer expense — demolition proceeded without requiring either a Council or mayoral vote. UM-Sparrow's stated remediation: a "remembrance garden" near the site, still pending its own City Council approval as of early 2026. Rawley Van Fossen — already named in Cases 7 and 8 — appears here too, as the City of Lansing's Director of Economic Development and Planning, confirming him as the individual with the broadest cross-case presence documented anywhere in this project. Ryan Kost chaired a council effort to preserve the building, his fourth appearance in this document (Cases 6, 9, 10, 12). The public origin of both institutions — a county TB ward, a 91-year-old public school — is disappearing from the built landscape on both sides of this case at the same time it's disappearing from institutional memory.

Open research thread, not yet resolved: which specific trade union(s) backed UM-Sparrow's position against the historic designation — not confirmed as Local 333, flagged as a separate open question from Case 12's confirmed Local 333 finding.`;

const GARZA_ADDITION = ` Garza was excused (absent) from the April 20, 2026 council meeting at which the data center moratorium was referred to committee. He was present and chairing on May 18, 2026 — the meeting where the moratorium simply was not on the agenda. This sharpens the finding from "he chairs the committee where the closing ordinance is stuck" to a more specific dodge-then-block pattern: absent for the vote that created the referral, present and controlling the agenda for the meeting that could have advanced it but didn't.`;

const CPI_CITATION = ` In 2026 dollars, using an extended historical price index (as published by in2013dollars.com, sourced ultimately to pre-CPI historical price research blended with official U.S. Bureau of Labor Statistics Consumer Price Index data from 1913 forward), $300,000 in 1862 is approximately $9.9 million in 2026 — using a ×33 multiplier, explicitly flagged as a rougher, less precise estimate than any post-1913 figure elsewhere in this document, since no official CPI data exists before 1913.`;

async function main() {
  // ── Gap 1: Case 10 — Eastern High School ────────────────────────────────
  const case10 = await prisma.boardCaseStudy.findUniqueOrThrow({ where: { slug: "ingham-medical-sparrow" } });
  const sections10 = cast<Section[]>(case10.sections, []);
  let touched10 = false;
  for (const section of sections10) {
    for (const item of section.items) {
      if (item.label.startsWith("The physical evidence is being erased")) {
        if (item.desc.includes("Lansing Eastern High School")) {
          console.log("Case 10: Eastern material already present, skipping.");
        } else {
          item.label = "The physical evidence is being erased — twice, on both sides of this case";
          item.desc = EASTERN_BULLET_DESC;
          touched10 = true;
        }
      }
    }
  }
  const newPlayers10 = Array.from(new Set([
    ...case10.players,
    "Rawley Van Fossen", "Ryan Kost", "Linda Peckham", "Virg Bernero", "Peter Spadafore",
    "Margaret Dimond", "Ann Marie Creed",
  ]));
  if (touched10 || newPlayers10.length !== case10.players.length) {
    await prisma.boardCaseStudy.update({
      where: { slug: "ingham-medical-sparrow" },
      data: { sections: sections10, players: newPlayers10 },
    });
    console.log("Case 10 updated: Eastern High School material + players.");
  }

  // ── Gap 2: Case 12 — Garza attendance detail ────────────────────────────
  const case12 = await prisma.boardCaseStudy.findUniqueOrThrow({ where: { slug: "deep-green-data-center-moratorium" } });
  const sections12 = cast<Section[]>(case12.sections, []);
  let touched12 = false;
  for (const section of sections12) {
    for (const item of section.items) {
      if (item.label === "A direct conflict at the chokepoint") {
        if (item.desc.includes("April 20, 2026")) {
          console.log("Case 12: Garza attendance detail already present, skipping.");
        } else {
          item.desc = item.desc + GARZA_ADDITION;
          touched12 = true;
        }
      }
    }
  }
  if (touched12) {
    await prisma.boardCaseStudy.update({ where: { slug: "deep-green-data-center-moratorium" }, data: { sections: sections12 } });
    console.log("Case 12 updated: Garza attendance detail.");
  }

  // ── Gap 3: Case 0 — CPI methodology citation ────────────────────────────
  const case0 = await prisma.boardCaseStudy.findUniqueOrThrow({ where: { slug: "case-0-land-before-the-cases" } });
  const sections0 = cast<Section[]>(case0.sections, []);
  let touched0 = false;
  for (const section of sections0) {
    for (const item of section.items) {
      if (item.label === "In 2026 dollars") {
        if (item.desc.includes("in2013dollars.com")) {
          console.log("Case 0: CPI citation already present, skipping.");
        } else {
          item.desc = item.desc + CPI_CITATION;
          touched0 = true;
        }
      }
    }
  }
  if (touched0) {
    await prisma.boardCaseStudy.update({ where: { slug: "case-0-land-before-the-cases" }, data: { sections: sections0 } });
    console.log("Case 0 updated: CPI methodology citation.");
  }

  // ── New entities ─────────────────────────────────────────────────────────
  const CITY_HALL = { address: "124 W. Michigan Ave", city: "Lansing", state: "MI", zip: "48933", lat: 42.7340573, lng: -84.5534370, geoSource: "manual" as const };

  await upsertEntity({
    entityType: "person", name: "Linda Peckham", altNames: [],
    description: "Local historian; led the Coalition to Preserve Eastern High School and Promote Mental Health, fighting to save the building's west wing and auditorium.",
    mapPin: false, domains: ["governance", "housing"], sourceTier: "RC",
  });
  await upsertEntity({
    entityType: "person", name: "Virg Bernero", altNames: [],
    description: "Lansing Mayor (2006–2018). Floated a performing-arts-center concept for Eastern High School's historic auditorium at a 2013 public preservation event, then admitted afterward the Sparrow sale was already a \"done deal.\"",
    ...CITY_HALL, mapPin: true, domains: ["governance"], sourceTier: "RC",
    sourceNote: "Institutional office address (Lansing City Hall, former office) — personal address not used per this project's standing rule.",
  });
  await upsertEntity({
    entityType: "person", name: "Peter Spadafore", altNames: [],
    description: "Lansing City Council member; was Lansing School District board president at the time of the 2016 Eastern High School sale vote. Declined to support a later historic-district study (\"we had 12 years to do that\"); separately chaired a council effort to preserve the building.",
    ...CITY_HALL, mapPin: true, domains: ["governance", "education"], sourceTier: "RC",
    sourceNote: "Institutional office address (Lansing City Hall) — personal address not used per this project's standing rule.",
  });
  await upsertEntity({
    entityType: "person", name: "Margaret Dimond", altNames: [],
    description: "UM Health-Sparrow official named in Case 10's Eastern High School material.",
    mapPin: false, domains: ["healthcare"], sourceTier: "RC",
  });
  await upsertEntity({
    entityType: "person", name: "Ann Marie Creed", altNames: [],
    description: "UM Health-Sparrow official named in Case 10's Eastern High School material.",
    mapPin: false, domains: ["healthcare"], sourceTier: "RC",
  });

  console.log("\nDone. Skipped (need role/context from Jerry before adding): Andrew Muylle, Faye Norris — see script comments.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
