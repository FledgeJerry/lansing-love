"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import TimelineView from "./TimelineView";
import RelationshipView from "./RelationshipView";
import AccountingView from "./AccountingView";

// Leaflet map needs browser — load client-only
const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => (
  <div style={{ height: "560px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-surface)", borderRadius: "8px" }}>
    <span style={{ color: "var(--color-steel-muted)" }}>Loading map…</span>
  </div>
) });

const TABS = ["Accounting", "Map", "Relationships", "Timeline"] as const;
type Tab = typeof TABS[number];

type Props = {
  entities: ReturnType<typeof import("./page").default> extends Promise<infer R> ? never : unknown[];
  events: unknown[];
  relationships: unknown[];
  contextLayers: unknown[];
  dollarFlows: unknown[];
  isAdmin: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HistoryTabs({ entities, events, relationships, contextLayers, dollarFlows, isAdmin }: any) {
  const [active, setActive] = useState<Tab>("Accounting");
  const [showHidden, setShowHidden] = useState(false);

  // Admins receive the full graph (public + private) from the server; everyone else already
  // only ever received public data. Gate the private half behind this toggle so an admin's
  // default view still matches what the public sees, with an opt-in to review hidden entries.
  const revealHidden = isAdmin && showHidden;

  const visibleEntities = useMemo(
    () => (revealHidden ? entities : entities.filter((e: { isPublic?: boolean }) => e.isPublic !== false)),
    [entities, revealHidden]
  );
  const visibleEvents = useMemo(() => {
    const base = revealHidden ? events : events.filter((e: { isPublic?: boolean }) => e.isPublic !== false);
    return base.map((e: { entityEvents?: { entity: { isPublic?: boolean } }[] }) => ({
      ...e,
      entityEvents: revealHidden
        ? e.entityEvents
        : e.entityEvents?.filter((ee) => ee.entity.isPublic !== false),
    }));
  }, [events, revealHidden]);
  const visibleRelationships = useMemo(
    () =>
      revealHidden
        ? relationships
        : relationships.filter(
            (r: { fromEntity?: { isPublic?: boolean } | null; toEntity?: { isPublic?: boolean } | null }) =>
              (r.fromEntity?.isPublic ?? true) && (r.toEntity?.isPublic ?? true)
          ),
    [relationships, revealHidden]
  );
  const visibleFlows = useMemo(
    () => (revealHidden ? dollarFlows : dollarFlows.filter((f: { isPublic?: boolean }) => f.isPublic !== false)),
    [dollarFlows, revealHidden]
  );

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: active === tab ? "var(--color-dome-gold)" : "var(--color-border-strong)",
              background: active === tab ? "var(--color-dome-gold)" : "var(--color-surface)",
              color: active === tab ? "var(--color-midnight-steel)" : "var(--color-text-secondary)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              fontWeight: active === tab ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {tab}
          </button>
        ))}

        {isAdmin && (
          <label
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.8rem",
              color: showHidden ? "#c0392b" : "var(--color-steel-muted)",
              cursor: "pointer",
              padding: "0.4rem 0.75rem",
              borderRadius: "6px",
              border: `1px solid ${showHidden ? "rgba(192,57,43,0.4)" : "var(--color-border-strong)"}`,
              background: showHidden ? "rgba(192,57,43,0.08)" : "transparent",
            }}
          >
            <input type="checkbox" checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} />
            Show hidden (admin)
          </label>
        )}
      </div>

      {active === "Accounting" && (
        <AccountingView dollarFlows={visibleFlows} />
      )}
      {active === "Map" && (
        <MapView entities={visibleEntities} events={visibleEvents} />
      )}
      {active === "Relationships" && (
        <RelationshipView entities={visibleEntities} relationships={visibleRelationships} />
      )}
      {active === "Timeline" && (
        <TimelineView events={visibleEvents} contextLayers={contextLayers} />
      )}
    </div>
  );
}
