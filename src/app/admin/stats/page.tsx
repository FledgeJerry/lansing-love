"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Stats = {
  questionsByStatus: { status: string; count: number }[];
  questionsByCategory: { category: string; count: number }[];
  totalUsers: number;
  newUsersThisWeek: number;
  totalPredictions: number;
  overallAccuracy: number | null;
  totalResolved: number;
  topQuestions: { title: string; status: string; _count: { predictions: number } }[];
  signupsByDay: { day: string; count: number }[];
  accuracyByWard: { value: string; count: number; accuracy: number | null; predictions: number }[];
  accuracyByMeetings: { value: string; count: number; accuracy: number | null; predictions: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "var(--color-dome-gold)",
  ACTIVE: "var(--color-river-blue)",
  CLOSED: "var(--color-text-muted)",
  RESOLVED: "var(--color-teal-accent)",
  ARCHIVED: "var(--color-text-muted)",
};

export default function AdminStatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") { router.push("/"); return; }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN") return;
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, [session]);

  if (status === "loading") return <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Stats</h1>
        <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>
          <Link href="/admin" style={{ color: "var(--color-steel-muted)" }}>← Admin</Link>
        </p>
      </div>
      {stats ? <StatsPanel stats={stats} /> : <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
      <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-limestone)", margin: 0 }}>{value}</p>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>{label}</p>
      {sub && <p style={{ fontSize: "0.75rem", color: "var(--color-dome-gold)", margin: "0.25rem 0 0" }}>{sub}</p>}
    </div>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
      <span style={{ width: "140px", fontSize: "0.8rem", color: "var(--color-text-muted)", flexShrink: 0, textAlign: "right" }}>{label}</span>
      <div style={{ flex: 1, background: "var(--color-border)", borderRadius: "4px", height: "20px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: color ?? "var(--color-river-blue)", height: "100%", borderRadius: "4px", transition: "width 0.4s" }} />
      </div>
      <span style={{ width: "32px", fontSize: "0.8rem", color: "var(--color-limestone)", flexShrink: 0 }}>{value}</span>
    </div>
  );
}

function StatsPanel({ stats }: { stats: Stats }) {
  const maxCategory = Math.max(...stats.questionsByCategory.map((c) => c.count), 1);
  const maxStatus = Math.max(...stats.questionsByStatus.map((s) => s.count), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total users" value={stats.totalUsers} sub={`+${stats.newUsersThisWeek} this week`} />
        <StatCard label="Total predictions" value={stats.totalPredictions.toLocaleString()} />
        <StatCard label="Overall accuracy" value={stats.overallAccuracy !== null ? `${stats.overallAccuracy}%` : "—"} sub={`${stats.totalResolved} resolved predictions`} />
        <StatCard label="Questions resolved" value={stats.questionsByStatus.find((s) => s.status === "RESOLVED")?.count ?? 0} />
      </div>

      <div className="card" style={{ padding: "1.25rem" }}>
        <p style={{ fontWeight: 600, marginBottom: "1rem" }}>Questions by status</p>
        {stats.questionsByStatus.map((s) => (
          <Bar key={s.status} label={s.status} value={s.count} max={maxStatus} color={STATUS_COLORS[s.status]} />
        ))}
      </div>

      {stats.questionsByCategory.length > 0 && (
        <div className="card" style={{ padding: "1.25rem" }}>
          <p style={{ fontWeight: 600, marginBottom: "1rem" }}>Questions by category</p>
          {stats.questionsByCategory.map((c) => (
            <Bar key={c.category} label={c.category!} value={c.count} max={maxCategory} />
          ))}
        </div>
      )}

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

      {stats.signupsByDay.length > 0 && (
        <div className="card" style={{ padding: "1.25rem" }}>
          <p style={{ fontWeight: 600, marginBottom: "1rem" }}>Signups — last 30 days</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
            {stats.signupsByDay.map((d) => {
              const max = Math.max(...stats.signupsByDay.map((x) => x.count), 1);
              const h = Math.round((d.count / max) * 80);
              return (
                <div key={d.day} title={`${d.day}: ${d.count}`} style={{ flex: 1, background: "var(--color-river-blue)", height: `${h}px`, borderRadius: "2px 2px 0 0", minWidth: "4px" }} />
              );
            })}
          </div>
        </div>
      )}

      {stats.accuracyByWard.length > 0 && (
        <div className="card" style={{ padding: "1.25rem" }}>
          <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Accuracy by ward</p>
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>Groups with 31+ users only</p>
          <table style={{ width: "100%", fontSize: "0.875rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Ward</th>
                <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Users</th>
                <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Predictions</th>
                <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {stats.accuracyByWard.map((r) => (
                <tr key={r.value} style={{ borderTop: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "0.5rem 0" }}>{r.value}</td>
                  <td style={{ textAlign: "right", color: "var(--color-text-muted)" }}>{r.count}</td>
                  <td style={{ textAlign: "right", color: "var(--color-text-muted)" }}>{r.predictions}</td>
                  <td style={{ textAlign: "right", color: "var(--color-teal-accent)", fontWeight: 600 }}>{r.accuracy !== null ? `${r.accuracy}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {stats.accuracyByMeetings.length > 0 && (
        <div className="card" style={{ padding: "1.25rem" }}>
          <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Accuracy by meeting attendance</p>
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>Groups with 31+ users only</p>
          <table style={{ width: "100%", fontSize: "0.875rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Attendance</th>
                <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Users</th>
                <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Predictions</th>
                <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {stats.accuracyByMeetings.map((r) => (
                <tr key={r.value} style={{ borderTop: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "0.5rem 0" }}>{r.value}</td>
                  <td style={{ textAlign: "right", color: "var(--color-text-muted)" }}>{r.count}</td>
                  <td style={{ textAlign: "right", color: "var(--color-text-muted)" }}>{r.predictions}</td>
                  <td style={{ textAlign: "right", color: "var(--color-teal-accent)", fontWeight: 600 }}>{r.accuracy !== null ? `${r.accuracy}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
