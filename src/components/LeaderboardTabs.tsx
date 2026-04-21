"use client";

import { useEffect, useState } from "react";

type LeaderboardEntry = {
  id: string;
  name: string | null;
  email: string;
  correct: number;
  total: number;
  accuracy: number;
};

type Stats = {
  questionsByStatus: { status: string; count: number }[];
  questionsByCategory: { category: string; count: number }[];
  totalUsers: number;
  totalPredictions: number;
  overallAccuracy: number | null;
  totalResolved: number;
  topQuestions: { title: string; status: string; _count: { predictions: number } }[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "var(--color-dome-gold)",
  ACTIVE: "var(--color-river-blue)",
  CLOSED: "var(--color-text-muted)",
  RESOLVED: "var(--color-teal-accent)",
  ARCHIVED: "var(--color-text-muted)",
};

const medals = ["🥇", "🥈", "🥉"];

export default function LeaderboardTabs({
  leaderboard,
  resolvedCount,
}: {
  leaderboard: LeaderboardEntry[];
  resolvedCount: number;
}) {
  const [tab, setTab] = useState<"leaderboard" | "stats">("leaderboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (tab !== "stats" || stats) return;
    setLoadingStats(true);
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoadingStats(false); });
  }, [tab, stats]);

  const maxCategory = stats ? Math.max(...stats.questionsByCategory.map((c) => c.count), 1) : 1;
  const maxStatus = stats ? Math.max(...stats.questionsByStatus.map((s) => s.count), 1) : 1;

  return (
    <>
      <div className="tabs" style={{ marginBottom: "1.5rem" }}>
        <button className={`tab-btn${tab === "leaderboard" ? " active" : ""}`} onClick={() => setTab("leaderboard")}>
          Leaderboard
        </button>
        <button className={`tab-btn${tab === "stats" ? " active" : ""}`} onClick={() => setTab("stats")}>
          Community Stats
        </button>
      </div>

      {/* LEADERBOARD TAB */}
      {tab === "leaderboard" && (
        <>
          {leaderboard.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
              <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
                No resolved predictions yet — check back soon.
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="ll-table">
                <thead>
                  <tr>
                    <th style={{ width: "3rem" }}>#</th>
                    <th>Predictor</th>
                    <th style={{ textAlign: "right" }}>Correct</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th style={{ textAlign: "right" }}>Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((u, i) => (
                    <tr key={u.id}>
                      <td style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-serif)" }}>
                        {medals[i] ?? i + 1}
                      </td>
                      <td style={{ color: "var(--color-limestone)", fontWeight: i < 3 ? 600 : 400 }}>
                        {u.name ?? u.email.split("@")[0]}
                      </td>
                      <td style={{ textAlign: "right", color: "var(--color-teal-accent)", fontWeight: 600 }}>{u.correct}</td>
                      <td style={{ textAlign: "right" }}>{u.total}</td>
                      <td style={{ textAlign: "right" }}>
                        <span className={`badge ${u.accuracy >= 70 ? "badge--teal" : u.accuracy >= 50 ? "badge--gold" : "badge--muted"}`}>
                          {u.accuracy}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
            {resolvedCount} resolved question{resolvedCount !== 1 ? "s" : ""} scored so far.
          </p>
        </>
      )}

      {/* STATS TAB */}
      {tab === "stats" && (
        <>
          {loadingStats && <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>}
          {stats && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {/* Key numbers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
                {[
                  { label: "Community members", value: stats.totalUsers },
                  { label: "Total predictions", value: stats.totalPredictions.toLocaleString() },
                  { label: "Overall accuracy", value: stats.overallAccuracy !== null ? `${stats.overallAccuracy}%` : "—" },
                  { label: "Questions resolved", value: stats.questionsByStatus.find((s) => s.status === "RESOLVED")?.count ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
                    <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-limestone)", margin: 0 }}>{value}</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Questions by status */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <p style={{ fontWeight: 600, marginBottom: "1rem" }}>Questions by status</p>
                {stats.questionsByStatus.map((s) => (
                  <div key={s.status} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <span style={{ width: "100px", fontSize: "0.8rem", color: "var(--color-text-muted)", flexShrink: 0, textAlign: "right" }}>{s.status}</span>
                    <div style={{ flex: 1, background: "var(--color-border)", borderRadius: "4px", height: "20px", overflow: "hidden" }}>
                      <div style={{ width: `${Math.round((s.count / maxStatus) * 100)}%`, background: STATUS_COLORS[s.status] ?? "var(--color-river-blue)", height: "100%", borderRadius: "4px" }} />
                    </div>
                    <span style={{ width: "28px", fontSize: "0.8rem", color: "var(--color-limestone)", flexShrink: 0 }}>{s.count}</span>
                  </div>
                ))}
              </div>

              {/* Questions by category */}
              {stats.questionsByCategory.length > 0 && (
                <div className="card" style={{ padding: "1.25rem" }}>
                  <p style={{ fontWeight: 600, marginBottom: "1rem" }}>Questions by category</p>
                  {stats.questionsByCategory.map((c) => (
                    <div key={c.category} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                      <span style={{ width: "140px", fontSize: "0.8rem", color: "var(--color-text-muted)", flexShrink: 0, textAlign: "right" }}>{c.category}</span>
                      <div style={{ flex: 1, background: "var(--color-border)", borderRadius: "4px", height: "20px", overflow: "hidden" }}>
                        <div style={{ width: `${Math.round((c.count / maxCategory) * 100)}%`, background: "var(--color-river-blue)", height: "100%", borderRadius: "4px" }} />
                      </div>
                      <span style={{ width: "28px", fontSize: "0.8rem", color: "var(--color-limestone)", flexShrink: 0 }}>{c.count}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Most predicted */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <p style={{ fontWeight: 600, marginBottom: "1rem" }}>Most predicted questions</p>
                {stats.topQuestions.map((q, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: i < stats.topQuestions.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                    <span style={{ fontSize: "0.875rem", flex: 1, marginRight: "1rem" }}>{q.title}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", flexShrink: 0 }}>{q._count.predictions} predictions</span>
                  </div>
                ))}
                {stats.topQuestions.length === 0 && <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No predictions yet.</p>}
              </div>

            </div>
          )}
        </>
      )}
    </>
  );
}
