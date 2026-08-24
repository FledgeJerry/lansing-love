"use client";

import { useRouter } from "next/navigation";
import { ACTION_STATUSES, ACTION_STATUS_LABELS, ACTION_SUBJECTS } from "@/lib/actionItemTypes";

const selectStyle: React.CSSProperties = {
  background: "var(--color-surface-raised)",
  color: "var(--color-text-primary)",
  border: "1px solid var(--color-border-strong)",
  borderRadius: "4px",
  padding: "2px 6px",
  fontSize: "0.8rem",
  fontFamily: "var(--font-sans)",
};

export default function ActionFilters({ status, subject, source }: { status?: string; subject?: string; source?: string }) {
  const router = useRouter();

  function update(key: "status" | "subject" | "source", value: string) {
    const params = new URLSearchParams({
      ...(status ? { status } : {}),
      ...(subject ? { subject } : {}),
      ...(source ? { source } : {}),
    });
    if (value) params.set(key, value); else params.delete(key);
    const s = params.toString();
    router.push(s ? `/admin/actions?${s}` : "/admin/actions");
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", padding: "0.75rem 1rem", background: "var(--color-surface)", borderRadius: "8px" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>
        Status
        <select value={status ?? ""} onChange={(e) => update("status", e.target.value)} style={selectStyle}>
          <option value="">All</option>
          {ACTION_STATUSES.map((s) => <option key={s} value={s}>{ACTION_STATUS_LABELS[s]}</option>)}
        </select>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>
        Subject
        <select value={subject ?? ""} onChange={(e) => update("subject", e.target.value)} style={selectStyle}>
          <option value="">All</option>
          {ACTION_SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>
        Source
        <select value={source ?? ""} onChange={(e) => update("source", e.target.value)} style={selectStyle}>
          <option value="">All</option>
          <option value="case">Case</option>
          <option value="pattern">Pattern</option>
          <option value="roadmap">Roadmap</option>
        </select>
      </label>
    </div>
  );
}
