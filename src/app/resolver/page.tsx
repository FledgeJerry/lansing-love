"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Option = { id: string; label: string };
type Question = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  options: Option[];
  _count: { predictions: number };
};

export default function ResolverPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user.role !== "RESOLVER" && session.user.role !== "ADMIN")) {
      router.push("/"); return;
    }
    fetch("/api/resolver/questions")
      .then((r) => r.json())
      .then((d) => { setQuestions(d); setLoading(false); });
  }, [session, status, router]);

  async function resolve(id: string) {
    const optionId = picks[id];
    if (!optionId) return;
    await fetch(`/api/resolver/questions/${id}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId, notes: notes[id] || null }),
    });
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  }

  if (status === "loading" || loading) return <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>;

  return (
    <div>
      <h1 style={{ marginBottom: "0.25rem" }}>Resolve Questions</h1>
      <p style={{ marginBottom: "2rem" }}>Mark the correct outcome for closed questions.</p>

      {questions.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--color-text-muted)", margin: 0 }}>No questions ready to resolve.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {questions.map((q) => (
            <div key={q.id} className="card">
              {q.category && <span className="eyebrow">{q.category}</span>}
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", color: "var(--color-limestone)", marginBottom: "0.5rem" }}>
                {q.title}
              </p>
              {q.description && (
                <p style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>{q.description}</p>
              )}
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
                {q._count.predictions} prediction{q._count.predictions !== 1 ? "s" : ""}
              </p>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ marginBottom: "0.5rem" }}>What actually happened?</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {q.options.map((o) => (
                    <label key={o.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--color-text-secondary)", fontWeight: 400 }}>
                      <input
                        type="radio"
                        name={`pick-${q.id}`}
                        value={o.id}
                        checked={picks[q.id] === o.id}
                        onChange={() => setPicks((p) => ({ ...p, [q.id]: o.id }))}
                        style={{ accentColor: "var(--color-dome-gold)", width: "auto" }}
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor={`notes-${q.id}`}>Resolution notes (optional)</label>
                <textarea
                  id={`notes-${q.id}`}
                  value={notes[q.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [q.id]: e.target.value }))}
                  rows={2}
                  placeholder="Source link, context, etc."
                  style={{ minHeight: "unset" }}
                />
              </div>

              <button
                onClick={() => resolve(q.id)}
                disabled={!picks[q.id]}
                className="btn btn--primary btn--sm"
              >
                Mark resolved
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
