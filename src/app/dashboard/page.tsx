import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardTabs from "./DashboardTabs";

export const dynamic = "force-dynamic";

async function getLegitimacyData() {
  const resolved = await prisma.question.findMany({
    where: { status: "RESOLVED" },
    include: {
      outcome: true,
      predictions: { select: { optionId: true, desiredId: true } },
    },
  });

  let totalDesires = 0;
  let wantedDifferent = 0;
  const byCategory: Record<string, { total: number; gap: number }> = {};
  const byQuarter: Record<string, { total: number; gap: number }> = {};

  for (const q of resolved) {
    if (!q.outcome) continue;
    const cat = q.category ?? "Other";
    const d = q.outcome.resolvedAt;
    const qtr = d ? `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}` : null;

    for (const p of q.predictions) {
      if (!p.desiredId) continue;
      totalDesires++;
      if (!byCategory[cat]) byCategory[cat] = { total: 0, gap: 0 };
      byCategory[cat].total++;
      const isDiff = p.desiredId !== q.outcome.optionId;
      if (isDiff) { wantedDifferent++; byCategory[cat].gap++; }
      if (qtr) {
        if (!byQuarter[qtr]) byQuarter[qtr] = { total: 0, gap: 0 };
        byQuarter[qtr].total++;
        if (isDiff) byQuarter[qtr].gap++;
      }
    }
  }

  return {
    totalResolved: resolved.filter((q) => q.outcome).length,
    totalDesires,
    wantedDifferent,
    gapPct: totalDesires > 0 ? Math.round((wantedDifferent / totalDesires) * 100) : null,
    byCategory: Object.entries(byCategory)
      .map(([cat, d]) => ({ cat, ...d, pct: d.total > 0 ? Math.round((d.gap / d.total) * 100) : 0 }))
      .sort((a, b) => b.pct - a.pct),
    byQuarter: Object.entries(byQuarter)
      .map(([qtr, d]) => ({ qtr, ...d, pct: d.total > 0 ? Math.round((d.gap / d.total) * 100) : 0 }))
      .sort((a, b) => a.qtr.localeCompare(b.qtr)),
  };
}

async function getResiliencePulse() {
  try {
    const res = await fetch("https://resilience.foundation/api/pulse", { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getFreeStandData() {
  try {
    const res = await fetch("https://freestand.thefledge.com/api/v1/admin/metrics/stand", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.ok ? data : null;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const [session, gap, resilience, freestand, ownershipChecks] = await Promise.all([
    auth(),
    getLegitimacyData(),
    getResiliencePulse(),
    getFreeStandData(),
    prisma.ownershipCheck.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Lansing Cooperative Governance</span>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "0.5rem", lineHeight: 1.2 }}>
          The Governance Dashboard
        </h1>
        <p style={{ color: "var(--color-steel-muted)", fontSize: "0.95rem", maxWidth: "680px" }}>
          The standing question, made visible, on a schedule, in public — is power staying where it belongs?
        </p>
      </div>

      <DashboardTabs
        isAdmin={isAdmin}
        gap={gap}
        resilience={resilience}
        freestand={freestand}
        ownershipChecks={ownershipChecks.map((c) => ({
          id: c.id,
          sortOrder: c.sortOrder,
          question: c.question,
          answer: c.answer ?? "",
          reviewedAt: c.reviewedAt?.toISOString() ?? null,
          updatedBy: c.updatedBy ?? "",
        }))}
      />
    </div>
  );
}
