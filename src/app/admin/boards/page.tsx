"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Member = { id: string; name: string; role: string | null; termExpires: string | null; status: string; notes: string | null; sortOrder: number };
type Board  = { id: string; slug: string; name: string; notes: string | null; sortOrder: number; members: Member[] };

const STATUSES = ["current", "expired", "vacant", "proposed"];

const STATUS_COLOR: Record<string, string> = {
  current:  "var(--color-steel-muted)",
  expired:  "#c0392b",
  vacant:   "#E8C84A",
  proposed: "var(--color-teal-accent)",
};

const BLANK_MEMBER = { name: "", role: "", termExpires: "", status: "current", notes: "" };

export default function AdminBoardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingBoard, setEditingBoard] = useState<string | null>(null);
  const [boardDraft, setBoardDraft] = useState({ name: "", slug: "", notes: "" });
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [memberDraft, setMemberDraft] = useState(BLANK_MEMBER);
  const [addingMember, setAddingMember] = useState<string | null>(null);
  const [newMember, setNewMember] = useState(BLANK_MEMBER);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") { router.push("/"); return; }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN") return;
    fetch("/api/admin/boards").then(r => r.json()).then(d => { setBoards(d); setLoading(false); });
  }, [session]);

  const filtered = boards.filter(b =>
    !search ||
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.members.some(m => m.name.toLowerCase().includes(search.toLowerCase()))
  );

  async function saveBoard(id: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/boards/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(boardDraft),
    });
    if (res.ok) {
      const updated: Board = await res.json();
      setBoards(boards.map(b => b.id === id ? updated : b));
      setEditingBoard(null);
    }
    setSaving(false);
  }

  async function deleteBoard(id: string, name: string) {
    if (!confirm(`Delete "${name}" and all its members? This cannot be undone.`)) return;
    await fetch(`/api/admin/boards/${id}`, { method: "DELETE" });
    setBoards(boards.filter(b => b.id !== id));
  }

  async function saveMember(boardId: string, memberId: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/boards/${boardId}/members/${memberId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(memberDraft),
    });
    if (res.ok) {
      const updated: Member = await res.json();
      setBoards(boards.map(b => b.id === boardId ? { ...b, members: b.members.map(m => m.id === memberId ? updated : m) } : b));
      setEditingMember(null);
    }
    setSaving(false);
  }

  async function deleteMember(boardId: string, memberId: string, name: string) {
    if (!confirm(`Remove "${name}"?`)) return;
    await fetch(`/api/admin/boards/${boardId}/members/${memberId}`, { method: "DELETE" });
    setBoards(boards.map(b => b.id === boardId ? { ...b, members: b.members.filter(m => m.id !== memberId) } : b));
  }

  async function addMember(boardId: string) {
    if (!newMember.name.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/boards/${boardId}/members`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newMember),
    });
    if (res.ok) {
      const created: Member = await res.json();
      setBoards(boards.map(b => b.id === boardId ? { ...b, members: [...b.members, created] } : b));
      setAddingMember(null);
      setNewMember(BLANK_MEMBER);
    }
    setSaving(false);
  }

  if (status === "loading" || loading) return <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>Boards &amp; Commissions</h1>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>
            {boards.length} boards · {boards.reduce((s, b) => s + b.members.length, 0)} members ·{" "}
            <Link href="/boards" target="_blank" style={{ color: "var(--color-dome-gold)" }}>View public page →</Link>
          </p>
        </div>
        <Link href="/admin" className="btn btn--ghost btn--sm">← Admin</Link>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search boards or member names…"
        style={{ maxWidth: "320px", fontSize: "0.85rem", marginBottom: "1rem" }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.map(board => {
          const isExpanded = expanded === board.id;
          const expiredCount = board.members.filter(m => m.status === "expired").length;
          const vacantCount  = board.members.filter(m => m.status === "vacant").length;

          return (
            <div key={board.id} style={{ border: "1px solid rgba(244,241,232,0.1)", borderRadius: "8px", overflow: "hidden" }}>
              {/* Board row */}
              {editingBoard === board.id ? (
                <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <input value={boardDraft.name} onChange={e => setBoardDraft({ ...boardDraft, name: e.target.value })} placeholder="Board name" style={{ fontSize: "0.85rem" }} />
                  <input value={boardDraft.slug} onChange={e => setBoardDraft({ ...boardDraft, slug: e.target.value })} placeholder="slug" style={{ fontSize: "0.82rem" }} />
                  <textarea value={boardDraft.notes} onChange={e => setBoardDraft({ ...boardDraft, notes: e.target.value })} placeholder="Notes" rows={2} style={{ fontSize: "0.82rem", resize: "vertical", minHeight: "unset" }} />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => saveBoard(board.id)} disabled={saving} className="btn btn--primary btn--sm">{saving ? "Saving…" : "Save"}</button>
                    <button onClick={() => setEditingBoard(null)} className="btn btn--ghost btn--sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.02)", cursor: "pointer" }}
                  onClick={() => setExpanded(isExpanded ? null : board.id)}>
                  <span style={{ color: "rgba(154,176,200,0.3)", fontSize: "0.75rem", flexShrink: 0 }}>{isExpanded ? "▾" : "▸"}</span>
                  <p style={{ flex: 1, fontWeight: 600, color: "var(--color-limestone)", margin: 0, fontSize: "0.875rem" }}>{board.name}</p>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
                    {expiredCount > 0 && <span style={{ fontSize: "0.65rem", color: "#c0392b", fontWeight: 700 }}>{expiredCount} expired</span>}
                    {vacantCount  > 0 && <span style={{ fontSize: "0.65rem", color: "#E8C84A", fontWeight: 700 }}>{vacantCount} vacant</span>}
                    <span style={{ fontSize: "0.65rem", color: "rgba(154,176,200,0.4)" }}>{board.members.length} seats</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.35rem" }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setEditingBoard(board.id); setBoardDraft({ name: board.name, slug: board.slug, notes: board.notes ?? "" }); }} className="btn btn--ghost btn--sm" style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}>Edit</button>
                    <button onClick={() => deleteBoard(board.id, board.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(154,176,200,0.4)", fontSize: "0.7rem", fontFamily: "inherit" }}>Del</button>
                  </div>
                </div>
              )}

              {/* Members */}
              {isExpanded && (
                <div style={{ borderTop: "1px solid rgba(244,241,232,0.08)", padding: "0.75rem 1rem" }}>
                  {board.notes && (
                    <p style={{ fontSize: "0.72rem", color: board.notes.startsWith("ACCOUNTABILITY") ? "#c0392b" : "var(--color-steel-muted)", marginBottom: "0.75rem" }}>{board.notes}</p>
                  )}
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", marginBottom: "0.75rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(244,241,232,0.08)" }}>
                        {["Name", "Role", "Term expires", "Status", ""].map(h => (
                          <th key={h} style={{ padding: "0.3rem 0.5rem", textAlign: "left", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(154,176,200,0.5)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {board.members.map(mem => (
                        editingMember === mem.id ? (
                          <tr key={mem.id}>
                            <td colSpan={5} style={{ padding: "0.5rem 0" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: "0.4rem", alignItems: "center" }}>
                                <input value={memberDraft.name} onChange={e => setMemberDraft({ ...memberDraft, name: e.target.value })} placeholder="Name" style={{ fontSize: "0.78rem" }} />
                                <input value={memberDraft.role} onChange={e => setMemberDraft({ ...memberDraft, role: e.target.value })} placeholder="Role" style={{ fontSize: "0.78rem" }} />
                                <input value={memberDraft.termExpires} onChange={e => setMemberDraft({ ...memberDraft, termExpires: e.target.value })} placeholder="Term expires" style={{ fontSize: "0.78rem" }} />
                                <select value={memberDraft.status} onChange={e => setMemberDraft({ ...memberDraft, status: e.target.value })} style={{ fontSize: "0.75rem", width: "auto" }}>
                                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <div style={{ display: "flex", gap: "0.3rem" }}>
                                  <button onClick={() => saveMember(board.id, mem.id)} disabled={saving} className="btn btn--primary btn--sm" style={{ fontSize: "0.68rem", padding: "0.2rem 0.4rem" }}>Save</button>
                                  <button onClick={() => setEditingMember(null)} className="btn btn--ghost btn--sm" style={{ fontSize: "0.68rem", padding: "0.2rem 0.4rem" }}>✕</button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={mem.id} style={{ borderBottom: "1px solid rgba(244,241,232,0.04)" }}>
                            <td style={{ padding: "0.3rem 0.5rem", color: STATUS_COLOR[mem.status] ?? "var(--color-limestone)", fontWeight: mem.status !== "current" ? 600 : 400 }}>{mem.name}</td>
                            <td style={{ padding: "0.3rem 0.5rem", color: "rgba(154,176,200,0.5)", fontSize: "0.72rem" }}>{mem.role ?? "—"}</td>
                            <td style={{ padding: "0.3rem 0.5rem", color: mem.status === "expired" ? "#c0392b" : "rgba(154,176,200,0.5)", fontSize: "0.72rem" }}>
                              {mem.termExpires ?? "—"}{mem.status === "expired" ? " ⚠" : ""}
                            </td>
                            <td style={{ padding: "0.3rem 0.5rem" }}>
                              <span style={{ fontSize: "0.65rem", fontWeight: 600, color: STATUS_COLOR[mem.status] }}>{mem.status}</span>
                            </td>
                            <td style={{ padding: "0.3rem 0.5rem" }}>
                              <div style={{ display: "flex", gap: "0.3rem" }}>
                                <button onClick={() => { setEditingMember(mem.id); setMemberDraft({ name: mem.name, role: mem.role ?? "", termExpires: mem.termExpires ?? "", status: mem.status, notes: mem.notes ?? "" }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-dome-gold)", fontSize: "0.68rem", fontFamily: "inherit" }}>Edit</button>
                                <button onClick={() => deleteMember(board.id, mem.id, mem.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(154,176,200,0.3)", fontSize: "0.68rem", fontFamily: "inherit" }}>Del</button>
                              </div>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>

                  {/* Add member */}
                  {addingMember === board.id ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: "0.4rem", alignItems: "center" }}>
                      <input value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} placeholder="Name *" style={{ fontSize: "0.78rem" }} />
                      <input value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} placeholder="Role" style={{ fontSize: "0.78rem" }} />
                      <input value={newMember.termExpires} onChange={e => setNewMember({ ...newMember, termExpires: e.target.value })} placeholder="Term expires" style={{ fontSize: "0.78rem" }} />
                      <select value={newMember.status} onChange={e => setNewMember({ ...newMember, status: e.target.value })} style={{ fontSize: "0.75rem", width: "auto" }}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <div style={{ display: "flex", gap: "0.3rem" }}>
                        <button onClick={() => addMember(board.id)} disabled={saving || !newMember.name.trim()} className="btn btn--primary btn--sm" style={{ fontSize: "0.68rem", padding: "0.2rem 0.5rem" }}>Add</button>
                        <button onClick={() => setAddingMember(null)} className="btn btn--ghost btn--sm" style={{ fontSize: "0.68rem", padding: "0.2rem 0.4rem" }}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setAddingMember(board.id); setNewMember(BLANK_MEMBER); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-dome-gold)", fontSize: "0.75rem", fontFamily: "inherit", padding: 0 }}>+ Add member</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
