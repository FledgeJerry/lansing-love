"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SuggestedQuestion = {
  title: string;
  description: string;
  category: string;
  options: string[];
  closeAt?: string;
  sourceUrl?: string;
  sourceText?: string;
  enabled: boolean;
};

type CloseAtDisplay = { date: string; time: string };

export default function AgendaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [questions, setQuestions] = useState<SuggestedQuestion[]>([]);
  const [meetingStart, setMeetingStart] = useState<CloseAtDisplay>({ date: "", time: "19:00" });
  const [error, setError] = useState("");
  const [importStatus, setImportStatus] = useState<"PENDING" | "ACTIVE">("ACTIVE");
  const [done, setDone] = useState(false);

  if (status === "loading") return null;
  if (!session || session.user.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  async function extract() {
    setError("");
    setExtracting(true);
    setQuestions([]);
    setDone(false);

    const form = new FormData();
    if (file) {
      form.append("file", file);
    } else {
      form.append("text", text);
    }

    const res = await fetch("/api/admin/agenda", { method: "POST", body: form });
    setExtracting(false);

    const body = await res.text();
    if (!res.ok) {
      try {
        const d = JSON.parse(body);
        setError(d.error ?? "Extraction failed");
      } catch {
        setError(`Server error ${res.status}: ${body.slice(0, 200) || "no details"}`);
      }
      return;
    }

    const data = JSON.parse(body);

    let parsedDate = "";
    let parsedTime = "19:00";
    if (data.meetingStart) {
      const dt = new Date(data.meetingStart);
      if (!isNaN(dt.getTime())) {
        parsedDate = dt.toISOString().split("T")[0];
        parsedTime = dt.toTimeString().slice(0, 5);
      }
    }
    setMeetingStart({ date: parsedDate, time: parsedTime });

    const closeAt = parsedDate ? `${parsedDate}T${parsedTime}` : "";
    setQuestions(
      (data.questions ?? []).map((q: Omit<SuggestedQuestion, "enabled">) => ({
        ...q,
        enabled: true,
        closeAt,
        sourceUrl: q.sourceUrl ?? "",
        sourceText: q.sourceText ?? "",
      }))
    );
  }

  function updateQuestion(i: number, patch: Partial<SuggestedQuestion>) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }

  function updateOption(qi: number, oi: number, val: string) {
    setQuestions((qs) =>
      qs.map((q, idx) => {
        if (idx !== qi) return q;
        const options = [...q.options];
        options[oi] = val;
        return { ...q, options };
      })
    );
  }

  function addOption(qi: number) {
    setQuestions((qs) =>
      qs.map((q, idx) => (idx === qi ? { ...q, options: [...q.options, ""] } : q))
    );
  }

  function removeOption(qi: number, oi: number) {
    setQuestions((qs) =>
      qs.map((q, idx) =>
        idx === qi ? { ...q, options: q.options.filter((_, i) => i !== oi) } : q
      )
    );
  }

  async function importQuestions() {
    setImporting(true);
    const toImport = questions.filter((q) => q.enabled);
    const res = await fetch("/api/admin/agenda/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: toImport, status: importStatus }),
    });
    setImporting(false);
    if (res.ok) {
      setDone(true);
    } else {
      const d = await res.json();
      setError(d.error ?? "Import failed");
    }
  }

  const enabledCount = questions.filter((q) => q.enabled).length;
  const categories = questions.length > 0
    ? ["All", ...Array.from(new Set(questions.map((q) => q.category || "Uncategorized"))).sort()]
    : [];
  const [activeTab, setActiveTab] = useState("All");
  const visibleQuestions = activeTab === "All"
    ? questions.map((q, i) => ({ q, i }))
    : questions.map((q, i) => ({ q, i })).filter(({ q }) => (q.category || "Uncategorized") === activeTab);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Admin
        </Link>
        <h1 className="text-2xl font-bold">Import from Agenda</h1>
      </div>

      {/* Input section */}
      {questions.length === 0 && !done && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Upload PDF or paste agenda text</label>
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
                placeholder="Paste the full agenda text here…"
                rows={10}
                className="w-full border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={extract}
            disabled={extracting || (!text.trim() && !file)}
            className="bg-rose-600 text-white px-5 py-2 rounded hover:bg-rose-700 disabled:opacity-40 text-sm"
          >
            {extracting ? "Extracting questions…" : "Extract questions"}
          </button>
        </div>
      )}

      {/* Extracting spinner */}
      {extracting && (
        <div className="mt-8 text-center text-gray-400 text-sm">
          <div className="animate-spin inline-block w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full mb-2" />
          <p>Reading agenda and generating questions…</p>
        </div>
      )}

      {/* Review section */}
      {questions.length > 0 && !done && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-end gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Meeting date (auto-close all questions)</label>
              <input
                type="date"
                value={meetingStart.date}
                onChange={(e) => {
                  const date = e.target.value;
                  setMeetingStart((s) => ({ ...s, date }));
                  const closeAt = date ? `${date}T${meetingStart.time}` : "";
                  setQuestions((qs) => qs.map((q) => ({ ...q, closeAt })));
                }}
                className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Meeting start time</label>
              <input
                type="time"
                value={meetingStart.time}
                onChange={(e) => {
                  const time = e.target.value;
                  setMeetingStart((s) => ({ ...s, time }));
                  const closeAt = meetingStart.date ? `${meetingStart.date}T${time}` : "";
                  setQuestions((qs) => qs.map((q) => ({ ...q, closeAt })));
                }}
                className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <p className="text-xs text-gray-400">Predictions close at meeting start. You can override per-question below.</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {questions.length} question{questions.length !== 1 ? "s" : ""} extracted —{" "}
              {enabledCount} selected for import
            </p>
            <button
              onClick={() => { setQuestions([]); setFile(null); setText(""); setError(""); setActiveTab("All"); }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Start over
            </button>
          </div>

          <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-2">
            {categories.map((cat) => {
              const count = cat === "All" ? questions.length : questions.filter((q) => (q.category || "Uncategorized") === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeTab === cat
                      ? "bg-rose-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat} <span className="opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {visibleQuestions.map(({ q, i }) => (
            <div
              key={i}
              className={`bg-white border rounded-lg p-5 shadow-sm transition-opacity ${
                q.enabled ? "border-gray-200" : "border-gray-100 opacity-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={q.enabled}
                  onChange={(e) => updateQuestion(i, { enabled: e.target.checked })}
                  className="mt-1 accent-rose-600"
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">Question</label>
                    <input
                      value={q.title}
                      onChange={(e) => updateQuestion(i, { title: e.target.value })}
                      className="w-full border rounded px-3 py-1.5 text-sm mt-0.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Description</label>
                      <input
                        value={q.description}
                        onChange={(e) => updateQuestion(i, { description: e.target.value })}
                        className="w-full border rounded px-3 py-1.5 text-sm mt-0.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                    <div className="w-36">
                      <label className="text-xs text-gray-500">Category</label>
                      <input
                        value={q.category}
                        onChange={(e) => updateQuestion(i, { category: e.target.value })}
                        className="w-full border rounded px-3 py-1.5 text-sm mt-0.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                    <div className="w-44">
                      <label className="text-xs text-gray-500">Close date &amp; time</label>
                      <input
                        type="datetime-local"
                        value={q.closeAt ?? ""}
                        onChange={(e) => updateQuestion(i, { closeAt: e.target.value })}
                        className="w-full border rounded px-3 py-1.5 text-sm mt-0.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Source URL</label>
                    <input
                      value={q.sourceUrl ?? ""}
                      onChange={(e) => updateQuestion(i, { sourceUrl: e.target.value })}
                      placeholder="https://… (optional)"
                      className="w-full border rounded px-3 py-1.5 text-sm mt-0.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Options</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-1">
                          <input
                            value={opt}
                            onChange={(e) => updateOption(i, oi, e.target.value)}
                            className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 w-28"
                          />
                          {q.options.length > 2 && (
                            <button
                              onClick={() => removeOption(i, oi)}
                              className="text-gray-300 hover:text-red-400 text-base leading-none"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(i)}
                        className="text-xs text-rose-500 hover:underline"
                      >
                        + add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <label className="text-gray-600">Import as:</label>
              <select
                value={importStatus}
                onChange={(e) => setImportStatus(e.target.value as "PENDING" | "ACTIVE")}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="ACTIVE">Active (live immediately)</option>
                <option value="PENDING">Pending (needs approval)</option>
              </select>
            </div>
            <button
              onClick={importQuestions}
              disabled={importing || enabledCount === 0}
              className="bg-rose-600 text-white px-5 py-2 rounded hover:bg-rose-700 disabled:opacity-40 text-sm"
            >
              {importing ? "Importing…" : `Import ${enabledCount} question${enabledCount !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      )}

      {/* Success */}
      {done && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-green-700 font-medium mb-3">
            {enabledCount} question{enabledCount !== 1 ? "s" : ""} imported successfully
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/" className="text-sm text-rose-600 hover:underline">
              View predictions →
            </Link>
            <button
              onClick={() => { setDone(false); setQuestions([]); setFile(null); setText(""); }}
              className="text-sm text-gray-500 hover:underline"
            >
              Import another agenda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
