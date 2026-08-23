// Update existing entities with real addresses/coordinates from the latest places.md /
// entities.md pass. Only updates entities that already exist — does not create new ones
// (Case 12 / Deep Green entities, Alan Fox, Roxanne Case, etc. are new content, not an
// update, and are out of scope for this pass).
//
// Per entities.md's standing rule: person entities get their INSTITUTIONAL office address
// only (never a home address), and mapPin is set false for them so the map isn't cluttered
// with duplicate pins stacked on the same building the org/property entity already marks.
//
// Run: npx tsx scripts/update-entity-addresses.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const CITY_HALL = { address: "124 W Michigan Ave", city: "Lansing", state: "MI", zip: "48933", lat: 42.7340573, lng: -84.5534370 };
const LHC = { address: "419 Cherry St", city: "Lansing", state: "MI", zip: "48933", lat: 42.7296804, lng: -84.5490455 };
const LAND_BANK = { address: "3024 Turner St", city: "Lansing", state: "MI", zip: "48906", lat: 42.7639188, lng: -84.5556224 };
const CHAMBER = { address: "500 E Michigan Ave, Suite 200", city: "Lansing", state: "MI", zip: "48912", lat: 42.7332969, lng: -84.5456285 };
const DRMM_HQ = { address: "150 Stimson St", city: "Detroit", state: "MI", zip: "48201", lat: 42.3456204, lng: -83.0598184 };
const MOORES_PARK = { lat: 42.7162934, lng: -84.5564885 };

async function updateOrg(name: string, data: Record<string, unknown>) {
  const r = await prisma.entity.updateMany({ where: { name, entityType: "organization" }, data: { ...data, geoSource: "geocoded" } });
  console.log(`  org "${name}": ${r.count} updated`);
}

async function updateProp(name: string, data: Record<string, unknown>) {
  const r = await prisma.entity.updateMany({ where: { name, entityType: "property" }, data: { ...data, geoSource: "geocoded" } });
  console.log(`  property "${name}": ${r.count} updated`);
}

async function updatePersonInstitutionalAddress(name: string, addr: typeof CITY_HALL) {
  const r = await prisma.entity.updateMany({
    where: { name, entityType: "person" },
    data: { address: addr.address, city: addr.city, state: addr.state, zip: addr.zip, lat: addr.lat, lng: addr.lng, geoSource: "geocoded", mapPin: false },
  });
  console.log(`  person "${name}" (institutional address, no individual map pin): ${r.count} updated`);
}

async function main() {
  console.log("Updating organizations…");
  await updateOrg("Lansing Housing Commission", LHC);
  await updateOrg("Ingham County Land Bank", LAND_BANK);
  await updateOrg("Lansing Regional Chamber PAC", CHAMBER);
  await updateOrg("Human Relations & Community Services (HRCS)", CITY_HALL);
  await updateOrg("Detroit Rescue Mission Ministries", DRMM_HQ);

  console.log("\nUpdating properties (precision upgrade)…");
  await updateProp("David Hollister City Hall", { lat: CITY_HALL.lat, lng: CITY_HALL.lng });
  await updateProp("Eckert Station (Moores Park Plant)", { lat: MOORES_PARK.lat, lng: MOORES_PARK.lng });

  console.log("\nUpdating people (institutional office address only, per entities.md standing rule)…");
  await updatePersonInstitutionalAddress("Doug Fleming", LHC);
  await updatePersonInstitutionalAddress("Emma Henry", LHC);
  await updatePersonInstitutionalAddress("Rawley Van Fossen", LAND_BANK);
  await updatePersonInstitutionalAddress("Ryan Kost", CITY_HALL);
  await updatePersonInstitutionalAddress("Kimberly Coleman", CITY_HALL);
  await updatePersonInstitutionalAddress("Delvata Moses", CITY_HALL);
  await updatePersonInstitutionalAddress("Joan Jackson Johnson", CITY_HALL);
  await updatePersonInstitutionalAddress("Chad Audi", DRMM_HQ);

  const [geocodedCount, totalCount] = await Promise.all([
    prisma.entity.count({ where: { geoSource: "geocoded" } }),
    prisma.entity.count(),
  ]);
  console.log(`\nDone: ${geocodedCount}/${totalCount} entities now have verified ("geocoded") coordinates.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
