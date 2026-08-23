// Add Case 12 (Deep Green / the data center moratorium and the I-HVY zoning loophole)
// as a BoardCaseStudy row, matching the pattern of the other Full Accounting cases.
// Source: lansing-full-accounting-MASTER.md, Case 12 (added 2026-08-23).
// Run: npx tsx scripts/add-case12-deep-green.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const existing = await prisma.boardCaseStudy.findUnique({ where: { slug: "deep-green-data-center-moratorium" } });
  if (existing) {
    console.log("Already exists — skipping (delete it first if you want to recreate).");
    return;
  }

  const study = await prisma.boardCaseStudy.create({
    data: {
      slug: "deep-green-data-center-moratorium",
      boardName: "Deep Green / The Data Center Moratorium",
      category: "Zoning & Development",
      date: "2025–2026 (ONGOING)",
      published: true,
      summary: "After UK-based Deep Green withdrew its $120M downtown data center proposal, City Council passed a 182-day moratorium 7–1 — a real, hard-won win. But it doesn't close the underlying by-right I-HVY zoning loophole that let the project skip a public vote in the first place. The closing ordinance is stalled in a committee chaired by Jeremy Garza — the moratorium's lone \"no\" vote, and VP of the union that publicly backed the original project.",
      neighborhoods: ["Downtown", "Stadium District"],
      stats: [
        { label: "Moratorium vote", value: "7–1" },
        { label: "Moratorium expires", value: "Jan. 25, 2027" },
        { label: "Deep Green proposal (withdrawn)", value: "$120M" },
        { label: "Municipalities that already closed this loophole", value: "19 (incl. Mason, MI)" },
        { label: "Closing ordinance hearings held", value: "0" },
      ],
      principles: [
        { num: 4, name: "Autonomy and Independence", violation: "A data center is a by-right use in I-HVY districts — a developer can pull a building permit with no Council vote, no Planning Commission vote, and no public hearing, regardless of what the moratorium or public sentiment says.", evidence: "Lansing zoning code, I-HVY (Heavy Industrial) by-right provisions." },
        { num: 6, name: "Cooperation Among Cooperatives", violation: "The committee chair positioned to move the permanent closing ordinance has a direct institutional stake in the outcome it would foreclose.", evidence: "Jeremy Garza chairs the Committee on Development and Planning; is VP of UA Plumbers and Pipefitters Local 333, which publicly backed the Deep Green project; and cast the lone \"no\" vote against the moratorium itself." },
      ],
      ownership: [
        { question: "Who owns it?", before: "Any privately owned I-HVY parcel, citywide — no single site", after: "Same — the by-right pathway survives the moratorium untouched", assessment: "extractive" },
        { question: "Who has power?", before: "City Council (zoning), Building Department (by-right permitting)", after: "Effectively the Building Department alone, once the moratorium lapses — Council and Planning Commission have no vote on a by-right I-HVY permit", assessment: "extractive" },
        { question: "Who benefits?", before: "Data center developers seeking speed-to-power, framed publicly as regional economic development", after: "Same — the moratorium is temporary and the loophole it sits on top of is not yet closed", assessment: "mixed" },
        { question: "Who does the work?", before: "Ryan Kost and Dr. Deyanira Nevarez Martinez led the moratorium push", after: "The closing ordinance's fate sits with a committee chair with a documented conflict of interest", assessment: "mixed" },
        { question: "Who makes the rules?", before: "City Council, by ordinance", after: "Same, nominally — but the Committee on Development and Planning has not scheduled a hearing on the closing ordinance", assessment: "extractive" },
      ],
      sections: [
        {
          eyebrow: "What the community genuinely received",
          heading: "A real, hard-won win",
          description: "",
          items: [
            { label: "A 7–1 moratorium", desc: "After Deep Green withdrew in April 2026, Council — led by Ward 1's Ryan Kost with Ward 2's Dr. Deyanira Nevarez Martinez — passed a 182-day moratorium on new data center permits and zoning amendments, July 13, 2026. A genuine instance of Council acting on public pressure rather than deferring to the Chamber's framing." },
            { label: "Real concessions extracted during negotiation", desc: "Even though the project ultimately died: closed-loop cooling limiting water use to roughly 15 households, upfront payment of all energy infrastructure costs, standard published utility rates rather than a discounted special contract, and compliance with downtown noise and aesthetic standards — a template worth studying for what community leverage during the application phase can produce." },
          ],
        },
        {
          eyebrow: "What it actually cost — the loophole that survived",
          heading: "The moratorium doesn't close the door it was built to close",
          description: "",
          items: [
            { label: "By-right in I-HVY", desc: "A data center is a by-right use in Heavy Industrial districts — a developer can pull a permit with no Council vote, no Planning Commission vote, and no public hearing. The moratorium pauses new permits and rezonings until Jan. 25, 2027, but doesn't touch this underlying pathway once it lapses." },
            { label: "The closing ordinance is stalled", desc: "Stuck in committee with no hearing scheduled as of the most recent reporting. One meeting that could have taken it up was pulled from the calendar with no cancellation notice; a second handled an unrelated tax-break application instead." },
            { label: "A direct conflict at the chokepoint", desc: "Jeremy Garza — at-large councilmember, VP of UA Plumbers and Pipefitters Local 333, which publicly backed the original Deep Green project — chairs the Committee on Development and Planning, where the closing ordinance sits. He was also the lone \"no\" vote against the moratorium." },
            { label: "19 other municipalities have already closed this loophole", desc: "Including Mason, directly south of Lansing. Every week without a hearing leaves any privately owned I-HVY parcel in the city open to exactly the no-vote, no-hearing siting the moratorium was publicly sold as preventing." },
          ],
        },
        {
          eyebrow: "The energy question underneath it",
          heading: "Bloom Energy, Oracle, and a risk to monitor — not yet a documented fact",
          description: "Michigan's biggest current data center commitment — the $7B, 1.4 GW Oracle/OpenAI/Related Digital \"Stargate\" campus in Saline Township, approved by the MPSC 3–0 on Dec. 18, 2025 — is grid-supplied by DTE, not on-site fuel cells. Separately, Oracle signed an April 2026 national master agreement with Bloom Energy for up to 2.8 GW of fuel-cell capacity. On-site fuel cells let a data center skip the multi-year grid interconnection queue entirely — exactly the kind of speed advantage that would make a no-review I-HVY parcel in Lansing an unusually attractive site for this technology.",
          items: [
            { label: "No confirmed Michigan-specific Bloom deployment", desc: "As of this writing. Flagged explicitly as a risk to monitor, not an established fact — if a Bloom-partnered developer pursues a Lansing I-HVY parcel before the closing ordinance passes, the by-right pathway plus fuel-cell speed-to-power would combine to produce a facility with no local review at any stage." },
          ],
        },
      ],
      recommendations: [
        "Schedule a hearing on the I-HVY closing ordinance in the Committee on Development and Planning before the moratorium expires Jan. 25, 2027.",
        "Require Jeremy Garza to publicly address, or recuse from, the closing ordinance given Local 333's public backing of the Deep Green project.",
        "Track MPSC dockets directly for any Bloom Energy-specific Michigan filing rather than relying on national industry reporting.",
        "Get BWL's position on record for a fuel-cell-powered, off-grid data center that would require no BWL interconnection at all.",
      ],
      sources: [
        "Rhinoceros Media — data center moratorium and I-HVY loophole reporting",
        "MPSC docket — Saline Township Stargate approval, Dec. 18, 2025 (3–0)",
        "Oracle / Bloom Energy — April 2026 national master agreement reporting",
        "City of Lansing Committee on Development and Planning — meeting calendar",
      ],
      players: ["Ryan Kost", "Dr. Deyanira Nevarez Martinez", "Jeremy Garza", "Deep Green", "UA Plumbers and Pipefitters Local 333", "Lansing Board of Water & Light (BWL)", "Bloom Energy", "Oracle", "Michigan Public Service Commission (MPSC)", "DTE Energy", "Consumers Energy / CMS Energy"],
      scoreTransparency: "concerning",
      scoreConflicts: "high-risk",
      scoreMission: "ok",
      scoreDemocraticControl: "concerning",
      scoreOversight: "concerning",
    },
  });

  console.log(`Created: ${study.slug} (${study.boardName})`);
  const count = await prisma.boardCaseStudy.count();
  console.log(`Total case studies: ${count}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
