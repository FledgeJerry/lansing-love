"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [options, setOptions] = useState(["Yes", "No"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return null;
  if (!session) {
    router.push("/login");
    return null;
  }

  function addOption() {
    setOptions([...options, ""]);
  }

  function updateOption(i: number, val: string) {
    setOptions(options.map((o, idx) => (idx === i ? val : o)));
  }

  function removeOption(i: number) {
    if (options.length <= 2) return;
    setOptions(options.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        description: fd.get("description"),
        category: fd.get("category"),
        closeAt: fd.get("closeAt") || null,
        options: options.filter((o) => o.trim()),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Submission failed");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Submit a prediction question</h1>
      <p className="text-gray-500 text-sm mb-6">
        Questions are reviewed by our admin before going live.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Question *</label>
          <input
            name="title"
            required
            placeholder="Will the downtown development be approved?"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Details</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Add context, source links, relevant background…"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            name="category"
            placeholder="e.g. Housing, Transit, Elections"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prediction closes on</label>
          <input
            name="closeAt"
            type="date"
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Options *</label>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
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
            onClick={addOption}
            className="mt-2 text-sm text-rose-600 hover:underline"
          >
            + Add option
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-600 text-white py-2 rounded hover:bg-rose-700 disabled:opacity-50 text-sm"
        >
          {loading ? "Submitting…" : "Submit for review"}
        </button>
      </form>
    </div>
  );
}
