import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SCORE_COLORS, SCORE_LABELS, type Score } from "@/lib/caseStudyTypes";

export const dynamic = "force-dynamic";

export default async function CaseStudiesAdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const studies = await prisma.boardCaseStudy.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Board & Commission Case Studies</h1>
        </div>
        <Link href="/admin/case-studies/new" className="btn btn--primary btn--sm">+ New case study</Link>
      </div>

      {studies.length === 0 ? (
        <p style={{ color: "var(--color-steel-muted)" }}>No case studies yet. Create the first one.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {studies.map(s => (
            <div key={s.id} className="card" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <p style={{ fontWeight: 600, color: "var(--color-limestone)", margin: 0 }}>{s.boardName}</p>
                  {s.published
                    ? <span className="badge badge--teal" style={{ fontSize: "0.65rem" }}>Published</span>
                    : <span className="badge badge--muted" style={{ fontSize: "0.65rem" }}>Draft</span>}
                  <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{s.date}</span>
                </div>
                <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                  {[
                    ["T", s.scoreTransparency], ["C", s.scoreConflicts], ["M", s.scoreMission],
                    ["D", s.scoreDemocraticControl], ["O", s.scoreOversight],
                  ].map(([abbr, score]) => (
                    <span key={abbr} title={SCORE_LABELS[score as Score]} style={{ fontSize: "0.65rem", color: SCORE_COLORS[score as Score], fontWeight: 700 }}>{abbr}: {score}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link href={`/governance/issues/${s.slug}`} className="btn btn--ghost btn--sm" style={{ fontSize: "0.75rem" }}>View →</Link>
                <Link href={`/admin/case-studies/${s.id}/edit`} className="btn btn--ghost btn--sm" style={{ fontSize: "0.75rem" }}>Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
