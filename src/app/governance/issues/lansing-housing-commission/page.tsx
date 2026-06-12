import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lansing Housing Commission: Housing Privatization as Wealth Extraction",
  description: "51 families evicted. $17.7M in public housing sold at $87,600/unit while construction cost $357,000/unit. 85+ children displaced mid-school-year. A cooperative principles analysis of the LHC-SK Investment Group transaction.",
  alternates: { canonical: "/governance/issues/lansing-housing-commission" },
  openGraph: { title: "LHC: Housing Privatization as Wealth Extraction | lansing.love", description: "51 families evicted. $17.7M sold. 85+ children displaced. A cooperative principles analysis of the Lansing Housing Commission.", url: "https://lansing.love/governance/issues/lansing-housing-commission" },
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-limestone)", lineHeight: 1, margin: 0 }}>{value}</p>
      <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.3rem", marginBottom: 0 }}>{label}</p>
    </div>
  );
}

export default function LHCPage() {
  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      {/* Breadcrumb */}
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        <span style={{ color: "var(--color-steel-muted)" }}>Issues</span>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Lansing Housing Commission
      </p>

      {/* Header */}
      <section style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Case Study · Appointed Board Accountability</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
          Housing Privatization as Community Wealth Extraction
        </h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>June 10, 2026</span>
          <span className="badge badge--muted">Lansing Housing Commission</span>
          <span className="badge badge--muted">SK Investment Group</span>
        </div>
      </section>

      {/* Key stats */}
      <div style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: "12px", marginBottom: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 0 }}>
        <Stat value="51" label="Families evicted" />
        <Stat value="14" label="Evicted in one day" />
        <Stat value="25%" label="Eviction rate" />
        <Stat value="84" label="Net units lost" />
        <Stat value="85+" label="Children displaced" />
        <Stat value="$17.7M" label="Sale proceeds" />
        <Stat value="$357K" label="Cost per unit built" />
        <Stat value="$87.6K" label="Sale price per unit" />
      </div>

      {/* Executive summary */}
      <section style={{ marginBottom: "3rem" }}>
        <p style={{ fontSize: "1rem", lineHeight: 1.8, maxWidth: "680px", borderLeft: "3px solid rgba(192,57,43,0.4)", paddingLeft: "1.25rem" }}>
          The Lansing Housing Commission&apos;s operations exemplify how housing privatization systematically extracts wealth from communities while claiming to serve them. The SK Investment Group transaction, tax credit syndication through Cinnaire, and federal grant accumulation represent a coordinated shift from maximizing affordable housing units to maximizing financial returns for private partners. When analyzed through cooperative economics principles, LHC&apos;s entire operational model violates community-centered ownership and democratic control.
        </p>
      </section>

      <hr className="divider" />

      {/* The pattern */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">The pattern</span>
        <h2 style={{ marginBottom: "1.25rem" }}>Privatization over people</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", maxWidth: "720px" }}>
          <div className="card" style={{ padding: "1.25rem" }}>
            <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", fontSize: "0.82rem", marginBottom: "0.6rem" }}>Revenue strategies</p>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {["Tax credit syndication with Cinnaire — monetize federal credits rather than build housing", "Asset disposition — sell 202 public units for $17.7M in liquid capital", "Federal grant accumulation — $17M+ in HUD Capital Fund grants while reducing housing stock", "Management contracting — sell properties then contract back to manage them for fees"].map(i => (
                <li key={i} style={{ fontSize: "0.8rem" }}>{i}</li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ padding: "1.25rem", borderLeft: "3px solid rgba(192,57,43,0.5)" }}>
            <p style={{ fontWeight: 600, color: "#c0392b", fontSize: "0.82rem", marginBottom: "0.6rem" }}>The results</p>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {["Net loss of 84 affordable units despite $42M in construction spending", "25% eviction rate from formerly stable public housing", "$357,000 per apartment built vs. $87,600 per unit sold", "85+ children displaced during the academic year"].map(i => (
                <li key={i} style={{ fontSize: "0.8rem" }}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* 7 Cooperative Principles */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Analytical framework</span>
        <h2 style={{ marginBottom: "0.5rem" }}>The Seven Cooperative Principles — applied</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)", maxWidth: "640px", marginBottom: "1.5rem" }}>
          The International Cooperative Alliance&apos;s seven principles define what community-centered ownership looks like. LHC&apos;s operations fail every one.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            {
              n: "1", label: "Voluntary and Open Membership",
              violation: "51 families evicted — 14 in a single day — through court proceedings with no voluntary exit process. New residents selected by private landlord criteria, not community need.",
              evidence: "MiCOURT records: 51 eviction cases filed by SK Lansing, all marked CLOSED.",
            },
            {
              n: "2", label: "Democratic Member Control",
              violation: "Residents had no vote in the decision to sell their homes. 40 families expressed interest in purchasing; only 8 qualified. No documented resident consultation.",
              evidence: "No resident representation on LHC board during sale process.",
            },
            {
              n: "3", label: "Member Economic Participation",
              violation: "Residents received zero share of $17.7M in sale proceeds. Families who built community through residency received nothing. Capital gains captured entirely by LHC and transferred to private entity.",
              evidence: "$17.7M sale proceeds; zero resident benefit sharing; LHC accumulates $30M+ including federal grants.",
            },
            {
              n: "4", label: "Autonomy and Independence",
              violation: "Community lost autonomous control over housing. Properties now controlled by a Florida investment firm (SK Investment Group, 1,500+ units across multiple states). 20-year covenant creates dependency, not autonomy.",
              evidence: "SK Investment Group operates from Florida; Lansing properties managed as part of external portfolio.",
            },
            {
              n: "5", label: "Education, Training, and Information",
              violation: "Residents told 'very few' would need to relocate. Reality: 25% eviction rate. FOIA requests blocked with $807.60 fees using wrong legal test. Community denied information needed to participate.",
              evidence: "Promises of minimal displacement contradicted by 51 eviction filings.",
            },
            {
              n: "6", label: "Cooperation Among Cooperatives",
              violation: "LHC partnered with extractive private capital rather than community land trusts, resident cooperatives, or community development corporations. No exploration of cooperative ownership transition.",
              evidence: "Sale to private Limited Dividend Housing Association rather than community-controlled entity.",
            },
            {
              n: "7", label: "Concern for Community",
              violation: "85+ school-age children displaced mid-academic year. Community stability destroyed through mass evictions. Estimated $1.3M cost to school district. Local wealth extracted to external investors.",
              evidence: "Educational disruption during school year; community assets transferred to external ownership.",
            },
          ].map(({ n, label, violation, evidence }) => (
            <div key={n} className="card" style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
              <div style={{ textAlign: "center", paddingTop: "0.1rem" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#c0392b", margin: 0 }}>#{n}</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem", marginBottom: "0.35rem" }}>{label}</p>
                <p style={{ fontSize: "0.8rem", marginBottom: "0.35rem" }}>{violation}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontStyle: "italic", margin: 0 }}>Evidence: {evidence}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* 5 Ownership Questions */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Ownership analysis</span>
        <h2 style={{ marginBottom: "1rem" }}>The Five Ownership Questions</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(244,241,232,0.1)" }}>
                {["Question", "Before", "After", "Assessment"].map(h => (
                  <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { q: "Who owns it?",         before: "Public — LHC (community asset)",        after: "SK Investment Group (private capital)",           verdict: "EXTRACTIVE" },
                { q: "Who has power?",       before: "LHC Board (publicly accountable)",      after: "SK Group management (external private entity)",   verdict: "EXTRACTIVE" },
                { q: "Who benefits?",        before: "202 low-income Lansing families",        after: "SK shareholders, Cinnaire, LHC via mgmt fees",   verdict: "EXTRACTIVE" },
                { q: "Who does the work?",   before: "LHC staff, local contractors",          after: "LHC potentially contracted back as managers",    verdict: "EXTRACTIVE" },
                { q: "Who makes the rules?", before: "HUD regulations, public accountability", after: "Private landlord-tenant law, SK corporate policy", verdict: "EXTRACTIVE" },
              ].map(({ q, before, after, verdict }) => (
                <tr key={q} style={{ borderBottom: "1px solid rgba(244,241,232,0.05)" }}>
                  <td style={{ padding: "0.6rem 0.75rem", fontWeight: 600, color: "var(--color-limestone)", whiteSpace: "nowrap" }}>{q}</td>
                  <td style={{ padding: "0.6rem 0.75rem", color: "var(--color-text-secondary)" }}>{before}</td>
                  <td style={{ padding: "0.6rem 0.75rem", color: "var(--color-text-secondary)" }}>{after}</td>
                  <td style={{ padding: "0.6rem 0.75rem", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#c0392b", letterSpacing: "0.06em" }}>{verdict}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.75rem" }}>Result: 5 of 5 dimensions show extractive characteristics.</p>
      </section>

      <hr className="divider" />

      {/* CLT alternative */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">What should have happened</span>
        <h2 style={{ marginBottom: "1rem" }}>The Community Land Trust alternative</h2>
        <div style={{ maxWidth: "640px" }}>
          <p>A Community Land Trust model would have achieved actual community ownership preservation. LHC could have:</p>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.4rem", paddingLeft: "1.25rem" }}>
            {[
              "Transferred properties to a community land trust with resident board representation",
              "Allowed residents to purchase homes with deed restrictions preserving affordability in perpetuity",
              "Retained community ownership of land while enabling homeownership",
              "Used sale proceeds to expand community-controlled affordable housing rather than accumulate liquid capital",
            ].map(i => (
              <li key={i} style={{ fontSize: "0.85rem" }}>{i}</li>
            ))}
          </ul>
          <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
            The goal should be housing people, not generating revenue streams from housing programs. The solution is not better oversight of privatization — it&apos;s rejection of privatization in favor of community ownership.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* Recommendations */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Next steps</span>
        <h2 style={{ marginBottom: "1.25rem" }}>Recommendations</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "720px" }}>
          <div className="card" style={{ padding: "1.25rem" }}>
            <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", fontSize: "0.85rem", marginBottom: "0.6rem" }}>Immediate</p>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {["Establish a Lansing Community Land Trust", "Support tenant organizing in remaining LHC properties", "Advocate for community ownership preference in future dispositions", "Reform LHC governance to include resident board representation"].map(i => (
                <li key={i} style={{ fontSize: "0.8rem" }}>{i}</li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ padding: "1.25rem" }}>
            <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", fontSize: "0.85rem", marginBottom: "0.6rem" }}>Structural</p>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {["Anti-speculation policy preventing extractive ownership transfers", "Community ownership fund for housing acquisition", "Prioritize cooperative ownership in all new affordable housing development", "Independent auditor with mandate to examine LHC financial flows"].map(i => (
                <li key={i} style={{ fontSize: "0.8rem" }}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Sources */}
      <div style={{ borderTop: "1px solid rgba(244,241,232,0.08)", paddingTop: "1.5rem", marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>Sources</p>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {[
            "International Cooperative Alliance. \"Statement on the Cooperative Identity.\" ICA, 1995.",
            "Democracy at Work Institute. \"Community Ownership Handbook.\" DAWI, 2023.",
            "Community Land Trust Network. \"CLT Technical Manual.\" CLTN, 2011.",
            "MiCOURT records — SK Lansing eviction filings (51 cases, all marked CLOSED).",
            "Rhinoceros Media public records reporting on Lansing Housing Commission.",
          ].map(s => (
            <li key={s} style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{s}</li>
          ))}
        </ul>
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/governance" className="btn btn--ghost btn--sm">← Back to Governance</Link>
        <Link href="/predictions" className="btn btn--secondary btn--sm">Track future LHC votes →</Link>
      </div>

    </div>
  );
}
