"use client";

import { useState } from "react";

type Check = {
  id: string;
  sortOrder: number;
  question: string;
  answer: string;
  reviewedAt: string | null;
  updatedBy: string;
};

export default function OwnershipCheckEditor({ checks: initial }: { checks: Check[] }) {
  const [checks, setChecks] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(id: string) {
    setSaving(true);
    const res = await fetch("/api/admin/ownership-check", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, answer: draft }),
    });
    if (res.ok) {
      const updated = await res.json();
      setChecks((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditing(null);
    }
    setSaving(false);
  }

  const now = Date.now();
  const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {checks.map((c) => {
        const isStale = c.reviewedAt && now - new Date(c.reviewedAt).getTime() > NINETY_DAYS;
        const noAnswer = !c.answer;
        return (
          <div key={c.id} style={{ background: "var(--color-deep-navy)", border: `1px solid ${isStale || noAnswer ? "#c0392b44" : "rgba(244,241,232,0.1)"}`, borderRadius: "8px", padding: "1.25rem" }}>
            <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-limestone)", marginBottom: "0.5rem" }}>{c.question}</p>
            {editing === c.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(244,241,232,0.2)", borderRadius: "6px", padding: "0.6rem", color: "var(--color-limestone)", fontSize: "0.875rem", fontFamily: "inherit", resize: "vertical" }}
                  placeholder="Write one honest sentence..."
                  autoFocus
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => save(c.id)} disabled={saving} className="btn btn--primary btn--sm">{saving ? "Saving…" : "Save"}</button>
                  <button onClick={() => setEditing(null)} className="btn btn--ghost btn--sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  {c.answer ? (
                    <p style={{ color: "var(--color-steel-muted)", fontSize: "0.875rem", fontStyle: "italic" }}>&ldquo;{c.answer}&rdquo;</p>
                  ) : (
                    <p style={{ color: "#c0392b", fontSize: "0.8rem" }}>Not yet answered</p>
                  )}
                  {c.reviewedAt && (
                    <p style={{ fontSize: "0.72rem", color: isStale ? "#c0392b" : "var(--color-steel-muted)", marginTop: "0.3rem" }}>
                      {isStale ? "⚠ Overdue — " : ""}Last reviewed {new Date(c.reviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {c.updatedBy && ` by ${c.updatedBy}`}
                    </p>
                  )}
                </div>
                <button onClick={() => { setEditing(c.id); setDraft(c.answer); }} className="btn btn--ghost btn--sm" style={{ fontSize: "0.75rem", flexShrink: 0 }}>
                  Update
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
