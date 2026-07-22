"use client";

import { useState } from "react";
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

const TABS = ["Timeline", "Map", "Relationships", "Accounting"] as const;
type Tab = typeof TABS[number];

type Props = {
  entities: ReturnType<typeof import("./page").default> extends Promise<infer R> ? never : unknown[];
  events: unknown[];
  relationships: unknown[];
  contextLayers: unknown[];
  dollarFlows: unknown[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HistoryTabs({ entities, events, relationships, contextLayers, dollarFlows }: any) {
  const [active, setActive] = useState<Tab>("Timeline");

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
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
      </div>

      {active === "Timeline" && (
        <TimelineView events={events} contextLayers={contextLayers} />
      )}
      {active === "Map" && (
        <MapView entities={entities} events={events} />
      )}
      {active === "Relationships" && (
        <RelationshipView entities={entities} relationships={relationships} />
      )}
      {active === "Accounting" && (
        <AccountingView dollarFlows={dollarFlows} />
      )}
    </div>
  );
}
