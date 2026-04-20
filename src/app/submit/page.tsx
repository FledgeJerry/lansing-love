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
  if (!session) { router.push("/login"); return null; }

  function addOption() { setOptions([...options, ""]); }
  function updateOption(i: number, val: string) { setOptions(options.map((o, idx) => (idx === i ? val : o))); }
  function removeOption(i: number) { if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e: { preventDefault(): void; currentTarget: HTMLFormElement }) {
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
    <div style={{ maxWidth: "600px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Submit a question</h1>
      <p style={{ marginBottom: "2rem" }}>
        Questions are reviewed by our admin before going live.
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor="title">Question *</label>
          <input id="title" name="title" required placeholder="Will the downtown development be approved?" />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor="description">Context</label>
          <textarea id="description" name="description" placeholder="Add background, source links, relevant details…" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="category">Category</label>
            <input id="category" name="category" placeholder="e.g. Housing, Transit, Budget" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="closeAt">Closes on</label>
            <input id="closeAt" name="closeAt" type="date" />
          </div>
        </div>

        <div>
          <label>Options *</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {options.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  style={{ flex: 1 }}
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(i)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "1.25rem", lineHeight: 1, padding: "0 0.25rem" }}>
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addOption}
            style={{ marginTop: "0.5rem", background: "none", border: "none", cursor: "pointer", color: "var(--color-dome-gold)", fontSize: "0.85rem", fontFamily: "var(--font-sans)", padding: 0 }}>
            + Add option
          </button>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <button type="submit" disabled={loading} className="btn btn--primary" style={{ justifyContent: "center" }}>
          {loading ? "Submitting…" : "Submit for review"}
        </button>
      </form>
    </div>
  );
}
