import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ActionsView from "./ActionsView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Actions",
  description: "Every recommendation and milestone from the Full Accounting cases, the pattern language, and the roadmap — in one filterable list.",
  alternates: { canonical: "/governance/actions" },
  openGraph: { title: "Actions | lansing.love", description: "What accountability actually requires, tracked in one place.", url: "https://lansing.love/governance/actions" },
};

export default async function ActionsPage() {
  const [actions, cases, patterns] = await Promise.all([
    prisma.actionItem.findMany({ orderBy: [{ status: "asc" }, { dueDate: "asc" }, { sortOrder: "asc" }] }),
    prisma.boardCaseStudy.findMany({ select: { slug: true, boardName: true } }),
    prisma.pattern.findMany({ select: { slug: true, name: true, number: true } }),
  ]);

  const caseNames = Object.fromEntries(cases.map((c) => [c.slug, c.boardName]));
  const patternNames = Object.fromEntries(patterns.map((p) => [p.slug, `Pattern ${p.number}: ${p.name}`]));

  const serialized = actions.map((a) => ({
    ...a,
    dueDate: a.dueDate?.toISOString() ?? null,
    closedAt: a.closedAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    sourceName:
      a.sourceType === "case" && a.sourceSlug ? caseNames[a.sourceSlug] ?? a.sourceSlug :
      a.sourceType === "pattern" && a.sourceSlug ? patternNames[a.sourceSlug] ?? a.sourceSlug :
      a.sourceType === "roadmap" && a.sourcePhase ? `Roadmap — Phase ${a.sourcePhase}` :
      null,
    sourceHref:
      a.sourceType === "case" && a.sourceSlug ? `/governance/cases/${a.sourceSlug}` :
      a.sourceType === "pattern" && a.sourceSlug ? `/patterns/${a.sourceSlug}` :
      a.sourceType === "roadmap" ? `/governance/roadmap` :
      null,
  }));

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <span className="eyebrow">Accountability</span>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "0.5rem", lineHeight: 1.2 }}>Actions</h1>
        <p style={{ color: "var(--color-steel-muted)", fontSize: "0.95rem", maxWidth: "680px" }}>
          Every recommendation from a Full Accounting case, every roadmap milestone, and anything else worth tracking — in one place, filterable by subject and status, instead of scattered across a dozen pages.
        </p>
      </div>
      <ActionsView actions={serialized} />
    </div>
  );
}
