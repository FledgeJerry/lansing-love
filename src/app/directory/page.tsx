import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Independent Co-ops, Unions & Living-Wage Employers",
  description: "Lansing-area co-ops, unions, and living-wage employers outside The Fledge ecosystem's own software — tracked here so they count toward the cooperative network's real footprint.",
  alternates: { canonical: "/directory" },
};

const FLAGS: { key: "isCoop" | "isUnion" | "isWorkerOwned" | "offersLivingWage" | "ownsHousing"; label: string; color: string }[] = [
  { key: "isCoop", label: "Co-op", color: "var(--color-teal-accent)" },
  { key: "isUnion", label: "Union", color: "var(--color-river-blue)" },
  { key: "isWorkerOwned", label: "Worker-owned", color: "var(--color-dome-gold)" },
  { key: "offersLivingWage", label: "Living wage", color: "var(--color-success)" },
  { key: "ownsHousing", label: "Houses people", color: "var(--color-teal-accent)" },
];

export default async function DirectoryPage() {
  const orgs = await prisma.externalOrg.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
  });

  const coopCount = orgs.filter(o => o.isCoop).length;
  const unionCount = orgs.filter(o => o.isUnion).length;
  const livingWageCount = orgs.filter(o => o.offersLivingWage).length;
  const housingOrgs = orgs.filter(o => o.ownsHousing);
  const totalHoused = housingOrgs.reduce((sum, o) => sum + (o.occupantCount ?? 0), 0);

  return (
    <div style={{ maxWidth: "960px", paddingBottom: "5rem" }}>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--color-steel-muted)" }}>lansing.love</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Independent Co-ops &amp; Unions
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Cooperative Network</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", marginBottom: "0.75rem" }}>
          {orgs.length} independent co-ops, unions &amp; living-wage employers
        </h1>
        <p style={{ maxWidth: "640px", color: "var(--color-steel-muted)", marginBottom: "1rem" }}>
          These organizations aren&apos;t run through The Fledge ecosystem&apos;s own software (TREK, resilience.foundation),
          but they&apos;re part of Lansing&apos;s real cooperative and worker-power footprint — so they count toward the
          stats shown on the homepage too.
        </p>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          <Stat value={coopCount} label="Co-ops" />
          <Stat value={unionCount} label="Unionized workplaces" />
          <Stat value={livingWageCount} label="Living-wage employers" />
          {totalHoused > 0 && <Stat value={totalHoused} label="People housed" />}
        </div>
      </section>

      {orgs.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>None published yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {orgs.map(org => (
            <div key={org.id} className="card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.95rem", margin: 0 }}>{org.name}</p>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                    {FLAGS.filter(f => org[f.key]).map(f => (
                      <span key={f.key} style={{ fontSize: "0.62rem", fontWeight: 700, color: f.color, border: `1px solid ${f.color}`, borderRadius: "4px", padding: "0.1rem 0.4rem" }}>{f.label}</span>
                    ))}
                  </div>
                  {org.notes && <p style={{ fontSize: "0.8rem", color: "var(--color-steel-muted)", margin: "0.5rem 0 0", maxWidth: "560px" }}>{org.notes}</p>}
                  {org.ownsHousing && org.occupantCount != null && (
                    <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", margin: "0.3rem 0 0" }}>{org.occupantCount} people housed</p>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-end", flexShrink: 0 }}>
                  {org.website && <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "var(--color-dome-gold)" }}>{org.website.replace(/^https?:\/\//, "")} →</a>}
                  {org.email && <a href={`mailto:${org.email}`} style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>{org.email}</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", borderTop: "1px solid rgba(244,241,232,0.08)", paddingTop: "1.5rem", marginTop: "2rem" }}>
        <Link href="/" className="btn btn--ghost btn--sm">← lansing.love</Link>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--color-limestone)", margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-steel-muted)", marginTop: "0.2rem" }}>{label}</p>
    </div>
  );
}
