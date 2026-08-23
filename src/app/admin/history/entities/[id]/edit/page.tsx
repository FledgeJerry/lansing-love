import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import EntityForm from "../../EntityForm";

export const dynamic = "force-dynamic";

export default async function EditEntityPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");
  const { id } = await params;
  const row = await prisma.entity.findUnique({ where: { id: Number(id) } });
  if (!row) notFound();

  const initial = {
    entityType: row.entityType,
    name: row.name,
    altNames: row.altNames,
    description: row.description ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    zip: row.zip ?? "",
    lat: row.lat != null ? String(row.lat) : "",
    lng: row.lng != null ? String(row.lng) : "",
    geoSource: row.geoSource ?? "",
    activeStart: row.activeStart ? row.activeStart.toISOString().slice(0, 10) : "",
    activeEnd: row.activeEnd ? row.activeEnd.toISOString().slice(0, 10) : "",
    sourceTier: row.sourceTier,
    sourceNote: row.sourceNote ?? "",
    sourceUrl: row.sourceUrl ?? "",
    domains: row.domains,
    bookChapter: row.bookChapter ?? "",
    timelineEntry: row.timelineEntry,
    mapPin: row.mapPin,
    familyStory: row.familyStory,
    isPublic: row.isPublic,
  };

  return (
    <div>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/admin/history/entities" style={{ color: "var(--color-steel-muted)" }}>Entities</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Edit
      </p>
      <h1 style={{ marginBottom: "2rem" }}>Edit Entity</h1>
      <EntityForm initial={initial} id={row.id} />
    </div>
  );
}
