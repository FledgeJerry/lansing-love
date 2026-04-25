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

type ResolvedQuestion = {
  id: string;
  title: string;
  category: string | null;
  outcomeLabel: string | null;
  outcomeNotes: string | null;
  predictionCount: number;
  resolvedAt: string | null;
};

type Stats = {
  questionsByStatus: { status: string; count: number }[];
  questionsByCategory: { category: string; count: number }[];
  accuracyByCategory: { category: string; correct: number; total: number; accuracy: number }[];
  totalUsers: number;
  totalPredictions: number;
  overallAccuracy: number | null;
  totalResolved: number;
  topQuestions: { title: string; status: string; _count: { predictions: number } }[];
};

type DesireOption = { label: string; predictPct: number; wantPct: number; gap: number };
type DesireQuestion = {
  id: string;
  title: string;
  category: string | null;
  status: string;
  totalPredictions: number;
  totalDesires: number;
  options: DesireOption[];
  maxGap: number;
  outcomeLabel: string | null;
};
type DesireStats = {
  totalDesires: number;
  totalPredictions: number;
  desireParticipation: number;
  desireAccord: number | null;
  byCategory: { category: string; predictions: number; desires: number; participation: number; accord: number | null }[];
  topGapQuestions: DesireQuestion[];
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
  resolvedQuestions,
}: {
  leaderboard: LeaderboardEntry[];
  resolvedCount: number;
  resolvedQuestions: ResolvedQuestion[];
}) {
  const [tab, setTab] = useState<"leaderboard" | "resolved" | "stats" | "voice">("leaderboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [desireStats, setDesireStats] = useState<DesireStats | null>(null);
  const [loadingDesire, setLoadingDesire] = useState(false);

  useEffect(() => {
    if (tab !== "stats" || stats) return;
    setLoadingStats(true);
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoadingStats(false); });
  }, [tab, stats]);

  useEffect(() => {
    if (tab !== "voice" || desireStats) return;
    setLoadingDesire(true);
    fetch("/api/stats/desire")
      .then((r) => r.json())
      .then((d) => { setDesireStats(d); setLoadingDesire(false); });
  }, [tab, desireStats]);

  const maxCategory = stats ? Math.max(...stats.questionsByCategory.map((c) => c.count), 1) : 1;
  const maxStatus = stats ? Math.max(...stats.questionsByStatus.map((s) => s.count), 1) : 1;

  return (
    <>
      <div className="tabs" style={{ marginBottom: "1.5rem" }}>
        <button className={`tab-btn${tab === "leaderboard" ? " active" : ""}`} onClick={() => setTab("leaderboard")}>
          Leaderboard
        </button>
        <button className={`tab-btn${tab === "resolved" ? " active" : ""}`} onClick={() => setTab("resolved")}>
          Resolved {resolvedCount > 0 && <span style={{ opacity: 0.65 }}>({resolvedCount})</span>}
        </button>
        <button className={`tab-btn${tab === "stats" ? " active" : ""}`} onClick={() => setTab("stats")}>
          Community Stats
        </button>
        <button className={`tab-btn${tab === "voice" ? " active" : ""}`} onClick={() => setTab("voice")}>
          Community Voice
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

      {/* RESOLVED TAB */}
      {tab === "resolved" && (
        <>
          {resolvedQuestions.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
              <p style={{ color: "var(--color-text-muted)", margin: 0 }}>No resolved questions yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {resolvedQuestions.map((q) => (
                <div key={q.id} className="card" style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {q.category && <span className="eyebrow">{q.category}</span>}
                      <p style={{ fontFamily: "var(--font-serif)", color: "var(--color-limestone)", margin: "0.2rem 0 0.4rem", fontSize: "0.95rem" }}>
                        {q.title}
                      </p>
                      {q.outcomeNotes && (
                        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontStyle: "italic", margin: 0 }}>
                          {q.outcomeNotes}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {q.outcomeLabel && (
                        <span className="badge badge--teal" style={{ display: "block", marginBottom: "0.25rem" }}>
                          {q.outcomeLabel}
                        </span>
                      )}
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {q.predictionCount} prediction{q.predictionCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

              {/* Accuracy by category */}
              {stats.accuracyByCategory.length > 0 && (
                <div className="card" style={{ padding: "1.25rem" }}>
                  <p style={{ fontWeight: 600, marginBottom: "1rem" }}>Accuracy by category</p>
                  <table style={{ width: "100%", fontSize: "0.875rem", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                        <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Category</th>
                        <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Correct</th>
                        <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Predictions</th>
                        <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.accuracyByCategory.map((c) => (
                        <tr key={c.category} style={{ borderTop: "1px solid var(--color-border)" }}>
                          <td style={{ padding: "0.5rem 0" }}>{c.category}</td>
                          <td style={{ textAlign: "right", color: "var(--color-text-muted)" }}>{c.correct}</td>
                          <td style={{ textAlign: "right", color: "var(--color-text-muted)" }}>{c.total}</td>
                          <td style={{ textAlign: "right" }}>
                            <span className={`badge ${c.accuracy >= 70 ? "badge--teal" : c.accuracy >= 50 ? "badge--gold" : "badge--muted"}`}>
                              {c.accuracy}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

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
      {/* COMMUNITY VOICE TAB */}
      {tab === "voice" && (
        <>
          {loadingDesire && <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>}
          {desireStats && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {/* Key numbers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
                {[
                  { label: "Voices recorded", value: desireStats.totalDesires },
                  { label: "Participation rate", value: `${desireStats.desireParticipation}%` },
                  { label: "Want what they predict", value: desireStats.desireAccord !== null ? `${desireStats.desireAccord}%` : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
                    <p style={{ fontSize: "2rem", fontWeight: 700, color: "#9B72CF", margin: 0 }}>{value}</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Civic tensions */}
              {desireStats.topGapQuestions.length > 0 && (
                <div>
                  <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Civic tensions</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
                    Questions where what people predict and what they want diverge most.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {desireStats.topGapQuestions.map((q) => (
                      <div key={q.id} className="card" style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.75rem" }}>
                          <div>
                            {q.category && <span className="eyebrow">{q.category}</span>}
                            <p style={{ fontFamily: "var(--font-serif)", color: "var(--color-limestone)", margin: "0.2rem 0 0", fontSize: "0.95rem" }}>{q.title}</p>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            {q.outcomeLabel && <span className="badge badge--teal" style={{ display: "block", marginBottom: "0.25rem" }}>{q.outcomeLabel}</span>}
                            <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                              {q.totalPredictions} predict · {q.totalDesires} want
                            </span>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          {q.options.map((opt) => (
                            <div key={opt.label}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>{opt.label}</span>
                                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                                  predict {opt.predictPct}% · want {opt.wantPct}%
                                  {opt.gap > 0 && <span style={{ color: opt.gap >= 20 ? "#E07070" : "var(--color-text-muted)", marginLeft: "0.4rem" }}>({opt.gap > 0 ? `${opt.gap}pt gap` : "—"})</span>}
                                </span>
                              </div>
                              <div style={{ display: "flex", gap: "3px", height: "8px" }}>
                                <div style={{ flex: 1, background: "var(--color-border)", borderRadius: "2px", overflow: "hidden" }}>
                                  <div style={{ width: `${opt.predictPct}%`, height: "100%", background: "var(--color-dome-gold)", borderRadius: "2px" }} />
                                </div>
                                <div style={{ flex: 1, background: "var(--color-border)", borderRadius: "2px", overflow: "hidden" }}>
                                  <div style={{ width: `${opt.wantPct}%`, height: "100%", background: "#9B72CF", borderRadius: "2px" }} />
                                </div>
                              </div>
                            </div>
                          ))}
                          <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
                            <span style={{ fontSize: "0.65rem", color: "var(--color-dome-gold)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <span style={{ width: 8, height: 8, borderRadius: 1, background: "var(--color-dome-gold)", display: "inline-block" }} /> Predict
                            </span>
                            <span style={{ fontSize: "0.65rem", color: "#9B72CF", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <span style={{ width: 8, height: 8, borderRadius: 1, background: "#9B72CF", display: "inline-block" }} /> Want
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* By category */}
              {desireStats.byCategory.length > 0 && (
                <div className="card" style={{ padding: "1.25rem" }}>
                  <p style={{ fontWeight: 600, marginBottom: "1rem" }}>By category</p>
                  <table style={{ width: "100%", fontSize: "0.875rem", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                        <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Category</th>
                        <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Voices</th>
                        <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Participation</th>
                        <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Accord</th>
                      </tr>
                    </thead>
                    <tbody>
                      {desireStats.byCategory.map((c) => (
                        <tr key={c.category} style={{ borderTop: "1px solid var(--color-border)" }}>
                          <td style={{ padding: "0.5rem 0" }}>{c.category}</td>
                          <td style={{ textAlign: "right", color: "var(--color-text-muted)" }}>{c.desires}</td>
                          <td style={{ textAlign: "right" }}>
                            <span className={`badge ${c.participation >= 50 ? "badge--teal" : c.participation >= 25 ? "badge--gold" : "badge--muted"}`}>
                              {c.participation}%
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {c.accord !== null
                              ? <span className={`badge ${c.accord >= 60 ? "badge--muted" : "badge--gold"}`} style={{ background: c.accord < 40 ? "rgba(155,114,207,0.15)" : undefined, color: c.accord < 40 ? "#9B72CF" : undefined }}>{c.accord}%</span>
                              : <span style={{ color: "var(--color-text-muted)" }}>—</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.75rem", marginBottom: 0 }}>
                    Accord = % of voices that match their prediction. Low accord means people expect one thing but want another.
                  </p>
                </div>
              )}

              {desireStats.totalDesires === 0 && (
                <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                  <p style={{ color: "var(--color-text-muted)", margin: 0 }}>No voices recorded yet — predict and share what you want to see.</p>
                </div>
              )}

            </div>
          )}
        </>
      )}
    </>
  );
}
