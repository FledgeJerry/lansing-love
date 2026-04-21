"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Option = { id: string; label: string };

type Suggestion = {
  questionId: string;
  questionTitle: string;
  questionCategory: string | null;
  optionId: string;
  optionLabel: string;
  allOptions: Option[];
  confidence: "high" | "medium" | "low";
  reasoning: string;
};

type Unresolved = {
  questionId: string;
  questionTitle: string;
  questionCategory: string | null;
  allOptions: Option[];
};

const CONFIDENCE_STYLE: Record<string, { color: string; label: string }> = {
  high:   { color: "var(--color-teal-accent)", label: "High confidence" },
  medium: { color: "var(--color-dome-gold)",   label: "Medium confidence" },
  low:    { color: "var(--color-text-muted)",  label: "Low confidence" },
};

export default function TranscriptPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [unresolved, setUnresolved] = useState<Unresolved[]>([]);
  // selections: questionId → optionId (or "" to skip)
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [done, setDone] = useState<number | null>(null);

  if (status === "loading") return null;
  if (!session || session.user.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  async function analyze() {
    setError("");
    setAnalyzing(true);
    setSuggestions([]);
    setUnresolved([]);
    setSelections({});
    setDone(null);

    const form = new FormData();
    if (file) {
      form.append("file", file);
    } else {
      form.append("text", text);
    }

    const res = await fetch("/api/admin/transcript", { method: "POST", body: form });
    setAnalyzing(false);

    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Analysis failed");
      return;
    }

    const { resolutions, unresolved: ur } = body;
    setSuggestions(resolutions);
    setUnresolved(ur);

    // Pre-select AI suggestions
    const initial: Record<string, string> = {};
    for (const s of resolutions) {
      initial[s.questionId] = s.optionId;
    }
    // Unresolved questions start with no selection
    for (const u of ur) {
      initial[u.questionId] = "";
    }
    setSelections(initial);
  }

  async function resolve() {
    const resolutionsList = Object.entries(selections)
      .filter(([, optionId]) => optionId)
      .map(([questionId, optionId]) => ({ questionId, optionId }));

    if (resolutionsList.length === 0) return;
    setResolving(true);

    const res = await fetch("/api/admin/questions/bulk-resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolutions: resolutionsList }),
    });
    setResolving(false);

    if (res.ok) {
      const data = await res.json();
      setDone(data.resolved);
    } else {
      const d = await res.json();
      setError(d.error ?? "Resolve failed");
    }
  }

  const allQuestions = [
    ...suggestions.map((s) => ({ ...s, aiSuggested: true })),
    ...unresolved.map((u) => ({ ...u, optionId: "", optionLabel: "", confidence: "none" as const, reasoning: "", aiSuggested: false })),
  ];

  const selectedCount = Object.values(selections).filter(Boolean).length;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Admin
        </Link>
        <h1 className="text-2xl font-bold">Resolve from Transcript</h1>
      </div>

      {/* Input */}
      {suggestions.length === 0 && unresolved.length === 0 && !done && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Upload PDF or paste meeting transcript</label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => { setFile(e.target.files?.[0] ?? null); setText(""); }}
              className="text-sm text-gray-600"
            />
          </div>
          {!file && (
            <>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex-1 h-px bg-gray-200" /> or paste text <div className="flex-1 h-px bg-gray-200" />
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the full meeting transcript here…"
                rows={10}
                className="w-full border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={analyze}
            disabled={analyzing || (!text.trim() && !file)}
            className="bg-rose-600 text-white px-5 py-2 rounded hover:bg-rose-700 disabled:opacity-40 text-sm"
          >
            {analyzing ? "Analyzing transcript…" : "Analyze transcript"}
          </button>
        </div>
      )}

      {/* Spinner */}
      {analyzing && (
        <div className="mt-8 text-center text-gray-400 text-sm">
          <div className="animate-spin inline-block w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full mb-2" />
          <p>Reading transcript and matching outcomes…</p>
        </div>
      )}

      {/* Results */}
      {(suggestions.length > 0 || unresolved.length > 0) && !done && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-800">{suggestions.length}</span> matched by AI ·{" "}
              <span className="font-medium text-gray-800">{unresolved.length}</span> need manual selection
            </div>
            <button
              onClick={() => { setSuggestions([]); setUnresolved([]); setFile(null); setText(""); setError(""); }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Start over
            </button>
          </div>

          {allQuestions.map((q) => {
            const selected = selections[q.questionId] ?? "";
            const conf = CONFIDENCE_STYLE[q.confidence] ?? null;
            return (
              <div
                key={q.questionId}
                style={{
                  background: "#fff",
                  border: `1px solid ${selected ? "var(--color-border)" : "#f87171"}`,
                  borderLeft: selected ? `3px solid var(--color-teal-accent)` : "3px solid #f87171",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    {q.questionCategory && (
                      <span className="eyebrow">{q.questionCategory}</span>
                    )}
                    <p style={{ fontFamily: "var(--font-serif)", color: "var(--color-limestone)", margin: "0.2rem 0 0" }}>
                      {q.questionTitle}
                    </p>
                  </div>
                  {conf && (
                    <span style={{ fontSize: "0.7rem", color: conf.color, whiteSpace: "nowrap", flexShrink: 0, fontWeight: 600 }}>
                      {conf.label}
                    </span>
                  )}
                  {!q.aiSuggested && (
                    <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                      Not found in transcript
                    </span>
                  )}
                </div>

                {q.reasoning && (
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontStyle: "italic", marginBottom: "0.75rem" }}>
                    &ldquo;{q.reasoning}&rdquo;
                  </p>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {q.allOptions.map((o) => {
                    const isSelected = selected === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setSelections((s) => ({ ...s, [q.questionId]: isSelected ? "" : o.id }))}
                        style={{
                          padding: "0.35rem 0.875rem",
                          borderRadius: "999px",
                          fontSize: "0.85rem",
                          border: `1px solid ${isSelected ? "var(--color-teal-accent)" : "var(--color-border)"}`,
                          background: isSelected ? "rgba(0,180,160,0.1)" : "transparent",
                          color: isSelected ? "var(--color-teal-accent)" : "var(--color-text-muted)",
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                          fontWeight: isSelected ? 600 : 400,
                          transition: "all 0.15s",
                        }}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingTop: "0.5rem" }}>
            <button
              onClick={resolve}
              disabled={resolving || selectedCount === 0}
              className="btn btn--primary"
            >
              {resolving ? "Resolving…" : `Resolve ${selectedCount} question${selectedCount !== 1 ? "s" : ""}`}
            </button>
            {selectedCount < allQuestions.length && (
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                {allQuestions.length - selectedCount} question{allQuestions.length - selectedCount !== 1 ? "s" : ""} will be skipped
              </span>
            )}
          </div>
        </div>
      )}

      {/* Success */}
      {done !== null && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-green-700 font-medium mb-3">
            {done} question{done !== 1 ? "s" : ""} resolved successfully
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/" className="text-sm text-rose-600 hover:underline">
              View predictions →
            </Link>
            <button
              onClick={() => { setDone(null); setSuggestions([]); setUnresolved([]); setFile(null); setText(""); }}
              className="text-sm text-gray-500 hover:underline"
            >
              Resolve another meeting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
