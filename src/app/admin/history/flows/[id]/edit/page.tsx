import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import DollarFlowForm from "../../DollarFlowForm";

export const dynamic = "force-dynamic";

export default async function EditDollarFlowPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");
  const { id } = await params;
  const row = await prisma.dollarFlow.findUnique({ where: { id: Number(id) } });
  if (!row) notFound();

  const initial = {
    description: row.description,
    flowType: row.flowType ?? "",
    amount: row.amountCents != null ? (Number(row.amountCents) / 100).toString() : "",
    fromEntityId: row.fromEntityId != null ? String(row.fromEntityId) : "",
    toEntityId: row.toEntityId != null ? String(row.toEntityId) : "",
    eventId: row.eventId != null ? String(row.eventId) : "",
    flowDate: row.flowDate ? row.flowDate.toISOString().slice(0, 10) : "",
    flowDateEnd: row.flowDateEnd ? row.flowDateEnd.toISOString().slice(0, 10) : "",
    isPublicCost: row.isPublicCost,
    isPrivateGain: row.isPrivateGain,
    sourceTier: row.sourceTier,
    sourceNote: row.sourceNote ?? "",
    sourceUrl: row.sourceUrl ?? "",
    isPublic: row.isPublic,
  };

  return (
    <div>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/admin/history/flows" style={{ color: "var(--color-steel-muted)" }}>Dollar Flows</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Edit
      </p>
      <h1 style={{ marginBottom: "2rem" }}>Edit Dollar Flow</h1>
      <DollarFlowForm initial={initial} id={row.id} />
    </div>
  );
}
