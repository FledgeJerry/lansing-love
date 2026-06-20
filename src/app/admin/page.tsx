"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Stats = {
  questionsByStatus: { status: string; count: number }[];
  newUsersThisWeek: number;
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") { router.push("/"); return; }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN") return;
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, [session]);

  if (status === "loading") return <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>;

  const pendingCount = stats?.questionsByStatus.find((s) => s.status === "PENDING")?.count ?? 0;
  const readyToResolveCount = stats?.questionsByStatus.find((s) => s.status === "CLOSED")?.count ?? 0;
  const newUsers = stats?.newUsersThisWeek ?? 0;

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>Admin</h1>

      {/* ── Needs attention ── */}
      <section style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>
          Needs attention
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
          <AttentionCard
            href="/admin/predictions?tab=pending"
            count={pendingCount}
            label="Pending questions"
            tone={pendingCount > 0 ? "gold" : "muted"}
          />
          <AttentionCard
            href="/admin/predictions?tab=resolve"
            count={readyToResolveCount}
            label="Ready to resolve"
            tone={readyToResolveCount > 0 ? "blue" : "muted"}
          />
          <AttentionCard
            href="/admin/users"
            count={newUsers}
            label="New users this week"
            tone="teal"
          />
        </div>
      </section>

      {/* ── Everything else, equal weight ── */}
      <section>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>
          Manage
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
          {[
            { href: "/admin/advocacy",      label: "Civic Advocacy Log",   desc: "Log council contacts, testimony, endorsements, anchor meetings" },
            { href: "/admin/boards",        label: "Boards & Commissions", desc: "44 boards — members, terms, vacancies" },
            { href: "/admin/neighborhoods", label: "Neighborhood Orgs",    desc: "59 registered neighborhood organizations" },
            { href: "/admin/case-studies",  label: "Case Studies",        desc: "Board accountability reports" },
            { href: "/admin/predictions",   label: "Predictions",         desc: "Review, resolve, and edit prediction questions" },
            { href: "/admin/agenda",        label: "Import from Agenda",  desc: "Generate questions from a council agenda" },
            { href: "/admin/transcript",    label: "Resolve from Transcript", desc: "Resolve questions from a meeting transcript" },
            { href: "/admin/users",         label: "Users",               desc: "Roles, subscriptions, demographics" },
            { href: "/admin/stats",         label: "Stats",               desc: "Engagement, accuracy, signups" },
          ].map(({ href, label, desc }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "0.875rem 1rem", height: "100%", cursor: "pointer" }}>
                <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", margin: 0 }}>{label}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", margin: "0.2rem 0 0" }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function AttentionCard({
  href, count, label, tone,
}: { href: string; count: number; label: string; tone: "gold" | "blue" | "teal" | "muted" }) {
  const colors: Record<string, string> = {
    gold: "var(--color-dome-gold)",
    blue: "var(--color-river-blue)",
    teal: "var(--color-teal-accent)",
    muted: "var(--color-text-muted)",
  };
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div className="card" style={{ padding: "1rem 1.25rem", cursor: "pointer", borderLeft: `3px solid ${colors[tone]}` }}>
        <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-limestone)", margin: 0 }}>{count}</p>
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", margin: "0.2rem 0 0" }}>{label}</p>
      </div>
    </Link>
  );
}
