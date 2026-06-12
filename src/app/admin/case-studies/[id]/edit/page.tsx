import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CaseStudyForm from "../../CaseStudyForm";
import { cast, type Score } from "@/lib/caseStudyTypes";

export const dynamic = "force-dynamic";

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");
  const { id } = await params;
  const row = await prisma.boardCaseStudy.findUnique({ where: { id } });
  if (!row) notFound();

  const initial = {
    slug: row.slug, boardName: row.boardName, category: row.category,
    date: row.date, published: row.published, summary: row.summary,
    stats:           cast(row.stats, []),
    principles:      cast(row.principles, []),
    ownership:       cast(row.ownership, []),
    bottomLines:     cast(row.bottomLines, []),
    sections:        cast(row.sections, []),
    recommendations: cast(row.recommendations, []),
    sources:         cast(row.sources, []),
    sourceUrls:      cast(row.sourceUrls, []),
    scoreTransparency:      row.scoreTransparency      as Score,
    scoreConflicts:         row.scoreConflicts         as Score,
    scoreMission:           row.scoreMission           as Score,
    scoreDemocraticControl: row.scoreDemocraticControl as Score,
    scoreOversight:         row.scoreOversight         as Score,
  };

  return (
    <div>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/admin/case-studies" style={{ color: "var(--color-steel-muted)" }}>Case Studies</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Edit
      </p>
      <h1 style={{ marginBottom: "2rem" }}>Edit: {row.boardName}</h1>
      <CaseStudyForm initial={initial} id={id} />
    </div>
  );
}
