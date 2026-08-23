import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EntitiesAdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const entities = await prisma.entity.findMany({ orderBy: { name: "asc" } });

  return (
    <div style={{ maxWidth: "900px" }}>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/admin/history" style={{ color: "var(--color-steel-muted)" }}>History</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Entities
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1>Entities</h1>
        <Link href="/admin/history/entities/new" className="btn btn--primary btn--sm">+ New entity</Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {entities.map((e) => (
          <div key={e.id} className="card" style={{ padding: "0.85rem 1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontWeight: 600, color: "var(--color-limestone)" }}>{e.name}</span>
              <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginLeft: "0.6rem" }}>{e.entityType}</span>
              {!e.isPublic && <span className="badge" style={{ fontSize: "0.6rem", marginLeft: "0.5rem", background: "rgba(192,57,43,0.15)", color: "#c0392b" }}>Private</span>}
            </div>
            <Link href={`/admin/history/entities/${e.id}/edit`} className="btn btn--ghost btn--sm" style={{ fontSize: "0.75rem" }}>Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
