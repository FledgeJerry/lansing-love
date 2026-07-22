"use client";

import { useState, useMemo } from "react";

const ENTITY_COLORS: Record<string, string> = {
  person:       "#2E6DA4",
  organization: "#4A9B8E",
  property:     "#E8C84A",
  institution:  "#9AB0C8",
  media:        "#8B5CF6",
};

const SOURCE_COLORS: Record<string, string> = {
  S:   "#4A9B8E",
  FM:  "#2E6DA4",
  RC:  "#E8C84A",
  RHN: "#8B5CF6",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RelationshipView({ entities, relationships }: { entities: any[]; relationships: any[] }) {
  const [conflictsOnly, setConflictsOnly] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<number | null>(null);
  const [hoveredRel, setHoveredRel] = useState<number | null>(null);

  const filteredRels = useMemo(() => {
    let rels = relationships.filter((r) => r.fromEntity && r.toEntity);
    if (conflictsOnly) rels = rels.filter((r) => r.isConflict);
    if (selectedEntity !== null) {
      rels = rels.filter((r) =>
        r.fromEntity?.id === selectedEntity || r.toEntity?.id === selectedEntity
      );
    }
    return rels;
  }, [relationships, conflictsOnly, selectedEntity]);

  // Build the set of entity IDs actually in the filtered relationships
  const activeEntityIds = useMemo(() => {
    const ids = new Set<number>();
    filteredRels.forEach((r) => {
      if (r.fromEntity) ids.add(r.fromEntity.id);
      if (r.toEntity) ids.add(r.toEntity.id);
    });
    return ids;
  }, [filteredRels]);

  const visibleEntities = useMemo(() =>
    entities.filter((e) => activeEntityIds.has(e.id)),
    [entities, activeEntityIds]
  );

  // Simple circular layout — place entities around a circle
  const W = 800;
  const H = 600;
  const cx = W / 2;
  const cy = H / 2;
  const radius = Math.min(W, H) * 0.38;

  const entityPositions = useMemo(() => {
    const pos: Record<number, { x: number; y: number }> = {};
    const n = visibleEntities.length;
    visibleEntities.forEach((e, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      pos[e.id] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
    return pos;
  }, [visibleEntities, cx, cy, radius]);

  const conflictCount = relationships.filter((r) => r.isConflict).length;

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem", padding: "0.75rem 1rem", background: "var(--color-surface)", borderRadius: "8px", alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={conflictsOnly} onChange={(e) => setConflictsOnly(e.target.checked)} />
          Conflicts only ({conflictCount})
        </label>

        {selectedEntity !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>
              Focused: <strong style={{ color: "var(--color-text-primary)" }}>
                {entities.find((e) => e.id === selectedEntity)?.name ?? "unknown"}
              </strong>
            </span>
            <button
              onClick={() => setSelectedEntity(null)}
              style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "4px", background: "var(--color-surface-raised)", border: "1px solid var(--color-border-strong)", color: "var(--color-text-secondary)", cursor: "pointer" }}
            >
              Clear
            </button>
          </div>
        )}

        <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
          {filteredRels.length} relationships · {visibleEntities.length} nodes
        </span>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        {Object.entries(ENTITY_COLORS).map(([type, color]) => (
          <span key={type} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            {type}
          </span>
        ))}
        <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
          <span style={{ width: 24, height: 2, background: "#C0392B", display: "inline-block" }} />
          conflict
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
          <span style={{ width: 24, height: 2, background: "rgba(255,255,255,0.25)", display: "inline-block" }} />
          relationship
        </span>
      </div>

      {/* SVG Network */}
      <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid var(--color-border-strong)", background: "var(--color-surface)" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxHeight: "600px" }}>
          {/* Edges */}
          {filteredRels.map((rel) => {
            const from = entityPositions[rel.fromEntity?.id];
            const to = entityPositions[rel.toEntity?.id];
            if (!from || !to) return null;
            const isHovered = hoveredRel === rel.id;
            return (
              <g key={rel.id}>
                <line
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={rel.isConflict ? "#C0392B" : "rgba(255,255,255,0.15)"}
                  strokeWidth={rel.isConflict ? Math.max(1.5, rel.weight * 0.8) : Math.max(0.5, rel.weight * 0.5)}
                  strokeDasharray={rel.isConflict ? undefined : "4 4"}
                  opacity={isHovered ? 1 : (rel.isConflict ? 0.7 : 0.4)}
                />
                {/* Invisible fat hit target */}
                <line
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke="transparent"
                  strokeWidth={12}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredRel(rel.id)}
                  onMouseLeave={() => setHoveredRel(null)}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {visibleEntities.map((entity) => {
            const pos = entityPositions[entity.id];
            if (!pos) return null;
            const isSelected = selectedEntity === entity.id;
            const color = ENTITY_COLORS[entity.entityType] ?? "#888";
            const r = entity.familyStory ? 9 : 7;

            return (
              <g
                key={entity.id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedEntity(isSelected ? null : entity.id)}
              >
                <circle
                  cx={pos.x} cy={pos.y} r={r + 4}
                  fill="transparent"
                />
                <circle
                  cx={pos.x} cy={pos.y} r={r}
                  fill={color}
                  fillOpacity={0.85}
                  stroke={isSelected ? "white" : "rgba(255,255,255,0.3)"}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <text
                  x={pos.x}
                  y={pos.y - r - 5}
                  textAnchor="middle"
                  fontSize="9"
                  fill="rgba(244,241,232,0.75)"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {entity.name.split(/\s+/).slice(0, 2).join(" ")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hovered relationship detail */}
      {hoveredRel !== null && (() => {
        const rel = relationships.find((r) => r.id === hoveredRel);
        if (!rel) return null;
        return (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem 1rem", background: rel.isConflict ? "rgba(192,57,43,0.12)" : "var(--color-surface)", border: `1px solid ${rel.isConflict ? "#C0392B" : "var(--color-border-strong)"}`, borderRadius: "6px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "4px" }}>
              {rel.fromEntity?.name} → {rel.relationshipType.replace(/_/g, " ")} → {rel.toEntity?.name}
              {rel.isConflict && <span style={{ marginLeft: "8px", color: "#E87070", fontSize: "0.7rem" }}>⚠ CONFLICT</span>}
            </div>
            {rel.description && <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", margin: 0 }}>{rel.description}</p>}
            {rel.conflictNote && <p style={{ fontSize: "0.75rem", color: "#E87070", margin: "4px 0 0", fontStyle: "italic" }}>{rel.conflictNote}</p>}
            <div style={{ marginTop: "6px", fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
              Source: {rel.sourceTier}
              {rel.sourceNote && ` · ${rel.sourceNote}`}
            </div>
          </div>
        );
      })()}

      {/* Conflict table */}
      {conflictsOnly && filteredRels.filter((r) => r.isConflict).length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: "0.75rem", color: "var(--color-limestone)" }}>Documented Conflicts of Interest</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {filteredRels.filter((r) => r.isConflict).map((rel) => (
              <div key={rel.id} style={{ padding: "0.75rem", background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: "6px" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#E87070", marginBottom: "4px" }}>
                  {rel.fromEntity?.name} ↔ {rel.toEntity?.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                  {rel.relationshipType.replace(/_/g, " ")}
                </div>
                {rel.description && <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>{rel.description}</p>}
                {rel.conflictNote && <p style={{ fontSize: "0.75rem", color: "#E87070", margin: 0, fontStyle: "italic" }}>{rel.conflictNote}</p>}
                <div style={{ marginTop: "6px" }}>
                  <span style={{ fontSize: "0.65rem", padding: "1px 5px", borderRadius: "3px", background: `${SOURCE_COLORS[rel.sourceTier]}22`, color: SOURCE_COLORS[rel.sourceTier] ?? "#888" }}>
                    {rel.sourceTier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "0.75rem" }}>
        Click a node to focus. Hover an edge to see detail. Red solid lines = documented conflicts of interest.
      </p>
    </div>
  );
}
