// One-time migration: pull the free-text `recommendations` already on every
// BoardCaseStudy, plus the roadmap's hardcoded milestone table, into real
// ActionItem rows — the new single system for tracking recommendations,
// milestones, and anything else worth reviewing holistically.
// Safe to re-run: skips any (sourceType, sourceSlug/sourcePhase, title) already present.
// Run: npx tsx scripts/migrate-recommendations-to-action-items.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { cast } from "../src/lib/caseStudyTypes";

// Mirrors the milestone table in src/app/governance/roadmap/page.tsx.
// The Charter milestone is marked done — the new charter has been in effect
// since Jan 1, 2026, per the roadmap page's own text; everything else defaults open.
const ROADMAP_MILESTONES: { phase: string; item: string; done?: boolean }[] = [
  { phase: "0", item: "First cooperative operating 12+ months, open books, no demutualization" },
  { phase: "0", item: "Federation tier providing shared coaching, legal templates, pooled resources" },
  { phase: "Charter", item: "New charter in effect (Jan 1, 2026) — independent auditor, mayoral strategic plan with measurable benchmarks, public financial dashboard, best-value procurement", done: true },
  { phase: "1", item: "Participatory budgeting ordinance passed" },
  { phase: "1", item: "At least one proactive disclosure ordinance in effect" },
  { phase: "1", item: "Two or more council members elected on small-donor, reform-aligned campaigns" },
  { phase: "2", item: "Neighborhood council with binding authority (not advisory only)" },
  { phase: "2", item: "Citizens' assembly pilot completed and publicly reported" },
  { phase: "2", item: "Money-out disclosure ordinance in effect" },
  { phase: "3", item: "Charter proposal passed by three-fifths council vote or voter petition" },
  { phase: "3", item: "Charter reform ratified at the ballot" },
];

async function main() {
  let created = 0, skipped = 0;

  // ── Case recommendations ──────────────────────────────────────────────
  const cases = await prisma.boardCaseStudy.findMany({ select: { slug: true, recommendations: true } });
  for (const c of cases) {
    const recs = cast<string[]>(c.recommendations, []);
    for (let i = 0; i < recs.length; i++) {
      const title = recs[i];
      if (!title?.trim()) continue;
      const existing = await prisma.actionItem.findFirst({ where: { sourceType: "case", sourceSlug: c.slug, title } });
      if (existing) { skipped++; continue; }
      await prisma.actionItem.create({
        data: { title, status: "open", sourceType: "case", sourceSlug: c.slug, sortOrder: i },
      });
      created++;
    }
  }

  // ── Roadmap milestones ──────────────────────────────────────────────────
  for (let i = 0; i < ROADMAP_MILESTONES.length; i++) {
    const m = ROADMAP_MILESTONES[i];
    const existing = await prisma.actionItem.findFirst({ where: { sourceType: "roadmap", sourcePhase: m.phase, title: m.item } });
    if (existing) { skipped++; continue; }
    await prisma.actionItem.create({
      data: {
        title: m.item,
        status: m.done ? "done" : "open",
        closedAt: m.done ? new Date("2026-01-01") : null,
        sourceType: "roadmap",
        sourcePhase: m.phase,
        sortOrder: i,
      },
    });
    created++;
  }

  console.log(`Created ${created} action items, skipped ${skipped} already present.`);
  const total = await prisma.actionItem.count();
  console.log(`Total action items: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
