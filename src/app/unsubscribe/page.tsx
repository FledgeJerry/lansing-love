"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function UnsubscribeContent() {
  const params = useSearchParams();
  const email = params.get("email");
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    if (!email) { setStatus("error"); return; }
    fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((r) => setStatus(r.ok ? "done" : "error"))
      .catch(() => setStatus("error"));
  }, [email]);

  return (
    <div style={{ maxWidth: "480px", textAlign: "center", padding: "4rem 0" }}>
      {status === "loading" && <p>Unsubscribing…</p>}
      {status === "done" && (
        <>
          <h1 style={{ marginBottom: "0.75rem" }}>You're unsubscribed</h1>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
            You won't receive prediction update emails anymore. You can re-enable them anytime from your profile.
          </p>
          <Link href="/" className="btn btn--secondary btn--sm">Back to lansing.love</Link>
        </>
      )}
      {status === "error" && (
        <>
          <h1 style={{ marginBottom: "0.75rem" }}>Something went wrong</h1>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
            We couldn't process your unsubscribe request. You can manage email settings from your profile.
          </p>
          <Link href="/profile" className="btn btn--secondary btn--sm">Go to profile</Link>
        </>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense>
      <UnsubscribeContent />
    </Suspense>
  );
}
