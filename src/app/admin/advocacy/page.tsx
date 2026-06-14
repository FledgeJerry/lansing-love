"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Entry = {
  id: string;
  entryType: string;
  summary: string;
  detail: string | null;
  who: string | null;
  date: string;
  published: boolean;
};

const TYPES = [
  { value: "council_contact",  label: "Council member engaged" },
  { value: "testimony",        label: "Testimony appearance" },
  { value: "endorsement",      label: "Endorsement given" },
  { value: "anchor_meeting",   label: "Anchor institution meeting" },
];

const TYPE_LABELS: Record<string, string> = Object.fromEntries(TYPES.map(t => [t.value, t.label]));

const TYPE_COLOR: Record<string, string> = {
  council_contact: "var(--color-teal-accent)",
  testimony:       "var(--color-dome-gold)",
  endorsement:     "#a78bfa",
  anchor_meeting:  "var(--color-steel-muted)",
};

const BLANK = { entryType: "council_contact", summary: "", detail: "", who: "", date: new Date().toISOString().split("T")[0], published: true };

type Draft = typeof BLANK;

function EntryForm({ draft, onChange, onSave, onCancel, saving }: {
  draft: Draft;
  onChange: (d: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const whoPlaceholder: Record<string, string> = {
    council_contact: "Council member name",
    testimony:       "Body (e.g. City Council, BWL board)",
    endorsement:     "Candidate name",
    anchor_meeting:  "Institution name",
  };
  return (
    <div className="card--raised" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: "0.72rem" }}>Type</label>
          <select value={draft.entryType} onChange={e => onChange({ ...draft, entryType: e.target.value })} style={{ fontSize: "0.85rem" }}>
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: "0.72rem" }}>Date</label>
          <input type="date" value={draft.date} onChange={e => onChange({ ...draft, date: e.target.value })} style={{ fontSize: "0.85rem" }} />
        </div>
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontSize: "0.72rem" }}>Who <span style={{ color: "var(--color-text-muted)" }}>({whoPlaceholder[draft.entryType]})</span></label>
        <input value={draft.who} onChange={e => onChange({ ...draft, who: e.target.value })} placeholder={whoPlaceholder[draft.entryType]} style={{ fontSize: "0.85rem" }} />
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontSize: "0.72rem" }}>Summary <span style={{ color: "var(--color-text-muted)" }}>(shown publicly)</span></label>
        <input value={draft.summary} onChange={e => onChange({ ...draft, summary: e.target.value })} placeholder="One-line description shown on the dashboard…" style={{ fontSize: "0.85rem" }} />
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontSize: "0.72rem" }}>Detail <span style={{ color: "var(--color-text-muted)" }}>(admin only — context, outcome, next steps)</span></label>
        <textarea value={draft.detail} onChange={e => onChange({ ...draft, detail: e.target.value })} rows={2} style={{ fontSize: "0.82rem", resize: "vertical", minHeight: "unset" }} />
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", cursor: "pointer" }}>
        <input type="checkbox" checked={draft.published} onChange={e => onChange({ ...draft, published: e.target.checked })} />
        Published (visible on public dashboard)
      </label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={onSave} disabled={saving || !draft.summary.trim()} className="btn btn--primary btn--sm">
          {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={onCancel} className="btn btn--ghost btn--sm">Cancel</button>
      </div>
    </div>
  );
}

export default function AdminAdvocacyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<Draft>(BLANK);
  const [editing, setEditing] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(BLANK);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") { router.push("/"); return; }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN") return;
    fetch("/api/admin/advocacy").then(r => r.json()).then(d => { setEntries(d); setLoading(false); });
  }, [session]);

  async function saveNew() {
    if (!addDraft.summary.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/advocacy", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(addDraft),
    });
    if (res.ok) {
      const created: Entry = await res.json();
      setEntries([created, ...entries]);
      setAdding(false);
      setAddDraft(BLANK);
    }
    setSaving(false);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/advocacy/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editDraft),
    });
    if (res.ok) {
      const updated: Entry = await res.json();
      setEntries(entries.map(e => e.id === id ? updated : e));
      setEditing(null);
    }
    setSaving(false);
  }

  async function deleteEntry(id: string) {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/admin/advocacy/${id}`, { method: "DELETE" });
    setEntries(entries.filter(e => e.id !== id));
  }

  // Summary counts
  const counts = {
    council_contact: new Set(entries.filter(e => e.published && e.entryType === "council_contact").map(e => e.who)).size,
    testimony:       entries.filter(e => e.published && e.entryType === "testimony").length,
    endorsement:     entries.filter(e => e.published && e.entryType === "endorsement").length,
    anchor_meeting:  new Set(entries.filter(e => e.published && e.entryType === "anchor_meeting").map(e => e.who)).size,
  };

  if (status === "loading" || loading) return <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>Civic Advocacy Log</h1>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>
            {entries.length} entries — shows on the{" "}
            <Link href="/#" style={{ color: "var(--color-dome-gold)" }}>governance dashboard → Civic Advocacy tab</Link>
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/admin" className="btn btn--ghost btn--sm">← Admin</Link>
          <button onClick={() => { setAdding(true); setAddDraft(BLANK); setEditing(null); }} className="btn btn--primary btn--sm">
            + Log entry
          </button>
        </div>
      </div>

      {/* Live counts preview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Council members engaged", value: counts.council_contact },
          { label: "Testimony appearances",   value: counts.testimony },
          { label: "Endorsements given",      value: counts.endorsement },
          { label: "Anchor institutions",     value: counts.anchor_meeting },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(244,241,232,0.1)", borderRadius: "8px", padding: "0.875rem 1rem" }}>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: value > 0 ? "var(--color-dome-gold)" : "rgba(154,176,200,0.3)", lineHeight: 1, margin: 0 }}>{value}</p>
            <p style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.25rem" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-dome-gold)", marginBottom: "0.5rem" }}>New entry</p>
          <EntryForm draft={addDraft} onChange={setAddDraft} onSave={saveNew} onCancel={() => setAdding(false)} saving={saving} />
        </div>
      )}

      {/* Log */}
      {entries.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No entries yet. Log your first council contact, testimony, or meeting above.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {entries.map(entry => (
            editing === entry.id ? (
              <EntryForm
                key={entry.id}
                draft={editDraft}
                onChange={setEditDraft}
                onSave={() => saveEdit(entry.id)}
                onCancel={() => setEditing(null)}
                saving={saving}
              />
            ) : (
              <div key={entry.id} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.02)", border: `1px solid rgba(244,241,232,${entry.published ? "0.08" : "0.04"})`, borderRadius: "8px", alignItems: "flex-start", opacity: entry.published ? 1 : 0.6 }}>
                <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: TYPE_COLOR[entry.entryType] ?? "var(--color-steel-muted)", flexShrink: 0, marginTop: "0.35rem" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", flexWrap: "wrap", marginBottom: "0.1rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: TYPE_COLOR[entry.entryType], textTransform: "uppercase", letterSpacing: "0.06em" }}>{TYPE_LABELS[entry.entryType]}</span>
                    {entry.who && <span style={{ fontSize: "0.72rem", color: "var(--color-limestone)", fontWeight: 600 }}>{entry.who}</span>}
                    <span style={{ fontSize: "0.68rem", color: "rgba(154,176,200,0.5)" }}>
                      {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {!entry.published && <span style={{ fontSize: "0.62rem", color: "rgba(154,176,200,0.4)", fontStyle: "italic" }}>draft</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-limestone)" }}>{entry.summary}</p>
                  {entry.detail && <p style={{ margin: "0.15rem 0 0", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{entry.detail}</p>}
                </div>
                <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                  <button onClick={() => { setEditing(entry.id); setAdding(false); setEditDraft({ entryType: entry.entryType, summary: entry.summary, detail: entry.detail ?? "", who: entry.who ?? "", date: entry.date.split("T")[0], published: entry.published }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-dome-gold)", fontSize: "0.72rem", fontFamily: "inherit" }}>Edit</button>
                  <button onClick={() => deleteEntry(entry.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(154,176,200,0.3)", fontSize: "0.72rem", fontFamily: "inherit" }}>Del</button>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
