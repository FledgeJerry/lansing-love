// The 42 pre-1993 mayors added by add-mayors-and-ballot-measures.ts were
// given significance: 1 to reflect their thin single-source citation — but
// TimelineView.tsx's default "min significance" filter is 3, so they were
// invisible on /history's Timeline tab by default despite existing correctly
// in HistoryEvent. Per Jerry (2026-08-27): raise to 3, matching the 4
// modern mayors, so all 46 show by default. The sourcing caveat stays in
// sourceNote, unchanged — significance should reflect narrative weight, not
// double as a visibility gate.
// Run: npx tsx scripts/fix-mayor-significance.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const result = await prisma.historyEvent.updateMany({
    where: { title: { endsWith: "becomes Lansing mayor" }, significance: { lt: 3 } },
    data: { significance: 3 },
  });
  console.log(`Updated ${result.count} mayor events to significance 3.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
