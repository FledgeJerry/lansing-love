"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Org = {
  id: string;
  name: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  rawInput: string;
  notes: string | null;
  isCoop: boolean;
  isUnion: boolean;
  isWorkerOwned: boolean;
  offersLivingWage: boolean;
  ownsHousing: boolean;
  occupantCount: number | null;
  employeeCount: number | null;
  published: boolean;
  createdAt: string;
};

type Draft = Omit<Org, "id" | "createdAt">;

const BLANK: Draft = {
  name: "", website: "", email: "", phone: "", rawInput: "", notes: "",
  isCoop: false, isUnion: false, isWorkerOwned: false, offersLivingWage: false, ownsHousing: false,
  occupantCount: null, employeeCount: null, published: false,
};

const FLAGS: { key: keyof Draft; label: string }[] = [
  { key: "isCoop", label: "Co-op" },
  { key: "isUnion", label: "Union" },
  { key: "isWorkerOwned", label: "Worker-owned" },
  { key: "offersLivingWage", label: "Living wage" },
  { key: "ownsHousing", label: "Owns housing" },
];

function OrgForm({ draft, onChange, onSave, onCancel, onExtract, extracting, saving }: {
  draft: Draft; onChange: (d: Draft) => void; onSave: () => void; onCancel: () => void;
  onExtract: () => void; extracting: boolean; saving: boolean;
}) {
  const f = (key: "name" | "website" | "email" | "phone", label: string, placeholder?: string) => (
    <div className="form-group" style={{ margin: 0 }}>
      <label style={{ fontSize: "0.72rem" }}>{label}</label>
      <input value={draft[key] ?? ""} onChange={e => onChange({ ...draft, [key]: e.target.value })} placeholder={placeholder} style={{ fontSize: "0.82rem" }} />
    </div>
  );
  return (
    <div className="card--raised" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontSize: "0.72rem" }}>Paste an email, website text, or notes — then extract</label>
        <textarea
          value={draft.rawInput}
          onChange={e => onChange({ ...draft, rawInput: e.target.value })}
          rows={4}
          placeholder="Paste whatever you have about this org…"
          style={{ fontSize: "0.82rem", resize: "vertical", minHeight: "unset" }}
        />
        <button type="button" onClick={onExtract} disabled={extracting || !draft.rawInput.trim()} className="btn btn--primary btn--sm" style={{ marginTop: "0.5rem" }}>
          {extracting ? "Extracting…" : "Extract with AI"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {f("name", "Name *")}
        {f("website", "Website", "https://...")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {f("email", "Email")}
        {f("phone", "Phone")}
      </div>

      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontSize: "0.72rem" }}>Notes (shown publicly when published)</label>
        <textarea value={draft.notes ?? ""} onChange={e => onChange({ ...draft, notes: e.target.value })} rows={2} style={{ fontSize: "0.82rem", resize: "vertical", minHeight: "unset" }} />
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {FLAGS.map(({ key, label }) => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", cursor: "pointer" }}>
            <input type="checkbox" checked={!!draft[key]} onChange={e => onChange({ ...draft, [key]: e.target.checked })} />
            {label}
          </label>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: "0.72rem" }}>People housed (if owns housing)</label>
          <input type="number" value={draft.occupantCount ?? ""} onChange={e => onChange({ ...draft, occupantCount: e.target.value ? Number(e.target.value) : null })} style={{ fontSize: "0.82rem" }} />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: "0.72rem" }}>Employees / members</label>
          <input type="number" value={draft.employeeCount ?? ""} onChange={e => onChange({ ...draft, employeeCount: e.target.value ? Number(e.target.value) : null })} style={{ fontSize: "0.82rem" }} />
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", cursor: "pointer" }}>
        <input type="checkbox" checked={draft.published} onChange={e => onChange({ ...draft, published: e.target.checked })} />
        Published — counts toward public stats and directory
      </label>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={onSave} disabled={saving || !draft.name.trim() || !draft.rawInput.trim()} className="btn btn--primary btn--sm">
          {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={onCancel} className="btn btn--ghost btn--sm">Cancel</button>
      </div>
    </div>
  );
}

export default function AdminExternalOrgsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(BLANK);
  const [adding, setAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<Draft>(BLANK);
  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") { router.push("/"); return; }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN") return;
    fetch("/api/admin/external-orgs")
      .then(r => r.json())
      .then(d => { setOrgs(d); setLoading(false); });
  }, [session]);

  async function extract(draft: Draft, setDraft: (d: Draft) => void) {
    setExtracting(true);
    setExtractError("");
    try {
      const res = await fetch("/api/admin/external-orgs/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: draft.rawInput }),
      });
      const data = await res.json();
      if (!res.ok) { setExtractError(data.error ?? "Extraction failed"); return; }
      setDraft({
        ...draft,
        name: data.name || draft.name,
        website: data.website || draft.website,
        email: data.email || draft.email,
        phone: data.phone || draft.phone,
        notes: data.notes || draft.notes,
        isCoop: !!data.isCoop,
        isUnion: !!data.isUnion,
        isWorkerOwned: !!data.isWorkerOwned,
        offersLivingWage: !!data.offersLivingWage,
        ownsHousing: !!data.ownsHousing,
        occupantCount: data.occupantCount ?? draft.occupantCount,
        employeeCount: data.employeeCount ?? draft.employeeCount,
      });
    } catch {
      setExtractError("Network error during extraction");
    }
    setExtracting(false);
  }

  function startEdit(org: Org) {
    setAdding(false);
    setEditing(org.id);
    setEditDraft({ ...org });
  }

  async function saveEdit(id: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/external-orgs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDraft),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrgs(orgs.map(o => o.id === id ? updated : o));
      setEditing(null);
    }
    setSaving(false);
  }

  async function saveNew() {
    if (!addDraft.name.trim() || !addDraft.rawInput.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/external-orgs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addDraft),
    });
    if (res.ok) {
      const created = await res.json();
      setOrgs([created, ...orgs]);
      setAdding(false);
      setAddDraft(BLANK);
    }
    setSaving(false);
  }

  async function togglePublish(org: Org) {
    const res = await fetch(`/api/admin/external-orgs/${org.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !org.published }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrgs(orgs.map(o => o.id === org.id ? updated : o));
    }
  }

  async function deleteOrg(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/external-orgs/${id}`, { method: "DELETE" });
    setOrgs(orgs.filter(o => o.id !== id));
  }

  if (status === "loading" || loading) return <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>;

  const publishedCount = orgs.filter(o => o.published).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>Independent Co-ops, Unions &amp; Living-Wage Employers</h1>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>
            {orgs.length} total · {publishedCount} published ·{" "}
            <Link href="/directory" target="_blank" style={{ color: "var(--color-dome-gold)" }}>View public directory →</Link>
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/admin" className="btn btn--ghost btn--sm">← Admin</Link>
          <button onClick={() => { setAdding(true); setEditing(null); setAddDraft(BLANK); setExtractError(""); }} className="btn btn--primary btn--sm">
            + Add organization
          </button>
        </div>
      </div>

      {adding && (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-dome-gold)", marginBottom: "0.5rem" }}>New organization</p>
          {extractError && <p style={{ color: "#c0392b", fontSize: "0.78rem", marginBottom: "0.5rem" }}>{extractError}</p>}
          <OrgForm draft={addDraft} onChange={setAddDraft} onSave={saveNew} onCancel={() => setAdding(false)} onExtract={() => extract(addDraft, setAddDraft)} extracting={extracting} saving={saving} />
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {orgs.map(org => (
          editing === org.id ? (
            <div key={org.id}>
              <OrgForm draft={editDraft} onChange={setEditDraft} onSave={() => saveEdit(org.id)} onCancel={() => setEditing(null)} onExtract={() => extract(editDraft, setEditDraft)} extracting={extracting} saving={saving} />
            </div>
          ) : (
            <div key={org.id} className="card" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <p style={{ fontWeight: 600, color: "var(--color-limestone)", margin: 0 }}>{org.name}</p>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "4px", background: org.published ? "rgba(74,155,142,0.15)" : "rgba(154,176,200,0.15)", color: org.published ? "var(--color-teal-accent)" : "var(--color-steel-muted)" }}>
                    {org.published ? "PUBLISHED" : "DRAFT"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                  {FLAGS.filter(({ key }) => org[key]).map(({ key, label }) => (
                    <span key={key} style={{ fontSize: "0.65rem", color: "var(--color-steel-muted)", border: "1px solid rgba(244,241,232,0.15)", borderRadius: "4px", padding: "0.1rem 0.4rem" }}>{label}</span>
                  ))}
                  {org.ownsHousing && org.occupantCount != null && (
                    <span style={{ fontSize: "0.65rem", color: "var(--color-steel-muted)" }}>{org.occupantCount} housed</span>
                  )}
                </div>
                {org.notes && <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", margin: "0.4rem 0 0", maxWidth: "560px" }}>{org.notes}</p>}
                <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.4rem" }}>
                  {org.website && <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.7rem", color: "var(--color-dome-gold)" }}>Web</a>}
                  {org.email && <a href={`mailto:${org.email}`} style={{ fontSize: "0.7rem", color: "var(--color-steel-muted)" }}>Email</a>}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                <button onClick={() => togglePublish(org)} className="btn btn--ghost btn--sm" style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}>
                  {org.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => startEdit(org)} className="btn btn--ghost btn--sm" style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}>Edit</button>
                <button onClick={() => deleteOrg(org.id, org.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(154,176,200,0.5)", fontSize: "0.72rem", fontFamily: "inherit", padding: "0.2rem 0.4rem" }}>Delete</button>
              </div>
            </div>
          )
        ))}
        {orgs.length === 0 && <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No organizations added yet.</p>}
      </div>
    </div>
  );
}
