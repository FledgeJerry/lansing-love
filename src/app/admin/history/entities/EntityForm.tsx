"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  entityType: string; name: string; altNames: string[]; description: string;
  address: string; city: string; state: string; zip: string; lat: string; lng: string; geoSource: string;
  activeStart: string; activeEnd: string;
  sourceTier: string; sourceNote: string; sourceUrl: string;
  domains: string[]; bookChapter: string;
  timelineEntry: boolean; mapPin: boolean; familyStory: boolean; isPublic: boolean;
};

const emptyForm = (): FormData => ({
  entityType: "person", name: "", altNames: [], description: "",
  address: "", city: "", state: "", zip: "", lat: "", lng: "", geoSource: "",
  activeStart: "", activeEnd: "",
  sourceTier: "RC", sourceNote: "", sourceUrl: "",
  domains: [], bookChapter: "",
  timelineEntry: false, mapPin: true, familyStory: false, isPublic: true,
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

export default function EntityForm({ initial, id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...emptyForm(), ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true); setError("");
    try {
      const url = id ? `/api/admin/history/entities/${id}` : "/api/admin/history/entities";
      const method = id ? "PUT" : "POST";
      const payload = {
        ...form,
        altNames: form.altNames.filter((s) => s.trim()),
        domains: form.domains.filter((s) => s.trim()),
        lat: form.lat.trim() ? Number(form.lat) : null,
        lng: form.lng.trim() ? Number(form.lng) : null,
      };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Save failed"); }
      router.push("/admin/history/entities");
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
        <div style={row2}>
          <div>
            <label style={label}>Entity type</label>
            <select value={form.entityType} onChange={(e) => set("entityType", e.target.value)} style={input}>
              {["person", "organization", "property", "institution", "media"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Name</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} style={input} placeholder="Full name…" />
          </div>
        </div>
        <div style={field}>
          <label style={label}>Alt names (comma-separated)</label>
          <input value={form.altNames.join(", ")} onChange={(e) => set("altNames", e.target.value.split(","))} style={input} />
        </div>
        <div style={field}>
          <label style={label}>Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} style={{ ...input, minHeight: "80px" }} />
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Geographic</legend>
        <div style={field}>
          <label style={label}>Address</label>
          <input value={form.address} onChange={(e) => set("address", e.target.value)} style={input} placeholder="e.g. 419 Cherry St" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div><label style={label}>City</label><input value={form.city} onChange={(e) => set("city", e.target.value)} style={input} /></div>
          <div><label style={label}>State</label><input value={form.state} onChange={(e) => set("state", e.target.value)} style={input} /></div>
          <div><label style={label}>Zip</label><input value={form.zip} onChange={(e) => set("zip", e.target.value)} style={input} /></div>
        </div>
        <div style={row2}>
          <div><label style={label}>Latitude</label><input value={form.lat} onChange={(e) => set("lat", e.target.value)} style={input} placeholder="42.7340573" /></div>
          <div><label style={label}>Longitude</label><input value={form.lng} onChange={(e) => set("lng", e.target.value)} style={input} placeholder="-84.5534370" /></div>
        </div>
        <div style={field}>
          <label style={label}>Geo source</label>
          <select value={form.geoSource} onChange={(e) => set("geoSource", e.target.value)} style={input}>
            <option value="">—</option>
            <option value="geocoded">geocoded (verified via geocoder)</option>
            <option value="approximate">approximate (hand-estimated)</option>
            <option value="manual">manual</option>
            <option value="google_geocode">google_geocode</option>
          </select>
        </div>
      </fieldset>

      <fieldset style={fieldset}>
        <legend style={legend}>Temporal</legend>
        <div style={row2}>
          <div><label style={label}>Active start</label><input type="date" value={form.activeStart} onChange={(e) => set("activeStart", e.target.value)} style={input} /></div>
          <div><label style={label}>Active end</label><input type="date" value={form.activeEnd} onChange={(e) => set("activeEnd", e.target.value)} style={input} /></div>
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
          <input value={form.domains.join(", ")} onChange={(e) => set("domains", e.target.value.split(","))} style={input} placeholder="housing, governance, …" />
        </div>
        <div style={field}>
          <label style={label}>Book chapter</label>
          <input value={form.bookChapter} onChange={(e) => set("bookChapter", e.target.value)} style={input} />
        </div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {([
            ["timelineEntry", "Show on Timeline"],
            ["mapPin", "Show on Map"],
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
            Hidden entirely from /history (Map, Timeline, Relationships, Accounting) and from any event/relationship that references it. Admin-only.
          </p>
        )}
      </fieldset>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button type="button" onClick={save} disabled={saving || !form.name} className="btn btn--primary">
          {saving ? "Saving…" : id ? "Update entity" : "Create entity"}
        </button>
        <button type="button" onClick={() => router.push("/admin/history/entities")} className="btn btn--ghost">Cancel</button>
      </div>
    </div>
  );
}
