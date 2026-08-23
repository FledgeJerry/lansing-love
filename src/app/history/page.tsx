import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
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
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const [entities, eventsRaw, relationshipsRaw, contextLayers, dollarFlows] = await Promise.all([
    prisma.entity.findMany({ where: isAdmin ? {} : { isPublic: true }, orderBy: { name: "asc" } }),
    prisma.historyEvent.findMany({
      where: isAdmin ? {} : { isPublic: true },
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
    prisma.dollarFlow.findMany({ where: isAdmin ? {} : { isPublic: true }, orderBy: { flowDate: "asc" } }),
  ]);

  // Not-public entities can still leak in via embedded includes above (entityEvents.entity,
  // fromEntity/toEntity) even though the top-level entities/relationships queries don't
  // return them directly — strip those out server-side, before anything is serialized to
  // the client, rather than relying on the view components to not render them. Admins get
  // the unfiltered graph (with isPublic carried through) so /history can offer them a
  // show-hidden toggle; everyone else never receives private data over the wire at all.
  const events = eventsRaw.map((e) => ({
    ...e,
    entityEvents: isAdmin ? e.entityEvents : e.entityEvents.filter((ee) => ee.entity.isPublic),
  }));
  const relationships = isAdmin
    ? relationshipsRaw
    : relationshipsRaw.filter((r) => (r.fromEntity?.isPublic ?? true) && (r.toEntity?.isPublic ?? true));

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
        isPublic: ee.entity.isPublic,
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
      isPublic: r.fromEntity.isPublic,
    } : null,
    toEntity: r.toEntity ? {
      id: r.toEntity.id,
      name: r.toEntity.name,
      entityType: r.toEntity.entityType,
      isPublic: r.toEntity.isPublic,
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
        isAdmin={isAdmin}
      />
    </div>
  );
}
