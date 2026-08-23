// Add Case 11 (NOVA Lansing Housing Initiative / ModPods) as a BoardCaseStudy row,
// matching the pattern of the other Full Accounting cases (sections + a light
// principles/ownership read, consistent with lhc-dispositions before its merge).
// Source: lansing-full-accounting-MASTER.md, Case 11 (2026-08-22 rebuild).
// Run: npx tsx scripts/add-case11-nova.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const existing = await prisma.boardCaseStudy.findUnique({ where: { slug: "nova-modpod-housing-initiative" } });
  if (existing) {
    console.log("Already exists — skipping (delete it first if you want to recreate).");
    return;
  }

  const study = await prisma.boardCaseStudy.create({
    data: {
      slug: "nova-modpod-housing-initiative",
      boardName: "NOVA Lansing Housing Initiative / ModPods",
      category: "Housing",
      date: "2025–2026 (ONGOING)",
      published: true,
      summary: "A year into planning, the city has spent an escalating, inconsistently-reported sum ($750K → $1.93M → $952K/yr → $2.9M) standing up a temporary outdoor pod community for ~66 people — and the only documented answer to \"what happens when your time here ends\" is a passive landlord-registry website. Nothing here suggests bad faith. It suggests an institution good at running meetings that still hasn't answered its own central design question.",
      neighborhoods: ["South Side"],
      stats: [
        { label: "Total cost (figures inconsistent across updates)", value: "$1.93M–$2.9M" },
        { label: "Modular pods", value: "50" },
        { label: "People housed", value: "~66" },
        { label: "Operating partner selected via", value: "Sole bidder" },
        { label: "Ingham County contribution", value: "$600K" },
        { label: "Months planning, no ground broken", value: "12+" },
      ],
      principles: [
        { num: 2, name: "Democratic Member Control", violation: "The only documented answer to \"what happens after residents' stay ends\" is a passive landlord-registry website — decided without resident input into the transition design.", evidence: "Aug. 18, 2026 community meeting, Foster Community Center — direct notes, Jerry Norris." },
        { num: 5, name: "Education, Training, and Information", violation: "No single, stable public cost figure has existed at any point in the project's life — every update has been a new, larger number, with officials calling successive figures \"not directly comparable.\"", evidence: "$750K initial estimate → $1,925,900 site/construction (July 2026) → $952,335/yr operating → $2.9M first-year all-in (separate April 2026 budget discussion)." },
        { num: 7, name: "Concern for Community", violation: "An HRCS Advisory Board member compared residents' housing transition to \"going off to college\" — an analogy assuming a financial cushion and family safety net that, by definition, most people exiting homelessness do not have.", evidence: "Aug. 18, 2026 community meeting, Foster Community Center — direct notes, Jerry Norris." },
      ],
      ownership: [
        { question: "Who owns it?", before: "City of Lansing (HRCS) + Ingham County (funding partner)", after: "Same — public asset, but operations run entirely through DRMM, a Detroit-based nonprofit selected without a documented competitive process", assessment: "mixed" },
        { question: "Who has power?", before: "HRCS Director (Kimberly Coleman, through Aug. 2025–Feb. 2026)", after: "Coleman retained as NOVA coordinator post-resignation in a non-director capacity, while interim Director Delvata Moses runs everything else — an unusual split of institutional continuity", assessment: "mixed" },
        { question: "Who benefits?", before: "Intended: ~66 people experiencing homelessness", after: "Real, but with no documented binding transition/exit-housing requirement in DRMM's contract as of this writing", assessment: "mixed" },
        { question: "Who does the work?", before: "HRCS staff", after: "Detroit Rescue Mission Ministries (DRMM) — sole bidder, ~117 years of institutional history managing unhoused populations, already runs Lansing's winter warming center", assessment: "non-extractive" },
        { question: "Who makes the rules?", before: "City Council budget approval + HRCS Advisory Board + Mayor's Neighborhood Advisory Board", after: "Same, nominally — but process without a binding delivery mechanism (no enforced timeline or cost ceiling) has produced the same cost/timeline drift seen elsewhere in this accounting, just with more public meetings along the way", assessment: "mixed" },
      ],
      sections: [
        {
          eyebrow: "What the community genuinely received",
          heading: "The real benefits",
          description: "",
          items: [
            { label: "A stated design intent beyond shelter", desc: "The city frames the program as \"a bridge from homelessness to permanent housing\" — 50 modular units housing approximately 66 people, with heating/cooling, secure entry, ADA-compliant options, a central bathroom/shower facility, a computer lab, and case management through Detroit Rescue Mission Ministries (DRMM), a Detroit-based nonprofit operating since 1909 with an existing track record running Lansing's emergency winter warming center." },
            { label: "A genuine funding partnership", desc: "Ingham County contributed $600,000 through its Housing Trust toward upfront costs — a real cross-jurisdictional commitment, not just a city-only initiative." },
            { label: "A public, iterative site-selection process", desc: "48 properties were evaluated, narrowed to 5, presented at multiple public meetings (Letts Community Center, Foster Community Center) across Nov.–Dec. 2025, with public comment genuinely shaping the outcome — parks were removed from consideration after neighborhood opposition, landing on the Ingham County Human Services building parking lot at 5303 S. Cedar St." },
          ],
        },
        {
          eyebrow: "What it actually cost",
          heading: "The real costs",
          description: "",
          items: [
            { label: "Cost escalation with no fixed ceiling in sight", desc: "Initial estimate: $750,000. By July 2026, City Council approved $1,925,900 for site prep and construction, plus $952,335/year projected operating costs. A separate April 2026 budget discussion put the first-year all-in total closer to $2.9 million — city officials said the figures \"are not directly comparable,\" which may be accurate, but no single stable public number has existed at any point in the project's life." },
            { label: "No fixed timeline, over a year in", desc: "HRCS (under Director Kimberly Coleman) has worked on this \"since August 2025.\" As of the August 2026 update, WLNS reported \"no exact timeline for installation\" — over a year of planning with construction still not begun." },
            { label: "Leadership discontinuity mid-project", desc: "Coleman announced her resignation Feb. 2, 2026 (effective Feb. 13) — six months into the project's most consequential planning year, before construction began. No wrongdoing reported; Mayor Schor's office cited personal reasons. She was retained specifically to keep coordinating NOVA in a non-director capacity while Deputy Director Delvata Moses became interim HRCS director for everything else — an unusual split. Context: Coleman's own predecessor, Joan Jackson Johnson, retired in Feb. 2020 amid a HUD audit finding undisclosed department funding to charities connected to her — a different, more serious situation, but the department's last two full-time directors have both left mid-tenure under some form of unplanned circumstance." },
            { label: "The sole-bidder defense, paraphrased", desc: "When the sole-bidder question was raised, Coleman defended DRMM's qualification by citing roughly 115 years of institutional history — DRMM's actual founding (1909) is closer to 117 years as of 2026, close enough to read as a rounded reference. This is Coleman's paraphrased framing, not a verified direct quote, until an exact wording is available." },
            { label: "The transition-out plan", desc: "At the Aug. 18, 2026 community update meeting, Foster Community Center, when asked what happens to residents after their 6-month-to-2-year stay, the answer given was a website landlords can register properties on. One HRCS Advisory Board member compared the transition to \"going off to college.\" When asked directly, the full panel affirmed housing is a human right — the stated value and the operational mechanism do not match." },
            { label: "The pods themselves are secondhand", desc: "Purchased from a failed Kalamazoo nonprofit's own attempt at this model, at auction — not designed and built for Lansing's program from the outset." },
          ],
        },
        {
          eyebrow: "The accounting gap",
          heading: "\"Committed, not yet spent\" — and a direct link to Case 10",
          description: "During the Dec. 2025 public comment period, at least one resident raised a fact connecting this case directly to Case 10 (Ingham Medical/Sparrow): McLaren reportedly offered its vacant Greenlawn hospital building to the city for free, around 2021 — the same 1930 structure built with Ingham County public money as the original tuberculosis sanitorium, now being demolished. If real and lapsed, this is a documented instance of the drift pattern this whole accounting tracks: a reusable public asset sat idle and is now being erased, while new public money is spent solving an overlapping problem elsewhere. This needs direct verification with the city or McLaren before it goes further — currently sourced to a single public comment, not a primary source.\n\nSeparately: the program was sold to Council on the premise of a genuine path to permanent housing. A year into planning, the only documented answer to \"what happens next\" is a passive landlord-registry website. Public money has been approved and partially disbursed, a public-private partnership structure is in place — and the single most important question for anyone who will actually live here does not yet have a real answer. Process without a binding delivery mechanism still produces drift, even with genuine public meetings along the way.",
          items: [
            { label: "McLaren Greenlawn free-offer claim — UNVERIFIED", desc: "Needs direct confirmation of terms, timing, and why it wasn't pursued." },
            { label: "Open: full cost reconciliation", desc: "$750K → $1.93M → $952K/yr → $2.9M — no single dated cost history exists yet." },
            { label: "Open: DRMM contract terms", desc: "Whether the contract includes any binding transition/exit-housing requirement, or whether the landlord registry is the entirety of the plan." },
          ],
        },
      ],
      recommendations: [
        "Require a single, dated, reconciled cost figure published before each budget vote — not successive \"not directly comparable\" numbers.",
        "Require DRMM's operating contract to include a binding, funded transition/exit-housing plan, not a passive landlord registry, before occupancy begins.",
        "Verify the McLaren Greenlawn free-offer claim directly with the city and McLaren — confirm or retire it as a documented missed-opportunity finding.",
        "Set a public ground-breaking and occupancy deadline with reporting consequences if missed, matching the accountability gap named throughout this project.",
      ],
      sources: [
        "WLNS 6 News and WILX News 10 — NOVA Lansing Housing Initiative cost and timeline reporting, 2025–2026",
        "City of Lansing — NOVA Lansing Housing Initiative public comment document, Dec. 18, 2025",
        "CBS News Detroit — NOVA program description, HRCS Director Kimberly Coleman",
        "Detroit Rescue Mission Ministries (drmm.org) — organizational history",
        "Jerry Norris — direct notes, Aug. 18, 2026 NOVA community update meeting, Foster Community Center",
      ],
      players: ["Human Relations & Community Services (HRCS)", "Kimberly Coleman", "Delvata Moses", "Joan Jackson Johnson", "Detroit Rescue Mission Ministries (DRMM)", "Chad Audi", "Dr. Deyanira Nevarez Martinez", "Ingham County Housing Trust"],
      scoreTransparency: "concerning",
      scoreConflicts: "insufficient",
      scoreMission: "concerning",
      scoreDemocraticControl: "ok",
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
