"use client";

import { useState, useMemo } from "react";

const SOURCE_COLORS: Record<string, string> = {
  S:   "#4A9B8E", // teal — sourced
  FM:  "#2E6DA4", // river blue — family memory
  RC:  "#E8C84A", // dome gold — requires confirmation
  RHN: "#8B5CF6", // purple — Rhinoceros Media
};

const SOURCE_LABELS: Record<string, string> = {
  S:   "Sourced",
  FM:  "Family Memory",
  RC:  "RC",
  RHN: "Rhinoceros",
};

const ERAS = ["All", "colonial", "founding", "industrial_rise", "wartime", "postwar", "labor", "highway", "deindustrial", "repackaging", "current"] as const;
const TYPES = ["All", "civic", "family", "national", "environmental", "labor", "legal", "financial", "political", "physical"] as const;
const DOMAINS = ["All", "housing", "food", "healthcare", "labor", "governance", "education", "environment", "energy", "justice", "technology"] as const;
const SIGS = [1, 2, 3, 4, 5] as const;

function formatDate(iso: string | null, precision: string): string {
  if (!iso) return "Date unknown";
  const d = new Date(iso);
  if (precision === "year") return d.getFullYear().toString();
  if (precision === "month") return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  if (precision === "decade") return `${Math.floor(d.getFullYear() / 10) * 10}s`;
  if (precision === "approximate") return `~${d.getFullYear()}`;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TimelineView({ events, contextLayers }: { events: any[]; contextLayers: any[] }) {
  const [era, setEra] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [domain, setDomain] = useState<string>("All");
  const [minSig, setMinSig] = useState(3);
  const [familyOnly, setFamilyOnly] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => events.filter((e) => {
    if (!e.timelineVisible) return false;
    if (era !== "All" && e.era !== era) return false;
    if (type !== "All" && e.eventType !== type) return false;
    if (domain !== "All" && !e.domains?.includes(domain)) return false;
    if (e.significance < minSig) return false;
    if (familyOnly && !e.familyStory) return false;
    return true;
  }), [events, era, type, domain, minSig, familyOnly]);

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem", padding: "1rem", background: "var(--color-surface)", borderRadius: "8px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>
          Era
          <select value={era} onChange={(e) => setEra(e.target.value)} style={selectStyle}>
            {ERAS.map((e) => <option key={e} value={e}>{e === "All" ? "All eras" : e.replace(/_/g, " ")}</option>)}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
            {TYPES.map((t) => <option key={t} value={t}>{t === "All" ? "All types" : t}</option>)}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>
          Domain
          <select value={domain} onChange={(e) => setDomain(e.target.value)} style={selectStyle}>
            {DOMAINS.map((d) => <option key={d} value={d}>{d === "All" ? "All domains" : d}</option>)}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>
          Min significance
          <select value={minSig} onChange={(e) => setMinSig(Number(e.target.value))} style={selectStyle}>
            {SIGS.map((s) => <option key={s} value={s}>{s}+</option>)}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--color-steel-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={familyOnly} onChange={(e) => setFamilyOnly(e.target.checked)} />
          Family story only
        </label>

        <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--color-text-muted)", alignSelf: "center" }}>
          {filtered.length} of {events.length} events
        </span>
      </div>

      {/* Source tier legend */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {Object.entries(SOURCE_LABELS).map(([tier, label]) => (
          <span key={tier} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: SOURCE_COLORS[tier], flexShrink: 0 }} />
            {tier} — {label}
          </span>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Spine */}
        <div style={{ position: "absolute", left: "7px", top: 0, bottom: 0, width: "2px", background: "var(--color-border-strong)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {filtered.map((event, idx) => {
            const isOpen = expanded.has(event.id);
            const prevEvent = idx > 0 ? filtered[idx - 1] : null;
            const prevYear = prevEvent?.eventDate ? new Date(prevEvent.eventDate).getFullYear() : null;
            const thisYear = event.eventDate ? new Date(event.eventDate).getFullYear() : null;
            const showYearBreak = thisYear && prevYear && thisYear - prevYear > 5;

            return (
              <div key={event.id}>
                {showYearBreak && (
                  <div style={{ paddingLeft: "32px", margin: "1rem 0 0.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", fontVariantNumeric: "tabular-nums" }}>
                      ── {thisYear}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "0.75rem 0",
                    paddingLeft: "0",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                  onClick={() => toggle(event.id)}
                >
                  {/* Dot */}
                  <div style={{ flexShrink: 0, width: "16px", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "4px" }}>
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        border: `2px solid ${SOURCE_COLORS[event.sourceTier] ?? "#888"}`,
                        background: event.familyStory ? SOURCE_COLORS[event.sourceTier] : "var(--color-background)",
                        flexShrink: 0,
                        marginLeft: "2px",
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                        paddingTop: "2px",
                        minWidth: "80px",
                      }}>
                        {formatDate(event.eventDate, event.datePrecision)}
                      </span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            color: event.significance >= 5 ? "var(--color-limestone)" : "var(--color-text-primary)",
                            lineHeight: 1.3,
                          }}>
                            {event.title}
                          </span>
                          {event.familyStory && (
                            <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: "3px", background: "rgba(46,109,164,0.2)", color: "#6BA8D8", whiteSpace: "nowrap" }}>
                              family
                            </span>
                          )}
                          {event.isPublic === false && (
                            <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: "3px", background: "rgba(192,57,43,0.15)", color: "#c0392b", whiteSpace: "nowrap" }}>
                              Private
                            </span>
                          )}
                          <span style={{
                            fontSize: "0.65rem",
                            padding: "1px 6px",
                            borderRadius: "3px",
                            background: `${SOURCE_COLORS[event.sourceTier]}22`,
                            color: SOURCE_COLORS[event.sourceTier] ?? "#888",
                            whiteSpace: "nowrap",
                          }}>
                            {event.sourceTier}
                          </span>
                          {"★".repeat(Math.max(0, event.significance - 3)).padEnd(0)}
                        </div>

                        {/* Domain tags */}
                        {event.domains?.length > 0 && (
                          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                            {event.domains.slice(0, 4).map((d: string) => (
                              <span key={d} style={{ fontSize: "0.65rem", padding: "1px 5px", borderRadius: "3px", background: "var(--color-surface-raised)", color: "var(--color-text-muted)" }}>
                                {d}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Expanded content */}
                        {isOpen && (
                          <div style={{ marginTop: "0.75rem" }}>
                            {event.description && (
                              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "0.5rem" }}>
                                {event.description}
                              </p>
                            )}

                            {event.entityEvents?.length > 0 && (
                              <div style={{ marginTop: "0.5rem" }}>
                                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>People & orgs: </span>
                                {event.entityEvents.map((ee: { entity: { name: string; isPublic?: boolean }; role: string }, i: number) => (
                                  <span key={i} style={{ fontSize: "0.75rem", color: ee.entity.isPublic === false ? "#c0392b" : "var(--color-steel-muted)" }}>
                                    {i > 0 ? ", " : ""}{ee.entity.name}{ee.entity.isPublic === false ? " (private)" : ""} <em style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>({ee.role})</em>
                                  </span>
                                ))}
                              </div>
                            )}

                            {event.eventContexts?.length > 0 && (
                              <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                {event.eventContexts.map((ec: { context: { name: string; colorCode?: string } }, i: number) => (
                                  <span key={i} style={{
                                    fontSize: "0.7rem",
                                    padding: "2px 6px",
                                    borderRadius: "3px",
                                    border: `1px solid ${ec.context.colorCode ?? "#555"}`,
                                    color: ec.context.colorCode ?? "#888",
                                  }}>
                                    {ec.context.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {event.sourceNote && (
                              <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "0.5rem", fontStyle: "italic" }}>
                                Source: {event.sourceNote}
                                {event.sourceUrl && (
                                  <> · <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-link)" }}>link</a></>
                                )}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginLeft: "auto", paddingTop: "2px" }}>
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            No events match these filters.
          </div>
        )}
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  background: "var(--color-surface-raised)",
  color: "var(--color-text-primary)",
  border: "1px solid var(--color-border-strong)",
  borderRadius: "4px",
  padding: "2px 6px",
  fontSize: "0.8rem",
  fontFamily: "var(--font-sans)",
};
