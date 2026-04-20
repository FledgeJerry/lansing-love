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

const STATUS_OPTIONS = ["PENDING", "ACTIVE", "CLOSED", "RESOLVED"] as const;

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

  const tabClass = (t: Tab) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      tab === t
        ? "border-rose-600 text-rose-600"
        : "border-transparent text-gray-500 hover:text-gray-800"
    }`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin</h1>
        <Link href="/admin/agenda" className="bg-rose-600 text-white text-sm px-3 py-1.5 rounded hover:bg-rose-700">
          Import from agenda
        </Link>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button className={tabClass("pending")} onClick={() => setTab("pending")}>
          Pending
        </button>
        <button className={tabClass("all")} onClick={() => setTab("all")}>
          All Questions
        </button>
        <button className={tabClass("users")} onClick={() => setTab("users")}>
          Users
        </button>
      </div>

      {loading && <p className="text-gray-400">Loading…</p>}

      {/* PENDING TAB */}
      {!loading && tab === "pending" && (
        <>
          {questions.length === 0 ? (
            <p className="text-gray-400">No pending questions.</p>
          ) : (
            <div className="space-y-4">
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
            <p className="text-gray-400">No questions yet.</p>
          ) : (
            <div className="space-y-3">
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
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">{u.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => setUserRole(u.id, e.target.value)}
                      disabled={u.id === session?.user.id}
                      className="text-xs border rounded px-2 py-1 disabled:opacity-50"
                    >
                      <option value="USER">User</option>
                      <option value="RESOLVER">Resolver</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
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
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <p className="font-semibold">{q.title}</p>
      {q.description && <p className="text-sm text-gray-500 mt-1">{q.description}</p>}
      {q.category && <p className="text-xs text-gray-400 mt-1">{q.category}</p>}
      <p className="text-xs text-gray-400 mt-1">
        Submitted by {q.submittedBy.name ?? q.submittedBy.email} ·{" "}
        {new Date(q.createdAt).toLocaleDateString()}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {q.options.map((o) => (
          <span key={o.id} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
            {o.label}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-4">
        <div>
          <label className="text-xs text-gray-500 mr-1">Close date:</label>
          <input
            type="date"
            value={closeAt}
            onChange={(e) => setCloseAt(e.target.value)}
            className="text-xs border rounded px-2 py-1"
          />
        </div>
        <button
          onClick={() => onApprove(q.id, closeAt)}
          className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(q.id)}
          className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded hover:bg-red-100 hover:text-red-700"
        >
          Reject
        </button>
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
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ACTIVE: "bg-rose-100 text-rose-700",
    CLOSED: "bg-gray-100 text-gray-600",
    RESOLVED: "bg-green-100 text-green-700",
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4 shadow-sm">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{q.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {q._count?.predictions ?? 0} predictions ·{" "}
          {new Date(q.createdAt).toLocaleDateString()}
        </p>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusColors[q.status]}`}>
        {q.status}
      </span>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="text-xs border border-gray-300 px-2 py-1 rounded hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          onClick={() => onReject(q.id)}
          className="text-xs border border-gray-300 px-2 py-1 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-300"
        >
          Delete
        </button>
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
    <div className="bg-white border-2 border-rose-300 rounded-lg p-5 shadow-sm space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600">Title</label>
        <input
          value={draft.title ?? ""}
          onChange={(e) => onChange({ ...draft, title: e.target.value })}
          className="w-full border rounded px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600">Description</label>
        <textarea
          value={draft.description ?? ""}
          onChange={(e) => onChange({ ...draft, description: e.target.value })}
          rows={2}
          className="w-full border rounded px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-600">Category</label>
          <input
            value={draft.category ?? ""}
            onChange={(e) => onChange({ ...draft, category: e.target.value })}
            className="w-full border rounded px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select
            value={draft.status ?? "ACTIVE"}
            onChange={(e) => onChange({ ...draft, status: e.target.value })}
            className="block border rounded px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Close date</label>
          <input
            type="date"
            value={draft.closeAt ?? ""}
            onChange={(e) => onChange({ ...draft, closeAt: e.target.value })}
            className="block border rounded px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600">Options</label>
        <div className="space-y-1 mt-1">
          {(draft.optionLabels ?? []).map((label, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={label}
                onChange={(e) => {
                  const updated = [...(draft.optionLabels ?? [])];
                  updated[i] = e.target.value;
                  onChange({ ...draft, optionLabels: updated });
                }}
                className="flex-1 border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              {(draft.optionLabels?.length ?? 0) > 2 && (
                <button
                  type="button"
                  onClick={() => onChange({
                    ...draft,
                    optionLabels: draft.optionLabels?.filter((_, idx) => idx !== i),
                  })}
                  className="text-gray-400 hover:text-red-500 text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...draft, optionLabels: [...(draft.optionLabels ?? []), ""] })}
          className="text-xs text-rose-600 hover:underline mt-1"
        >
          + Add option
        </button>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={onSave}
          className="bg-rose-600 text-white text-sm px-4 py-1.5 rounded hover:bg-rose-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-sm px-4 py-1.5 rounded border hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
