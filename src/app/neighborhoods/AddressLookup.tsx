"use client";

import { useState } from "react";

type OrgSlim = {
  id: string;
  name: string;
  area: string | null;
  status: string;
  website: string | null;
  email: string | null;
  facebook: string | null;
  notes: string | null;
};

const STATUS_COLOR: Record<string, string> = {
  Active:     "var(--color-teal-accent)",
  Registered: "var(--color-steel-muted)",
  Dormant:    "#E8C84A",
  Inactive:   "#c0392b",
};

const LANSING_LAT = 42.7325;
const LANSING_LNG = -84.5555;

function getKeywords(lat: number, lng: number): string[] {
  const kws: string[] = [];
  if (lat > 42.745) kws.push("north");
  else if (lat < 42.715) kws.push("south");
  if (lng > -84.535) kws.push("east");
  else if (lng < -84.575) kws.push("west");
  const dist = Math.sqrt(Math.pow(lat - LANSING_LAT, 2) + Math.pow(lng - LANSING_LNG, 2));
  if (dist < 0.018) kws.push("downtown", "central", "old town", "midtown", "reo");
  if (kws.length === 0) kws.push("central", "downtown", "old town", "midtown");
  return kws;
}

function matchOrgs(lat: number, lng: number, orgs: OrgSlim[]): OrgSlim[] {
  const kws = getKeywords(lat, lng);
  return orgs.filter((o) => {
    if (!o.area) return false;
    const area = o.area.toLowerCase();
    return kws.some((kw) => area.includes(kw));
  });
}

function OrgCard({ org }: { org: OrgSlim }) {
  return (
    <div style={{
      padding: "0.65rem 1rem",
      background: "rgba(244,241,232,0.03)",
      border: "1px solid var(--color-border-strong)",
      borderLeft: `3px solid ${STATUS_COLOR[org.status] ?? "var(--color-steel-muted)"}`,
      borderRadius: "6px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "1rem",
      flexWrap: "wrap",
    }}>
      <div>
        <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.88rem", margin: 0 }}>
          {org.name}
        </p>
        {org.area && (
          <p style={{ fontSize: "0.67rem", color: "var(--color-steel-muted)", margin: "0.15rem 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {org.area}
          </p>
        )}
        {org.notes && (
          <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>
            {org.notes}
          </p>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0, flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.06em", color: STATUS_COLOR[org.status] ?? "var(--color-steel-muted)" }}>
          {org.status}
        </span>
        {org.website && (
          <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.72rem", color: "var(--color-dome-gold)" }}>
            Website →
          </a>
        )}
        {org.facebook && (
          <a href={org.facebook} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>
            Facebook →
          </a>
        )}
        {!org.website && !org.facebook && org.email && (
          <a href={`mailto:${org.email}`} style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>
            {org.email}
          </a>
        )}
      </div>
    </div>
  );
}

export default function AddressLookup({ orgs }: { orgs: OrgSlim[] }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState<OrgSlim[] | null>(null); // null = show all
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const displayed = filtered ?? orgs;
  const isFiltered = filtered !== null;

  function clear() {
    setFiltered(null);
    setCoords(null);
    setErrorMsg("");
    setQuery("");
  }

  async function lookup() {
    const raw = query.trim();
    if (!raw) { clear(); return; }
    const fullAddress = /lansing/i.test(raw) ? raw : `${raw}, Lansing, MI`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1&addressdetails=1&countrycodes=us`;

    setLoading(true);
    setFiltered(null);
    setCoords(null);
    setErrorMsg("");

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "lansing.love neighborhood lookup" },
      });
      if (!res.ok) throw new Error(`Nominatim returned ${res.status}`);
      const data = await res.json();

      if (!data?.length) {
        setErrorMsg('Address not found. Try including a street number, e.g. "1300 Eureka St".');
        setFiltered([]);
        setLoading(false);
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      setCoords({ lat, lng });
      setFiltered(matchOrgs(lat, lng, orgs));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      const blocked = /fetch|network|load failed/i.test(msg);
      setErrorMsg(blocked ? "CORS_BLOCKED" : (msg || "Unknown error"));
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Search bar */}
      <div style={{
        padding: "1.1rem 1.4rem",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-strong)",
        borderRadius: "10px",
        marginBottom: "1rem",
      }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-steel-muted)", marginBottom: "0.6rem" }}>
          Find your neighborhood organization
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="1300 Eureka St"
            style={{
              flex: "1 1 200px",
              padding: "0.5rem 0.8rem",
              borderRadius: "6px",
              border: "1px solid var(--color-border-strong)",
              background: "rgba(244,241,232,0.05)",
              color: "var(--color-text-primary)",
              fontSize: "0.88rem",
              fontFamily: "var(--font-sans)",
              outline: "none",
            }}
          />
          <button
            onClick={lookup}
            disabled={loading}
            style={{
              padding: "0.5rem 1.1rem",
              borderRadius: "6px",
              border: "none",
              background: "var(--color-dome-gold)",
              color: "var(--color-midnight-steel)",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: loading ? "wait" : "pointer",
              fontFamily: "var(--font-sans)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {loading ? "Looking up…" : "Look up"}
          </button>
          {isFiltered && (
            <button
              onClick={clear}
              style={{
                padding: "0.5rem 0.9rem",
                borderRadius: "6px",
                border: "1px solid var(--color-border-strong)",
                background: "transparent",
                color: "var(--color-steel-muted)",
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Show all
            </button>
          )}
        </div>
        <p style={{ fontSize: "0.67rem", color: "var(--color-text-muted)", marginTop: "0.4rem" }}>
          Enter a Lansing address — "Lansing, MI" is appended automatically
        </p>
      </div>

      {/* Error */}
      {errorMsg && (
        <div style={{ marginBottom: "0.75rem", padding: "0.7rem 1rem", background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: "6px" }}>
          {errorMsg === "CORS_BLOCKED" ? (
            <p style={{ fontSize: "0.82rem", color: "#E87070", margin: 0 }}>
              Geocoding blocked in this browser.{" "}
              <a
                href={`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-dome-gold)" }}
              >
                Look up coordinates manually →
              </a>
            </p>
          ) : (
            <p style={{ fontSize: "0.82rem", color: "#E87070", margin: 0 }}>{errorMsg}</p>
          )}
        </div>
      )}

      {/* Result header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", margin: 0 }}>
          {isFiltered ? (
            displayed.length > 0 ? (
              <>
                {displayed.length} organization{displayed.length !== 1 ? "s" : ""} near{" "}
                {coords && (
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}&zoom=16`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-dome-gold)" }}
                  >
                    {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} →
                  </a>
                )}
              </>
            ) : (
              <>
                No match found.{" "}
                {coords && (
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}&zoom=16`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-dome-gold)" }}
                  >
                    View on OpenStreetMap →
                  </a>
                )}{" "}
                Contact DNCE at (517) 483-4141.
              </>
            )
          ) : (
            `All ${orgs.length} registered neighborhood organizations`
          )}
        </p>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {displayed.map((org) => <OrgCard key={org.id} org={org} />)}
      </div>

      {isFiltered && (
        <p style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "0.6rem" }}>
          Area labels are approximate — GIS boundaries not yet defined. Contact DNCE at (517) 483-4141 to confirm.
        </p>
      )}
    </div>
  );
}
