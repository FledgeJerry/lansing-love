import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search" };

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <div>
        <h1 style={{ marginBottom: "0.5rem" }}>Search</h1>
        <p style={{ color: "var(--color-steel-muted)" }}>Enter a term in the search bar above.</p>
      </div>
    );
  }

  const mode = "insensitive" as const;

  const [cases, patterns, boards, predictions] = await Promise.all([
    prisma.boardCaseStudy.findMany({
      where: {
        published: true,
        OR: [
          { boardName: { contains: query, mode } },
          { summary: { contains: query, mode } },
          { category: { contains: query, mode } },
        ],
      },
      select: { slug: true, boardName: true, category: true, date: true, summary: true },
      take: 10,
    }),
    prisma.pattern.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: query, mode } },
          { problem: { contains: query, mode } },
          { solution: { contains: query, mode } },
        ],
      },
      select: { slug: true, number: true, name: true, scale: true, problem: true },
      take: 10,
    }),
    prisma.board.findMany({
      where: {
        OR: [
          { name: { contains: query, mode } },
          { notes: { contains: query, mode } },
        ],
      },
      select: { slug: true, name: true, notes: true },
      take: 8,
    }),
    prisma.question.findMany({
      where: {
        status: { in: ["ACTIVE", "CLOSED", "RESOLVED"] },
        OR: [
          { title: { contains: query, mode } },
          { description: { contains: query, mode } },
        ],
      },
      select: { id: true, title: true, status: true, category: true },
      take: 8,
    }),
  ]);

  const total = cases.length + patterns.length + boards.length + predictions.length;

  return (
    <div>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ marginBottom: "0.25rem" }}>Search results</h1>
        <p style={{ color: "var(--color-steel-muted)", fontSize: "0.88rem" }}>
          {total === 0 ? "No results for" : `${total} result${total === 1 ? "" : "s"} for`}{" "}
          <strong style={{ color: "var(--color-limestone)" }}>&ldquo;{query}&rdquo;</strong>
        </p>
      </div>

      {total === 0 && (
        <div style={{ color: "var(--color-steel-muted)", fontSize: "0.9rem" }}>
          <p>Try a name, issue, or topic — e.g. &ldquo;Chamber&rdquo;, &ldquo;housing&rdquo;, &ldquo;oversight&rdquo;.</p>
          <p style={{ marginTop: "0.5rem" }}>
            Or ask <button onClick={undefined} style={{ background: "none", border: "none", padding: 0, color: "var(--color-dome-gold)", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit" }}>Ask Lansing.love</button> — the chat button in the bottom-right corner.
          </p>
        </div>
      )}

      {cases.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-steel-muted)", marginBottom: "0.75rem", fontWeight: 600 }}>
            Full Accounting Cases
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {cases.map((c) => (
              <Link key={c.slug} href={`/governance/cases/${c.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ padding: "0.85rem 1.1rem", borderRadius: "8px", background: "rgba(154,176,200,0.06)", border: "1px solid rgba(154,176,200,0.1)", transition: "border-color 0.15s" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", marginBottom: "0.2rem" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--color-limestone)" }}>{c.boardName}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>{c.category} · {c.date}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                    {c.summary.slice(0, 160)}{c.summary.length > 160 ? "…" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {patterns.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-steel-muted)", marginBottom: "0.75rem", fontWeight: 600 }}>
            Pattern Language
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {patterns.map((p) => (
              <Link key={p.slug} href={`/patterns/${p.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ padding: "0.85rem 1.1rem", borderRadius: "8px", background: "rgba(154,176,200,0.06)", border: "1px solid rgba(154,176,200,0.1)" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", marginBottom: "0.2rem" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--color-limestone)" }}>Pattern {p.number}: {p.name}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>{p.scale}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                    {p.problem.slice(0, 160)}{p.problem.length > 160 ? "…" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {boards.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-steel-muted)", marginBottom: "0.75rem", fontWeight: 600 }}>
            Boards & Commissions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {boards.map((b) => (
              <Link key={b.slug} href={`/boards/${b.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ padding: "0.85rem 1.1rem", borderRadius: "8px", background: "rgba(154,176,200,0.06)", border: "1px solid rgba(154,176,200,0.1)" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--color-limestone)" }}>{b.name}</span>
                  {b.notes && (
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                      {b.notes.slice(0, 120)}{b.notes.length > 120 ? "…" : ""}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {predictions.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-steel-muted)", marginBottom: "0.75rem", fontWeight: 600 }}>
            Civic Predictions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {predictions.map((p) => (
              <Link key={p.id} href={`/predictions/${p.id}`} style={{ textDecoration: "none" }}>
                <div style={{ padding: "0.85rem 1.1rem", borderRadius: "8px", background: "rgba(154,176,200,0.06)", border: "1px solid rgba(154,176,200,0.1)" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--color-limestone)" }}>{p.title}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>{p.status}{p.category ? ` · ${p.category}` : ""}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
