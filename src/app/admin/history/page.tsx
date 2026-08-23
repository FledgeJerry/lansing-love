import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HistoryAdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const [entityCount, eventCount, flowCount, privateCount] = await Promise.all([
    prisma.entity.count(),
    prisma.historyEvent.count(),
    prisma.dollarFlow.count(),
    Promise.all([
      prisma.entity.count({ where: { isPublic: false } }),
      prisma.historyEvent.count({ where: { isPublic: false } }),
      prisma.dollarFlow.count({ where: { isPublic: false } }),
    ]).then(([a, b, c]) => a + b + c),
  ]);

  const sections = [
    { href: "/admin/history/entities", label: "Entities", desc: "People, organizations, properties, institutions, media", count: entityCount },
    { href: "/admin/history/events", label: "Events", desc: "Timeline & map events, with entity links", count: eventCount },
    { href: "/admin/history/flows", label: "Dollar Flows", desc: "Accounting ledger — public costs, private gains", count: flowCount },
  ];

  return (
    <div style={{ maxWidth: "900px" }}>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/admin" style={{ color: "var(--color-steel-muted)" }}>Admin</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        History Data
      </p>
      <h1 style={{ marginBottom: "0.5rem" }}>History Data</h1>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "2rem" }}>
        Powers /history (Timeline, Map, Relationships, Accounting). {privateCount > 0 && (
          <span style={{ color: "#c0392b" }}> {privateCount} item{privateCount === 1 ? "" : "s"} currently marked private and hidden from the public site.</span>
        )}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
        {sections.map(({ href, label, desc, count }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div className="card" style={{ padding: "1rem 1.25rem", height: "100%", cursor: "pointer" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-limestone)", margin: 0 }}>{count}</p>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", margin: "0.35rem 0 0" }}>{label}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", margin: "0.2rem 0 0" }}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
