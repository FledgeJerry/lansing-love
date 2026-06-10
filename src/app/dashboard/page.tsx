import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OwnershipCheckEditor from "./OwnershipCheckEditor";

export const dynamic = "force-dynamic";

// ─── Data fetching helpers ────────────────────────────────────────────────────

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

  const categorySorted = Object.entries(byCategory)
    .map(([cat, d]) => ({ cat, ...d, pct: d.total > 0 ? Math.round((d.gap / d.total) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct);

  const quarterSorted = Object.entries(byQuarter)
    .map(([qtr, d]) => ({ qtr, ...d, pct: d.total > 0 ? Math.round((d.gap / d.total) * 100) : 0 }))
    .sort((a, b) => a.qtr.localeCompare(b.qtr));

  return {
    totalResolved: resolved.filter((q) => q.outcome).length,
    totalDesires,
    wantedDifferent,
    gapPct: totalDesires > 0 ? Math.round((wantedDifferent / totalDesires) * 100) : null,
    byCategory: categorySorted,
    byQuarter: quarterSorted,
  };
}

async function getResiliencePulse() {
  try {
    const res = await fetch("https://resilience.foundation/api/pulse", {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getFreeStandData() {
  try {
    const [standRes, eventsRes] = await Promise.all([
      fetch("https://freestand.thefledge.com/api/v1/admin/metrics/stand", { next: { revalidate: 300 } }),
      fetch("https://freestand.thefledge.com/api/v1/admin/events?event_type=interaction_detected&limit=100", { next: { revalidate: 300 } }),
    ]);
    const stand = standRes.ok ? await standRes.json() : null;
    const events = eventsRes.ok ? await eventsRes.json() : null;

    // Count interactions per day for last 14 days
    const daily: Record<string, number> = {};
    if (events?.events) {
      const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
      for (const e of events.events) {
        const d = new Date(e.event_ts);
        if (d.getTime() < cutoff) continue;
        const key = d.toISOString().slice(0, 10);
        daily[key] = (daily[key] ?? 0) + 1;
      }
    }

    return { stand, dailyInteractions: daily, totalEvents: events?.events?.length ?? 0 };
  } catch {
    return null;
  }
}

async function getOwnershipChecks() {
  return prisma.ownershipCheck.findMany({ orderBy: { sortOrder: "asc" } });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GapBar({ pct, max }: { pct: number; max: number }) {
  const width = max > 0 ? Math.round((pct / max) * 100) : 0;
  const color = pct > 60 ? "#c0392b" : pct > 40 ? "#E8C84A" : "#4A9B8E";
  return (
    <div style={{ flex: 1, height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{ width: `${width}%`, height: "100%", background: color, borderRadius: "4px", transition: "width 0.4s" }} />
    </div>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-steel-muted)", marginBottom: "1.25rem" }}>
      {children}
    </p>
  );
}

function StatBox({ value, label, sub, color }: { value: string | number; label: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(244,241,232,0.08)", borderRadius: "10px", padding: "1rem 1.25rem" }}>
      <p style={{ fontSize: "2rem", fontWeight: 700, color: color ?? "var(--color-limestone)", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.3rem" }}>{label}</p>
      {sub && <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)", marginTop: "0.15rem" }}>{sub}</p>}
    </div>
  );
}

function PlaceholderPanel({ title, reason }: { title: string; reason: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(244,241,232,0.15)", borderRadius: "10px", padding: "1.5rem", textAlign: "center" }}>
      <p style={{ fontWeight: 600, color: "var(--color-steel-muted)", marginBottom: "0.35rem" }}>{title}</p>
      <p style={{ fontSize: "0.8rem", color: "rgba(154,176,200,0.6)" }}>{reason}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const [session, gap, resilience, freestand, ownershipChecks] = await Promise.all([
    auth(),
    getLegitimacyData(),
    getResiliencePulse(),
    getFreeStandData(),
    getOwnershipChecks(),
  ]);

  const isAdmin = session?.user?.role === "ADMIN";
  const now = Date.now();
  const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
  const anyOverdue = ownershipChecks.some(
    (c) => !c.reviewedAt || now - new Date(c.reviewedAt).getTime() > NINETY_DAYS
  );

  const maxGapPct = gap.byCategory.length > 0 ? Math.max(...gap.byCategory.map((c) => c.pct)) : 100;
  const freestandTotal = freestand ? Object.values(freestand.dailyInteractions).reduce((a, b) => a + b, 0) : null;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Lansing Cooperative Governance</span>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "0.5rem", lineHeight: 1.2 }}>
          The Governance Dashboard
        </h1>
        <p style={{ color: "var(--color-steel-muted)", fontSize: "0.95rem", maxWidth: "680px" }}>
          The standing question, made visible, on a schedule, in public — is power staying where it belongs?
        </p>
      </div>

      {/* ── ZONE 1: THE LEGITIMACY GAP ─────────────────────────────────────── */}
      <section style={{ marginBottom: "3rem" }}>
        <SectionHead>Zone 1 — The Legitimacy Gap</SectionHead>

        {gap.totalDesires === 0 ? (
          <PlaceholderPanel
            title="Legitimacy gap data not yet available"
            reason="Predictions with desired outcomes will appear here once resolved questions accumulate."
          />
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>

            {/* Headline */}
            <div className="card" style={{ padding: "1.75rem 2rem", borderLeft: "4px solid #c0392b" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
                <StatBox
                  value={gap.gapPct != null ? `${gap.gapPct}%` : "—"}
                  label="Legitimacy gap"
                  sub={`${gap.wantedDifferent} of ${gap.totalDesires} votes`}
                  color="#c0392b"
                />
                <StatBox value={gap.totalResolved} label="Resolved predictions" />
                <StatBox value={gap.totalDesires} label="Desires recorded" sub="what residents wanted" />
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--color-steel-muted)", fontStyle: "italic" }}>
                &ldquo;In resolved votes, Lansing residents wanted a different outcome than what happened on{" "}
                <strong style={{ color: "#c0392b" }}>{gap.wantedDifferent} out of {gap.totalDesires}</strong> recorded desires.&rdquo;
              </p>
            </div>

            {/* Gap by category */}
            {gap.byCategory.length > 0 && (
              <div className="card" style={{ padding: "1.5rem" }}>
                <p style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>Gap by Category</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {gap.byCategory.map(({ cat, total, gap: gapCount, pct }) => (
                    <div key={cat} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", minWidth: "180px", flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cat}</span>
                      <GapBar pct={pct} max={maxGapPct} />
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, minWidth: "36px", textAlign: "right", color: "var(--color-limestone)" }}>{pct}%</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--color-steel-muted)", minWidth: "60px" }}>{gapCount}/{total}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gap over time */}
            {gap.byQuarter.length > 1 && (
              <div className="card" style={{ padding: "1.5rem" }}>
                <p style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>Gap Over Time</p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "80px" }}>
                  {gap.byQuarter.map(({ qtr, pct }) => (
                    <div key={qtr} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                      <div style={{ width: "100%", height: `${Math.max(4, pct)}px`, background: pct > 60 ? "#c0392b" : pct > 40 ? "#E8C84A" : "#4A9B8E", borderRadius: "3px 3px 0 0" }} />
                      <span style={{ fontSize: "0.6rem", color: "var(--color-steel-muted)", textAlign: "center" }}>{qtr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Council scorecard placeholder */}
            <PlaceholderPanel
              title="Council Member Scorecard"
              reason="Coming soon — requires linking vote outcomes to individual council members in the prediction data."
            />
          </div>
        )}
      </section>

      {/* ── ZONE 2: THE COOPERATIVE NETWORK ────────────────────────────────── */}
      <section style={{ marginBottom: "3rem" }}>
        <SectionHead>Zone 2 — The Cooperative Network</SectionHead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>

          {/* Entrepreneur pipeline */}
          {resilience ? (
            <div className="card" style={{ padding: "1.5rem" }}>
              <p style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>TREK Entrepreneur Pipeline</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <StatBox value={resilience.entrepreneurs.total} label="Entrepreneurs" />
                <StatBox value={resilience.coops.total} label="Co-ops" />
                <StatBox value={resilience.housing.projects} label="Housing projects" />
                <StatBox value={`+${resilience.entrepreneurs.addedLast90Days}`} label="Added last 90 days" color="var(--color-teal-accent)" />
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {[
                  { label: "Minority-owned", val: resilience.entrepreneurs.minorityOwned },
                  { label: "Woman-owned", val: resilience.entrepreneurs.womanOwned },
                  { label: "Veteran-owned", val: resilience.entrepreneurs.veteranOwned },
                ].map(({ label, val }) => val > 0 && (
                  <span key={label} className="badge badge--teal" style={{ fontSize: "0.7rem" }}>
                    {val} {label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <PlaceholderPanel title="TREK Entrepreneur Pipeline" reason="resilience.foundation data unavailable — will populate when site is reachable." />
          )}

          {/* Handbook pipeline */}
          {resilience ? (
            <div className="card" style={{ padding: "1.5rem" }}>
              <p style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>Co-op Handbook Pipeline</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <StatBox value={resilience.coops.activelyBuildingHandbook} label="Actively building" sub="handbook in progress" color="var(--color-dome-gold)" />
                <StatBox value={resilience.handbook.fieldsFilled} label="Sections completed" sub="across all handbooks" />
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)" }}>
                {resilience.coops.total > 0
                  ? `${Math.round((resilience.coops.activelyBuildingHandbook / resilience.coops.total) * 100)}% of registered co-ops are actively building their handbook`
                  : "No co-ops registered yet"}
              </p>
            </div>
          ) : (
            <PlaceholderPanel title="Co-op Handbook Pipeline" reason="resilience.foundation data unavailable." />
          )}

          {/* Co-op governance participation */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <p style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem" }}>Co-op Governance Participation</p>
            <PlaceholderPanel
              title="Participation data collection in progress"
              reason="Target: 80% participation in governance votes. Data collection infrastructure in development. Co-ops will submit standardized quarterly reports."
            />
          </div>

          {/* Geographic reach */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <p style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem" }}>Geographic Reach — Equity Map</p>
            <PlaceholderPanel
              title="Member geographic data collection in progress"
              reason="The south and west sides are underrepresented relative to the east and north. This map will make that visible. Data infrastructure in development."
            />
          </div>

          {/* FreeStand */}
          {freestand ? (
            <div className="card" style={{ padding: "1.5rem" }}>
              <p style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>Free Food Stand — Community Need Met</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <StatBox value={freestandTotal ?? "—"} label="Interactions (14 days)" color="var(--color-teal-accent)" />
                <StatBox value={Object.keys(freestand.dailyInteractions).length} label="Active days" />
              </div>
              {Object.keys(freestand.dailyInteractions).length > 0 && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "48px" }}>
                  {Object.entries(freestand.dailyInteractions)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, count]) => {
                      const max = Math.max(...Object.values(freestand.dailyInteractions));
                      return (
                        <div key={date} style={{ flex: 1, height: `${Math.max(4, Math.round((count / max) * 48))}px`, background: "var(--color-teal-accent)", borderRadius: "2px 2px 0 0", opacity: 0.8 }} title={`${date}: ${count}`} />
                      );
                    })}
                </div>
              )}
            </div>
          ) : (
            <PlaceholderPanel title="Free Food Stand" reason="FreeStand API unavailable — will populate when freestand.thefledge.com is reachable." />
          )}

        </div>
      </section>

      {/* ── ZONE 3: THE OWNERSHIP CHECK ─────────────────────────────────────── */}
      <section>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-steel-muted)" }}>
            Zone 3 — The Ownership Check
          </p>
          {anyOverdue && (
            <span className="badge badge--danger" style={{ fontSize: "0.65rem" }}>⚠ Overdue for review</span>
          )}
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)", marginBottom: "1.25rem", maxWidth: "680px" }}>
          Four questions answered by humans, quarterly, in public. Updated by a rotating facilitator after the network&apos;s Five Compass Questions review. If any question is more than 90 days old, this panel flags it.
        </p>

        {isAdmin ? (
          <OwnershipCheckEditor
            checks={ownershipChecks.map((c) => ({
              ...c,
              reviewedAt: c.reviewedAt?.toISOString() ?? null,
            }))}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {ownershipChecks.map((c) => {
              const isStale = c.reviewedAt && now - new Date(c.reviewedAt).getTime() > NINETY_DAYS;
              return (
                <div key={c.id} style={{ background: "var(--color-deep-navy)", border: `1px solid ${isStale ? "#c0392b44" : "rgba(244,241,232,0.1)"}`, borderRadius: "8px", padding: "1.25rem" }}>
                  <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-limestone)", marginBottom: "0.5rem" }}>{c.question}</p>
                  {c.answer ? (
                    <p style={{ color: "var(--color-steel-muted)", fontSize: "0.875rem", fontStyle: "italic" }}>&ldquo;{c.answer}&rdquo;</p>
                  ) : (
                    <p style={{ color: "rgba(154,176,200,0.5)", fontSize: "0.8rem" }}>Not yet answered — check back after the next quarterly review.</p>
                  )}
                  {c.reviewedAt && (
                    <p style={{ fontSize: "0.72rem", color: isStale ? "#c0392b" : "var(--color-steel-muted)", marginTop: "0.4rem" }}>
                      {isStale ? "⚠ Overdue — " : ""}Reviewed {new Date(c.reviewedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
