// Two things, per Jerry's resolutions (2026-08-27, round 2):
// 1. Fixes the Riddle expulsion year: 1977 -> 1978, confirmed as Jerry's own
//    lived history, already corrected in the sandbox memoir/timeline.
// 2. Adds the two Nov. 3, 2026 statewide ballot measures as "scheduled, not
//    yet occurred" events (no schema flag for this, so it's noted in text
//    per Jerry's explicit fallback instruction), and all 46 Lansing mayors
//    (1859-present) from the sandbox doc's list. Pre-1993 mayors carry the
//    doc's own single-source caveat forward in sourceNote, unchanged from
//    Hollister/Benavides/Bernero/Schor, who are independently verified.
// Run: npx tsx scripts/add-mayors-and-ballot-measures.ts

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

const UNCROSSCHECKED_NOTE = "Single-sourced to Wikipedia's \"List of mayors of Lansing, Michigan\" (itself sourced to the Historical Society of Greater Lansing) — not independently cross-checked against a second source. Included per this project's default-include philosophy; correct or expand if better sourcing surfaces.";

function eraForYear(year: number): string {
  if (year < 1885) return "founding";
  if (year < 1928) return "industrial_rise";
  if (year < 1946) return "labor";
  if (year < 1963) return "postwar";
  if (year < 1971) return "highway";
  if (year < 1984) return "deindustrial";
  if (year < 2014) return "repackaging";
  return "current";
}

type Mayor = { name: string; termLabel: string; startYear: number; verified?: boolean };

const MAYORS: Mayor[] = [
  { name: "Hiram H. Smith", termLabel: "1859", startYear: 1859 },
  { name: "John A. Kerr", termLabel: "1860", startYear: 1860 },
  { name: "William H. Chapman", termLabel: "1861-62", startYear: 1861 },
  { name: "Dr. Ira H. Bartholomew", termLabel: "1863-65", startYear: 1863 },
  { name: "Dr. William H. Haze", termLabel: "1866", startYear: 1866 },
  { name: "George W. Peck", termLabel: "1867", startYear: 1867 },
  { name: "Cyrus Hewitt", termLabel: "1868-69", startYear: 1868 },
  { name: "Dr. Solomon W. Wright", termLabel: "1870", startYear: 1870 },
  { name: "John Robson", termLabel: "1871, 1881 (non-consecutive terms)", startYear: 1871 },
  { name: "John S. Tooker", termLabel: "1872-73, 1876 (non-consecutive terms)", startYear: 1872 },
  { name: "Daniel W. Buck", termLabel: "1874-75, 1886 (non-consecutive terms)", startYear: 1874 },
  { name: "Orlando Mack Barnes", termLabel: "1877, 1882-83 (non-consecutive terms)", startYear: 1877 },
  { name: "Joseph E. Warner", termLabel: "1878", startYear: 1878 },
  { name: "William Van Buren", termLabel: "1879-80", startYear: 1879 },
  { name: "William Donovan", termLabel: "1884-85", startYear: 1884 },
  { name: "Jacob F. Schultz", termLabel: "1887", startYear: 1887 },
  { name: "John Crotty", termLabel: "1888", startYear: 1888 },
  { name: "James M. Turner", termLabel: "1889, 1895 (non-consecutive terms)", startYear: 1889 },
  { name: "Frank B. Johnson", termLabel: "1890-91", startYear: 1890 },
  { name: "Arthur O. Bement", termLabel: "1892-93", startYear: 1892 },
  { name: "Alroy A. Wilbur", termLabel: "1894", startYear: 1894 },
  { name: "Russell C. Ostrander", termLabel: "1896", startYear: 1896 },
  { name: "Charles J. Davis", termLabel: "1897-99", startYear: 1897 },
  { name: "James F. Hammell", termLabel: "1900-03", startYear: 1900 },
  { name: "Hugh Lyons", termLabel: "1904-07", startYear: 1904 },
  { name: "John S. Bennett", termLabel: "1908-11", startYear: 1908 },
  { name: "J. Gottlieb Reutter", termLabel: "1912-17", startYear: 1912 },
  { name: "Jacob W. Ferle", termLabel: "1918-19, 1922 (non-consecutive terms)", startYear: 1918 },
  { name: "Benjamin A. Kyes", termLabel: "1920-21", startYear: 1920 },
  { name: "Silas F. Main", termLabel: "1922-23", startYear: 1922 },
  { name: "Alfred H. Doughty", termLabel: "1923-26", startYear: 1923 },
  { name: "Laird J. Troyer", termLabel: "1927-30", startYear: 1927 },
  { name: "Peter F. Gray", termLabel: "1931-32", startYear: 1931 },
  { name: "Max A. Templeton", termLabel: "1933-41", startYear: 1933 },
  { name: "Arthur E. Stoppel", termLabel: "1941", startYear: 1941 },
  { name: "Sam Street Hughes", termLabel: "1941-43", startYear: 1941 },
  { name: "Ralph Crego", termLabel: "Aug. 1943 - April 1961", startYear: 1943 },
  { name: "Willard I. Bowerman Jr.", termLabel: "1961-65", startYear: 1961 },
  { name: "Max E. Murninghan", termLabel: "1965-69", startYear: 1965 },
  { name: "Gerald W. Graves", termLabel: "1969-81", startYear: 1969 },
  { name: "Terry John McKane", termLabel: "1981-92", startYear: 1981 },
  { name: "Jim Crawford", termLabel: "1992-93", startYear: 1992 },
  { name: "David Hollister", termLabel: "1993 - Jan. 28, 2003 (resigned to join Granholm administration)", startYear: 1993, verified: true },
  { name: "Tony Benavides", termLabel: "Jan. 28, 2003 - Jan. 1, 2006 (won the 2003 special election by 258 votes out of 23,000+ cast)", startYear: 2003, verified: true },
  { name: "Virg Bernero", termLabel: "Jan. 1, 2006 - Jan. 1, 2018 (three terms, declined a fourth)", startYear: 2006, verified: true },
  { name: "Andy Schor", termLabel: "Jan. 1, 2018 - present (re-elected 2021 and 2025, sworn in for a third term Jan. 1, 2026 under the newly effective charter)", startYear: 2018, verified: true },
];

async function main() {
  // ── Fix: Riddle expulsion year ────────────────────────────────────────
  const riddle = await prisma.historyEvent.findFirst({ where: { title: { contains: "Jerry expelled from Riddle" } } });
  if (riddle) {
    if (riddle.eventDate?.getUTCFullYear() === 1978) {
      console.log("Riddle expulsion already 1978, skipping.");
    } else {
      await prisma.historyEvent.update({ where: { id: riddle.id }, data: { eventDate: new Date("1978-01-01") } });
      console.log("Fixed: Jerry expelled from Riddle -> 1978");
    }
  } else {
    console.log("WARNING: could not find the Riddle expulsion event to fix.");
  }

  // ── November 2026 ballot measures ────────────────────────────────────
  await addEvent({
    title: "Michiganders for Money Out of Politics (MMOP) qualifies for the Nov. 2026 ballot",
    description: "Qualified for the November 3, 2026 statewide ballot — SCHEDULED, outcome not yet known as of this writing. Would ban regulated utilities (DTE Energy and Consumers Energy explicitly named in state coverage) and any corporation holding government contracts over $250,000/year from contributing to state officeholders and political party committees, and would impose new disclosure requirements on dark-money political ads. Directly targets the mechanism documented in this project's Case 9 (Chamber/PAC Electoral Loop) and the Consumers Energy dark-money network tied to Reid Felsing.",
    eventType: "political", eventDate: new Date("2026-11-03"), datePrecision: "day", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "RC", domains: ["governance"], familyStory: false, isPublic: true,
  });

  await addEvent({
    title: "Michigan Constitutional Convention question appears on the Nov. 2026 ballot",
    description: "Appears automatically on the November 3, 2026 ballot per Article XII, Section 3 of the Michigan Constitution, which requires the question be put to voters every 16 years regardless of any other action — SCHEDULED, outcome not yet known as of this writing. If approved: 148 delegates elected on partisan ballots, convention convenes October 5, 2027. Directly relevant to this project's strategic horizon — the same mechanism that could advance cooperative and local-democracy goals statewide could also be captured by opposing interests, the same tension documented throughout this project's own polycentric governance framework.",
    eventType: "political", eventDate: new Date("2026-11-03"), datePrecision: "day", era: "current", significance: 3,
    timelineVisible: true, mapVisible: false, sourceTier: "RC", domains: ["governance"], familyStory: false, isPublic: true,
  });

  // ── 46 Lansing mayors, 1859-present ──────────────────────────────────
  for (const m of MAYORS) {
    await upsertEntity({
      entityType: "person",
      name: m.name,
      description: `Lansing Mayor, ${m.termLabel}.`,
      mapPin: false,
      domains: ["governance"],
      sourceTier: m.verified ? "S" : "RC",
      sourceNote: m.verified ? undefined : UNCROSSCHECKED_NOTE,
    });
    await addEvent({
      title: `${m.name} becomes Lansing mayor`,
      description: `Term: ${m.termLabel}.${m.verified ? "" : " " + UNCROSSCHECKED_NOTE}`,
      eventType: "political",
      eventDate: new Date(`${m.startYear}-01-01`),
      datePrecision: m.verified ? "day" : "year",
      era: eraForYear(m.startYear),
      // Deliberately not lowered for the single-sourced pre-1993 mayors —
      // significance is the page's default visibility filter (min 3 on
      // /history's Timeline tab), not a sourcing-confidence field. The
      // caveat itself lives in sourceNote below, where it belongs.
      significance: 3,
      timelineVisible: true, mapVisible: false,
      sourceTier: m.verified ? "S" : "RC",
      sourceNote: m.verified ? "Wikipedia \"List of mayors of Lansing, Michigan\"; cross-referenced against this project's other sourced material on Hollister/Benavides/Bernero/Schor specifically." : UNCROSSCHECKED_NOTE,
      domains: ["governance"], familyStory: false, isPublic: true,
    }, [{ name: m.name, role: "mayor" }]);
  }

  console.log("\nDone.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
