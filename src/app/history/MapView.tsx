"use client";

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ENTITY_COLORS: Record<string, string> = {
  person:       "#2E6DA4", // river blue
  organization: "#4A9B8E", // teal
  property:     "#E8C84A", // dome gold
  institution:  "#9AB0C8", // steel muted
  media:        "#8B5CF6", // purple
};

const SOURCE_COLORS: Record<string, string> = {
  S:   "#4A9B8E",
  FM:  "#2E6DA4",
  RC:  "#E8C84A",
  RHN: "#8B5CF6",
};

const DOMAINS = ["All", "housing", "food", "healthcare", "labor", "governance", "education", "environment", "energy", "justice", "technology"] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MapView({ entities, events }: { entities: any[]; events: any[] }) {
  const [domain, setDomain] = useState("All");
  const [showEntities, setShowEntities] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [showFamily, setShowFamily] = useState(true);

  const filteredEntities = useMemo(() => entities.filter((e) => {
    if (!e.mapPin || e.lat == null || e.lng == null) return false;
    if (!showEntities) return false;
    if (!showFamily && e.familyStory) return false;
    if (domain !== "All" && !e.domains?.includes(domain)) return false;
    return true;
  }), [entities, domain, showEntities, showFamily]);

  const filteredEvents = useMemo(() => events.filter((e) => {
    if (!e.mapVisible || e.lat == null || e.lng == null) return false;
    if (!showEvents) return false;
    if (!showFamily && e.familyStory) return false;
    if (domain !== "All" && !e.domains?.includes(domain)) return false;
    return true;
  }), [events, domain, showEvents, showFamily]);

  function formatEventDate(iso: string | null, precision: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    if (precision === "year") return d.getFullYear().toString();
    if (precision === "month") return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem", padding: "0.75rem 1rem", background: "var(--color-surface)", borderRadius: "8px" }}>
        <label style={filterLabelStyle}>
          Domain
          <select value={domain} onChange={(e) => setDomain(e.target.value)} style={selectStyle}>
            {DOMAINS.map((d) => <option key={d} value={d}>{d === "All" ? "All domains" : d}</option>)}
          </select>
        </label>

        <label style={{ ...filterLabelStyle, cursor: "pointer" }}>
          <input type="checkbox" checked={showEntities} onChange={(e) => setShowEntities(e.target.checked)} />
          Places & orgs
        </label>
        <label style={{ ...filterLabelStyle, cursor: "pointer" }}>
          <input type="checkbox" checked={showEvents} onChange={(e) => setShowEvents(e.target.checked)} />
          Events
        </label>
        <label style={{ ...filterLabelStyle, cursor: "pointer" }}>
          <input type="checkbox" checked={showFamily} onChange={(e) => setShowFamily(e.target.checked)} />
          Family story
        </label>

        <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--color-text-muted)", alignSelf: "center" }}>
          {filteredEntities.length} places · {filteredEvents.length} events
        </span>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        {Object.entries(ENTITY_COLORS).map(([type, color]) => (
          <span key={type} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.3)" }} />
            {type}
          </span>
        ))}
        <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
          <span style={{ width: 10, height: 10, borderRadius: "2px", background: "#C0392B", flexShrink: 0 }} />
          event
        </span>
      </div>

      <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid var(--color-border-strong)" }}>
        <MapContainer
          center={[42.733, -84.555]}
          zoom={12}
          style={{ height: "560px", width: "100%", background: "#163044" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {filteredEntities.map((entity) => (
            <CircleMarker
              key={`e-${entity.id}`}
              center={[entity.lat, entity.lng]}
              radius={entity.familyStory ? 8 : 6}
              pathOptions={{
                color: "rgba(255,255,255,0.4)",
                weight: entity.familyStory ? 2 : 1,
                fillColor: ENTITY_COLORS[entity.entityType] ?? "#888",
                fillOpacity: 0.85,
              }}
            >
              <Popup>
                <div style={{ minWidth: "200px" }}>
                  <div style={{ fontWeight: 600, marginBottom: "4px" }}>{entity.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginBottom: "6px" }}>
                    {entity.entityType}
                    {entity.address && ` · ${entity.address}, ${entity.city}`}
                  </div>
                  {entity.description && (
                    <p style={{ fontSize: "0.8rem", margin: "0 0 6px" }}>{entity.description}</p>
                  )}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: "0.65rem",
                      padding: "1px 5px",
                      borderRadius: "3px",
                      background: `${SOURCE_COLORS[entity.sourceTier]}22`,
                      color: SOURCE_COLORS[entity.sourceTier] ?? "#888",
                      border: `1px solid ${SOURCE_COLORS[entity.sourceTier]}55`,
                    }}>
                      {entity.sourceTier}
                    </span>
                    {entity.familyStory && (
                      <span style={{ fontSize: "0.65rem", padding: "1px 5px", borderRadius: "3px", background: "rgba(46,109,164,0.15)", color: "#6BA8D8", border: "1px solid rgba(46,109,164,0.3)" }}>
                        family
                      </span>
                    )}
                  </div>
                  {entity.domains?.length > 0 && (
                    <div style={{ marginTop: "4px", fontSize: "0.65rem", color: "#999" }}>
                      {entity.domains.join(", ")}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {filteredEvents.map((event) => (
            <CircleMarker
              key={`ev-${event.id}`}
              center={[event.lat, event.lng]}
              radius={4 + Math.max(0, event.significance - 3)}
              pathOptions={{
                color: "rgba(255,255,255,0.3)",
                weight: 1,
                fillColor: "#C0392B",
                fillOpacity: 0.75,
              }}
            >
              <Popup>
                <div style={{ minWidth: "200px" }}>
                  <div style={{ fontSize: "0.7rem", color: "#999", marginBottom: "2px" }}>
                    {formatEventDate(event.eventDate, event.datePrecision)}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: "4px" }}>{event.title}</div>
                  {event.description && (
                    <p style={{ fontSize: "0.8rem", margin: "0 0 6px" }}>
                      {event.description.slice(0, 200)}{event.description.length > 200 ? "…" : ""}
                    </p>
                  )}
                  <span style={{
                    fontSize: "0.65rem",
                    padding: "1px 5px",
                    borderRadius: "3px",
                    background: `${SOURCE_COLORS[event.sourceTier]}22`,
                    color: SOURCE_COLORS[event.sourceTier] ?? "#888",
                  }}>
                    {event.sourceTier}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
        Circle size = significance. Filled dot = family story. S = sourced · FM = family memory · RC = requires confirmation · RHN = Rhinoceros Media.
      </p>
    </div>
  );
}

const filterLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  fontSize: "0.8rem",
  color: "var(--color-steel-muted)",
};

const selectStyle: React.CSSProperties = {
  background: "var(--color-surface-raised)",
  color: "var(--color-text-primary)",
  border: "1px solid var(--color-border-strong)",
  borderRadius: "4px",
  padding: "2px 6px",
  fontSize: "0.8rem",
  fontFamily: "var(--font-sans)",
};
