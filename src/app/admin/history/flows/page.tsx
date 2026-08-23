import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

function fmtDollars(cents: bigint | null): string {
  if (cents == null) return "—";
  return `$${(Number(cents) / 100).toLocaleString()}`;
}

export default async function DollarFlowsAdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const flows = await prisma.dollarFlow.findMany({
    orderBy: { flowDate: "desc" },
    include: { fromEntity: { select: { name: true } }, toEntity: { select: { name: true } } },
  });

  return (
    <div style={{ maxWidth: "1000px" }}>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/admin/history" style={{ color: "var(--color-steel-muted)" }}>History</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Dollar Flows
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1>Dollar Flows</h1>
        <Link href="/admin/history/flows/new" className="btn btn--primary btn--sm">+ New flow</Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {flows.map((f) => (
          <div key={f.id} className="card" style={{ padding: "0.85rem 1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontWeight: 600, color: "var(--color-limestone)" }}>{fmtDollars(f.amountCents)}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--color-limestone)", marginLeft: "0.6rem" }}>{f.description}</span>
              <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginLeft: "0.6rem" }}>
                {f.fromEntity?.name ?? "?"} → {f.toEntity?.name ?? "?"}
              </span>
              {!f.isPublic && <span className="badge" style={{ fontSize: "0.6rem", marginLeft: "0.5rem", background: "rgba(192,57,43,0.15)", color: "#c0392b" }}>Private</span>}
            </div>
            <Link href={`/admin/history/flows/${f.id}/edit`} className="btn btn--ghost btn--sm" style={{ fontSize: "0.75rem" }}>Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
