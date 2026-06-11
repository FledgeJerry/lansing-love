"use client";

import { useState } from "react";
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

type OwnershipCheckItem = {
  id: string;
  sortOrder: number;
  question: string;
  answer: string;
  reviewedAt: string | null;
  updatedBy: string;
};

interface Props {
  isAdmin: boolean;
  gap: LegitimacyData;
  resilience: ResilienceData;
  freestand: FreeStandData;
  ownershipChecks: OwnershipCheckItem[];
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "legitimacy", label: "Legitimacy Gap" },
  { id: "network",    label: "Cooperative Network" },
  { id: "ownership",  label: "Ownership Check" },
  { id: "advocacy",   label: "Civic Advocacy" },
  { id: "policy",     label: "Policy Monitor" },
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

function ZoneLegitimacy({ gap }: { gap: LegitimacyData }) {
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
          For each council member: what % of their votes matched what residents wanted? January 2026 council — Kost (W1), Nevarez Martinez (W2), Hussain (W3), Spadafore (W4), Carter (AL), Pehlivanoglu (AL), Garza (AL), Clara Martinez (AL). Hussain and Spadafore are both running for mayor while still voting on council — their scores are live and consequential. Lansing is the first Michigan city council with a Latino majority.
        </p>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(244,241,232,0.15)", borderRadius: "6px", padding: "0.75rem", fontSize: "0.78rem", color: "rgba(154,176,200,0.7)" }}>
          Building next — requires linking each resolved prediction to the council member(s) who voted on it. Roster confirmed; data model next.
        </div>
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

function ZoneAdvocacy() {
  return (
    <>
      <p style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)", marginBottom: "1.25rem", maxWidth: "680px" }}>
        The &ldquo;transform, not seize&rdquo; track — what the network is doing to reform city government from outside. A human-maintained log, updated weekly, showing the work is real and accountable.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Council members engaged", desc: "Active relationships on polycentric reform agenda" },
          { label: "Ordinances tracked", desc: "Neighborhood councils, PB pilot, open-records default, recusal requirement" },
          { label: "Testimony appearances", desc: "Public advocacy at council, BWL, and board meetings this year" },
          { label: "Anchor institution conversations", desc: "Procurement relationships in progress" },
        ].map(({ label, desc }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(244,241,232,0.15)", borderRadius: "10px", padding: "1rem" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-steel-muted)", lineHeight: 1 }}>—</p>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.3rem" }}>{label}</p>
            <p style={{ fontSize: "0.7rem", color: "rgba(154,176,200,0.6)", marginTop: "0.2rem" }}>{desc}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(244,241,232,0.15)", borderRadius: "10px", padding: "1.25rem" }}>
        <p style={{ fontWeight: 600, color: "var(--color-steel-muted)", marginBottom: "0.35rem", fontSize: "0.875rem" }}>Admin entry interface coming soon</p>
        <p style={{ fontSize: "0.8rem", color: "rgba(154,176,200,0.6)" }}>
          A simple log — council members engaged, ordinances tracked, testimony given, endorsements made. Updated weekly by staff. No blockers; data model is next.
        </p>
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
              "One-time build: 20–40 hrs research; ongoing maintenance needed",
              "MSU urban planning or public policy student partner recommended — not yet confirmed",
            ],
          },
        ].map(({ title, items }) => (
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
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function DashboardTabs({ isAdmin, gap, resilience, freestand, ownershipChecks }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("legitimacy");

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
        {activeTab === "legitimacy" && <ZoneLegitimacy gap={gap} />}
        {activeTab === "network"    && <ZoneNetwork resilience={resilience} freestand={freestand} />}
        {activeTab === "ownership"  && <ZoneOwnership isAdmin={isAdmin} ownershipChecks={ownershipChecks} />}
        {activeTab === "advocacy"   && <ZoneAdvocacy />}
        {activeTab === "policy"     && <ZonePolicy />}
      </div>
    </>
  );
}
