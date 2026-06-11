import Link from "next/link";

export default function GovernanceDashboardPage() {
  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      {/* Breadcrumb */}
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Dashboard
      </p>

      {/* Intro */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">The predictions tracker</span>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "1rem" }}>
          The predictions dashboard is a governance instrument.
        </h1>
        <p style={{ maxWidth: "640px" }}>
          Most people think of it as a game — predict council votes, see who gets it right. That&apos;s part of it.
          But the design comes from a specific governance argument: that opacity is how concentrated power sustains itself,
          and that the first step toward distributing power is making what&apos;s happening visible.
        </p>
      </section>

      <hr className="divider" />

      {/* What it does */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">What it does</span>
        <h2 style={{ marginBottom: "1.5rem" }}>Three things the dashboard does</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
          {[
            {
              label: "Tracks what's actually decided",
              desc: 'Lansing City Council votes on dozens of items per meeting. Most of it happens in public, but “public” and “visible” are not the same thing. The dashboard converts agenda items into specific, falsifiable questions: will this pass? When it closes, the result is recorded.',
            },
            {
              label: "Reveals the gap between official and community",
              desc: 'Each prediction shows two numbers: what participants predicted, and what the community wants. When those diverge — when the community expects the council to act differently than participants think it will — that gap is information. It’s the difference between “what is happening” and “what residents want to happen.”',
            },
            {
              label: "Creates a legibility record",
              desc: "Over time, the predictions archive is a record of what the city decided and when. Not filtered through press releases. Not dependent on anyone's interpretation. A dated, public record of votes and outcomes.",
            },
          ].map(({ label, desc }) => (
            <div key={label} className="card--accent" style={{ padding: "1.25rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", marginBottom: "0.5rem", fontSize: "0.9rem" }}>{label}</p>
              <p style={{ fontSize: "0.8rem", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Governance argument */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">Governance argument</span>
        <h2 style={{ marginBottom: "1rem" }}>Why visibility matters</h2>
        <div style={{ maxWidth: "640px" }}>
          <p>
            The &ldquo;Lansing Issues&rdquo; companion to this project documents ten specific governance failures — dark money, PAC capture, decisions made in the dark, manufactured consent at public hearings. Every one of them depends on the same condition: that most residents can&apos;t see what&apos;s happening clearly enough to respond to it.
          </p>
          <p>
            The polycentric governance argument is that decisions should sit close to the people who live with them. But that only works if people can see what decisions are being made.
          </p>
          <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "3px solid var(--color-teal-accent)" }}>
            <p style={{ margin: 0, color: "var(--color-limestone)", fontStyle: "italic" }}>
              The dashboard is a legibility layer. It doesn&apos;t fix governance. It makes governance visible — which is the precondition for fixing it.
            </p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* What predictions tell us */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">Signal</span>
        <h2 style={{ marginBottom: "1rem" }}>Predicting a vote tells you something about power</h2>
        <div style={{ maxWidth: "640px" }}>
          <p>
            If a community consistently predicts that a vote will go one way — development approved, disclosure tabled, appointment confirmed — regardless of what residents say they want, that&apos;s a signal about who the council is actually responsive to.
          </p>
          <p>
            That signal is worth measuring. It&apos;s one of the four governance measures used throughout this project: <strong>responsiveness</strong> — are decisions made close to the people who live with them?
          </p>
          <p>
            The predictions dashboard is one way to answer that question with data instead of assertion. The council member scorecard on the{" "}
            <Link href="/dashboard">governance dashboard</Link> tracks how each member&apos;s votes compare to what residents wanted.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* Phase 1 connection */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">Roadmap connection</span>
        <h2 style={{ marginBottom: "1rem" }}>Phase 1 milestones are visible here</h2>
        <div style={{ maxWidth: "640px" }}>
          <p>
            Several of the Phase 1 ordinance wins — participatory budgeting, disclosure rules, taxpayer navigator — will come before the council as votes. When they do, they&apos;ll appear in the dashboard like any other agenda item.
          </p>
          <p>
            That means the dashboard is also a progress tracker for the roadmap. Not a comprehensive one — Phase 0 work happens inside the cooperative network, not at city council. But for anything that requires a council vote, this is where you&apos;ll see it.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "3rem" }}>
        <Link href="/register" className="btn btn--primary btn--sm">Join to predict →</Link>
        <Link href="/governance" className="btn btn--ghost btn--sm">Read the governance argument →</Link>
        <Link href="/governance/roadmap" className="btn btn--ghost btn--sm">See the roadmap →</Link>
      </div>

      {/* Footer note */}
      <div style={{ borderTop: "1px solid rgba(244,241,232,0.08)", paddingTop: "1.5rem" }}>
        <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", maxWidth: "580px", lineHeight: 1.65 }}>
          The research behind this section is a package of sourced documents produced in 2026: a comparative white paper on cooperative models, an economic impact projection, a failure atlas of cooperatives that didn&apos;t hold, and the governance companion documents referenced throughout. Available on request.
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
          <a href="https://thefledge.com" target="_blank" rel="noopener noreferrer">The Fledge</a>
          {" · "}1300 Eureka Street, Lansing
          {" · "}
          <a href="https://thefledge.com" target="_blank" rel="noopener noreferrer">thefledge.com</a>
        </p>
      </div>

    </div>
  );
}
