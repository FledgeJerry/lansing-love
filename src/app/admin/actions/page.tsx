import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ACTION_STATUS_LABELS, ACTION_STATUS_COLORS } from "@/lib/actionItemTypes";
import ActionFilters from "./ActionFilters";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ status?: string; subject?: string; source?: string }> };

export default async function ActionsAdminPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");
  const { status, subject, source } = await searchParams;

  const all = await prisma.actionItem.findMany({ orderBy: [{ status: "asc" }, { dueDate: "asc" }, { sortOrder: "asc" }] });
  const actions = all.filter((a) => {
    if (status && a.status !== status) return false;
    if (subject && !a.subjects.includes(subject)) return false;
    if (source && a.sourceType !== source) return false;
    return true;
  });

  const overdue = all.filter((a) => a.dueDate && a.dueDate < new Date() && a.status !== "done").length;

  return (
    <div style={{ maxWidth: "1000px" }}>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/admin" style={{ color: "var(--color-steel-muted)" }}>Admin</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Actions
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1>Actions</h1>
        <Link href="/admin/actions/new" className="btn btn--primary btn--sm">+ New action</Link>
      </div>
      {overdue > 0 && (
        <p style={{ fontSize: "0.8rem", color: "#c0392b", marginBottom: "1.5rem" }}>{overdue} overdue</p>
      )}

      <ActionFilters status={status} subject={subject} source={source} />
      <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "-1rem", marginBottom: "1rem" }}>{actions.length} of {all.length}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {actions.map((a) => {
          const overdueItem = a.dueDate && a.dueDate < new Date() && a.status !== "done";
          return (
            <Link key={a.id} href={`/admin/actions/${a.id}/edit`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "0.85rem 1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACTION_STATUS_COLORS[a.status as keyof typeof ACTION_STATUS_COLORS] ?? "#888", flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.88rem" }}>{a.title}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                    {a.sourceType && `${a.sourceType}: ${a.sourceSlug ?? a.sourcePhase} · `}
                    {a.responsible && `${a.responsible} · `}
                    {a.dueDate && <span style={{ color: overdueItem ? "#c0392b" : undefined }}>due {a.dueDate.toISOString().slice(0, 10)}</span>}
                  </div>
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--color-steel-muted)" }}>{ACTION_STATUS_LABELS[a.status as keyof typeof ACTION_STATUS_LABELS] ?? a.status}</span>
              </div>
            </Link>
          );
        })}
        {actions.length === 0 && <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>No actions match these filters.</p>}
      </div>
    </div>
  );
}
