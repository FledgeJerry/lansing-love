import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const slug = "lansing-chamber-pac";

  const updated = {
    summary: "The Lansing Regional Chamber of Commerce operates a PAC that has funded 6 of 8 sitting city council members ($500–$10,600 each), while filing tax returns that report zero political campaign activity. The Chamber's CEO Tim Daman holds five officer roles across four related entities, signed contradictory federal tax returns on a $113,446 asset transfer, and serves simultaneously as PAC treasurer — a structural concentration of control that eliminates independent governance oversight. The PAC ended 2025 with a negative bank balance. Eight documented findings, all based on public records and independently verifiable.",

    stats: [
      { value: "6 of 8",    label: "Council members funded by the PAC" },
      { value: "5",          label: "Officer roles Tim Daman holds across 4 entities" },
      { value: "$113,446",  label: "Asset transfer with contradictory tax filings — strongest finding" },
      { value: "$0",         label: "Political activity reported on IRS 990 (vs. reality)" },
      { value: "63%",        label: "Top donors living outside Lansing city limits" },
      { value: "-$1,601",   label: "PAC bank balance, December 31, 2025" },
      { value: "$181,253",  label: "Tim Daman annual compensation" },
      { value: "25:1",       label: "Greenlee Consulting: payments received vs. personal donations" },
    ],

    principles: [
      {
        num: 1,
        name: "Voluntary and Open Membership",
        violation: "1,054 businesses listed in the Chamber directory. 21 are part of the donor/vendor/governance network. The remaining 1,033 pay dues but have never funded the PAC. The membership application does not disclose the PAC — members whose dues pay Chamber salaries have not been given notice at the point of dues collection.",
        evidence: "Chamber membership signup pages do not disclose affiliated entities. PAC FAQ page is currently a 404 error. Notice may be required under IRC § 6033(e).",
      },
      {
        num: 2,
        name: "Democratic Member Control",
        violation: "Tim Daman holds five officer roles across four entities simultaneously. Each entity is supposed to have its own board exercising independent judgment. When the same person sits on every side of every transaction, conflict-of-interest review becomes a formality. LRC-PAC's 92% primary endorsement win rate shapes who holds the council seats that the Chamber then advocates before.",
        evidence: "ProPublica EIN 38-0745180; Michigan LARA ID 800872623; MiTN Committee 000516.",
      },
      {
        num: 3,
        name: "Member Economic Participation",
        violation: "Consulting firms paid by the PAC also donate to it. Greenlee Consulting received $40,786 in PAC vendor payments while its owner donated ~$1,600 and sits on the Advance Greater Lansing board. 25:1 ratio of payments received to personal donations — textbook self-dealing under IRS § 4958.",
        evidence: "MiTN Committee 000516 expenditure and contribution records.",
      },
      {
        num: 4,
        name: "Autonomy and Independence",
        violation: "Chamber CEO serves as PAC treasurer. Chamber SVP manages PAC operations from the Chamber's email domain. Chamber invoices the PAC $5,052 for design, events, and Facebook ads. Chamber legal counsel simultaneously serves as a Chamber board director and personal PAC donor. Adrian Hemond simultaneously advises the Mayor, city unions, and the Chamber PAC — conflict built into the consulting structure.",
        evidence: "MiTN Committee 000516; LRCC 2024 Form 990.",
      },
      {
        num: 5,
        name: "Education, Training, and Information",
        violation: "The Chamber's 2024 Form 990 reports zero political campaign activity despite operating a PAC whose treasurer is the CEO and whose operations are managed from the Chamber's email domain and invoiced by the Chamber. This is a facial misstatement on a return signed under penalty of perjury.",
        evidence: "LRCC 2024 Form 990 Part IV Line 3; MiTN Committee 000516; Chamber invoices to PAC ($5,052).",
      },
      {
        num: 6,
        name: "Cooperation Among Cooperatives",
        violation: "Chamber coordinates with Consumers Energy dark money network, Bellwether PR astroturf operations, and $43.5M anonymous funding infrastructure. PAC connects to The Soft Edge Inc. (McLean, VA) template-letter campaign. No cooperation with community organizations or cooperative alternatives documented.",
        evidence: "Rhinoceros Media six-part investigation; 58% of Deep Green support letters from Chamber-affiliated individuals.",
      },
      {
        num: 7,
        name: "Concern for Community",
        violation: "63% of the PAC's top 30 individual donors live outside Lansing city limits but fund Lansing city council races. 200+ Lansing residents opposed Deep Green at the Feb 10, 2026 hearing; Chamber-manufactured support overrode them. $113,446 in charitable foundation assets transferred to a business league.",
        evidence: "MiTN Committee 000516 donor addresses; Rhinoceros Media Feb 10 hearing documentation.",
      },
    ],

    ownership: [
      { question: "Who owns it?",       before: "Community (city zoning, development decisions, public contracts)",  after: "Chamber-funded council majority; Chamber donor network living 63% outside city limits", assessment: "extractive" },
      { question: "Who has power?",     before: "Elected council (nominally)",                                        after: "Tim Daman (five roles, four entities); LRC-PAC (92% primary win rate shapes who holds the seats)", assessment: "extractive" },
      { question: "Who benefits?",      before: "Community",                                                          after: "Chamber members, preferred developers, consulting firms (Greenlee: 25:1 payments-to-donations ratio)", assessment: "extractive" },
      { question: "Who does the work?", before: "City staff, elected officials",                                       after: "Bellwether PR, The Soft Edge astroturf operation, Hemond consulting — behind-the-scenes influence at every level", assessment: "extractive" },
      { question: "Who makes the rules?", before: "Charter and state law",                                            after: "City attorney narrowing conflict standards; PAC funding the people who enforce the rules", assessment: "extractive" },
    ],

    bottomLines: [
      { dimension: "People",     impact: "negative", description: "200+ residents opposed Deep Green and were overridden by Chamber-manufactured support. 1,033 Chamber member businesses fund the PAC without disclosure at the point of dues collection." },
      { dimension: "Planet",     impact: "mixed",    description: "Chamber advocacy promoted the Deep Green data center over documented community environmental preference. Dark money connections extend to Consumers Energy ratepayer interests." },
      { dimension: "Prosperity", impact: "negative", description: "$43.5M dark money network extracts community trust and democratic legitimacy. $113,446 charitable foundation assets transferred to a business league with zero independent directors." },
      { dimension: "Purpose",    impact: "negative", description: "Chamber's business development mission corrupts civic governance by funding oversight of decisions the Chamber wants to influence. CEO simultaneously holds PAC Treasurer role, signed contradictory federal tax returns, and earns $181,253 — a structural conflict operating in public view." },
    ],

    scoreTransparency:      "high-risk" as const,
    scoreConflicts:         "high-risk" as const,
    scoreMission:           "insufficient" as const,
    scoreDemocraticControl: "high-risk" as const,
    scoreOversight:         "high-risk" as const,

    sections: [
      {
        eyebrow: "The strongest single finding",
        heading: "Contradictory tax filings on a $113,446 transfer",
        description: "Both returns are signed under penalty of perjury. One is false on its face.",
        items: [
          { label: "The Foundation's 990-EZ", desc: "Answers 'No' to the question asking whether it had transferred assets to an exempt non-charitable related organization — in the same year it transferred $113,446 to the Chamber." },
          { label: "The Chamber's Schedule R", desc: "Confirms receiving exactly $113,446 from the Foundation in 2023. Tim Daman signed both returns as President of both entities." },
          { label: "The legal exposure", desc: "Filing a false federal return is a federal felony under 26 U.S.C. § 7206(1) (up to three years imprisonment and a $100,000 fine). Transferring substantially all of a 501(c)(3)'s assets to a non-charitable 501(c)(6) also raises Michigan charitable trust concerns enforceable by the AG under MCL 14.251." },
        ],
      },
      {
        eyebrow: "The dark money network",
        heading: "$43.5M from Consumers Energy reaches City Hall",
        description: "The Chamber is one node in a larger network. Consumers Energy funneled $43.5M (2014–2017) through anonymous nonprofits. That network reaches directly into Lansing city decisions.",
        items: [
          { label: "Reid Felsing", desc: "Attorney and dark money network architect. Quote: 'The beauty of the C4 is the anonymity of money coming in.' Appointed to Eaton County District Court bench (January 2025)." },
          { label: "Adrian Hemond", desc: "CEO, Grassroots Midwest consulting. Simultaneously advises the Mayor, city unions, and the Chamber PAC that funds 7 of 8 council members. Conflict embedded in the consulting structure.", url: "https://lrc-pac.vercel.app/" },
          { label: "Josh Hovey / Bellwether PR", desc: "PAC committee member and former Planning Commissioner. Now lobbies the Planning Commission as paid consultant. Managed the Michigan for Responsible Data Centers astroturf coalition while representing Deep Green.", url: "https://zoning-one.vercel.app/" },
          { label: "The Soft Edge Inc.", desc: "McLean, VA template-letter operation used to manufacture apparent community support. Check PAC and Chamber expenditure records for payments to 'Soft Edge' or 'Congress Plus' — contract not yet identified." },
        ],
      },
      {
        eyebrow: "Explore the data",
        heading: "Interactive tools from this investigation",
        description: "Gaia Solutions built public tools from the same OSINT investigation behind this case study.",
        items: [
          { label: "LRC-PAC Zoning Investigation", desc: "Deep mapping of developer relationships and zoning decisions across Lansing's political landscape.", url: "https://lrc-pac.vercel.app/" },
          { label: "Deep Green Relationship Map", desc: "OSINT-built network graph tracing relationships between environmental orgs, funders, and policy actors in the Deep Green approval.", url: "https://zoning-one.vercel.app/" },
        ],
      },
    ],

    recommendations: [
      "Require council members to disclose PAC funding from organizations appearing before them and recuse on relevant votes",
      "File IRS Form 13909 complaint on two grounds: the contradictory transfer filings and the zero-political-activity claim",
      "File Michigan AG complaint on the $113,446 charitable asset transfer to a business league under MCL 14.251",
      "File Michigan Attorney Grievance Commission complaint on Chamber legal counsel's concurrent roles",
      "Adopt a small-donor public financing ordinance — the route Seattle and San Jose used to dilute concentrated PAC influence",
      "Support council members Hussain and Kost in sponsoring a disclosure ordinance requiring candidates to report what percentage of campaign funds come from non-city-residents",
      "Require disclosure of all advocacy platform campaigns generating template letters submitted as public comment",
      "Pass a proactive disclosure ordinance — publish meeting communications before being FOIA'd, making manufactured consent visible in real time",
    ],

    sources: [
      "Rhinoceros Media. \"How the Chamber's PAC Shapes Who Governs and What Gets Built\" (6-part series).",
      "Rhinoceros Media. \"How Consumers Energy's $43 Million Dark Money Operation Reaches Lansing City Hall.\"",
      "Michigan Department of State campaign finance filings — LRC-PAC Committee 000516 (2024–2025).",
      "IRS Form 990, Lansing Regional Chamber of Commerce (2024). ProPublica EIN 38-0745180.",
      "IRS Form 990-EZ, Lansing Regional Development Foundation (2023). EIN 38-2390996.",
      "FEC committee database search — no LRC-PAC filings found.",
      "Michigan LARA business entity records — Advance Greater Lansing, ID 800872623.",
    ],

    sourceUrls: [
      "https://rhinocerosmedia.org/lrc-pac-chamber-machine",
      "https://rhinocerosmedia.org/consumers-energy-dark-money-lansing",
      "https://lrc-pac.vercel.app/",
      "https://zoning-one.vercel.app/",
    ],
  };

  await prisma.boardCaseStudy.update({ where: { slug }, data: updated });
  console.log(`✓ Updated: ${slug}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
