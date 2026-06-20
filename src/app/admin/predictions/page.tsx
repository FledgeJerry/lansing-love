"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Option   = { id: string; label: string };
type Question = {
  id: string; title: string; description: string | null; category: string | null;
  sourceUrl: string | null; status: string; closeAt: string | null; createdAt: string;
  submittedBy: { name: string | null; email: string };
  options: Option[];
  _count?: { predictions: number };
};
type Tab = "pending" | "resolve" | "all";
const STATUS_OPTIONS = ["PENDING", "ACTIVE", "CLOSED", "RESOLVED", "ARCHIVED"] as const;

export default function AdminPredictionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pending");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Question> & { optionLabels?: string[] }>({});
  const [resolveSelections, setResolveSelections] = useState<Record<string, string>>({});
  const [resolveNotes, setResolveNotes] = useState<Record<string, string>>({});
  const [resolving, setResolving] = useState(false);
  const [resolvedCount, setResolvedCount] = useState<number | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") { router.push("/"); return; }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN") return;
    setLoading(true);
    if (tab === "resolve") {
      fetch("/api/admin/questions?status=ALL")
        .then(r => r.json())
        .then((d: Question[]) => {
          const now = new Date();
          setQuestions(d.filter(q =>
            q.status === "CLOSED" ||
            (q.status === "ACTIVE" && q.closeAt && new Date(q.closeAt) < now)
          ));
          setResolveSelections({});
          setResolveNotes({});
          setResolvedCount(null);
          setLoading(false);
        });
    } else {
      const qs = tab === "pending" ? "PENDING" : "ALL";
      fetch(`/api/admin/questions?status=${qs}`)
        .then(r => r.json())
        .then(d => { setQuestions(d); setLoading(false); });
    }
  }, [tab, session]);

  async function approveQuestion(id: string, closeAt: string) {
    await fetch(`/api/admin/questions/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", closeAt: closeAt || null }),
    });
    setQuestions(qs => qs.filter(q => q.id !== id));
  }

  async function rejectQuestion(id: string) {
    if (!confirm("Delete this question permanently?")) return;
    await fetch(`/api/admin/questions/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject" }),
    });
    setQuestions(qs => qs.filter(q => q.id !== id));
  }

  function startEdit(q: Question) {
    setEditing(q.id);
    setEditDraft({
      title: q.title, description: q.description ?? "", category: q.category ?? "",
      sourceUrl: q.sourceUrl ?? "", status: q.status,
      closeAt: q.closeAt ? q.closeAt.split("T")[0] : "",
      optionLabels: q.options.map(o => o.label),
    });
  }

  async function saveEdit(id: string) {
    await fetch(`/api/admin/questions/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "edit", title: editDraft.title, description: editDraft.description || null,
        category: editDraft.category || null, sourceUrl: editDraft.sourceUrl || null,
        status: editDraft.status, closeAt: editDraft.closeAt || null,
        options: editDraft.optionLabels?.filter(l => l.trim()),
      }),
    });
    setEditing(null);
    const qs = tab === "pending" ? "PENDING" : "ALL";
    fetch(`/api/admin/questions?status=${qs}`).then(r => r.json()).then(setQuestions);
  }

  async function bulkResolve() {
    const resolutions = Object.entries(resolveSelections)
      .filter(([, optionId]) => optionId)
      .map(([questionId, optionId]) => ({ questionId, optionId, notes: resolveNotes[questionId] || undefined }));
    if (resolutions.length === 0) return;
    setResolving(true);
    const res = await fetch("/api/admin/questions/bulk-resolve", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolutions }),
    });
    setResolving(false);
    if (res.ok) {
      const data = await res.json();
      setResolvedCount(data.resolved);
      setQuestions(qs => qs.filter(q => !resolveSelections[q.id]));
      setResolveSelections({});
    }
  }

  if (status === "loading") return <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>Predictions</h1>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>
            <Link href="/admin" style={{ color: "var(--color-steel-muted)" }}>← Admin</Link>
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/admin/transcript" className="btn btn--ghost btn--sm">Resolve from transcript</Link>
          <Link href="/admin/agenda" className="btn btn--primary btn--sm">Import from agenda</Link>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab-btn${tab === "pending" ? " active" : ""}`} onClick={() => setTab("pending")}>Pending</button>
        <button className={`tab-btn${tab === "resolve" ? " active" : ""}`} onClick={() => setTab("resolve")}>Resolve</button>
        <button className={`tab-btn${tab === "all"     ? " active" : ""}`} onClick={() => setTab("all")}>All Questions</button>
      </div>

      {loading && <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>}

      {/* PENDING */}
      {!loading && tab === "pending" && (
        questions.length === 0
          ? <p style={{ color: "var(--color-text-muted)" }}>No pending questions.</p>
          : <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {questions.map(q => <PendingCard key={q.id} question={q} onApprove={approveQuestion} onReject={rejectQuestion} />)}
            </div>
      )}

      {/* RESOLVE */}
      {!loading && tab === "resolve" && (
        <>
          {resolvedCount !== null && (
            <div className="card" style={{ background: "var(--color-teal-accent)", color: "#fff", padding: "0.75rem 1.25rem", marginBottom: "1rem" }}>
              {resolvedCount} question{resolvedCount !== 1 ? "s" : ""} resolved successfully.
            </div>
          )}
          {questions.length === 0 && resolvedCount === null && (
            <p style={{ color: "var(--color-text-muted)" }}>No questions awaiting resolution.</p>
          )}
          {questions.length > 0 && (
            <>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                Select the correct outcome for each question.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {questions.map(q => (
                  <div key={q.id} className="card" style={{ borderLeft: resolveSelections[q.id] ? "3px solid var(--color-teal-accent)" : "3px solid var(--color-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "0.5rem" }}>
                      <div>
                        {q.category && <span className="eyebrow">{q.category}</span>}
                        <p style={{ fontFamily: "var(--font-serif)", color: "var(--color-limestone)", margin: "0.25rem 0 0" }}>{q.title}</p>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", flexShrink: 0 }}>
                        {q._count?.predictions ?? 0} predictions
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
                      {q.options.map(o => (
                        <label key={o.id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", padding: "0.4rem 0.875rem", borderRadius: "999px", fontSize: "0.875rem", border: `1px solid ${resolveSelections[q.id] === o.id ? "var(--color-teal-accent)" : "var(--color-border)"}`, background: resolveSelections[q.id] === o.id ? "rgba(0,180,160,0.1)" : "transparent", color: resolveSelections[q.id] === o.id ? "var(--color-teal-accent)" : "var(--color-text-muted)", transition: "all 0.15s" }}>
                          <input type="radio" name={`resolve-${q.id}`} value={o.id} checked={resolveSelections[q.id] === o.id} onChange={() => setResolveSelections(s => ({ ...s, [q.id]: o.id }))} style={{ display: "none" }} />
                          {o.label}
                        </label>
                      ))}
                      {resolveSelections[q.id] && (
                        <button onClick={() => setResolveSelections(s => { const n = { ...s }; delete n[q.id]; return n; })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--color-text-muted)", padding: "0.4rem 0.5rem", fontFamily: "inherit" }}>Clear</button>
                      )}
                    </div>
                    <textarea value={resolveNotes[q.id] ?? ""} onChange={e => setResolveNotes(n => ({ ...n, [q.id]: e.target.value }))} placeholder="Resolution notes (optional)" rows={2} style={{ marginTop: "0.75rem", width: "100%", fontSize: "0.8rem", resize: "vertical", minHeight: "unset" }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <button onClick={bulkResolve} disabled={resolving || Object.keys(resolveSelections).length === 0} className="btn btn--primary">
                  {resolving ? "Resolving…" : `Resolve ${Object.keys(resolveSelections).length} question${Object.keys(resolveSelections).length !== 1 ? "s" : ""}`}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* ALL */}
      {!loading && tab === "all" && (
        questions.length === 0
          ? <p style={{ color: "var(--color-text-muted)" }}>No questions yet.</p>
          : <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {questions.map(q =>
                editing === q.id
                  ? <EditCard key={q.id} draft={editDraft} onChange={setEditDraft} onSave={() => saveEdit(q.id)} onCancel={() => setEditing(null)} />
                  : <QuestionRow key={q.id} question={q} onEdit={() => startEdit(q)} onReject={rejectQuestion} />
              )}
            </div>
      )}
    </div>
  );
}

function PendingCard({ question: q, onApprove, onReject }: { question: Question; onApprove: (id: string, closeAt: string) => void; onReject: (id: string) => void }) {
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
        {q.options.map(o => <span key={o.id} className="badge badge--muted">{o.label}</span>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label style={{ margin: 0, whiteSpace: "nowrap" }}>Close date:</label>
          <input type="date" value={closeAt} onChange={e => setCloseAt(e.target.value)} style={{ width: "auto" }} />
        </div>
        <button onClick={() => onApprove(q.id, closeAt)} className="btn btn--primary btn--sm">Approve</button>
        <button onClick={() => onReject(q.id)} className="btn btn--danger btn--sm">Reject</button>
      </div>
    </div>
  );
}

const BADGE: Record<string, string> = { PENDING: "badge--gold", ACTIVE: "badge--blue", CLOSED: "badge--muted", RESOLVED: "badge--teal", ARCHIVED: "badge--muted" };

function QuestionRow({ question: q, onEdit, onReject }: { question: Question; onEdit: () => void; onReject: (id: string) => void }) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "0.875rem 1.25rem" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: "var(--color-limestone)", fontWeight: 500, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{q.title}</p>
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", margin: 0 }}>{q._count?.predictions ?? 0} predictions · {new Date(q.createdAt).toLocaleDateString()}</p>
      </div>
      <span className={`badge ${BADGE[q.status] ?? "badge--muted"}`}>{q.status}</span>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button onClick={onEdit} className="btn btn--ghost btn--sm">Edit</button>
        <button onClick={() => onReject(q.id)} className="btn btn--danger btn--sm">Delete</button>
      </div>
    </div>
  );
}

type EditDraft = Partial<Question> & { optionLabels?: string[] };
function EditCard({ draft, onChange, onSave, onCancel }: { draft: EditDraft; onChange: (d: EditDraft) => void; onSave: () => void; onCancel: () => void }) {
  return (
    <div className="card--raised" style={{ borderColor: "var(--color-river-blue)", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="form-group" style={{ margin: 0 }}><label>Title</label><input value={draft.title ?? ""} onChange={e => onChange({ ...draft, title: e.target.value })} /></div>
      <div className="form-group" style={{ margin: 0 }}><label>Description</label><textarea value={draft.description ?? ""} onChange={e => onChange({ ...draft, description: e.target.value })} rows={2} style={{ minHeight: "unset" }} /></div>
      <div className="form-group" style={{ margin: 0 }}><label>Source URL</label><input value={(draft as EditDraft & { sourceUrl?: string }).sourceUrl ?? ""} onChange={e => onChange({ ...draft, sourceUrl: e.target.value } as EditDraft)} placeholder="https://…" /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "1rem" }}>
        <div className="form-group" style={{ margin: 0 }}><label>Category</label><input value={draft.category ?? ""} onChange={e => onChange({ ...draft, category: e.target.value })} /></div>
        <div className="form-group" style={{ margin: 0 }}><label>Status</label>
          <select value={draft.status ?? "ACTIVE"} onChange={e => onChange({ ...draft, status: e.target.value })} style={{ width: "auto" }}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}><label>Close date</label><input type="date" value={draft.closeAt ?? ""} onChange={e => onChange({ ...draft, closeAt: e.target.value })} style={{ width: "auto" }} /></div>
      </div>
      <div>
        <label>Options</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.4rem" }}>
          {(draft.optionLabels ?? []).map((lbl, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input value={lbl} onChange={e => { const u = [...(draft.optionLabels ?? [])]; u[i] = e.target.value; onChange({ ...draft, optionLabels: u }); }} style={{ flex: 1 }} />
              {(draft.optionLabels?.length ?? 0) > 2 && (
                <button type="button" onClick={() => onChange({ ...draft, optionLabels: draft.optionLabels?.filter((_, idx) => idx !== i) })} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "1.25rem", lineHeight: 1, fontFamily: "inherit" }}>×</button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={() => onChange({ ...draft, optionLabels: [...(draft.optionLabels ?? []), ""] })} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-dome-gold)", fontSize: "0.85rem", fontFamily: "inherit", padding: 0, marginTop: "0.4rem" }}>+ Add option</button>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={onSave} className="btn btn--primary btn--sm">Save</button>
        <button onClick={onCancel} className="btn btn--ghost btn--sm">Cancel</button>
      </div>
    </div>
  );
}
