import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const orgs = [
  // ── 59 registered neighborhood organizations ────────────────────────────────
  { sortOrder:  1, name: "Association for the Bingham Community (ABC)",   area: "East Lansing border", status: "Registered", notes: "Hunter Park area. Eastern High School catchment." },
  { sortOrder:  2, name: "Averill Woods Neighborhood Association",          area: "South Lansing",       status: "Active",     website: "http://www.averillwoods.org", notes: "Near Averill Park and Lewton Park." },
  { sortOrder:  3, name: "Bassett Park Neighborhood Association",           area: "Northwest Lansing",   status: "Registered", notes: "Near Bassett Park / Tecumseh Park." },
  { sortOrder:  4, name: "Cherry Hill Neighborhood Association",            area: "Downtown-adjacent",   status: "Dormant",    facebook: "https://www.facebook.com/CherryHillNeighborhoodLansing", notes: "Dormant as of 2024; page kept in hopes someone restarts it. Now served by Downtown Lansing Inc." },
  { sortOrder:  5, name: "Churchill Downs Community Association",           area: "Southwest Lansing",   status: "Active",     website: "https://churchilldownslansing.info", notes: "Meetings: 3rd Tuesday, 6:30pm @ Alfreda Schmidt Southside Community Center, 5825 Wise Rd. Active monthly meetings." },
  { sortOrder:  6, name: "Clifford Park Neighborhood",                      area: "Southeast Lansing",   status: "Registered", notes: "Near Clifford Park and Lyons Park." },
  { sortOrder:  7, name: "Coachlight Neighborhood Association",             area: "Southwest Lansing",   status: "Registered", notes: "Near Graves Park." },
  { sortOrder:  8, name: "Colonial Village Neighborhood Association",       area: "Southwest Lansing",   status: "Active",     website: "https://www.cvnanews.com", notes: "Bordered by W. Mount Hope, MLK Blvd, W. Holmes Rd, Pleasant Grove Rd." },
  { sortOrder:  9, name: "Creston Area Neighborhood",                       area: "North Lansing",       status: "Registered", notes: "Near Gier Community Center & Park." },
  { sortOrder: 10, name: "Downtown Neighborhood Association",               area: "Downtown",             status: "Registered", notes: "Core downtown area. Mid-Michigan Leadership Academy catchment." },
  { sortOrder: 11, name: "East Battenfield Neighborhood Association & Watch", area: "Southeast Lansing", status: "Registered" },
  { sortOrder: 12, name: "Eastern Neighbors",                               area: "East-central",        status: "Registered", notes: "Near Oak Park / Eastern High School." },
  { sortOrder: 13, name: "Eastfield Neighborhood Association",              area: "East-central",        status: "Registered", notes: "Near Frandor area." },
  { sortOrder: 14, name: "Eastside Neighborhood Organization",              area: "East Side",           status: "Active",     website: "https://eastsidelansingneighborhood.org", notes: "Large eastside area. Encompasses most of the east side of Lansing." },
  { sortOrder: 15, name: "Edmore Park Neighborhood Association",            area: "North Lansing",       status: "Registered", notes: "Near Edmore Park." },
  { sortOrder: 16, name: "Fabulous Acres",                                  area: "Southeast Lansing",   status: "Registered", notes: "Near Barb Dean Tot Lot." },
  { sortOrder: 17, name: "Fairview Area Interested Residents (FAIR)",       area: "East Lansing border", status: "Registered", notes: "Near Fairview Park and Foster Park." },
  { sortOrder: 18, name: "Forest View Neighborhood Association",            area: "Southwest Lansing",   status: "Registered", notes: "Near Fenner Nature Center, Hawk Island Park." },
  { sortOrder: 19, name: "Foster Your Neighborhood",                        area: "East-central",        status: "Registered", notes: "Near 119th Armory / Michigan Ave corridor." },
  { sortOrder: 20, name: "Genesee Neighborhood Association",                area: "North Lansing",       status: "Registered", notes: "Near Ferris Park." },
  { sortOrder: 21, name: "Green Oaks",                                      area: "East-central",        status: "Registered", notes: "Near Oak Park." },
  { sortOrder: 22, name: "Greencroft Park Neighborhood",                    area: "Southeast Lansing",   status: "Registered", notes: "Near Greencroft Park and Washington Park. Craftsman bungalows and Foursquares." },
  { sortOrder: 23, name: "Groesbeck Area Neighborhood Association",         area: "Northeast Lansing",   status: "Registered", notes: "Near Groesbeck Golf Course. Active community via Facebook." },
  { sortOrder: 24, name: "Holmes Street School Community Association",      area: "East Lansing border", status: "Registered", notes: "Near Hunter Park and Trager Park." },
  { sortOrder: 25, name: "Hosmer Street Neighbors",                         area: "East-central",        status: "Registered", notes: "Small area between I-496 corridors." },
  { sortOrder: 26, name: "Hull Court Park Neighborhood Association",        area: "Northwest Lansing",   status: "Registered", notes: "Near Hull Court Park." },
  { sortOrder: 27, name: "Hunter Park East Residential Organization",       area: "East Lansing border", status: "Registered", notes: "Near Stabler Park." },
  { sortOrder: 28, name: "Hunter Park West",                                area: "East-central",        status: "Registered", notes: "Near I-496." },
  { sortOrder: 29, name: "Knollwood Willow Neighborhood Association",       area: "North Lansing",       status: "Registered", notes: "Along Grand River. Near Comstock/Burchard/Durant parks. Turn-of-century homes." },
  { sortOrder: 30, name: "Lansing-Eaton Neighborhood Organization",         area: "Southwest Lansing",   status: "Registered", notes: "Near Woodcreek Park. Along Grand River." },
  { sortOrder: 31, name: "Lewton Rich Neighborhood Association",            area: "South Lansing",       status: "Registered", notes: "Near Frances Park. Near Lewton and Ingham Parks." },
  { sortOrder: 32, name: "Moores Park Neighborhood Organization",           area: "West-central",        status: "Active",     website: "https://mooresparkneighborhood.com", facebook: "https://www.facebook.com/mooresparkneighborhood", notes: "Along Grand River. Active org: community garden and pool restoration campaign. Near REO Town." },
  { sortOrder: 33, name: "Moores River Drive Association",                  area: "South Lansing",       status: "Registered", notes: "Along Grand River. Large historic homes, Country Club of Lansing area." },
  { sortOrder: 34, name: "New Neighbors United in Action",                  area: "East-central",        status: "Registered", notes: "Near Sycamore, Clifford, and Potter Parks." },
  { sortOrder: 35, name: "North Lansing Community Association",             area: "North Lansing",       status: "Registered", notes: "Far north Lansing." },
  { sortOrder: 36, name: "Northtown Neighborhood Association",              area: "North-central",       status: "Inactive",   notes: "No longer active as of 2024. Cristo Rey Community Center now serves the area." },
  { sortOrder: 37, name: "Northwest Neighborhood Alliance",                 area: "Northwest Lansing",   status: "Registered" },
  { sortOrder: 38, name: "Oak Park Neighborhood Association",               area: "East-central",        status: "Registered", notes: "Near Oak Park." },
  { sortOrder: 39, name: "Old Everett Neighborhood Organization",           area: "South Lansing",       status: "Active",     website: "http://www.oldeverett.org", facebook: "https://www.facebook.com/oldeverett", notes: "Active Facebook page. Annexed by Lansing 1948/1949." },
  { sortOrder: 40, name: "Old Forest Neighborhood Association",             area: "Northeast Lansing",   status: "Registered", notes: "Near Comstock Park and Lansing River Trail. Near MSU." },
  { sortOrder: 41, name: "Old Oakland Neighborhood Association",            area: "Northwest Lansing",   status: "Active",     website: "https://oldoaklandlansing.org", notes: "2 miles from downtown. Community garden, Fall Festival, Meet the Candidates events. Borders: west of N. MLK Blvd, east of Stanley, south of Willow, north of Old Oakland." },
  { sortOrder: 42, name: "P.L.A.C.E.",                                      area: "East-central",        status: "Registered" },
  { sortOrder: 43, name: "Potter Walsh Neighborhood Association",           area: "East Lansing border", status: "Registered", notes: "Near Potter Park Zoo. Active 'eastside pride' community." },
  { sortOrder: 44, name: "Quentin Park",                                    area: "East-central",        status: "Registered" },
  { sortOrder: 45, name: "Renaissance Neighborhood Organization",           area: "South/Southwest",     status: "Registered" },
  { sortOrder: 46, name: "River Forest Neighborhood Association",           area: "West Lansing",        status: "Registered", notes: "Near Grand River." },
  { sortOrder: 47, name: "River Point Organization",                        area: "North Lansing",       status: "Registered", notes: "Along Grand River near Riverside Park." },
  { sortOrder: 48, name: "Riverside Neighborhood Association",              area: "North Lansing",       status: "Registered", notes: "Grand River area." },
  { sortOrder: 49, name: "Riverview Estates Neighbors United",              area: "South Lansing",       status: "Registered" },
  { sortOrder: 50, name: "Sagamore Hills Neighborhood Association",         area: "Southwest Lansing",   status: "Registered" },
  { sortOrder: 51, name: "Shady Oak Neighborhood Association",              area: "Southwest Lansing",   status: "Registered" },
  { sortOrder: 52, name: "Shepard Street United Neighborhood",              area: "East-central",        status: "Registered" },
  { sortOrder: 53, name: "Square One",                                      area: "Southeast Lansing",   status: "Registered" },
  { sortOrder: 54, name: "Turner-Dodge Neighborhood Organization",          area: "North Lansing",       status: "Registered", notes: "Near Turner-Dodge House & Heritage Center, Grand River, Lansing River Trail. Victorian and mid-century homes." },
  { sortOrder: 55, name: "Walnut Neighborhood Organization",                area: "North Lansing",       status: "Registered", notes: "Near Grand River." },
  { sortOrder: 56, name: "We Care Neighborhood Organization",               area: "Northwest Lansing",   status: "Registered" },
  { sortOrder: 57, name: "Westside Neighborhood Association",               area: "West of downtown",    status: "Active",     website: "https://www.wnalansing.com", facebook: "https://www.facebook.com/wnalansing", email: "board@wnalansing.com", notes: "~2,000 households. Bounded by Oakland Ave (N), MLK Blvd (E), Grand River (S), city limits (W). Active: potlucks, picnics, candidate forums. Based at Letts Community Center, 1220 W. Kalamazoo St." },
  { sortOrder: 58, name: "Wexford Heights Neighborhood Association",        area: "Southwest Lansing",   status: "Registered", notes: "Mid-century homes." },
  { sortOrder: 59, name: "Wood-Mere Neighborhood Organization",             area: "South Lansing",       status: "Registered" },

  // ── Major neighborhood hub ──────────────────────────────────────────────────
  {
    sortOrder: 60,
    name: "Allen Neighborhood Center",
    area: "East Side",
    status: "Active",
    isHub: true,
    website: "https://www.allenneighborhoodcenter.org",
    email: "info@allenneighborhoodcenter.org",
    phone: "(517) 367-2468",
    address: "1611 E. Kalamazoo St, Lansing MI",
    notes: "Eastside community hub — food access (Allen Farmers Market, Breadbasket Pantry), incubator kitchen, healthcare enrollment, housing, youth programs, community garden. Founded 1999. Place-based nonprofit aligned with community wealth-building model.",
  },
];

async function main() {
  let created = 0;
  let skipped = 0;
  for (const org of orgs) {
    const exists = await prisma.neighborhoodOrg.findFirst({ where: { name: org.name } });
    if (exists) { skipped++; continue; }
    await prisma.neighborhoodOrg.create({ data: { ...org, updatedAt: new Date() } });
    created++;
  }
  console.log(`Seeded ${created} neighborhood orgs (${skipped} already existed).`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
