"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Option = { id: string; label: string };
type Question = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  closeAt: string | null;
  createdAt: string;
  submittedBy: { name: string | null; email: string };
  options: Option[];
  _count?: { predictions: number };
};
type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN" | "RESOLVER";
  createdAt: string;
};

type Tab = "pending" | "all" | "users";

const STATUS_OPTIONS = ["PENDING", "ACTIVE", "CLOSED", "RESOLVED", "ARCHIVED"] as const;

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pending");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Question> & { optionLabels?: string[] }>({});

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") { router.push("/"); return; }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN") return;
    setLoading(true);
    if (tab === "users") {
      fetch("/api/admin/users")
        .then((r) => r.json())
        .then((d) => { setUsers(d); setLoading(false); });
    } else {
      const qs = tab === "pending" ? "PENDING" : "ALL";
      fetch(`/api/admin/questions?status=${qs}`)
        .then((r) => r.json())
        .then((d) => { setQuestions(d); setLoading(false); });
    }
  }, [tab, session]);

  async function approveQuestion(id: string, closeAt: string) {
    await fetch(`/api/admin/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", closeAt: closeAt || null }),
    });
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  }

  async function rejectQuestion(id: string) {
    if (!confirm("Delete this question permanently?")) return;
    await fetch(`/api/admin/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject" }),
    });
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  }

  function startEdit(q: Question) {
    setEditing(q.id);
    setEditDraft({
      title: q.title,
      description: q.description ?? "",
      category: q.category ?? "",
      status: q.status,
      closeAt: q.closeAt ? q.closeAt.split("T")[0] : "",
      optionLabels: q.options.map((o) => o.label),
    });
  }

  async function saveEdit(id: string) {
    await fetch(`/api/admin/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "edit",
        title: editDraft.title,
        description: editDraft.description || null,
        category: editDraft.category || null,
        status: editDraft.status,
        closeAt: editDraft.closeAt || null,
        options: editDraft.optionLabels?.filter((l) => l.trim()),
      }),
    });
    setEditing(null);
    // Refresh list
    const qs = tab === "pending" ? "PENDING" : "ALL";
    fetch(`/api/admin/questions?status=${qs}`)
      .then((r) => r.json())
      .then(setQuestions);
  }

  async function setUserRole(id: string, role: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((us) => us.map((u) => (u.id === id ? { ...u, role: updated.role } : u)));
    }
  }

  if (status === "loading") return <p className="text-gray-400">Loading…</p>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Admin</h1>
        <Link href="/admin/agenda" className="btn btn--primary btn--sm">
          Import from agenda
        </Link>
      </div>

      <div className="tabs">
        <button className={`tab-btn${tab === "pending" ? " active" : ""}`} onClick={() => setTab("pending")}>Pending</button>
        <button className={`tab-btn${tab === "all" ? " active" : ""}`} onClick={() => setTab("all")}>All Questions</button>
        <button className={`tab-btn${tab === "users" ? " active" : ""}`} onClick={() => setTab("users")}>Users</button>
      </div>

      {loading && <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>}

      {/* PENDING TAB */}
      {!loading && tab === "pending" && (
        <>
          {questions.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)" }}>No pending questions.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {questions.map((q) => (
                <PendingCard
                  key={q.id}
                  question={q}
                  onApprove={approveQuestion}
                  onReject={rejectQuestion}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ALL QUESTIONS TAB */}
      {!loading && tab === "all" && (
        <>
          {questions.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)" }}>No questions yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {questions.map((q) =>
                editing === q.id ? (
                  <EditCard
                    key={q.id}
                    draft={editDraft}
                    onChange={setEditDraft}
                    onSave={() => saveEdit(q.id)}
                    onCancel={() => setEditing(null)}
                  />
                ) : (
                  <QuestionRow
                    key={q.id}
                    question={q}
                    onEdit={() => startEdit(q)}
                    onReject={rejectQuestion}
                  />
                )
              )}
            </div>
          )}
        </>
      )}

      {/* USERS TAB */}
      {!loading && tab === "users" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="ll-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ color: "var(--color-limestone)" }}>{u.name ?? "—"}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => setUserRole(u.id, e.target.value)}
                      disabled={u.id === session?.user.id}
                      style={{ width: "auto" }}
                    >
                      <option value="USER">User</option>
                      <option value="RESOLVER">Resolver</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td style={{ fontSize: "0.8rem" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function PendingCard({
  question: q,
  onApprove,
  onReject,
}: {
  question: Question;
  onApprove: (id: string, closeAt: string) => void;
  onReject: (id: string) => void;
}) {
  const [closeAt, setCloseAt] = useState("");
  return (
    <div className="card">
      {q.category && <span className="eyebrow">{q.category}</span>}
      <p style={{ fontFamily: "var(--font-serif)", color: "var(--color-limestone)", marginBottom: "0.4rem" }}>{q.title}</p>
      {q.description && <p style={{ fontSize: "0.875rem", marginBottom: "0.4rem" }}>{q.description}</p>}
      <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>
        Submitted by {q.submittedBy.name ?? q.submittedBy.email} · {new Date(q.createdAt).toLocaleDateString()}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
        {q.options.map((o) => (
          <span key={o.id} className="badge badge--muted">{o.label}</span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label style={{ margin: 0, whiteSpace: "nowrap" }}>Close date:</label>
          <input type="date" value={closeAt} onChange={(e) => setCloseAt(e.target.value)} style={{ width: "auto" }} />
        </div>
        <button onClick={() => onApprove(q.id, closeAt)} className="btn btn--primary btn--sm">Approve</button>
        <button onClick={() => onReject(q.id)} className="btn btn--danger btn--sm">Reject</button>
      </div>
    </div>
  );
}

function QuestionRow({
  question: q,
  onEdit,
  onReject,
}: {
  question: Question;
  onEdit: () => void;
  onReject: (id: string) => void;
}) {
  const badgeClass: Record<string, string> = {
    PENDING: "badge--gold",
    ACTIVE: "badge--blue",
    CLOSED: "badge--muted",
    RESOLVED: "badge--teal",
    ARCHIVED: "badge--muted",
  };
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "0.875rem 1.25rem" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: "var(--color-limestone)", fontWeight: 500, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{q.title}</p>
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", margin: 0 }}>
          {q._count?.predictions ?? 0} predictions · {new Date(q.createdAt).toLocaleDateString()}
        </p>
      </div>
      <span className={`badge ${badgeClass[q.status] ?? "badge--muted"}`}>{q.status}</span>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button onClick={onEdit} className="btn btn--ghost btn--sm">Edit</button>
        <button onClick={() => onReject(q.id)} className="btn btn--danger btn--sm">Delete</button>
      </div>
    </div>
  );
}

type EditDraft = Partial<Question> & { optionLabels?: string[] };

function EditCard({
  draft,
  onChange,
  onSave,
  onCancel,
}: {
  draft: EditDraft;
  onChange: (d: EditDraft) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="card--raised" style={{ borderColor: "var(--color-river-blue)", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="form-group" style={{ margin: 0 }}>
        <label>Title</label>
        <input value={draft.title ?? ""} onChange={(e) => onChange({ ...draft, title: e.target.value })} />
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label>Description</label>
        <textarea value={draft.description ?? ""} onChange={(e) => onChange({ ...draft, description: e.target.value })} rows={2} style={{ minHeight: "unset" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "1rem" }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label>Category</label>
          <input value={draft.category ?? ""} onChange={(e) => onChange({ ...draft, category: e.target.value })} />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label>Status</label>
          <select value={draft.status ?? "ACTIVE"} onChange={(e) => onChange({ ...draft, status: e.target.value })} style={{ width: "auto" }}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label>Close date</label>
          <input type="date" value={draft.closeAt ?? ""} onChange={(e) => onChange({ ...draft, closeAt: e.target.value })} style={{ width: "auto" }} />
        </div>
      </div>
      <div>
        <label>Options</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.4rem" }}>
          {(draft.optionLabels ?? []).map((lbl, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input value={lbl} onChange={(e) => { const u = [...(draft.optionLabels ?? [])]; u[i] = e.target.value; onChange({ ...draft, optionLabels: u }); }} style={{ flex: 1 }} />
              {(draft.optionLabels?.length ?? 0) > 2 && (
                <button type="button" onClick={() => onChange({ ...draft, optionLabels: draft.optionLabels?.filter((_, idx) => idx !== i) })}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "1.25rem", lineHeight: 1 }}>×</button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={() => onChange({ ...draft, optionLabels: [...(draft.optionLabels ?? []), ""] })}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-dome-gold)", fontSize: "0.85rem", fontFamily: "var(--font-sans)", padding: 0, marginTop: "0.4rem" }}>
          + Add option
        </button>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={onSave} className="btn btn--primary btn--sm">Save</button>
        <button onClick={onCancel} className="btn btn--ghost btn--sm">Cancel</button>
      </div>
    </div>
  );
}
