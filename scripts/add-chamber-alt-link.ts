import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const study = await prisma.boardCaseStudy.findUnique({ where: { slug: "lansing-chamber-pac" } });
  if (!study) { console.log("Not found"); return; }

  const sections = (study.sections as object[]) || [];
  const already = sections.some((s: any) => s.eyebrow === "Build the alternative");
  if (already) { console.log("Already has alternative link — skipping"); return; }

  await prisma.boardCaseStudy.update({
    where: { slug: "lansing-chamber-pac" },
    data: {
      sections: [
        {
          eyebrow: "Build the alternative",
          heading: "Not just accountability — build the cooperative",
          description: "The accountability campaign and the cooperative run simultaneously. A two-track action plan: file the complaints across five jurisdictions, and launch the cooperative that serves the 1,033 Chamber member businesses who have never funded the PAC.",
          items: [
            { label: "How to build an alternative to a chamber", desc: "Full plan: 8 findings, 7 complaint filings with addresses, cooperative legal structure (MCL 450.3100), governance provisions, membership tiers, growth targets, and the coordination timeline.", url: "/governance/alternatives/chamber" },
          ],
        },
        ...sections,
      ],
    },
  });
  console.log("✓ Added alternative link to lansing-chamber-pac");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
