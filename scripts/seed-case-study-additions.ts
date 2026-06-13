import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// ─── Two new case studies ─────────────────────────────────────────────────────

const newStudies = [
  {
    slug: "bwl",
    boardName: "Lansing Board of Water & Light",
    category: "Utilities",
    date: "June 2026",
    published: true,
    summary: "The Lansing Board of Water & Light is a publicly owned utility serving 100,000+ electric and water customers — the most financially significant public institution in the city. Its board is appointed exclusively by the Mayor, with no elected seats, no community confirmation vote, and no enforced term limits. Nine BWL employees donated $6,000 to the Lansing Regional Chamber PAC within 48 hours in March 2022, and BWL's CFO joined the Chamber board in 2026 and publicly testified in favor of the Deep Green data center — a proposed major commercial customer — without disclosing the conflict. The structure that allows this is the same mayoral appointment monopoly that governs every Lansing board.",
    stats: [
      { value: "0",      label: "Elected seats on board" },
      { value: "9",      label: "BWL employees who donated to LRC-PAC in 48 hours" },
      { value: "$6,000", label: "Donated to council members' PAC — March 2022" },
      { value: "Mayor",  label: "Sole appointing authority — no community vote" },
      { value: "100K+",  label: "Ratepayer accounts served" },
      { value: "0",      label: "Required disclosures for Chamber board membership" },
    ],
    principles: [
      { num: 1, name: "Voluntary and Open Membership", violation: "BWL is a natural monopoly. Lansing ratepayers have no alternative provider for electricity or water — and no mechanism to influence board selection or composition.", evidence: "Michigan law grants BWL exclusive utility territory. Ratepayers cannot opt out and have no board appointment vote." },
      { num: 2, name: "Democratic Member Control", violation: "The Mayor appoints all board members. No elected seats exist. Charter reform to add elected seats and enforce term limits has been proposed but not passed.", evidence: "Lansing City Charter — Board of Water & Light governance provisions. Charter reform is on the same ballot-required track as all appointed board reforms." },
      { num: 3, name: "Member Economic Participation", violation: "Rate decisions, capital investment plans, and major commercial customer agreements (like a potential Deep Green data center contract) are set by an appointed board with no electoral accountability.", evidence: "Rate increases go to the BWL board, not to a public vote. Ratepayers have no formal standing in capital agreement decisions." },
      { num: 4, name: "Autonomy and Independence", violation: "BWL CFO Heather Shawa joined the Lansing Regional Chamber of Commerce board in 2026 and testified in favor of the Deep Green data center — a potential major BWL electricity customer. This connection was not disclosed when she testified.", evidence: "Chamber 2026 board roster includes Shawa. Rhinoceros Media documented her testimony. No recusal or conflict disclosure occurred." },
      { num: 5, name: "Education, Training, and Information", violation: "Nine BWL employee donations to LRC-PAC in 48 hours suggest coordination, but no policy requires disclosure of PAC coordination by utility employees or board members. Ratepayers have no visibility into these relationships.", evidence: "Michigan Department of State campaign finance filings — LRC-PAC (March 2022). No BWL coordination disclosure policy documented." },
      { num: 6, name: "Cooperation Among Cooperatives", violation: "BWL operates as an isolated municipal utility. No participation in energy democracy initiatives, regional cooperative frameworks, or ratepayer ownership structures.", evidence: "No documented community ownership model, ratepayer board, or cooperative energy partnership." },
      { num: 7, name: "Concern for Community", violation: "The Deep Green data center, supported by BWL leadership via the Chamber, would significantly increase BWL's commercial load — raising energy demand and long-term rate implications for all residential ratepayers.", evidence: "Deep Green opposed by 200+ residents at Feb 10, 2026 hearing. BWL's public support, through Shawa's Chamber role and testimony, was not disclosed as a utility position." },
    ],
    ownership: [
      { question: "Who owns it?",       before: "City of Lansing — all ratepayers",               after: "Operationally: Mayor appointees; informally: Chamber network through strategic hires and PAC donations", assessment: "extractive" },
      { question: "Who has power?",     before: "Board (nominally public)",                        after: "Mayor (appointments); Chamber network (CFO membership, PAC connections)", assessment: "extractive" },
      { question: "Who benefits?",      before: "100K+ ratepayers (utility service)",              after: "Chamber-connected commercial customers (potential favorable rate treatment); PAC-funded council members (control BWL budget/appointments)", assessment: "mixed" },
      { question: "Who does the work?", before: "BWL professional staff",                          after: "BWL professional staff — well-regarded operation. The issue is governance, not management.", assessment: "non-extractive" },
      { question: "Who makes the rules?", before: "Board + Michigan utility law",                  after: "Mayor-appointed board; Chamber network has informal influence through CFO membership and PAC connections", assessment: "extractive" },
    ],
    bottomLines: [
      { dimension: "People",     impact: "negative",      description: "100K+ ratepayers have no voice in board composition or rate decisions. Natural monopoly with no democratic accountability mechanism." },
      { dimension: "Planet",     impact: "insufficient",  description: "BWL has renewable energy commitments. Whether Chamber-connected commercial customer pressure (e.g. Deep Green's energy load) affects those commitments is not publicly assessed." },
      { dimension: "Prosperity", impact: "mixed",         description: "BWL is financially sound — a genuine public asset. But rate decisions and commercial deals are made without ratepayer input, and the Chamber network has informal influence over both." },
      { dimension: "Purpose",    impact: "negative",      description: "A publicly owned utility requires democratic accountability to serve its ratepayers over commercial interests. Mayoral appointment monopoly and Chamber network connections undermine this mission structurally." },
    ],
    scoreTransparency:      "concerning" as const,
    scoreConflicts:         "high-risk" as const,
    scoreMission:           "ok" as const,
    scoreDemocraticControl: "high-risk" as const,
    scoreOversight:         "concerning" as const,
    sections: [
      {
        eyebrow: "The governance gap",
        heading: "Publicly owned, democratically unaccountable",
        description: "BWL is Lansing's most financially significant public institution. Its board is appointed exclusively by the Mayor — no community confirmation vote, no elected seats, no enforced term limits. Every governance failure that applies to appointed boards in Lansing applies here, at scale.",
        items: [
          { label: "Mayoral monopoly", desc: "All board members serve at the Mayor's pleasure. Terms exist on paper; enforcement is at mayoral discretion. No community confirmation required." },
          { label: "Scale of impact",  desc: "BWL rate decisions, capital investments, and major commercial customer agreements affect every Lansing ratepayer directly. None of these decisions are subject to a public vote." },
          { label: "Charter reform path", desc: "Adding elected seats and enforced terms requires a charter amendment and public vote — the same track as all Lansing appointed board reforms. It has not advanced." },
        ],
      },
      {
        eyebrow: "The Chamber connection",
        heading: "Two documented links between BWL and LRC-PAC",
        description: "The Chamber PAC funds 6 of 8 city council members who set BWL's budget and hold appointment authority. These connections are documented — their full effect is not.",
        items: [
          { label: "Nine employees, 48 hours, $6,000", desc: "In March 2022, nine BWL employees donated $6,000 to LRC-PAC within 48 hours. No coordination policy exists requiring disclosure. The same PAC endorses the council members who approve BWL's budget.", url: "https://lrc-pac.vercel.app/" },
          { label: "CFO Heather Shawa — Chamber board + Deep Green testimony", desc: "Shawa joined the Chamber's 2026 board and testified publicly in support of the Deep Green data center — a proposed major BWL electricity customer. No recusal or conflict disclosure occurred at the time of testimony." },
        ],
      },
    ],
    recommendations: [
      "Charter amendment: Add elected ratepayer seats to the BWL board with enforced term limits",
      "Require BWL executives and board members to disclose Chamber of Commerce membership and recuse from votes involving Chamber-sponsored projects",
      "Require public disclosure when BWL employees donate to PACs that fund council members who set BWL's budget and appointment authority",
      "Establish a Ratepayer Advisory Board with formal standing to review rate increase proposals before board vote",
      "Publish annual financial disclosures for all BWL board members and senior executives",
    ],
    sources: [
      "Rhinoceros Media. \"How the Chamber's PAC Shapes Who Governs and What Gets Built\" (6-part series).",
      "Michigan Department of State campaign finance filings — LRC-PAC (2022–2025).",
      "Lansing City Charter — Board of Water & Light governance provisions.",
      "Chamber of Commerce 2026 Board roster (public).",
    ],
    sourceUrls: ["https://rhinocerosmedia.org/lrc-pac-chamber-machine", "https://lrc-pac.vercel.app/"],
  },

  {
    slug: "development-planning",
    boardName: "Lansing Planning Commission & Economic Development",
    category: "Planning",
    date: "June 2026",
    published: true,
    summary: "Lansing's development and planning apparatus — the Planning Commission, the Economic Development office, and the Land Bank — share three officials who simultaneously hold roles across multiple bodies without required conflict disclosure. Rawley Van Fossen directs both Economic Development and Planning for the city, serves as Land Bank treasurer, and is a former executive director of Capital Area Housing Partnership (a preferred Land Bank partner). Josh Hovey of Bellwether PR served as a Planning Commissioner and now lobbies the same commission as a paid consultant. The manufactured consent operation around the Deep Green data center — 200+ residents opposed, 58% of formal support letters from Chamber-affiliated individuals — demonstrates how the planning process can be made to appear legitimate while systematically overriding community preference.",
    stats: [
      { value: "3",    label: "Officials with overlapping roles across planning bodies" },
      { value: "200+", label: "Residents who opposed Deep Green at Feb 10, 2026 hearing" },
      { value: "58%",  label: "Deep Green support letters from Chamber-affiliated individuals" },
      { value: "1",    label: "Former Planning Commissioner now paid to lobby the same commission" },
      { value: "0",    label: "Required conflict disclosures for Planning Commission members" },
      { value: "$0",   label: "Community benefit agreements documented on Chamber-backed approvals" },
    ],
    principles: [
      { num: 1, name: "Voluntary and Open Membership", violation: "Residents who want input on land use decisions can attend public hearings, but the outcome is shaped by the same network of insiders before and after the hearing. The Deep Green hearing (200+ opposed) demonstrated that public opposition can be neutralized by manufactured support.", evidence: "Feb 10, 2026 hearing: 200+ residents opposed Deep Green. Chamber advocacy platform generated support letters; 58% came from Chamber-affiliated individuals (Rhinoceros Media analysis)." },
      { num: 2, name: "Democratic Member Control", violation: "Planning Commission is entirely mayoral-appointed. Josh Hovey's transition from Planning Commissioner to paid lobbyist before the same commission demonstrates the revolving door between decision-making and financial benefit.", evidence: "Josh Hovey: served as Planning Commissioner; now CEO of Bellwether PR lobbying the same commission for clients including Deep Green. No waiting period or lobbying prohibition documented." },
      { num: 3, name: "Member Economic Participation", violation: "Development decisions route public benefits — land, tax incentives, zoning approvals — to Chamber-connected developers without competitive community benefit analysis. Land Bank parcels go to CAHP (Van Fossen's former employer) through a circular insider arrangement.", evidence: "Van Fossen directs Economic Development + Planning + sits on Land Bank board whose preferred partner is CAHP, where he was formerly executive director." },
      { num: 4, name: "Autonomy and Independence", violation: "Three officials simultaneously hold roles across the planning system, the Land Bank, and organizations that are preferred development partners. Independent judgment is structurally compromised when the same person directs Economic Development, sits on the Land Bank board, and formerly ran the Land Bank's preferred housing partner.", evidence: "Van Fossen: City Director of Economic Development and Planning + Land Bank treasurer + former CAHP executive director. CAHP receives below-market Land Bank parcels." },
      { num: 5, name: "Education, Training, and Information", violation: "The manufactured consent operation around Deep Green (Chamber advocacy platform generating template letters, 58% from affiliates, Chamber homepage linking to the campaign without disclosure) shows the public record submitted to planning bodies can be systematically shaped before a vote.", evidence: "Rhinoceros Media: 58% of Deep Green support letters from Chamber-affiliated individuals. Chamber homepage linked directly to advocacy campaign without disclosure of institutional interest." },
      { num: 6, name: "Cooperation Among Cooperatives", violation: "The planning apparatus cooperates internally with the Chamber network and preferred developers. Neighborhood groups, community organizations, and residents who testified in opposition to Deep Green had no formal standing comparable to the Chamber's organized advocacy operation.", evidence: "No community benefit agreement process documented for Chamber-backed developments. 200+ resident opposition did not trigger a formal community impact review." },
      { num: 7, name: "Concern for Community", violation: "Deep Green was approved over documented majority community opposition at a public hearing. The planning and economic development apparatus does not have a mechanism to weigh concentrated community preference against concentrated developer interest — and the same officials who shape planning policy benefit from development relationships.", evidence: "Deep Green approved by Chamber-funded Council majority. Planning and Economic Development director (Van Fossen) sits on Land Bank board that disposes of related parcels." },
    ],
    ownership: [
      { question: "Who owns it?",       before: "City of Lansing — public planning and land use authority",  after: "Chamber-connected insiders who hold overlapping roles across planning, economic development, and land banking", assessment: "extractive" },
      { question: "Who has power?",     before: "Elected council + appointed Planning Commission",           after: "Van Fossen (director + Land Bank); Hovey (former commissioner → lobbyist); Chamber PAC (funds council members who confirm appointments)", assessment: "extractive" },
      { question: "Who benefits?",      before: "Community (distributed development benefits)",              after: "Chamber-preferred developers; CAHP (circular arrangement with Van Fossen's prior role)", assessment: "extractive" },
      { question: "Who does the work?", before: "City planning staff",                                       after: "City planning staff — professional operation. The issue is who shapes the decisions above them.", assessment: "non-extractive" },
      { question: "Who makes the rules?", before: "Planning Commission + city code",                         after: "Van Fossen (Economic Development director sets deal pipeline); Hovey (shapes what reaches commission); Chamber PAC (funds council members who confirm appointments)", assessment: "extractive" },
    ],
    bottomLines: [
      { dimension: "People",     impact: "negative",  description: "200+ residents opposed Deep Green and were overridden. Planning process has no mechanism to weight sustained community opposition against developer interest backed by Chamber advocacy." },
      { dimension: "Planet",     impact: "mixed",     description: "Deep Green data center raises significant energy and water demands. Planning approval did not include documented environmental equity analysis. Land Bank demolition-heavy model (2.7:1 ratio) reduces housing density." },
      { dimension: "Prosperity", impact: "negative",  description: "Public benefits — land, zoning, tax incentives — flow to Chamber-preferred developers without community benefit agreements. Below-market Land Bank parcels go to insider-connected partners." },
      { dimension: "Purpose",    impact: "negative",  description: "Planning should distribute development benefits. The current structure concentrates them among insider-connected developers while providing a formal public hearing process that can be overridden by manufactured consent." },
    ],
    scoreTransparency:      "high-risk" as const,
    scoreConflicts:         "high-risk" as const,
    scoreMission:           "concerning" as const,
    scoreDemocraticControl: "concerning" as const,
    scoreOversight:         "high-risk" as const,
    sections: [
      {
        eyebrow: "The revolving door",
        heading: "Three officials, multiple bodies, no required disclosure",
        description: "",
        items: [
          { label: "Rawley Van Fossen — three simultaneous roles", desc: "City Director of Economic Development and Planning (sets planning policy and deal pipeline) + Land Bank board treasurer (approves land dispositions) + former CAHP executive director (CAHP is a preferred Land Bank partner receiving below-market parcels). All three roles interact directly. No conflict disclosure required." },
          { label: "Josh Hovey / Bellwether PR — commissioner to lobbyist", desc: "Served as Lansing Planning Commissioner. Now CEO of Bellwether PR, lobbying the same Planning Commission as a paid consultant for clients including Deep Green and managing the Michigan for Responsible Data Centers astroturf coalition. No documented waiting period or lobbying prohibition." },
          { label: "Adrian Hemond / Grassroots Midwest — everywhere simultaneously", desc: "Simultaneously advises the Mayor, city unions, and the Chamber PAC that funds 7 of 8 council members — including those who confirm planning appointments and approve development projects. Conflict built into the consulting structure, not an oversight." },
        ],
      },
      {
        eyebrow: "Deep Green as case study",
        heading: "How manufactured consent works in practice",
        description: "The Deep Green data center approval demonstrates how the planning process can be made to appear legitimate while systematically overriding community preference.",
        items: [
          { label: "Step 1 — Chamber generates support", desc: "Chamber homepage linked directly to Deep Green advocacy campaign without disclosing institutional interest. Bellwether PR (Hovey) managed the Michigan for Responsible Data Centers coalition. 58% of formal support letters came from Chamber-affiliated individuals.", url: "https://zoning-one.vercel.app/" },
          { label: "Step 2 — 200+ residents oppose at public hearing", desc: "Feb 10, 2026 hearing: documented majority opposition from Lansing residents. Opposition was genuine and organized. Outcome: overridden." },
          { label: "Step 3 — Chamber-funded Council majority approves", desc: "6 of 8 council members received LRC-PAC funding. The same PAC's endorsed majority approved Deep Green over community objection. No community benefit agreement documented." },
        ],
      },
    ],
    recommendations: [
      "Require Planning Commission members and Economic Development staff to disclose all financial relationships with entities that appear before them — and recuse from relevant votes",
      "Adopt a post-service lobbying prohibition: former Planning Commissioners should not lobby the commission for a defined period after service",
      "Require community benefit agreements for all large commercial developments receiving city land, tax incentives, or zoning variances",
      "Establish an independent community review process for developments with documented majority opposition at public hearings",
      "Prohibit single officials from simultaneously holding roles across planning, land banking, and organizations that benefit from land bank dispositions",
    ],
    sources: [
      "Rhinoceros Media. \"How the Chamber's PAC Shapes Who Governs and What Gets Built\" (6-part series).",
      "Ingham County Land Bank board minutes (2020–2026) — Van Fossen treasurer role.",
      "Lansing Planning Commission records — Hovey service dates and current client list.",
      "Michigan for Responsible Data Centers public filings.",
    ],
    sourceUrls: ["https://rhinocerosmedia.org/lrc-pac-chamber-machine", "https://zoning-one.vercel.app/", "https://lrc-pac.vercel.app/"],
  },
];

// ─── Gaia.solutions tool links for existing case studies ──────────────────────

const gaiaLinks: { slug: string; section: object; urls: string[] }[] = [
  {
    slug: "flock-surveillance",
    section: {
      eyebrow: "Explore the data",
      heading: "Interactive tools from this investigation",
      description: "Gaia Solutions built a public map tracking ALPR deployment across mid-Michigan, drawing on the same investigation behind this case study.",
      items: [
        { label: "ALPR Surveillance Map", desc: "Track license plate reader deployment across mid-Michigan — camera locations, agency ownership, and known misuse incidents.", url: "https://alpr-eight.vercel.app/" },
      ],
    },
    urls: ["https://alpr-eight.vercel.app/"],
  },
  {
    slug: "lansing-chamber-pac",
    section: {
      eyebrow: "Explore the data",
      heading: "Interactive tools from this investigation",
      description: "Two public tools let you explore the Chamber PAC network and the Deep Green relationship map built from the same OSINT investigation.",
      items: [
        { label: "LRC-PAC Zoning Investigation", desc: "Deep mapping of developer relationships and zoning decisions across Lansing's political landscape — follow the money, not the narrative.", url: "https://lrc-pac.vercel.app/" },
        { label: "Deep Green Relationship Map", desc: "OSINT-built network graph tracing relationships between environmental orgs, funders, and policy actors in the Deep Green approval.", url: "https://zoning-one.vercel.app/" },
      ],
    },
    urls: ["https://lrc-pac.vercel.app/", "https://zoning-one.vercel.app/"],
  },
  {
    slug: "lansing-housing-commission",
    section: {
      eyebrow: "Explore the data",
      heading: "Interactive tools from this investigation",
      description: "Public tools mapping Lansing's housing affordability crisis — the context in which the LHC privatization happened.",
      items: [
        { label: "Lansing Housing Tracker", desc: "Permit data, affordability trends, and displacement risk by neighborhood — tracking the conditions that make public housing privatization consequential.", url: "https://lansing-housing.vercel.app/" },
        { label: "Redlined: Lansing MI", desc: "Historical HOLC redlining boundaries overlaid with current housing data. The LHC's south-side properties sit in neighborhoods with the deepest redlining legacy.", url: "https://redlining-six.vercel.app/" },
      ],
    },
    urls: ["https://lansing-housing.vercel.app/", "https://redlining-six.vercel.app/"],
  },
  {
    slug: "ingham-county-land-bank",
    section: {
      eyebrow: "Explore the data",
      heading: "Interactive tools from this investigation",
      description: "Public tools mapping Lansing's housing crisis — the direct consequence of 20 years of Land Bank demolition-over-creation.",
      items: [
        { label: "Lansing Housing Tracker", desc: "Permit data, affordability trends, and displacement risk by neighborhood. 472 idle Land Bank parcels sit in the same zip codes showing highest displacement risk.", url: "https://lansing-housing.vercel.app/" },
        { label: "Redlined: Lansing MI", desc: "HOLC redlining boundaries overlaid with current housing data. Land Bank demolitions are concentrated in historically redlined neighborhoods.", url: "https://redlining-six.vercel.app/" },
      ],
    },
    urls: ["https://lansing-housing.vercel.app/", "https://redlining-six.vercel.app/"],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Seed new case studies
  for (const s of newStudies) {
    await prisma.boardCaseStudy.upsert({ where: { slug: s.slug }, update: s, create: s });
    console.log(`✓ ${s.boardName}`);
  }

  // Add gaia.solutions sections to existing case studies
  for (const { slug, section, urls } of gaiaLinks) {
    const study = await prisma.boardCaseStudy.findUnique({ where: { slug } });
    if (!study) { console.log(`  skipping ${slug} — not found`); continue; }

    const sections = (study.sections as object[]) || [];
    // Avoid duplicate gaia sections if re-run
    const alreadyHasGaia = sections.some((s: any) => s.eyebrow === "Explore the data");
    if (alreadyHasGaia) { console.log(`  ${slug} already has gaia links — skipping`); continue; }

    const existingUrls = (study.sourceUrls as string[]) || [];
    await prisma.boardCaseStudy.update({
      where: { slug },
      data: {
        sections: [...sections, section],
        sourceUrls: [...new Set([...existingUrls, ...urls])],
      },
    });
    console.log(`✓ Added gaia links to ${slug}`);
  }

  console.log(`\nDone.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
