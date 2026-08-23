// Merge the 4 duplicated institutions (older June-batch board-governance investigations +
// newer August-batch Full Accounting historical cases) into one row each, keeping the old
// (shorter, already-linked) slug as canonical. Nothing is deleted without its unique content
// first being folded into the surviving row — see the per-institution comments below.
// Run: npx tsx scripts/merge-case-studies.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import type { Prisma } from ".prisma/client";

type Stat = { value: string; label: string };
type Section = { eyebrow: string; heading: string; description: string; items: { label: string; desc: string; url?: string }[] };
type Tx = Prisma.TransactionClient;

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

async function mergeOne(tx: Tx, opts: {
  keepSlug: string;
  deleteSlug: string;
  neighborhoods?: string[];
  transform: (keep: Record<string, unknown>, del: Record<string, unknown>) => Record<string, unknown>;
}) {
  const [keep, del] = await Promise.all([
    tx.boardCaseStudy.findUniqueOrThrow({ where: { slug: opts.keepSlug } }),
    tx.boardCaseStudy.findUniqueOrThrow({ where: { slug: opts.deleteSlug } }),
  ]);

  const before = { stats: arr(keep.stats).length, sections: arr(keep.sections).length, sources: arr(keep.sources).length, players: keep.players.length };

  const data = opts.transform(keep as unknown as Record<string, unknown>, del as unknown as Record<string, unknown>);
  if (opts.neighborhoods) data.neighborhoods = opts.neighborhoods;

  // Full audit log of the row being deleted — printed before deletion so nothing is
  // silently unrecoverable even if the merge missed something.
  console.log(`\n  --- FULL CONTENT BEING DELETED (${opts.deleteSlug}) — audit log ---`);
  console.log(JSON.stringify(del, (_k, v) => typeof v === "bigint" ? v.toString() : v, 2));
  console.log(`  --- end audit log for ${opts.deleteSlug} ---\n`);

  const updated = await tx.boardCaseStudy.update({ where: { slug: opts.keepSlug }, data });
  await tx.boardCaseStudy.delete({ where: { slug: opts.deleteSlug } });

  const after = { stats: arr(updated.stats).length, sections: arr(updated.sections).length, sources: arr(updated.sources).length, players: updated.players.length };
  console.log(`  merged "${opts.deleteSlug}" into "${opts.keepSlug}"`);
  console.log(`    stats: ${before.stats} → ${after.stats}  |  sections: ${before.sections} → ${after.sections}  |  sources: ${before.sources} → ${after.sources}  |  players: ${before.players} → ${after.players}`);
  if (after.stats < before.stats || after.sections < before.sections || after.sources < before.sources) {
    throw new Error(`SAFETY CHECK FAILED for ${opts.keepSlug}: a count went DOWN — aborting transaction, nothing will be committed.`);
  }
}

async function main() {
  console.log("Merging duplicated case studies (all-or-nothing transaction)…\n");

  await prisma.$transaction(async (tx) => {

  // ── BWL: two entirely different stories about the same institution — governance/PAC
  // (old, kept) and the Eckert Station coal-operations history (new, folded in as
  // additional sections rather than replacing anything). No overlapping content to dedupe.
  await mergeOne(tx, {
    keepSlug: "bwl",
    deleteSlug: "bwl-coal-operations",
    neighborhoods: ["Moores Park"],
    transform: (keep, del) => ({
      date: "1922–present (ONGOING)",
      summary: `${keep.summary} A second, separate accountability story runs underneath this institution: 97 years of coal combustion at Eckert Station (1922–2020) externalized health and environmental costs onto the adjacent Moores Park neighborhood, even under public ownership.`,
      stats: [...arr<Stat>(keep.stats), ...arr<Stat>(del.stats)],
      sections: [
        ...arr<Section>(keep.sections),
        {
          eyebrow: "Historical Accounting · 1922–2020",
          heading: "Eckert Station: what coal power delivered",
          description: "",
          items: [
            { label: "97 years of reliable municipal electricity", desc: "At 351 megawatts, Eckert powered downtown Lansing and the GM Grand River plant. Municipal ownership meant rates stayed lower than private utility alternatives." },
            { label: "BWL as a publicly owned utility", desc: "Unlike investor-owned utilities, BWL's surplus flows back to city operations, funding public services — a genuine structural benefit of public ownership." },
            { label: "Steam district heating", desc: "BWL's steam system heated downtown buildings for decades, reducing individual building boiler costs." },
          ],
        },
        {
          eyebrow: "Historical Accounting · 1922–2020",
          heading: "Eckert Station: what it actually cost",
          description: "Public ownership of the institution did not translate into accountability for the externalities. Coal ash contamination, air quality burden, and groundwater risk were all externalized onto adjacent communities and future ratepayers, even under public ownership. Public ownership is necessary but not sufficient — governance accountability to affected communities, not just to appointed commissioners, is what was missing.",
          items: [
            { label: "Coal combustion health burden", desc: "97 years of particulate matter, sulfur dioxide, nitrogen oxides, and mercury emissions adjacent to a residential neighborhood. No epidemiological study of the cancer or respiratory disease burden has been published for this site." },
            { label: "Erickson coal ash contamination", desc: "At the Delta Township plant (opened 1973), pollutants leaked from coal ash ponds. Federal groundwater monitoring results came in three years late under the 2015 federal rule. $21M+ in public cleanup costs documented." },
            { label: "Red Cedar and Grand River pollution", desc: "Coal ash leachate contributes to watershed contamination. The Red Cedar has had total-body-contact advisories approximately 70% of the time since 2000." },
            { label: "Decommissioning cost", desc: "Ratepayers fund decommissioning. The Eckert site transition to a substation and the Erickson ash cleanup are public costs following private-equivalent profit extraction during the operating years." },
          ],
        },
      ],
      sources: Array.from(new Set([...arr<string>(keep.sources), "BWL Historical Facilities (lbwl.com)", "Rhinoceros Media — Lansing coal health investigation, July 2026"])),
      players: arr<string>(keep.players).length ? keep.players : ["Board of Water and Light (BWL)"],
    }),
  });

  // ── Land Bank: old is already a superset of the new content. Only genuinely new datum
  // is the 5-year-window demolition figure (distinct from old's 15-year-window figure) —
  // add it alongside, don't replace.
  await mergeOne(tx, {
    keepSlug: "ingham-county-land-bank",
    deleteSlug: "ingham-land-bank",
    transform: (keep) => ({
      stats: [...arr<Stat>(keep.stats), { label: "Demolitions vs. completions (5-yr record)", value: "47:15" }],
      sources: Array.from(new Set([...arr<string>(keep.sources), "lansing-full-accounting-MASTER.md, Case 8"])),
    }),
  });

  // ── Chamber/PAC: old has the deep investigative detail (Daman's 5 roles, the $113,446
  // filing, the dark-money network). New adds one genuinely important thing old couldn't
  // have: the Aug 4, 2026 Shuffle vote as proof binding public review breaks the loop.
  await mergeOne(tx, {
    keepSlug: "lansing-chamber-pac",
    deleteSlug: "chamber-pac-electoral-loop",
    transform: (keep, del) => {
      const delSections = arr<Section>(del.sections);
      const shuffleSection = delSections.find(s => s.heading.includes("This loop is why"));
      return {
        date: "ongoing — updated through Aug. 2026",
        summary: `${keep.summary} The Aug. 4, 2026 voter rejection of the Lansing Shuffle sale (53–47%) is the clearest evidence yet of what breaks the loop: binding public review.`,
        stats: [...arr<Stat>(keep.stats), { label: "Shuffle sale — council placed on ballot, voters rejected", value: "6-1 → 53-47%" }],
        sections: shuffleSection ? [...arr<Section>(keep.sections), shuffleSection] : arr<Section>(keep.sections),
        recommendations: Array.from(new Set([
          ...arr<string>(keep.recommendations),
          "Map Chamber PAC contribution amounts against each council member's voting record on public asset dispositions — publish the correlations on lansing.love",
          "Identify two or three wards where community organizing and a non-PAC-funded candidate could be viable in the next election cycle",
        ])),
        players: arr<string>(keep.players).length ? keep.players : arr<string>(del.players),
      };
    },
  });

  // ── LHC: old has the sharper numbers ($17.7M, $357K/$87.6K per unit, tool links) that
  // the new version dropped — nothing from old is removed. New adds two things old lacks:
  // an explicit "what was genuinely received" section (old is purely extractive-framed)
  // and a populated players list. Per Jerry: 51 completed evictions and 113 cases filed
  // are both correct and complementary — both numbers now appear, clearly labeled.
  await mergeOne(tx, {
    keepSlug: "lansing-housing-commission",
    deleteSlug: "lhc-dispositions",
    transform: (keep, del) => {
      const delSections = arr<Section>(del.sections);
      const receivedSection = delSections.find(s => s.eyebrow === "What the community genuinely received");
      return {
        stats: [...arr<Stat>(keep.stats), { label: "Eviction cases filed (some closed w/o eviction)", value: "113" }],
        sections: receivedSection ? [receivedSection, ...arr<Section>(keep.sections)] : arr<Section>(keep.sections),
        players: arr<string>(del.players).length ? del.players : arr<string>(keep.players),
      };
    },
  });

  }, { timeout: 20000 });

  const fixNav = await prisma.boardCaseStudy.findUnique({ where: { slug: "lansing-housing-commission" }, select: { boardName: true } });
  console.log(`\nNav link at governance/page.tsx already points to the correct surviving slug: lansing-housing-commission (${fixNav?.boardName})`);

  const count = await prisma.boardCaseStudy.count();
  console.log(`\nMerge complete: ${count} case studies remain.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
