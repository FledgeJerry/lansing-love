"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/login?reset=1");
    } else {
      const d = await res.json();
      setError(d.error ?? "Something went wrong");
    }
  }

  if (!token || !email) {
    return (
      <div className="card">
        <p style={{ color: "var(--color-text-muted)" }}>Invalid reset link. Please <Link href="/forgot-password" style={{ color: "var(--color-dome-gold)" }}>request a new one</Link>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="form-group">
        <label htmlFor="password">New password</label>
        <div style={{ position: "relative" }}>
          <input
            id="password"
            type={showPw ? "text" : "password"}
            required
            minLength={8}
            placeholder="8+ characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingRight: "3rem" }}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            style={{
              position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--color-text-muted)", fontSize: "0.8rem", fontFamily: "var(--font-sans)",
            }}
          >
            {showPw ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {error && <div className="alert alert--error">{error}</div>}
      <button type="submit" disabled={loading} className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }}>
        {loading ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ maxWidth: "420px", margin: "3rem auto" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Set new password</h1>
      <p style={{ marginBottom: "2rem" }}>Choose a new password for your account.</p>
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
      <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
        <Link href="/login" style={{ color: "var(--color-dome-gold)" }}>← Back to sign in</Link>
      </p>
    </div>
  );
}
