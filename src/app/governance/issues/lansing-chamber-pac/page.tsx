import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lansing Regional Chamber & LRC-PAC: Political Capture Documented",
  description: "$30,750 to 6 of 8 city council members. Reports $0 in political spending on IRS filings. 92% endorsement win rate. Connected to a $43.5M Consumers Energy dark money network. A six-part Rhino News investigation.",
  alternates: { canonical: "/governance/issues/lansing-chamber-pac" },
  openGraph: { title: "Lansing Chamber & LRC-PAC: Political Capture | lansing.love", description: "$30,750 to 6 of 8 council members. $0 reported political spending. 92% endorsement win rate.", url: "https://lansing.love/governance/issues/lansing-chamber-pac" },
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-limestone)", lineHeight: 1, margin: 0 }}>{value}</p>
      <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.3rem", marginBottom: 0 }}>{label}</p>
    </div>
  );
}

export default function ChamberPACPage() {
  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        <Link href="/governance/issues" style={{ color: "var(--color-steel-muted)" }}>Issues</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Lansing Chamber & LRC-PAC
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Case Study · PAC Capture & Dark Money</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
          Political Capture, Documented
        </h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>2024–2026</span>
          <span className="badge badge--muted">Lansing Regional Chamber</span>
          <span className="badge badge--muted">LRC-PAC</span>
          <span className="badge badge--muted">6-part Rhino News series</span>
        </div>
      </section>

      <div style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: "12px", marginBottom: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 0 }}>
        <Stat value="6 of 8" label="Council members funded" />
        <Stat value="$30,750" label="PAC contributions (2024–25)" />
        <Stat value="$0" label="Political spending on IRS 990" />
        <Stat value="92%" label="Endorsement win rate (primary)" />
        <Stat value="$43.5M" label="Consumers Energy dark money" />
        <Stat value="58%" label="Deep Green letters from affiliates" />
        <Stat value="48 yrs" label="PAC operating history" />
        <Stat value="0" label="FEC filings found" />
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <p style={{ fontSize: "1rem", lineHeight: 1.8, maxWidth: "680px", borderLeft: "3px solid rgba(192,57,43,0.4)", paddingLeft: "1.25rem" }}>
          The Lansing Regional Chamber of Commerce has operated a PAC for 48 years that funds the majority of city council members and then advocates before those same members. Its 2024 IRS Form 990 reports $0 in political campaign activity while distributing $30,750 in council contributions. The same PAC claims federal registration but no filings appear in the FEC database. The Chamber&apos;s leadership is embedded in a $43.5 million dark money network connected to Consumers Energy.
        </p>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">The funding structure</span>
        <h2 style={{ marginBottom: "1.25rem" }}>Who gets funded — and what it buys</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", maxWidth: "720px", marginBottom: "1.5rem" }}>
          <div className="card" style={{ padding: "1.25rem" }}>
            <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>2024–2025 council contributions</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {[
                { name: "Tamera Carter (AL)", amt: "$9,850" },
                { name: "Trini Pehlivanoglu (AL)", amt: "$7,900" },
                { name: "Deyanira Nevarez Martinez (W2)", amt: "funded" },
                { name: "Jeremy Garza (AL)", amt: "funded" },
                { name: "Peter Spadafore (W4)", amt: "funded" },
                { name: "Clara Martinez (AL)", amt: "funded" },
              ].map(({ name, amt }) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                  <span style={{ color: "var(--color-steel-muted)" }}>{name}</span>
                  <span style={{ color: "var(--color-limestone)", fontWeight: 600 }}>{amt}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", paddingTop: "0.25rem", borderTop: "1px solid rgba(244,241,232,0.08)", marginTop: "0.25rem" }}>
                <span style={{ color: "var(--color-steel-muted)" }}>Ryan Kost (W1)</span>
                <span style={{ color: "#4A9B8E", fontWeight: 600 }}>$0 received</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                <span style={{ color: "var(--color-steel-muted)" }}>Adam Hussain (W3)</span>
                <span style={{ color: "#4A9B8E", fontWeight: 600 }}>$0 received</span>
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.5rem", marginBottom: 0 }}>Mayor Andy Schor: $1,500 received</p>
            </div>
          </div>
          <div className="card" style={{ padding: "1.25rem" }}>
            <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>What the Chamber asks for in return</p>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {["Zoning and development approvals (Deep Green data center)", "Contracts and procurement decisions", "Board appointments and policy votes", "Candidates evaluated on \"responsiveness to Chamber priorities\"", "Questionnaires and scoring criteria kept confidential"].map(i => (
                <li key={i} style={{ fontSize: "0.78rem" }}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card" style={{ padding: "0.875rem 1.25rem", maxWidth: "640px" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--color-steel-muted)", margin: 0 }}>
            LRC-PAC endorsements win 92% of primary races and 86% of general elections. Chamber CEO Tim Daman (also PAC treasurer) personally testifies before officials the PAC funded on the same development decisions the funding was intended to influence.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Financial opacity</span>
        <h2 style={{ marginBottom: "1rem" }}>Reports $0 — spends $30,750</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "680px" }}>
          {[
            { label: "IRS Form 990 (2024): $0 political spending reported", desc: "The Chamber&apos;s 990 reports zero political campaign activity despite operating a PAC for 48 years, maintaining a homepage link to a paid advocacy platform, and listing \"Increase LRCC PAC donors by 10%\" as a 2025 strategic goal." },
            { label: "FEC registration claimed — zero filings found", desc: "The PAC claims FEC registration, a requirement for any committee that endorses federal candidates. A search of the FEC committee database returns no results for LRC-PAC. The Chamber endorsed a U.S. Senate candidate in a recent cycle." },
            { label: "$311,344 in unexplained \"Other fees for services\"", desc: "15.2% of Chamber expenses listed with no vendor names disclosed. No explanation of what services were purchased or from whom." },
            { label: "$19,034 to political consultant Scott Greenlee (2025)", desc: "More than half of 2025 PAC spending went to a single political consultant, driving the PAC balance from a $24,889 surplus to -$2,601." },
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
        <span className="eyebrow">Astroturf operations</span>
        <h2 style={{ marginBottom: "1rem" }}>Manufactured consent — Deep Green</h2>
        <p style={{ maxWidth: "640px", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
          When the $120M Deep Green data center came before the Planning Commission and City Council, the Chamber generated &ldquo;public support&rdquo; through its advocacy platform while funding most of the council members voting on the project.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "720px" }}>
          {[
            { label: "58% of support letters from affiliates", desc: "7 of 12 template letters submitted to City Council came from Chamber-affiliated individuals, all generated through \"The Soft Edge\" advocacy platform within the same timeframe." },
            { label: "Chamber homepage linked to the campaign", desc: "The Chamber homepage linked directly to the advocacy campaign without disclosure. Steve Japinga submitted a template letter as a \"member of local business community\" while managing the PAC funding those council members." },
            { label: "Loopback enrollment patterns", desc: "Four senders showed patterns consistent with administrative enrollment — accounts appear to have been enrolled by administrators rather than self-organized community members." },
            { label: "200+ residents opposed", desc: "At the February 10 City Council meeting, more than 200 residents attended — the vast majority opposed Deep Green. The Chamber&apos;s manufactured letters did not reflect actual community sentiment." },
          ].map(({ label, desc }) => (
            <div key={label} className="card" style={{ padding: "1rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", marginBottom: "0.3rem" }}>{label}</p>
              <p style={{ fontSize: "0.78rem", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">The dark money network</span>
        <h2 style={{ marginBottom: "1rem" }}>$43.5 million from Consumers Energy reaches City Hall</h2>
        <p style={{ maxWidth: "640px", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
          The Chamber is one node in a larger dark money network documented by Rhino News. Consumers Energy funneled $43.5 million (2014–2017) to Citizens for Energizing Michigan&apos;s Economy — a 501(c)(4) shielding donor identity. That network reaches directly into Lansing city decisions.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "680px" }}>
          {[
            { label: "Reid Felsing", role: "Attorney, dark money network architect", detail: "\"The beauty of the C4 is the anonymity of money coming in.\" Appointed to Eaton County District Court bench (January 2025)." },
            { label: "Adrian Hemond", role: "CEO, Grassroots Midwest consulting", detail: "Simultaneously advises the Mayor, city unions, and the Chamber PAC that funds 7 of 8 council members. Conflict built into the consulting structure." },
            { label: "Nine BWL employees", role: "Board of Water & Light staff", detail: "Donated $6,000 to LRC-PAC within 48 hours (March 2022). CFO Heather Shawa later joined the Chamber&apos;s 2026 Board and testified for Deep Green — a project dependent on a $100M BWL steam contract." },
            { label: "Josh Hovey / Bellwether PR", role: "PAC committee member, former Planning Commissioner", detail: "Now lobbies the Planning Commission as a paid consultant. Also managed the Michigan for Responsible Data Centers astroturf coalition while representing Deep Green." },
          ].map(({ label, role, detail }) => (
            <div key={label} className="card" style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.75rem" }}>
              <div>
                <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", margin: 0 }}>{label}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--color-dome-gold)", margin: 0 }}>{role}</p>
              </div>
              <p style={{ fontSize: "0.78rem", margin: 0, color: "var(--color-steel-muted)" }}>{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Recommendations</span>
        <h2 style={{ marginBottom: "1rem" }}>Disclosure as minimum standard</h2>
        <div style={{ maxWidth: "640px" }}>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
            {[
              "Require council members to disclose PAC funding from organizations that appear before them and recuse on relevant votes",
              "Lansing should adopt a small-donor public financing ordinance — the route Seattle and San Jose used to dilute concentrated PAC influence",
              "IRS should audit Chamber 990 reporting — $0 political spending claim is inconsistent with documented PAC operations",
              "Require disclosure of all advocacy platform campaigns that generate template letters submitted as public comment",
              "Proactive disclosure ordinance: publish meeting communications before being FOIA&apos;d, making manufactured consent campaigns visible in real time",
            ].map(r => <li key={r} style={{ fontSize: "0.85rem" }}>{r}</li>)}
          </ul>
        </div>
      </section>

      <div style={{ borderTop: "1px solid rgba(244,241,232,0.08)", paddingTop: "1.25rem", marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Sources</p>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {[
            "Rhinoceros Media. 6-part series: \"How the Chamber's PAC Shapes Who Governs and What Gets Built.\"",
            "Rhinoceros Media. \"How Organic Is the Support for Deep Green?\"",
            "Rhinoceros Media. \"How Consumers Energy's $43 Million Dark Money Operation Reaches Lansing City Hall.\"",
            "Michigan Department of State campaign finance filings — LRC-PAC (2024–2025).",
            "IRS Form 990, Lansing Regional Chamber of Commerce (2024).",
            "FEC committee database search — no LRC-PAC filings found.",
          ].map(s => <li key={s} style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{s}</li>)}
        </ul>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/governance/issues" className="btn btn--ghost btn--sm">← All issues</Link>
        <Link href="/predictions" className="btn btn--secondary btn--sm">Track council votes →</Link>
      </div>
    </div>
  );
}
