"use client";

import { useState } from "react";
import Link from "next/link";
import OwnershipCheckEditor from "./OwnershipCheckEditor";

// ─── Types ────────────────────────────────────────────────────────────────────

type LegitimacyData = {
  totalResolved: number;
  totalDesires: number;
  wantedDifferent: number;
  gapPct: number | null;
  byCategory: { cat: string; total: number; gap: number; pct: number }[];
  byQuarter: { qtr: string; total: number; gap: number; pct: number }[];
};

type ResilienceData = {
  entrepreneurs: { total: number; addedLast90Days: number; minorityOwned: number; womanOwned: number; veteranOwned: number; disabilityOwned: number };
  coops: { total: number; activelyBuildingHandbook: number };
  housing: { projects: number };
  handbook: { fieldsFilled: number; uniqueFieldIds: number };
} | null;

type FreeStandDay = { day: string; count: number; morning?: number; afternoon?: number; evening?: number; night?: number };

type FreeStandData = {
  interactions_today: number;
  interactions_week: number;
  interactions_total: number;
  daily_interactions: FreeStandDay[];
} | null;

type CouncilMemberStat = {
  name: string;
  seat: string;
  rollCalls: number;
  yes: number;
  no: number;
  abstain: number;
  recuse: number;
  absent: number;
  splitRate: number;
  attendance: number;
};

type RhinoTrackerData = {
  totalRollCalls: number;
  unanimous: number;
  contested: number;
  bodySplitRate: number;
  members: CouncilMemberStat[];
} | null;

type OwnershipCheckItem = {
  id: string;
  sortOrder: number;
  question: string;
  answer: string;
  reviewedAt: string | null;
  updatedBy: string;
};

type AdvocacyEntry = {
  id: string;
  entryType: string;
  summary: string;
  who: string;
  date: string;
};

interface Props {
  isAdmin: boolean;
  gap: LegitimacyData;
  resilience: ResilienceData;
  freestand: FreeStandData;
  rhinoTracker: RhinoTrackerData;
  advocacyEntries: AdvocacyEntry[];
  ownershipChecks: OwnershipCheckItem[];
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "governance",  label: "Governance" },
  { id: "legitimacy",  label: "Legitimacy Gap" },
  { id: "network",     label: "Cooperative Network" },
  { id: "ownership",   label: "Ownership Check" },
  { id: "advocacy",    label: "Civic Advocacy" },
  { id: "policy",      label: "Policy Monitor" },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Shared sub-components ────────────────────────────────────────────────────

function GapBar({ pct, max }: { pct: number; max: number }) {
  const width = max > 0 ? Math.round((pct / max) * 100) : 0;
  const color = pct > 60 ? "#c0392b" : pct > 40 ? "#E8C84A" : "#4A9B8E";
  return (
    <div style={{ flex: 1, height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{ width: `${width}%`, height: "100%", background: color, borderRadius: "4px", transition: "width 0.4s" }} />
    </div>
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

function PendingPanel({ title, description, blocker }: { title: string; description: string; blocker: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(244,241,232,0.15)", borderRadius: "10px", padding: "1.5rem" }}>
      <p style={{ fontWeight: 600, color: "var(--color-steel-muted)", marginBottom: "0.4rem", fontSize: "0.9rem" }}>{title}</p>
      <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", marginBottom: "0.6rem" }}>{description}</p>
      <p style={{ fontSize: "0.72rem", color: "rgba(154,176,200,0.5)", fontStyle: "italic" }}>{blocker}</p>
    </div>
  );
}

// ─── Zone 1: Legitimacy Gap ───────────────────────────────────────────────────

const COUNCIL_ROSTER = [
  { name: "Ryan Kost",               seat: "Ward 1",   term: "2027", note: "Council President 2025" },
  { name: "Deyanira Nevarez Martinez", seat: "Ward 2", term: "2029", note: "New Jan 2026; MSU urban planning professor; authored current housing ordinances" },
  { name: "Adam Hussain",            seat: "Ward 3",   term: "2027", note: "" },
  { name: "Peter Spadafore",         seat: "Ward 4",   term: "2029", note: "Council President 2026; moved from at-large Nov 2025" },
  { name: "Tamera Carter",           seat: "At-Large", term: "2027", note: "Council VP 2025" },
  { name: "Trini Pehlivanoglu",      seat: "At-Large", term: "2027", note: "Council VP 2026" },
  { name: "Jeremy Garza",            seat: "At-Large", term: "2029", note: "Moved from Ward 2 to at-large Nov 2025" },
  { name: "Clara Martinez",          seat: "At-Large", term: "2029", note: "New Jan 2026" },
];

function CouncilScorecard({ rhino }: { rhino: RhinoTrackerData }) {
  const MAYOR_RACE = ["Adam Hussain", "Peter Spadafore"];

  if (!rhino) {
    return (
      <div>
        <p style={{ fontSize: "0.78rem", color: "rgba(154,176,200,0.7)", marginBottom: "0.75rem" }}>
          Council roster confirmed January 2026. Vote data will populate once Rhino News council tracker is linked — next step is connecting resolved lansing.love predictions to individual member votes.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(244,241,232,0.1)" }}>
                {["Member", "Seat", "Term ends", "Roll calls", "Split rate", "Attendance"].map((h) => (
                  <th key={h} style={{ padding: "0.4rem 0.6rem", textAlign: h === "Member" || h === "Seat" || h === "Term ends" ? "left" : "right", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COUNCIL_ROSTER.map((m) => (
                <tr key={m.name} style={{ borderBottom: "1px solid rgba(244,241,232,0.05)" }}>
                  <td style={{ padding: "0.5rem 0.6rem", color: "var(--color-limestone)", whiteSpace: "nowrap" }}>
                    {m.name}
                    {MAYOR_RACE.includes(m.name) && (
                      <span style={{ marginLeft: "0.4rem", fontSize: "0.62rem", color: "var(--color-dome-gold)", fontWeight: 600 }}>mayor race</span>
                    )}
                  </td>
                  <td style={{ padding: "0.5rem 0.6rem", color: "var(--color-steel-muted)", fontSize: "0.72rem" }}>{m.seat}</td>
                  <td style={{ padding: "0.5rem 0.6rem", color: "var(--color-steel-muted)", fontSize: "0.72rem" }}>{m.term}</td>
                  <td style={{ padding: "0.5rem 0.6rem", textAlign: "right", color: "rgba(154,176,200,0.25)" }}>—</td>
                  <td style={{ padding: "0.5rem 0.6rem", textAlign: "right", color: "rgba(154,176,200,0.25)" }}>—</td>
                  <td style={{ padding: "0.5rem 0.6rem", textAlign: "right", color: "rgba(154,176,200,0.25)" }}>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: "0.7rem", color: "rgba(154,176,200,0.5)", marginTop: "0.75rem" }}>
          Lansing is the first Michigan city council with a Latino majority (Garza, Pehlivanoglu, Nevarez Martinez, Clara Martinez). Hussain and Spadafore are both running for mayor while still voting on council — their responsiveness scores will be the most consequential numbers here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Headline row */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {[
          { value: rhino.totalRollCalls, label: "Roll calls" },
          { value: rhino.contested, label: "Contested" },
          { value: rhino.unanimous, label: "Unanimous" },
          { value: `${rhino.bodySplitRate}%`, label: "Body split rate" },
        ].map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-limestone)", lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.2rem" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Member table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(244,241,232,0.1)" }}>
              {["Member", "Seat", "Roll calls", "Yes", "No", "Split rate", "Attendance"].map((h) => (
                <th key={h} style={{ padding: "0.4rem 0.6rem", textAlign: h === "Member" || h === "Seat" ? "left" : "right", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rhino.members.map((m) => (
              <tr key={m.name} style={{ borderBottom: "1px solid rgba(244,241,232,0.05)" }}>
                <td style={{ padding: "0.5rem 0.6rem", color: "var(--color-limestone)", whiteSpace: "nowrap" }}>
                  {m.name}
                  {MAYOR_RACE.includes(m.name) && (
                    <span style={{ marginLeft: "0.4rem", fontSize: "0.62rem", color: "var(--color-dome-gold)", fontWeight: 600 }}>mayor race</span>
                  )}
                </td>
                <td style={{ padding: "0.5rem 0.6rem", color: "var(--color-steel-muted)", fontSize: "0.72rem", whiteSpace: "nowrap" }}>{m.seat}</td>
                <td style={{ padding: "0.5rem 0.6rem", textAlign: "right", color: "var(--color-steel-muted)" }}>{m.rollCalls}</td>
                <td style={{ padding: "0.5rem 0.6rem", textAlign: "right", color: "var(--color-teal-accent)" }}>{m.yes}</td>
                <td style={{ padding: "0.5rem 0.6rem", textAlign: "right", color: m.no > 0 ? "#c0392b" : "var(--color-steel-muted)" }}>{m.no}</td>
                <td style={{ padding: "0.5rem 0.6rem", textAlign: "right", fontWeight: m.splitRate > 0 ? 600 : 400, color: m.splitRate > 0 ? "#E8C84A" : "var(--color-steel-muted)" }}>{m.splitRate}%</td>
                <td style={{ padding: "0.5rem 0.6rem", textAlign: "right", color: "var(--color-steel-muted)" }}>{m.attendance}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: "0.7rem", color: "rgba(154,176,200,0.5)", marginTop: "0.75rem" }}>
        Split rate: % of contested votes where this member voted with the minority. Source:{" "}
        <a href="https://rhinocerosmedia.org/council-tracker" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(154,176,200,0.7)" }}>Rhino News council tracker</a>.
        Linking vote positions to resident desires on lansing.love predictions is the next step.
      </p>
    </div>
  );
}

function ZoneLegitimacy({ gap, rhinoTracker }: { gap: LegitimacyData; rhinoTracker: RhinoTrackerData }) {
  const maxGapPct = gap.byCategory.length > 0 ? Math.max(...gap.byCategory.map((c) => c.pct)) : 100;

  if (gap.totalDesires === 0) {
    return (
      <PlaceholderPanel
        title="Legitimacy gap data not yet available"
        reason="Predictions with desired outcomes will appear here once resolved questions accumulate."
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div className="card" style={{ padding: "1.75rem 2rem", borderLeft: "4px solid #c0392b" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
          <StatBox value={gap.gapPct != null ? `${gap.gapPct}%` : "—"} label="Legitimacy gap" sub={`${gap.wantedDifferent} of ${gap.totalDesires} votes`} color="#c0392b" />
          <StatBox value={gap.totalResolved} label="Resolved predictions" />
          <StatBox value={gap.totalDesires} label="Desires recorded" sub="what residents wanted" />
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--color-steel-muted)", fontStyle: "italic" }}>
          &ldquo;In resolved votes, Lansing residents wanted a different outcome than what happened on{" "}
          <strong style={{ color: "#c0392b" }}>{gap.wantedDifferent} out of {gap.totalDesires}</strong> recorded desires.&rdquo;
        </p>
      </div>

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

      <div className="card" style={{ padding: "1.5rem" }}>
        <p style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem" }}>Council Member Scorecard</p>
        <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", marginBottom: "1rem" }}>
          Vote record for the January 2026 council. Hussain and Spadafore are both running for mayor while still voting on council — their records are live and consequential. Lansing is the first Michigan city council with a Latino majority.
        </p>
        <CouncilScorecard rhino={rhinoTracker} />
      </div>
    </div>
  );
}

// ─── Zone 2: Cooperative Network ─────────────────────────────────────────────

function ZoneNetwork({ resilience, freestand }: { resilience: ResilienceData; freestand: FreeStandData }) {
  const freestandDays = freestand?.daily_interactions ?? [];
  const maxDayCount = freestandDays.length > 0 ? Math.max(...freestandDays.map((d) => d.count)) : 1;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
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
              <span key={label} className="badge badge--teal" style={{ fontSize: "0.7rem" }}>{val} {label}</span>
            ))}
          </div>
        </div>
      ) : (
        <PlaceholderPanel title="TREK Entrepreneur Pipeline" reason="resilience.foundation data unavailable — will populate when site is reachable." />
      )}

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

      {freestand ? (
        <div className="card" style={{ padding: "1.5rem" }}>
          <p style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>Free Food Stand — Community Need Met</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
            <StatBox value={freestand.interactions_week} label="Interactions this week" color="var(--color-teal-accent)" />
            <StatBox value={freestand.interactions_today} label="Today" />
            <StatBox value={freestand.interactions_total.toLocaleString()} label="All time" />
            <StatBox value={freestandDays.length} label="Days tracked" />
          </div>
          {freestandDays.length > 0 && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "48px" }}>
              {freestandDays.slice(-14).map((d) => (
                <div key={d.day} style={{ flex: 1, height: `${Math.max(4, Math.round((d.count / maxDayCount) * 48))}px`, background: "var(--color-teal-accent)", borderRadius: "2px 2px 0 0", opacity: 0.8 }} title={`${d.day}: ${d.count}`} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <PlaceholderPanel title="Free Food Stand" reason="FreeStand API unavailable — will populate when freestand.thefledge.com is reachable." />
      )}

      <PendingPanel
        title="Co-op Governance Participation"
        description="Target: 80% of worker-owners participating in major governance votes per quarter. Flag threshold: below 60% for two consecutive quarters. Co-ops will submit standardized quarterly reports: participation rate, votes held, Five Compass Questions run (Y/N), facilitation rotated (Y/N)."
        blocker="Reporting workflow under development. This panel will not show estimates — only verified reports."
      />

      <PendingPanel
        title="Geographic Reach — Equity Map"
        description="Lansing is ~23% Black, ~13% Hispanic/Latino, concentrated south and west — a legacy of HOLC redlining and the 1960s I-496 construction, which displaced 890 dwellings from Lansing's main Black neighborhood. The cooperative network's current gravity is east and north. This map will make that gap visible, not hide it."
        blocker="Waiting on member location data at zip code or neighborhood level. A map showing only co-op locations would be misleading and will not be built until member data exists."
      />

      <PendingPanel
        title="Upcoming Co-op & Governance Events"
        description="Fledge events relevant to the cooperative network — co-op workshops, governance meetings, public advocacy events — pulled live from thefledge.com's events system."
        blocker="Confirming thefledge.com events API endpoint before building."
      />

      <PendingPanel
        title="FLDG Token — Cooperative Economy"
        description="25 FLDG = 1 hour of cooperative work. Total FLDG in circulation, recent transactions, and trend over time — making the cooperative economy visible as hours exchanged within the network. Token: 0x5118aec3afcca3f1e21733ee9c88bb800afe6f7b (Polygon)."
        blocker="Confirming whether data is accessible via thefledge.com API or requires a direct Polygon query."
      />
    </div>
  );
}

// ─── Zone 3: Ownership Check ──────────────────────────────────────────────────

function ZoneOwnership({ isAdmin, ownershipChecks }: { isAdmin: boolean; ownershipChecks: OwnershipCheckItem[] }) {
  const now = Date.now();
  const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
  const anyOverdue = ownershipChecks.some((c) => !c.reviewedAt || now - new Date(c.reviewedAt).getTime() > NINETY_DAYS);

  return (
    <>
      <p style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)", marginBottom: "1.25rem", maxWidth: "680px" }}>
        Four questions answered by humans, quarterly, in public. Updated by a rotating facilitator after the network&apos;s Five Compass Questions review. If any answer is more than 90 days old, this panel flags it.
      </p>
      {anyOverdue && (
        <div style={{ marginBottom: "1rem" }}>
          <span className="badge badge--danger" style={{ fontSize: "0.65rem" }}>⚠ Overdue for review</span>
        </div>
      )}
      {isAdmin ? (
        <OwnershipCheckEditor checks={ownershipChecks} />
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
    </>
  );
}

// ─── Zone 4: Civic Advocacy ───────────────────────────────────────────────────

const TRACKED_ORDINANCES = [
  { label: "Neighborhood advisory boards with formal standing", track: "Ordinance", note: "Binding say, not advisory only. Los Angeles has 99 neighborhood councils." },
  { label: "Participatory budgeting pilot", track: "Ordinance", note: "Grand Rapids precedent: 2022, $2M, no charter change required." },
  { label: "Proactive disclosure / open records default", track: "Ordinance", note: "Shifts burden: government publishes proactively instead of waiting for requests." },
  { label: "Conflict-of-interest recusal on appointed boards", track: "Ordinance", note: "Required and on the record. Currently at board members' discretion." },
  { label: "BWL board reform — elected seats, enforced terms", track: "Charter", note: "Requires public vote. Next charter cycle." },
  { label: "Independent auditor — mandate and funding", track: "Charter", note: "Partially addressed in 2025 charter; scope and independence need strengthening." },
];

const ENTRY_TYPE_COLOR: Record<string, string> = {
  council_contact: "var(--color-teal-accent)",
  testimony:       "var(--color-dome-gold)",
  endorsement:     "#a78bfa",
  anchor_meeting:  "var(--color-steel-muted)",
};

const ENTRY_TYPE_LABEL: Record<string, string> = {
  council_contact: "Council",
  testimony:       "Testimony",
  endorsement:     "Endorsement",
  anchor_meeting:  "Anchor",
};

function ZoneAdvocacy({ entries }: { entries: AdvocacyEntry[] }) {
  const councilMembers = new Set(entries.filter(e => e.entryType === "council_contact").map(e => e.who).filter(Boolean)).size;
  const testimony      = entries.filter(e => e.entryType === "testimony").length;
  const anchors        = new Set(entries.filter(e => e.entryType === "anchor_meeting").map(e => e.who).filter(Boolean)).size;

  return (
    <>
      <p style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)", marginBottom: "1.25rem", maxWidth: "680px" }}>
        The &ldquo;transform, not seize&rdquo; track — what the network is doing to reform city government from outside. Updated weekly by staff.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { value: councilMembers || "—", label: "Council members engaged", desc: "Active relationships on polycentric reform agenda" },
          { value: 6,                     label: "Ordinances tracked",       desc: "Neighborhood councils, PB pilot, open-records default, recusal requirement, BWL board reform, independent auditor" },
          { value: testimony      || "—", label: "Testimony appearances",    desc: "Public advocacy at council, BWL, and board meetings this year" },
          { value: anchors        || "—", label: "Anchor institutions",      desc: "Procurement relationships in progress" },
        ].map(({ value, label, desc }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(244,241,232,0.1)", borderRadius: "10px", padding: "1rem" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: value === "—" ? "rgba(154,176,200,0.3)" : "var(--color-dome-gold)", lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.3rem" }}>{label}</p>
            <p style={{ fontSize: "0.7rem", color: "rgba(154,176,200,0.6)", marginTop: "0.2rem" }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Activity log */}
      {entries.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Recent activity</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {entries.slice(0, 10).map((entry) => (
              <div key={entry.id} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", padding: "0.6rem 0.875rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,241,232,0.07)", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: ENTRY_TYPE_COLOR[entry.entryType] ?? "var(--color-steel-muted)", flexShrink: 0, marginTop: "0.15rem", minWidth: "68px" }}>
                  {ENTRY_TYPE_LABEL[entry.entryType] ?? entry.entryType}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {entry.who && <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-limestone)" }}>{entry.who} — </span>}
                  <span style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)" }}>{entry.summary}</span>
                </div>
                <span style={{ fontSize: "0.68rem", color: "rgba(154,176,200,0.4)", flexShrink: 0, whiteSpace: "nowrap" }}>
                  {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Tracked ordinances & charter items</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {TRACKED_ORDINANCES.map((item) => (
            <div key={item.label} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,241,232,0.07)", borderRadius: "8px", padding: "0.75rem 1rem" }}>
              <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: item.track === "Charter" ? "#E8C84A" : "var(--color-teal-accent)", flexShrink: 0, marginTop: "0.1rem", minWidth: "60px" }}>{item.track}</span>
              <div>
                <p style={{ fontSize: "0.82rem", color: "var(--color-limestone)", marginBottom: "0.1rem" }}>{item.label}</p>
                <p style={{ fontSize: "0.72rem", color: "rgba(154,176,200,0.6)", margin: 0 }}>{item.note}</p>
              </div>
              <span style={{ fontSize: "0.7rem", color: "rgba(154,176,200,0.3)", flexShrink: 0, marginLeft: "auto", alignSelf: "center" }}>○ tracking</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Zone 5: Policy Monitor ───────────────────────────────────────────────────

function ZonePolicy() {
  return (
    <>
      <p style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)", marginBottom: "1.25rem", maxWidth: "680px" }}>
        What Lansing&apos;s government is actually doing on the issues the network cares about — tracked across City Council, BWL board, and the Michigan legislature (state preemption risk: the Ann Arbor/AG situation on public financing is the warning sign).
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
        {[
          {
            title: "Ordinance Track (No ballot needed)",
            items: [
              "Neighborhood advisory boards with formal standing and required response mechanism",
              "Participatory budgeting pilot — Grand Rapids precedent: 2022, $2M, no charter change",
              "Proactive disclosure / open records default",
              "Conflict-of-interest recusal required on record for appointed boards",
            ],
          },
          {
            title: "Charter Track (Requires public vote)",
            items: [
              "BWL board reform — elected seats, enforced terms",
              "Independent auditor — mandate and funding",
              "Stakeholder/expert seats on development and housing boards with balanced composition",
            ],
          },
          {
            title: "Board Composition Database",
            items: [
              "All Lansing appointed boards: member, appointment date, term expiration, appointing official",
              "Flag: members serving past expired terms — a documented accountability gap",
              "First board: Lansing Housing Commission — see full case study",
              "MSU urban planning or public policy student partner recommended for full build",
            ],
            link: "/governance/issues",
            linkLabel: "All board case studies →",
          },
        ].map(({ title, items, link, linkLabel }: { title: string; items: string[]; link?: string; linkLabel?: string }) => (
          <div key={title} style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(244,241,232,0.15)", borderRadius: "10px", padding: "1.25rem" }}>
            <p style={{ fontWeight: 600, color: "var(--color-steel-muted)", marginBottom: "0.75rem", fontSize: "0.85rem" }}>{title}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {items.map((item) => (
                <li key={item} style={{ fontSize: "0.78rem", color: "rgba(154,176,200,0.7)", display: "flex", gap: "0.4rem" }}>
                  <span style={{ color: "rgba(154,176,200,0.3)", flexShrink: 0 }}>○</span>
                  {item}
                </li>
              ))}
            </ul>
            {link && linkLabel && (
              <Link href={link} style={{ fontSize: "0.75rem", color: "var(--color-dome-gold)", display: "inline-block", marginTop: "0.6rem" }}>{linkLabel}</Link>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Zone 6: Governance ───────────────────────────────────────────────────────

function ZoneGovernance() {
  return (
    <>
      <p style={{ fontSize: "0.95rem", color: "var(--color-steel-muted)", maxWidth: "640px", marginBottom: "2rem" }}>
        lansing.love is built on a governance argument: that concentrated power is Lansing&apos;s root problem, that polycentric design is the answer, and that this dashboard — and the cooperative network behind it — are early evidence the design works.
      </p>

      {/* Monocentric vs Polycentric */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>The core problem</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="card" style={{ padding: "1.25rem", borderTop: "2px solid rgba(192,57,43,0.4)" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(192,57,43,0.7)", marginBottom: "0.5rem" }}>Monocentric — today</p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}>Mayor appoints every board, commission, and department head. One center of power. Every governance failure in Lansing grows from this structure.</p>
          </div>
          <div className="card" style={{ padding: "1.25rem", borderTop: "2px solid rgba(74,155,142,0.5)" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-teal-accent)", marginBottom: "0.5rem" }}>Polycentric — the goal</p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}>Decisions sit close to the people who live with them. Neighborhood councils, expert boards, participatory budgeting, sortition — many centers, not one.</p>
          </div>
        </div>
      </div>

      {/* 4 measures */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>What polycentric governance produces</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
          {[
            { label: "Responsiveness", desc: "Decisions made by those who live with them" },
            { label: "Resilience",     desc: "One unit's failure stays contained" },
            { label: "Legitimacy",     desc: "Built into structure, not dependent on who's in office" },
            { label: "Local retention", desc: "Value kept in the neighborhoods where it's generated" },
          ].map(({ label, desc }) => (
            <div key={label} className="card--accent" style={{ padding: "0.875rem 1rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", fontSize: "0.82rem", marginBottom: "0.2rem" }}>{label}</p>
              <p style={{ fontSize: "0.75rem", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4 reforms */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Four reforms — all doable</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "0.75rem" }}>
          {[
            { n: "1", label: "Neighborhood councils", desc: "Binding say in neighborhood decisions. Not advisory only. Los Angeles has 99 of them." },
            { n: "2", label: "Participatory budgeting", desc: "Residents vote on part of the city budget. Grand Rapids did it by ordinance — no charter change." },
            { n: "3", label: "Stakeholder & expert boards", desc: "People affected by decisions, and people who understand them, seated as decision-makers." },
            { n: "4", label: "Citizens' assembly (sortition)", desc: "Panel chosen by lot for capture-prone questions. Can't be campaigned for. Can't be bought." },
          ].map(({ n, label, desc }) => (
            <div key={n} className="card" style={{ padding: "1rem" }}>
              <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--color-teal-accent)", marginBottom: "0.3rem" }}>{n}</p>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", marginBottom: "0.3rem" }}>{label}</p>
              <p style={{ fontSize: "0.78rem", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap phases */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>The roadmap</p>
        <div style={{ display: "flex", gap: "0.3rem", overflowX: "auto" }}>
          {[
            { num: 0, label: "Prove it",            time: "Now",       active: true  },
            { num: 1, label: "Open the doors",      time: "Years 1–3", active: false },
            { num: 2, label: "Seat real authority", time: "Years 2–5", active: false },
            { num: 3, label: "Lock it in",          time: "Years 4–8+", active: false },
          ].map((phase, i, arr) => (
            <div key={phase.num} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ flex: 1, border: `1px solid ${phase.active ? "rgba(74,155,142,0.5)" : "rgba(244,241,232,0.1)"}`, borderRadius: "6px", padding: "0.75rem", background: phase.active ? "rgba(74,155,142,0.05)" : "transparent", minWidth: "90px" }}>
                <p style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: phase.active ? "var(--color-teal-accent)" : "var(--color-text-muted)", margin: 0 }}>Phase {phase.num}</p>
                <p style={{ fontWeight: 600, fontSize: "0.78rem", color: "var(--color-limestone)", margin: "0.2rem 0 0" }}>{phase.label}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", margin: 0 }}>{phase.time}</p>
              </div>
              {i < arr.length - 1 && <span style={{ color: "rgba(244,241,232,0.2)", padding: "0 0.2rem", flexShrink: 0, fontSize: "0.8rem" }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.5rem", borderTop: "1px solid rgba(244,241,232,0.08)" }}>
        <Link href="/governance" className="btn btn--secondary btn--sm">Full explainer →</Link>
        <Link href="/governance/roadmap" className="btn btn--ghost btn--sm">The roadmap →</Link>
        <Link href="/governance/dashboard" className="btn btn--ghost btn--sm">Why the dashboard →</Link>
        <Link href="/predictions" className="btn btn--ghost btn--sm">See predictions →</Link>
      </div>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function DashboardTabs({ isAdmin, gap, resilience, freestand, rhinoTracker, advocacyEntries, ownershipChecks }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("governance");

  return (
    <>
      <div role="tablist" style={{ display: "flex", borderBottom: "1px solid rgba(244,241,232,0.1)", marginBottom: "2rem", overflowX: "auto" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "0.75rem 1.25rem",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid var(--color-teal-accent)" : "2px solid transparent",
              color: activeTab === tab.id ? "var(--color-limestone)" : "var(--color-steel-muted)",
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: "0.875rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              marginBottom: "-1px",
              transition: "color 0.15s",
              fontFamily: "inherit",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {activeTab === "legitimacy" && <ZoneLegitimacy gap={gap} rhinoTracker={rhinoTracker} />}
        {activeTab === "network"    && <ZoneNetwork resilience={resilience} freestand={freestand} />}
        {activeTab === "ownership"  && <ZoneOwnership isAdmin={isAdmin} ownershipChecks={ownershipChecks} />}
        {activeTab === "advocacy"    && <ZoneAdvocacy entries={advocacyEntries} />}
        {activeTab === "policy"      && <ZonePolicy />}
        {activeTab === "governance"  && <ZoneGovernance />}
      </div>
    </>
  );
}
