// Part 2 of the case-study inspection — the newer Full Accounting counterparts to the
// 4 institutions inspected in inspect-case-studies.ts, plus the 3 old-batch entries with
// no Full Accounting counterpart, so we have the complete picture before consolidating.
// Run: npx tsx scripts/inspect-case-studies-2.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const SLUGS = [
  "lhc-dispositions", "ingham-land-bank", "chamber-pac-electoral-loop", "bwl-coal-operations",
  "flock-surveillance", "board-of-ethics", "development-planning",
];

async function main() {
  const rows = await prisma.boardCaseStudy.findMany({ where: { slug: { in: SLUGS } } });
  for (const r of rows) {
    console.log("\n" + "=".repeat(80));
    console.log(`SLUG: ${r.slug}  |  ${r.boardName}  |  category: ${r.category}`);
    console.log("=".repeat(80));
    console.log("summary:", r.summary);
    console.log("stats:", JSON.stringify(r.stats));
    console.log("principles:", JSON.stringify(r.principles));
    console.log("ownership:", JSON.stringify(r.ownership));
    console.log("bottomLines:", JSON.stringify(r.bottomLines));
    console.log("sections:", JSON.stringify(r.sections, null, 2));
    console.log("recommendations:", JSON.stringify(r.recommendations));
    console.log("sources:", JSON.stringify(r.sources));
    console.log("players:", JSON.stringify(r.players));
    console.log("scores:", {
      transparency: r.scoreTransparency,
      conflicts: r.scoreConflicts,
      mission: r.scoreMission,
      democraticControl: r.scoreDemocraticControl,
      oversight: r.scoreOversight,
    });
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
