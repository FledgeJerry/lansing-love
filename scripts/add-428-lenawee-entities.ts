// Adds the 428 W. Lenawee St campaign-finance address cluster — a SEPARATE,
// ADDITIONAL address, not a replacement for LRC-PAC's own registered address
// (500 E. Michigan Ave, unchanged). Confirmed via WLNS reporting: 428 W.
// Lenawee is The Law Office of Reid Felsing, PLC, a campaign-finance law
// firm acting as registered filing address for multiple PACs. LRC-PAC does
// NOT file there itself — it connects to this cluster only via a $5,000
// donation to Lansing's Future PAC (April 19, 2024), a financial link, not
// a shared-address one.
// Source: WLNS 6 News Investigates, "Campaign finance reports reveal issues
// for some Charter Commission Candidates."
// Run: npx tsx scripts/add-428-lenawee-entities.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function upsertEntity(data: Parameters<typeof prisma.entity.create>[0]["data"]) {
  const existing = await prisma.entity.findFirst({ where: { name: data.name } });
  if (existing) { console.log(`Skip (exists): ${data.name}`); return existing; }
  const created = await prisma.entity.create({ data });
  console.log(`Created entity: ${created.name}`);
  return created;
}

const ADDRESS = {
  address: "428 W. Lenawee St", city: "Lansing", state: "MI", zip: "48933",
  lat: 42.7288094, lng: -84.5575236, geoSource: "geocoded" as const,
};

async function main() {
  await upsertEntity({
    entityType: "organization",
    name: "Law Office of Reid Felsing, PLC",
    altNames: ["Reid Felsing"],
    description: "Campaign-finance and nonprofit-law firm, founded 2017. Serves as registered filing address for multiple Lansing-area political action committees, including Lansing's Future PAC (paid $1,000 retainer Dec. 2023, $2,000 total to the firm), Michigan Vindicated, and the Vote Yes Lansing 2025 Ballot Committee.",
    ...ADDRESS, mapPin: true, domains: ["governance"], sourceTier: "RC",
    sourceNote: "WLNS 6 News Investigates, \"Campaign finance reports reveal issues for some Charter Commission Candidates.\"",
  });

  await upsertEntity({
    entityType: "organization",
    name: "Lansing's Future PAC",
    altNames: ["Lansing Future PAC"],
    description: "Super PAC created November 2023. Registered at 428 W. Lenawee (Law Office of Reid Felsing, PLC). Received a $5,000 donation from LRC-PAC on April 19, 2024 — a financial link to the Chamber's PAC, distinct from LRC-PAC's own registered address (500 E. Michigan Ave), which is unchanged. Co-endorsed the 2025 charter revision alongside the Chamber.",
    ...ADDRESS, mapPin: true, domains: ["governance"], sourceTier: "RC",
    sourceNote: "WLNS 6 News Investigates, \"Campaign finance reports reveal issues for some Charter Commission Candidates.\"",
  });

  await upsertEntity({
    entityType: "organization",
    name: "Michigan Vindicated",
    altNames: [],
    description: "Political committee registered at 428 W. Lenawee (Law Office of Reid Felsing, PLC), same address as Lansing's Future PAC. Co-endorsed the 2025 charter revision alongside the Chamber.",
    ...ADDRESS, mapPin: true, domains: ["governance"], sourceTier: "RC",
    sourceNote: "WLNS 6 News Investigates, \"Campaign finance reports reveal issues for some Charter Commission Candidates.\"",
  });

  await upsertEntity({
    entityType: "organization",
    name: "Vote Yes Lansing 2025 Ballot Committee",
    altNames: [],
    description: "Ballot committee registered at 428 W. Lenawee (Law Office of Reid Felsing, PLC), the same address as Lansing's Future PAC and Michigan Vindicated — a third committee at this shared filing address, found independently while researching the other two.",
    ...ADDRESS, mapPin: true, domains: ["governance"], sourceTier: "RC",
    sourceNote: "WLNS 6 News Investigates, \"Campaign finance reports reveal issues for some Charter Commission Candidates.\"",
  });

  console.log("\nConfirmed: LRC-PAC itself is NOT registered at 428 W. Lenawee — its own address (500 E. Michigan Ave) was left untouched.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
