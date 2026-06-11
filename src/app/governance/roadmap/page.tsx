import Link from "next/link";

// ─── Diagram 3: Roadmap Phases ────────────────────────────────────────────────

function RoadmapDiagram() {
  const phases = [
    { num: 0, label: "Prove it",             time: "Now",         unlock: "No one's permission", active: true  },
    { num: 1, label: "Open the doors",       time: "Years 1–3",   unlock: "Council majority",    active: false },
    { num: 2, label: "Seat real authority",  time: "Years 2–5",   unlock: "Sustained majority + organizing", active: false },
    { num: 3, label: "Lock it in",           time: "Years 4–8+",  unlock: "Ballot",              active: false },
  ];

  return (
    <div style={{ margin: "1.5rem 0", overflowX: "auto" }}>
      <div style={{ display: "flex", gap: "0", minWidth: "560px", alignItems: "stretch" }}>
        {phases.map((phase, i) => (
          <div key={phase.num} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{
              flex: 1,
              border: `1px solid ${phase.active ? "rgba(74,155,142,0.5)" : "rgba(244,241,232,0.1)"}`,
              borderRadius: "8px",
              padding: "1rem",
              background: phase.active ? "rgba(74,155,142,0.06)" : "rgba(255,255,255,0.02)",
              minHeight: "110px",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}>
              <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", color: phase.active ? "var(--color-teal-accent)" : "var(--color-text-muted)", margin: 0, textTransform: "uppercase" }}>
                Phase {phase.num}
              </p>
              <p style={{ fontWeight: 700, color: "var(--color-limestone)", fontSize: "0.9rem", margin: 0 }}>{phase.label}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--color-steel-muted)", margin: 0 }}>{phase.time}</p>
              <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "auto", marginBottom: 0, paddingTop: "0.4rem" }}>
                Unlock: {phase.unlock}
              </p>
            </div>
            {i < phases.length - 1 && (
              <div style={{ padding: "0 0.4rem", color: "rgba(244,241,232,0.2)", fontSize: "1rem", flexShrink: 0 }}>→</div>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.6rem", fontStyle: "italic" }}>
        Phases 1 and 2 overlap — ordinance wins and deeper organizing run in parallel.
      </p>
    </div>
  );
}

// ─── Phase card ───────────────────────────────────────────────────────────────

function PhaseCard({ num, label, time, children }: { num: number; label: string; time: string; children: React.ReactNode }) {
  const isActive = num === 0;
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: isActive ? "var(--color-teal-accent)" : "var(--color-steel-muted)" }}>
          Phase {num}
        </span>
        <h3 style={{ margin: 0, fontSize: "1.15rem" }}>{label}</h3>
        <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{time}</span>
      </div>
      <div style={{ borderLeft: `2px solid ${isActive ? "rgba(74,155,142,0.4)" : "rgba(244,241,232,0.1)"}`, paddingLeft: "1.25rem", maxWidth: "640px" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      {/* Breadcrumb */}
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Roadmap
      </p>

      {/* Intro */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">How we get there</span>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "1rem" }}>A phased roadmap for polycentric Lansing</h1>
        <p style={{ maxWidth: "640px" }}>
          This isn&apos;t a wish list. It&apos;s a sequenced plan, built around what Michigan law actually allows, what Lansing&apos;s charter currently permits, and what political conditions are needed for each step. Near-term and durable first. Grand and fragile last.
        </p>
        <RoadmapDiagram />
      </section>

      <hr className="divider" />

      {/* Michigan law */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Legal framework</span>
        <h2 style={{ marginBottom: "1rem" }}>The dividing line that determines everything</h2>
        <div style={{ maxWidth: "640px" }}>
          <p>Under the Home Rule City Act (MCL 117), two things are true at once:</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "1.25rem 0" }}>
            <div className="card--accent" style={{ padding: "1rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", marginBottom: "0.4rem", fontSize: "0.85rem" }}>Charter changes</p>
              <p style={{ fontSize: "0.8rem", margin: 0 }}>Structure of government — board compositions, council representation, the form of government itself. Requires a public vote.</p>
            </div>
            <div className="card" style={{ padding: "1rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", marginBottom: "0.4rem", fontSize: "0.85rem" }}>Ordinance wins</p>
              <p style={{ fontSize: "0.8rem", margin: 0 }}>Advisory bodies, participatory budgeting, disclosure rules, ethics requirements. Ordinary council majority. No ballot needed.</p>
            </div>
          </div>
          <p>
            Grand Rapids ran a $2 million participatory budgeting program as an ordinary appropriation — one council majority, no charter vote. This dividing line is the most useful fact for sequencing: it tells you what needs only a council majority (a lot) and what needs the ballot (the structural core).
          </p>
          <p style={{ color: "var(--color-steel-muted)", fontSize: "0.875rem" }}>
            One Lansing-specific note: the 2025 charter rewrite reaffirmed the strong-mayor structure with roughly 66% of the vote, effective January 2026. The deep structural changes wait on political conditions the city doesn&apos;t yet have. That&apos;s not a reason to stop — it&apos;s a reason to start with what doesn&apos;t require it.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* Phase 0 */}
      <PhaseCard num={0} label="Prove it" time="Starting now — no one's permission needed">
        <p>Launch and stabilize the first cooperatives in the network. Run them by the handbook — one member, one vote, open books, the Ownership Check on a fixed schedule. Be the visible proof that people can govern an enterprise themselves, distribute power, and stay durable.</p>
        <p>This phase needs no ordinance, no election, no charter. It runs entirely inside the cooperative network.</p>
        <p>The city-scale argument is only as strong as the local demonstrations of it. Every working cooperative that runs transparently is evidence. Every failure is a data point about what the structural design needs to prevent.</p>
        <div className="card" style={{ padding: "0.875rem 1.25rem", marginTop: "0.75rem" }}>
          <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--color-teal-accent)", marginBottom: "0.2rem" }}>Key action</p>
          <p style={{ fontSize: "0.85rem", margin: 0 }}>Launch the next cooperative. Run it in the open.</p>
        </div>
      </PhaseCard>

      {/* Phase 1 */}
      <PhaseCard num={1} label="Open the doors" time="Roughly years 1–3 — needs a council majority">
        <p>Win participatory budgeting and real advisory bodies by council ordinance. Pass proactive disclosure rules — publish before being FOIA&apos;d. Create a taxpayer navigator (someone who helps residents understand what the city is doing with public money).</p>
        <p>
          <strong>Electoral path:</strong> This phase requires electing council members who will distribute their own power. Ward-based candidates, small-donor funded, with a clear public record on these issues. It&apos;s not optional — it&apos;s how a durable majority for reform gets built.
        </p>
        <p>
          <strong>Footholds already in the 2025 charter:</strong> Three openings worth naming — an independent auditor, a public tax-and-debt dashboard, and two required public hearings before any Board of Water &amp; Light rate increase. Starting points.
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)" }}>
          The predictions dashboard tracks council votes in real time. Phase 1 progress is visible there.
        </p>
      </PhaseCard>

      {/* Phase 2 */}
      <PhaseCard num={2} label="Seat real authority" time="Roughly years 2–5">
        <p>Neighborhood councils with binding authority, not just advisory status. Expert and stakeholder boards with real decision-making power. Money-out rules — small-donor public financing, disclosure of independent expenditures and their true funders, foreign-influenced-corporation spending restrictions (the route Seattle and San Jose used).</p>
        <p>A citizens&apos; assembly pilot for a specific high-stakes decision.</p>
        <p>
          <strong>Why sortition:</strong> A seat assigned by lot cannot be campaigned for or bought. For questions where concentrated money has the most distorting effect — development subsidies, utility rate decisions, contracts — removing the lever is more durable than trying to regulate it.
        </p>
        <div style={{ marginTop: "0.75rem" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-limestone)", marginBottom: "0.5rem" }}>The guardrails — built in, not bolted on:</p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {[
              "Capture → balanced seats, recusal on the record, enforced terms, sortition",
              "Low turnout/skew → fund by need, pay participants, vote on the high-turnout cycle",
              "Walling-off → keep a higher tier that redistributes",
              "Money → dilute it (small-donor financing) and expose it (disclosure)",
            ].map((item) => (
              <li key={item} style={{ fontSize: "0.8rem", color: "var(--color-steel-muted)" }}>{item}</li>
            ))}
          </ul>
        </div>
      </PhaseCard>

      {/* Phase 3 */}
      <PhaseCard num={3} label="Lock it in" time="Roughly years 4–8+ — needs the ballot">
        <p>Charter changes so the structure survives a change of administration. Ward representation reform. Board composition changes. The deeper structural reforms that the 2025 rewrite chose not to make — won democratically, through a new public vote when the political conditions are ready.</p>
        <p>
          <strong>Why this is last:</strong> Each phase is reversible until the next one locks it in. Ordinance wins can be repealed by a future council. Charter changes survive that. Phase 3 is what makes the gains permanent.
        </p>
        <p style={{ color: "var(--color-steel-muted)", fontSize: "0.875rem" }}>
          The 2025 charter rewrite shows the current political appetite. A 66% vote to reaffirm the strong-mayor structure is a sober signal. Phase 3 waits on a different political moment — one that Phases 0–2 are designed to build.
        </p>
      </PhaseCard>

      <hr className="divider" />

      {/* Milestones */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Accountability</span>
        <h2 style={{ marginBottom: "1rem" }}>How you know it&apos;s working</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(244,241,232,0.1)" }}>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", whiteSpace: "nowrap" }}>Phase</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)" }}>Milestone</th>
              </tr>
            </thead>
            <tbody>
              {[
                { phase: 0, item: "First cooperative operating 12+ months, open books, no demutualization" },
                { phase: 0, item: "Federation tier providing shared coaching, legal templates, pooled resources" },
                { phase: 1, item: "Participatory budgeting ordinance passed" },
                { phase: 1, item: "At least one proactive disclosure ordinance in effect" },
                { phase: 1, item: "Two or more council members elected on small-donor, reform-aligned campaigns" },
                { phase: 2, item: "Neighborhood council with binding authority (not advisory only)" },
                { phase: 2, item: "Citizens' assembly pilot completed and publicly reported" },
                { phase: 2, item: "Money-out disclosure ordinance in effect" },
                { phase: 3, item: "Charter proposal passed by three-fifths council vote or voter petition" },
                { phase: 3, item: "Charter reform ratified at the ballot" },
              ].map(({ phase, item }) => (
                <tr key={item} style={{ borderBottom: "1px solid rgba(244,241,232,0.05)" }}>
                  <td style={{ padding: "0.5rem 0.75rem", color: phase === 0 ? "var(--color-teal-accent)" : "var(--color-steel-muted)", fontWeight: 600, fontSize: "0.8rem", whiteSpace: "nowrap" }}>Phase {phase}</td>
                  <td style={{ padding: "0.5rem 0.75rem", color: "var(--color-text-secondary)" }}>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,241,232,0.08)", borderRadius: "10px", padding: "1.5rem", maxWidth: "640px" }}>
        <p style={{ color: "var(--color-steel-muted)", marginBottom: "1rem" }}>
          The predictions dashboard tracks city council votes in real time. When a vote touches any of these milestones, it shows up there.
        </p>
        <Link href="/governance/dashboard" className="btn btn--secondary btn--sm">Go to the dashboard →</Link>
      </div>

    </div>
  );
}
