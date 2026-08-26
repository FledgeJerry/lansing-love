// One-off export of specific case studies' full content, for a manual diff
// against a parallel version being maintained in a separate Claude.ai
// session's sandbox. Prints pretty-printed JSON to stdout — redirect to a
// file when running.
// Run: npx tsx scripts/export-cases-for-diff.ts > /tmp/case-diff-export.json

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const SLUGS = [
  "case-0-land-before-the-cases",
  "ingham-medical-sparrow",
  "nova-modpod-housing-initiative",
  "deep-green-data-center-moratorium",
];

function bigIntSafe(_key: string, value: unknown) {
  return typeof value === "bigint" ? value.toString() : value;
}

async function main() {
  const cases = await prisma.boardCaseStudy.findMany({
    where: { slug: { in: SLUGS } },
  });

  // Also pull ActionItems tied to these cases, and any Entity/HistoryEvent/
  // DollarFlow rows tagged to their sourceSlug, since a fair diff needs the
  // full picture, not just the BoardCaseStudy row.
  const actions = await prisma.actionItem.findMany({
    where: { sourceType: "case", sourceSlug: { in: SLUGS } },
  });

  const output = {
    exportedAt: new Date().toISOString(),
    caseCount: cases.length,
    foundSlugs: cases.map((c) => c.slug),
    missingSlugs: SLUGS.filter((s) => !cases.some((c) => c.slug === s)),
    cases,
    relatedActionItems: actions,
  };

  console.log(JSON.stringify(output, bigIntSafe, 2));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
