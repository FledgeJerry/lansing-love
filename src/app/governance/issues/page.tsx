import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { type Score, SCORE_COLORS, SCORE_LABELS } from "@/lib/caseStudyTypes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issues — Lansing Board & Commission Accountability",
  description: "Documented governance failures across Lansing's appointed boards and commissions. Sourced from Rhinoceros Media public records reporting.",
  alternates: { canonical: "/governance/issues" },
};

const DIMENSIONS = ["Transparency", "Conflicts", "Mission", "Dem. control", "Oversight"] as const;

function Dot({ score }: { score: Score }) {
  return (
    <span title={SCORE_LABELS[score]} style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: SCORE_COLORS[score], flexShrink: 0 }} />
  );
}

export default async function IssuesIndexPage() {
  const boards = await prisma.boardCaseStudy.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    select: {
      slug: true,
      boardName: true,
      category: true,
      summary: true,
      stats: true,
      scoreTransparency: true,
      scoreConflicts: true,
      scoreMission: true,
      scoreDemocraticControl: true,
      scoreOversight: true,
    },
  });

  return (
    <div style={{ maxWidth: "900px", paddingBottom: "5rem" }}>

      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Issues
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Board & Commission Accountability</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", marginBottom: "0.75rem" }}>Documented in Lansing</h1>
        <p style={{ maxWidth: "640px", color: "var(--color-steel-muted)" }}>
          Concentrated power in the mayor&apos;s office produces predictable results in the appointed bodies beneath it. These are not isolated incidents — they are the same structural failure appearing across every board that lacks democratic control, competitive processes, or meaningful external oversight.
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", maxWidth: "640px", marginTop: "0.5rem" }}>
          All findings sourced from public records reporting by{" "}
          <a href="https://rhinocerosmedia.org" target="_blank" rel="noopener noreferrer">Rhinoceros Media</a>
          {" "}and city, county, state, and federal public records.
        </p>
      </section>

      {/* Scorecard grid */}
      <section style={{ marginBottom: "3rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Accountability scorecard</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(244,241,232,0.1)" }}>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)" }}>Board / Commission</th>
                {DIMENSIONS.map(d => (
                  <th key={d} style={{ padding: "0.5rem 0.5rem", textAlign: "center", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-steel-muted)", whiteSpace: "nowrap" }}>{d}</th>
                ))}
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "right", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)" }}>Report</th>
              </tr>
            </thead>
            <tbody>
              {boards.map(board => {
                const scores = [
                  board.scoreTransparency,
                  board.scoreConflicts,
                  board.scoreMission,
                  board.scoreDemocraticControl,
                  board.scoreOversight,
                ] as Score[];
                return (
                  <tr key={board.slug} style={{ borderBottom: "1px solid rgba(244,241,232,0.05)" }}>
                    <td style={{ padding: "0.6rem 0.75rem" }}>
                      <p style={{ fontWeight: 600, color: "var(--color-limestone)", margin: 0, fontSize: "0.82rem" }}>{board.boardName}</p>
                      <p style={{ fontSize: "0.7rem", color: "rgba(154,176,200,0.5)", margin: 0, marginTop: "0.1rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{board.category}</p>
                    </td>
                    {scores.map((s, i) => (
                      <td key={i} style={{ padding: "0.6rem 0.5rem", textAlign: "center" }}>
                        <Dot score={s} />
                      </td>
                    ))}
                    <td style={{ padding: "0.6rem 0.75rem", textAlign: "right" }}>
                      <Link href={`/governance/issues/${board.slug}`} style={{ fontSize: "0.75rem", color: "var(--color-dome-gold)", whiteSpace: "nowrap" }}>Read →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
          {(Object.entries(SCORE_LABELS) as [Score, string][]).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Dot score={k} />
              <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>{v}</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Case study cards */}
      <section style={{ marginBottom: "3rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-steel-muted)", marginBottom: "1rem" }}>Case studies</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {boards.map(board => {
            const scores = [
              board.scoreTransparency,
              board.scoreConflicts,
              board.scoreMission,
              board.scoreDemocraticControl,
              board.scoreOversight,
            ] as Score[];
            const firstStat = (board.stats as { value: string; label: string }[] | null)?.[0];
            return (
              <Link key={board.slug} href={`/governance/issues/${board.slug}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem", margin: 0, marginBottom: "0.25rem" }}>{board.boardName}</p>
                    {firstStat && (
                      <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", margin: 0 }}>
                        <strong style={{ color: "var(--color-limestone)" }}>{firstStat.value}</strong>{" "}{firstStat.label}
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.3rem", flexShrink: 0 }}>
                    {scores.map((s, i) => <Dot key={i} score={s} />)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/governance" className="btn btn--ghost btn--sm">← Back to Governance</Link>
        <Link href="/predictions" className="btn btn--secondary btn--sm">Track council votes →</Link>
      </div>
    </div>
  );
}
