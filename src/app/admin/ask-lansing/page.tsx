"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ChatEntry = {
  id: string;
  userMessage: string;
  botResponse: string;
  flagged: boolean;
  adminNote: string | null;
  promoted: boolean;
  createdAt: string;
};

type Filter = "all" | "flagged" | "noted";

const FILTER_LABELS: Record<Filter, string> = {
  all: "All conversations",
  flagged: "Flagged (gaps)",
  noted: "Has admin note",
};

export default function AskLansingAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [filter, setFilter] = useState<Filter>("flagged");
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState<ChatEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  if (status === "loading") return null;
  if (!session || session.user.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/chatlog?filter=${filter}&page=${page}`);
    const data = await res.json();
    setLogs(data.logs ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
    const initial: Record<string, string> = {};
    for (const l of (data.logs ?? [])) {
      initial[l.id] = l.adminNote ?? "";
    }
    setNotes((prev) => ({ ...initial, ...prev }));
  }, [filter, page]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => { load(); }, [load]);

  async function saveNote(id: string) {
    setSaving(id);
    await fetch("/api/admin/chatlog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminNote: notes[id] || null }),
    });
    setSaving(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
    load();
  }

  async function togglePromoted(entry: ChatEntry) {
    await fetch("/api/admin/chatlog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entry.id, promoted: !entry.promoted }),
    });
    load();
  }

  async function deleteEntry(id: string) {
    if (!confirm("Delete this log entry?")) return;
    await fetch("/api/admin/chatlog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin" style={{ fontSize: "0.82rem", color: "var(--color-steel-muted)" }}>← Admin</Link>
        <h1 style={{ marginTop: "0.4rem", marginBottom: "0.25rem" }}>Ask Lansing.love</h1>
        <p style={{ fontSize: "0.82rem", color: "var(--color-steel-muted)", margin: 0 }}>
          Chat log · {total} entries. Flagged = bot said it didn&apos;t know. Add an admin note to bake the answer into the next prompt.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem" }}>
        {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            style={{
              padding: "0.3rem 0.85rem",
              borderRadius: "100px",
              fontSize: "0.78rem",
              border: `1px solid ${filter === f ? "var(--color-dome-gold)" : "rgba(154,176,200,0.2)"}`,
              background: filter === f ? "rgba(201,168,76,0.12)" : "transparent",
              color: filter === f ? "var(--color-dome-gold)" : "var(--color-steel-muted)",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: "var(--color-steel-muted)", fontSize: "0.88rem" }}>Loading…</p>}

      {!loading && logs.length === 0 && (
        <p style={{ color: "var(--color-steel-muted)", fontSize: "0.88rem" }}>
          {filter === "flagged" ? "No flagged conversations yet — good sign." : "Nothing here."}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {logs.map((entry) => {
          const isExpanded = expanded === entry.id;
          const note = notes[entry.id] ?? "";
          const hasNote = !!entry.adminNote;

          return (
            <div
              key={entry.id}
              style={{
                borderRadius: "8px",
                border: `1px solid ${entry.flagged ? "rgba(239,68,68,0.25)" : "rgba(154,176,200,0.12)"}`,
                background: "rgba(154,176,200,0.04)",
                overflow: "hidden",
              }}
            >
              {/* Row header */}
              <div
                onClick={() => setExpanded(isExpanded ? null : entry.id)}
                style={{ padding: "0.8rem 1rem", cursor: "pointer", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                    {entry.flagged && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(239,68,68,0.8)", letterSpacing: "0.06em", textTransform: "uppercase" }}>gap</span>
                    )}
                    {hasNote && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-dome-gold)", letterSpacing: "0.06em", textTransform: "uppercase" }}>noted</span>
                    )}
                    {entry.promoted && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-steel-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>promoted</span>
                    )}
                    <span style={{ fontSize: "0.7rem", color: "var(--color-steel-muted)" }}>
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-limestone)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {entry.userMessage}
                  </p>
                  {!isExpanded && (
                    <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: "var(--color-steel-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {entry.botResponse.slice(0, 120)}…
                    </p>
                  )}
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-steel-muted)", flexShrink: 0, marginTop: "0.1rem" }}>
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ padding: "0 1rem 1rem", borderTop: "1px solid rgba(154,176,200,0.08)" }}>
                  <div style={{ marginTop: "0.75rem", marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--color-steel-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.35rem" }}>Bot response</div>
                    <div style={{ fontSize: "0.83rem", color: "var(--color-text)", lineHeight: 1.6, whiteSpace: "pre-wrap", background: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "6px" }}>
                      {entry.botResponse}
                    </div>
                  </div>

                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--color-steel-muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "0.35rem" }}>
                      Admin note — baked into next prompts as a correction (until promoted)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [entry.id]: e.target.value }))}
                      placeholder="Write the correct answer here — it will be included in the system prompt for future queries…"
                      rows={3}
                      style={{ width: "100%", fontSize: "0.83rem", resize: "vertical" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      onClick={() => saveNote(entry.id)}
                      disabled={saving === entry.id}
                      className="btn btn--primary btn--sm"
                    >
                      {saving === entry.id ? "Saving…" : saved === entry.id ? "Saved ✓" : "Save note"}
                    </button>

                    <button
                      onClick={() => togglePromoted(entry)}
                      style={{
                        fontSize: "0.78rem",
                        padding: "0.3rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid rgba(154,176,200,0.2)",
                        background: "transparent",
                        color: "var(--color-steel-muted)",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {entry.promoted ? "Un-promote" : "Mark promoted"}
                    </button>

                    <button
                      onClick={() => deleteEntry(entry.id)}
                      style={{
                        fontSize: "0.78rem",
                        padding: "0.3rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid rgba(239,68,68,0.2)",
                        background: "transparent",
                        color: "rgba(239,68,68,0.6)",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        marginLeft: "auto",
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  {hasNote && !entry.promoted && (
                    <p style={{ fontSize: "0.72rem", color: "var(--color-dome-gold)", marginTop: "0.5rem" }}>
                      This note is active — it&apos;s being injected into every Ask Lansing.love response right now. Mark as &ldquo;promoted&rdquo; once the underlying case/pattern data is updated and the bot no longer needs the correction.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem", alignItems: "center" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn--sm"
            style={{ opacity: page === 1 ? 0.4 : 1 }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: "0.82rem", color: "var(--color-steel-muted)" }}>
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="btn btn--sm"
            style={{ opacity: page === pages ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
