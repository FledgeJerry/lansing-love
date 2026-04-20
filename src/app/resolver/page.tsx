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
      router.push("/");
      return;
    }
    fetch("/api/resolver/questions")
      .then((r) => r.json())
      .then((data) => { setQuestions(data); setLoading(false); });
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

  if (status === "loading" || loading) return <p className="text-gray-400">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Resolve Questions</h1>
      <p className="text-gray-500 text-sm mb-6">Mark the correct outcome for closed questions.</p>
      {questions.length === 0 ? (
        <p className="text-gray-400">No questions ready to resolve.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <p className="font-semibold">{q.title}</p>
              {q.description && <p className="text-sm text-gray-500 mt-1">{q.description}</p>}
              <p className="text-xs text-gray-400 mt-1">
                {q._count.predictions} prediction{q._count.predictions !== 1 ? "s" : ""}
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium">What actually happened?</p>
                {q.options.map((o) => (
                  <label key={o.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`pick-${q.id}`}
                      value={o.id}
                      checked={picks[q.id] === o.id}
                      onChange={() => setPicks((p) => ({ ...p, [q.id]: o.id }))}
                      className="accent-rose-600"
                    />
                    <span className="text-sm">{o.label}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <textarea
                  placeholder="Resolution notes (optional)"
                  value={notes[q.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [q.id]: e.target.value }))}
                  rows={2}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <button
                onClick={() => resolve(q.id)}
                disabled={!picks[q.id]}
                className="mt-3 bg-rose-600 text-white text-sm px-4 py-1.5 rounded hover:bg-rose-700 disabled:opacity-40"
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
