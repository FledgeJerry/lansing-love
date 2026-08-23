"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type EntityLink = { entityId: number; role: string };

type FormData = {
  title: string; description: string; eventType: string;
  eventDate: string; eventDateEnd: string; datePrecision: string;
  address: string; city: string; state: string; lat: string; lng: string;
  dollarAmount: string; dollarNote: string;
  sourceTier: string; sourceNote: string; sourceUrl: string;
  domains: string[];
  timelineVisible: boolean; mapVisible: boolean; significance: number;
  bookChapter: string; familyStory: boolean; era: string; isPublic: boolean;
  entityEvents: EntityLink[];
};

const emptyForm = (): FormData => ({
  title: "", description: "", eventType: "civic",
  eventDate: "", eventDateEnd: "", datePrecision: "day",
  address: "", city: "", state: "", lat: "", lng: "",
  dollarAmount: "", dollarNote: "",
  sourceTier: "RC", sourceNote: "", sourceUrl: "",
  domains: [],
  timelineVisible: true, mapVisible: true, significance: 3,
  bookChapter: "", familyStory: false, era: "", isPublic: true,
  entityEvents: [],
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

export default function EventForm({ initial, id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...emptyForm(), ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [entities, setEntities] = useState<{ id: number; name: string }[]>([]);
  const [newLinkEntityId, setNewLinkEntityId] = useState("");
  const [newLinkRole, setNewLinkRole] = useState("");

  useEffect(() => {
    fetch("/api/admin/history/entities").then((r) => r.json()).then((rows) => setEntities(rows.map((e: { id: number; name: string }) => ({ id: e.id, name: e.name }))));
  }, []);

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function addLink() {
    if (!newLinkEntityId || !newLinkRole.trim()) return;
    set("entityEvents", [...form.entityEvents, { entityId: Number(newLinkEntityId), role: newLinkRole.trim() }]);
    setNewLinkEntityId(""); setNewLinkRole("");
  }

  function removeLink(i: number) {
    set("entityEvents", form.entityEvents.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true); setError("");
    try {
      const url = id ? `/api/admin/history/events/${id}` : "/api/admin/history/events";
      const method = id ? "PUT" : "POST";
      const payload = {
        ...form,
        domains: form.domains.filter((s) => s.trim()),
        lat: form.lat.trim() ? Number(form.lat) : null,
        lng: form.lng.trim() ? Number(form.lng) : null,
        dollarAmountCents: form.dollarAmount.trim() ? Math.round(Number(form.dollarAmount) * 100) : null,
      };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Save failed"); }
      router.push("/admin/history/events");
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
          <input value={form.title} onChange={(e) => set("title", e.target.value)} style={input} />
        </div>
        <div style={field}>
          <label style={label}>Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} style={{ ...input, minHeight: "100px" }} />
        </div>
        <div style={row2}>
          <div>
            <label style={label}>Event type</label>
            <select value={form.eventType} onChange={(e) => set("eventType", e.target.value)} style={input}>
              {["civic", "family", "national", "environmental", "labor", "legal", "financial", "political", "physical"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Era</label>
            <select value={form.era} onChange={(e) => set("era", e.target.value)} style={input}>
              <option value="">—</option>
              {["colonial", "industrial_rise", "labor", "highway", "deindustrial", "repackaging", "current"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Temporal</legend>
        <div style={row2}>
          <div><label style={label}>Event date</label><input type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} style={input} /></div>
          <div><label style={label}>Event date end (optional)</label><input type="date" value={form.eventDateEnd} onChange={(e) => set("eventDateEnd", e.target.value)} style={input} /></div>
        </div>
        <div style={field}>
          <label style={label}>Date precision</label>
          <select value={form.datePrecision} onChange={(e) => set("datePrecision", e.target.value)} style={input}>
            {["day", "month", "year", "decade", "approximate"].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Geographic (optional)</legend>
        <div style={field}>
          <label style={label}>Address</label>
          <input value={form.address} onChange={(e) => set("address", e.target.value)} style={input} />
        </div>
        <div style={row2}>
          <div><label style={label}>City</label><input value={form.city} onChange={(e) => set("city", e.target.value)} style={input} /></div>
          <div><label style={label}>State</label><input value={form.state} onChange={(e) => set("state", e.target.value)} style={input} /></div>
        </div>
        <div style={row2}>
          <div><label style={label}>Latitude</label><input value={form.lat} onChange={(e) => set("lat", e.target.value)} style={input} /></div>
          <div><label style={label}>Longitude</label><input value={form.lng} onChange={(e) => set("lng", e.target.value)} style={input} /></div>
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Financial (optional)</legend>
        <div style={row2}>
          <div><label style={label}>Dollar amount ($)</label><input value={form.dollarAmount} onChange={(e) => set("dollarAmount", e.target.value)} style={input} placeholder="e.g. 40000000 for $40M" /></div>
          <div><label style={label}>Dollar note</label><input value={form.dollarNote} onChange={(e) => set("dollarNote", e.target.value)} style={input} /></div>
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Entities involved</legend>
        {form.entityEvents.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
            <span style={{ flex: 1, fontSize: "0.85rem" }}>{entities.find((e) => e.id === l.entityId)?.name ?? `#${l.entityId}`}</span>
            <span style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)" }}>{l.role}</span>
            <button type="button" onClick={() => removeLink(i)} style={{ padding: "0 0.75rem", background: "none", border: "1px solid rgba(192,57,43,0.4)", borderRadius: "6px", color: "#c0392b", cursor: "pointer" }}>×</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <select value={newLinkEntityId} onChange={(e) => setNewLinkEntityId(e.target.value)} style={{ ...input, flex: 2 }}>
            <option value="">Select entity…</option>
            {entities.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <input value={newLinkRole} onChange={(e) => setNewLinkRole(e.target.value)} placeholder="role, e.g. victim" style={{ ...input, flex: 1 }} />
          <button type="button" onClick={addLink} className="btn btn--ghost btn--sm">+ Add</button>
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

      <fieldset style={fieldset}>
        <legend style={legend}>Narrative &amp; visualization</legend>
        <div style={field}>
          <label style={label}>Domains (comma-separated)</label>
          <input value={form.domains.join(", ")} onChange={(e) => set("domains", e.target.value.split(","))} style={input} />
        </div>
        <div style={row2}>
          <div><label style={label}>Significance (1–5)</label><input type="number" min={1} max={5} value={form.significance} onChange={(e) => set("significance", Number(e.target.value))} style={input} /></div>
          <div><label style={label}>Book chapter</label><input value={form.bookChapter} onChange={(e) => set("bookChapter", e.target.value)} style={input} /></div>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {([
            ["timelineVisible", "Show on Timeline"],
            ["mapVisible", "Show on Map"],
            ["familyStory", "Family story"],
          ] as const).map(([k, l]) => (
            <label key={k} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer" }}>
              <input type="checkbox" checked={form[k]} onChange={(e) => set(k, e.target.checked)} />
              {l}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset style={{ ...fieldset, borderColor: form.isPublic ? "rgba(244,241,232,0.1)" : "rgba(192,57,43,0.4)" }}>
        <legend style={{ ...legend, color: form.isPublic ? "var(--color-dome-gold)" : "#c0392b" }}>Visibility</legend>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}>
          <input type="checkbox" checked={form.isPublic} onChange={(e) => set("isPublic", e.target.checked)} />
          Public — visible on the site
        </label>
        {!form.isPublic && (
          <p style={{ fontSize: "0.8rem", color: "#c0392b", marginTop: "0.5rem", marginBottom: 0 }}>
            Hidden entirely from /history (Timeline, Map, Accounting). Admin-only.
          </p>
        )}
      </fieldset>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button type="button" onClick={save} disabled={saving || !form.title} className="btn btn--primary">
          {saving ? "Saving…" : id ? "Update event" : "Create event"}
        </button>
        <button type="button" onClick={() => router.push("/admin/history/events")} className="btn btn--ghost">Cancel</button>
      </div>
    </div>
  );
}
