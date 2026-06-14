"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Org = {
  id: string;
  sortOrder: number;
  name: string;
  area: string | null;
  status: string;
  website: string | null;
  facebook: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isHub: boolean;
};

const STATUSES = ["Active", "Registered", "Dormant", "Inactive"];

const BLANK: Omit<Org, "id" | "sortOrder"> = {
  name: "", area: "", status: "Registered", website: "", facebook: "",
  email: "", phone: "", address: "", notes: "", isHub: false,
};

function OrgForm({
  draft,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  draft: Omit<Org, "id" | "sortOrder">;
  onChange: (d: Omit<Org, "id" | "sortOrder">) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const f = (key: keyof typeof draft, label: string, placeholder?: string) => (
    <div className="form-group" style={{ margin: 0 }}>
      <label style={{ fontSize: "0.72rem" }}>{label}</label>
      <input
        value={(draft[key] as string) ?? ""}
        onChange={e => onChange({ ...draft, [key]: e.target.value })}
        placeholder={placeholder}
        style={{ fontSize: "0.82rem" }}
      />
    </div>
  );
  return (
    <div className="card--raised" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {f("name", "Name *")}
        {f("area", "Area", "e.g. South Lansing")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: "0.72rem" }}>Status</label>
          <select value={draft.status} onChange={e => onChange({ ...draft, status: e.target.value })} style={{ fontSize: "0.82rem", width: "auto" }}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {f("website", "Website", "https://...")}
        {f("facebook", "Facebook", "https://facebook.com/...")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
        {f("email", "Email")}
        {f("phone", "Phone")}
        {f("address", "Address")}
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontSize: "0.72rem" }}>Notes / Description</label>
        <textarea
          value={draft.notes ?? ""}
          onChange={e => onChange({ ...draft, notes: e.target.value })}
          rows={2}
          style={{ fontSize: "0.82rem", resize: "vertical", minHeight: "unset" }}
        />
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", cursor: "pointer" }}>
        <input type="checkbox" checked={draft.isHub} onChange={e => onChange({ ...draft, isHub: e.target.checked })} />
        Community hub (not a traditional neighborhood association)
      </label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={onSave} disabled={saving || !draft.name.trim()} className="btn btn--primary btn--sm">
          {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={onCancel} className="btn btn--ghost btn--sm">Cancel</button>
      </div>
    </div>
  );
}

export default function AdminNeighborhoodsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Omit<Org, "id" | "sortOrder">>(BLANK);
  const [adding, setAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<Omit<Org, "id" | "sortOrder">>(BLANK);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") { router.push("/"); return; }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN") return;
    fetch("/api/admin/neighborhood-orgs")
      .then(r => r.json())
      .then(d => { setOrgs(d); setLoading(false); });
  }, [session]);

  function startEdit(org: Org) {
    setAdding(false);
    setEditing(org.id);
    setEditDraft({ name: org.name, area: org.area, status: org.status, website: org.website, facebook: org.facebook, email: org.email, phone: org.phone, address: org.address, notes: org.notes, isHub: org.isHub });
  }

  async function saveEdit(id: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/neighborhood-orgs/${id}`, {
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
    if (!addDraft.name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/neighborhood-orgs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addDraft),
    });
    if (res.ok) {
      const created = await res.json();
      setOrgs([...orgs, created]);
      setAdding(false);
      setAddDraft(BLANK);
    }
    setSaving(false);
  }

  async function deleteOrg(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/neighborhood-orgs/${id}`, { method: "DELETE" });
    setOrgs(orgs.filter(o => o.id !== id));
  }

  const filtered = orgs.filter(o =>
    !search ||
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    (o.area ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (status === "loading" || loading) return <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>Neighborhood Organizations</h1>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>
            {orgs.length} total ·{" "}
            <Link href="/neighborhoods" target="_blank" style={{ color: "var(--color-dome-gold)" }}>View public page →</Link>
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/admin" className="btn btn--ghost btn--sm">← Admin</Link>
          <button onClick={() => { setAdding(true); setEditing(null); setAddDraft(BLANK); }} className="btn btn--primary btn--sm">
            + Add organization
          </button>
        </div>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-dome-gold)", marginBottom: "0.5rem" }}>New organization</p>
          <OrgForm draft={addDraft} onChange={setAddDraft} onSave={saveNew} onCancel={() => setAdding(false)} saving={saving} />
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or area…"
          style={{ maxWidth: "320px", fontSize: "0.85rem" }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(244,241,232,0.1)" }}>
              {["#", "Name", "Area", "Status", "Links", ""].map(h => (
                <th key={h} style={{ padding: "0.4rem 0.6rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(org => (
              editing === org.id ? (
                <tr key={org.id}>
                  <td colSpan={6} style={{ padding: "0.75rem 0" }}>
                    <OrgForm draft={editDraft} onChange={setEditDraft} onSave={() => saveEdit(org.id)} onCancel={() => setEditing(null)} saving={saving} />
                  </td>
                </tr>
              ) : (
                <tr key={org.id} style={{ borderBottom: "1px solid rgba(244,241,232,0.05)" }}>
                  <td style={{ padding: "0.5rem 0.6rem", color: "rgba(154,176,200,0.4)", fontSize: "0.72rem" }}>{org.sortOrder}</td>
                  <td style={{ padding: "0.5rem 0.6rem" }}>
                    <p style={{ fontWeight: 600, color: "var(--color-limestone)", margin: 0 }}>{org.name}</p>
                    {org.isHub && <span style={{ fontSize: "0.62rem", color: "var(--color-teal-accent)", fontWeight: 600 }}>HUB</span>}
                    {org.notes && <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", margin: "0.1rem 0 0", maxWidth: "280px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{org.notes}</p>}
                  </td>
                  <td style={{ padding: "0.5rem 0.6rem", color: "var(--color-steel-muted)", fontSize: "0.78rem", whiteSpace: "nowrap" }}>{org.area ?? "—"}</td>
                  <td style={{ padding: "0.5rem 0.6rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: org.status === "Active" ? "var(--color-teal-accent)" : org.status === "Dormant" ? "#E8C84A" : org.status === "Inactive" ? "#c0392b" : "var(--color-steel-muted)" }}>
                      {org.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.5rem 0.6rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {org.website && <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.7rem", color: "var(--color-dome-gold)" }}>Web</a>}
                      {org.facebook && <a href={org.facebook} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.7rem", color: "var(--color-steel-muted)" }}>FB</a>}
                      {org.email && <a href={`mailto:${org.email}`} style={{ fontSize: "0.7rem", color: "var(--color-steel-muted)" }}>Email</a>}
                    </div>
                  </td>
                  <td style={{ padding: "0.5rem 0.6rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => startEdit(org)} className="btn btn--ghost btn--sm" style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}>Edit</button>
                      <button onClick={() => deleteOrg(org.id, org.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(154,176,200,0.5)", fontSize: "0.72rem", fontFamily: "inherit", padding: "0.2rem 0.4rem" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginTop: "1rem" }}>No organizations match &ldquo;{search}&rdquo;</p>
      )}
    </div>
  );
}
