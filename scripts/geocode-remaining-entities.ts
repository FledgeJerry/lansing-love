// Geocodes the last 7 entities that had an address but no coordinates yet
// (checked directly against production — everything else in the Entity
// table either already has coordinates or has no address to geocode at
// all). Coordinates from OpenStreetMap Nominatim. House-number matches are
// marked "geocoded"; street-only matches (no house number ever recorded)
// are marked "approximate".
// Run: npx tsx scripts/geocode-remaining-entities.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const UPDATES: { name: string; lat: number; lng: number; geoSource: string }[] = [
  { name: "Jerry Norris birthplace — 6311 Sommerset Rd", lat: 42.6667290, lng: -84.5562169, geoSource: "geocoded" },
  { name: "Norris family home — 6347 Sommerset Rd", lat: 42.6663071, lng: -84.5562197, geoSource: "geocoded" },
  { name: "Norris Grocery — 1327 Olds Ave", lat: 42.7232312, lng: -84.5706068, geoSource: "geocoded" },
  { name: "Comfort Street Landfill — coal ash", lat: 42.7520260, lng: -84.5745641, geoSource: "approximate" },
  { name: "Everett High School", lat: 42.6929427, lng: -84.5566439, geoSource: "geocoded" },
  { name: "Haag Road — Section 8 townhouse", lat: 42.6689214, lng: -84.5726647, geoSource: "approximate" },
  { name: "Sadie Court — Joel Ferguson Section 8", lat: 42.7552487, lng: -84.5602030, geoSource: "approximate" },
];

async function main() {
  for (const u of UPDATES) {
    const entity = await prisma.entity.findFirst({ where: { name: u.name } });
    if (!entity) { console.log(`NOT FOUND, skipping: ${u.name}`); continue; }
    if (entity.lat != null) { console.log(`Already has coordinates, skipping: ${u.name}`); continue; }
    await prisma.entity.update({
      where: { id: entity.id },
      data: { lat: u.lat, lng: u.lng, geoSource: u.geoSource },
    });
    console.log(`Geocoded: ${u.name} (${u.geoSource})`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
