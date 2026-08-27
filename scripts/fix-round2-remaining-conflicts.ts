// Closes the last 4 items from the round-2 source-timeline diff, per Jerry's
// "Round 2 — All Conflicts Closed" message (2026-08-27):
// 1. Ottawa Street Station: 1908 build date confirmed correct, no change —
//    but the Art Deco building was built 1937-1946 in two phases (south
//    half 1939, north half 1946, delayed by WWII material shortages), not
//    "1939-1940". Detail (E. Bement & Sons property, Burns and Roe
//    engineering) pulled from docs/lansing-merged-timeline-MASTER.md, the
//    corrected reference doc Jerry placed in the repo alongside this fix.
// 2. Dubai commute: confirmed Spring 2002 (not the sandbox's "~2000").
//    NOTE: the 98/180 trip counts and death-reduction figure ARE already
//    sourced in the DB (sourceNote: "Radiical Systems case study April
//    2024") — flagging that citation back to Jerry rather than stripping
//    it, since he asked to flag any existing source rather than assume.
// 3. LHC dispositions: retitled/redated to match the sandbox doc's Case 7
//    "(2020-2026)" — RAD conversions from ~2020 through the SK sale/
//    eviction wave into 2026, not 2018-2026.
// Idempotent: checks current field values before writing, safe to re-run.
// Run: npx tsx scripts/fix-round2-remaining-conflicts.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  // ── 1a. First Ottawa Street power station — fix the "replaced by" note ──
  const firstStation = await prisma.historyEvent.findFirst({ where: { title: "First Ottawa Street power station built" } });
  if (firstStation) {
    const fixed = "Michigan Power Company builds the first Ottawa Street power station on the Grand River, on property that had belonged to E. Bement & Sons. The city acquires it in 1919 after WWI financial strain — Michigan Power Company was on the verge of closing, and the city's Board of Water Works and Electric Lighting purchased the property and assumed operations. This original plant is later torn down and rebuilt for greater electric generation capacity — the Art Deco structure completed in 1939 (south half) and 1946 (north half, delayed by wartime material shortages).";
    if (firstStation.description !== fixed) {
      await prisma.historyEvent.update({ where: { id: firstStation.id }, data: { description: fixed } });
      console.log(`Updated description: ${firstStation.title}`);
    } else {
      console.log(`Already correct: ${firstStation.title}`);
    }
  } else {
    console.log("WARNING: 'First Ottawa Street power station built' not found.");
  }

  // ── 1b. Art Deco building — two-phase completion, not a single range ───
  const artDeco = await prisma.historyEvent.findFirst({ where: { title: "Ottawa Street Power Station (Art Deco building) completed" } });
  if (artDeco) {
    const fixed = "The Art Deco Ottawa Street Power Station rises on the same site as the demolished 1908 original. Designed by Edwyn Bowd (Bowd-Munson Company), engineering by Burns and Roe: polychromatic brick, 176 feet over the Grand River, a step-back ziggurat form with a color gradient from black granite at the base to yellow at the top, representing the stages of coal combustion. The southern half is completed in 1939; the northern half, delayed by wartime shortages, in 1946. One of the most beautiful industrial buildings in Michigan; publicly owned, with no resident seat on its governance board. Publicly owned for roughly 52 years, then sold (see 1992 decommissioning and 2007 AF Group purchase).";
    const targetStart = new Date("1937-01-01");
    const targetEnd = new Date("1946-12-31");
    const needsUpdate = artDeco.description !== fixed || artDeco.eventDate?.getTime() !== targetStart.getTime() || artDeco.eventDateEnd?.getTime() !== targetEnd.getTime() || artDeco.datePrecision !== "year";
    if (needsUpdate) {
      await prisma.historyEvent.update({
        where: { id: artDeco.id },
        data: { description: fixed, eventDate: targetStart, eventDateEnd: targetEnd, datePrecision: "year" },
      });
      console.log(`Updated: ${artDeco.title} (now 1937-1946, two-phase completion)`);
    } else {
      console.log(`Already correct: ${artDeco.title}`);
    }
  } else {
    console.log("WARNING: 'Ottawa Street Power Station (Art Deco building) completed' not found.");
  }

  // ── 2. Dubai commute — tighten precision to Jerry's direct confirmation ─
  const dubai = await prisma.historyEvent.findFirst({ where: { title: "Jerry begins Dubai commute — six months after 9/11" } });
  if (dubai) {
    if (dubai.datePrecision !== "month") {
      await prisma.historyEvent.update({ where: { id: dubai.id }, data: { datePrecision: "month" } });
      console.log(`Updated precision: ${dubai.title} (approximate -> month, per Jerry's direct Spring 2002 confirmation)`);
    } else {
      console.log(`Already correct: ${dubai.title}`);
    }
    console.log(`FLAG for Jerry: this event's 98/180 trip counts and the 600/year->5 death-reduction figure are already sourced — sourceTier "${dubai.sourceTier}", sourceNote "${dubai.sourceNote}". Not found in the sandbox doc, but not unsourced in the DB either. Confirm this citation is legitimate, or let me know to remove the stats if it isn't.`);
  } else {
    console.log("WARNING: Dubai commute event not found.");
  }

  // ── 3. LHC dispositions — retitle/redate to match Case 7 (2020-2026) ───
  const lhc = await prisma.historyEvent.findFirst({ where: { title: { contains: "LHC housing dispositions" } } });
  if (lhc) {
    const newTitle = "LHC housing dispositions — 833 to 66 units (2020-2026)";
    const newDescription = "2020-2026: Lansing Housing Commission winds from 833 to 66 publicly owned units. RAD (Rental Assistance Demonstration) conversions begin around 2020 at South Washington Park and Mount Vernon Park. SK Investment Group submits sale proposals Oct.-Dec. 2021; HUD approves and the sale closes in 2022 — 202 homes sold for ~$72K each. SK files 113 eviction cases. Developer fees: $2.34M and $2.37M on two documented conversions. Doug Fleming signs both sides of Oliver Gardens II. Five FOIA requests; $4,430 fees; zero documents.";
    const targetStart = new Date("2020-01-01");
    const targetEnd = new Date("2026-12-31");
    const needsUpdate = lhc.title !== newTitle || lhc.description !== newDescription || lhc.eventDate?.getTime() !== targetStart.getTime() || lhc.eventDateEnd?.getTime() !== targetEnd.getTime();
    if (needsUpdate) {
      await prisma.historyEvent.update({
        where: { id: lhc.id },
        data: { title: newTitle, description: newDescription, eventDate: targetStart, eventDateEnd: targetEnd },
      });
      console.log(`Updated: LHC dispositions -> "${newTitle}" (2020-2026)`);
    } else {
      console.log(`Already correct: ${lhc.title}`);
    }
  } else {
    console.log("WARNING: LHC housing dispositions event not found.");
  }

  console.log("\nDone.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
