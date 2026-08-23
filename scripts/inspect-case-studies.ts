// One-off inspection script — dumps full content of the 4 duplicated (older, June-batch)
// case studies so we can see what's worth preserving before consolidating with the
// newer Full Accounting versions.
// Run: npx tsx scripts/inspect-case-studies.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const SLUGS = ["bwl", "ingham-county-land-bank", "lansing-chamber-pac", "lansing-housing-commission"];

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
