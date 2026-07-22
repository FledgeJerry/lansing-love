import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import HistoryTabs from "./HistoryTabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lansing Raised Me",
  description: "An interactive map, relationship network, and merged timeline tracing Lansing's history through land, labor, family, and accountability.",
  alternates: { canonical: "/history" },
  openGraph: {
    title: "Lansing Raised Me | lansing.love",
    description: "Interactive map and timeline of Lansing's history — from the 1937 Labor Holiday to the I-496 displacement to the LHC conflict network.",
    url: "https://lansing.love/history",
  },
};

export default async function HistoryPage() {
  const [entities, events, relationships, contextLayers, dollarFlows] = await Promise.all([
    prisma.entity.findMany({ orderBy: { name: "asc" } }),
    prisma.historyEvent.findMany({
      orderBy: { eventDate: "asc" },
      include: {
        eventContexts: { include: { context: true } },
        entityEvents: { include: { entity: true } },
      },
    }),
    prisma.entityRelation.findMany({
      include: {
        fromEntity: true,
        toEntity: true,
      },
      orderBy: { weight: "desc" },
    }),
    prisma.contextLayer.findMany({ orderBy: { startDate: "asc" } }),
    prisma.dollarFlow.findMany({ orderBy: { flowDate: "asc" } }),
  ]);

  // Serialize: convert Decimal → number, BigInt → string, Date → ISO string
  const serializedEntities = entities.map((e) => ({
    ...e,
    lat: e.lat ? Number(e.lat) : null,
    lng: e.lng ? Number(e.lng) : null,
    activeStart: e.activeStart?.toISOString() ?? null,
    activeEnd: e.activeEnd?.toISOString() ?? null,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));

  const serializedEvents = events.map((e) => ({
    ...e,
    lat: e.lat ? Number(e.lat) : null,
    lng: e.lng ? Number(e.lng) : null,
    dollarAmount: e.dollarAmount?.toString() ?? null,
    eventDate: e.eventDate?.toISOString() ?? null,
    eventDateEnd: e.eventDateEnd?.toISOString() ?? null,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    eventContexts: e.eventContexts.map((ec) => ({
      contextId: ec.contextId,
      context: {
        ...ec.context,
        startDate: ec.context.startDate.toISOString(),
        endDate: ec.context.endDate?.toISOString() ?? null,
        opacity: ec.context.opacity ? Number(ec.context.opacity) : null,
        createdAt: ec.context.createdAt.toISOString(),
      },
    })),
    entityEvents: e.entityEvents.map((ee) => ({
      role: ee.role,
      entity: {
        id: ee.entity.id,
        name: ee.entity.name,
        entityType: ee.entity.entityType,
      },
    })),
  }));

  const serializedRelationships = relationships.map((r) => ({
    ...r,
    startDate: r.startDate?.toISOString() ?? null,
    endDate: r.endDate?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    fromEntity: r.fromEntity ? {
      id: r.fromEntity.id,
      name: r.fromEntity.name,
      entityType: r.fromEntity.entityType,
    } : null,
    toEntity: r.toEntity ? {
      id: r.toEntity.id,
      name: r.toEntity.name,
      entityType: r.toEntity.entityType,
    } : null,
  }));

  const serializedLayers = contextLayers.map((cl) => ({
    ...cl,
    startDate: cl.startDate.toISOString(),
    endDate: cl.endDate?.toISOString() ?? null,
    opacity: cl.opacity ? Number(cl.opacity) : null,
    createdAt: cl.createdAt.toISOString(),
  }));

  const serializedFlows = dollarFlows.map((f) => ({
    ...f,
    amountCents: f.amountCents?.toString() ?? null,
    flowDate: f.flowDate?.toISOString() ?? null,
    flowDateEnd: f.flowDateEnd?.toISOString() ?? null,
    createdAt: f.createdAt.toISOString(),
  }));

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <span className="eyebrow">Lansing Raised Me</span>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "0.5rem", lineHeight: 1.2 }}>
          Map · Timeline · Relationships
        </h1>
        <p style={{ color: "var(--color-steel-muted)", fontSize: "0.95rem", maxWidth: "680px" }}>
          The land, the labor, the family, and the accountability gaps — all on one axis.
        </p>
      </div>

      <HistoryTabs
        entities={serializedEntities}
        events={serializedEvents}
        relationships={serializedRelationships}
        contextLayers={serializedLayers}
        dollarFlows={serializedFlows}
      />
    </div>
  );
}
