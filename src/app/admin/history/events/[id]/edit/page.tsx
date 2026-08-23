import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import EventForm from "../../EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");
  const { id } = await params;
  const row = await prisma.historyEvent.findUnique({
    where: { id: Number(id) },
    include: { entityEvents: true },
  });
  if (!row) notFound();

  const initial = {
    title: row.title,
    description: row.description ?? "",
    eventType: row.eventType,
    eventDate: row.eventDate ? row.eventDate.toISOString().slice(0, 10) : "",
    eventDateEnd: row.eventDateEnd ? row.eventDateEnd.toISOString().slice(0, 10) : "",
    datePrecision: row.datePrecision,
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    lat: row.lat != null ? String(row.lat) : "",
    lng: row.lng != null ? String(row.lng) : "",
    dollarAmount: row.dollarAmount != null ? (Number(row.dollarAmount) / 100).toString() : "",
    dollarNote: row.dollarNote ?? "",
    sourceTier: row.sourceTier,
    sourceNote: row.sourceNote ?? "",
    sourceUrl: row.sourceUrl ?? "",
    domains: row.domains,
    timelineVisible: row.timelineVisible,
    mapVisible: row.mapVisible,
    significance: row.significance,
    bookChapter: row.bookChapter ?? "",
    familyStory: row.familyStory,
    era: row.era ?? "",
    isPublic: row.isPublic,
    entityEvents: row.entityEvents.map((ee) => ({ entityId: ee.entityId, role: ee.role })),
  };

  return (
    <div>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/admin/history/events" style={{ color: "var(--color-steel-muted)" }}>Events</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Edit
      </p>
      <h1 style={{ marginBottom: "2rem" }}>Edit Event</h1>
      <EventForm initial={initial} id={row.id} />
    </div>
  );
}
