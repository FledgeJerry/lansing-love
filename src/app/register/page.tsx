"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: { preventDefault(): void; currentTarget: HTMLFormElement }) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
    } else {
      router.push("/login");
    }
  }

  return (
    <div style={{ maxWidth: "420px", margin: "3rem auto" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Join lansing.love</h1>
      <p style={{ marginBottom: "2rem" }}>Predict Lansing&apos;s future. Get on the leaderboard.</p>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Your name (shown on leaderboard)" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required minLength={8} placeholder="8+ characters" />
        </div>
        {error && <div className="alert alert--error">{error}</div>}
        <button type="submit" disabled={loading} className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--color-dome-gold)" }}>Sign in</Link>
      </p>
    </div>
  );
}
