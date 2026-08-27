// Adds the Deep Roots family origin material and the missing 1900-1940 civic
// events from docs/source-timeline.md, per Jerry's default-include instruction
// (2026-08-27). Content adapted from the sandbox doc's own text.
// Run: npx tsx scripts/add-deep-roots-early-civic-events.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function upsertEntity(data: Parameters<typeof prisma.entity.create>[0]["data"]) {
  const existing = await prisma.entity.findFirst({ where: { name: data.name } });
  if (existing) return existing;
  const created = await prisma.entity.create({ data });
  console.log(`Created entity: ${created.name}`);
  return created;
}

async function addEvent(data: Parameters<typeof prisma.historyEvent.create>[0]["data"], entityRoles: { name: string; role: string }[] = []) {
  const existing = await prisma.historyEvent.findFirst({ where: { title: data.title as string } });
  if (existing) { console.log(`Skip (exists): ${data.title}`); return existing; }
  const event = await prisma.historyEvent.create({ data });
  console.log(`Created: ${event.title}`);
  for (const er of entityRoles) {
    const entity = await prisma.entity.findFirst({ where: { name: er.name } });
    if (entity) await prisma.entityEvent.createMany({ data: [{ entityId: entity.id, eventId: event.id, role: er.role }], skipDuplicates: true });
  }
  return event;
}

async function main() {
  // ── Entities ──────────────────────────────────────────────────────────
  await upsertEntity({ entityType: "person", name: "William Dewees Jr.", description: "Son of the Philadelphia County sheriff; co-owner of the iron forge on Valley Creek, Pennsylvania. Quaker who became a colonel in the Pennsylvania militia; devoted forge production to supplying Washington's Continental Army during the Valley Forge winter, 1777.", mapPin: false, domains: ["governance"], sourceTier: "FM" });
  await upsertEntity({ entityType: "organization", name: "Anishinaabeg — Odawa of Garden Island", altNames: [], description: "Odawa community of Garden Island, directly across the water from Beaver Island — present on these Lake Michigan islands roughly 300 years before Irish settlers arrived following the 1856 fall of the Strang kingdom.", mapPin: false, domains: ["housing"], sourceTier: "FM" });
  await upsertEntity({ entityType: "organization", name: "Andrew Kehoe", description: "Bath Township school treasurer; detonated explosives under Bath Consolidated School on May 18, 1927, killing 38 students and adults — the deadliest school massacre in United States history.", mapPin: false, domains: ["education", "justice"], sourceTier: "S" });

  // ── Deep Roots ────────────────────────────────────────────────────────
  await addEvent({
    title: "The DeWeese family arrives in Pennsylvania",
    description: "Old Dutch settlers, Quakers, land in Germantown, Pennsylvania — among the earliest European arrivals in the Delaware Valley, part of a tight-knit Dutch Quaker community in the same region as the Lenape people, who had been on that land for thousands of years. Family memory, passed down on Margot's side: a Dutch DeWeese family who could not have children took in a Native indigenous child and raised the child as their own — unconfirmed as documented fact, but part of the family's own account of itself.",
    eventType: "family", eventDate: new Date("1690-01-01"), datePrecision: "decade", era: "colonial", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing"], familyStory: true, isPublic: true,
  });

  await addEvent({
    title: "William Dewees Jr. born, Pennsylvania",
    description: "Son of the Philadelphia County sheriff. Will become co-owner of a forge on a creek called Valley Forge, and one of the figures who supplied Washington's Continental Army during the Valley Forge winter.",
    eventType: "family", eventDate: new Date("1739-01-01"), datePrecision: "decade", era: "colonial", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing"], familyStory: true, isPublic: true,
  }, [{ name: "William Dewees Jr.", role: "born" }]);

  await addEvent({
    title: "The Arnold family settles Beaver Island, Lake Michigan",
    description: "The Arnold family — Thelma's people — are part of the Irish Catholic fishing community that settles Beaver Island after the fall of the Mormon kingdom of James Jesse Strang in 1856. They come primarily from Arranmore Island in County Donegal, Ireland, an Irish-speaking island, and bring Gaelic to a Lake Michigan island 32 miles from the mainland — Irish remains the dominant spoken language on Beaver Island until 1903. George T. Arnold is documented in the Clarke Historical Library's biographical papers on Beaver Island as a significant figure in building the island community, likely Thelma's grandfather or great-grandfather. Family memory on Thelma's side: at some point a grandmother whose husband was working on the other side of the island had a relationship with an Odawa man from Garden Island — directly across the water — who helped her family; the Odawa had been on these islands roughly 300 years before the Irish arrived. Unconfirmed as documented fact, carried forward as family memory on both the DeWeese and Arnold sides of Jerry's family.",
    eventType: "family", eventDate: new Date("1856-01-01"), eventDateEnd: new Date("1869-12-31"), datePrecision: "approximate", era: "founding", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "FM", domains: ["housing"], familyStory: true, isPublic: true,
  }, [{ name: "Anishinaabeg — Odawa of Garden Island", role: "connected family, per oral history" }]);

  // ── Early 20th century civic ─────────────────────────────────────────
  await addEvent({
    title: "REO Motor Car Company established",
    description: "Ransom Olds founds a second company at 1445 S. Washington Avenue after leaving his first (Olds Motor Vehicle Company). REO manufactures automobiles and trucks until 1975. By 1907, REO has gross sales of $4.5 million and is one of the four wealthiest auto manufacturers in the U.S. The REO Speed Wagon, introduced 1915, becomes one of the most versatile vehicles in American transportation.",
    eventType: "civic", eventDate: new Date("1905-01-01"), datePrecision: "year", era: "industrial_rise", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["labor"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "First Ottawa Street power station built",
    description: "Michigan Power Company builds the first Ottawa Street power station on the Grand River. The city acquires it in 1919 after WWI financial strain. Replaced by the Art Deco Ottawa Street Power Station in 1939–1940.",
    eventType: "civic", eventDate: new Date("1908-01-01"), datePrecision: "year", era: "industrial_rise", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["energy"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Lansing's first boundary expansion",
    description: "Nearly 60 years after incorporation, Lansing's city limits expand beyond the original seven square miles. The city grows; no new governing nodes are created inside the expanded boundary.",
    eventType: "civic", eventDate: new Date("1916-01-01"), datePrecision: "year", era: "industrial_rise", significance: 2,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Bath School massacre, 10 miles north of Lansing",
    description: "Bath Township school treasurer Andrew Kehoe detonates explosives planted under Bath Consolidated School, killing 38 students and adults — the deadliest school massacre in United States history, a record that still stands nearly 100 years later. The injured are brought to Lansing hospitals. A Lansing architect donates the plans for the replacement school. Michigan's history of school violence begins here, 51 years before Kevin Jones's neighborhood.",
    eventType: "civic", eventDate: new Date("1927-05-18"), datePrecision: "day", era: "industrial_rise", significance: 5,
    timelineVisible: true, mapVisible: true, city: "Bath", state: "MI",
    lat: 42.8132359, lng: -84.4235732,
    sourceTier: "S", domains: ["education", "justice"], familyStory: false, isPublic: true,
  }, [{ name: "Andrew Kehoe", role: "perpetrator" }]);

  await addEvent({
    title: "The Depression hits the factory floor",
    description: "The Great Depression collapses car sales. GM slashes jobs with no regard for seniority. The average auto worker earns $900 a year against a government-determined minimum of $1,600 for a family of four. GM spends $839,000 on detective work in 1934 alone to identify and intimidate union organizers. The conditions for the 1937 sit-down strike and Labor Holiday are being built.",
    eventType: "civic", eventDate: new Date("1929-01-01"), eventDateEnd: new Date("1935-12-31"), datePrecision: "approximate", era: "labor", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["labor"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Boji Tower (Olds Tower) built",
    description: "The skyscraper at the corner of Michigan and Washington — formerly the Olds Tower — rises as the tallest building in the city. Art Deco symbol of industrial prosperity, built at the peak of the factory era's confidence.",
    eventType: "civic", eventDate: new Date("1931-01-01"), datePrecision: "year", era: "labor", significance: 2,
    timelineVisible: true, mapVisible: false,
    sourceTier: "S", domains: ["governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Kerns Hotel fire",
    description: "Fire kills 34 people in the Kerns Hotel, including seven Michigan state legislators — the worst fire disaster in Lansing history. It produces genuine public safety reform: new building codes, new fire safety regulations. The city can learn from disaster when the will exists — the Everett shooting, 44 years later, will prove that will is not always present.",
    eventType: "civic", eventDate: new Date("1934-12-11"), datePrecision: "day", era: "labor", significance: 4,
    timelineVisible: true, mapVisible: false, sourceTier: "S", domains: ["governance", "justice"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Ottawa Street Power Station (Art Deco building) completed",
    description: "The Art Deco Ottawa Street Power Station opens, designed by Edwyn Bowd — polychromatic brick, 176 feet over the Grand River, a step-back ziggurat form with a color gradient from black granite at the base to yellow at the top, representing the stages of coal combustion. One of the most beautiful industrial buildings in Michigan; publicly owned, with no resident seat on its governance board. It will be publicly owned for 52 years and then sold (see 1992 decommissioning and 2007 AF Group purchase).",
    eventType: "civic", eventDate: new Date("1939-01-01"), eventDateEnd: new Date("1940-12-31"), datePrecision: "approximate", era: "labor", significance: 3,
    timelineVisible: true, mapVisible: false,
    sourceTier: "S", domains: ["energy"], familyStory: false, isPublic: true,
  });

  console.log("\nDone.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
