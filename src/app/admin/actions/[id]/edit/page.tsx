import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ActionItemForm from "../../ActionItemForm";

export const dynamic = "force-dynamic";

export default async function EditActionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");
  const { id } = await params;
  const row = await prisma.actionItem.findUnique({ where: { id } });
  if (!row) notFound();

  const initial = {
    title: row.title,
    description: row.description ?? "",
    status: row.status,
    horizon: row.horizon ?? "",
    subjects: row.subjects,
    dueDate: row.dueDate ? row.dueDate.toISOString().slice(0, 10) : "",
    responsible: row.responsible ?? "",
    sourceType: row.sourceType ?? "",
    sourceSlug: row.sourceSlug ?? "",
    sourcePhase: row.sourcePhase ?? "",
    closedNote: row.closedNote ?? "",
  };

  return (
    <div>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/admin/actions" style={{ color: "var(--color-steel-muted)" }}>Actions</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Edit
      </p>
      <h1 style={{ marginBottom: "2rem" }}>Edit Action</h1>
      <ActionItemForm initial={initial} id={row.id} />
    </div>
  );
}
