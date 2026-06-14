import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The New Charter",
  description: "Lansing voters passed a new city charter in November 2025. Here's what changed, what it opens up for polycentric governance, and what it didn't touch.",
  alternates: { canonical: "/governance/charter" },
  openGraph: { title: "The New Charter | lansing.love", description: "What the 2025 Lansing city charter changed, what it opens up, and what it left intact.", url: "https://lansing.love/governance/charter" },
};

export default function CharterPage() {
  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      {/* Breadcrumb */}
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Charter
      </p>

      {/* Hero */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">November 4, 2025 — effective January 1, 2026</span>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", lineHeight: 1.2, marginBottom: "1rem" }}>
          The new charter passed. Here&apos;s the honest ledger.
        </h1>
        <p style={{ maxWidth: "640px", fontSize: "0.95rem" }}>
          On November 4, 2025, Lansing voters adopted a new city charter — the first rewrite since 1978.
          Most changes took effect January 1, 2026. Ward redistricting and the full council expansion happen in 2029.
          This page is the straightforward accounting: what the charter does that&apos;s useful, what it doesn&apos;t do,
          and what that means for the work ahead.
        </p>
      </section>

      <hr className="divider" />

      {/* What it got right */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">What it got right</span>
        <h2 style={{ marginBottom: "0.5rem" }}>Real accountability tools, finally in the document</h2>
        <p style={{ maxWidth: "640px", color: "var(--color-steel-muted)", marginBottom: "1.75rem", fontSize: "0.875rem" }}>
          The charter didn&apos;t decentralize governance. But it did create infrastructure that didn&apos;t exist before —
          and that infrastructure is directly usable for the accountability work this site is built around.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            {
              section: "§7-601",
              label: "Independent Internal Auditor",
              desc: "The new charter establishes an independent auditor that neither the mayor nor the city council can direct or interfere with. Annual priority reviews are required. All audit reports are shared publicly. This is a new source of verified public data on city operations — and a lever that didn't exist before.",
              color: "var(--color-teal-accent)",
            },
            {
              section: "§4-102",
              label: "Mayor's Three-Year Strategic Plan",
              desc: "The mayor must publicly present a three-year plan with comprehensive data on the city's current situation, high-level goals, detailed strategies, and a system for regularly measuring and reviewing progress. That's a formal benchmark. When the plan claims progress on housing, food access, or economic stability, there's now a public document to hold it against.",
              color: "var(--color-teal-accent)",
            },
            {
              section: "§7-501",
              label: "Public Tax and Debt Dashboard",
              desc: "An online dashboard of city tax and debt obligations — public, required by charter. Another data layer for the lansing.love accountability stack.",
              color: "var(--color-teal-accent)",
            },
            {
              section: "§8-401",
              label: "Procurement Reform",
              desc: "Contracts can now be awarded on \"best value\" rather than lowest bidder only. That removes one of the structural barriers to cooperative enterprises competing for city contracts. A cooperative bidding on a cleaning or food service contract can now be evaluated on reliability, track record, and community benefit — not just price.",
              color: "var(--color-dome-gold)",
            },
          ].map(({ section, label, desc, color }) => (
            <div key={section} className="card" style={{ padding: "1.25rem", borderTop: `2px solid ${color}40` }}>
              <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color, marginBottom: "0.25rem" }}>{section}</p>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{label}</p>
              <p style={{ fontSize: "0.8rem", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "3px solid rgba(74,155,142,0.4)", maxWidth: "640px" }}>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            One more thing worth noting: the non-discrimination protections in §1-302 were significantly expanded.
            The new charter now explicitly protects against discrimination based on <strong>source of income</strong> and{" "}
            <strong>housing status</strong>. That matters for cooperative housing and alternative income models — it narrows
            the legal ground for excluding people from basic city services based on how their money arrives.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* What it didn't do */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">What it didn&apos;t do</span>
        <h2 style={{ marginBottom: "0.5rem" }}>The structural core stayed intact</h2>
        <p style={{ maxWidth: "640px", marginBottom: "1.25rem" }}>
          The 2025 charter kept Lansing&apos;s strong-mayor structure — reinforced it, actually, and the vote wasn&apos;t close.
          The deep reforms that polycentric governance requires aren&apos;t in the document.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: "640px", marginBottom: "1.25rem" }}>
          {[
            {
              label: "No neighborhood councils",
              desc: "Nothing in the charter creates neighborhood-level governance with binding authority. The DNCE and neighborhood grants program continue to exist by ordinance — which means any administration can restructure or defund them.",
              link: "/neighborhoods", linkLabel: "See the 59 neighborhood orgs →",
            },
            {
              label: "No participatory budgeting requirement",
              desc: "The mayor's strategic plan is mandatory but there's no community co-authorship requirement. It's still a plan the mayor presents to the public, not one residents shape.",
              link: "/governance/policy/participatory-budgeting", linkLabel: "What Lansing does vs. real PB →",
            },
            {
              label: "No cooperative or community ownership language",
              desc: "The charter is silent on cooperative enterprise, community land trusts, and community wealth building. The liberal construction clause (§1-202) and intergovernmental cooperation language (§1-401) are useful hooks — they require intentional application. They don't create cooperative governance by themselves.",
            },
          ].map(({ label, desc, link, linkLabel }) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,241,232,0.1)", borderRadius: "8px", padding: "1rem 1.25rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.875rem", marginBottom: "0.3rem" }}>{label}</p>
              <p style={{ fontSize: "0.8rem", margin: 0, color: "var(--color-steel-muted)" }}>{desc}</p>
              {link && linkLabel && (
                <Link href={link} style={{ fontSize: "0.75rem", color: "var(--color-dome-gold)", display: "inline-block", marginTop: "0.4rem" }}>{linkLabel}</Link>
              )}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "3px solid rgba(192,57,43,0.4)", maxWidth: "640px" }}>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            The next scheduled opportunity to revisit the charter is <strong>2041</strong>. Charter amendments before then
            require either a citizen petition (5% of registered electors) or a council resolution putting it to voters.
            That&apos;s the path if stronger provisions are needed sooner.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* What it means */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">What this means for the work</span>
        <h2 style={{ marginBottom: "1rem" }}>Use what the charter created</h2>

        <div style={{ maxWidth: "640px", marginBottom: "1.75rem" }}>
          <p>
            The charter created obligations we can use. The mayor is now required to publish measurable goals and track
            progress against them — publicly. The independent auditor will publish findings — publicly. A community wellbeing
            dashboard that measures the ALICE threshold, housing stability, food access, and the basic needs domains becomes
            a direct accountability tool, not just civic information.
          </p>
          <p>
            That&apos;s the role lansing.love plays in this moment: a community-owned parallel tracking system that measures
            what the mayor is now required to report on, but through the lens of who actually lives with the outcomes.
          </p>
          <p>
            The five-ward expansion (effective 2029) also matters. Each ward council member will represent fewer residents —
            more localized representation. Ward-level data becomes more politically legible, not less.
          </p>
        </div>

        {/* Before/after table */}
        <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(244,241,232,0.1)" }}>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(154,176,200,0.5)" }}>Before the charter</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-teal-accent)" }}>After the charter</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["No required public benchmarks for mayoral priorities",           "Mandatory three-year strategic plan with measurable goals"],
                ["Internal auditor answered to the executive",                     "Independent auditor, reports public, untouchable by mayor or council"],
                ["Contracts went to lowest bidder",                                "Best value allowed — cooperative enterprises can compete"],
                ["8 council members across 4 wards",                              "9 members across 5 wards by 2029 (smaller, more local districts)"],
                ["No expanded income/housing discrimination protections",          "Source of income and housing status now explicitly protected"],
              ].map(([before, after]) => (
                <tr key={before} style={{ borderBottom: "1px solid rgba(244,241,232,0.05)" }}>
                  <td style={{ padding: "0.5rem 0.75rem", color: "var(--color-text-muted)", fontSize: "0.8rem" }}>{before}</td>
                  <td style={{ padding: "0.5rem 0.75rem", color: "var(--color-limestone)", fontSize: "0.8rem" }}>{after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ maxWidth: "640px" }}>
          <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "3px solid var(--color-teal-accent)" }}>
            <p style={{ margin: 0, fontStyle: "italic", fontSize: "0.875rem", color: "var(--color-limestone)" }}>
              The charter is the floor of what&apos;s possible inside city government. The cooperative network —
              Sunshine House, Urbandale Farm, The Entrepreneurial Journey, and the enterprises being built through
              The Fledge — is proving what&apos;s possible outside it. Both matter. Neither is sufficient alone.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "1rem", borderTop: "1px solid rgba(244,241,232,0.08)" }}>
        <Link href="/governance/roadmap" className="btn btn--secondary btn--sm">Read the roadmap →</Link>
        <Link href="/governance" className="btn btn--ghost btn--sm">Governance overview →</Link>
        <a
          href="https://content.civicplus.com/api/assets/4ee3747d-174d-4eec-9ef6-ab1b900b97dc"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--ghost btn--sm"
        >
          Read the full charter text →
        </a>
      </div>

    </div>
  );
}
