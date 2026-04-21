"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) {
      setSent(true);
    } else {
      const d = await res.json();
      setError(d.error ?? "Something went wrong");
    }
  }

  return (
    <div style={{ maxWidth: "420px", margin: "3rem auto" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Reset password</h1>
      <p style={{ marginBottom: "2rem" }}>We&apos;ll send you a link to set a new password.</p>

      {sent ? (
        <div className="card">
          <p style={{ color: "var(--color-teal-accent)", fontWeight: 600, marginBottom: "0.5rem" }}>Check your email</p>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            If <strong>{email}</strong> has an account, you&apos;ll get a reset link within a minute. Check your spam folder if it doesn&apos;t arrive.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <div className="alert alert--error">{error}</div>}
          <button type="submit" disabled={loading} className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }}>
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
        <Link href="/login" style={{ color: "var(--color-dome-gold)" }}>← Back to sign in</Link>
      </p>
    </div>
  );
}
