// Seed 28 polycentric governance patterns
// node prisma/seed-patterns.mjs

import { PrismaClient } from "../node_modules/.prisma/client/index.js";
import { PrismaPg } from "../node_modules/@prisma/adapter-pg/dist/index.js";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "postgresql://jerrynorris:password@localhost:5432/lansing_love",
});
const prisma = new PrismaClient({ adapter });

// External link helper
const link = (label, url, note = "") => ({ label, url, note });

const patterns = [
  // ─── MOVEMENT SCALE ────────────────────────────────────────────────────────

  {
    slug: "decentralize-everything",
    number: 1,
    name: "Decentralize Everything",
    scale: "movement",
    problem: "A single center of power — a city hall, a mayor-appointed board, a state legislature, a corporate headquarters — makes decisions for a geography and population it does not live inside, and bears none of the consequences of getting it wrong.",
    forces: "Centralization is efficient to administer and easy for outsiders (investors, state agencies, regional planners) to negotiate with. Decentralization is slower, messier, and harder to summarize in a press release — but it is the only structure in which the cost of a bad decision lands on the people who made it.",
    solution: "Push authority — not just service delivery, but actual binding decision rights — down to the smallest unit capable of exercising it competently. This is not 'decentralize the org chart while power stays centralized'; it means the neighborhood, the cooperative, the household has a real vote that can't be overridden by the center. Every other pattern in this language is a specific instance of this one.",
    linksUp: [],
    linksDown: ["true-democracy", "sovereignty", "permeate-the-culture", "radical-inclusion", "starve-the-failing-systems", "true-opportunity-for-prosperity", "public-safety-is-free", "basic-needs-are-basic-rights", "the-shop-floor-knows"],
    caseRefs: ["chamber-pac-electoral-loop", "i-496-highway-displacement", "lhc-dispositions"],
    status: "tested",
    externalLinks: [
      link("Polycentric governance — Elinor Ostrom", "https://en.wikipedia.org/wiki/Polycentric_governance", "Nobel Prize-winning framework for decentralized resource governance"),
      link("ICA Cooperative Principles", "https://ica.coop/en/cooperatives/cooperative-identity-values-principles", "The seven ICA principles are a working implementation of this pattern"),
      link("Mondragon Corporation", "https://www.mondragon-corporation.com/en/", "Largest worker cooperative network in the world — decentralized by design"),
    ],
  },

  {
    slug: "true-democracy",
    number: 2,
    name: "True Democracy",
    scale: "movement",
    problem: "'Democracy' in practice means voting for representatives every two or four years, with no mechanism for ongoing, binding input between elections — which leaves every specific decision (a lease, a zoning variance, an asset sale) to be made by people who were elected on unrelated grounds.",
    forces: "Representative democracy scales; direct democracy on every question does not. But representative democracy without any binding participatory mechanism between elections becomes captured by whoever shows up consistently to city council meetings and funds PACs.",
    solution: "Build standing, binding participatory mechanisms that operate between elections: participatory budgeting with real dollars, neighborhood councils with veto or advisory-with-teeth authority on asset dispositions above a threshold, cooperative member votes on institutional direction. The test of 'true' is whether the mechanism is binding, not consultative — Lansing's current participatory budgeting is consultative, which fails this test.",
    linksUp: ["decentralize-everything"],
    linksDown: ["binding-seat-at-the-table", "the-watch-list"],
    caseRefs: ["chamber-pac-electoral-loop", "city-market-lansing-shuffle", "lhc-dispositions"],
    status: "tested",
    externalLinks: [
      link("Participatory budgeting — Participatory Budgeting Project", "https://www.participatorybudgeting.org/", "The leading US network for real participatory budgeting implementation"),
      link("Rhinoceros Media — LRC-PAC Overview", "https://rhinocerosmedia.org", "Documents the Chamber PAC electoral loop this pattern is designed to break"),
      link("Lansing City Pulse — Charter Commission coverage", "https://www.lansingcitypulse.com", "New charter effective January 2026 — the current opportunity window"),
    ],
  },

  {
    slug: "sovereignty",
    number: 3,
    name: "Sovereignty",
    scale: "movement",
    problem: "A community can be granted a voice without being granted authority — consulted extensively and still overruled, which produces consultation fatigue and justified cynicism about whether participation matters.",
    forces: "Granting genuine sovereignty means the center gives up the ability to override the community's decision, which is precisely what centers of power are structurally reluctant to do. Communities, in turn, need enough organizational capacity to actually exercise sovereignty once granted, or the grant is symbolic.",
    solution: "Sovereignty is tested, not claimed. A domain has real sovereignty when the community-owned cooperative can say no to an outside offer and have that no be final — not 'no, subject to override by a state agency or a mayor-appointed board.' Build the cooperative's capacity to exercise sovereignty (staffing, legal structure, financial reserves) before or alongside the fight to be granted it, or the grant arrives and the community can't use it.",
    linksUp: ["decentralize-everything"],
    linksDown: ["ownership-and-governance-move-together", "the-dissolving-501c3"],
    caseRefs: ["i-496-highway-displacement", "lhc-dispositions", "city-market-lansing-shuffle", "gm-industrial-complex"],
    status: "tested",
    externalLinks: [
      link("Community land trust model — National CLT Network", "https://cltnetwork.org/", "The CLT structure is a working implementation of community sovereignty over land"),
      link("Sunshine House — The Fledge", "https://thefledge.com", "Proof-of-concept for resident sovereignty in housing"),
    ],
  },

  {
    slug: "permeate-the-culture",
    number: 4,
    name: "Permeate the Culture",
    scale: "movement",
    problem: "A governance reform that lives only in policy documents and council votes remains fragile — the next election, the next board appointment, can unwind it. A reform that has become part of how people expect things to work is much harder to reverse.",
    forces: "Cultural change is slow and hard to measure; policy change is fast and legible. Organizations under pressure to show results default to policy wins, which are real but reversible, over cultural change, which is durable but takes years to show up in any metric.",
    solution: "Treat every proof-of-concept institution as a cultural artifact as much as an operational one. Podcasts, journalism, public storytelling, and the memoir itself are not separate from the governance work — they are the mechanism by which the reform becomes assumed rather than contested.",
    linksUp: ["decentralize-everything"],
    linksDown: ["joy-as-resistance", "name-it-something-that-makes-you-laugh"],
    caseRefs: [],
    status: "tested",
    externalLinks: [
      link("Rhinoceros Media", "https://rhinocerosmedia.org", "The investigative journalism layer that makes governance failures impossible to ignore"),
      link("Michigan Stories", "https://michiganstories.com", "Public narrative work — the cultural permeation mechanism"),
    ],
  },

  {
    slug: "radical-inclusion",
    number: 5,
    name: "Radical Inclusion",
    scale: "movement",
    problem: "Institutions default to eligibility logic — you must qualify, apply, be vetted, be known — before you're let in. This logic reliably excludes the people with the least existing social capital, who are often the people the institution most needs to reach.",
    forces: "Eligibility logic protects an institution from being overwhelmed or exploited. Radical inclusion accepts a higher risk of both, in exchange for reaching people that eligibility logic structurally cannot.",
    solution: "Invert the default: say yes before turning around, before hearing the idea, before knowing who's asking. This is not the absence of structure — it is structure applied after inclusion rather than as a gate before it. The Fledge's founding model draws directly on this: built by someone who was elite at ISO 9000 certification and consciously rejected that model for community work, choosing radical inclusion as design principle, with structure layered on afterward for whoever stays.",
    linksUp: ["decentralize-everything"],
    linksDown: ["the-anti-iso-institution", "say-yes-first", "the-porch"],
    caseRefs: [],
    status: "tested",
    externalLinks: [
      link("The Fledge", "https://thefledge.com", "The founding instance of this pattern — built from radical inclusion as design principle"),
    ],
  },

  {
    slug: "starve-the-failing-systems",
    number: 6,
    name: "Starve the Failing Systems",
    scale: "movement",
    problem: "Reform efforts often focus entirely on building the alternative and none on withdrawing support — financial, political, or attentional — from the system the alternative is meant to replace, which lets the failing system coast on inertia indefinitely.",
    forces: "Building is constructive and rewarding; withdrawing support from an existing system is often adversarial and invites organized resistance from the system's beneficiaries.",
    solution: "Every proof-of-concept cooperative should have an explicit theory of what it is meant to starve, not just what it is meant to build. Urbandale Farm starves dependency on food-desert retail. Sunshine House starves the RAD/Section 18 private-conversion pipeline. Name the starve target alongside the build target from the outset — it clarifies what success looks like and who will resist it.",
    linksUp: ["decentralize-everything"],
    linksDown: ["the-community-benefit-agreement", "the-records-campaign"],
    caseRefs: ["lhc-dispositions", "frandor-montgomery-drain", "chamber-pac-electoral-loop"],
    status: "tested",
    externalLinks: [
      link("Rhinoceros Media — LHC Accountability Record", "https://rhinocerosmedia.org", "Documents the RAD/Section 18 pipeline this pattern targets"),
      link("Urbandale Farm", "https://thefledge.com", "Proof-of-concept: cooperative food production starving food-desert retail dependency"),
    ],
  },

  {
    slug: "true-opportunity-for-prosperity",
    number: 7,
    name: "True Opportunity for Prosperity",
    scale: "movement",
    problem: "'Opportunity' is frequently offered as access to a system that requires resources (time, capital, existing credentials) that the person being offered opportunity does not have — which makes the offer real in form and false in substance.",
    forces: "Removing the resource barriers is expensive and slow; leaving them in place while calling the result 'opportunity' is cheap and fast, and looks the same in a press release.",
    solution: "Build the pathway a person can actually walk from where they stand, not from where a policy assumes they stand. The Cultivator (formerly the Entrepreneurial Journey) is this pattern's proof-of-concept: a prosperity pathway that starts from the actual starting conditions of ALICE-threshold households, not from an assumed baseline of capital or credential.",
    linksUp: ["decentralize-everything"],
    linksDown: ["the-alice-benchmark", "fractal-replication"],
    caseRefs: ["gm-industrial-complex", "i-496-highway-displacement"],
    status: "tested",
    externalLinks: [
      link("United for ALICE", "https://www.unitedforalice.org/", "The ALICE threshold data — what 'true opportunity' must actually clear"),
      link("resilience.foundation — TREK Pipeline", "https://resilience.foundation", "The Cultivator/Entrepreneurial Journey proof-of-concept lives here"),
    ],
  },

  {
    slug: "public-safety-is-free",
    number: 8,
    name: "Public Safety Is Free",
    scale: "movement",
    problem: "Public safety spending is overwhelmingly reactive — police response, emergency care, incarceration — rather than preventive, even though prevention is documented as cheaper across nearly every domain where it's been measured.",
    forces: "Prevention spending has to happen before the harm is visible, which makes it politically hard to fund — there's no dramatic incident to justify the budget line, no crisis to respond to. Reactive spending is easy to justify because the harm is already visible and urgent.",
    solution: "Account for public safety investment the way a quality engineer accounts for defects: prevention cost vs. failure cost, with the two compared explicitly in any budget document. The Everett High School shooting's 43-year unprocessed legacy — no active shooter protocol, no trauma support, resumed classes the next day — is the negative case study: the absence of prevention investment did not make the cost disappear, it deferred and compounded it.",
    linksUp: ["decentralize-everything"],
    linksDown: [],
    caseRefs: [],
    status: "untested",
    externalLinks: [
      link("Philip Crosby — Quality is Free (1979)", "https://en.wikipedia.org/wiki/Philip_B._Crosby", "The quality-management finding that prevention is cheaper than failure — applied here to civic safety"),
      link("Rhinoceros Media — Everett High School retrospective", "https://rhinocerosmedia.org", "The negative case study: deferred trauma cost"),
    ],
  },

  {
    slug: "basic-needs-are-basic-rights",
    number: 9,
    name: "Basic Needs Are Basic Rights",
    scale: "movement",
    problem: "Housing, food, healthcare, and the other basic-needs domains are treated as market goods first and rights second (if at all), which means access is rationed by ability to pay rather than guaranteed by membership in the community.",
    forces: "Treating basic needs as rights requires someone to guarantee supply regardless of ability to pay, which is expensive and requires either public subsidy or cooperative surplus — both of which are harder to sustain than simply letting the market ration access.",
    solution: "This is the founding premise the other eight movement-scale patterns serve. The standard against which every domain cooperative is measured: does membership in this cooperative guarantee access regardless of ability to pay, or does it merely offer access at a discount? The ten domains are the ten places this premise gets tested.",
    linksUp: [],
    linksDown: ["one-domain-one-cooperative"],
    caseRefs: ["gm-industrial-complex", "lhc-dispositions", "city-market-lansing-shuffle"],
    status: "tested",
    externalLinks: [
      link("ICA Cooperative Principles", "https://ica.coop/en/cooperatives/cooperative-identity-values-principles", "Principle 7 (Concern for Community) is the ICA expression of this pattern"),
      link("United for ALICE", "https://www.unitedforalice.org/", "ALICE data shows who is structurally excluded from basic needs by the market"),
      link("Universal Declaration of Human Rights — Article 25", "https://www.un.org/en/about-us/universal-declaration-of-human-rights", "International framing of basic needs as rights"),
    ],
  },

  // ─── DOMAIN SCALE ───────────────────────────────────────────────────────────

  {
    slug: "one-domain-one-cooperative",
    number: 10,
    name: "One Domain, One Cooperative",
    scale: "domain",
    problem: "Basic needs get addressed piecemeal — a food pantry here, a housing nonprofit there — with no shared ownership structure or governance logic connecting them, so each domain reinvents the cooperative wheel and none of them build toward a shared community-ownership stake.",
    forces: "Piecemeal, domain-specific nonprofits are easier to start and fund (grant categories are domain-specific) than a unified cooperative structure spanning domains. But piecemeal structures don't accumulate into a transferable governance model.",
    solution: "Treat each of the ten domains (Housing, Healthcare, Childcare, Food, Transportation, Technology, Energy, Education, Environment, Justice/Safety/Security) as a candidate for exactly one cooperative micro-enterprise, converted using the same underlying governance template (ICA principles, Mondragon structure, member ownership) even though the operational specifics differ completely between, say, food and energy. The shared template is what makes the ten domains a system rather than ten unrelated projects.",
    linksUp: ["basic-needs-are-basic-rights"],
    linksDown: ["the-proof-of-concept-domain", "domain-interdependency"],
    caseRefs: [],
    status: "tested",
    externalLinks: [
      link("ICA Cooperative Principles", "https://ica.coop/en/cooperatives/cooperative-identity-values-principles", "The governance template shared across all ten domains"),
      link("Mondragon Corporation", "https://www.mondragon-corporation.com/en/", "The working model for a cooperative spanning multiple domains"),
      link("resilience.foundation", "https://resilience.foundation", "The TREK pipeline building cooperative infrastructure across domains in Lansing"),
    ],
  },

  {
    slug: "the-proof-of-concept-domain",
    number: 11,
    name: "The Proof-of-Concept Domain",
    scale: "domain",
    problem: "Trying to convert all ten domains simultaneously spreads resources too thin to produce a convincing result in any of them, which undermines the credibility needed to attract capital and community buy-in for the domains that come next.",
    forces: "Sequencing means some domains wait, which is a real cost to the people whose needs sit in the domains not yet addressed. But attempting all ten at once with limited capital produces ten weak proofs instead of one strong one, and a weak proof convinces no one.",
    solution: "Pick domains sequentially, in priority order based on where extraction is most acute and documented — see the Full Accounting's cumulative ledger for which domains carry the largest socialized cost. Fund each proof-of-concept to genuine completion before moving to the next. Sunshine House (Housing) and Urbandale Farm (Food) are the current instances. Each completed proof funds and justifies the next.",
    linksUp: ["one-domain-one-cooperative"],
    linksDown: ["fractal-replication", "patient-capital-before-the-deal-is-signed"],
    caseRefs: ["lhc-dispositions", "city-market-lansing-shuffle"],
    status: "partial",
    externalLinks: [
      link("Sunshine House — The Fledge", "https://thefledge.com", "Housing domain proof-of-concept — rent-to-own cooperative model"),
      link("Urbandale Farm", "https://thefledge.com", "Food domain proof-of-concept — cooperative urban agriculture"),
      link("resilience.foundation — Co-op Handbook", "https://resilience.foundation", "The shared governance template used across domain proofs"),
    ],
  },

  {
    slug: "domain-interdependency",
    number: 12,
    name: "Domain Interdependency",
    scale: "domain",
    problem: "Domains are treated as separable when they are not — a housing cooperative's residents still need food, energy, transportation, and childcare, and if those remain extractive, the housing win is partially clawed back through the other nine domains.",
    forces: "Building domain interdependency into the design from the start is more complex than building each domain as a standalone project. But standalone projects leave the household's overall extraction exposure nearly unchanged even when one domain improves.",
    solution: "Design each domain cooperative with explicit linkage points to the others — a food cooperative that sources energy from a community solar cooperative, a housing cooperative whose residents get preferential access to the transportation cooperative. The ten-domain framework's power is in the connections between domains, not the sum of ten separate wins.",
    linksUp: ["one-domain-one-cooperative"],
    linksDown: [],
    caseRefs: [],
    status: "partial",
    externalLinks: [
      link("Mondragon Corporation — ecosystem structure", "https://www.mondragon-corporation.com/en/", "The closest working model of cross-domain cooperative interdependency at scale"),
    ],
  },

  {
    slug: "the-alice-benchmark",
    number: 13,
    name: "The ALICE Benchmark",
    scale: "domain",
    problem: "'Success' for a cooperative-development effort is often measured against the federal poverty line — a threshold badly disconnected from actual cost of living in most places, which makes programs look successful while leaving ALICE households (Asset Limited, Income Constrained, Employed) completely unaddressed.",
    forces: "The federal poverty line is simple, nationally standardized, and administratively convenient for eligibility determinations. But working people who don't qualify for most aid and still can't cover basics are left structurally invisible by it.",
    solution: "Use the ALICE threshold, not the federal poverty line, as the benchmark for every domain cooperative's success metric. This changes who counts as 'still in need' and who the cooperative is designed to serve. State this benchmark explicitly wherever a domain reports outcomes, so external readers understand why the numbers may look different from federal poverty statistics.",
    linksUp: ["true-opportunity-for-prosperity"],
    linksDown: [],
    caseRefs: [],
    status: "tested",
    externalLinks: [
      link("United for ALICE", "https://www.unitedforalice.org/", "The primary source for ALICE threshold data by state and county"),
      link("ALICE in Michigan — United Way", "https://www.uwnca.org/alice", "Michigan-specific ALICE data"),
      link("Federal poverty guidelines — HHS", "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines", "What the ALICE benchmark replaces — and why it falls short"),
    ],
  },

  // ─── INSTITUTION SCALE ──────────────────────────────────────────────────────

  {
    slug: "ownership-and-governance-move-together",
    number: 14,
    name: "Ownership and Governance Move Together",
    scale: "institution",
    problem: "Reform efforts frequently grant one without the other — a housing nonprofit gives residents a voice on an advisory board without giving them equity, or a worker cooperative gives workers equity without giving them a binding vote — and the version without both together tends to collapse back toward whoever held the other one first.",
    forces: "Granting ownership alone is legally and financially simpler than restructuring governance; granting governance alone is politically simpler than restructuring who holds equity. Doing both simultaneously is the hardest version and the only one that's durable.",
    solution: "Any conversion of a basic-needs domain into a cooperative must transfer both ownership stake and binding governance authority in the same instrument, at the same time. The Sunshine House rent-to-own model is designed around this: residents accumulate equity and governance authority together — it is explicitly not just subsidized housing (ownership without governance) and not just a tenant council (governance without ownership).",
    linksUp: ["sovereignty"],
    linksDown: ["the-dissolving-501c3", "the-community-benefit-agreement"],
    caseRefs: ["lhc-dispositions", "af-group-privatization", "city-market-lansing-shuffle"],
    status: "tested",
    externalLinks: [
      link("National CLT Network", "https://cltnetwork.org/", "Community land trusts are a working implementation of this pattern — land ownership + governance together"),
      link("Mondragon cooperative structure", "https://www.mondragon-corporation.com/en/", "Worker ownership + democratic governance as integrated design"),
      link("ICA Principle 2 — Democratic Member Control", "https://ica.coop/en/cooperatives/cooperative-identity-values-principles", "The ICA principle that governance must follow ownership"),
    ],
  },

  {
    slug: "the-anti-iso-institution",
    number: 15,
    name: "The Anti-ISO Institution",
    scale: "institution",
    problem: "Institutions built to serve communities in crisis often import control-and-standardization logic — eligibility screening, intake processes, documentation requirements — that filters out exactly the people the institution most needs to reach.",
    forces: "Standardization and documentation protect an institution from liability, from being overwhelmed, and from being exploited by bad actors. Removing them increases all three risks. But an institution that protects itself this well from risk also protects itself from its actual mission.",
    solution: "Deliberately invert ISO logic at the front door: build the intake process around radical inclusion rather than eligibility screening, and layer whatever structure is genuinely necessary — safety, accountability, follow-through — behind the point of entry rather than at it. The Fledge is the founding instance: built by someone who was elite at ISO 9000 certification and consciously rejected that model for community work.",
    linksUp: ["radical-inclusion"],
    linksDown: ["say-yes-first", "open-the-door-the-next-day"],
    caseRefs: [],
    status: "tested",
    externalLinks: [
      link("The Fledge", "https://thefledge.com", "The founding instance of this pattern — anti-ISO by design from day one"),
      link("ISO 9000 quality management", "https://www.iso.org/iso-9001-quality-management.html", "The control-and-standardization framework this pattern consciously inverts"),
    ],
  },

  {
    slug: "patient-capital-before-the-deal-is-signed",
    number: 16,
    name: "Patient Capital Before the Deal Is Signed",
    scale: "institution",
    problem: "By the time a community organization realizes a public asset is being converted to private ownership, the private capital is often already committed and sunk — which makes reversal look financially irrational even to sympathetic decision-makers.",
    forces: "Patient cooperative capital is slow to raise and usually smaller in scale than what a private developer can move quickly. But private capital's speed is precisely the mechanism that locks in outcomes before the public is fully aware a decision point exists.",
    solution: "Capitalize a standing cooperative development fund before the next disposition decision arrives, not in response to it. The fund doesn't need to match private capital dollar for dollar — it needs to be large enough and ready enough to make a credible bid the moment the Watch List (Pattern 22) flags an opportunity. The Fledge Foundation is the existing vehicle; the near-term goal is to capitalize it sufficiently (starting at $500K) so the next Shuffle-style purchase-option scenario has a cooperative alternative on the table before the capital is sunk.",
    linksUp: ["the-proof-of-concept-domain"],
    linksDown: ["the-watch-list", "the-community-benefit-agreement"],
    caseRefs: ["city-market-lansing-shuffle", "gm-industrial-complex", "af-group-privatization"],
    status: "untested",
    externalLinks: [
      link("The Fledge Foundation", "https://thefledgefoundation.org", "The patient capital vehicle — currently being capitalized"),
      link("CDFI Fund — US Treasury", "https://www.cdfifund.gov/", "Primary federal source for cooperative development capital"),
      link("Runway Project — patient capital for entrepreneurs of color", "https://www.runwayproject.org/", "Model for patient, relationship-based cooperative capital"),
    ],
  },

  {
    slug: "the-dissolving-501c3",
    number: 17,
    name: "The Dissolving 501c3",
    scale: "institution",
    problem: "Nonprofit structures are typically built to be permanent, which means the professional staff and board who run them have an ongoing institutional interest in the nonprofit's continued existence — even after the community it serves has developed enough capacity to self-govern without it.",
    forces: "Permanent nonprofit structures provide continuity, fundraising credibility, and legal simplicity. But permanence also means the 501c3's professional layer can outlive its usefulness and become, itself, a small center of power the community must eventually decentralize away from.",
    solution: "Design the 501c3 from the outset with an explicit dissolution thesis: what capacity needs to exist in the cooperative membership before the nonprofit's functions can be transferred to member governance and the nonprofit wound down. The Fledge Foundation's long-term intent — dissolve as cooperative self-governance matures — is this pattern's proof-of-concept, still in progress. Revisit this thesis on a fixed schedule rather than leaving it as a someday-intention.",
    linksUp: ["sovereignty", "ownership-and-governance-move-together"],
    linksDown: ["fractal-replication"],
    caseRefs: ["af-group-privatization"],
    status: "partial",
    externalLinks: [
      link("The Fledge Foundation", "https://thefledgefoundation.org", "The instance of this pattern — designed with dissolution thesis built in"),
    ],
  },

  {
    slug: "binding-seat-at-the-table",
    number: 18,
    name: "Binding Seat at the Table",
    scale: "institution",
    problem: "Community input mechanisms are frequently advisory — the community is heard, then a center of power decides anyway — which produces the appearance of participation without its substance, and over time produces justified public cynicism about the value of showing up.",
    forces: "Binding community authority is harder for a governing body to grant, because it constrains the governing body's own future decisions. Advisory input is easy to grant because it costs the center nothing.",
    solution: "Every specific policy ask should be tested against one question: is the community's input binding, or merely solicited? The independent reappraisal requirement and the 90-day public comment period both pass this test only if paired with an actual veto or delay mechanism — comment periods without teeth are advisory dressed up as binding. The central claim: 'the loop only breaks when the community has a binding seat at the table before the deal is signed.'",
    linksUp: ["true-democracy"],
    linksDown: ["the-community-benefit-agreement", "the-watch-list"],
    caseRefs: ["i-496-highway-displacement", "lhc-dispositions", "city-market-lansing-shuffle", "chamber-pac-electoral-loop", "gm-industrial-complex"],
    status: "tested",
    externalLinks: [
      link("Rhinoceros Media — Charter Commission coverage", "https://rhinocerosmedia.org", "New Lansing charter (January 2026) — the current window for codifying binding community authority"),
      link("Participatory Budgeting Project", "https://www.participatorybudgeting.org/", "Binding PB as opposed to consultative PB — the tested implementation"),
      link("Community Benefits Law Center", "https://www.communitybenefits.org/", "Legal frameworks for binding community authority on development decisions"),
    ],
  },

  {
    slug: "the-community-benefit-agreement",
    number: 19,
    name: "The Community Benefit Agreement",
    scale: "institution",
    problem: "Public-private developments — a highway, a hospital expansion, a data center — routinely proceed with public support (tax abatement, zoning, infrastructure) but no binding commitment from the private party to deliver specific, enforceable benefits to the community bearing the development's costs.",
    forces: "CBAs are a known, standard tool, but they require the public side to have enough leverage (typically, withheld approval) to demand one — leverage that dissipates the moment the public side wants the development to happen more than the private party needs the public benefit.",
    solution: "Attach a CBA requirement to the public benefit, not to general goodwill — make it a precondition of the tax abatement, the zoning approval, or the infrastructure commitment, stated in policy before the next deal arrives rather than negotiated deal by deal. Current live applications: RACER Trust site disposition and the UMH-Sparrow hospital expansion.",
    linksUp: ["binding-seat-at-the-table", "starve-the-failing-systems"],
    linksDown: [],
    caseRefs: ["gm-industrial-complex", "chamber-pac-electoral-loop", "i-496-highway-displacement"],
    status: "untested",
    externalLinks: [
      link("Community Benefits Law Center", "https://www.communitybenefits.org/", "The primary national resource for CBA legal frameworks and templates"),
      link("RACER Trust", "https://racer-trust.org", "The current Lansing site where a CBA requirement is most urgently needed — 234 acres of former GM land"),
      link("Los Angeles CBA Coalition", "https://www.laane.org/", "The model CBA — Staples Center, 2001 — that established CBAs as a replicable tool"),
    ],
  },

  {
    slug: "fractal-replication",
    number: 20,
    name: "Fractal Replication",
    scale: "institution",
    problem: "A successful cooperative proof-of-concept in one community is frequently non-transferable in practice — the knowledge of how it was built lives in the founders' heads, not in a form another community can pick up and adapt.",
    forces: "Documenting a model thoroughly enough for someone else to replicate it is slow, unglamorous work that competes for time against actually running the proof-of-concept. But without that documentation, 'replicable model' remains a claim rather than a demonstrated fact.",
    solution: "Treat this pattern language itself as the primary replication mechanism — the point of formalizing patterns rather than just telling the story is that another community's Fledge-equivalent should be able to pick up the pattern at whatever scale matches their own starting problem without needing the whole Lansing-specific narrative. The real test of this pattern is whether this document gets used by someone outside Lansing.",
    linksUp: ["the-dissolving-501c3", "the-proof-of-concept-domain"],
    linksDown: [],
    caseRefs: [],
    status: "untested",
    externalLinks: [
      link("Christopher Alexander — A Pattern Language (1977)", "https://en.wikipedia.org/wiki/A_Pattern_Language", "The original pattern language framework this document adapts"),
      link("resilience.foundation — Co-op Handbook", "https://resilience.foundation", "The replication toolkit for cooperative governance — the operational companion to this pattern language"),
      link("Mondragon University", "https://www.mondragon.edu/en/", "The educational infrastructure Mondragon built specifically to enable fractal replication across cooperatives"),
    ],
  },

  {
    slug: "the-records-campaign",
    number: 21,
    name: "The Records Campaign",
    scale: "institution",
    problem: "Public bodies can functionally defeat accountability not by denying a records request outright, but by imposing fees and delays that make the pursuit of records itself the story — while the underlying question (what actually happened to the asset) goes unanswered indefinitely.",
    forces: "Escalating a records fight publicly requires sustained attention and resources that could otherwise go toward building the cooperative alternative. But letting a stonewalled records request quietly drop concedes that opacity is an acceptable governance mode.",
    solution: "Convert the act of being stonewalled into public evidence in its own right — every fee charged and every day of delay becomes a documented data point for the argument that the governance structure is actively hiding information. The LHC records campaign — five requests, $4,430 in fees, zero documents produced — is the proof-of-concept: the stonewalling itself became part of the accounting, not a dead end to the investigation.",
    linksUp: ["starve-the-failing-systems"],
    linksDown: ["the-watch-list"],
    caseRefs: ["lhc-dispositions", "ingham-land-bank"],
    status: "tested",
    externalLinks: [
      link("Rhinoceros Media — LHC Accountability Record", "https://rhinocerosmedia.org", "The investigative journalism that made the LHC stonewalling publicly legible"),
      link("Michigan FOIA — Michigan.gov", "https://www.michigan.gov/som/government/laws-and-regulations/foia", "Michigan Freedom of Information Act — the legal framework for these requests"),
      link("MuckRock — public records platform", "https://www.muckrock.com/", "Tool for filing, tracking, and publishing FOIA requests publicly"),
    ],
  },

  {
    slug: "the-watch-list",
    number: 22,
    name: "The Watch List",
    scale: "institution",
    problem: "The public typically learns about a consequential asset disposition (a purchase option, a zoning change, a lease term) only at the moment of final vote — by which point the deal's terms were often locked in years earlier, with no public discussion at the time they were actually decided.",
    forces: "Monitoring every lease, contract, and board appointment for early warning signs is continuous, unglamorous work with no payoff until years later when a watched item finally matters. It is easy to defund or deprioritize relative to work with a visible near-term output.",
    solution: "Maintain a standing, public, continuously updated tracker — not a one-time report — that flags purchase options, conversions, tax-abatement arrangements, and board-member overlaps at the moment of proposal, sourced from routine public records (meeting agendas, FOIA requests, planning filings). lansing.love's Public Asset Disposition Watch is this pattern's live instance: the explicit goal is that the next Shuffle-style purchase option gets flagged in the year it's signed, not the year it's exercised.",
    linksUp: ["binding-seat-at-the-table", "patient-capital-before-the-deal-is-signed"],
    linksDown: [],
    caseRefs: ["city-market-lansing-shuffle", "lhc-dispositions", "chamber-pac-electoral-loop", "af-group-privatization"],
    status: "partial",
    externalLinks: [
      link("lansing.love — Governance tracker", "https://lansing.love/governance", "The live instance of this pattern — Public Asset Disposition Watch (in development)"),
      link("Lansing City Council agendas", "https://www.lansingmi.gov/council", "Primary source feed for the Watch List"),
      link("Ingham County Planning Commission", "https://www.ingham.org/1101/Planning-Commission", "Secondary source for zoning and disposition filings"),
    ],
  },

  // ─── PRACTICE SCALE ─────────────────────────────────────────────────────────

  {
    slug: "say-yes-first",
    number: 23,
    name: "Say Yes First",
    scale: "practice",
    problem: "The instinct to evaluate an idea, a person, or a request before responding to it is protective but slow, and in a crisis-facing institution, the delay itself is often what causes the person asking to disengage before help arrives.",
    forces: "Evaluating first reduces the institution's exposure to bad ideas, bad actors, and wasted resources. Saying yes first increases that exposure but dramatically increases the number of people who actually get met where they are.",
    solution: "Make 'yes' the reflexive default response to a person showing up, with evaluation and structure applied afterward rather than as a precondition. This is the smallest, most literal expression of Radical Inclusion — it is a habit practiced in a single interaction, not a policy.",
    linksUp: ["radical-inclusion", "the-anti-iso-institution"],
    linksDown: [],
    caseRefs: [],
    status: "tested",
    externalLinks: [
      link("The Fledge", "https://thefledge.com", "The founding instance — 'yes' as default posture from day one"),
    ],
  },

  {
    slug: "open-the-door-the-next-day",
    number: 24,
    name: "Open the Door the Next Day",
    scale: "practice",
    problem: "An institution that experiences violence or serious harm connected to its own mission faces a real temptation to close, retrench, or add so much security infrastructure that it stops resembling the open institution it was built to be.",
    forces: "Continuing to operate exactly as before after a shooting or serious threat carries genuine risk of recurrence. But closing, retrenching, or fortifying past a certain point delivers the outcome the violence was, in effect, already producing.",
    solution: "When something goes badly wrong, the answer is to open the door again the next day — not performatively, but operationally: same hours, same posture of radical inclusion, appropriate but not identity-altering security response. The Fledge's response to being shot up in 2019, in the same year 19 of 22 kids shot and killed in Lansing were Fledge community members, is this pattern's founding instance.",
    linksUp: ["the-anti-iso-institution"],
    linksDown: [],
    caseRefs: [],
    status: "tested",
    externalLinks: [
      link("The Fledge — 1300 Eureka St", "https://thefledge.com", "The founding instance of this pattern — tested under real duress in 2019"),
    ],
  },

  {
    slug: "joy-as-resistance",
    number: 25,
    name: "Joy as Resistance",
    scale: "practice",
    problem: "Institutions built in opposition to an extractive or unresponsive system frequently adopt the grim, adversarial tone of the fight itself, which is exhausting to sustain and unattractive to the people the institution most needs to draw in.",
    forces: "A serious tone signals that the stakes are being taken seriously, which matters for credibility with funders, officials, and press. A joyful tone risks being read as not serious — but a purely grim posture is very hard to sustain across years and tends to burn out the people doing the work.",
    solution: "Build genuine joy and humor into the resistance itself, rather than treating joy as a reward reserved for after the fight is won. Yoor Mom Skateboards — a name chosen specifically because it makes people laugh, built by a father and ten-year-old son after the city said no to skateboarding — is the clearest instance: the joke is the point, not a lapse in seriousness, and it made the resistance sustainable in a way pure grievance would not have.",
    linksUp: ["permeate-the-culture"],
    linksDown: ["name-it-something-that-makes-you-laugh"],
    caseRefs: [],
    status: "tested",
    externalLinks: [
      link("The Fledge", "https://thefledge.com", "The broader institution built on joy as a design principle, not a reward"),
    ],
  },

  {
    slug: "the-porch",
    number: 26,
    name: "The Porch",
    scale: "practice",
    problem: "A new community institution arriving in a neighborhood is, at first, a stranger — and strangers, reasonably, are met with suspicion or hostility, especially in neighborhoods that have been on the receiving end of extractive 'community development' before.",
    forces: "Retreating from hostility is the natural response and protects the founder from repeated rejection. But an institution that only engages with the neighborhood once it's already comfortable never builds the trust that makes it a genuine neighbor rather than an outside project dropped into the community.",
    solution: "Show up in the most exposed, least defended way available — on the porch, waving at everyone who passes, including the people who respond with hostility — and keep doing it past the point of comfort, until the absence of the gesture is what gets noticed instead of its presence. The Fledge's first days at 1300 Eureka Street are the literal instance of this pattern: Jerry on the porch waving at passersby who responded 'fuck you,' and continuing anyway, until today if he doesn't wave at them they're mad at him.",
    linksUp: ["radical-inclusion"],
    linksDown: [],
    caseRefs: [],
    status: "tested",
    externalLinks: [
      link("The Fledge — 1300 Eureka St", "https://thefledge.com", "The founding instance of this pattern"),
    ],
  },

  {
    slug: "name-it-something-that-makes-you-laugh",
    number: 27,
    name: "Name It Something That Makes You Laugh",
    scale: "practice",
    problem: "Institutions fighting an entrenched system often choose names that signal seriousness and legitimacy to the system they're fighting — which can accidentally adopt the aesthetic and tone of the very bureaucracy being resisted.",
    forces: "A serious-sounding name is easier to get taken seriously by funders, press, and officials on first contact. A funny or irreverent name risks being dismissed before the substance is even considered.",
    solution: "Where the audience that matters most is the community being served, not the system being resisted, choose a name that carries the posture of the resistance itself — irreverent, confident, unwilling to perform respectability for gatekeepers. Yoor Mom Skateboards is the reference instance. Use judgment about audience: the Full Accounting uses a serious title deliberately, because its audience includes officials and press who need to take documented claims seriously on first contact.",
    linksUp: ["joy-as-resistance"],
    linksDown: [],
    caseRefs: [],
    status: "tested",
    externalLinks: [
      link("The Fledge", "https://thefledge.com", "The institution that named a skateboard company 'Yoor Mom' and meant it"),
    ],
  },

  {
    slug: "the-shop-floor-knows",
    number: 28,
    name: "The Shop Floor Knows",
    scale: "practice",
    problem: "Decision-making authority in most institutions sits with people administratively removed from the day-to-day reality of the problem being solved, on the theory that distance provides objectivity — but distance also means the decision-maker is working from an abstraction of the problem rather than direct knowledge of it.",
    forces: "Centralizing decisions with people who have broad visibility across an organization allows for coordination and consistency. But the people closest to a specific problem — the factory floor, the classroom, the block — routinely have better information about what will actually work, and centralized decision-makers routinely discount that information because it doesn't come through official channels.",
    solution: "Build a standing expectation, structural if possible, that the people closest to a problem get consulted first and their proposed solution gets real weight — not just a listening session, but actual deference unless there's a specific, articulable reason to override it. Keith Norris on the REO floor, the 1937 Lansing Labor Holiday, and the ISO-auditor discovery ('control and standardization is the opposite of diversity and innovation — the shop floor knows more than the officers in the offices') are three generations of the same finding.",
    linksUp: ["decentralize-everything"],
    linksDown: [],
    caseRefs: ["gm-industrial-complex"],
    status: "tested",
    externalLinks: [
      link("1937 Lansing Labor Holiday — Michigan history", "https://en.wikipedia.org/wiki/1937_Flint_sit-down_strike", "The labor movement context — workers exercising shop-floor knowledge against GM management"),
      link("W. Edwards Deming — Total Quality Management", "https://en.wikipedia.org/wiki/W._Edwards_Deming", "The quality-management tradition that validated shop-floor knowledge over management abstraction"),
      link("ICA Principle 2 — Democratic Member Control", "https://ica.coop/en/cooperatives/cooperative-identity-values-principles", "The cooperative governance principle that operationalizes shop-floor knowledge at the institutional level"),
    ],
  },
];

// Generate a simple cuid-like id
function makeId() {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

async function main() {
  console.log(`Seeding ${patterns.length} patterns...`);

  for (const p of patterns) {
    const { slug, ...data } = p;
    const existing = await prisma.pattern.findUnique({ where: { slug } });

    if (existing) {
      await prisma.pattern.update({
        where: { slug },
        data: { ...data, updatedAt: new Date() },
      });
      console.log(`  ↻ ${p.number}. ${p.name}`);
    } else {
      await prisma.pattern.create({
        data: { id: makeId(), slug, ...data },
      });
      console.log(`  ✓ ${p.number}. ${p.name}`);
    }
  }

  console.log("Done.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
