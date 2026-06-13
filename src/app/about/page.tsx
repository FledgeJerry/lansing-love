import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "lansing.love is a cooperative governance dashboard and civic accountability platform built by The Fledge. Tracking Lansing's legitimacy gap, cooperative network, and the case for polycentric governance.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: "680px", paddingBottom: "4rem" }}>

      <span className="eyebrow">About</span>
      <h1 style={{ marginBottom: "0.5rem" }}>lansing.love</h1>
      <p style={{ color: "var(--color-steel-muted)", fontSize: "1rem", marginBottom: "3rem" }}>
        A cooperative governance dashboard and civic accountability platform for Lansing, Michigan.
      </p>

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">What this is</span>
        <h2 style={{ marginBottom: "1rem" }}>Not just a predictions game</h2>
        <p>
          lansing.love exists because concentrated power is Lansing&apos;s root problem — and making that power visible is the first step toward distributing it.
        </p>
        <p>
          The site tracks three things: the <strong>legitimacy gap</strong> between what residents want and what city government does, the <strong>cooperative network</strong> building an economic alternative, and the <strong>civic advocacy work</strong> to reform the structures that produce the gap.
        </p>
        <p>
          The predictions platform is one measurement tool — a way to quantify how often Lansing&apos;s government acts against what its residents want, in categories, over time, per council member.
        </p>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">The work</span>
        <h2 style={{ marginBottom: "1rem" }}>Three tracks</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            {
              label: "Governance dashboard",
              href: "/",
              desc: "Legitimacy gap score, cooperative network stats from resilience.foundation, FreeStand community data, civic advocacy tracker, and the Ownership Check — four questions answered quarterly in public.",
            },
            {
              label: "Board & Commission Accountability",
              href: "/governance/issues",
              desc: "Documented case studies of governance failures across Lansing's appointed boards — Housing Commission, Land Bank, Chamber PAC, BWL, Planning, Board of Ethics, Flock surveillance. Sourced from Rhinoceros Media public records reporting.",
            },
            {
              label: "Civic Predictions",
              href: "/predictions",
              desc: "Community members predict Lansing City Council votes. Sourced and resolved by Rhino News. Top predictors recognized by locally owned Lansing businesses.",
            },
          ].map(({ label, href, desc }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div className="card--accent" style={{ padding: "1.25rem", cursor: "pointer" }}>
                <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", marginBottom: "0.35rem" }}>{label} →</p>
                <p style={{ fontSize: "0.875rem", margin: 0 }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Who&apos;s behind it</span>
        <h2 style={{ marginBottom: "1rem" }}>Built by The Fledge, sourced by Rhino News</h2>
        <p>
          <a href="https://thefledge.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-dome-gold)" }}>The Fledge</a>
          {" "}is Lansing&apos;s working-class makerspace and cooperative incubator, at 1300 Eureka Street. lansing.love is one part of a larger project to build an economic and civic alternative to concentrated power in Lansing — the other parts live at{" "}
          <a href="https://resilience.foundation" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-dome-gold)" }}>resilience.foundation</a>
          {" "}and{" "}
          <a href="https://gaia.solutions" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-dome-gold)" }}>gaia.solutions</a>.
        </p>
        <p>
          <a href="https://rhinocerosmedia.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-dome-gold)" }}>Rhinoceros Media</a>
          {" "}is Lansing&apos;s independent journalism co-op. Rhino sources the predictions, resolves them against the public record, and produces the accountability reporting that feeds the case study section. This is a co-op partnership, not a vendor relationship.
        </p>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Infrastructure</span>
        <h2 style={{ marginBottom: "1rem" }}>Runs on a Raspberry Pi</h2>
        <p>
          This entire site — along with thefledge.com, resilience.foundation, and the other Fledge network sites — is hosted on a single Raspberry Pi inside The Fledge. No cloud provider. No data center. About 5 watts, roughly the same as an LED nightlight.
        </p>
        <div className="card" style={{ padding: "0.875rem 1.25rem", marginTop: "1rem" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Hosted on a Raspberry Pi at The Fledge — 1300 Eureka St, Lansing, MI 48912
          </span>
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Legal</span>
        <h2 style={{ marginBottom: "1rem" }}>Disclaimer</h2>
        <div className="alert alert--info" style={{ lineHeight: 1.7 }}>
          <p style={{ color: "inherit" }}>
            <strong style={{ color: "inherit" }}>This is not a betting site.</strong> No real money is wagered, won, or lost. lansing.love is a free civic education and engagement service.
          </p>
          <p style={{ color: "inherit", marginBottom: 0 }}>
            Predictions carry no monetary value and create no legal or financial obligation of any kind. Leaderboard standings and any rewards are offered as community recognition by participating local businesses at their discretion. Question outcomes are determined by Rhino News based on publicly available information.
          </p>
        </div>
      </section>

      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}>
        Built with care in Lansing, Michigan ·{" "}
        <a href="https://thefledge.com" target="_blank" rel="noopener noreferrer">The Fledge</a>
        {" · "}
        <a href="https://rhinocerosmedia.org" target="_blank" rel="noopener noreferrer">Rhino News</a>
        {" · "}
        <a href="https://gaia.solutions" target="_blank" rel="noopener noreferrer">Gaia Solutions</a>
      </p>
    </div>
  );
}
