import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Issues — Lansing Board & Commission Accountability",
  description: "Documented governance failures across Lansing's appointed boards and commissions — Housing Commission, Land Bank, Chamber PAC, Board of Police Commissioners, Board of Ethics. Sourced from Rhinoceros Media public records reporting.",
  alternates: { canonical: "/governance/issues" },
};

type Score = "high-risk" | "concerning" | "ok" | "insufficient";

const SCORE_LABEL: Record<Score, string> = {
  "high-risk":    "High risk",
  "concerning":   "Concerning",
  "ok":           "OK",
  "insufficient": "Insufficient data",
};
const SCORE_COLOR: Record<Score, string> = {
  "high-risk":    "#c0392b",
  "concerning":   "#E8C84A",
  "ok":           "#4A9B8E",
  "insufficient": "rgba(154,176,200,0.4)",
};

function Dot({ score }: { score: Score }) {
  return (
    <span title={SCORE_LABEL[score]} style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: SCORE_COLOR[score], flexShrink: 0 }} />
  );
}

const DIMENSIONS = ["Transparency", "Conflicts", "Mission", "Dem. control", "Oversight"];

const BOARDS = [
  {
    slug: "lansing-housing-commission",
    name: "Lansing Housing Commission",
    stat: "51 families evicted · 5 FOIA requests, 0 records produced",
    scores: ["high-risk", "high-risk", "high-risk", "high-risk", "concerning"] as Score[],
  },
  {
    slug: "ingham-county-land-bank",
    name: "Ingham County Land Bank",
    stat: "2.7 demolitions per housing unit created · $1.5M grant to LLC formed 3 days after selection",
    scores: ["high-risk", "high-risk", "high-risk", "high-risk", "high-risk"] as Score[],
  },
  {
    slug: "flock-surveillance",
    name: "Board of Police Commissioners / Flock",
    stat: "20 cameras deployed 7 months before any public discussion or board review",
    scores: ["high-risk", "insufficient", "concerning", "high-risk", "high-risk"] as Score[],
  },
  {
    slug: "lansing-chamber-pac",
    name: "Lansing Regional Chamber & LRC-PAC",
    stat: "$30,750 to 6 of 8 council members · reports $0 political spending on IRS filings",
    scores: ["high-risk", "high-risk", "insufficient", "high-risk", "high-risk"] as Score[],
  },
  {
    slug: "board-of-ethics",
    name: "Lansing Board of Ethics",
    stat: "4 complaints filed · 0 opinions issued · city attorney narrowed the legal standard",
    scores: ["concerning", "high-risk", "high-risk", "concerning", "insufficient"] as Score[],
  },
];

export default function IssuesIndexPage() {
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
              {BOARDS.map(board => (
                <tr key={board.slug} style={{ borderBottom: "1px solid rgba(244,241,232,0.05)" }}>
                  <td style={{ padding: "0.6rem 0.75rem" }}>
                    <p style={{ fontWeight: 600, color: "var(--color-limestone)", margin: 0, fontSize: "0.82rem" }}>{board.name}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", margin: 0, marginTop: "0.15rem" }}>{board.stat}</p>
                  </td>
                  {board.scores.map((s, i) => (
                    <td key={i} style={{ padding: "0.6rem 0.5rem", textAlign: "center" }}>
                      <Dot score={s} />
                    </td>
                  ))}
                  <td style={{ padding: "0.6rem 0.75rem", textAlign: "right" }}>
                    <Link href={`/governance/issues/${board.slug}`} style={{ fontSize: "0.75rem", color: "var(--color-dome-gold)", whiteSpace: "nowrap" }}>Read →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
          {(Object.entries(SCORE_LABEL) as [Score, string][]).map(([k, v]) => (
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
          {BOARDS.map(board => (
            <Link key={board.slug} href={`/governance/issues/${board.slug}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem", margin: 0, marginBottom: "0.25rem" }}>{board.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", margin: 0 }}>{board.stat}</p>
                </div>
                <div style={{ display: "flex", gap: "0.3rem", flexShrink: 0 }}>
                  {board.scores.map((s, i) => <Dot key={i} score={s} />)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/governance" className="btn btn--ghost btn--sm">← Back to Governance</Link>
        <Link href="/predictions" className="btn btn--secondary btn--sm">Track council votes →</Link>
      </div>
    </div>
  );
}
