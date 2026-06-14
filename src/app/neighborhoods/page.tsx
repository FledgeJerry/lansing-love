import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lansing Neighborhood Organizations",
  description: "Directory of all 59 registered neighborhood organizations in Lansing, MI — from the City of Lansing Department of Neighborhoods & Citizen Engagement (DNCE).",
  alternates: { canonical: "/neighborhoods" },
};

const STATUS_COLOR: Record<string, string> = {
  Active:     "var(--color-teal-accent)",
  Registered: "var(--color-steel-muted)",
  Dormant:    "#E8C84A",
  Inactive:   "#c0392b",
};

export default async function NeighborhoodsPage() {
  const all = await prisma.neighborhoodOrg.findMany({
    orderBy: [{ isHub: "asc" }, { sortOrder: "asc" }],
  });

  const hubs = all.filter(o => o.isHub);
  const orgs = all.filter(o => !o.isHub);

  const statusCounts = orgs.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: "960px", paddingBottom: "5rem" }}>

      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Neighborhood Organizations
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Lansing Neighborhood Organizations</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", marginBottom: "0.75rem" }}>
          {orgs.length} registered neighborhood organizations
        </h1>
        <p style={{ maxWidth: "640px", color: "var(--color-steel-muted)", marginBottom: "1rem" }}>
          Per the City of Lansing Department of Neighborhoods &amp; Citizen Engagement (DNCE).
          These are the existing structures that would become neighborhood councils with real authority under
          the{" "}
          <Link href="/governance/alternatives/chamber" style={{ color: "var(--color-dome-gold)" }}>polycentric governance reform</Link>.
        </p>

        {/* Status summary */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
            <div key={status} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: STATUS_COLOR[status] ?? "var(--color-steel-muted)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)" }}>{count} {status}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
          Contact DNCE for current leadership contacts: (517) 483-4141 ·{" "}
          <a href="https://lansingmi.gov/180" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-dome-gold)" }}>lansingmi.gov/180</a>
          {" "}· Many orgs operate via Nextdoor rather than standalone websites.
        </p>
      </section>

      {/* Hub */}
      {hubs.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Neighborhood hub</p>
          {hubs.map(org => (
            <div key={org.id} className="card" style={{ padding: "1.25rem", borderLeft: "3px solid var(--color-teal-accent)", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.95rem", margin: 0 }}>{org.name}</p>
                  {org.area && <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)", margin: "0.15rem 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{org.area}</p>}
                  {org.notes && <p style={{ fontSize: "0.8rem", color: "var(--color-steel-muted)", margin: "0.5rem 0 0", maxWidth: "560px" }}>{org.notes}</p>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-end", flexShrink: 0 }}>
                  {org.website && <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "var(--color-dome-gold)" }}>{org.website.replace("https://", "").replace("http://", "")} →</a>}
                  {org.email && <a href={`mailto:${org.email}`} style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>{org.email}</a>}
                  {org.phone && <span style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>{org.phone}</span>}
                  {org.address && <span style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>{org.address}</span>}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      <hr className="divider" />

      {/* Directory table */}
      <section style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>All organizations</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(244,241,232,0.1)" }}>
                {["Organization", "Area", "Status", "Links / Contact"].map(h => (
                  <th key={h} style={{ padding: "0.4rem 0.75rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orgs.map(org => (
                <tr key={org.id} style={{ borderBottom: "1px solid rgba(244,241,232,0.05)" }}>
                  <td style={{ padding: "0.6rem 0.75rem" }}>
                    <p style={{ fontWeight: 600, color: "var(--color-limestone)", margin: 0 }}>{org.name}</p>
                    {org.notes && <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", margin: "0.15rem 0 0" }}>{org.notes}</p>}
                  </td>
                  <td style={{ padding: "0.6rem 0.75rem", color: "var(--color-steel-muted)", fontSize: "0.78rem", whiteSpace: "nowrap" }}>{org.area ?? "—"}</td>
                  <td style={{ padding: "0.6rem 0.75rem", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", color: STATUS_COLOR[org.status] ?? "var(--color-steel-muted)" }}>
                      {org.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.6rem 0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
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
                      {org.email && (
                        <a href={`mailto:${org.email}`} style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>{org.email}</a>
                      )}
                      {!org.website && !org.facebook && !org.email && (
                        <span style={{ fontSize: "0.72rem", color: "rgba(154,176,200,0.4)" }}>Via DNCE: (517) 483-4141</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", borderTop: "1px solid rgba(244,241,232,0.08)", paddingTop: "1.5rem" }}>
        <Link href="/governance" className="btn btn--ghost btn--sm">← Governance</Link>
        <Link href="/governance/alternatives/chamber" className="btn btn--ghost btn--sm">Chamber alternative plan →</Link>
        <a href="https://lansingmi.gov/180" target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">City DNCE →</a>
      </div>
    </div>
  );
}
