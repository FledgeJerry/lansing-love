// Add Case 0 ("The Land Before the Cases") as a BoardCaseStudy row — the prologue to
// the numbered Full Accounting cases, covering 1819-1862: the Treaty of Saginaw and
// Treaty of Washington, Michigan Agricultural College and the Morrill Act, and Biddle City.
// Source: lansing-full-accounting-MASTER.md, "Case 0" section (added 2026-08-23).
// Run: npx tsx scripts/add-case0-land-before-cases.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const existing = await prisma.boardCaseStudy.findUnique({ where: { slug: "case-0-land-before-the-cases" } });
  if (existing) {
    console.log("Already exists — skipping (delete it first if you want to recreate).");
    return;
  }

  const study = await prisma.boardCaseStudy.create({
    data: {
      slug: "case-0-land-before-the-cases",
      boardName: "The Land Before the Cases",
      category: "Foundational History",
      date: "1819–1862",
      published: true,
      summary: "Every case in this accounting assumes a governed city already exists — a council, a housing commission, a utility board. This one covers what came before any of that: the land itself, how it changed hands, and what was built on the proceeds. Not a governance failure inside an existing institution, but the founding transaction that made \"Lansing\" a place with institutions at all.",
      neighborhoods: [],
      stats: [
        { label: "Land ceded via treaty (1819 & 1836)", value: "Most of the Lower Peninsula" },
        { label: "Michigan's land-grant value (1862, est.)", value: "~$300,000" },
        { label: "2026-equivalent (est.)", value: "~$9.9M" },
        { label: "National acreage taken for land-grant colleges", value: "~10.7M acres, 245 tribal nations" },
        { label: "Years before any city governance existed to fail", value: "0" },
      ],
      principles: [],
      ownership: [],
      sections: [
        {
          eyebrow: "0a — 1819, 1836",
          heading: "The Treaty of Saginaw and the Treaty of Washington",
          description: "The land that became Lansing, East Lansing, and the surrounding region — including what is now Michigan State University's campus — entered U.S. federal control through the 1819 Treaty of Saginaw and two 1836 treaties (the Treaty of Washington among them). This land became the basis for state formation, township organization, and eventually every institution documented in this file.",
          items: [
            { label: "Whose land", desc: "The Anishinaabeg — the Three Fires Confederacy of Ojibwe, Odawa, and Potawatomi peoples — along with the Saginaw Band of Chippewa specifically named in the 1819 treaty." },
            { label: "MSU's own account", desc: "Michigan State University's current land acknowledgment materials state plainly that the treaty was negotiated \"under coercive or violent circumstances,\" and that \"settler and Indigenous signatories understood the terms of the treaties in starkly different terms.\"" },
            { label: "Not a distant abstraction", desc: "An Anishinaabe \"Indian Encampment\" is documented on university archive maps as still present just south of the Red Cedar River when MSU's first classes were held in 1857 — displacement was visibly ongoing on the same ground, not a historical footnote to it." },
          ],
        },
        {
          eyebrow: "0b — 1855–1862",
          heading: "Michigan Agricultural College and the Morrill Act",
          description: "In 1855, Governor Kinsley Bingham signed the bill creating the Agricultural College of the State of Michigan — the institution that became Michigan State University, and the direct model for the 1862 Morrill Act, the federal law that created the entire American land-grant university system. More than 100 institutions nationally trace their funding to this model.",
          items: [
            { label: "What funded it", desc: "The Morrill Act funded these colleges with granted federal public land — or \"land scrip\" where a state lacked enough public land of its own — to be sold, with proceeds funding the colleges. Nationally, this drew from roughly 10.7 million acres taken from 245 tribal nations, per MSU's own American Indian and Indigenous Studies program." },
            { label: "Michigan's specific grant", desc: "Tied to Michigan Agricultural College, drawn from parcels ceded in the 1819 and 1836 treaties above." },
            { label: "A formula estimate, not a confirmed record", desc: "The Act allocated 30,000 acres per congressional seat, valued at $1.25/acre. Michigan held roughly 8 seats around 1862: 8 × 30,000 = 240,000 acres × $1.25 = approximately $300,000 in 1862 dollars — an illustrative order-of-magnitude figure from the statute's own terms, not a verified record of Michigan's actual land sales, pending direct archival confirmation." },
            { label: "In 2026 dollars", desc: "Approximately $9.9 million — the estimated value of land transferred, without the consent of the nations it was taken from, to fund the founding of what is now a multi-billion-dollar public research university two miles from the State Capitol." },
          ],
        },
        {
          eyebrow: "0c — 1835",
          heading: "Biddle City",
          description: "New York land speculators sold lots in \"Biddle City,\" described to buyers as a promising, established Michigan Territory settlement. Buyers purchased sight unseen. When they arrived, they found frozen wilderness — nothing had been built, on land recently made available for sale following the treaty cessions above.",
          items: [
            { label: "The pattern in its rawest form", desc: "A decision made by people who bear none of its consequences, imposed on people with no way to contest it before harm occurs — occurring within a single decade of the land itself being transferred out of Anishinaabe control. Every later case in this document is a more institutionally sophisticated version of the same basic move." },
            { label: "No governance structure to fail", desc: "This isn't a governance failure — there was no governance structure yet to fail. It's included for its structural significance to the pattern, not its financial scale; no reliable dollar figure for the fraud has been located." },
          ],
        },
        {
          eyebrow: "The accounting gap",
          heading: "No dollar figure captures this, and this document won't manufacture one",
          description: "Every subsequent case in this accounting — every highway, every housing commission decision, every hospital merger — takes place on land whose original transfer involved no binding consent from the people who held it, and no seat at the table of the kind this entire framework argues every later decision should have had. This is the pattern's first documented instance in this specific place, not a metaphor for it.",
          items: [
            { label: "Open: Biddle City primary source", desc: "A period newspaper account, land office record, or historical society document confirming the fraud specifically has not yet been located." },
            { label: "Open: 1862 land scrip sale terms", desc: "Direct archival confirmation of Michigan's actual sale terms and proceeds would replace the current formula-based estimate with a verified transaction record." },
            { label: "Open: present-day request", desc: "Whether any of the Anishinaabe, Ojibwe, Odawa, or Potawatomi nations affected by the 1819/1836 treaties have made, or would welcome, any specific present-day request of MSU, the state of Michigan, or this project." },
          ],
        },
      ],
      recommendations: [
        "Locate a primary source for the Biddle City fraud before citing it as more than a documented historical anecdote.",
        "Pursue direct archival confirmation of Michigan's 1862 land scrip sale terms to replace the formula-based $300K estimate with a verified figure.",
        "Ask, rather than assume, whether any affected nations have a specific present-day request of MSU, the state, or this project — and do not treat this case as closed on this project's own terms alone.",
      ],
      sources: [
        "Michigan State University American Indian and Indigenous Studies Program (aiis.msu.edu)",
        "MSU Native American Institute (nai.msu.edu)",
        "National Archives — Morrill Act, Public Law 37-108, July 2, 1862",
        "Encyclopedia.com — Morrill Act statutory text, $1.25/acre valuation",
        "MSU Today, \"Land-Grant Roots\" (July 2, 2018)",
        "MSU CANR Tribal Extension program",
        "General Michigan territorial history (Biddle City — historical anecdote pending primary-source citation)",
      ],
      players: ["Anishinaabeg — Three Fires Confederacy", "Saginaw Band of Chippewa", "Michigan State University / Michigan Agricultural College", "Governor Kinsley Bingham", "Justin Morrill"],
      // Scores intentionally left at the "insufficient" default — this case predates any
      // city governance structure for the transparency/conflicts/oversight framework
      // applied to Cases 1-12 to meaningfully evaluate.
    },
  });

  console.log(`Created: ${study.slug} (${study.boardName})`);
  const count = await prisma.boardCaseStudy.count();
  console.log(`Total case studies: ${count}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
