import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ExternalLink { label: string; url: string; note: string; }

const SCALE_LABEL: Record<string, string> = {
  movement: "Movement Scale",
  domain: "Domain Scale",
  institution: "Institution Scale",
  practice: "Practice Scale",
};

const STATUS_LABEL: Record<string, string> = {
  tested: "Tested instance exists",
  partial: "Partially tested",
  untested: "Untested — honest gap",
};
const STATUS_COLOR: Record<string, string> = {
  tested: "#4A9B8E",
  partial: "#E8C84A",
  untested: "rgba(154,176,200,0.5)",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.pattern.findUnique({ where: { slug }, select: { name: true, problem: true } });
  if (!p) return {};
  return {
    title: `${p.name} — Pattern Language`,
    description: p.problem.slice(0, 160),
  };
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const pattern = await prisma.pattern.findUnique({ where: { slug } });
  if (!pattern || !pattern.published) notFound();

  // Fetch linked patterns (up and down)
  const [linksUpPatterns, linksDownPatterns, relatedCases] = await Promise.all([
    pattern.linksUp.length > 0
      ? prisma.pattern.findMany({ where: { slug: { in: pattern.linksUp } }, select: { slug: true, number: true, name: true, scale: true } })
      : Promise.resolve([]),
    pattern.linksDown.length > 0
      ? prisma.pattern.findMany({ where: { slug: { in: pattern.linksDown } }, select: { slug: true, number: true, name: true, scale: true } })
      : Promise.resolve([]),
    pattern.caseRefs.length > 0
      ? prisma.boardCaseStudy.findMany({
          where: { slug: { in: pattern.caseRefs }, published: true },
          select: { slug: true, boardName: true, category: true, date: true, stats: true },
        })
      : Promise.resolve([]),
  ]);

  const externalLinks = (pattern.externalLinks as unknown as ExternalLink[]) ?? [];

  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      {/* Breadcrumb */}
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        <Link href="/patterns" style={{ color: "var(--color-steel-muted)" }}>Pattern Language</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        {pattern.name}
      </p>

      {/* Header */}
      <section style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
          <span className="eyebrow" style={{ margin: 0 }}>Pattern {pattern.number} · {SCALE_LABEL[pattern.scale] ?? pattern.scale}</span>
          <span style={{
            fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
            color: STATUS_COLOR[pattern.status] ?? "var(--color-text-muted)",
            border: `1px solid ${STATUS_COLOR[pattern.status] ?? "rgba(154,176,200,0.3)"}`,
            padding: "0.15rem 0.5rem", borderRadius: "3px",
          }}>
            {STATUS_LABEL[pattern.status] ?? pattern.status}
          </span>
        </div>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "1rem" }}>{pattern.name}</h1>

        {/* Links up */}
        {linksUpPatterns.length > 0 && (
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>
            Completes:{" "}
            {linksUpPatterns.map((p, i) => (
              <span key={p.slug}>
                {i > 0 && ", "}
                <Link href={`/patterns/${p.slug}`} style={{ color: "var(--color-dome-gold)" }}>
                  {p.number}. {p.name}
                </Link>
              </span>
            ))}
          </p>
        )}
        {/* Links down */}
        {linksDownPatterns.length > 0 && (
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
            Completed by:{" "}
            {linksDownPatterns.map((p, i) => (
              <span key={p.slug}>
                {i > 0 && ", "}
                <Link href={`/patterns/${p.slug}`} style={{ color: "var(--color-dome-gold)" }}>
                  {p.number}. {p.name}
                </Link>
              </span>
            ))}
          </p>
        )}
      </section>

      {/* Problem */}
      <section style={{ marginBottom: "2.5rem" }}>
        <hr className="divider" />
        <span className="eyebrow">Problem</span>
        <p style={{ fontSize: "1rem", lineHeight: 1.8, maxWidth: "700px", borderLeft: "3px solid rgba(192,57,43,0.4)", paddingLeft: "1.25rem", marginTop: "0.75rem" }}>
          {pattern.problem}
        </p>
      </section>

      {/* Forces */}
      <section style={{ marginBottom: "2.5rem" }}>
        <hr className="divider" />
        <span className="eyebrow">Forces</span>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.8, maxWidth: "700px", color: "var(--color-steel-muted)", marginTop: "0.75rem" }}>
          {pattern.forces}
        </p>
      </section>

      {/* Solution */}
      <section style={{ marginBottom: "2.5rem" }}>
        <hr className="divider" />
        <span className="eyebrow">Solution</span>
        <p style={{ fontSize: "0.95rem", lineHeight: 1.85, maxWidth: "700px", marginTop: "0.75rem" }}>
          {pattern.solution}
        </p>
      </section>

      {/* Full Accounting cases */}
      {relatedCases.length > 0 && (
        <section style={{ marginBottom: "2.5rem" }}>
          <hr className="divider" />
          <span className="eyebrow">Full Accounting</span>
          <h2 style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>Cases that evidence this pattern</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", maxWidth: "600px", marginBottom: "1.25rem" }}>
            These historical cases document the problem this pattern is designed to solve. The pattern is the structural fix; these are the evidence for why it&apos;s needed.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {relatedCases.map(c => {
              const firstStat = (c.stats as { value: string; label: string }[] | null)?.[0];
              return (
                <Link key={c.slug} href={`/governance/issues/${c.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", borderLeft: "3px solid rgba(192,57,43,0.35)" }}>
                    <div>
                      <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.88rem", margin: 0 }}>{c.boardName}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", margin: 0, marginTop: "0.15rem" }}>
                        {c.category}{c.date ? ` · ${c.date}` : ""}
                        {firstStat ? ` · ${firstStat.value} ${firstStat.label}` : ""}
                      </p>
                    </div>
                    <span style={{ color: "var(--color-dome-gold)", fontSize: "0.8rem", flexShrink: 0 }}>Read →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* External links */}
      {externalLinks.length > 0 && (
        <section style={{ marginBottom: "2.5rem" }}>
          <hr className="divider" />
          <span className="eyebrow">Further reading</span>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>External resources</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: "680px" }}>
            {externalLinks.map((ext, i) => (
              <a key={i} href={ext.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "0.9rem 1.1rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--color-dome-gold)", fontSize: "0.9rem", flexShrink: 0, marginTop: "0.05rem" }}>↗</span>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", margin: 0 }}>{ext.label}</p>
                    {ext.note && <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", margin: 0, marginTop: "0.2rem" }}>{ext.note}</p>}
                    <p style={{ fontSize: "0.68rem", color: "rgba(154,176,200,0.4)", margin: 0, marginTop: "0.15rem" }}>{ext.url.replace(/^https?:\/\//, "").split("/")[0]}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Sub-patterns */}
      {linksDownPatterns.length > 0 && (
        <section style={{ marginBottom: "2.5rem" }}>
          <hr className="divider" />
          <span className="eyebrow">Patterns that complete this one</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.75rem" }}>
            {linksDownPatterns.map(p => (
              <Link key={p.slug} href={`/patterns/${p.slug}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "0.75rem 1.1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--color-steel-muted)", minWidth: "1.8rem", textAlign: "right" }}>{p.number}</span>
                  <span style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem" }}>{p.name}</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginLeft: "auto" }}>{SCALE_LABEL[p.scale]}</span>
                  <span style={{ color: "var(--color-dome-gold)", fontSize: "0.8rem" }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Nav */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
        <Link href="/patterns" className="btn btn--ghost btn--sm">← All patterns</Link>
        <Link href="/governance/issues" className="btn btn--secondary btn--sm">Full Accounting cases →</Link>
      </div>
    </div>
  );
}
