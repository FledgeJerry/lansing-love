import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardTabs from "./dashboard/DashboardTabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cooperative Governance",
  description: "We know we #lovelansing — but does #lansingloveus? Track Lansing's legitimacy gap, the cooperative network, council votes, civic advocacy, and the standing question of whether power is staying where it belongs.",
  alternates: { canonical: "/" },
  openGraph: { title: "Cooperative Governance | lansing.love", description: "Tracking Lansing's legitimacy gap, cooperative network, and council vote record.", url: "https://lansing.love" },
};

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
  } catch { return null; }
}

async function getFreeStandData() {
  try {
    const res = await fetch("https://freestand.thefledge.com/api/v1/admin/metrics/stand", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.ok ? data : null;
  } catch { return null; }
}

async function getFledgeEvents(year: number) {
  try {
    const res = await fetch(`https://thefledge.com/api/events/public?year=${year}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getRhinoTrackerData() {
  try {
    const res = await fetch("https://rhinocerosmedia.org/council-tracker", {
      cache: "no-store",
      headers: { "User-Agent": "lansing.love governance dashboard" },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const matchN = (label: string) => {
      const m = html.match(new RegExp(label + "</[^>]+>\\s*<[^>]+>(\\d+)"));
      return m ? parseInt(m[1], 10) : 0;
    };
    const matchPct = (label: string) => {
      const m = html.match(new RegExp(label + "</[^>]+>\\s*<[^>]+>(\\d+)%"));
      return m ? parseInt(m[1], 10) : 0;
    };

    const tbodyMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/);
    if (!tbodyMatch) return null;

    const parseVal = (s: string) => (s === "—" || s === "—") ? 0 : parseInt(s, 10) || 0;
    const parsePct = (s: string) => parseInt(s.replace("%", ""), 10) || 0;

    const members = [...tbodyMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].flatMap((rowMatch) => {
      const tds = [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)]
        .map((m) => m[1].replace(/<[^>]+>/g, "").trim());
      if (tds.length < 10 || !tds[0]) return [];
      return [{ name: tds[0], seat: tds[1], rollCalls: parseVal(tds[2]), yes: parseVal(tds[3]), no: parseVal(tds[4]), abstain: parseVal(tds[5]), recuse: parseVal(tds[6]), absent: parseVal(tds[7]), splitRate: parsePct(tds[8]), attendance: parsePct(tds[9]) }];
    });

    return { totalRollCalls: matchN("Roll calls"), unanimous: matchN("Unanimous"), contested: matchN("Contested"), bodySplitRate: matchPct("Body split rate"), members };
  } catch { return null; }
}

export default async function HomePage() {
  const [session, gap, resilience, freestand, rhinoTracker, ownershipChecks, advocacyEntries, fledgeEvents] = await Promise.all([
    auth(),
    getLegitimacyData(),
    getResiliencePulse(),
    getFreeStandData(),
    getRhinoTrackerData(),
    prisma.ownershipCheck.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.advocacyEntry.findMany({ where: { published: true }, orderBy: { date: "desc" } }),
    getFledgeEvents(2026),
  ]);

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Lansing Cooperative Governance</span>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "0.5rem", lineHeight: 1.2 }}>
          Cooperative Governance
        </h1>
        <p style={{ color: "var(--color-steel-muted)", fontSize: "0.95rem", maxWidth: "680px" }}>
          We know we #lovelansing, but does #lansingloveus?
        </p>
      </div>

      <DashboardTabs
        isAdmin={isAdmin}
        gap={gap}
        resilience={resilience}
        freestand={freestand}
        fledgeEvents={fledgeEvents}
        rhinoTracker={rhinoTracker}
        advocacyEntries={advocacyEntries.map(e => ({
          id: e.id,
          entryType: e.entryType,
          summary: e.summary,
          who: e.who ?? "",
          date: e.date.toISOString(),
        }))}
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
