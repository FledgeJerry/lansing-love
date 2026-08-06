import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pattern Language — Polycentric Governance",
  description: "28 reusable patterns for converting basic-needs domains into cooperatively governed institutions. Modeled on Christopher Alexander's A Pattern Language.",
  alternates: { canonical: "/patterns" },
};

const SCALES = [
  { key: "movement", label: "Movement Scale", number: "1–9", desc: "The foundational premises and values that every institution-scale pattern serves." },
  { key: "domain",   label: "Domain Scale",   number: "10–13", desc: "How to sequence and connect cooperative institutions across the ten basic-needs domains." },
  { key: "institution", label: "Institution Scale", number: "14–22", desc: "How individual cooperative institutions are designed, governed, and held accountable." },
  { key: "practice", label: "Practice Scale", number: "23–28", desc: "Day-to-day habits and postures — the base layer everything else rests on." },
] as const;

const STATUS_LABEL: Record<string, string> = {
  tested: "Tested",
  partial: "Partially tested",
  untested: "Untested",
};
const STATUS_COLOR: Record<string, string> = {
  tested: "#4A9B8E",
  partial: "#E8C84A",
  untested: "rgba(154,176,200,0.5)",
};

export default async function PatternsIndexPage() {
  const patterns = await prisma.pattern.findMany({
    where: { published: true },
    orderBy: { number: "asc" },
    select: { slug: true, number: true, name: true, scale: true, status: true, linksUp: true, linksDown: true, caseRefs: true },
  });

  const byScale = (scale: string) => patterns.filter(p => p.scale === scale);

  return (
    <div style={{ maxWidth: "900px", paddingBottom: "5rem" }}>

      {/* Breadcrumb */}
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Pattern Language
      </p>

      {/* Header */}
      <section style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">A Pattern Language for Polycentric Governance</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", marginBottom: "0.75rem" }}>28 Patterns for Building What Comes Next</h1>
        <p style={{ maxWidth: "680px", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>
          Modeled on Christopher Alexander&apos;s <em>A Pattern Language</em> (1977) — each pattern names a recurring problem, describes the forces that make it hard to resolve, and offers a concrete solution illustrated with proof-of-concept work from The Fledge. Patterns are ordered by scale, largest to smallest.
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", maxWidth: "640px" }}>
          Patterns marked <span style={{ color: STATUS_COLOR.partial }}>partially tested</span> or <span style={{ color: STATUS_COLOR.untested }}>untested</span> are honest gaps — places where the framework makes a claim that doesn&apos;t yet have a real working instance behind it. Cross-references link to{" "}
          <Link href="/governance/issues" style={{ color: "var(--color-dome-gold)" }}>Full Accounting cases</Link>{" "}
          that provide the evidentiary base for each pattern.
        </p>
      </section>

      {/* Scale overview */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "3rem" }}>
        {SCALES.map(s => (
          <a key={s.key} href={`#${s.key}`} style={{ textDecoration: "none" }}>
            <div className="card" style={{ padding: "1rem", height: "100%" }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-steel-muted)", margin: 0, marginBottom: "0.25rem" }}>{s.number}</p>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem", margin: 0, marginBottom: "0.35rem" }}>{s.label}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </a>
        ))}
      </section>

      {/* Patterns by scale */}
      {SCALES.map(scale => {
        const group = byScale(scale.key);
        return (
          <section key={scale.key} id={scale.key} style={{ marginBottom: "3.5rem" }}>
            <hr className="divider" />
            <span className="eyebrow">{scale.label}</span>
            <h2 style={{ marginBottom: "0.4rem" }}>Patterns {scale.number}</h2>
            <p style={{ fontSize: "0.82rem", color: "var(--color-steel-muted)", marginBottom: "1.5rem", maxWidth: "600px" }}>{scale.desc}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {group.map(p => (
                <Link key={p.slug} href={`/patterns/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                    {/* Pattern number */}
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--color-steel-muted)", minWidth: "1.8rem", textAlign: "right", flexShrink: 0 }}>{p.number}</span>

                    {/* Name + connections */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem", margin: 0 }}>{p.name}</p>
                      {(p.caseRefs.length > 0) && (
                        <p style={{ fontSize: "0.68rem", color: "var(--color-text-muted)", margin: 0, marginTop: "0.2rem" }}>
                          {p.caseRefs.length} Full Accounting {p.caseRefs.length === 1 ? "case" : "cases"} ·{" "}
                          {p.linksDown.length > 0 ? `${p.linksDown.length} sub-pattern${p.linksDown.length === 1 ? "" : "s"}` : "base pattern"}
                        </p>
                      )}
                    </div>

                    {/* Status badge */}
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: STATUS_COLOR[p.status] ?? "var(--color-text-muted)", flexShrink: 0 }}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>

                    <span style={{ color: "var(--color-dome-gold)", fontSize: "0.8rem", flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* Footer links */}
      <hr className="divider" />
      <section style={{ marginBottom: "2rem" }}>
        <span className="eyebrow">Related</span>
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>The Full Accounting</h2>
        <p style={{ fontSize: "0.875rem", color: "var(--color-steel-muted)", maxWidth: "600px", marginBottom: "1rem" }}>
          Each pattern links to the historical cases that provide its evidentiary base. The Full Accounting documents what happened; the Pattern Language explains why it keeps happening and what the structural fix looks like.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/governance/issues" className="btn btn--secondary btn--sm">Full Accounting cases →</Link>
          <Link href="/governance" className="btn btn--ghost btn--sm">← Governance</Link>
        </div>
      </section>
    </div>
  );
}
