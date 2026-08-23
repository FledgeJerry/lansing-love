// Seed script — geocode places.md addresses (Full Accounting case sites + NOVA site-selection candidates)
// Coordinates from OpenStreetMap Nominatim (public geocoder, public Lansing addresses only).
// Run: npx tsx scripts/seed-geocode-places.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Geocoding places…");

  // ── CORRECT EXISTING PROPERTIES WITH PRECISE ADDRESSES/COORDINATES ─────
  const shuffleUpdate = await prisma.entity.updateMany({
    where: { name: "Former City Market / Lansing Shuffle" },
    data: { address: "325 Riverfront Dr", zip: "48912", lat: 42.7358771, lng: -84.5480083, geoSource: "geocoded" },
  });
  console.log(`  ${shuffleUpdate.count} updated: Former City Market / Lansing Shuffle (325 Riverfront Dr)`);

  const novaSiteUpdate = await prisma.entity.updateMany({
    where: { name: "NOVA / ModPod site — 5303 S. Cedar St" },
    data: { lat: 42.6803132, lng: -84.5479401, geoSource: "geocoded" },
  });
  console.log(`  ${novaSiteUpdate.count} updated: NOVA / ModPod site (precise geocode)`);

  const mclarenUpdate = await prisma.entity.updateMany({
    where: { name: "Ingham Medical / McLaren — closed" },
    data: { address: "401 W Greenlawn Ave", zip: "48910", lat: 42.7049060, lng: -84.5544820, geoSource: "geocoded" },
  });
  console.log(`  ${mclarenUpdate.count} updated: Ingham Medical / McLaren — closed (401 W Greenlawn Ave)`);

  // ── NEW PROPERTIES — NOVA site-selection candidates + meeting venues ───
  const prRows = await prisma.entity.createManyAndReturn({ data: [
    { entityType: "property", name: "Foster Community Center", description: "Site of the Aug. 18, 2026 NOVA community update meeting and earlier Nov.–Dec. 2025 NOVA site-selection meetings.", address: "200 N Foster Ave", city: "Lansing", state: "MI", zip: "48912", lat: 42.7349197, lng: -84.5172494, geoSource: "geocoded", activeStart: new Date("2025-11-01"), sourceTier: "RC", sourceNote: "City of Lansing NOVA meeting notices", domains: ["housing"] },
    { entityType: "property", name: "Letts Community Center", description: "Site of earlier NOVA joint site-selection meetings, Nov.–Dec. 2025.", address: "1220 W Kalamazoo St", city: "Lansing", state: "MI", zip: "48915", lat: 42.7308472, lng: -84.5700358, geoSource: "geocoded", activeStart: new Date("2025-11-01"), activeEnd: new Date("2025-12-31"), sourceTier: "RC", sourceNote: "City of Lansing NOVA meeting notices", domains: ["housing"] },
    { entityType: "property", name: "Debbie Stabenow Park", description: "One of the NOVA/ModPod sites originally considered but not selected — removed from consideration after neighborhood opposition to siting the program in a park.", address: "2516 S Washington Ave", city: "Lansing", state: "MI", zip: "48910", lat: 42.7069279, lng: -84.5568043, geoSource: "geocoded", sourceTier: "RC", sourceNote: "NOVA site-selection reporting, 2025–2026", domains: ["housing"] },
    { entityType: "property", name: "Foster Park (Eastside)", description: "One of the NOVA/ModPod sites originally considered but not selected (estimated cost $800K) — removed from consideration after neighborhood opposition to siting the program in a park.", address: "401 S Foster Ave", city: "Lansing", state: "MI", zip: "48912", lat: 42.7267911, lng: -84.5176679, geoSource: "geocoded", sourceTier: "RC", sourceNote: "NOVA site-selection reporting, 2025–2026", domains: ["housing"] },
  ] });
  const pr2 = Object.fromEntries(prRows.map((r) => [r.name, r.id]));
  console.log(`  ${prRows.length} new properties geocoded`);

  // ── LINK NEW PLACES TO EXISTING CASE 11 EVENTS ──────────────────────────
  const evRows = await prisma.historyEvent.findMany({
    where: { title: { in: ["NOVA site selection — Ingham Co. Human Services lot recommended", "NOVA community update meeting — Foster Community Center"] } },
  });
  const ev3 = Object.fromEntries(evRows.map((r) => [r.title, r.id]));

  const eeLinks = [
    { entityId: pr2["Foster Community Center"], eventId: ev3["NOVA community update meeting — Foster Community Center"], role: "location" },
    { entityId: pr2["Letts Community Center"], eventId: ev3["NOVA site selection — Ingham Co. Human Services lot recommended"], role: "prior_meeting_location" },
    { entityId: pr2["Debbie Stabenow Park"], eventId: ev3["NOVA site selection — Ingham Co. Human Services lot recommended"], role: "site_considered_not_selected" },
    { entityId: pr2["Foster Park (Eastside)"], eventId: ev3["NOVA site selection — Ingham Co. Human Services lot recommended"], role: "site_considered_not_selected" },
  ].filter((l) => l.entityId != null && l.eventId != null);

  await prisma.entityEvent.createMany({ data: eeLinks as { entityId: number; eventId: number; role: string }[], skipDuplicates: true });
  console.log(`  ${eeLinks.length} entity-event links`);

  const [entityCount, geocodedCount] = await Promise.all([
    prisma.entity.count(),
    prisma.entity.count({ where: { geoSource: "geocoded" } }),
  ]);
  console.log(`\nGeocode pass complete: ${entityCount} total entities · ${geocodedCount} with precise ("geocoded") coordinates`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
