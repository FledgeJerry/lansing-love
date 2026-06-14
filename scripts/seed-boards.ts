import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// Compute member status from term string
// Source date: March 12, 2026. Flag anything expired before today.
const TODAY = new Date("2026-06-14");

function memberStatus(name: string, termExpires: string | undefined, noteFlag?: string): string {
  if (noteFlag === "proposed") return "proposed";
  if (name.toLowerCase().startsWith("vacant")) return "vacant";
  if (!termExpires || termExpires === "—" || termExpires === "ex officio") return "current";
  // Try to parse the date
  const d = new Date(termExpires);
  if (!isNaN(d.getTime()) && d < TODAY) return "expired";
  return "current";
}

type MemberInput = { name: string; role?: string; termExpires?: string; notes?: string; proposed?: boolean };

function m(name: string, role?: string, termExpires?: string, notes?: string, proposed?: boolean): MemberInput {
  return { name, role, termExpires, notes, proposed };
}

const BOARDS: { slug: string; name: string; notes?: string; sortOrder: number; members: MemberInput[] }[] = [
  {
    slug: "arts-and-culture-commission",
    name: "Arts and Culture Commission",
    sortOrder: 1,
    members: [
      m("vacant (Clara Martinez)", "1st Ward", "6/30/2026", undefined, true),
      m("Kevin Bonds",             "2nd Ward", "6/30/2027"),
      m("vacant",                  "3rd Ward", "6/30/2028"),
      m("vacant",                  "4th Ward", "6/30/2029"),
      m("Shirley Carter-Powell",   "At-Large", "6/30/2026"),
      m("vacant (Morgan Butts)",   "At-Large", "6/30/2026", undefined, true),
      m("Mary Toshach",            "At-Large", "6/30/2027"),
      m("Diane Gardin",            "At-Large", "6/30/2027"),
      m("Alyssa Turcsak",          "At-Large", "6/30/2028"),
      m("Charles Calati Jr.",      "At-Large", "6/30/2028"),
      m("Morgan Butts",            "At-Large", "6/30/2029"),
      m("Stephanie Palagyi",       "At-Large", "6/30/2029"),
    ],
  },
  {
    slug: "board-of-ethics",
    name: "Board of Ethics",
    notes: "Case study: /governance/issues/board-of-ethics — declined to issue opinion on 4 documented conflict complaints; voice vote, no roll call.",
    sortOrder: 2,
    members: [
      m("Luna Brown",       "Council – 1st Ward",    "6/30/2029"),
      m("James DeLine",     "Council – 2nd Ward",    "6/30/2026"),
      m("Rachelle Franklin","Council – 3rd Ward",    "6/30/2027"),
      m("Ryan Wier",        "Council – 4th Ward",    "6/30/2028"),
      m("James Cavanagh",   "Mayoral – At-Large",    "6/30/2026"),
      m("Charles Filice",   "Mayoral – At-Large",    "6/30/2027"),
      m("Janielle Houston", "Mayoral – At-Large",    "6/30/2028"),
      m("R Cole Bouck",     "Mayoral – At-Large",    "6/30/2029"),
    ],
  },
  {
    slug: "board-of-fire-commissioners",
    name: "Board of Fire Commissioners",
    sortOrder: 3,
    members: [
      m("Barbara Lawrence",                       "1st Ward", "6/30/2029"),
      m("Jarrod LaRue",                           "2nd Ward", "6/30/2026"),
      m("vacant (Kathleen Tobe) / Michael Lynn Jr.", "3rd Ward", "6/30/2027", undefined, true),
      m("Gina Nelson",                            "4th Ward", "6/30/2028"),
      m("Krishna Singh",                          "At-Large", "6/30/2026"),
      m("Mallory Willis",                         "At-Large", "6/30/2027"),
      m("Jon Scott",                              "At-Large", "6/20/2028"),
      m("Stephen Purchase",                       "At-Large", "6/30/2029"),
    ],
  },
  {
    slug: "board-of-plumbing",
    name: "Board of Plumbing",
    notes: "ACCOUNTABILITY FLAG: 4 of 5 active members are serving on terms expired between 2015 and 2016 — up to 11 years past expiration. No reappointment documented.",
    sortOrder: 4,
    members: [
      m("Walter Steele",   "Citizen",              "6/30/2015"),
      m("Stephen Reck",    "Citizen",              "6/30/2016"),
      m("Geoffrey Mowry",  "Journeyman Plumber",   "6/30/2016"),
      m("vacant",          "Journeyman Plumber",   "6/30/2026"),
      m("William Pond",    "Master Plumber",       "6/30/2016"),
      m("vacant",          "Master Plumber",       "6/30/2027"),
    ],
  },
  {
    slug: "board-of-police-commissioners",
    name: "Board of Police Commissioners",
    notes: "Case study: /governance/issues/flock-surveillance — board had zero review of 20 Flock ALPR cameras deployed 7 months before first public discussion.",
    sortOrder: 5,
    members: [
      m("Florensio Hernandez", "1st Ward", "6/30/2029"),
      m("Samuel Brewster",     "2nd Ward", "6/30/2026"),
      m("Patty Farhat",        "3rd Ward", "6/30/2027"),
      m("Andrea Bitely",       "4th Ward", "6/30/2028"),
      m("Randy Watkins",       "At-Large", "6/30/2026"),
      m("Damon Milton",        "At-Large", "6/30/2027"),
      m("DeYeya Jones",        "At-Large", "6/30/2028"),
      m("Irene Iris Cotton",   "At-Large", "6/30/2029"),
    ],
  },
  {
    slug: "board-of-public-service",
    name: "Board of Public Service",
    sortOrder: 6,
    members: [
      m("Nancy Mahlow",      "1st Ward", "6/30/2029"),
      m("Hugh McNichol",     "2nd Ward", "6/30/2026"),
      m("Thomas Hickson Jr.","3rd Ward", "6/30/2027"),
      m("Mark Clouse",       "4th Ward", "6/30/2028"),
      m("Samara Morgan",     "At-Large", "6/30/2026"),
      m("Jason Wilkes",      "At-Large", "6/30/2027"),
      m("Tracy Tanner",      "At-Large", "6/30/2028"),
      m("Ronald Wilson",     "At-Large", "6/30/2029"),
    ],
  },
  {
    slug: "board-of-review",
    name: "Board of Review",
    sortOrder: 7,
    members: [
      m("Sharon Civils",   "At-Large", "6/30/2026"),
      m("Kim Butcher",     "At-Large", "6/30/2027"),
      m("Eric Schertzing", "At-Large", "6/30/2028"),
    ],
  },
  {
    slug: "board-of-water-and-light",
    name: "Board of Water and Light",
    notes: "Case study: /governance/issues/bwl — all seats mayoral-appointed; 9 BWL employees donated $6K to LRC-PAC in 48 hours; CFO on Chamber board testified for Deep Green. Charter reform needed: elected seats, enforced terms.",
    sortOrder: 8,
    members: [
      m("Semone James",          "1st Ward",                           "6/30/2029"),
      m("Beth Graham",           "2nd Ward",                           "6/30/2026"),
      m("Deshon Leek",           "3rd Ward",                           "6/30/2027"),
      m("Sandra Zerkle",         "4th Ward",                           "6/24/2028"),
      m("David Price",           "At-Large",                           "6/30/2026"),
      m("Dale Schrader",         "At-Large",                           "6/30/2027"),
      m("Christopher Harkins",   "At-Large",                           "6/20/2028"),
      m("Anthony Mullen",        "At-Large",                           "6/30/2029"),
      m("Brian Ross",            "Delhi-DeWitt-Lansing-Meridian Townships", "6/30/2026"),
      m("Robert Worthy",         "Delta Township",                     "6/30/2027"),
      m("Jean-Richard Beauboeuf","East Lansing",                       "6/30/2027"),
    ],
  },
  {
    slug: "board-of-zoning-appeals",
    name: "Board of Zoning Appeals",
    sortOrder: 9,
    members: [
      m("Emily Jefferson",    "At-Large",                         "6/30/2024"),
      m("Kurt Berryman",      "At-Large",                         "6/30/2026"),
      m("Stephen Robertson",  "At-Large",                         "6/30/2026"),
      m("Heath Lowry",        "At-Large",                         "6/30/2026"),
      m("Robert Fryling",     "At-Large",                         "6/30/2027"),
      m("Christopher Iannuzzi","At-Large",                        "6/30/2028"),
      m("Marcie Alling",      "At-Large",                         "6/30/2028"),
      m("Mitch Rice",         "At-Large",                         "6/30/2028"),
      m("Monte Jackson",      "Planning Commission Representative","9/30/2026"),
    ],
  },
  {
    slug: "building-board-of-appeals",
    name: "Building Board of Appeals",
    notes: "ACCOUNTABILITY FLAG: 3 of 5 active members serving on terms expired 2016–2019. No reappointment documented.",
    sortOrder: 10,
    members: [
      m("James R. Drake",   "At-Large", "6/30/2016"),
      m("Donald Heck",      "At-Large", "6/30/2018"),
      m("Stephanie Space",  "At-Large", "6/30/2019"),
      m("vacant",           "At-Large", "6/30/2026"),
      m("vacant",           "At-Large", "6/30/2027"),
    ],
  },
  {
    slug: "capital-area-district-library-board",
    name: "Capital Area District Library Board",
    sortOrder: 11,
    members: [
      m("Brian Baer",        "City of Lansing", "4/15/2026"),
      m("Julie Vandenboom",  "City of Lansing", "4/15/2028"),
    ],
  },
  {
    slug: "capital-area-transportation-authority-board",
    name: "Capital Area Transportation Authority Board",
    sortOrder: 12,
    members: [
      m("Eric Tans",        "City of Lansing", "9/30/2026"),
      m("Nathan Triplett",  "City of Lansing", "9/30/2027"),
      m("Derek Melot",      "City of Lansing", "9/30/2027"),
      m("Chelsea Dowler",   "City of Lansing", "9/30/2028"),
    ],
  },
  {
    slug: "capital-region-airport-authority-board",
    name: "Capital Region Airport Authority Board",
    sortOrder: 13,
    members: [
      m("John Shaski",     "City of Lansing", "9/30/2026"),
      m("Matthew Lantzy",  "City of Lansing", "9/30/2028"),
      m("Yvette Collins",  "City of Lansing", "9/30/2028"),
    ],
  },
  {
    slug: "charter-commission",
    name: "Charter Commission",
    notes: "Elected body — not mayoral appointees. No term expiration dates in source.",
    sortOrder: 14,
    members: [
      m("Brian Jeffries"),
      m("Ben Dowd"),
      m("Liz Boyd"),
      m("Joan Bauer"),
      m("Jazmin Anderson"),
      m("Lori Adams Simon"),
      m("Jody Washington"),
      m("Guillermo Lopez"),
      m("Muhammad Qawwee"),
    ],
  },
  {
    slug: "community-corrections-advisory-board",
    name: "Community Corrections Advisory Board",
    sortOrder: 15,
    members: [
      m("Ryan Kost",          "City Councilmember",          "12/31/2025"),
      m("Jacqueline Gallant", "Joint – Adult Probation",     "9/17/2027"),
      m("Jason Cords",        "Joint – Business Community",  "9/17/2028"),
      m("Becky Pena",         "Joint – Communications Media","9/17/2028"),
      m("Monica Jahner",      "Joint – Community Alternative Program", "9/17/2026"),
      m("Ayanna Neal",        "Joint – Criminal Defense",    "9/17/2027"),
      m("Danielle Grubaugh",  "Joint – Workforce Development","9/17/2028"),
    ],
  },
  {
    slug: "demolition-board",
    name: "Demolition Board",
    sortOrder: 16,
    members: [
      m("David Muylle",    "At-Large"),
      m("Kimberly Shirey", "At-Large"),
      m("Joseph Vitale",   "At-Large"),
    ],
  },
  {
    slug: "diversity-equity-inclusion-advisory-board",
    name: "Diversity, Equity, and Inclusion Advisory Board",
    sortOrder: 17,
    members: [
      m("Terrence L. Frazier",           "1st Ward", "6/30/2029"),
      m("vacant (Hannah Nelson-Jones)",  "2nd Ward", "6/30/2026", undefined, true),
      m("Cheryl Bernard",                "3rd Ward", "6/30/2027"),
      m("Sharon Gillison",               "4th Ward", "6/30/2028"),
      m("vacant (Florensio Hernandez)",  "At-Large", "6/30/2025"),
      m("Emily Sorroche",                "At-Large", "6/30/2026"),
      m("Byron Haskins",                 "At-Large", "6/30/2027"),
      m("DeAnna Brown",                  "At-Large", "6/30/2028"),
    ],
  },
  {
    slug: "downtown-lansing-inc-board",
    name: "Downtown Lansing, Inc. Board",
    sortOrder: 18,
    members: [
      m("Josh Pugh",                        "Adjacent Neighborhood Resident", "6/30/2026"),
      m("Julie Durham",                     "Business Representative",        "6/30/2026"),
      m("Keri Tomac",                       "Business Representative",        "6/30/2026"),
      m("vacant (Nikki Thompson Frazier)",  "Business Representative",        "6/30/2027", undefined, true),
      m("Jesus (Jesse) Flores",             "Business Representative",        "6/30/2028"),
      m("Alexander Rusek",                  "Business Representative",        "6/30/2028"),
      m("Jennifer Hinze",                   "Business Representative",        "6/30/2029"),
      m("Jennifer Estill",                  "Business Representative",        "6/30/2029"),
      m("Kris Klein",                       "City Representative",            "6/30/2027"),
    ],
  },
  {
    slug: "economic-development-corporation",
    name: "Economic Development Corporation / Tax Increment Finance Authority / Lansing Brownfield Redevelopment Authority Board",
    notes: "ACCOUNTABILITY FLAG: Rawley VanFossen serves ex officio as Economic Development & Planning Director — the same role he holds on the LEPFA board. He simultaneously sits on the Land Bank board as treasurer. See Land Bank case study.",
    sortOrder: 19,
    members: [
      m("Bryan Britten",     "At-Large",                              "2/28/2027"),
      m("Alane Laws-Barker", "At-Large",                              "2/28/2027"),
      m("Shelley Boyd",      "At-Large",                              "2/28/2028"),
      m("Chaz Carrillo",     "At-Large",                              "2/28/2028"),
      m("Catherine Rathbun", "At-Large",                              "2/28/2028"),
      m("Calvin Jones",      "At-Large",                              "2/28/2029"),
      m("Cristina Benton",   "At-Large",                              "2/28/2029"),
      m("Jonathan Smith",    "At-Large",                              "2/28/2029"),
      m("Rawley VanFossen",  "Economic Development and Planning Director", "ex officio", "Also: Land Bank board treasurer, former CAHP executive director. See /governance/issues/ingham-county-land-bank"),
    ],
  },
  {
    slug: "elected-officers-compensation-commission",
    name: "Elected Officers Compensation Commission",
    sortOrder: 20,
    members: [
      m("Derek Melot",      "At-Large", "10/1/2026"),
      m("Caitlin O'Rourke", "At-Large", "10/1/2027"),
      m("Liisa Speaker",    "At-Large", "10/1/2028"),
      m("Ben Kohrman",      "At-Large", "10/1/2029"),
      m("Steve Young",      "At-Large", "10/1/2030"),
      m("Holli Seabury",    "At-Large", "10/1/2031"),
      m("Jeff McAlvey",     "At-Large", "10/1/2032"),
    ],
  },
  {
    slug: "election-commission",
    name: "Election Commission",
    sortOrder: 21,
    members: [
      m("Jennifer Czeiszperger", "City Assessor", "ex officio"),
      m("Gregory Venker",        "City Attorney", "ex officio"),
      m("Chris Swope",           "City Clerk",    "1/1/2030"),
    ],
  },
  {
    slug: "electrical-board",
    name: "Electrical Board",
    notes: "ACCOUNTABILITY FLAG: 2 of 5 active members serving on terms expired 2016 and 2019.",
    sortOrder: 22,
    members: [
      m("vacant",         "Citizen",               "6/30/2028"),
      m("Joseph Peters",  "Electric Utility",      "6/30/2016"),
      m("Daniel Barclay", "Electrical Contractor", "6/30/2025"),
      m("Craig Calkins",  "Electrical Journeyman", "6/30/2019"),
      m("vacant",         "Manufacturing Industry","6/20/2026"),
    ],
  },
  {
    slug: "employees-retirement-system-board",
    name: "Employees' Retirement System Board of Trustees",
    sortOrder: 23,
    members: [
      m("Jeremy Garza",         "City Council",              "12/31/2025", "Also: Council Member, At-Large; on Police & Fire Retirement Board; subject of Board of Ethics complaint. See /governance/issues/board-of-ethics"),
      m("Chris R. Wright",      "City Treasurer",            "ex officio"),
      m("Matthew Bahr",         "Elected",                   "6/30/2026"),
      m("Larry Ebright",        "Elected",                   "6/30/2028"),
      m("Darren Kalis",         "Elected",                   "6/30/2029"),
      m("Elizabeth O'Leary",    "Human Resources Director",  "ex officio"),
      m("Mary Ellen Jeffries",  "Lansing Resident Non-Retiree", "6/30/2028"),
      m("Andy Schor",           "Mayor",                     "1/1/2030"),
      m("Scott Dedic",          "Michigan Resident Non-Retiree", "6/30/2028"),
      m("Linda Sanchez-Gazella","Michigan Resident Retiree", "6/30/2029"),
    ],
  },
  {
    slug: "historic-district-commission",
    name: "Historic District Commission",
    sortOrder: 24,
    members: [
      m("Brigette Booser",              "At-Large", "6/30/2025"),
      m("Melissa Riba",                 "At-Large", "6/30/2026"),
      m("Samantha Troutman",            "At-Large", "6/30/2026"),
      m("James Bell",                   "At-Large", "6/30/2026"),
      m("Selina Mate",                  "At-Large", "6/30/2027"),
      m("Ashley Smith",                 "At-Large", "6/30/2027"),
      m("vacant (Jaclyn Lillis-Warwick)","At-Large","6/30/2027", undefined, true),
      m("Carol Skillings",              "At-Large", "6/30/2028"),
      m("Cassandra Nelson",             "At-Large", "6/30/2028"),
    ],
  },
  {
    slug: "human-relations-community-services-advisory-board",
    name: "Human Relations and Community Services Advisory Board",
    sortOrder: 25,
    members: [
      m("Glenn Lopez",             "1st Ward", "6/30/2029"),
      m("Ronald Embry",            "2nd Ward", "6/30/2026"),
      m("Versey Williams",         "3rd Ward", "6/30/2027"),
      m("vacant (Paul Dripchak)", "4th Ward", "6/30/2028", undefined, true),
      m("Melissa Horste",          "At-Large", "6/30/2026"),
      m("vacant (Frank Lee)",      "At-Large", "6/30/2027", undefined, true),
      m("Sean Gehle",              "At-Large", "6/30/2028"),
      m("Dr. Thomas Woods",        "At-Large", "6/30/2029"),
    ],
  },
  {
    slug: "income-tax-board-of-review",
    name: "Income Tax Board of Review",
    sortOrder: 26,
    members: [
      m("Robert Emerson",   "At-Large", "6/30/2026"),
      m("Kenneth Salzman",  "At-Large", "6/30/2026"),
      m("Peter Jones",      "At-Large", "6/30/2026"),
    ],
  },
  {
    slug: "joint-building-authority-board",
    name: "Joint Building Authority Board of Commissioners",
    sortOrder: 27,
    members: [
      m("vacant",       "Joint Appointee",   "6/30/2026"),
      m("Jake Brower",  "Lansing Appointee", "6/30/2026"),
    ],
  },
  {
    slug: "lansing-building-authority-board",
    name: "Lansing Building Authority Board of Commissioners",
    sortOrder: 28,
    members: [
      m("Gregory Venker",   "City Attorney",    "ex officio"),
      m("Crystal Thomas",   "Finance Director", "ex officio"),
      m("Andy Kilpatrick",  "Public Service",   "ex officio"),
    ],
  },
  {
    slug: "lepfa-board",
    name: "Lansing Entertainment and Public Facilities Authority (LEPFA) Board",
    notes: "ACCOUNTABILITY FLAG: Rawley VanFossen serves ex officio — same person who sits on EDC/TIFA board and Land Bank board. Kenrick Hall (CVB Designee) term expired 6/30/2025.",
    sortOrder: 29,
    members: [
      m("vacant (Larry Leatherwood) / Patrick Spyke", "At-Large", "6/30/2026", undefined, true),
      m("Danielle Lenz",     "At-Large",                              "6/30/2026"),
      m("Maureen Saxton",    "At-Large",                              "6/30/2026"),
      m("Paul Collins",      "At-Large",                              "6/30/2027"),
      m("Charles Mickens",   "At-Large",                              "6/30/2027"),
      m("Dustin Howard",     "At-Large",                              "6/30/2028"),
      m("Lolo Robison",      "At-Large",                              "6/30/2028"),
      m("Tracie Anne Kent",  "At-Large",                              "6/30/2028"),
      m("Kenrick Hall",      "CVB Designee",                          "6/30/2025"),
      m("Rawley VanFossen",  "Economic Development & Planning Director","ex officio", "Also: EDC/TIFA board (ex officio), Land Bank board treasurer. See /governance/issues/ingham-county-land-bank"),
      m("Crystal Thomas",    "Finance Director",                      "ex officio"),
      m("vacant",            "Internal Auditor",                      "ex officio"),
    ],
  },
  {
    slug: "lansing-gateway-corridor-improvement-authority",
    name: "Lansing Gateway Corridor Improvement Authority Board",
    sortOrder: 30,
    members: [
      m("Andy Schor or Bob Van Arkle", "Mayor or Assignee",                   "1/1/2026"),
      m("Dianne Hartwell",             "Ownership/business & resident within 1/2 mile", "6/30/2027"),
      m("Mary Alicia Gonzales",        "Ownership/business interest",          "6/30/2025"),
      m("Jo Sinha",                    "Ownership/business interest",          "6/30/2026"),
      m("Robert Benstein",             "Ownership/business interest",          "6/30/2026"),
      m("Steve Bohnet",                "Ownership/business interest",          "6/30/2028"),
      m("Kambriana Crank",             "Resident within 1/2 mile",             "6/30/2027"),
      m("Hillary Kipp",                "Resident within 1/2 mile",             "6/30/2028"),
    ],
  },
  {
    slug: "lansing-housing-commission",
    name: "Lansing Housing Commission",
    notes: "Case study: /governance/issues/lansing-housing-commission — 51 families evicted, $17.7M sale proceeds, board members with documented conflicts of interest on both sides of transactions.",
    sortOrder: 31,
    members: [
      m("Heather Taylor", "At-Large", "6/30/2026"),
      m("Emma Henry",     "At-Large", "6/30/2027", "Also: Executive Director of Capital Area Housing Partnership (CAHP); chairs the Land Bank board. Three-way circular arrangement. See case study."),
      m("Ashlee Barker",  "At-Large", "6/30/2029", "Also: Vice President at Cinnaire, which finances LHC's downtown projects. Moved land-purchase votes without recusal."),
      m("Loria Ann Hall", "At-Large", "6/30/2030"),
      m("Bryan Jones",    "Resident",  "6/30/2028"),
    ],
  },
  {
    slug: "lansing-public-media-authority-board",
    name: "Lansing Public Media Authority Board",
    sortOrder: 32,
    members: [
      m("Greg Venker",         "City Attorney",                    "ex officio"),
      m("Jason Gabriel",       "Director of Office of Community Media", "ex officio"),
      m("Crystal Thomas",      "Finance Director",                 "ex officio"),
      m("vacant",              "Mayor's Representative",           "—"),
      m("Lillian Werbin",      "Member",                           "6/30/2026"),
      m("Jena McShane",        "Member",                           "6/30/2027"),
      m("Michael 'Melik' Brown","Member",                          "6/30/2028"),
    ],
  },
  {
    slug: "local-development-finance-authority-board",
    name: "Local Development Finance Authority Board",
    sortOrder: 33,
    members: [
      m("Traci Riehl",       "City of Lansing",                    "6/30/2027"),
      m("Shaharyar Manawar", "City of Lansing",                    "6/30/2028"),
      m("David Washburn",    "City of Lansing / MSU Foundation representative", "6/30/2029"),
    ],
  },
  {
    slug: "mechanical-board",
    name: "Mechanical Board",
    notes: "ACCOUNTABILITY FLAG: All 5 active members serving on terms expired 2013–2018 — up to 13 years past expiration. No reappointment documented.",
    sortOrder: 34,
    members: [
      m("Ryan Irish",         "Citizen",               "6/30/2018"),
      m("Paul Gilmore",       "Commercial Heat & AC",  "6/30/2017"),
      m("Patrick Ryan",       "Contractor",            "6/30/2013"),
      m("Richard Cortright",  "Residential Contractor","6/30/2018"),
      m("Marcus J Metoyer",   "Residential Heat & AC", "6/30/2017"),
    ],
  },
  {
    slug: "michigan-avenue-corridor-improvement-authority",
    name: "Michigan Avenue Corridor Improvement Authority Board",
    notes: "ACCOUNTABILITY FLAG: Tim Daman (Lansing Regional Chamber CEO, PAC treasurer) holds an ownership/business interest seat. See /governance/issues/lansing-chamber-pac.",
    sortOrder: 35,
    members: [
      m("vacant (Laurie Baumer)", "—",                        "6/30/2026", undefined, true),
      m("Jonathan Lum",           "—",                        "6/30/2028"),
      m("Andrea McSwain",         "Mayor or Assignee",        "1/1/2026"),
      m("Tim Daman",              "Ownership/business interest","6/30/2026", "Also: Chamber CEO, PAC treasurer, 5 officer roles across 4 entities. See /governance/issues/lansing-chamber-pac"),
      m("Katherine Hubbard",      "Ownership/business interest","6/30/2027"),
      m("Elaine Barr",            "Ownership/business interest","6/30/2027"),
      m("Jeffrey Hank",           "Ownership/business interest","6/30/2029"),
      m("Leon Clark",             "Resident within 1/2 mile", "6/30/2029"),
    ],
  },
  {
    slug: "next-michigan-development-corporation-board",
    name: "Next Michigan Development Corporation Board",
    sortOrder: 36,
    members: [
      m("Kris Nicholoff", "At-Large", "4/15/2025"),
      m("Kris Klein",     "At-Large", "4/15/2026"),
    ],
  },
  {
    slug: "park-board",
    name: "Park Board",
    sortOrder: 37,
    members: [
      m("Mike Dombrowski",            "1st Ward", "6/30/2029"),
      m("Christopher Green-Szmadzinski","2nd Ward","6/30/2026"),
      m("Isaac Francisco",            "3rd Ward", "6/30/2027"),
      m("Kimberly Whitfield",         "4th Ward", "6/30/2028"),
      m("Joan Lenhard",               "At-Large", "6/30/2026"),
      m("Rayvnne Gilmore",            "At-Large", "6/30/2027"),
      m("Tirstan Walters",            "At-Large", "6/30/2028"),
      m("Nate Scramlin",              "At-Large", "6/30/2029"),
    ],
  },
  {
    slug: "planning-commission",
    name: "Planning Commission",
    notes: "Case study: /governance/issues/development-planning — Josh Hovey was a Planning Commissioner before becoming a paid lobbyist before the same commission. Rawley VanFossen (Planning Director) controls the agenda pipeline.",
    sortOrder: 38,
    members: [
      m("John P. Ruge",                       "1st Ward", "6/30/2029"),
      m("Shane Muchmore",                     "2nd Ward", "6/30/2026"),
      m("Anthony Cox / Robert Noordhoek",     "3rd Ward", "6/30/2019", "PROPOSED replacement — original term expired 2019"),
      m("Spencer Lippert",                    "4th Ward", "6/30/2028"),
      m("Katie Alexander",                    "At-Large", "6/30/2026"),
      m("Monte Jackson",                      "At-Large", "6/30/2027"),
      m("Timothy Klont",                      "At-Large", "6/30/2028"),
      m("Ted O'Dell",                         "At-Large", "6/30/2029"),
    ],
  },
  {
    slug: "police-fire-retirement-system-board",
    name: "Police and Fire Retirement System Board of Trustees",
    sortOrder: 39,
    members: [
      m("Terri Taylor",       "Citizen",       "6/30/2030"),
      m("Jeremy Garza",       "City Council",  "12/31/2025", "Also: on Employees' Retirement System board; subject of Board of Ethics conflict complaint. See /governance/issues/board-of-ethics"),
      m("Chris R. Wright",    "City Treasurer","ex officio"),
      m("Christopher M. Wilcox","Fire",        "12/31/2027"),
      m("Eric Wohlfert",      "Fire",          "12/31/2028"),
      m("Andy Schor",         "Mayor",         "1/1/2030"),
      m("James Zolnai",       "Police",        "12/31/2027"),
      m("Justin Moore",       "Police",        "12/31/2030"),
    ],
  },
  {
    slug: "potter-park-zoo-board",
    name: "Potter Park Zoo Board",
    sortOrder: 40,
    members: [
      m("Samantha Harkins", "City of Lansing", "12/31/2026"),
      m("Emily Linden",     "City of Lansing", "12/31/2027"),
    ],
  },
  {
    slug: "saginaw-street-corridor-improvement-authority",
    name: "Saginaw Street Corridor Improvement Authority Board",
    sortOrder: 41,
    members: [
      m("vacant (Benjamin Brewer)",           "—",                "6/30/2028", undefined, true),
      m("James A. Houthoofd, Jr.",            "inactive",         "6/30/2025"),
      m("Andy Schor or assignee",             "Mayor or Assignee","1/1/2026"),
      m("Diane Sanborn",                      "Ownership/business & resident within 1/2 mile","6/30/2026"),
      m("Tiffany Dowling",                    "Ownership/business interest","6/30/2028"),
      m("Laura Stoken",                       "Ownership/business interest","6/30/2029"),
      m("vacant (John Shaski) / Paul Schmidt","Resident within 1/2 mile","6/30/2026", undefined, true),
      m("Peter Morman",                       "Resident within 1/2 mile","6/30/2027"),
    ],
  },
  {
    slug: "south-mlk-corridor-improvement-authority",
    name: "South Martin Luther King Jr. Blvd Corridor Improvement Authority Board",
    sortOrder: 42,
    members: [
      m("Teresa Stokes",          "inactive – ownership/business interest","7/31/2026"),
      m("Andy Schor or assignee", "Mayor or Assignee",                     "1/1/2026"),
      m("Kristina Schmidgall",    "Ownership/business interest",            "7/31/2027"),
      m("Jeremy Matthews",        "Ownership/business interest",            "7/31/2027"),
      m("Dustin Howard",          "Ownership/business interest",            "7/31/2028"),
      m("Amanda Defrees",         "Ownership/business interest",            "7/31/2029"),
      m("Don Sober",              "Resident within 1/2 mile",               "7/31/2028"),
      m("Melissa White",          "Resident within 1/2 mile",               "7/31/2029"),
    ],
  },
  {
    slug: "tri-county-regional-planning-commission",
    name: "Tri-County Regional Planning Commission",
    sortOrder: 43,
    members: [
      m("Trini Pehlivanoglu", "Lansing Representative", "1/1/2026"),
      m("Adam Hussain",       "Lansing Representative", "1/1/2026"),
      m("Chris Swope",        "Lansing Representative", "1/1/2026"),
      m("Peter Spadafore",    "Lansing Representative", "1/1/2026"),
    ],
  },
  {
    slug: "mayors-neighborhood-advisory-board",
    name: "Mayor's Neighborhood Advisory Board (NAB)",
    notes: "Provides support and guidance to neighborhoods regarding grant eligibility. Members per ward, appointed by Mayor. Contact DNCE for current roster: (517) 483-4141.",
    sortOrder: 44,
    members: [],
  },
];

async function main() {
  let boardsCreated = 0;
  let membersCreated = 0;

  for (const board of BOARDS) {
    const exists = await prisma.board.findUnique({ where: { slug: board.slug } });
    if (exists) { console.log(`  skip: ${board.name}`); continue; }

    const created = await prisma.board.create({
      data: {
        slug: board.slug,
        name: board.name,
        notes: board.notes,
        sortOrder: board.sortOrder,
        members: {
          create: board.members.map((mem, i) => ({
            name: mem.name,
            role: mem.role,
            termExpires: mem.termExpires,
            status: memberStatus(mem.name, mem.termExpires, mem.proposed ? "proposed" : undefined),
            notes: mem.notes,
            sortOrder: i + 1,
          })),
        },
      },
    });

    boardsCreated++;
    membersCreated += board.members.length;
    console.log(`✓ ${created.name} (${board.members.length} members)`);
  }

  console.log(`\nSeeded ${boardsCreated} boards, ${membersCreated} members.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
