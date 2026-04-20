export default function AboutPage() {
  return (
    <div style={{ maxWidth: "680px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>About lansing.love</h1>
      <p style={{ marginBottom: "3rem" }}>A civic prediction project for the Lansing community.</p>

      {/* Mission */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Why this exists</span>
        <h2 style={{ marginBottom: "1rem" }}>Civic engagement, made fun</h2>
        <p>
          Lansing has a lot going on — city council votes, zoning decisions, budget battles, local
          elections — and most of it happens without most residents ever knowing. This site exists to
          change that. By turning civic events into predictions, we make local government more
          approachable, more engaging, and more fun to follow.
        </p>
        <p>Our goal: get more Lansing residents paying attention to what their city is doing, and reward the ones who do.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
          <div className="card--accent">
            <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", marginBottom: "0.25rem" }}>City Council</p>
            <p style={{ fontSize: "0.875rem", margin: 0 }}>
              Follow what&apos;s actually on the agenda and predict how votes will land.
            </p>
          </div>
          <div className="card--accent">
            <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", marginBottom: "0.25rem" }}>Rhino News</p>
            <p style={{ fontSize: "0.875rem", margin: 0 }}>
              Questions are sourced and resolved by Lansing&apos;s independent journalism co-op.
            </p>
          </div>
          <div className="card--accent">
            <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", marginBottom: "0.25rem" }}>Local Rewards</p>
            <p style={{ fontSize: "0.875rem", margin: 0 }}>
              Top predictors are recognized and rewarded by locally owned Lansing businesses.
            </p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Hosted on Pi */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Infrastructure</span>
        <h2 style={{ marginBottom: "1rem" }}>Runs on a Raspberry Pi</h2>
        <p>
          This entire site is hosted on a single Raspberry Pi sitting inside{" "}
          <a href="https://thefledge.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-dome-gold)" }}>
            The Fledge
          </a>
          , Lansing&apos;s working-class makerspace and incubator. No cloud provider. No data center.
          No server farm humming somewhere in Virginia consuming megawatts of power.
        </p>
        <p>
          A Raspberry Pi uses about 5 watts — roughly the same as an LED nightlight. We think
          that&apos;s a pretty good match for a site about a city the size of Lansing. Local
          infrastructure for local civic life.
        </p>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1.25rem", marginTop: "1rem" }}>
          <span style={{ fontSize: "1.75rem" }}>🍓</span>
          <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Hosted on a Raspberry Pi at The Fledge — 1300 Eureka St, Lansing, MI 48912
          </span>
        </div>
      </section>

      <hr className="divider" />

      {/* Disclaimer */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Legal</span>
        <h2 style={{ marginBottom: "1rem" }}>Disclaimer</h2>
        <div className="alert alert--info" style={{ lineHeight: 1.7 }}>
          <p style={{ color: "inherit" }}>
            <strong style={{ color: "inherit" }}>This is not a betting site.</strong> No real money
            is wagered, won, or lost on this platform. lansing.love is a free, entertainment and
            education service only.
          </p>
          <p style={{ color: "inherit" }}>
            Predictions carry no monetary value and create no legal or financial obligation of any
            kind. Leaderboard standings and any associated rewards are offered as community
            recognition by participating local businesses at their own discretion.
          </p>
          <p style={{ color: "inherit", marginBottom: 0 }}>
            All content is for informational and civic engagement purposes only. Question outcomes
            are determined by the Rhino journalism co-op based on publicly available information.
          </p>
        </div>
      </section>

      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}>
        Built with care in Lansing, Michigan ·{" "}
        <a href="https://thefledge.com" target="_blank" rel="noopener noreferrer">The Fledge</a>
        {" · "}
        <a href="https://rhinonews.org" target="_blank" rel="noopener noreferrer">Rhino News</a>
      </p>
    </div>
  );
}
