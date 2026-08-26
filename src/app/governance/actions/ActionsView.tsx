"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ACTION_STATUSES, ACTION_STATUS_LABELS, ACTION_STATUS_COLORS, ACTION_HORIZON_LABELS, ACTION_SUBJECTS } from "@/lib/actionItemTypes";
import ActionStatusChart from "@/components/charts/ActionStatusChart";

const selectStyle: React.CSSProperties = {
  background: "var(--color-surface-raised)",
  color: "var(--color-text-primary)",
  border: "1px solid var(--color-border-strong)",
  borderRadius: "4px",
  padding: "2px 6px",
  fontSize: "0.8rem",
  fontFamily: "var(--font-sans)",
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ActionsView({ actions }: { actions: any[] }) {
  const [status, setStatus] = useState("");
  const [subject, setSubject] = useState("");
  const [source, setSource] = useState("");

  const filtered = useMemo(() => actions.filter((a) => {
    if (status && a.status !== status) return false;
    if (subject && !a.subjects.includes(subject)) return false;
    if (source && a.sourceType !== source) return false;
    return true;
  }), [actions, status, subject, source]);

  const openCount = actions.filter((a) => a.status !== "done").length;
  const overdueCount = actions.filter((a) => a.dueDate && new Date(a.dueDate) < new Date() && a.status !== "done").length;

  return (
    <div>
      <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <Stat value={String(openCount)} label="Open" />
          <Stat value={String(overdueCount)} label="Overdue" color={overdueCount > 0 ? "#c0392b" : undefined} />
          <Stat value={String(actions.filter((a) => a.status === "done").length)} label="Done" />
        </div>
        <div style={{ width: "min(280px, 100%)" }}>
          <ActionStatusChart actions={actions} />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", padding: "0.75rem 1rem", background: "var(--color-surface)", borderRadius: "8px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
            <option value="">All</option>
            {ACTION_STATUSES.map((s) => <option key={s} value={s}>{ACTION_STATUS_LABELS[s]}</option>)}
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>
          Subject
          <select value={subject} onChange={(e) => setSubject(e.target.value)} style={selectStyle}>
            <option value="">All</option>
            {ACTION_SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>
          Source
          <select value={source} onChange={(e) => setSource(e.target.value)} style={selectStyle}>
            <option value="">All</option>
            <option value="case">Case</option>
            <option value="pattern">Pattern</option>
            <option value="roadmap">Roadmap</option>
          </select>
        </label>
        <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--color-text-muted)", alignSelf: "center" }}>{filtered.length} of {actions.length}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {filtered.map((a) => {
          const overdue = a.dueDate && new Date(a.dueDate) < new Date() && a.status !== "done";
          return (
            <div key={a.id} style={{ padding: "0.85rem 1.1rem", borderRadius: "8px", background: "rgba(154,176,200,0.06)", border: "1px solid rgba(154,176,200,0.1)" }}>
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: ACTION_STATUS_COLORS[a.status as keyof typeof ACTION_STATUS_COLORS] ?? "#888", flexShrink: 0, marginTop: "0.3rem" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-limestone)", fontWeight: 600, lineHeight: 1.4 }}>{a.title}</p>
                  {a.description && <p style={{ margin: "0.3rem 0 0", fontSize: "0.82rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{a.description}</p>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "3px", background: `${ACTION_STATUS_COLORS[a.status as keyof typeof ACTION_STATUS_COLORS]}22`, color: ACTION_STATUS_COLORS[a.status as keyof typeof ACTION_STATUS_COLORS] }}>
                      {ACTION_STATUS_LABELS[a.status as keyof typeof ACTION_STATUS_LABELS] ?? a.status}
                    </span>
                    {a.horizon && <span style={{ fontSize: "0.68rem", color: "var(--color-text-muted)" }}>{ACTION_HORIZON_LABELS[a.horizon as keyof typeof ACTION_HORIZON_LABELS]}</span>}
                    {a.dueDate && <span style={{ fontSize: "0.68rem", color: overdue ? "#c0392b" : "var(--color-text-muted)" }}>due {formatDate(a.dueDate)}</span>}
                    {a.responsible && <span style={{ fontSize: "0.68rem", color: "var(--color-text-muted)" }}>{a.responsible}</span>}
                    {a.sourceHref && (
                      <Link href={a.sourceHref} style={{ fontSize: "0.68rem", color: "var(--color-dome-gold)" }}>
                        {a.sourceName} →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>No actions match these filters.</p>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div>
      <p style={{ fontSize: "1.5rem", fontWeight: 700, color: color ?? "var(--color-limestone)", margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", margin: "0.2rem 0 0" }}>{label}</p>
    </div>
  );
}
