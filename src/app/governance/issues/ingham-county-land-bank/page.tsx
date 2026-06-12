import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ingham County Land Bank: Demolition as Business Model",
  description: "2.7 demolitions for every housing unit created. $1.5M in public grants redirected to a single-member LLC formed 3 days after selection. A governance analysis of the Ingham County Land Bank's insider pipeline and misaligned mission.",
  alternates: { canonical: "/governance/issues/ingham-county-land-bank" },
  openGraph: { title: "Ingham County Land Bank: Demolition as Business Model | lansing.love", description: "2.7 demolitions per housing unit. $1.5M grant to a LLC formed 3 days after selection. The Land Bank's insider pipeline documented.", url: "https://lansing.love/governance/issues/ingham-county-land-bank" },
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-limestone)", lineHeight: 1, margin: 0 }}>{value}</p>
      <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.3rem", marginBottom: 0 }}>{label}</p>
    </div>
  );
}

export default function LandBankPage() {
  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        <Link href="/governance/issues" style={{ color: "var(--color-steel-muted)" }}>Issues</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Ingham County Land Bank
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Case Study · Appointed Board Accountability</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
          Demolition as Business Model
        </h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>June 2026</span>
          <span className="badge badge--muted">Ingham County Land Bank</span>
          <span className="badge badge--muted">Alan Fox · Emma Henry · Rawley Van Fossen</span>
        </div>
      </section>

      <div style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: "12px", marginBottom: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 0 }}>
        <Stat value="2.7:1" label="Demolitions per unit created" />
        <Stat value="472" label="Parcels owned in Lansing" />
        <Stat value="$976K" label="Demolition spending (2024)" />
        <Stat value="$1.5M" label="Grant to post-selection LLC" />
        <Stat value="$1" label="Insider property acquisition" />
        <Stat value="0" label="Competitive bids on sales" />
        <Stat value="22 min" label="Avg. board meeting length" />
        <Stat value="5 yrs" label="One dissenting vote recorded" />
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <p style={{ fontSize: "1rem", lineHeight: 1.8, maxWidth: "680px", borderLeft: "3px solid rgba(192,57,43,0.4)", paddingLeft: "1.25rem" }}>
          The Ingham County Land Bank was created to return vacant and tax-foreclosed property to productive use. Over 20 years its operations have produced the opposite: a 2.7-to-1 demolition-to-creation ratio, a 472-parcel landholding in a city with a severe housing shortage, and a procurement pipeline that consistently routes public funds to a small circle of preferred partners without competitive bidding.
        </p>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Mission vs. practice</span>
        <h2 style={{ marginBottom: "1.25rem" }}>Demolition over housing</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", maxWidth: "720px", marginBottom: "1.5rem" }}>
          <div className="card" style={{ padding: "1.25rem", borderLeft: "3px solid rgba(192,57,43,0.5)" }}>
            <p style={{ fontWeight: 600, color: "#c0392b", fontSize: "0.82rem", marginBottom: "0.5rem" }}>15-year record (2005–2020)</p>
            <p style={{ fontSize: "0.82rem", margin: 0 }}>~800 properties demolished vs. 297 units created or preserved — a 2.7:1 ratio that contradicts the Michigan Land Bank Fast Track Act&apos;s stated purpose of facilitating &ldquo;use and development of certain property.&rdquo;</p>
          </div>
          <div className="card" style={{ padding: "1.25rem" }}>
            <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", fontSize: "0.82rem", marginBottom: "0.5rem" }}>Recent period (Oct 2020–Apr 2026)</p>
            <p style={{ fontSize: "0.82rem", margin: 0 }}>At least 47 demolitions vs. ~15 housing completions. Renovated homes sold at $145,000–$200,000 market rate. Five Sparrow-donated houses renovated at zero acquisition cost and sold for $925,000 total.</p>
          </div>
        </div>
        <div className="card" style={{ padding: "1rem 1.25rem", maxWidth: "640px" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)", margin: 0 }}>
            The Land Bank holds 472 parcels within the City of Lansing — the largest single property owner in the city — during a period when Michigan faces a 119,000-unit housing deficit and Lansing rents have risen 25.3% since January 2022.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Insider pipeline</span>
        <h2 style={{ marginBottom: "1.25rem" }}>Preferred partners, no competitive process</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "720px" }}>
          {[
            {
              label: "Pleasant Grove Project — $1.5M grant, post-selection LLC",
              desc: "Brent Forsberg selected via a two-response RFP (September 2024). Holmes & Pleasant Grove LLC formed June 3, 2025 — three days after selection. $1.5M in county grants redirected to the newly created entity. Additional $4,500/month in personal consulting payments (October–December 2025). Construction repeatedly delayed: November 2025 → March 2026.",
            },
            {
              label: "Capital Area Housing Partnership — below-market parcels, circular fees",
              desc: "CAHP receives below-market Land Bank acquisitions ($5,610 average). Emma Henry runs CAHP while simultaneously chairing the Lansing Housing Commission. CAHP pays Land Bank quarterly rental-management fees: $1,818.80 (April 2025 documented). The same person controls both sides of the transaction.",
            },
            {
              label: "122 Allen Street — staff self-dealing, $1 acquisition",
              desc: "Land Bank acquired a gas-damaged house from its own Garden Program Coordinator for $1 (December 2024). Demolished with public funds. Cleared lot sold for $7,500 under blanket April 2025 authorization to preferred developer. No staff-level conflict-disclosure rule covered this transaction.",
            },
            {
              label: "Cooney Homes & Allen Edwin — blanket authorizations",
              desc: "April 2025: Board authorized Cooney Homes to purchase multiple parcels without specifying which properties. Allen Edwin Homes authorized for 5.76 acres at $33,000 with no income restrictions on resulting rentals (deal later terminated). No documented competitive bidding in either case.",
            },
          ].map(({ label, desc }) => (
            <div key={label} className="card" style={{ padding: "1.25rem", borderLeft: "3px solid rgba(192,57,43,0.4)" }}>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.875rem", marginBottom: "0.35rem" }}>{label}</p>
              <p style={{ fontSize: "0.8rem", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Board composition</span>
        <h2 style={{ marginBottom: "1rem" }}>Structural conflicts of interest</h2>
        <p style={{ maxWidth: "640px", marginBottom: "1.25rem", fontSize: "0.875rem" }}>Every board member occupies multiple overlapping roles. Three of five are county commissioners who also hold fiscal or zoning authority over the Land Bank&apos;s operations.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
          {[
            { name: "Alan Fox", role: "Chair (ex officio) · Ingham County Treasurer", conflict: "Controls tax-foreclosure pipeline that supplies Land Bank inventory. Co-owned Practical Political Consulting with board member Mark Grebner before Fox became Treasurer." },
            { name: "Rawley Van Fossen", role: "Treasurer · City of Lansing Director of Economic Development and Planning", conflict: "Issues demolition permits on properties Land Bank sells. Former CAHP executive director — CAHP is a preferred Land Bank partner." },
            { name: "Emma Henry", role: "Member · Executive Director, Capital Area Housing Partnership", conflict: "CAHP receives below-market Land Bank parcels. Henry also chairs the Lansing Housing Commission, another body with overlapping real estate interests." },
            { name: "Ryan Sebolt", role: "Secretary · County Commissioner · Michigan AFL-CIO Director", conflict: "Holds fiscal authority over Land Bank budget as commissioner while serving on the board it funds." },
            { name: "Mark Grebner", role: "Vice Chair · County Commissioner", conflict: "20-year board member. Co-owned Practical Political Consulting with Chair Alan Fox before Fox became Treasurer." },
          ].map(({ name, role, conflict }) => (
            <div key={name} className="card" style={{ padding: "1rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", marginBottom: "0.2rem" }}>{name}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--color-dome-gold)", marginBottom: "0.4rem" }}>{role}</p>
              <p style={{ fontSize: "0.78rem", margin: 0, color: "var(--color-steel-muted)" }}>{conflict}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Governance gaps</span>
        <h2 style={{ marginBottom: "1rem" }}>No meaningful oversight</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "720px" }}>
          {[
            { label: "No federal oversight", desc: "Unlike the Housing Commission (HUD oversight), the Land Bank has no inspector general authority and no federal compliance requirement." },
            { label: "No competitive bidding", desc: "No documented competitive bidding requirement for property sales. Board issues blanket authorizations to preferred buyers without specifying properties." },
            { label: "Unanimous voting", desc: "Only one dissenting vote recorded across five years of meetings. Board meetings average 22–56 minutes. Zero public comment in approximately 20 meetings (2020–2026)." },
            { label: "HOA self-management", desc: "Land Bank attorney, executive director, and real estate specialist control HOA boards for Genesee Pointe and Pointe West while Land Bank pays HOA dues on unsold units at $165/month." },
          ].map(({ label, desc }) => (
            <div key={label} className="card" style={{ padding: "1rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", marginBottom: "0.3rem" }}>{label}</p>
              <p style={{ fontSize: "0.8rem", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Recommendations</span>
        <h2 style={{ marginBottom: "1rem" }}>What accountable land banking looks like</h2>
        <div style={{ maxWidth: "640px" }}>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
            {[
              "Require competitive bidding for all property dispositions above a defined threshold",
              "Prohibit board members from simultaneously serving in roles that supply, receive, or permit Land Bank properties",
              "Mandate income-restricted affordability covenants on all renovated properties sold using public grants",
              "Require a forensic audit of grant expenditures — modeled on Detroit Land Bank audit (2020) which uncovered $50.8M in unapproved payments",
              "Establish a public dashboard showing every parcel acquired, held, demolished, and sold with dates, prices, and buyer identities",
            ].map(r => <li key={r} style={{ fontSize: "0.85rem" }}>{r}</li>)}
          </ul>
        </div>
      </section>

      <div style={{ borderTop: "1px solid rgba(244,241,232,0.08)", paddingTop: "1.25rem", marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Sources</p>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {["Rhinoceros Media. \"Demolition Is the Ingham County Land Bank's Current Business Model.\"", "Rhinoceros Media. \"The Ingham County Land Bank's Insider Pipeline.\"", "Michigan Land Bank Fast Track Act (PA 258) — statutory purpose statement.", "Ingham County Land Bank board minutes and resolutions (2020–2026), obtained via FOIA.", "Michigan State Housing Development Authority records."].map(s => (
            <li key={s} style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{s}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/governance/issues" className="btn btn--ghost btn--sm">← All issues</Link>
        <Link href="/predictions" className="btn btn--secondary btn--sm">Track Land Bank votes →</Link>
      </div>
    </div>
  );
}
