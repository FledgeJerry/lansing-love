"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PRINCIPLE_NAMES, OWNERSHIP_QUESTIONS, BOTTOM_LINE_DIMENSIONS, SCORE_OPTIONS,
  defaultPrinciples, defaultOwnership, defaultBottomLines,
  type CaseStudyData, type Principle, type OwnershipQ, type BottomLine, type Section, type Score,
} from "@/lib/caseStudyTypes";

type FormData = Omit<CaseStudyData, "id" | "published"> & { published: boolean };

const emptyForm = (): FormData => ({
  slug: "", boardName: "", category: "Other", date: "", published: false, summary: "",
  stats: [{ value: "", label: "" }],
  principles: defaultPrinciples(),
  ownership: defaultOwnership(),
  bottomLines: defaultBottomLines(),
  sections: [],
  recommendations: [""],
  sources: [""],
  sourceUrls: [""],
  scoreTransparency: "insufficient" as Score,
  scoreConflicts: "insufficient" as Score,
  scoreMission: "insufficient" as Score,
  scoreDemocraticControl: "insufficient" as Score,
  scoreOversight: "insufficient" as Score,
});

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const input: React.CSSProperties = { width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(244,241,232,0.15)", borderRadius: "6px", color: "var(--color-limestone)", fontFamily: "inherit", fontSize: "0.875rem" };
const label: React.CSSProperties = { fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", display: "block", marginBottom: "0.35rem" };
const fieldset: React.CSSProperties = { border: "1px solid rgba(244,241,232,0.1)", borderRadius: "8px", padding: "1.25rem", marginBottom: "1.5rem" };
const legend: React.CSSProperties = { padding: "0 0.5rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-dome-gold)" };

interface Props {
  initial?: Partial<FormData>;
  id?: string;
}

export default function CaseStudyForm({ initial, id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...emptyForm(), ...initial });
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function setArr<T>(k: keyof FormData, i: number, updater: (item: T) => T) {
    setForm(f => {
      const arr = [...(f[k] as T[])];
      arr[i] = updater(arr[i]);
      return { ...f, [k]: arr };
    });
  }

  function addRow<T>(k: keyof FormData, empty: T) {
    setForm(f => ({ ...f, [k]: [...(f[k] as T[]), empty] }));
  }

  function removeRow<T>(k: keyof FormData, i: number) {
    setForm(f => { const arr = [...(f[k] as T[])]; arr.splice(i, 1); return { ...f, [k]: arr }; });
  }

  // ── AI Analyze ───────────────────────────────────────────────────────────────

  async function analyze() {
    const urls = form.sourceUrls.filter(u => u.trim());
    if (!urls.length) { setError("Add at least one Rhino article URL before analyzing."); return; }
    setAnalyzing(true); setError("");
    try {
      const res = await fetch("/api/admin/case-studies/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const data = await res.json();
      setForm(f => ({
        ...f,
        boardName:             data.boardName    ?? f.boardName,
        category:              data.category     ?? f.category,
        date:                  data.date         ?? f.date,
        slug:                  data.slug         ?? f.slug,
        summary:               data.summary      ?? f.summary,
        stats:                 data.stats?.length     ? data.stats     : f.stats,
        principles:            data.principles?.length ? data.principles : f.principles,
        ownership:             data.ownership?.length  ? data.ownership  : f.ownership,
        bottomLines:           data.bottomLines?.length ? data.bottomLines : f.bottomLines,
        sections:              data.sections?.length   ? data.sections   : f.sections,
        recommendations:       data.recommendations?.length ? data.recommendations : f.recommendations,
        sources:               data.sources?.length    ? data.sources    : f.sources,
        scoreTransparency:      data.scoreTransparency      ?? f.scoreTransparency,
        scoreConflicts:         data.scoreConflicts         ?? f.scoreConflicts,
        scoreMission:           data.scoreMission           ?? f.scoreMission,
        scoreDemocraticControl: data.scoreDemocraticControl ?? f.scoreDemocraticControl,
        scoreOversight:         data.scoreOversight         ?? f.scoreOversight,
      }));
    } catch (e) {
      setError(String(e));
    } finally {
      setAnalyzing(false);
    }
  }

  // ── Save ─────────────────────────────────────────────────────────────────────

  async function save() {
    setSaving(true); setError("");
    try {
      const url = id ? `/api/admin/case-studies/${id}` : "/api/admin/case-studies";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Save failed"); }
      router.push("/admin/case-studies");
      router.refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: "900px" }}>
      {error && <div className="alert alert--danger" style={{ marginBottom: "1rem" }}>{error}</div>}

      {/* AI Import */}
      <fieldset style={fieldset}>
        <legend style={legend}>AI Import — Rhino Article URLs</legend>
        <p style={{ fontSize: "0.8rem", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Paste one or more Rhino News article URLs, then click Analyze. Gemini will evaluate the board against all frameworks and pre-fill the form.</p>
        {form.sourceUrls.map((u, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input value={u} onChange={e => setArr<string>("sourceUrls", i, () => e.target.value)} placeholder="https://rhinocerosmedia.org/..." style={{ ...input, flex: 1 }} />
            <button type="button" onClick={() => removeRow("sourceUrls", i)} style={{ padding: "0 0.75rem", background: "none", border: "1px solid rgba(192,57,43,0.4)", borderRadius: "6px", color: "#c0392b", cursor: "pointer" }}>×</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button type="button" onClick={() => addRow<string>("sourceUrls", "")} className="btn btn--ghost btn--sm">+ Add URL</button>
          <button type="button" onClick={analyze} disabled={analyzing} className="btn btn--primary btn--sm">
            {analyzing ? "Analyzing…" : "✦ Analyze with Gemini"}
          </button>
        </div>
      </fieldset>

      {/* Basic Info */}
      <fieldset style={fieldset}>
        <legend style={legend}>Basic Info</legend>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.75rem" }}>
          <div>
            <span style={label}>Board Name</span>
            <input value={form.boardName} onChange={e => { set("boardName", e.target.value); if (!id) set("slug", slugify(e.target.value)); }} style={input} />
          </div>
          <div>
            <span style={label}>Slug (URL)</span>
            <input value={form.slug} onChange={e => set("slug", e.target.value)} style={input} />
          </div>
          <div>
            <span style={label}>Category</span>
            <input value={form.category} onChange={e => set("category", e.target.value)} style={input} placeholder="Housing, Surveillance, Ethics…" />
          </div>
          <div>
            <span style={label}>Date</span>
            <input value={form.date} onChange={e => set("date", e.target.value)} style={input} placeholder="June 2026" />
          </div>
        </div>
        <div style={{ marginBottom: "0.75rem" }}>
          <span style={label}>Summary</span>
          <textarea value={form.summary} onChange={e => set("summary", e.target.value)} rows={3} style={{ ...input, resize: "vertical" }} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)} />
          <span style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)" }}>Published (visible on site)</span>
        </label>
      </fieldset>

      {/* Scorecard */}
      <fieldset style={fieldset}>
        <legend style={legend}>Accountability Scorecard</legend>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>
          {[
            ["scoreTransparency", "Transparency"],
            ["scoreConflicts", "Conflicts of Interest"],
            ["scoreMission", "Mission Alignment"],
            ["scoreDemocraticControl", "Democratic Control"],
            ["scoreOversight", "External Oversight"],
          ].map(([k, lbl]) => (
            <div key={k}>
              <span style={label}>{lbl}</span>
              <select value={form[k as keyof FormData] as string} onChange={e => set(k as keyof FormData, e.target.value as Score)} style={{ ...input }}>
                {SCORE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </fieldset>

      {/* Key Stats */}
      <fieldset style={fieldset}>
        <legend style={legend}>Key Stats</legend>
        {form.stats.map((s, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input value={s.value} onChange={e => setArr("stats", i, (x: typeof s) => ({ ...x, value: e.target.value }))} placeholder="$17.7M" style={input} />
            <input value={s.label} onChange={e => setArr("stats", i, (x: typeof s) => ({ ...x, label: e.target.value }))} placeholder="Sale proceeds" style={input} />
            <button type="button" onClick={() => removeRow("stats", i)} style={{ padding: "0 0.75rem", background: "none", border: "1px solid rgba(192,57,43,0.4)", borderRadius: "6px", color: "#c0392b", cursor: "pointer" }}>×</button>
          </div>
        ))}
        <button type="button" onClick={() => addRow("stats", { value: "", label: "" })} className="btn btn--ghost btn--sm">+ Add stat</button>
      </fieldset>

      {/* 7 Cooperative Principles */}
      <fieldset style={fieldset}>
        <legend style={legend}>7 Cooperative Principles (ICA)</legend>
        {(form.principles as Principle[]).map((p, i) => (
          <div key={p.num} style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: i < 6 ? "1px solid rgba(244,241,232,0.07)" : "none" }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-dome-gold)", marginBottom: "0.5rem" }}>#{p.num} {p.name}</p>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div>
                <span style={label}>Violation</span>
                <textarea value={p.violation} onChange={e => setArr<Principle>("principles", i, x => ({ ...x, violation: e.target.value }))} rows={2} style={{ ...input, resize: "vertical" }} placeholder="How this principle is violated…" />
              </div>
              <div>
                <span style={label}>Evidence</span>
                <input value={p.evidence} onChange={e => setArr<Principle>("principles", i, x => ({ ...x, evidence: e.target.value }))} style={input} placeholder="Specific documented evidence…" />
              </div>
            </div>
          </div>
        ))}
      </fieldset>

      {/* 5 Ownership Questions */}
      <fieldset style={fieldset}>
        <legend style={legend}>5 Ownership Questions (DAWI)</legend>
        {(form.ownership as OwnershipQ[]).map((o, i) => (
          <div key={o.question} style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: i < 4 ? "1px solid rgba(244,241,232,0.07)" : "none" }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-dome-gold)", marginBottom: "0.5rem" }}>{o.question}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.5rem" }}>
              <div>
                <span style={label}>Before</span>
                <input value={o.before} onChange={e => setArr<OwnershipQ>("ownership", i, x => ({ ...x, before: e.target.value }))} style={input} />
              </div>
              <div>
                <span style={label}>After</span>
                <input value={o.after} onChange={e => setArr<OwnershipQ>("ownership", i, x => ({ ...x, after: e.target.value }))} style={input} />
              </div>
              <div>
                <span style={label}>Assessment</span>
                <select value={o.assessment} onChange={e => setArr<OwnershipQ>("ownership", i, x => ({ ...x, assessment: e.target.value as OwnershipQ["assessment"] }))} style={input}>
                  <option value="extractive">Extractive</option>
                  <option value="mixed">Mixed</option>
                  <option value="non-extractive">Non-extractive</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </fieldset>

      {/* 4 Bottom Lines */}
      <fieldset style={fieldset}>
        <legend style={legend}>4 Bottom Lines</legend>
        {(form.bottomLines as BottomLine[]).map((b, i) => (
          <div key={b.dimension} style={{ marginBottom: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "120px auto 1fr", gap: "0.75rem", alignItems: "start" }}>
              <p style={{ fontWeight: 700, color: "var(--color-dome-gold)", fontSize: "0.85rem", margin: "0.5rem 0 0" }}>{b.dimension}</p>
              <div>
                <span style={label}>Impact</span>
                <select value={b.impact} onChange={e => setArr<BottomLine>("bottomLines", i, x => ({ ...x, impact: e.target.value as BottomLine["impact"] }))} style={{ ...input, width: "130px" }}>
                  <option value="positive">Positive</option>
                  <option value="mixed">Mixed</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
              <div>
                <span style={label}>Description</span>
                <textarea value={b.description} onChange={e => setArr<BottomLine>("bottomLines", i, x => ({ ...x, description: e.target.value }))} rows={2} style={{ ...input, resize: "vertical" }} />
              </div>
            </div>
          </div>
        ))}
      </fieldset>

      {/* Custom Sections */}
      <fieldset style={fieldset}>
        <legend style={legend}>Additional Sections</legend>
        {(form.sections as Section[]).map((sec, i) => (
          <div key={i} style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(244,241,232,0.07)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <div><span style={label}>Eyebrow</span><input value={sec.eyebrow} onChange={e => setArr<Section>("sections", i, x => ({ ...x, eyebrow: e.target.value }))} style={input} /></div>
              <div><span style={label}>Heading</span><input value={sec.heading} onChange={e => setArr<Section>("sections", i, x => ({ ...x, heading: e.target.value }))} style={input} /></div>
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <span style={label}>Intro text (optional)</span>
              <input value={sec.description} onChange={e => setArr<Section>("sections", i, x => ({ ...x, description: e.target.value }))} style={input} />
            </div>
            {sec.items.map((item, j) => (
              <div key={j} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <input value={item.label} onChange={e => setArr<Section>("sections", i, x => ({ ...x, items: x.items.map((it, k) => k === j ? { ...it, label: e.target.value } : it) }))} placeholder="Label (optional)" style={input} />
                <input value={item.desc} onChange={e => setArr<Section>("sections", i, x => ({ ...x, items: x.items.map((it, k) => k === j ? { ...it, desc: e.target.value } : it) }))} placeholder="Description" style={input} />
                <button type="button" onClick={() => setArr<Section>("sections", i, x => ({ ...x, items: x.items.filter((_, k) => k !== j) }))} style={{ padding: "0 0.75rem", background: "none", border: "1px solid rgba(192,57,43,0.4)", borderRadius: "6px", color: "#c0392b", cursor: "pointer" }}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.35rem" }}>
              <button type="button" onClick={() => setArr<Section>("sections", i, x => ({ ...x, items: [...x.items, { label: "", desc: "" }] }))} className="btn btn--ghost btn--sm">+ Item</button>
              <button type="button" onClick={() => removeRow("sections", i)} style={{ fontSize: "0.75rem", color: "#c0392b", background: "none", border: "none", cursor: "pointer" }}>Remove section</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addRow<Section>("sections", { eyebrow: "", heading: "", description: "", items: [] })} className="btn btn--ghost btn--sm">+ Add section</button>
      </fieldset>

      {/* Recommendations */}
      <fieldset style={fieldset}>
        <legend style={legend}>Recommendations</legend>
        {form.recommendations.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input value={r} onChange={e => setArr<string>("recommendations", i, () => e.target.value)} style={{ ...input, flex: 1 }} placeholder="Specific recommendation…" />
            <button type="button" onClick={() => removeRow("recommendations", i)} style={{ padding: "0 0.75rem", background: "none", border: "1px solid rgba(192,57,43,0.4)", borderRadius: "6px", color: "#c0392b", cursor: "pointer" }}>×</button>
          </div>
        ))}
        <button type="button" onClick={() => addRow<string>("recommendations", "")} className="btn btn--ghost btn--sm">+ Add recommendation</button>
      </fieldset>

      {/* Sources */}
      <fieldset style={fieldset}>
        <legend style={legend}>Sources</legend>
        {form.sources.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input value={s} onChange={e => setArr<string>("sources", i, () => e.target.value)} style={{ ...input, flex: 1 }} placeholder="Citation…" />
            <button type="button" onClick={() => removeRow("sources", i)} style={{ padding: "0 0.75rem", background: "none", border: "1px solid rgba(192,57,43,0.4)", borderRadius: "6px", color: "#c0392b", cursor: "pointer" }}>×</button>
          </div>
        ))}
        <button type="button" onClick={() => addRow<string>("sources", "")} className="btn btn--ghost btn--sm">+ Add source</button>
      </fieldset>

      {/* Save */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button type="button" onClick={save} disabled={saving} className="btn btn--primary">
          {saving ? "Saving…" : id ? "Update case study" : "Create case study"}
        </button>
        <button type="button" onClick={() => router.push("/admin/case-studies")} className="btn btn--ghost">Cancel</button>
      </div>
    </div>
  );
}
