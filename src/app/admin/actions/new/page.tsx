import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ActionItemForm from "../ActionItemForm";

type Props = { searchParams: Promise<{ sourceType?: string; sourceSlug?: string; sourcePhase?: string }> };

export default async function NewActionPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");
  const { sourceType, sourceSlug, sourcePhase } = await searchParams;
  return (
    <div>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/admin/actions" style={{ color: "var(--color-steel-muted)" }}>Actions</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        New
      </p>
      <h1 style={{ marginBottom: "2rem" }}>New Action</h1>
      <ActionItemForm initial={{ sourceType: sourceType ?? "", sourceSlug: sourceSlug ?? "", sourcePhase: sourcePhase ?? "" }} />
    </div>
  );
}
