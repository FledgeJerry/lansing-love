"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  description: string; flowType: string; amount: string;
  fromEntityId: string; toEntityId: string; eventId: string;
  flowDate: string; flowDateEnd: string;
  isPublicCost: boolean; isPrivateGain: boolean;
  sourceTier: string; sourceNote: string; sourceUrl: string;
  isPublic: boolean;
};

const emptyForm = (): FormData => ({
  description: "", flowType: "", amount: "",
  fromEntityId: "", toEntityId: "", eventId: "",
  flowDate: "", flowDateEnd: "",
  isPublicCost: false, isPrivateGain: false,
  sourceTier: "RC", sourceNote: "", sourceUrl: "",
  isPublic: true,
});

const input: React.CSSProperties = { width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(244,241,232,0.15)", borderRadius: "6px", color: "var(--color-limestone)", fontFamily: "inherit", fontSize: "0.875rem" };
const label: React.CSSProperties = { fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", display: "block", marginBottom: "0.35rem" };
const fieldset: React.CSSProperties = { border: "1px solid rgba(244,241,232,0.1)", borderRadius: "8px", padding: "1.25rem", marginBottom: "1.5rem" };
const legend: React.CSSProperties = { padding: "0 0.5rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-dome-gold)" };
const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" };
const field: React.CSSProperties = { marginBottom: "1rem" };

interface Props {
  initial?: Partial<FormData>;
  id?: number;
}

const FLOW_TYPES = ["public_investment", "private_extraction", "public_cleanup", "sale", "subsidy", "tax_abatement", "developer_fee", "eminent_domain", "remediation", "grant", "penalty"];

export default function DollarFlowForm({ initial, id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...emptyForm(), ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [entities, setEntities] = useState<{ id: number; name: string }[]>([]);
  const [events, setEvents] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/history/entities").then((r) => r.json()).then((rows) => setEntities(rows.map((e: { id: number; name: string }) => ({ id: e.id, name: e.name }))));
    fetch("/api/admin/history/events").then((r) => r.json()).then((rows) => setEvents(rows.map((e: { id: number; title: string }) => ({ id: e.id, title: e.title }))));
  }, []);

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true); setError("");
    try {
      const url = id ? `/api/admin/history/flows/${id}` : "/api/admin/history/flows";
      const method = id ? "PUT" : "POST";
      const payload = {
        ...form,
        flowType: form.flowType || null,
        fromEntityId: form.fromEntityId ? Number(form.fromEntityId) : null,
        toEntityId: form.toEntityId ? Number(form.toEntityId) : null,
        eventId: form.eventId ? Number(form.eventId) : null,
        amountCents: form.amount.trim() ? Math.round(Number(form.amount) * 100) : null,
      };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Save failed"); }
      router.push("/admin/history/flows");
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
          <label style={label}>Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} style={{ ...input, minHeight: "80px" }} />
        </div>
        <div style={row2}>
          <div>
            <label style={label}>Flow type</label>
            <select value={form.flowType} onChange={(e) => set("flowType", e.target.value)} style={input}>
              <option value="">—</option>
              {FLOW_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={label}>Amount ($)</label><input value={form.amount} onChange={(e) => set("amount", e.target.value)} style={input} /></div>
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Parties</legend>
        <div style={row2}>
          <div>
            <label style={label}>From entity</label>
            <select value={form.fromEntityId} onChange={(e) => set("fromEntityId", e.target.value)} style={input}>
              <option value="">—</option>
              {entities.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>To entity</label>
            <select value={form.toEntityId} onChange={(e) => set("toEntityId", e.target.value)} style={input}>
              <option value="">—</option>
              {entities.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
        </div>
        <div style={field}>
          <label style={label}>Related event</label>
          <select value={form.eventId} onChange={(e) => set("eventId", e.target.value)} style={input}>
            <option value="">—</option>
            {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Temporal</legend>
        <div style={row2}>
          <div><label style={label}>Flow date</label><input type="date" value={form.flowDate} onChange={(e) => set("flowDate", e.target.value)} style={input} /></div>
          <div><label style={label}>Flow date end (optional)</label><input type="date" value={form.flowDateEnd} onChange={(e) => set("flowDateEnd", e.target.value)} style={input} /></div>
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Accounting classification</legend>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer" }}>
            <input type="checkbox" checked={form.isPublicCost} onChange={(e) => set("isPublicCost", e.target.checked)} />
            Public cost
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer" }}>
            <input type="checkbox" checked={form.isPrivateGain} onChange={(e) => set("isPrivateGain", e.target.checked)} />
            Private gain
          </label>
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Source</legend>
        <div style={row2}>
          <div>
            <label style={label}>Source tier</label>
            <select value={form.sourceTier} onChange={(e) => set("sourceTier", e.target.value)} style={input}>
              {["S", "FM", "RC", "RHN"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={label}>Source URL</label><input value={form.sourceUrl} onChange={(e) => set("sourceUrl", e.target.value)} style={input} /></div>
        </div>
        <div style={field}>
          <label style={label}>Source note</label>
          <input value={form.sourceNote} onChange={(e) => set("sourceNote", e.target.value)} style={input} />
        </div>
      </fieldset>

      <fieldset style={{ ...fieldset, borderColor: form.isPublic ? "rgba(244,241,232,0.1)" : "rgba(192,57,43,0.4)" }}>
        <legend style={{ ...legend, color: form.isPublic ? "var(--color-dome-gold)" : "#c0392b" }}>Visibility</legend>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}>
          <input type="checkbox" checked={form.isPublic} onChange={(e) => set("isPublic", e.target.checked)} />
          Public — visible on the site and counted in Accounting totals
        </label>
        {!form.isPublic && (
          <p style={{ fontSize: "0.8rem", color: "#c0392b", marginTop: "0.5rem", marginBottom: 0 }}>
            Hidden entirely from /history and excluded from all Accounting totals. Admin-only.
          </p>
        )}
      </fieldset>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button type="button" onClick={save} disabled={saving || !form.description} className="btn btn--primary">
          {saving ? "Saving…" : id ? "Update flow" : "Create flow"}
        </button>
        <button type="button" onClick={() => router.push("/admin/history/flows")} className="btn btn--ghost">Cancel</button>
      </div>
    </div>
  );
}
