"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ACTION_STATUSES, ACTION_STATUS_LABELS, ACTION_HORIZONS, ACTION_HORIZON_LABELS, ACTION_SUBJECTS } from "@/lib/actionItemTypes";

type FormData = {
  title: string; description: string;
  status: string; horizon: string; subjects: string[];
  dueDate: string; responsible: string;
  sourceType: string; sourceSlug: string; sourcePhase: string;
  closedNote: string;
};

const emptyForm = (): FormData => ({
  title: "", description: "",
  status: "open", horizon: "", subjects: [],
  dueDate: "", responsible: "",
  sourceType: "", sourceSlug: "", sourcePhase: "",
  closedNote: "",
});

const input: React.CSSProperties = { width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(244,241,232,0.15)", borderRadius: "6px", color: "var(--color-limestone)", fontFamily: "inherit", fontSize: "0.875rem" };
const label: React.CSSProperties = { fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", display: "block", marginBottom: "0.35rem" };
const fieldset: React.CSSProperties = { border: "1px solid rgba(244,241,232,0.1)", borderRadius: "8px", padding: "1.25rem", marginBottom: "1.5rem" };
const legend: React.CSSProperties = { padding: "0 0.5rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-dome-gold)" };
const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" };
const field: React.CSSProperties = { marginBottom: "1rem" };

interface Props {
  initial?: Partial<FormData>;
  id?: string;
}

export default function ActionItemForm({ initial, id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...emptyForm(), ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [cases, setCases] = useState<{ slug: string; boardName: string }[]>([]);
  const [patterns, setPatterns] = useState<{ slug: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/case-studies").then((r) => r.json()).then((rows) => setCases(rows.map((c: { slug: string; boardName: string }) => ({ slug: c.slug, boardName: c.boardName }))));
    fetch("/api/admin/patterns").then((r) => r.json()).then((rows) => setPatterns(rows.map((p: { slug: string; name: string }) => ({ slug: p.slug, name: p.name }))));
  }, []);

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function toggleSubject(s: string) {
    set("subjects", form.subjects.includes(s) ? form.subjects.filter((x) => x !== s) : [...form.subjects, s]);
  }

  async function save() {
    setSaving(true); setError("");
    try {
      const url = id ? `/api/admin/actions/${id}` : "/api/admin/actions";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Save failed"); }
      router.push("/admin/actions");
      router.refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      {error && <div className="alert alert--error" style={{ marginBottom: "1.5rem" }}>{error}</div>}

      <fieldset style={fieldset}>
        <legend style={legend}>Basics</legend>
        <div style={field}>
          <label style={label}>Title</label>
          <textarea value={form.title} onChange={(e) => set("title", e.target.value)} style={{ ...input, minHeight: "60px" }} />
        </div>
        <div style={field}>
          <label style={label}>Description (optional)</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} style={{ ...input, minHeight: "80px" }} />
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Status &amp; ownership</legend>
        <div style={row2}>
          <div>
            <label style={label}>Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} style={input}>
              {ACTION_STATUSES.map((s) => <option key={s} value={s}>{ACTION_STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Horizon</label>
            <select value={form.horizon} onChange={(e) => set("horizon", e.target.value)} style={input}>
              <option value="">—</option>
              {ACTION_HORIZONS.map((h) => <option key={h} value={h}>{ACTION_HORIZON_LABELS[h]}</option>)}
            </select>
          </div>
        </div>
        <div style={row2}>
          <div>
            <label style={label}>Due date</label>
            <input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} style={input} />
          </div>
          <div>
            <label style={label}>Responsible</label>
            <input value={form.responsible} onChange={(e) => set("responsible", e.target.value)} style={input} placeholder="e.g. Ryan Kost, City Council, Jerry" />
          </div>
        </div>
        {form.status === "done" && (
          <div style={field}>
            <label style={label}>Closed note (optional)</label>
            <input value={form.closedNote} onChange={(e) => set("closedNote", e.target.value)} style={input} placeholder="What happened / how it was resolved" />
          </div>
        )}
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Subjects</legend>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {ACTION_SUBJECTS.map((s) => (
            <label key={s} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", padding: "0.3rem 0.6rem", borderRadius: "5px", border: `1px solid ${form.subjects.includes(s) ? "var(--color-dome-gold)" : "rgba(244,241,232,0.15)"}`, cursor: "pointer" }}>
              <input type="checkbox" checked={form.subjects.includes(s)} onChange={() => toggleSubject(s)} />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Source (optional)</legend>
        <div style={field}>
          <label style={label}>Source type</label>
          <select value={form.sourceType} onChange={(e) => { set("sourceType", e.target.value); set("sourceSlug", ""); set("sourcePhase", ""); }} style={input}>
            <option value="">Standalone — not tied to a case, pattern, or roadmap phase</option>
            <option value="case">Case study</option>
            <option value="pattern">Pattern</option>
            <option value="roadmap">Roadmap phase</option>
          </select>
        </div>
        {form.sourceType === "case" && (
          <div style={field}>
            <label style={label}>Case</label>
            <select value={form.sourceSlug} onChange={(e) => set("sourceSlug", e.target.value)} style={input}>
              <option value="">Select case…</option>
              {cases.map((c) => <option key={c.slug} value={c.slug}>{c.boardName}</option>)}
            </select>
          </div>
        )}
        {form.sourceType === "pattern" && (
          <div style={field}>
            <label style={label}>Pattern</label>
            <select value={form.sourceSlug} onChange={(e) => set("sourceSlug", e.target.value)} style={input}>
              <option value="">Select pattern…</option>
              {patterns.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
            </select>
          </div>
        )}
        {form.sourceType === "roadmap" && (
          <div style={field}>
            <label style={label}>Roadmap phase</label>
            <select value={form.sourcePhase} onChange={(e) => set("sourcePhase", e.target.value)} style={input}>
              <option value="">Select phase…</option>
              <option value="0">Phase 0</option>
              <option value="Charter">Charter</option>
              <option value="1">Phase 1</option>
              <option value="2">Phase 2</option>
              <option value="3">Phase 3</option>
            </select>
          </div>
        )}
      </fieldset>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button type="button" onClick={save} disabled={saving || !form.title} className="btn btn--primary">
          {saving ? "Saving…" : id ? "Update action" : "Create action"}
        </button>
        <button type="button" onClick={() => router.push("/admin/actions")} className="btn btn--ghost">Cancel</button>
      </div>
    </div>
  );
}
