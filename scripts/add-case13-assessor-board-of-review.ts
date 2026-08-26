// Adds Case 13 (The Assessor and Board of Review — A Self-Review Loop) as a
// BoardCaseStudy row, matching the pattern of the other Full Accounting
// cases. Source: lansing-full-accounting-MASTER.md, Case 13, pasted in full
// by Jerry 2026-08-26 from the sandbox session.
//
// Deliberate framing preserved per Jerry's explicit instruction: this case
// names NO individual as having acted improperly — it's a structural
// finding about the appointment mechanism itself. Do not sharpen this into
// an accusation against the current Assessor, Mayor, or Board of Review in
// any future edit.
// Run: npx tsx scripts/add-case13-assessor-board-of-review.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const existing = await prisma.boardCaseStudy.findUnique({ where: { slug: "assessor-board-of-review" } });
  if (existing) {
    console.log("Already exists — skipping (delete it first if you want to recreate).");
    return;
  }

  const study = await prisma.boardCaseStudy.create({
    data: {
      slug: "assessor-board-of-review",
      boardName: "The Assessor and Board of Review — A Self-Review Loop",
      category: "Government Structure",
      date: "ongoing",
      published: true,
      summary: "Every property owner in Lansing who believes their tax assessment is wrong has exactly one local body to appeal to before the state: the Board of Review. Both the person who set the number being disputed (the Assessor) and the body deciding whether that number was fair (the Board of Review) are appointed by the same person — the Mayor. This is written directly into the City Charter, and the 2025 charter revision — which added real accountability infrastructure elsewhere — left this specific structure untouched.",
      neighborhoods: [],
      stats: [
        { label: "Appointer for both the valuer and the appeals body", value: "1" },
        { label: "Mayoral appointments across all boards/commissions (2024 candidate statement)", value: "200+" },
        { label: "Independent local appeal path short of the state Tax Tribunal", value: "0" },
        { label: "Changed by the 2025 charter revision", value: "No" },
      ],
      principles: [
        { num: 1, name: "Voluntary and Open Membership", violation: "Every property owner is a mandatory participant with no opt-out — appealing an assessment is the only lawful way to contest a tax bill, and the appeal body isn't independent of the office that set the number.", evidence: "Michigan General Property Tax Act, P.A. 206 of 1893, as amended — establishes the Board of Review as the sole local appeal step before the state Tax Tribunal." },
        { num: 2, name: "Democratic Member Control", violation: "Property owners have no vote in who assesses their property or who hears their appeal — both roles are filled by mayoral appointment.", evidence: "City Charter: \"the Mayor shall, after consultation with the Council, appoint... an Assessor.\"" },
        { num: 3, name: "Member Economic Participation", violation: "The financial stakes are entirely one-directional: a higher assessment means a higher tax bill for the owner and more revenue for the city whose chief executive appointed the assessor.", evidence: "Structural — the property owner has no comparable leverage in the relationship." },
        { num: 4, name: "Autonomy and Independence", violation: "The Board of Review is not autonomous from the executive branch it is meant to check.", evidence: "A 2024 candidate for Lansing's Charter Commission stated publicly, on the record with WKAR, that the Mayor appoints \"all 200+ individuals\" across the city's boards and commissions." },
        { num: 5, name: "Education, Training, and Information", violation: "Property owners are not given comparative data on how their appointed Board of Review's reversal rate compares to bodies with independent appointment structures elsewhere in Michigan.", evidence: "No such comparison has been located for this case — flagged as an open research thread, not assumed." },
        { num: 6, name: "Cooperation Among Cooperatives", violation: "No alternative dispute-resolution structure — a resident-elected review board, an independently appointed panel — appears to have been proposed or considered during the 2025 charter revision process.", evidence: "Based on the record reviewed for this case so far." },
        { num: 7, name: "Concern for Community", violation: "Proposal A's tax uncapping mechanism means assessment disputes disproportionately affect properties that have recently changed hands — often lower-income buyers and renters whose landlords pass through the cost.", evidence: "This project's own property tax structural analysis, Timeline, July 2026 additions." },
      ],
      ownership: [
        { question: "Who owns it?", before: "The Assessor's office and the Board of Review are both City of Lansing offices — public in form.", after: "Unchanged by the 2025 charter revision.", assessment: "mixed" },
        { question: "Who has power?", before: "The Mayor, who appoints both the person setting the valuation and the body reviewing it.", after: "Unchanged by the 2025 charter revision.", assessment: "extractive" },
        { question: "Who benefits?", before: "The city's revenue base benefits from higher assessments; the appointing executive controls both ends of the process that produces that revenue.", after: "Unchanged by the 2025 charter revision.", assessment: "extractive" },
        { question: "Who does the work?", before: "City assessing staff; Board of Review members serving in what is functionally a part-time, low-visibility role.", after: "Unchanged by the 2025 charter revision.", assessment: "mixed" },
        { question: "Who makes the rules?", before: "Michigan's General Property Tax Act (1893, as amended) sets the statewide framework; the City Charter sets who fills the local roles inside it.", after: "Unchanged — state law provides some outside constraint, but the local appointment structure remains entirely within the Mayor's control.", assessment: "mixed" },
      ],
      bottomLines: [
        { dimension: "People", impact: "negative", description: "A homeowner disputing an assessment has no local avenue free of the appointing executive's influence; the only fully independent recourse is the Michigan Tax Tribunal, a state body requiring a separate filing, deadline, and often legal or appraisal expertise a typical homeowner doesn't have on hand." },
        { dimension: "Planet", impact: "neutral", description: "Not applicable — this case does not have a clear environmental dimension." },
        { dimension: "Prosperity", impact: "negative", description: "Combined with the Proposal A uncapping mechanism already documented in this project, an assessment dispute lands hardest on households who've most recently purchased or whose landlord has most recently purchased — exactly the population with the least standing capital to absorb an incorrect valuation while it's being appealed." },
        { dimension: "Purpose", impact: "insufficient", description: "The Board of Review's statutory purpose is independent review. A structure where the reviewing body is appointed by the same executive whose office benefits from higher assessments does not, on its face, deliver on that purpose, regardless of whether any individual Board member has acted in bad faith — this is a structural finding, not an accusation against any named person." },
      ],
      sections: [
        {
          eyebrow: "What the community genuinely received",
          heading: "The real benefits",
          description: "",
          items: [
            { label: "A statutorily compliant process", desc: "A functioning assessment and appeals process that meets Michigan's General Property Tax Act requirements — this is not an illegal or rogue structure, it is the standard mayoral-appointment model used in many Michigan municipalities." },
            { label: "New accountability infrastructure, applied generally", desc: "The 2025 charter revision's independent internal auditor and mandatory strategic plan apply generally across city government and could, in principle, eventually surface findings relevant to assessment practices, even though it didn't restructure this specific appointment mechanism directly." },
          ],
        },
        {
          eyebrow: "The pattern",
          heading: "What it actually costs",
          description: "",
          items: [
            { label: "The appointer-appointee loop", desc: "The Mayor appoints the Assessor, whose valuations determine tax revenue. The Mayor also appoints the Board of Review, the first and only local body a property owner can appeal to. The same executive sits, in effect, on both sides of every dispute a resident might bring." },
            { label: "No independent local check", desc: "Unlike Michigan municipalities that use council appointment or resident election for review boards, Lansing's model concentrates both appointments in the same office." },
            { label: "Scale", desc: "This is not an isolated instance — it's one case inside a much larger pattern: a 2024 charter commission candidate specifically flagged that the Mayor appoints roughly 200+ individuals across all of Lansing's boards and commissions combined, campaigning explicitly on splitting that appointment power with the City Council. The Assessor/Board of Review relationship is a specific, high-stakes instance of a much broader structural concentration." },
            { label: "Untouched by the 2025 reform", desc: "The charter revision that added the internal auditor and strategic-plan requirements — both documented elsewhere in this project as still not fully implemented as of mid-2026 — did not restructure board and commission appointment authority. This specific capture point was not part of what got fixed." },
          ],
        },
        {
          eyebrow: "The accounting gap",
          heading: "A structural finding, not an accusation",
          description: "No individual is named in this case as having acted improperly — this is a structural finding about the appointment mechanism itself, not an allegation against the current Assessor, the current Mayor, or any sitting Board of Review member. That distinction is deliberate: the case for reform here doesn't depend on anyone having done anything wrong, which is arguably what makes it a cleaner example of \"process without binding independence\" than cases involving specific bad-faith actors.",
          items: [
            { label: "Open: the specific Board of Review appointment clause", desc: "Not yet located and quoted directly — this case relies on the Assessor's directly-quoted charter language plus the WKAR candidate statement's general \"200+ individuals\" figure. Confirm the Board of Review's specific appointment clause before this case is treated as fully closed." },
            { label: "Open: comparative reversal-rate data", desc: "No comparative data located yet on Lansing's Board of Review reversal rate versus municipalities with independently-appointed review boards." },
            { label: "Open: no single anchoring incident", desc: "Whether any specific assessment dispute has ever become a documented public controversy in Lansing, the way the Full Accounting's other cases each have a specific triggering incident — this case is currently structural/theoretical rather than anchored to one specific contested valuation." },
          ],
        },
      ],
      recommendations: [
        "Restructure Board of Review appointments to require City Council confirmation independent of the Mayor's nomination, or move to a City Council appointment model outright, following the pattern already used for some other Michigan municipalities' review boards.",
        "Publish the Board of Review's annual reversal rate (how often appealed assessments are adjusted) as a standing public metric, the same way the charter's new dashboard requirements apply to other city financial data.",
        "Include board-and-commission appointment authority explicitly in the next charter revision cycle (2041, per the current charter's amendment schedule) as a standing item, given a sitting charter candidate already flagged it as a priority in 2024 without it being resolved in the 2025 revision.",
      ],
      sources: [
        "City of Lansing City Charter (Chapter on administrative officers, appointment and removal provisions) — accessed via CivicPlus asset archive",
        "WKAR Public Media, \"Meet the 36 candidates running for Lansing's City Charter Commission\" (April 2024) — candidate statement on mayoral appointment scale",
        "Michigan General Property Tax Act, P.A. 206 of 1893, as amended",
        "Polycentricity.docx (Jerry Norris, 2026) — original identification of this structural finding",
        "This project's own property tax structural analysis (Timeline, July 2026 additions) for the Proposal A uncapping context",
      ],
      players: ["City of Lansing Assessor's Office", "Lansing Board of Review", "Office of the Mayor", "Lansing City Council"],
      scoreTransparency: "concerning",
      scoreConflicts: "concerning",
      scoreMission: "concerning",
      scoreDemocraticControl: "high-risk",
      scoreOversight: "high-risk",
    },
  });

  console.log(`Created: ${study.slug} (${study.boardName})`);

  // Pattern cross-references: [18] Binding Seat at the Table, [22] The Watch List
  for (const slug of ["binding-seat-at-the-table", "the-watch-list"]) {
    const pattern = await prisma.pattern.findUnique({ where: { slug } });
    if (!pattern) { console.log(`Pattern not found, skipping cross-ref: ${slug}`); continue; }
    if (pattern.caseRefs.includes(study.slug)) { console.log(`Pattern ${slug} already references this case.`); continue; }
    await prisma.pattern.update({
      where: { slug },
      data: { caseRefs: [...pattern.caseRefs, study.slug] },
    });
    console.log(`Cross-referenced from Pattern: ${slug}`);
  }

  const count = await prisma.boardCaseStudy.count();
  console.log(`Total case studies: ${count}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
