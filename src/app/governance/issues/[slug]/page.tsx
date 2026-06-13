import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cast, SCORE_COLORS, SCORE_LABELS, type CaseStudyData, type Score, type Principle, type OwnershipQ, type BottomLine, type Section } from "@/lib/caseStudyTypes";

export const dynamic = "force-dynamic";

async function getCaseStudy(slug: string): Promise<CaseStudyData | null> {
  const row = await prisma.boardCaseStudy.findUnique({ where: { slug } });
  if (!row || !row.published) return null;
  return {
    id:           row.id,
    slug:         row.slug,
    boardName:    row.boardName,
    category:     row.category,
    date:         row.date,
    published:    row.published,
    summary:      row.summary,
    stats:        cast(row.stats,       []),
    principles:   cast(row.principles,  []),
    ownership:    cast(row.ownership,   []),
    bottomLines:  cast(row.bottomLines, []),
    sections:     cast(row.sections,    []),
    recommendations: cast(row.recommendations, []),
    sources:      cast(row.sources,     []),
    sourceUrls:   cast(row.sourceUrls,  []),
    scoreTransparency:      row.scoreTransparency      as Score,
    scoreConflicts:         row.scoreConflicts         as Score,
    scoreMission:           row.scoreMission           as Score,
    scoreDemocraticControl: row.scoreDemocraticControl as Score,
    scoreOversight:         row.scoreOversight         as Score,
  };
}

function ScoreDot({ score }: { score: Score }) {
  return <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: SCORE_COLORS[score], flexShrink: 0 }} title={SCORE_LABELS[score]} />;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-limestone)", lineHeight: 1, margin: 0 }}>{value}</p>
      <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.3rem", marginBottom: 0 }}>{label}</p>
    </div>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) notFound();

  const scorecard = [
    { label: "Transparency",       score: cs.scoreTransparency },
    { label: "Conflicts",          score: cs.scoreConflicts },
    { label: "Mission alignment",  score: cs.scoreMission },
    { label: "Democratic control", score: cs.scoreDemocraticControl },
    { label: "Oversight",          score: cs.scoreOversight },
  ] as { label: string; score: Score }[];

  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      {/* Breadcrumb */}
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        <Link href="/governance/issues" style={{ color: "var(--color-steel-muted)" }}>Issues</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        {cs.boardName}
      </p>

      {/* Header */}
      <section style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Case Study · {cs.category}</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>{cs.boardName}</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{cs.date}</span>
          <span className="badge badge--muted">{cs.category}</span>
        </div>
        {/* Scorecard mini */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {scorecard.map(({ label, score }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ScoreDot score={score} />
              <span style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>{label}: <strong style={{ color: SCORE_COLORS[score] }}>{SCORE_LABELS[score]}</strong></span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      {cs.stats.length > 0 && (
        <div style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: "12px", marginBottom: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 0 }}>
          {cs.stats.map((s, i) => <Stat key={i} value={s.value} label={s.label} />)}
        </div>
      )}

      {/* Summary */}
      {cs.summary && (
        <section style={{ marginBottom: "3rem" }}>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, maxWidth: "680px", borderLeft: "3px solid rgba(192,57,43,0.4)", paddingLeft: "1.25rem" }}>{cs.summary}</p>
        </section>
      )}

      {/* Cooperative Principles */}
      {cs.principles.filter(p => p.violation).length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <hr className="divider" />
          <span className="eyebrow">Cooperative principles analysis</span>
          <h2 style={{ marginBottom: "0.5rem" }}>The Seven ICA Cooperative Principles — applied</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)", maxWidth: "640px", marginBottom: "1.5rem" }}>
            The International Cooperative Alliance&apos;s seven principles define community-centered governance. Applied here as an accountability framework.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {(cs.principles as Principle[]).map(p => p.violation ? (
              <div key={p.num} className="card" style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#c0392b", margin: 0, minWidth: "18px" }}>#{p.num}</p>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem", marginBottom: "0.3rem" }}>{p.name}</p>
                  <p style={{ fontSize: "0.8rem", marginBottom: "0.3rem" }}>{p.violation}</p>
                  {p.evidence && <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontStyle: "italic", margin: 0 }}>Evidence: {p.evidence}</p>}
                </div>
              </div>
            ) : null)}
          </div>
        </section>
      )}

      {/* Ownership Questions */}
      {cs.ownership.filter(o => o.before || o.after).length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <hr className="divider" />
          <span className="eyebrow">Ownership analysis</span>
          <h2 style={{ marginBottom: "1rem" }}>The Five Ownership Questions</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(244,241,232,0.1)" }}>
                  {["Question", "Before", "After", "Assessment"].map(h => (
                    <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(cs.ownership as OwnershipQ[]).map(o => (
                  <tr key={o.question} style={{ borderBottom: "1px solid rgba(244,241,232,0.05)" }}>
                    <td style={{ padding: "0.6rem 0.75rem", fontWeight: 600, color: "var(--color-limestone)", whiteSpace: "nowrap" }}>{o.question}</td>
                    <td style={{ padding: "0.6rem 0.75rem", color: "var(--color-text-secondary)" }}>{o.before}</td>
                    <td style={{ padding: "0.6rem 0.75rem", color: "var(--color-text-secondary)" }}>{o.after}</td>
                    <td style={{ padding: "0.6rem 0.75rem", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", color: o.assessment === "extractive" ? "#c0392b" : o.assessment === "mixed" ? "#E8C84A" : "#4A9B8E" }}>
                        {o.assessment.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Four Bottom Lines */}
      {cs.bottomLines.filter(b => b.description).length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <hr className="divider" />
          <span className="eyebrow">Impact assessment</span>
          <h2 style={{ marginBottom: "1rem" }}>The Four Bottom Lines</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {(cs.bottomLines as BottomLine[]).map(b => (
              <div key={b.dimension} className="card" style={{ padding: "1.25rem", borderTop: `2px solid ${b.impact === "positive" ? "#4A9B8E" : b.impact === "negative" ? "#c0392b" : "#E8C84A"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <p style={{ fontWeight: 700, color: "var(--color-limestone)", fontSize: "0.9rem", margin: 0 }}>{b.dimension}</p>
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, color: b.impact === "positive" ? "#4A9B8E" : b.impact === "negative" ? "#c0392b" : "#E8C84A", textTransform: "uppercase" }}>{b.impact}</span>
                </div>
                <p style={{ fontSize: "0.8rem", margin: 0 }}>{b.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom sections */}
      {(cs.sections as Section[]).map((sec, i) => (
        <section key={i} style={{ marginBottom: "3rem" }}>
          <hr className="divider" />
          <span className="eyebrow">{sec.eyebrow}</span>
          <h2 style={{ marginBottom: sec.description ? "0.75rem" : "1.25rem" }}>{sec.heading}</h2>
          {sec.description && <p style={{ maxWidth: "640px", marginBottom: "1.25rem", fontSize: "0.875rem" }}>{sec.description}</p>}
          {sec.items.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "720px" }}>
              {sec.items.map((item, j) => (
                <div key={j} className="card" style={{ padding: "1.25rem", borderLeft: "3px solid rgba(192,57,43,0.4)" }}>
                  {item.label && <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.875rem", marginBottom: "0.35rem" }}>{item.label}</p>}
                  <p style={{ fontSize: "0.8rem", margin: 0 }}>{item.desc}</p>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "var(--color-dome-gold)", display: "inline-block", marginTop: "0.4rem" }}>
                      {item.url.replace("https://", "")} →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {/* Recommendations */}
      {cs.recommendations.length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <hr className="divider" />
          <span className="eyebrow">Recommendations</span>
          <h2 style={{ marginBottom: "1rem" }}>What accountability looks like</h2>
          <div style={{ maxWidth: "640px" }}>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
              {cs.recommendations.map((r, i) => <li key={i} style={{ fontSize: "0.85rem" }}>{r}</li>)}
            </ul>
          </div>
        </section>
      )}

      {/* Sources */}
      {cs.sources.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(244,241,232,0.08)", paddingTop: "1.25rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Sources</p>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {cs.sources.map((s, i) => <li key={i} style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{s}</li>)}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/governance/issues" className="btn btn--ghost btn--sm">← All issues</Link>
        <Link href="/predictions" className="btn btn--secondary btn--sm">Track related votes →</Link>
      </div>
    </div>
  );
}
