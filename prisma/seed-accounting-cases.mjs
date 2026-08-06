// Seed the 10 Full Accounting cases into BoardCaseStudy
// Run from repo root: node prisma/seed-accounting-cases.mjs

import { PrismaClient } from "../node_modules/.prisma/client/index.js";
import { PrismaPg } from "../node_modules/@prisma/adapter-pg/dist/index.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "postgresql://jerrynorris:password@localhost:5432/lansing_love",
});
const prisma = new PrismaClient({ adapter });

const cases = [
  {
    slug: "gm-industrial-complex",
    boardName: "Oldsmobile / GM Industrial Complex",
    category: "Industrial History",
    date: "1901–2005",
    published: true,
    summary: "104 years of manufacturing employment anchored Lansing's economy. The benefit — wages, supply chain, tax base — and the cost — neighborhood destruction, contamination, a $40M+ public cleanup bill — were distributed to entirely different populations.",
    stats: [
      { value: "104 years", label: "GM in Lansing" },
      { value: "$40M+", label: "Public cleanup costs (rising)" },
      { value: "840+", label: "Homes demolished for I-496" },
      { value: "234 acres", label: "Contaminated GM sites" },
      { value: "$0", label: "Community benefit agreement" },
    ],
    sections: [
      {
        eyebrow: "What the community genuinely received",
        heading: "The real benefits",
        description: "These were genuine — not fabricated by industrial boosters. They just weren't distributed equitably.",
        items: [
          { label: "Manufacturing employment", desc: "At its peak, the Lansing Car Assembly was ranked #1 most productive automobile plant in North America by The Harbour Report (2002). At closure, ~3,900 people worked in the remaining plants." },
          { label: "UAW wages above regional average", desc: "Negotiated wages provided working-class and Black families pathways to homeownership and economic stability that were otherwise structurally closed to them under FHA redlining." },
          { label: "Supplier ecosystem", desc: "GM anchored a regional manufacturing supply chain. The R.E. Olds Museum documents over 40 Lansing-area companies that grew directly from Olds-related operations, including Atlas Drop Forge, Motor Wheel Corp., and Fisher Body." },
          { label: "R.E. Olds philanthropic investment", desc: "R.E. Olds personally funded the replacement engineering school at MSU after it burned, likely saving MSU's independence from University of Michigan annexation." },
          { label: "Tax base", desc: "For over a century, GM's Lansing operations contributed substantially to the city and county tax base, funding schools, roads, and public services." },
        ],
      },
      {
        eyebrow: "What it actually cost",
        heading: "The real costs",
        description: "These costs were not random. They landed on specific communities — primarily the Black neighborhood adjacent to the plant.",
        items: [
          { label: "Neighborhood displacement via I-496", desc: "The community that built itself around GM jobs was demolished by the highway that served GM's workforce commute. 840+ homes, 600+ families, nearly all Black. The benefit and the cost were distributed to different populations." },
          { label: "PFAS and industrial contamination", desc: "PFOS/PFOA from chrome plating at Plant 3. 1,4-dioxane contamination. Adams Plating PFAS from adjacent electroplating 1964–2010. Remediation cost: $40M+ in public money committed, costs still accumulating." },
          { label: "Coal plant health burden", desc: "97 years of coal combustion adjacent to the same neighborhood that bore the displacement cost. No documented health impact study was conducted for this community." },
          { label: "GM bankruptcy liability shed", desc: "When GM left, the cleanup bill went to RACER Trust and eventually to the public. The private wealth extracted over 104 years did not stay to cover the environmental liability it created." },
          { label: "No community benefit agreement", desc: "When Mayor Hollister's Blue Ribbon Committee persuaded GM to stay in the late 1990s and build three new plants, the city negotiated retention but not binding community benefits, environmental cleanup bonds, or transition funds. The city gave; GM stayed on its own terms." },
        ],
      },
      {
        eyebrow: "The accounting gap",
        heading: "Who got the benefit vs. who paid the cost",
        description: "The wages were real. The tax base was real. The supply chain was real. But they accrued primarily to workers (many of whom were later displaced or laid off), to shareholders (who were never Lansing residents in any meaningful proportion), and to the city's general fund. The contamination, the displacement, and the cleanup bill accrued primarily to the Black community adjacent to the plant, and then to all Lansing taxpayers. The beneficiaries and the cost-bearers were not the same people.",
        items: [
          { label: "RACER Trust context", desc: "The three Lansing-area GM sites (Plants 2, 3, and 6) total over 234 acres. A developer has held them under contract since 2016 and still cannot finalize a purchase until cleanup is complete. Michigan committed an additional $19 million in 2024 for the Fisher Body site alone — costs still climbing." },
        ],
      },
    ],
    principles: [
      { num: 2, name: "Democratic Member Control", violation: "No binding community voice before decisions were made", evidence: "City negotiated GM retention (late 1990s) without binding community benefit agreement, environmental cleanup bonds, or transition funds." },
      { num: 4, name: "Autonomy and Independence", violation: "Community had no autonomous capacity to contest plant-siting, highway routing, or contamination decisions", evidence: "No community benefit agreement was required; highway displaced 840+ homes with no binding right of first refusal for the affected neighborhood." },
      { num: 7, name: "Concern for Community", violation: "Private profit was extracted; environmental liability was socialized", evidence: "GM bankruptcy shed cleanup liability onto RACER Trust and public funds; $40M+ remediation cost now borne by taxpayers." },
    ],
    ownership: [
      { question: "Who owns it?", before: "GM shareholders (mostly non-Lansing residents)", after: "RACER Trust (cleanup vehicle) + potential private developer; 234 contaminated acres still off-market", assessment: "extractive" },
      { question: "Who has power?", before: "GM corporation + state highway planners + city administration", after: "State/federal cleanup programs, private developer awaiting site clearance", assessment: "extractive" },
      { question: "Who benefits?", before: "GM shareholders, workers with UAW wages, city tax base", after: "Potential developer on remediated land; Black community that bore displacement cost receives no priority claim", assessment: "extractive" },
      { question: "Who does the work?", before: "UAW workers, many Black Lansing residents", after: "Remediation contractors (public-funded)", assessment: "extractive" },
      { question: "Who makes the rules?", before: "GM + city council; no community benefit agreement required", after: "RACER Trust + state agencies; community benefit requirements not yet binding on final land disposition", assessment: "extractive" },
    ],
    bottomLines: [
      { dimension: "People", impact: "negative", description: "840+ homes demolished, 600+ families displaced (nearly all Black). Health burden of 97 years coal combustion on adjacent community. No documented health impact study ever conducted." },
      { dimension: "Planet", impact: "negative", description: "PFAS/1,4-dioxane contamination across 234 acres. Coal plant emissions for 97 years. $40M+ public remediation and counting." },
      { dimension: "Prosperity", impact: "mixed", description: "UAW wages and regional supply chain were real economic benefits. But private profit was extracted; $40M+ cleanup cost was socialized onto taxpayers with no clawback from GM." },
      { dimension: "Purpose", impact: "negative", description: "The institution's stated purpose (manufacturing jobs, economic development) was real but delivered with no community benefit requirements, no environmental bonds, and no transition fund. Private gain, public cleanup." },
    ],
    recommendations: [
      "Require a Community Benefit Agreement on any RACER Trust land disposition in Lansing — binding provisions for affordable housing percentage, local hiring preference, cooperative business space, environmental monitoring rights, and community representation.",
      "Commission or co-produce with MSU or Rhinoceros an environmental justice audit of the I-496 corridor and former GM plant sites.",
      "Use the I-496 cap study grant ($1M, January 2025) as a precedent to demand reparative investment targeted at the communities that bore the original displacement cost.",
    ],
    sources: [
      "The Harbour Report, North American Productivity Study (2002)",
      "R.E. Olds Museum, Lansing MI",
      "RACER Trust (racer-trust.org)",
      "Bridge Michigan — I-496 displacement history",
      "U.S. Bankruptcy Court — RACER Trust creation (2011)",
    ],
    sourceUrls: ["https://racer-trust.org"],
    players: ["General Motors Corporation", "City of Lansing Mayor's Office", "MDOT", "RACER Trust", "UAW Local 652", "Michigan EGLE"],
    scoreTransparency: "concerning",
    scoreConflicts: "concerning",
    scoreMission: "concerning",
    scoreDemocraticControl: "high-risk",
    scoreOversight: "high-risk",
  },

  {
    slug: "bwl-coal-operations",
    boardName: "Eckert Station / BWL Coal Operations",
    category: "Public Utilities",
    date: "1922–2020",
    published: true,
    summary: "97 years of municipal coal power provided reliable electricity at lower-than-private rates. But public ownership of the institution did not translate into accountability for the externalities — coal ash contamination, air quality burden, and groundwater risk were all externalized onto adjacent communities, even under a publicly owned utility.",
    stats: [
      { value: "97 years", label: "Coal combustion at Eckert" },
      { value: "$21M+", label: "Erickson coal ash cleanup" },
      { value: "70%", label: "Red Cedar body-contact advisories since 2000" },
      { value: "351 MW", label: "Eckert plant capacity" },
      { value: "3 years late", label: "Federal groundwater monitoring results" },
    ],
    sections: [
      {
        eyebrow: "What the community genuinely received",
        heading: "The real benefits",
        description: "BWL's public ownership is a genuine structural advantage. These benefits were real.",
        items: [
          { label: "97 years of reliable municipal electricity", desc: "At 351 megawatts, Eckert powered downtown Lansing and the GM Grand River plant. Municipal ownership meant rates stayed lower than private utility alternatives." },
          { label: "BWL as a publicly owned utility", desc: "Unlike investor-owned utilities, BWL's surplus flows back to city operations. The city receives an annual transfer from BWL that funds public services." },
          { label: "Steam district heating", desc: "BWL's steam system heated downtown buildings for decades, reducing individual building boiler costs." },
        ],
      },
      {
        eyebrow: "What it actually cost",
        heading: "The real costs",
        description: "Public ownership of the institution did not prevent the externalization of environmental costs onto adjacent communities.",
        items: [
          { label: "Coal combustion health burden", desc: "97 years of particulate matter, sulfur dioxide, nitrogen oxides, and mercury emissions adjacent to a residential neighborhood. No epidemiological study of the cancer or respiratory disease burden in the adjacent community has been published for this site." },
          { label: "Erickson coal ash contamination", desc: "At the Delta Township plant (opened 1973), pollutants leaked from coal ash ponds. Federal groundwater monitoring results came in three years late under the 2015 federal rule. $21M+ in public cleanup costs documented. BWL asked for delays even after documenting the contamination." },
          { label: "Red Cedar and Grand River pollution", desc: "Coal ash leachate contributes to watershed contamination. The Red Cedar has had total-body-contact advisories approximately 70% of the time since 2000." },
          { label: "Decommissioning cost", desc: "Ratepayers fund decommissioning. The Eckert site transition and Erickson ash cleanup are public costs following decades of public-equivalent profit extraction during the operating years." },
        ],
      },
      {
        eyebrow: "The accounting gap",
        heading: "Public ownership ≠ community accountability",
        description: "BWL's public ownership is a genuine structural advantage — ratepayers benefit from the nonprofit model in ways that investor-owned utility customers do not. But public ownership of the institution did not translate into accountability for the externalities. The coal ash contamination, the air quality burden, and the groundwater risk were all externalized onto adjacent communities and future ratepayers, even under public ownership. Public ownership is necessary but not sufficient. Governance accountability to affected communities — not just to appointed commissioners — is what was missing.",
        items: [
          { label: "Governance gap", desc: "BWL's board is appointed, not elected. Affected communities adjacent to the Eckert plant and the Erickson ash ponds had no binding seat at the table before contamination decisions were made." },
          { label: "Ash removed June 2024", desc: "BWL announced all ash removed to a regulated landfill by June 2024 — but only after years of documented delay and federal deadline violations." },
        ],
      },
    ],
    principles: [
      { num: 2, name: "Democratic Member Control", violation: "Appointed board; affected communities had no binding vote on contamination decisions or cleanup timelines", evidence: "BWL asked for delays on groundwater monitoring even after documenting contamination; no community consent mechanism existed." },
      { num: 7, name: "Concern for Community", violation: "Coal ash contamination externalized onto adjacent communities and watersheds", evidence: "Red Cedar body-contact advisories 70% of the time since 2000; $21M+ cleanup; groundwater results 3 years late." },
    ],
    ownership: [
      { question: "Who owns it?", before: "City of Lansing / BWL (publicly owned)", after: "City of Lansing / BWL — but private development interest in decommissioned Eckert site", assessment: "mixed" },
      { question: "Who has power?", before: "BWL appointed board commissioners", after: "BWL appointed board commissioners + state/federal environmental regulators", assessment: "concerning" },
      { question: "Who benefits?", before: "All Lansing ratepayers (lower rates), city general fund (annual BWL transfer)", after: "All Lansing ratepayers (continued); adjacent communities did not receive compensating benefit for pollution burden", assessment: "mixed" },
      { question: "Who does the work?", before: "BWL plant workers, ratepayers fund operations", after: "Remediation contractors (ratepayer-funded)", assessment: "mixed" },
      { question: "Who makes the rules?", before: "BWL board (appointed) + state/federal environmental rules", after: "Same — but federal rules demonstrated insufficient to prevent multi-year delay", assessment: "concerning" },
    ],
    bottomLines: [
      { dimension: "People", impact: "mixed", description: "Reliable affordable electricity for all Lansing ratepayers — a genuine benefit. But 97 years of unquantified respiratory/cancer burden on adjacent residential community with no study ever commissioned." },
      { dimension: "Planet", impact: "negative", description: "97 years coal combustion. Erickson ash pond leachate into groundwater. Red Cedar advisories 70% of the time since 2000. $21M+ documented cleanup." },
      { dimension: "Prosperity", impact: "mixed", description: "Public ownership kept rates lower and returned surplus to city operations. But cleanup costs land on ratepayers; the operating benefit and the environmental liability accrue to different periods and different people." },
      { dimension: "Purpose", impact: "concerning", description: "Public ownership was structured to provide affordable power — it did. But the governance model didn't include accountability to the communities bearing the environmental cost, even though those communities also paid as ratepayers." },
    ],
    recommendations: [
      "Expand BWL board composition to include resident seats elected from affected neighborhoods, not just appointees from city council.",
      "Commission an independent epidemiological study of the health burden on communities adjacent to Eckert Station and Erickson ash ponds.",
      "Use BWL's annual city transfer as partial funding for environmental remediation in the affected watershed, not just general fund operations.",
    ],
    sources: [
      "Lansing Board of Water & Light Historical Facilities (lbwl.com)",
      "Bridge Michigan — BWL coal ash contamination",
      "EPA federal coal ash rule (2015)",
      "Red Cedar River water quality monitoring, MDEQ",
    ],
    sourceUrls: ["https://lbwl.com"],
    players: ["Lansing Board of Water & Light (BWL)", "BWL Board of Commissioners", "City of Lansing", "EPA", "Michigan EGLE"],
    scoreTransparency: "concerning",
    scoreConflicts: "ok",
    scoreMission: "concerning",
    scoreDemocraticControl: "high-risk",
    scoreOversight: "concerning",
  },

  {
    slug: "i-496-highway-displacement",
    boardName: "I-496 Highway Displacement",
    category: "Infrastructure",
    date: "1963–present",
    published: true,
    summary: "I-496 provided genuine regional connectivity — for commuters who did not live in the neighborhood it erased. 840+ homes and 600+ families, nearly all Black, were displaced by eminent domain into a redlined housing market. The community that paid the cost in 1963 is not the community receiving the remediation investment in 2025.",
    stats: [
      { value: "840+", label: "Homes demolished" },
      { value: "600+", label: "Families displaced" },
      { value: "$42M", label: "2020 Pave the Way reconstruction" },
      { value: "$205M", label: "2024–25 US-127/I-496 corridor project" },
      { value: "$1M", label: "2025 cap study grant (construction unfunded)" },
    ],
    sections: [
      {
        eyebrow: "What the community genuinely received",
        heading: "The real benefits",
        description: "I-496 provided genuine transportation improvements — but for populations different from those who paid the cost.",
        items: [
          { label: "Regional connectivity", desc: "I-496 connects I-96 to downtown Lansing and provided a genuine transportation improvement for commuters across the region." },
          { label: "Property value increases", desc: "In areas adjacent to improved access (though not in the neighborhood demolished to build it)." },
          { label: "Reduced commute times", desc: "For suburban residents entering downtown — the primary intended beneficiary." },
        ],
      },
      {
        eyebrow: "What it actually cost",
        heading: "The real costs",
        description: "The costs were concentrated on one community. The benefits went to another.",
        items: [
          { label: "840+ homes and businesses demolished", desc: "Taken via eminent domain. Families who had paid off mortgages were forced to restart. Generational wealth compounded in losses across decades." },
          { label: "600+ families displaced", desc: "Nearly all Black, forced into a redlined housing market with no ability to buy equivalent homes in equivalent neighborhoods." },
          { label: "Community fabric destroyed", desc: "Churches, social clubs, the only rhythm and blues record store in Lansing. The social capital of a functioning neighborhood cannot be priced, but its destruction has documented consequences." },
          { label: "Ongoing public maintenance cost", desc: "The 2020 Pave the Way reconstruction cost $42M. The 2024–2025 US-127/I-496 corridor project is a $205M investment. The proposed I-496 cap study (2025 grant) is $1M, with construction costs entirely unfunded." },
          { label: "60+ years of traffic pollution", desc: "The highway severed the neighborhood and concentrated traffic pollution over the remaining hemmed-in residents for over six decades." },
        ],
      },
      {
        eyebrow: "The accounting gap",
        heading: "The cost and the remedy are going to different communities",
        description: "The highway benefited primarily suburban commuters and regional freight movement — populations not displaced to build it. The 2025 cap study grant is a public acknowledgment that the original decision caused harm requiring remediation — but the $1M study doesn't cover the construction cost of the cap, which will again be a public expense. The community that paid the cost in 1963 is not the community receiving the remediation investment in 2025.",
        items: [
          { label: "Governance note", desc: "The decision traces to the city's 1958 Comprehensive Master Plan, made by state highway planners with no binding council, veto, or right of first refusal for the neighborhood in its path. Community leaders at the time lobbied for relocation assistance instead of fighting the highway, because the monocentric structure left them no other lever." },
          { label: "Named for the industrialist", desc: "The highway was named the R.E. Olds Freeway — after the same industrialist whose plant drew the workforce that built the neighborhood it destroyed." },
        ],
      },
    ],
    principles: [
      { num: 2, name: "Democratic Member Control", violation: "Affected neighborhood had no binding vote, veto, or right of first refusal on the decision", evidence: "1958 Comprehensive Master Plan made by state highway planners; community had no institutional recourse beyond lobbying for relocation assistance." },
      { num: 7, name: "Concern for Community", violation: "Regional transportation benefit achieved by demolishing a functioning Black community", evidence: "840+ homes demolished, 600+ families displaced into redlined housing market; no binding relocation guarantee." },
    ],
    ownership: [
      { question: "Who owns it?", before: "Homeowners (many Black families who had paid off mortgages)", after: "MDOT / public right-of-way; original families received eminent domain payment below replacement value in a redlined market", assessment: "extractive" },
      { question: "Who has power?", before: "State highway planners + city administration", after: "MDOT + federal highway program; affected community still has no binding authority over the I-496 cap project", assessment: "extractive" },
      { question: "Who benefits?", before: "Suburban commuters, regional freight, downtown employers", after: "Same — plus potential future cap development beneficiaries (TBD)", assessment: "extractive" },
      { question: "Who does the work?", before: "Community absorbed displacement without institutional support", after: "Remediation/cap construction will be public-funded", assessment: "extractive" },
      { question: "Who makes the rules?", before: "State highway planners (1958 Master Plan); no community consent", after: "MDOT + city; cap study requires federal environmental review with public comment, but no binding community benefit requirement yet", assessment: "extractive" },
    ],
    bottomLines: [
      { dimension: "People", impact: "negative", description: "840+ homes demolished, 600+ Black families displaced into redlined market. Generational wealth destroyed. Social fabric — churches, businesses, gathering places — erased. No restitution has been made to the displaced families." },
      { dimension: "Planet", impact: "negative", description: "60+ years of concentrated traffic emissions on the remaining residents of the severed neighborhood." },
      { dimension: "Prosperity", impact: "negative", description: "Regional economic connectivity was real, but achieved at the cost of destroying an existing community's economic base. The $247M+ in subsequent reconstruction costs is socialized; the original private benefit (faster commutes, rising suburban property values) was not." },
      { dimension: "Purpose", impact: "negative", description: "The 2025 cap study grant is the first public acknowledgment that the decision caused harm — 62 years later. The construction cost of the cap is entirely unfunded. The community that bore the cost is still waiting." },
    ],
    recommendations: [
      "Require that any I-496 cap construction benefit agreement give priority in development rights to descendants of displaced families.",
      "Commission an independent environmental justice audit of the I-496 corridor — health outcomes, property value impacts, and remediation costs — as the evidentiary basis for a formal reparative investment demand.",
      "Establish binding community benefit requirements on cap construction before the next federal funding application is submitted.",
    ],
    sources: [
      "Bridge Michigan — I-496 displacement history",
      "Wikipedia — Interstate 496",
      "City of Lansing 1958 Comprehensive Master Plan",
      "Rhinoceros Media investigative series",
    ],
    sourceUrls: [],
    players: ["MDOT", "City of Lansing", "U.S. Federal Highway Administration", "Lansing City Council (1958)"],
    scoreTransparency: "high-risk",
    scoreConflicts: "insufficient",
    scoreMission: "concerning",
    scoreDemocraticControl: "high-risk",
    scoreOversight: "high-risk",
  },

  {
    slug: "frandor-montgomery-drain",
    boardName: "Frandor / Montgomery Drain",
    category: "Commercial Development",
    date: "1954–present",
    published: true,
    summary: "Frandor's owners extracted 70 years of retail profit from an 80% impervious landscape with no stormwater accounting required. The public is now spending $50M to fix the watershed. This is the clearest case in Lansing's history of private profit, public cleanup — and it has a dollar figure attached to it.",
    stats: [
      { value: "80%", label: "Impervious surface in Montgomery Drain area" },
      { value: "80", label: "Documented pollutants in the Red Cedar" },
      { value: "$50M", label: "Public Montgomery Drain reconstruction" },
      { value: "70%", label: "Red Cedar body-contact advisories since 2000" },
      { value: "$0", label: "Frandor owner contribution to cleanup (beyond assessment)" },
    ],
    sections: [
      {
        eyebrow: "What the community genuinely received",
        heading: "The real benefits",
        description: "Frandor provided genuine regional retail and employment for 70 years.",
        items: [
          { label: "Retail access and jobs", desc: "Frandor provided regional retail employment and consumer convenience for 70 years." },
          { label: "Tax base contribution", desc: "Commercial property taxes from Frandor and surrounding development contributed to city and county revenues." },
        ],
      },
      {
        eyebrow: "What it actually cost",
        heading: "The real costs",
        description: "The stormwater runoff from 70 years of impervious surface development is now a $50M public cleanup.",
        items: [
          { label: "80% impervious surface", desc: "60 years of stormwater runoff from Frandor and surrounding development flowed directly into the Red Cedar River." },
          { label: "80 documented pollutants", desc: "Arsenic, petroleum, rubber, asbestos, acids — documented in the Red Cedar River downstream from the Montgomery Drain service area." },
          { label: "Total-body-contact advisories 70% of the time", desc: "Since 2000. The Red Cedar runs through a major university town. You cannot swim in it." },
          { label: "$50M public Montgomery Drain reconstruction", desc: "Paid by a city-wide drain tax and property owner assessments. Frandor's private owners contributed nothing beyond their proportional assessment — a fraction of the benefit they extracted." },
          { label: "Ongoing flooding", desc: "As recently as April 2026, businesses near East Kalamazoo Street flooded for days after heavy rains." },
        ],
      },
      {
        eyebrow: "The accounting gap",
        heading: "The Bolt v. Lansing lock-in",
        description: "Frandor's owners extracted 70 years of retail profit from an 80% impervious landscape with no stormwater accounting required. The arc in full: impervious surface created → runoff overwhelmed sewers → sewage into the Grand River → city tried to charge property owners → Chamber challenged → Supreme Court killed the fee → $50M public remediation follows.",
        items: [
          { label: "Bolt v. City of Lansing (1998)", desc: "459 Mich. 152 ruled Lansing's stormwater service charge an unconstitutional tax, establishing a three-part test for valid user fees. The Lansing Regional Chamber of Commerce filed the amicus brief against the city's ability to fund public stormwater infrastructure — the same Chamber whose members' development patterns created the runoff problem. The ruling remains controlling Michigan law today.", url: "" },
          { label: "Who filed the brief?", desc: "The Chamber filed on behalf of the challenging taxpayer, against the city's ability to fund stormwater infrastructure — while representing the developers whose impervious surfaces created the need for that infrastructure." },
        ],
      },
    ],
    principles: [
      { num: 7, name: "Concern for Community", violation: "Private development profit extracted; watershed contamination socialized onto public", evidence: "$50M public reconstruction; Red Cedar body-contact advisories 70% of time since 2000; Chamber lobbied against mechanism to charge polluters." },
    ],
    ownership: [
      { question: "Who owns it?", before: "Frandor private owners (commercial retail)", after: "Same — no change in ownership required to unlock cleanup funding", assessment: "extractive" },
      { question: "Who has power?", before: "Frandor owners + Chamber of Commerce (Bolt v. Lansing amicus)", after: "County drain commissioner + state environmental regulators; Bolt ruling still controls", assessment: "extractive" },
      { question: "Who benefits?", before: "Frandor private owners (70 years of retail profit)", after: "All county property owners who want a functioning watershed", assessment: "extractive" },
      { question: "Who does the work?", before: "Municipal stormwater system absorbs all runoff cost", after: "Public reconstruction project ($50M), funded by county-wide drain tax", assessment: "extractive" },
      { question: "Who makes the rules?", before: "Michigan Supreme Court (Bolt) + state stormwater rules that didn't require impervious-surface accounting", after: "Same framework; Bolt still controls. No mechanism to charge developers proportionally for downstream contamination they created.", assessment: "extractive" },
    ],
    bottomLines: [
      { dimension: "People", impact: "negative", description: "70% Red Cedar body-contact advisories since 2000. Ongoing flooding near East Kalamazoo Street. A major river through a university city is effectively unusable for recreation." },
      { dimension: "Planet", impact: "negative", description: "80 documented pollutants in the Red Cedar. 60+ years of stormwater runoff from 80% impervious surface. $50M public remediation underway." },
      { dimension: "Prosperity", impact: "negative", description: "70 years of private retail profit extracted from a landscape whose stormwater costs were never internalized. $50M public cleanup bill follows. Bolt v. Lansing ensures this pattern can repeat." },
      { dimension: "Purpose", impact: "negative", description: "No mechanism existed to require developers to internalize stormwater costs. The Chamber successfully blocked the city's attempt to create one. The public now bears the cost." },
    ],
    recommendations: [
      "Advocate for repeal or legislative override of the Bolt v. Lansing framework to allow proportional stormwater user fees tied to impervious surface area.",
      "Require environmental impact bonds from commercial developers as a condition of large-scale impervious-surface development permits.",
      "Make the $50M Montgomery Drain reconstruction cost a public case study in the argument for stormwater fee reform — dollar figure and responsible party both clearly on record.",
    ],
    sources: [
      "Lansing City Pulse — Montgomery Drain reporting",
      "459 Mich. 152, Bolt v. City of Lansing (1998)",
      "MDEQ Red Cedar River water quality monitoring",
      "Rhinoceros Media — Montgomery Drain investigation",
    ],
    sourceUrls: [],
    players: ["Frandor Shopping Center owners", "Lansing Regional Chamber of Commerce", "Ingham County Drain Commissioner", "Michigan Supreme Court"],
    scoreTransparency: "concerning",
    scoreConflicts: "concerning",
    scoreMission: "high-risk",
    scoreDemocraticControl: "high-risk",
    scoreOversight: "high-risk",
  },

  {
    slug: "af-group-privatization",
    boardName: "Michigan Accident Fund / AF Group",
    category: "Public Asset Privatization",
    date: "1912–present",
    published: true,
    summary: "A public institution built over 78 years was sold for $291M, converted to a downtown anchor employer, and is now a global reinsurance asset held by a Bermuda-based investment vehicle. The preservation of the building should not be confused with the preservation of the institution's public purpose.",
    stats: [
      { value: "78 years", label: "Public workers' comp (1912–1990)" },
      { value: "$291M", label: "1990 privatization price" },
      { value: "2026", label: "Sold to Enstar/Sixth Street (Bermuda-based)" },
      { value: "114 years", label: "Distance from public mission to current ownership" },
    ],
    sections: [
      {
        eyebrow: "What the community genuinely received",
        heading: "The real benefits",
        description: "The public institution delivered real value, and the architectural preservation was genuine.",
        items: [
          { label: "78 years of public workers' compensation", desc: "The Michigan Accident Fund provided accessible, publicly accountable workers' comp coverage from 1912 to 1990, as one of the nation's first state-run programs." },
          { label: "Downtown anchor employer", desc: "AF Group became the largest private employer in downtown Lansing after occupying the Ottawa Street Station, providing a stabilizing employment presence in a post-industrial core." },
          { label: "Historic preservation", desc: "The conversion of the Ottawa Street Station was a genuine architectural preservation achievement. The Art Deco landmark was saved." },
        ],
      },
      {
        eyebrow: "What it actually cost",
        heading: "The real costs",
        description: "Privatization converted a public institution's value into a one-time payment, then into an increasingly remote chain of private ownership.",
        items: [
          { label: "$291M privatization — one-time", desc: "A public institution built over 78 years was sold for $291M. That capital went to the state general fund one time, rather than continuing to generate public benefit indefinitely." },
          { label: "Workers' comp access shifted", desc: "Privatization shifted the institution's primary accountability from policyholders and workers to shareholders. Premium structures and claims management changed accordingly." },
          { label: "2026 sale to Enstar/Sixth Street", desc: "The institution is now a global reinsurance asset held by a Bermuda-based investment vehicle. The distance between the institution's original public mission and its current ownership is 114 years and several thousand miles." },
        ],
      },
      {
        eyebrow: "The accounting gap",
        heading: "Building preserved; mission privatized",
        description: "The historic preservation benefit is real. The downtown anchor employer benefit is real. But both were achieved by taking a public institution built over 78 years and giving it to a succession of private owners — each further removed from accountability to Lansing residents. The preservation of the building should not be confused with the preservation of the institution's public purpose.",
        items: [],
      },
    ],
    principles: [
      { num: 4, name: "Autonomy and Independence", violation: "Public institution converted to private ownership; no community stake retained", evidence: "$291M privatization in 1990; now Bermuda-based global reinsurance asset with no Lansing accountability structure." },
    ],
    ownership: [
      { question: "Who owns it?", before: "State of Michigan (public institution, 1912–1990)", after: "Enstar / Sixth Street (Bermuda-based investment vehicle, 2026)", assessment: "extractive" },
      { question: "Who has power?", before: "State of Michigan, publicly accountable", after: "Private board; Bermuda-based holding company; no Lansing accountability", assessment: "extractive" },
      { question: "Who benefits?", before: "Michigan workers (affordable, accessible workers' comp); state general fund", after: "Shareholders of global reinsurance company; downtown Lansing employers (anchor employer benefit); building tenants", assessment: "extractive" },
      { question: "Who does the work?", before: "State employees, public administration", after: "AF Group / Accident Fund employees (private)", assessment: "mixed" },
      { question: "Who makes the rules?", before: "Michigan Legislature (public workers' comp rules)", after: "Private board + state insurance regulation; no public mission accountability", assessment: "extractive" },
    ],
    bottomLines: [
      { dimension: "People", impact: "mixed", description: "Downtown anchor employment is a genuine benefit. Workers' comp access changed when privatized — harder to document precisely, but accountability shifted from public to private." },
      { dimension: "Planet", impact: "ok", description: "Historic building preservation is a genuine environmental/cultural benefit. No significant negative environmental impact from privatization itself." },
      { dimension: "Prosperity", impact: "negative", description: "$291M one-time vs. indefinite public benefit stream. Institution now generates returns for Bermuda-based investors. The public investment of 78 years built value that left the community." },
      { dimension: "Purpose", impact: "negative", description: "Original purpose: accessible, publicly accountable workers' comp. Current reality: global reinsurance asset. 114 years of institutional drift, each step further from accountability to Michigan workers." },
    ],
    recommendations: [
      "When the next publicly built institution faces privatization pressure, require a community benefit agreement that retains a public stake or worker-ownership option.",
      "Use AF Group's history as a case study in the argument for cooperative conversion as an alternative to full privatization: a worker-owned or policyholder-owned successor would have retained mission accountability.",
    ],
    sources: [
      "Lansing City Pulse — Ottawa Street Station history",
      "Michigan Capital Confidential",
      "AF Group corporate history",
    ],
    sourceUrls: [],
    players: ["State of Michigan", "AF Group / Accident Fund Insurance Company", "Enstar Group / Sixth Street Partners", "City of Lansing"],
    scoreTransparency: "concerning",
    scoreConflicts: "ok",
    scoreMission: "high-risk",
    scoreDemocraticControl: "high-risk",
    scoreOversight: "concerning",
  },

  {
    slug: "city-market-lansing-shuffle",
    boardName: "City Market / Lansing Shuffle",
    category: "Public Asset Privatization",
    date: "1938–present (ONGOING)",
    published: true,
    summary: "The Lansing Shuffle is a functioning business that activates the riverfront. The city council voted 6-1 to place the building's sale on the August 2026 ballot — but voters rejected it 12,172 to 10,804 (53–47%), keeping the parcel in public ownership. The governance question — what happens next with the lease and the building's public purpose — is unresolved.",
    stats: [
      { value: "81 years", label: "Public City Market (1938–2019)" },
      { value: "53–47%", label: "Voters reject sale (Aug 4, 2026)" },
      { value: "$4.2M", label: "Private investment in building" },
      { value: "$2,000/mo", label: "Current lease revenue" },
      { value: "0", label: "Independent reappraisals before 2026 vote" },
    ],
    sections: [
      {
        eyebrow: "What the community genuinely received",
        heading: "The real benefits",
        description: "The riverfront activation is genuine. The building investment is real.",
        items: [
          { label: "81 years of public food access", desc: "The WPA-built City Market served as a genuine food commons from 1938 to 2019. At its peak, you 'couldn't even get to the tables.'" },
          { label: "Riverfront activation", desc: "Rotary Park and the Lansing Shuffle have contributed to downtown foot traffic and riverfront use." },
          { label: "$4.2M private investment", desc: "In a building the city was not maintaining effectively." },
        ],
      },
      {
        eyebrow: "What it actually cost",
        heading: "The real costs",
        description: "A food commons became a shuffleboard bar. The community was asked to ratify the land sale eight years after the appraisal — and said no.",
        items: [
          { label: "Loss of food commons function", desc: "The market's food access function is gone. The building is now a shuffleboard bar." },
          { label: "$953K sale price at 2018 appraisal", desc: "The August 2026 ballot proposed transferring publicly owned riverfront land at a price set eight years before the vote, with no independent reappraisal. Voters rejected the sale 53-47." },
          { label: "$2,000/month lease revenue", desc: "The parks department receives $24,000/year under the current lease. That relationship continues as the governance question remains unresolved." },
          { label: "Rotary Park beach unusable", desc: "The park built around the river cannot be used for swimming due to E. coli — the same Red Cedar contamination documented in the Frandor case." },
        ],
      },
      {
        eyebrow: "Timeline",
        heading: "What happened",
        description: "",
        items: [
          { label: "2021", desc: "City signs a 10-year lease with Lansing Shuffle LLC that includes a purchase option at $953K (the 2018 appraisal). The option to buy was written into the lease from the start — not a later negotiation." },
          { label: "2026 — Council votes 6-1", desc: "City Council votes 6-1 to place the sale on the August 2026 primary ballot. The vote did not approve the sale — it asked voters to decide. Six PAC-aligned council members enabled the process; one dissented." },
          { label: "Aug 4, 2026 — Voters reject sale", desc: "12,172 no — 10,804 yes (53%–47%). The parcel stays in city ownership." },
          { label: "Aug 5, 2026", desc: "City spokesman confirms the parcel stays in city ownership. The existing lease continues. Governance question unresolved." },
        ],
      },
      {
        eyebrow: "The accounting gap",
        heading: "The purchase option was in the 2021 lease",
        description: "The Lansing Shuffle is a functioning business that activates the riverfront. That is a genuine benefit. But it was achieved by converting a public food commons into a private entertainment venue, and the purchase option written into the 2021 lease means the conversion to private ownership was the plan from the beginning — not an outcome the public was asked to weigh in on until 2026.",
        items: [
          { label: "Rotary Park funding breakdown", desc: "Delta Dental ($250,000), Auto-Owners Insurance ($75,000), Gillespie Group ($30,000), and the Rotary Club of Lansing ($400,000 — lead donor and namesake), matched dollar-for-dollar by the Capital Region Community Foundation. The Foundation's explicit stated mission: 'to attract and retain a talented workforce for our region' — a talent-retention strategy for the knowledge economy, not a public parks mission." },
        ],
      },
      {
        eyebrow: "What happens next",
        heading: "Three governance models on the table",
        description: "The sale is dead. The lease continues at $2,000/month. Three governance structures have been discussed as alternatives:",
        items: [
          { label: "Land trust + renegotiated lease", desc: "Transfer the parcel to a community land trust and renegotiate the lease on updated terms. The Shuffle LLC retains its operating business; the land is permanently protected from private sale." },
          { label: "Revenue-share restructuring", desc: "Renegotiate the lease to include a revenue-share component — the city receives a portion of gross receipts above a threshold, rather than a flat $2,000/month." },
          { label: "Cooperative conversion", desc: "Explore a path toward a worker- or community-owned cooperative structure for the building's operation, with the land retained by the city or a land trust." },
        ],
      },
      {
        eyebrow: "FOIA and the benefit test",
        heading: "What the public still can't see",
        description: "The vote resolved the immediate question. These accountability gaps remain:",
        items: [
          { label: "No independent reappraisal on record", desc: "The sale was proposed at a 2018 appraisal value. No independent reappraisal was ever produced for the 2026 ballot. Any future lease renegotiation should require one." },
          { label: "Benefit test criteria", desc: "What public benefit is the Shuffle providing that justifies the city's below-market lease terms? The parks department has not published a formal evaluation. Any renegotiation should establish written criteria for what public benefit the leaseholder is expected to deliver." },
          { label: "Use restrictions", desc: "The existing lease contains no public use restrictions on the building. If the next lease is renegotiated, binding public access requirements — hours, events, food programming — should be part of the terms." },
        ],
      },
    ],
    principles: [
      { num: 3, name: "Member Economic Participation", violation: "Community did not participate in the economic decision to convert a public food commons to private ownership", evidence: "Purchase option written into 2021 lease without public process; voters ultimately rejected the sale 53-47 when given the chance to weigh in." },
      { num: 7, name: "Concern for Community", violation: "Food access commons lost; sale price set 8 years before vote", evidence: "$953K 2018 appraisal; no independent reappraisal; vote confirmed public opposition to the disposition." },
    ],
    ownership: [
      { question: "Who owns it?", before: "City of Lansing (WPA-built public market, 1938)", after: "City of Lansing — sale rejected by voters Aug 4, 2026. 10-year lease with Lansing Shuffle LLC continues.", assessment: "mixed" },
      { question: "Who has power?", before: "City parks department + city council", after: "Voters checked the council; governance of the parcel's future is now unresolved", assessment: "mixed" },
      { question: "Who benefits?", before: "All Lansing residents (food commons, public riverfront)", after: "Shuffle LLC (operating business under lease); downtown visitors (riverfront activation); city (lease revenue)", assessment: "mixed" },
      { question: "Who does the work?", before: "City maintained (inadequately by its own admission)", after: "Private operator (Lansing Shuffle LLC)", assessment: "mixed" },
      { question: "Who makes the rules?", before: "City council + parks department", after: "City council (under public pressure after ballot rejection); lease terms to be renegotiated", assessment: "mixed" },
    ],
    bottomLines: [
      { dimension: "People", impact: "negative", description: "81 years of public food access replaced by a private shuffleboard bar. The governance question is unresolved. The community with the least access to private entertainment still has no food commons at this site." },
      { dimension: "Planet", impact: "ok", description: "WPA-era building preserved. No significant environmental impact from the lease arrangement itself." },
      { dimension: "Prosperity", impact: "mixed", description: "Voters rejected the $953K sale at an 8-year-old appraisal. $24K/year lease income continues. The city retains the asset — but the below-market lease terms remain unrenegotiated." },
      { dimension: "Purpose", impact: "negative", description: "Public food commons → private entertainment venue. The conversion to private ownership was embedded in the 2021 lease; the ballot rejection stopped the final step but didn't reverse the function change." },
    ],
    recommendations: [
      "Require an independent reappraisal of the parcel as the first step in any lease renegotiation.",
      "Establish written public benefit criteria for the lease: minimum public programming hours, food access components, or community event space.",
      "Explore community land trust as the vehicle for permanent public ownership — allows private operation while preventing future private sale.",
      "Establish a city council policy requiring independent reappraisal and a mandatory 90-day public comment period before any publicly owned land sale goes to a ballot question.",
    ],
    sources: [
      "Lansing City Pulse — Lansing Shuffle lease and sale reporting",
      "City of Lansing Parks Department",
      "Capital Region Community Foundation",
      "Ingham County election results, Aug 4, 2026",
    ],
    sourceUrls: [],
    players: ["Lansing Shuffle LLC", "City of Lansing Parks Department", "Lansing City Council", "Capital Region Community Foundation", "Rotary Club of Lansing", "Lansing Regional Chamber PAC"],
    scoreTransparency: "concerning",
    scoreConflicts: "concerning",
    scoreMission: "high-risk",
    scoreDemocraticControl: "concerning",
    scoreOversight: "concerning",
  },

  {
    slug: "lhc-dispositions",
    boardName: "Lansing Housing Commission Dispositions",
    category: "Housing",
    date: "2018–present",
    published: true,
    summary: "833 units of publicly owned housing became 66. The rehabilitation benefit went to the buildings. The cost of privatization — loss of tenant rights, 113 eviction cases, $4.71M+ in developer fees — went to the residents. The public cannot currently audit what happened: five FOIA requests, $4,430 in fees, zero records produced.",
    stats: [
      { value: "833 → 66", label: "Publicly owned units remaining" },
      { value: "92%", label: "Public housing stock lost" },
      { value: "113", label: "Eviction cases filed by SK against former public tenants" },
      { value: "$4.71M+", label: "Developer fees on two conversions alone" },
      { value: "$4,430", label: "FOIA fees charged; zero records produced" },
    ],
    sections: [
      {
        eyebrow: "What the community genuinely received",
        heading: "The real benefits",
        description: "The rehabilitation benefit was real. The subsidy continuity was real.",
        items: [
          { label: "$14.62M sale proceeds", desc: "LHC received approximately $72K per home from the SK sale. Those funds were available for agency operations or reinvestment." },
          { label: "RAD rehabilitation", desc: "The conversions involved genuine physical rehabilitation of aging housing stock. Residents received upgraded units." },
          { label: "Continued federal rent subsidy", desc: "RAD-converted units remain Section 8 eligible, so low-income residents retain access to subsidized housing." },
        ],
      },
      {
        eyebrow: "What it actually cost",
        heading: "The real costs",
        description: "92% of the city's publicly owned housing stock was converted to private arrangements. The people who paid the cost are the residents.",
        items: [
          { label: "833 to 66 publicly owned units", desc: "The agency's directly controlled public housing stock fell by 92%. This is the permanent loss of an asset built over 80 years with federal money." },
          { label: "Loss of tenant rights", desc: "Public housing tenants have federal grievance protections. Private landlord tenants do not. 202 families lost those protections when their homes were sold to SK." },
          { label: "113 eviction cases", desc: "Filed by SK against the people who lived in homes sold at $72K apiece with federal subsidies still flowing." },
          { label: "$4.71M+ in developer fees", desc: "On two documented conversions alone (South Washington Park, Mount Vernon Park, Hilldebrandt, and Oliver Gardens), developer fees of $2.34M and $2.37M are published. The public housing commission facilitated this transfer." },
          { label: "$4,430 in FOIA fees, zero records", desc: "The public cannot currently audit what happened to its housing stock. Five requests, $4,430 in fees, zero records produced." },
        ],
      },
      {
        eyebrow: "The accounting gap — five named conflicts of interest",
        heading: "The people who sat on both sides",
        description: "The benefit of rehabilitation went to the buildings. The cost of privatization went to the residents. And the mechanism was a small network of people sitting on both sides of every transaction simultaneously.",
        items: [
          { label: "Doug Fleming — LHC Executive Director", desc: "Signs Oliver Gardens II once on behalf of the public agency and once on behalf of the private general partner. Both sides of the same transaction." },
          { label: "Ashlee Barker — Cinnaire VP", desc: "Sits on the LHC board that approves deals benefiting her own employer, without recusing." },
          { label: "Emma Henry — LHC Board Chair / CAHP Executive Director", desc: "Chairs the LHC board while serving as executive director of Capital Area Housing Partnership (CAHP), the nonprofit that partners and competes with LHC for the same developments." },
          { label: "Rawley Van Fossen", desc: "Moves from CAHP to City of Lansing economic development director to Ingham County Land Bank board within weeks. The Land Bank then approves a deal with his former employer." },
          { label: "Thomas Lapka — Dual attorney", desc: "Serves as attorney to both LHC (the seller) and SK Investment Group (the buyer) in the scattered-site home sale." },
        ],
      },
    ],
    principles: [
      { num: 2, name: "Democratic Member Control", violation: "Residents had no binding vote or veto on conversion decisions that ended their federal tenant protections", evidence: "202 families lost public housing tenant protections; 113 eviction cases filed; zero resident seats on LHC decision-making body." },
      { num: 4, name: "Autonomy and Independence", violation: "LHC decisions were captured by a network of board members with overlapping financial interests", evidence: "Doug Fleming dual-signature; Ashlee Barker non-recusal; Emma Henry dual role; Thomas Lapka dual attorney — all documented." },
      { num: 5, name: "Education, Training, and Information", violation: "Public records withheld; $4,430 in fees for zero records", evidence: "Five FOIA requests; $4,430 in fees; zero records produced as of 2026." },
    ],
    ownership: [
      { question: "Who owns it?", before: "Lansing Housing Commission (public agency; federal money)", after: "SK Investment Group (scattered-site homes); private limited partnerships (RAD conversions)", assessment: "extractive" },
      { question: "Who has power?", before: "LHC board (appointed); HUD (federal oversight)", after: "Private landlords (SK); private limited partnerships; HUD oversight limited to Section 8 subsidy compliance", assessment: "extractive" },
      { question: "Who benefits?", before: "Public housing residents (federal tenant protections, affordable housing stock)", after: "Developer fee recipients ($4.71M+); SK Investment Group (202 homes at $72K each with federal subsidies still flowing); LHC agency operations ($14.62M proceeds)", assessment: "extractive" },
      { question: "Who does the work?", before: "LHC staff, public housing tenants maintain community", after: "Private property managers; tenants now in private landlord relationship with no federal grievance protections", assessment: "extractive" },
      { question: "Who makes the rules?", before: "LHC board + HUD regulations + federal public housing tenant rights", after: "Private landlord lease terms; HUD oversight limited to subsidy compliance, not tenant rights", assessment: "extractive" },
    ],
    bottomLines: [
      { dimension: "People", impact: "negative", description: "202 families lost federal tenant protections. 113 eviction cases filed. 833 units of publicly owned housing stock gone. The people who most needed stable housing with strong legal protections lost both." },
      { dimension: "Planet", impact: "ok", description: "Physical rehabilitation of aging housing stock is a genuine environmental benefit — better insulation, plumbing, energy systems." },
      { dimension: "Prosperity", impact: "negative", description: "$14.62M in sale proceeds vs. 80 years of federal public housing investment — a one-time payment for an irreplaceable public asset. $4.71M+ in developer fees extracted from the conversion process. Residents lost wealth-building potential (no path to homeownership in public housing, but at least stability)." },
      { dimension: "Purpose", impact: "negative", description: "LHC's purpose: provide stable, affordable housing to low-income Lansing residents. Result: 92% of publicly owned stock converted; 113 eviction cases filed against the residents it was built to serve; public cannot audit the decisions." },
    ],
    recommendations: [
      "Continue and escalate the FOIA fight with documented public support — every dollar of fees and every day of delay is a data point for the governance failure argument.",
      "Advocate for LHC's next disposition decision to include a community land trust or limited-equity cooperative bid as the alternative to RAD/Section 18 private partnership conversion.",
      "Require all LHC board members to recuse from votes involving their employers, clients, or affiliated nonprofits — codify as an LHC board ethics rule.",
      "Demand HUD OIG investigation into the dual-signature Oliver Gardens II transaction and the dual-attorney SK sale.",
    ],
    sources: [
      "HUD OIG — Lansing Housing Commission audit records",
      "GracesList — LHC property inventory, pre-conversion",
      "Rhinoceros Media — LHC Accountability Record",
      "City of Lansing FOIA records (pending)",
    ],
    sourceUrls: [],
    players: ["Lansing Housing Commission", "SK Investment Group", "Cinnaire", "Capital Area Housing Partnership (CAHP)", "HUD", "Doug Fleming (LHC ED)", "Ashlee Barker (Cinnaire/LHC board)", "Emma Henry (CAHP/LHC board chair)", "Thomas Lapka (dual attorney)"],
    scoreTransparency: "high-risk",
    scoreConflicts: "high-risk",
    scoreMission: "high-risk",
    scoreDemocraticControl: "high-risk",
    scoreOversight: "high-risk",
  },

  {
    slug: "ingham-land-bank",
    boardName: "Ingham County Land Bank",
    category: "Housing",
    date: "five-year record",
    published: true,
    summary: "The Land Bank has demolished approximately 47 buildings against 15 housing-unit completions in its documented five-year record — a continuation of a 15-year pattern of roughly 800 buildings demolished against 297 units created. The same County Treasurer who supplies the Land Bank's tax-foreclosed inventory chairs the board that decides what happens to it.",
    stats: [
      { value: "~47", label: "Demolitions in 5-year record" },
      { value: "~15", label: "Housing units completed in 5 years" },
      { value: "800 vs 297", label: "15-year demolitions vs units created" },
      { value: "1", label: "Structural conflict: Treasurer chairs board they supply" },
    ],
    sections: [
      {
        eyebrow: "What the community genuinely received",
        heading: "The stated benefit",
        description: "The Land Bank exists to address blight. The mechanism is real — the outcomes are not.",
        items: [
          { label: "Mechanism for returning properties to use", desc: "The Land Bank provides a mechanism for returning tax-foreclosed properties to some form of use, in principle preventing indefinite blight." },
        ],
      },
      {
        eyebrow: "What it actually cost",
        heading: "The real record",
        description: "Demolition without replacement is not neutral — it is a net subtraction of housing stock in a city with an affordability crisis.",
        items: [
          { label: "47 demolitions against 15 housing-unit completions", desc: "In the documented five-year record — a continuation of a 15-year pattern of roughly 800 buildings demolished against 297 units created." },
          { label: "Structural conflict of interest", desc: "The same County Treasurer who supplies the Land Bank's tax-foreclosed inventory chairs the board that decides what happens to it." },
          { label: "Overlap with the LHC network", desc: "Emma Henry sits at the center of both the LHC and Land Bank networks simultaneously. Rawley Van Fossen moved from CAHP to city economic development to Land Bank board, which then approved a deal with his former employer." },
        ],
      },
      {
        eyebrow: "The accounting gap",
        heading: "Demolition as policy, not necessity",
        description: "Demolition without replacement is a policy choice, not an inevitability. A board structurally positioned to have limited incentive to prioritize replacement over disposal will produce these outcomes. The Land Bank's 15-year record — 800 demolished, 297 created — is the predictable output of that structural incentive.",
        items: [
          { label: "Housing crisis context", desc: "Lansing has a documented affordable housing shortage. Every demolition without replacement makes that shortage worse, regardless of the building's condition. The Land Bank's demolition-heavy record is a policy choice that interacts directly with the housing affordability crisis." },
        ],
      },
    ],
    principles: [
      { num: 2, name: "Democratic Member Control", violation: "Board is structurally captured by the Treasurer who controls the input supply; no community voice in demolition vs. rehabilitation decisions", evidence: "County Treasurer chairs board; 15-year record of 800 demolitions vs. 297 units created; Emma Henry overlap with LHC network." },
    ],
    ownership: [
      { question: "Who owns it?", before: "Delinquent tax property owners → County Treasurer (tax foreclosure)", after: "Land Bank (temporary) → private developers or demolition (permanent)", assessment: "extractive" },
      { question: "Who has power?", before: "County Treasurer (controls input); Land Bank board (controls disposition)", after: "Same — Treasurer chairs the board, creating a single-actor control over both supply and disposition", assessment: "extractive" },
      { question: "Who benefits?", before: "Neighbors of blighted properties (blight removal)", after: "Private developers who receive Land Bank properties; municipality (tax base recovery); not the households who need affordable housing", assessment: "extractive" },
      { question: "Who does the work?", before: "County Treasurer administration", after: "Land Bank staff + demolition contractors (public-funded)", assessment: "extractive" },
      { question: "Who makes the rules?", before: "Michigan Land Bank Fast Track Authority Act + County Treasurer", after: "Same — no community benefit requirement on disposition decisions", assessment: "extractive" },
    ],
    bottomLines: [
      { dimension: "People", impact: "negative", description: "Net subtraction of housing stock in a city with an affordability crisis. 800 demolished vs. 297 created over 15 years. The people who most need affordable housing lose options with each demolition-without-replacement." },
      { dimension: "Planet", impact: "mixed", description: "Demolition removes blighted structures (genuine benefit) but also removes housing infrastructure that could have been rehabilitated. Rehabilitation is typically more environmentally efficient than demolition + new construction." },
      { dimension: "Prosperity", impact: "negative", description: "The 15-year demolition-heavy record represents a policy choice to reduce rather than rehabilitate the affordable housing supply. Each demolished unit that isn't replaced is a permanent loss of affordable housing capacity." },
      { dimension: "Purpose", impact: "negative", description: "The Land Bank's stated purpose is returning properties to productive use. 800 demolitions vs. 297 units created over 15 years is not consistent with that purpose — it is consistent with a board structured to favor disposal over replacement." },
    ],
    recommendations: [
      "Require the County Treasurer to recuse from Land Bank board decisions (retain an advisory seat, not the chair).",
      "Establish a binding community benefit requirement on Land Bank property dispositions: any property demolished without replacement must be replaced within 5 years on adjacent Land Bank inventory.",
      "Set a public target: Land Bank dispositions must result in net-positive affordable housing units on an annual basis.",
    ],
    sources: [
      "Rhinoceros Media — Ingham County Land Bank Series",
      "Michigan Land Bank Fast Track Authority Act",
      "City of Lansing housing data",
    ],
    sourceUrls: [],
    players: ["Ingham County Land Bank", "Ingham County Treasurer", "Capital Area Housing Partnership (CAHP)", "Emma Henry", "Rawley Van Fossen", "City of Lansing Economic Development"],
    scoreTransparency: "concerning",
    scoreConflicts: "high-risk",
    scoreMission: "high-risk",
    scoreDemocraticControl: "high-risk",
    scoreOversight: "high-risk",
  },

  {
    slug: "chamber-pac-electoral-loop",
    boardName: "Chamber/PAC Electoral Loop",
    category: "Electoral Accountability",
    date: "ongoing",
    published: true,
    summary: "The Lansing Regional Chamber PAC exists to elect officials aligned with Chamber member priorities. Six of eight sitting Lansing City Council members have accepted LRC-PAC money. This is the mechanism that shapes the outcome of every other case in this accounting. The Aug 4, 2026 voter rejection of the Shuffle sale (53-47%) shows what happens when binding public review is required — and why creating more of those mechanisms is the most direct path to accountability.",
    stats: [
      { value: "6 of 8", label: "Council members who've taken LRC-PAC money" },
      { value: "6 of 7", label: "LRC-PAC endorsed candidates who won in 2025" },
      { value: "6 of 9", label: "Charter Commission members backed by Chamber" },
      { value: "6-1", label: "Council placed Shuffle sale on ballot (voters rejected 53-47)" },
      { value: "11", label: "Near-identical 'Vote YES' letters from one PR firm in one day" },
    ],
    sections: [
      {
        eyebrow: "What the community genuinely receives",
        heading: "The claimed benefit",
        description: "The Chamber's stated mission is economic growth and business competitiveness. That produces some real benefits.",
        items: [
          { label: "Business advocacy", desc: "The Chamber advocates for regulatory and tax environments that support business operations — some of which benefit all Lansing residents (economic activity, employment)." },
          { label: "Electoral participation", desc: "PAC spending on candidates is constitutionally protected. The Chamber's stated mission — 'maintaining a pro-business outlook among elected officials' — is legal and publicly disclosed." },
        ],
      },
      {
        eyebrow: "What it actually costs",
        heading: "The structural problem",
        description: "This case is different from the others: it is not a single development but the mechanism that has shaped the outcome of every case above.",
        items: [
          { label: "6 of 8 council members funded by LRC-PAC", desc: "PAC donors are corporate lawyers, developers, lobbyists, and utility executives. Independent neighborhood businesses and residents contribute essentially none of the funding." },
          { label: "2025 election sweep", desc: "Six of seven LRC-PAC-endorsed candidates won — including Mayor Schor's re-election and four City Council seats. The Chamber also helped elect six of nine members of the Lansing City Charter Commission." },
          { label: "The manufactured consent case", desc: "On a 2026 downtown data center rezoning, a PR firm submitted at least eleven near-identical 'Vote YES' letters — nine in a single day, six within fourteen minutes of each other. The firm's partner sits on the Chamber's PAC endorsement committee while being paid to promote the project to the council that committee funds." },
          { label: "The loop described", desc: "The same body that funds the council also endorses and campaigns for council members who vote on tax breaks, brownfield captures, lease approvals, and asset dispositions that Chamber donors seek. This is the Chamber's own stated mission — its FAQ describes LRC-PAC's purpose as 'maintaining a pro-business outlook among elected officials.'" },
        ],
      },
      {
        eyebrow: "The accounting gap",
        heading: "This loop is why everything else keeps happening",
        description: "This case has no benefit/cost columns in the usual sense, because its function is to determine the benefit/cost split in every other case. It is the reason the council voted 6-1 to place the Shuffle sale on the August ballot, the reason the LHC board has the composition it has, and the reason a binding neighborhood council or independent reappraisal requirement has not yet been enacted despite being a simple council-majority action. Critically: the Aug 4, 2026 voter rejection of the Shuffle sale (53-47%) demonstrates that when binding public review is required, it constrains the loop — even a PAC-aligned council couldn't finalize the sale without voter approval, and voters said no. The reform agenda is therefore not only about winning elections. It is about creating more mechanisms that require binding public approval before public assets change hands.",
        items: [
          { label: "The ballot as a mechanism that worked", desc: "Voters rejected the Shuffle sale 53-47 on Aug 4, 2026 — the same sale the council had voted 6-1 to enable. This is evidence that binding public review requirements constrain PAC-funded governance when they exist. The reform agenda must create more of them: reappraisal requirements, CLT bid rights, mandatory public comment periods before any publicly owned land sale." },
          { label: "Only two non-PAC-funded council members", desc: "Ryan Kost and Adam Hussain have not accepted LRC-PAC money. They are the existing council allies for the reform agenda. Building from two to five requires the electoral work — but the Shuffle case shows structural mechanisms can win even before the electoral balance shifts." },
        ],
      },
    ],
    principles: [
      { num: 2, name: "Democratic Member Control", violation: "Electoral pipeline concentrates council representation among a PAC-donor network rather than neighborhood constituencies", evidence: "6 of 8 council members funded by LRC-PAC; PAC donors are corporate lawyers/developers/lobbyists, not neighborhood residents." },
      { num: 4, name: "Autonomy and Independence", violation: "The council that makes decisions about public assets is financially dependent on the PAC that represents the interests of those seeking those assets", evidence: "Shuffle sale 6-1; LHC board composition; Charter Commission composition — all shaped by Chamber electoral activity." },
    ],
    ownership: [
      { question: "Who owns it?", before: "City of Lansing voters (nominally)", after: "LRC-PAC donor network (operationally)", assessment: "extractive" },
      { question: "Who has power?", before: "Eight elected council members", after: "Six LRC-PAC-funded council members + Mayor Schor (LRC-PAC endorsed)", assessment: "extractive" },
      { question: "Who benefits?", before: "All Lansing residents (public-interest governance)", after: "Corporate lawyers, developers, lobbyists, and utility executives — the LRC-PAC donor base", assessment: "extractive" },
      { question: "Who does the work?", before: "Citizens who vote", after: "LRC-PAC staff + PR firms + endorsement committee members who also serve as paid advocates before the council they fund", assessment: "extractive" },
      { question: "Who makes the rules?", before: "Elected council (with voter accountability)", after: "LRC-PAC-funded elected council (with PAC-donor accountability superseding voter accountability on contested development decisions)", assessment: "extractive" },
    ],
    bottomLines: [
      { dimension: "People", impact: "negative", description: "Electoral representation of neighborhood residents is structurally disadvantaged relative to organized PAC spending. Six of eight council members have a financial relationship with the body that advocates before them on development and asset decisions." },
      { dimension: "Planet", impact: "negative", description: "The Chamber's pro-development orientation has historically favored impervious-surface commercial development (Frandor model) and opposed the stormwater fee mechanisms needed to fund watershed cleanup (Bolt v. Lansing)." },
      { dimension: "Prosperity", impact: "negative", description: "The PAC loop has consistently produced decisions that extract public assets into private hands at below-market prices (Shuffle), approve development without adequate community benefit requirements (GM retention, data center), and fund the council that makes those decisions." },
      { dimension: "Purpose", impact: "negative", description: "Democratic governance's purpose is to represent all constituents equally. The PAC loop structurally weights corporate donor interests over neighborhood resident interests in every contested development decision." },
    ],
    recommendations: [
      "Map Chamber PAC contribution amounts against each council member's voting record on public asset dispositions — publish the correlations on lansing.love.",
      "Identify two or three wards where community organizing and a non-PAC-funded candidate could be viable in the next election cycle.",
      "Build an electoral coalition explicitly around specific policy asks: reappraisal requirements, CLT bid rights, conflict-of-interest recusal rules.",
      "Require mandatory recusal for council members who have accepted PAC contributions from entities appearing before the council on development decisions.",
    ],
    sources: [
      "Rhinoceros Media — LRC-PAC Overview",
      "Lansing City Pulse — Chamber PAC reporting",
      "City of Lansing Council vote records",
      "Michigan campaign finance records",
    ],
    sourceUrls: [],
    players: ["Lansing Regional Chamber of Commerce PAC (LRC-PAC)", "Mayor Andy Schor", "Lansing City Council", "Ryan Kost", "Adam Hussain"],
    scoreTransparency: "concerning",
    scoreConflicts: "high-risk",
    scoreMission: "high-risk",
    scoreDemocraticControl: "high-risk",
    scoreOversight: "high-risk",
  },

  {
    slug: "ingham-medical-sparrow",
    boardName: "Ingham Medical / Sparrow Hospital",
    category: "Healthcare & Public Assets",
    date: "1913–2026 (ONGOING)",
    published: true,
    summary: "A county-owned hospital built in 1913 and a private nonprofit hospital founded in 1896 — both anchors of Lansing healthcare for over a century — have ended up governed by out-of-region institutions (McLaren in Grand Blanc, UM Board of Regents in Ann Arbor) through two separate transitions with no public vote on either. The 1996 AG intervention that blocked Columbia/HCA is a genuine public win. The 2023 UM-Sparrow zero-dollar merger and the subsequent 2025 wind-down of UM Health Plan (64,000 Lansing-area members) show the costs of governance without local accountability.",
    stats: [
      { value: "1992", label: "Year public county ownership ended — no public vote" },
      { value: "64,000", label: "Lansing-area members who lost UM Health Plan (2025)" },
      { value: "$800M", label: "UM pledged capital investment in Sparrow over 8 years" },
      { value: "113 years", label: "Continuous Ingham Medical hospital care (1913–2026)" },
      { value: "$0", label: "Disclosed purchase price on 2023 UM-Sparrow merger" },
    ],
    sections: [
      {
        eyebrow: "What the community genuinely received",
        heading: "The real benefits",
        description: "Unlike most cases in this document, this one doesn't have a clean villain. Several benefits were genuine.",
        items: [
          { label: "113 and 129 years of continuous hospital care", desc: "Ingham Medical (county-built 1913) and Sparrow (private nonprofit 1896) provided over a century of hospital care each. That continuity, through industrial decline and deindustrialization, is a genuine public good." },
          { label: "A blocked predatory takeover", desc: "In 1996, Michigan AG Frank Kelley sued to stop Columbia/HCA — which later pled guilty to 14 federal felonies and paid $1.7B in the largest healthcare fraud settlement in U.S. history — from buying 50% of the merged Lansing system. The suit succeeded. Lansing's hospital joined Michigan-based nonprofit McLaren instead. This is a real case of state government protecting a charitable asset against extraction." },
          { label: "$800M in pledged UM capital investment", desc: "University of Michigan pledged $800 million in Sparrow facility upgrades over eight years — funding a stand-alone regional system likely could not have afforded. The money is real." },
          { label: "New academic affiliations", desc: "MSU medicine programs at McLaren and UM Health-Michigan Medicine's research depth at Sparrow arguably improved clinical capability beyond what either standalone Lansing system could offer." },
        ],
      },
      {
        eyebrow: "What it actually cost",
        heading: "The real costs",
        description: "The throughline holds even when the individual actors aren't villains: public capacity was affirmatively transferred, sale by sale, merger by merger, into private and now non-local hands.",
        items: [
          { label: "Public ownership ended in 1992 with no public vote", desc: "Ingham County sold Ingham Medical Center — built and owned since 1913 with public money — to form Michigan Capital Healthcare. No ballot question. No documented public benefit requirement attached, as far as the record shows so far." },
          { label: "Governance moved out of the county, twice", desc: "1997: to McLaren, headquartered in Grand Blanc/Flint. 2023: Sparrow's ultimate corporate authority moved to the University of Michigan Board of Regents in Ann Arbor. Neither of Lansing's two hospital systems is now governed by anyone accountable to a Lansing or Ingham County ballot." },
          { label: "The physical evidence is being erased", desc: "The 1930 building — literally constructed with Ingham County public funds as the TB sanitorium's flagship structure — is currently being demolished (2024) to make way for 'greenspace and future redevelopment.' The public origin of the institution is disappearing from the built landscape at the same time it's disappearing from institutional memory." },
          { label: "64,000 Lansing-area members lost their health plan", desc: "UM Health Plan (formerly Sparrow's Physicians Health Plan) was wound down in 2025 after UM failed to find a buyer. This is a direct, quantifiable harm to local coverage access following the merger — distinct from the 'no purchase price disclosed' framing UM and Sparrow leadership used publicly." },
          { label: "The zero-dollar merger structure", desc: "Sparrow's 2023 deal with UM was structured with no purchase price — a known technique nonprofit-to-nonprofit mergers use partly to avoid the closer regulatory and public-disclosure scrutiny an actual sale would trigger. Worth checking whether Michigan's AG conducted the kind of charitable-conversion review it applied in 1996 against Columbia/HCA, or whether the 'no money changes hands' structure sidestepped that entirely." },
        ],
      },
      {
        eyebrow: "The accounting gap",
        heading: "Public institution, private accountability",
        description: "An asset built and owned by county government in 1913, funded by public dollars for half a century, has ended up — through two separate, decades-apart transactions — controlled by out-of-region institutions with no local electorate able to hold either accountable the way voters could once hold county commissioners accountable for hospital decisions.",
        items: [
          { label: "The 1996 block proves the AG's office can intervene", desc: "The Columbia/HCA case shows the Michigan AG's office can and will protect a charitable asset when it wants to — which raises the question of why no comparable public review appears to have accompanied either the quieter 1992 county sale or the 2023 UM merger's zero-dollar structure." },
          { label: "Governance note", desc: "This is the clearest example in the Full Accounting of the 'starve the failing systems' pattern working in reverse — public capacity was not starved by neglect, but affirmatively transferred, sale by sale, merger by merger, into private and now non-local hands, each time framed publicly as growth and improved care rather than loss of public control." },
          { label: "Open research threads", desc: "Full text of the 1992 Reorganization Agreement (likely in county archives). The Giddings opinion in Kelley v. Michigan Affiliated Healthcare System (Ingham County Circuit Court, Jan. 3, 1997). Whether Michigan's AG reviewed the 2023 UM-Sparrow merger. What became of the 64,000 former UM Health Plan members. Exact terms of the Child and Family Charities repurposing at the old Greenlawn campus." },
        ],
      },
    ],
    principles: [
      { num: 2, name: "Democratic Member Control", violation: "No public vote on either the 1992 county sale or the 2023 UM merger — community had no binding mechanism to contest either transition", evidence: "1992 Reorganization Agreement executed without ballot question; 2023 UM-Sparrow merger used zero-dollar 'member substitution' structure that avoided public sale scrutiny." },
      { num: 4, name: "Autonomy and Independence", violation: "Institution founded with county public funds now governed by out-of-region bodies (McLaren/Grand Blanc, UM Regents/Ann Arbor) with no accountability to Lansing or Ingham County voters", evidence: "Neither hospital system is now governed by anyone accountable to a Lansing or Ingham County ballot; UM Health Plan wind-down made without local input." },
    ],
    ownership: [
      { question: "Who owned it?", before: "Ingham County (Ingham Medical, 1913–1992); private nonprofit (Sparrow, 1896–2023)", after: "McLaren Health Care, Grand Blanc (Ingham Medical side); University of Michigan Board of Regents, Ann Arbor (Sparrow side)", assessment: "extractive" },
      { question: "Who has power?", before: "Ingham County Commissioners (elected, locally accountable)", after: "McLaren board (Grand Blanc/Flint) + UM Board of Regents (Ann Arbor) — neither accountable to Lansing voters", assessment: "extractive" },
      { question: "Who benefits?", before: "Ingham County residents (public hospital, county-funded)", after: "Academic medical institutions (research, training), regional patients (some clinical benefits), UM Health (system expansion)", assessment: "mixed" },
      { question: "Who bears the cost?", before: "County taxpayers funded the institution", after: "64,000 Lansing-area residents who lost their health plan; community that lost locally-accountable hospital governance; the 1930 building being demolished", assessment: "extractive" },
      { question: "Who makes the rules?", before: "County Commissioners (elected) + State AG oversight of charitable assets", after: "UM Board of Regents + McLaren board — no local elected body with binding authority over hospital governance decisions", assessment: "extractive" },
    ],
    bottomLines: [
      { dimension: "People", impact: "mixed", description: "$800M capital investment and academic affiliations improved clinical capacity. But 64,000 people lost their health plan post-merger, and governance accountability to Lansing residents was permanently severed across two transactions." },
      { dimension: "Planet", impact: "neutral", description: "Healthcare facility transitions have minimal direct environmental impact. The demolition of the 1930 county-built structure is a loss of embodied public capital." },
      { dimension: "Prosperity", impact: "mixed", description: "$800M in committed UM investment is real economic activity. But the zero-dollar merger structure and the UM Health Plan wind-down represent a net loss of locally-controlled institutional prosperity — capital that flows to Ann Arbor and Grand Blanc, not Lansing." },
      { dimension: "Purpose", impact: "negative", description: "A county-built public health institution's purpose was to serve Ingham County residents under local democratic accountability. That accountability no longer exists. The purpose has drifted to academic health system priorities set in Ann Arbor." },
    ],
    recommendations: [
      "File a formal Community Benefit Agreement request to City Council before any additional public benefit (tax abatement, zoning approval, public infrastructure) is extended to UMH-Sparrow expansion projects.",
      "FOIA the 1992 Reorganization Agreement from Ingham County archives to document what, if any, public benefit requirements were attached to the county sale.",
      "Request that Michigan's AG office confirm whether a charitable-conversion review was conducted for the 2023 UM-Sparrow merger, and if not, why the zero-dollar structure was deemed exempt.",
      "Track and document what happened to the 64,000 former UM Health Plan members — coverage alternatives, cost changes, coverage gaps.",
    ],
    sources: [
      "Asylum Projects (Ingham County Tuberculosis Sanitorium history)",
      "ProQuest trade press (Ingham Regional Medical Center consolidation, Dennis Litos interview)",
      "Health Affairs Journal (Kelley v. Michigan Affiliated Healthcare System, 16(2), 1997)",
      "Ingham County Board of Commissioners resolutions archive",
      "Lansing State Journal (McLaren Greenlawn demolition reporting)",
      "Regents of the University of Michigan (Sparrow affiliation communication, Dec. 2022)",
      "Crain's Detroit Business",
      "Fierce Healthcare",
      "Chief Healthcare Executive",
      "Bridge Michigan (UM Health-Sparrow merger and UM Health Plan wind-down reporting)",
    ],
    sourceUrls: [],
    players: ["McLaren Health Care", "University of Michigan Board of Regents", "Ingham County (former owner)", "Michigan Attorney General (Frank Kelley, 1996)", "Columbia/HCA", "Sparrow Health System", "UM Health Plan (wound down 2025)"],
    scoreTransparency: "concerning",
    scoreConflicts: "concerning",
    scoreMission: "concerning",
    scoreDemocraticControl: "high-risk",
    scoreOversight: "concerning",
  },
];

async function main() {
  console.log(`Seeding ${cases.length} Full Accounting cases...`);

  for (const c of cases) {
    const { slug, ...data } = c;
    const result = await prisma.boardCaseStudy.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
    console.log(`  ✓ ${result.slug} (${result.boardName})`);
  }

  console.log("Done.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
