"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Feature, Geometry } from "geojson";
import OwnershipCheckEditor from "./OwnershipCheckEditor";
import { ALICE_SNAPSHOT } from "./aliceData";
import type { TractProps } from "@/components/TractChoroplethMap";

const TractChoroplethMap = dynamic(() => import("@/components/TractChoroplethMap"), { ssr: false });

type TractData = Feature<Geometry, TractProps>[] | null;

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
  housing: { projects: number; activeShareholders: number; totalOccupants: number; shareholdersWithOccupancyData: number };
  handbook: { fieldsFilled: number; uniqueFieldIds: number };
  governance: { proposalsVoted: number; coopsWithVoteData: number; avgParticipationPct: number | null };
  lansingComparison: {
    source: string;
    population: number;
    pctMinority: number;
    pctBlack: number;
    pctHispanic: number;
    pctAsian: number;
    pctFemale: number | null;
  } | null;
} | null;

type FledgeEvent = { id: string; title: string; slug: string; date: string; space: string; category: string | null };
type FledgeEvents = FledgeEvent[] | null;

type UrbandaleData = {
  active_plots: number;
  active_plantings: number;
  total_harvest_lbs: number;
  harvest_lbs_this_year: number;
  projected_harvest_lbs: number;
  crops_missing_yield: number;
  workers: number;
  members: number;
  battery_pct: number | null;
  solar_watts: number | null;
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
  fledgeEvents: FledgeEvents;
  urbandale: UrbandaleData;
  tractData: TractData;
  rhinoTracker: RhinoTrackerData;
  advocacyEntries: AdvocacyEntry[];
  ownershipChecks: OwnershipCheckItem[];
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "governance",  label: "Governance" },
  { id: "legitimacy",  label: "Legitimacy Gap" },
  { id: "network",     label: "Cooperative Network" },
  { id: "needs",       label: "Basic Needs" },
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

function ComparisonBar({
  label, entrepreneurPct, cityPct, cityLabel,
}: { label: string; entrepreneurPct: number; cityPct: number | null; cityLabel: string }) {
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--color-steel-muted)", marginBottom: "0.2rem" }}>
        <span>{label}</span>
        <span>{entrepreneurPct}% TREK vs. {cityPct !== null ? `${cityPct}%` : "—"} {cityLabel}</span>
      </div>
      <div style={{ position: "relative", height: "16px", background: "var(--color-border)", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, entrepreneurPct)}%`, height: "100%", background: "var(--color-teal-accent)", borderRadius: "4px" }} />
        {cityPct !== null && (
          <div style={{ position: "absolute", top: 0, left: `${Math.min(100, cityPct)}%`, width: "2px", height: "100%", background: "var(--color-dome-gold)" }} title={`${cityLabel}: ${cityPct}%`} />
        )}
      </div>
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

function ZoneNetwork({ resilience, freestand, fledgeEvents, urbandale, tractData }: { resilience: ResilienceData; freestand: FreeStandData; fledgeEvents: FledgeEvents; urbandale: UrbandaleData; tractData: TractData }) {
  const freestandDays = freestand?.daily_interactions ?? [];
  const maxDayCount = freestandDays.length > 0 ? Math.max(...freestandDays.map((d) => d.count)) : 1;

  const eventCategoryCounts = (() => {
    if (!fledgeEvents) return null;
    const counts: Record<string, number> = {};
    for (const e of fledgeEvents) {
      const cat = e.category?.trim() || "Uncategorized";
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  })();
  const maxEventCount = eventCategoryCounts && eventCategoryCounts.length > 0
    ? Math.max(...eventCategoryCounts.map((c) => c.count)) : 1;
  const now = new Date();
  const pastEventCount = fledgeEvents?.filter((e) => new Date(e.date) < now).length ?? 0;
  const futureEventCount = fledgeEvents ? fledgeEvents.length - pastEventCount : 0;

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

      {resilience && resilience.lansingComparison ? (
        <div className="card" style={{ padding: "1.5rem" }}>
          <p style={{ fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.9rem" }}>Entrepreneur Reach vs. City of Lansing</p>
          <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)", marginBottom: "1rem" }}>
            {resilience.lansingComparison.source}. Compares the share of TREK businesses flagged minority-/woman-owned to Lansing&apos;s citywide composition — not who runs each business, just whether the network&apos;s reach matches the city it serves.
          </p>
          <ComparisonBar
            label="Minority-owned"
            entrepreneurPct={resilience.entrepreneurs.total > 0 ? Math.round((resilience.entrepreneurs.minorityOwned / resilience.entrepreneurs.total) * 100) : 0}
            cityPct={resilience.lansingComparison.pctMinority}
            cityLabel="Lansing pop."
          />
          <ComparisonBar
            label="Woman-owned"
            entrepreneurPct={resilience.entrepreneurs.total > 0 ? Math.round((resilience.entrepreneurs.womanOwned / resilience.entrepreneurs.total) * 100) : 0}
            cityPct={resilience.lansingComparison.pctFemale}
            cityLabel="Lansing pop."
          />
          <p style={{ fontSize: "0.7rem", color: "var(--color-steel-muted)", marginTop: "0.75rem" }}>
            City breakdown: {resilience.lansingComparison.pctBlack}% Black, {resilience.lansingComparison.pctHispanic}% Hispanic/Latino, {resilience.lansingComparison.pctAsian}% Asian (non-Hispanic). Age/veteran/disability comparison not included — no reliable entrepreneur-level data for those yet.
          </p>
        </div>
      ) : (
        <PlaceholderPanel title="Entrepreneur Reach vs. City of Lansing" reason="resilience.foundation data or Census API unavailable." />
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

      {urbandale ? (
        <div className="card" style={{ padding: "1.5rem" }}>
          <p style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>Urbandale Farm — Co-op in Formation</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
            <StatBox value={urbandale.active_plots} label="Active plots" />
            <StatBox value={urbandale.active_plantings} label="Active plantings" />
            <StatBox value={urbandale.workers} label="Workers" />
            <StatBox value={Math.round(urbandale.total_harvest_lbs)} label="Lbs harvested" color="var(--color-teal-accent)" />
          </div>
          {urbandale.battery_pct !== null && (
            <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)" }}>
              Solar: {urbandale.battery_pct}% battery, {urbandale.solar_watts ?? 0}W generating
            </p>
          )}
        </div>
      ) : (
        <PlaceholderPanel title="Urbandale Farm — Co-op in Formation" reason="Not yet deployed publicly — Pi hardware isn't on-site at the farm yet. Will populate once urbandale.thefledge.com is reachable." />
      )}

      {resilience && resilience.governance.proposalsVoted > 0 ? (
        <div className="card" style={{ padding: "1.5rem" }}>
          <p style={{ fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.9rem" }}>Co-op Governance Participation</p>
          <p style={{ fontSize: "0.75rem", color: "var(--color-steel-muted)", marginBottom: "1rem" }}>
            Target: 80% of worker-owners participating in major governance votes per quarter. Only counts proposals that actually closed for a vote — no estimates.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <StatBox
              value={resilience.governance.avgParticipationPct !== null ? `${resilience.governance.avgParticipationPct}%` : "—"}
              label="Avg participation rate"
              color={resilience.governance.avgParticipationPct !== null && resilience.governance.avgParticipationPct < 60 ? "#e0654d" : "var(--color-teal-accent)"}
            />
            <StatBox value={resilience.governance.proposalsVoted} label="Proposals voted on" />
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)" }}>
            Across {resilience.governance.coopsWithVoteData} co-op{resilience.governance.coopsWithVoteData !== 1 ? "s" : ""} with verified vote data. Aggregated — not broken out by co-op.
          </p>
        </div>
      ) : (
        <PendingPanel
          title="Co-op Governance Participation"
          description="Target: 80% of worker-owners participating in major governance votes per quarter. Flag threshold: below 60% for two consecutive quarters."
          blocker="No co-ops have closed a proposal for a vote yet. This panel will not show estimates — only verified reports."
        />
      )}

      {tractData && tractData.length > 0 ? (
        <div className="card" style={{ padding: "1.5rem" }}>
          <p style={{ fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.9rem" }}>Geographic Reach — Equity Map</p>
          <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", marginBottom: "1rem", maxWidth: "720px" }}>
            Census tracts shaded by how many cooperative-network locations (businesses, co-ops, housing projects, entrepreneurs)
            fall within them — aggregate counts only, no individual addresses. Tracts outlined in red were graded
            &quot;D — Hazardous&quot; by the federal Home Owners&apos; Loan Corporation in the 1930s, the historic redlining
            that shaped where investment did and didn&apos;t flow in Lansing. If the darkest tracts and the red outlines
            don&apos;t overlap, that gap is the point of this panel.
          </p>
          <div style={{ height: "420px", borderRadius: "8px", overflow: "hidden" }}>
            <TractChoroplethMap features={tractData} />
          </div>
          <p style={{ fontSize: "0.68rem", color: "var(--color-steel-muted)", marginTop: "0.5rem" }}>
            HOLC grade data: Nelson, R. et al., <em>Mapping Inequality</em>, University of Richmond Digital Scholarship Lab,
            via GeoDaCenter (CC BY-NC-SA 4.0). Location counts from resilience.foundation.
          </p>
        </div>
      ) : (
        <PlaceholderPanel title="Geographic Reach — Equity Map" reason="resilience.foundation tract data unavailable." />
      )}

      {eventCategoryCounts && eventCategoryCounts.length > 0 ? (
        <div className="card" style={{ padding: "1.5rem" }}>
          <p style={{ fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.9rem" }}>Upcoming Co-op &amp; Governance Events</p>
          <p style={{ fontSize: "0.75rem", color: "var(--color-steel-muted)", marginBottom: "1rem" }}>
            All Fledge events in 2026 by category — {pastEventCount} happened, {futureEventCount} upcoming.
          </p>
          {eventCategoryCounts.map(({ category, count }) => (
            <div key={category} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
              <span style={{ width: "150px", fontSize: "0.78rem", color: "var(--color-steel-muted)", flexShrink: 0, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{category}</span>
              <div style={{ flex: 1, background: "var(--color-border)", borderRadius: "4px", height: "16px", overflow: "hidden" }}>
                <div style={{ width: `${Math.max(4, Math.round((count / maxEventCount) * 100))}%`, background: "var(--color-teal-accent)", height: "100%", borderRadius: "4px" }} />
              </div>
              <span style={{ width: "24px", fontSize: "0.78rem", color: "var(--color-limestone)", flexShrink: 0 }}>{count}</span>
            </div>
          ))}
        </div>
      ) : (
        <PlaceholderPanel title="Upcoming Co-op & Governance Events" reason="thefledge.com events API unavailable, or no published events found for 2026." />
      )}

      <PendingPanel
        title="FLDG Token — Cooperative Economy"
        description="25 FLDG = 1 hour of cooperative work. Total FLDG in circulation, recent transactions, and trend over time — making the cooperative economy visible as hours exchanged within the network. Token: 0x5118aec3afcca3f1e21733ee9c88bb800afe6f7b (Polygon)."
        blocker="Confirming whether data is accessible via thefledge.com API or requires a direct Polygon query."
      />
    </div>
  );
}

// ─── Zone 2.5: Basic Needs (ALICE categories) ────────────────────────────────
// What the network actually provides, organized by the basic-need categories
// ALICE tracks (Food, Housing, Technology, Transportation, Healthcare,
// Childcare) — not new data sources, mostly the same numbers shown elsewhere
// on this dashboard, re-sliced by need instead of by program.

function NeedCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <p style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>{title}</p>
      {children}
    </div>
  );
}

function eventCountFor(fledgeEvents: FledgeEvents, category: string): number {
  return fledgeEvents?.filter((e) => e.category === category).length ?? 0;
}

function ZoneNeeds({ resilience, freestand, urbandale, fledgeEvents }: { resilience: ResilienceData; freestand: FreeStandData; urbandale: UrbandaleData; fledgeEvents: FledgeEvents }) {
  const foodEventCount = eventCountFor(fledgeEvents, "Food & Agriculture");
  const housingEventCount = eventCountFor(fledgeEvents, "Housing & Homelessness");
  const techEventCount = eventCountFor(fledgeEvents, "Technology Access");
  const transportEventCount = eventCountFor(fledgeEvents, "Transportation");
  const healthcareEventCount = eventCountFor(fledgeEvents, "Healthcare");
  const childcareEventCount = eventCountFor(fledgeEvents, "Child Care and Family Fun");
  const housing = resilience?.housing;
  const occupancyNote = housing && housing.shareholdersWithOccupancyData < housing.activeShareholders
    ? `based on ${housing.shareholdersWithOccupancyData} of ${housing.activeShareholders} households with occupancy reported — likely an undercount`
    : "across all active households";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
      <NeedCard title="🍎 Food">
        {freestand || urbandale ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
              {freestand && <StatBox value={freestand.interactions_total.toLocaleString()} label="Free Stand visits, all-time" color="var(--color-teal-accent)" />}
              {freestand && <StatBox value={freestand.interactions_week} label="This week" />}
              {foodEventCount > 0 && <StatBox value={foodEventCount} label="Food & Ag events, 2026" />}
            </div>
            {urbandale && (
              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.35rem" }}>
                  <span>Urbandale harvest, this season</span>
                  <span style={{ fontWeight: 600, color: "var(--color-limestone)" }}>
                    {urbandale.harvest_lbs_this_year} lbs
                    {urbandale.projected_harvest_lbs > 0 && ` of ~${Math.round(urbandale.projected_harvest_lbs)} projected`}
                  </span>
                </div>
                {urbandale.projected_harvest_lbs > 0 && (
                  <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{
                      width: `${Math.min(100, Math.round((urbandale.harvest_lbs_this_year / urbandale.projected_harvest_lbs) * 100))}%`,
                      height: "100%", background: "var(--color-teal-accent)", borderRadius: "4px", transition: "width 0.4s",
                    }} />
                  </div>
                )}
                <p style={{ fontSize: "0.68rem", color: "var(--color-steel-muted)", marginTop: "0.3rem" }}>
                  Projection is directional — based on active plantings only, and {urbandale.crops_missing_yield > 0
                    ? `${urbandale.crops_missing_yield} of the crops currently in the ground don't have a yield estimate yet, so it's an undercount.`
                    : "every active crop has a yield estimate set."}
                </p>
              </div>
            )}
            <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>
              Free Stand visit counts are a proxy for people served, not unique individuals.
            </p>
            <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)", marginTop: "0.4rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(244,241,232,0.08)" }}>
              Scale of need: ~{ALICE_SNAPSHOT.foodInsecureCount.toLocaleString()} people food insecure in Ingham County ({ALICE_SNAPSHOT.foodInsecurePct}%, {ALICE_SNAPSHOT.foodInsecureYear} — Feeding America).
            </p>
          </>
        ) : (
          <p style={{ color: "var(--color-steel-muted)", fontSize: "0.85rem" }}>FreeStand and Urbandale data unavailable.</p>
        )}
      </NeedCard>

      <NeedCard title="🏠 Housing">
        {housing ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <StatBox value={housing.projects} label="Co-op housing projects" />
              <StatBox value={housing.activeShareholders} label="Active households" />
              <StatBox value={housing.totalOccupants} label="People housed" color="var(--color-teal-accent)" />
              {housingEventCount > 0 && <StatBox value={housingEventCount} label="Events at The Fledge, 2026" />}
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>
              People-housed count is {occupancyNote}.
            </p>
          </>
        ) : (
          <p style={{ color: "var(--color-steel-muted)", fontSize: "0.85rem" }}>resilience.foundation data unavailable.</p>
        )}
      </NeedCard>

      <NeedCard title="💻 Technology">
        <p style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
          FLDG Token — 25 FLDG = 1 hour of cooperative work. Token: 0x5118aec3afcca3f1e21733ee9c88bb800afe6f7b (Polygon).
        </p>
        {techEventCount > 0 && (
          <p style={{ fontSize: "0.78rem", marginBottom: "0.5rem" }}>
            <strong>{techEventCount}</strong> Technology Access event{techEventCount === 1 ? "" : "s"} at The Fledge, 2026.
          </p>
        )}
        <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>
          Descriptive only for now — no people-served metric yet. Circulation/transaction data blocked on confirming Polygon query access (see Cooperative Network tab).
        </p>
      </NeedCard>

      <NeedCard title="🚌 Transportation">
        <p style={{ fontSize: "1.6rem", fontWeight: 700, color: transportEventCount > 0 ? "var(--color-limestone)" : "var(--color-steel-muted)" }}>{transportEventCount}</p>
        <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", marginBottom: "0.5rem" }}>Transportation events at The Fledge, 2026</p>
        <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>No tracked program or data source for this category beyond events.</p>
      </NeedCard>

      <NeedCard title="🏥 Healthcare">
        <p style={{ fontSize: "1.6rem", fontWeight: 700, color: healthcareEventCount > 0 ? "var(--color-limestone)" : "var(--color-steel-muted)" }}>{healthcareEventCount}</p>
        <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", marginBottom: "0.5rem" }}>Healthcare events at The Fledge, 2026</p>
        <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>No tracked program or data source for this category beyond events — Fitness & Wellness events exist separately and aren't the same thing as healthcare access.</p>
      </NeedCard>

      <NeedCard title="🧸 Child Care">
        <p style={{ fontSize: "1.6rem", fontWeight: 700, color: childcareEventCount > 0 ? "var(--color-limestone)" : "var(--color-steel-muted)" }}>{childcareEventCount}</p>
        <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", marginBottom: "0.5rem" }}>Child Care and Family Fun events at The Fledge, 2026</p>
        <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>No tracked program or data source for this category beyond events.</p>
      </NeedCard>
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

function StatusBadge({ status }: { status: "live" | "tracking" | "pending" | "clarification" }) {
  const cfg = {
    live:          { label: "Live",          color: "var(--color-teal-accent)",   bg: "rgba(74,155,142,0.12)"  },
    tracking:      { label: "Tracking",      color: "var(--color-dome-gold)",     bg: "rgba(232,200,74,0.1)"   },
    pending:       { label: "Pending",       color: "rgba(154,176,200,0.5)",      bg: "rgba(154,176,200,0.06)" },
    clarification: { label: "Note",          color: "#a78bfa",                    bg: "rgba(167,139,250,0.08)" },
  }[status];
  return (
    <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: cfg.color, background: cfg.bg, borderRadius: "4px", padding: "0.15rem 0.4rem", flexShrink: 0 }}>
      {cfg.label}
    </span>
  );
}

function ZonePolicy() {
  return (
    <>
      <p style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)", marginBottom: "1.5rem", maxWidth: "680px" }}>
        What the network is tracking, building, and clarifying — across city council, boards, and the public record.
      </p>

      {/* What's built */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-teal-accent)", marginBottom: "0.75rem" }}>Recently built</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { label: "Board Composition Database",            note: "44 boards, all members, expired terms flagged — boards where members are serving 5–13 years past expiration are surfaced.", link: "/boards",                       linkLabel: "View /boards →" },
            { label: "Neighborhood Organizations Directory",  note: "59 registered neighborhood organizations — the existing infrastructure for neighborhood councils with real authority.",  link: "/neighborhoods",                linkLabel: "View /neighborhoods →" },
            { label: "Board accountability case studies",     note: "7 sourced case studies: LHC, Land Bank, Flock, Chamber PAC, Board of Ethics, BWL, Development & Planning.",           link: "/governance/issues",            linkLabel: "View all →" },
            { label: "Chamber accountability + alternative",  note: "8 documented findings. 7 complaint filings. Cooperative alternative plan with legal structure and governance provisions.", link: "/governance/alternatives/chamber", linkLabel: "View plan →" },
          ].map(({ label, note, link, linkLabel }) => (
            <div key={label} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "rgba(74,155,142,0.04)", border: "1px solid rgba(74,155,142,0.15)", borderRadius: "8px", padding: "0.875rem 1rem" }}>
              <StatusBadge status="live" />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", margin: 0 }}>{label}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-steel-muted)", margin: "0.15rem 0 0" }}>{note}</p>
              </div>
              <Link href={link} style={{ fontSize: "0.72rem", color: "var(--color-dome-gold)", flexShrink: 0, whiteSpace: "nowrap" }}>{linkLabel}</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Ordinance track */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Ordinance track — no ballot needed</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            {
              status: "pending" as const,
              label: "Neighborhood advisory boards with formal standing",
              note: "Binding say, not advisory only. Los Angeles has 99 neighborhood councils. Lansing's 59 registered neighborhood orgs are the infrastructure — they need formal authority.",
              link: "/neighborhoods", linkLabel: "See the orgs →",
            },
            {
              status: "clarification" as const,
              label: "Participatory budgeting pilot",
              note: "Lansing's 'Participatory Budget Nights' are public hearings with better facilitation — not real PB. No binding vote, no delegates, no dollar allocation. Grand Rapids did real PB by council ordinance in 2022: $2M, no charter change. Kelsea Hector proposed Lansing's 'first PB program' in the 2025 race — which tells you what the current format is.",
              link: "/governance/policy/participatory-budgeting", linkLabel: "Full analysis →",
            },
            {
              status: "pending" as const,
              label: "Proactive disclosure / open records default",
              note: "Publish meeting communications before being FOIA'd. Makes manufactured consent visible in real time.",
            },
            {
              status: "pending" as const,
              label: "Conflict-of-interest recusal required on record for appointed boards",
              note: "Currently at board members' discretion. Board of Ethics case study shows what happens without enforcement.",
              link: "/governance/issues/board-of-ethics", linkLabel: "Case study →",
            },
          ].map(({ status, label, note, link, linkLabel }) => (
            <div key={label} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "rgba(255,255,255,0.02)", border: `1px solid ${status === "clarification" ? "rgba(167,139,250,0.2)" : "rgba(244,241,232,0.08)"}`, borderRadius: "8px", padding: "0.875rem 1rem" }}>
              <StatusBadge status={status} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", margin: 0 }}>{label}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-steel-muted)", margin: "0.15rem 0 0" }}>{note}</p>
              </div>
              {link && linkLabel && (
                <Link href={link} style={{ fontSize: "0.72rem", color: "var(--color-dome-gold)", flexShrink: 0, whiteSpace: "nowrap" }}>{linkLabel}</Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Charter track */}
      <div>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Charter track — requires public vote</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            {
              status: "tracking" as const,
              label: "BWL board reform — elected seats, enforced terms",
              note: "9 BWL employees donated $6K to LRC-PAC in 48 hours; CFO on Chamber board testified for Deep Green. All seats mayoral-appointed. Charter reform is the fix.",
              link: "/governance/issues/bwl", linkLabel: "Case study →",
            },
            {
              status: "pending" as const,
              label: "Independent auditor — mandate and funding",
              note: "Partially addressed in 2025 charter. Scope and independence need strengthening.",
            },
            {
              status: "pending" as const,
              label: "Stakeholder and expert seats on development and housing boards",
              note: "People affected by decisions, and people who understand them, seated as decision-makers — not just advisors the mayor can ignore.",
              link: "/governance/issues/development-planning", linkLabel: "Case study →",
            },
          ].map(({ status, label, note, link, linkLabel }) => (
            <div key={label} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,241,232,0.08)", borderRadius: "8px", padding: "0.875rem 1rem" }}>
              <StatusBadge status={status} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", margin: 0 }}>{label}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-steel-muted)", margin: "0.15rem 0 0" }}>{note}</p>
              </div>
              {link && linkLabel && (
                <Link href={link} style={{ fontSize: "0.72rem", color: "var(--color-dome-gold)", flexShrink: 0, whiteSpace: "nowrap" }}>{linkLabel}</Link>
              )}
            </div>
          ))}
        </div>
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

export default function DashboardTabs({ isAdmin, gap, resilience, freestand, fledgeEvents, urbandale, tractData, rhinoTracker, advocacyEntries, ownershipChecks }: Props) {
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
        {activeTab === "network"    && <ZoneNetwork resilience={resilience} freestand={freestand} fledgeEvents={fledgeEvents} urbandale={urbandale} tractData={tractData} />}
        {activeTab === "needs"      && <ZoneNeeds resilience={resilience} freestand={freestand} urbandale={urbandale} fledgeEvents={fledgeEvents} />}
        {activeTab === "ownership"  && <ZoneOwnership isAdmin={isAdmin} ownershipChecks={ownershipChecks} />}
        {activeTab === "advocacy"    && <ZoneAdvocacy entries={advocacyEntries} />}
        {activeTab === "policy"      && <ZonePolicy />}
        {activeTab === "governance"  && <ZoneGovernance />}
      </div>
    </>
  );
}
