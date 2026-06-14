import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Build an Alternative to a Chamber of Commerce",
  description: "A two-track plan: document what the Lansing Regional Chamber has done with public money and power, and build a cooperative that serves the businesses the Chamber has never served.",
  alternates: { canonical: "/governance/alternatives/chamber" },
  openGraph: { title: "How to Build an Alternative to a Chamber | lansing.love", url: "https://lansing.love/governance/alternatives/chamber" },
};

function Section({ eyebrow, heading, children }: { eyebrow: string; heading: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "3.5rem" }}>
      <hr className="divider" />
      <span className="eyebrow">{eyebrow}</span>
      <h2 style={{ marginBottom: "1rem" }}>{heading}</h2>
      {children}
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "3px solid var(--color-teal-accent)", marginBottom: "1.25rem" }}>
      <p style={{ margin: 0, color: "var(--color-limestone)", fontStyle: "italic", fontSize: "0.9rem" }}>{children}</p>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "3px solid #c0392b", marginBottom: "1.25rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem" }}>{children}</p>
    </div>
  );
}

export default function ChamberAlternativePage() {
  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      {/* Breadcrumb */}
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Alternatives
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Chamber
      </p>

      {/* Header */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Action Plan · Based entirely on public records</span>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", lineHeight: 1.2, marginBottom: "1rem" }}>
          How to build an alternative to a chamber of commerce
        </h1>
        <p style={{ maxWidth: "640px", fontSize: "0.95rem" }}>
          This plan runs two tracks simultaneously: hold the Lansing Regional Chamber of Commerce accountable
          for documented governance failures, and build a grassroots cooperative that serves the businesses
          the Chamber has never served.
        </p>
        <Callout>
          Neither track works alone. Exposing problems without offering an alternative leaves businesses stranded.
          Building an alternative without addressing the existing power structure means competing against an
          organization that already controls the political relationships.
        </Callout>
        <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
          Evidence base: six investigative briefs built entirely from public records — Michigan campaign finance
          filings, IRS Form 990 tax returns, Michigan business entity registrations, and county property records.
          Every factual claim is independently verifiable.{" "}
          <Link href="/governance/issues/lansing-chamber-pac" style={{ color: "var(--color-dome-gold)" }}>
            See the full case study →
          </Link>
        </p>
      </section>

      {/* The eight findings */}
      <Section eyebrow="The evidence" heading="Eight documented findings">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            {
              n: "1",
              label: "One person holds five officer roles across four entities",
              desc: "Tim Daman ($181,253/year) is President and Secretary of the Chamber, President and Secretary of the dormant Foundation, President of Advance Greater Lansing, and Treasurer of LRC-PAC. Each entity is supposed to have its own board exercising independent judgment. When the same person sits on every side of every transaction, conflict-of-interest review becomes a formality.",
            },
            {
              n: "2",
              label: "The PAC funds six of eight current council members",
              desc: "LRC-PAC contributions to sitting council members range from $500 to $10,600. Adam Hussain (Ward 3) and Ryan Kost (Ward 1) are the only members who received nothing. Any council vote on a Chamber-related matter runs through six members with a documented financial relationship with the Chamber's political committee.",
            },
            {
              n: "3",
              label: "63% of top donors live outside Lansing city limits",
              desc: "63% of the top 30 individual donors live in Okemos, East Lansing, DeWitt, Grand Ledge, Mason, Laingsburg, and Orchard Lake — not in Lansing itself. The PAC funds Lansing council races. Donors who live outside city limits cannot vote in those elections.",
            },
            {
              n: "4",
              label: "Consulting firms paid by the PAC also donate to it",
              desc: "Greenlee Consulting received $40,786 in PAC vendor payments while its owner donated ~$1,600 and sits on the Advance Greater Lansing board. Resch Strategies received $4,988 while its owner donated $5,600 and also sits on that board. The 25:1 ratio of payments received to personal donations is the textbook fact pattern for self-dealing under IRS § 4958.",
            },
            {
              n: "5",
              label: "Contradictory tax filings on a $113,446 transfer — the strongest single finding",
              desc: "The Lansing Regional Development Foundation transferred $113,446 to the Chamber in 2023. Tim Daman signed both returns. The Foundation's 990-EZ answered 'No' to the question asking whether it had transferred assets to a non-charitable related organization. The Chamber's Schedule R confirms receiving exactly $113,446 from the Foundation the same year. Both returns are signed under penalty of perjury. One is false on its face. Filing a false federal return is a federal felony under 26 U.S.C. § 7206(1).",
              highlight: true,
            },
            {
              n: "6",
              label: "The Chamber reports zero political campaign activity",
              desc: "The Chamber's 2024 Form 990 answers 'No' to whether it engaged in political campaign activities — despite the CEO serving as PAC treasurer, the SVP managing PAC operations from the Chamber's email domain, and the Chamber invoicing the PAC $5,052 for design, events, and Facebook ads. This is a separate facial misstatement on a return signed under penalty of perjury.",
            },
            {
              n: "7",
              label: "The PAC ended 2025 with a negative bank balance",
              desc: "LRC-PAC's closing cash balance as of December 31, 2025 is negative $1,601.44, per the January 2026 Campaign Statement filed February 3, 2026. Political committees are allowed to run deficits. This is not a legal violation. It is an early operational indicator that the PAC's revenue model is under stress — without any external pressure campaign.",
            },
            {
              n: "8",
              label: "The membership application does not disclose the PAC",
              desc: "The Chamber's membership signup pages do not disclose the affiliated entities. The PAC has its own page at /lrc-pac/ not linked from the join flow, and the PAC FAQ page is currently a 404 error. Members whose dues pay Chamber salaries — including the salaries of the people running the political committee — have not been given notice at the point of dues collection.",
            },
          ].map(({ n, label, desc, highlight }) => (
            <div key={n} className="card" style={{ padding: "1.25rem", borderLeft: `3px solid ${highlight ? "#c0392b" : "rgba(192,57,43,0.25)"}` }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#c0392b", margin: 0, minWidth: "18px", marginTop: "0.15rem" }}>#{n}</p>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem", marginBottom: "0.35rem" }}>{label}</p>
                  <p style={{ fontSize: "0.8rem", margin: 0 }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Track A */}
      <Section eyebrow="Track A — Accountability" heading="File the complaints">
        <p style={{ maxWidth: "640px", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          Seven filings across five jurisdictions. All based on publicly available records.
          All should be reviewed by an attorney before submission.
          File IRS and AG simultaneously, within the same week.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {[
            {
              label: "IRS Form 13909 — Tax-Exempt Organization Complaint",
              desc: "Two grounds: (1) Foundation's 990-EZ contradicts Chamber's Schedule R on the $113,446 transfer. (2) Chamber reports zero political activity while its CEO is PAC treasurer and Chamber invoices the PAC for services.",
              where: "eoclass@irs.gov — or mail to IRS Exempt Organizations Classifications, 1100 Commerce St., Dallas TX 75242. No fee. Complainant identity protected under § 6103.",
            },
            {
              label: "Michigan Attorney General — Charitable Trust Section",
              desc: "Foundation transferred $113,446 in charitable assets to a non-charitable business league, with the same person controlling both sides and zero independent board directors. AG authority under Supervision of Trustees of Charitable Trusts Act (MCL 14.251).",
              where: "michigan.gov/ag/consumer-protection/charities — or mail to Charitable Trust Section, P.O. Box 30214, Lansing MI 48909. No fee.",
            },
            {
              label: "Michigan Attorney Grievance Commission",
              desc: "Chamber legal counsel Mark Burzych simultaneously serves as a Chamber board director and personal PAC donor. Michigan Rules of Professional Conduct Rule 1.7 requires informed written consent for concurrent conflicts. The Commission has subpoena power.",
              where: "Attorney Grievance Commission, 535 Griswold Suite 1700, Detroit MI 48226.",
            },
            {
              label: "PRSA Ethics Complaint",
              desc: "Three Bellwether PR partners hold overlapping roles: PAC committee member, personal PAC donor, and paid PR representative for a developer whose project was before the council members the PAC funds.",
              where: "PRSA Board of Ethics and Professional Standards — prsa.org grievance process.",
            },
            {
              label: "FOIA — BWL and MDHHS",
              desc: "Request all contracts, invoices, and communications with Bellwether Public Relations from Lansing Board of Water & Light and the Michigan Department of Health and Human Services. Tests whether the same PR firm was paid by a public agency and a private developer on overlapping issues.",
              where: "Michigan FOIA: 5-business-day response window (MCL 15.235). Fee waiver available under MCL 15.234(1) for public interest requests.",
            },
            {
              label: "City of Lansing FOIA",
              desc: "Request all contracts, sponsorships, grants, and pass-through agreements between the City and any Chamber entity over the last ten years.",
              where: "City of Lansing FOIA coordinator.",
            },
          ].map(({ label, desc, where }) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(244,241,232,0.1)", borderRadius: "10px", padding: "1.25rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.875rem", marginBottom: "0.4rem" }}>{label}</p>
              <p style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>{desc}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)", fontStyle: "italic", margin: 0 }}>File to: {where}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>After filing</p>
          <ul style={{ fontSize: "0.875rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Publish the cooperative proposal publicly, timed to the end of the Chamber&apos;s budget year (December 31) when members are deciding whether to renew.</li>
            <li>Brief council members Hussain and Kost — the two members who received nothing from the PAC. Every other council member received $500–$10,600.</li>
            <li>Recruit one credible mid-size Lansing employer willing to write a public letter stating the LRC-PAC does not speak for them. One named defection gives permission for others to follow. (PG&E went first in the 2009 U.S. Chamber climate dispute; Exelon, Apple, Nike followed within six weeks.)</li>
            <li>Provide filings and findings to local press: Lansing City Pulse, Lansing State Journal, MLive. The IRS and AG complaints create the news hook.</li>
          </ul>
        </div>

        <Warning>
          Do not do mass email. Do not use anonymous accounts — that is the same astroturf tactic the investigation documents the Chamber using. Do not organize coordinated boycotts — raises Michigan antitrust issues (MCL 445.771, Sherman Act § 1).
        </Warning>
      </Section>

      {/* Track B */}
      <Section eyebrow="Track B — Build the Alternative" heading="The cooperative">
        <Callout>
          The framing matters: we are not here to sink the Chamber. We are building a better ship and opening the gangway. The accountability campaign documents why the old ship is taking on water. The cooperative is the new ship pulling alongside. People decide for themselves when to step across.
        </Callout>

        <p style={{ maxWidth: "640px", marginBottom: "2rem", fontSize: "0.875rem" }}>
          Membership is open to anyone in the Lansing area who supports the cooperative&apos;s mission.
          No business-type requirement, no minimum revenue, no application filter. In practice, founding
          outreach focuses on the people the Chamber has never served: startups, sole proprietors,
          worker-owned businesses, creative and arts businesses, small trades, small food businesses,
          and people who have been excluded from traditional business networks.
        </p>

        {/* Legal structure */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Legal structure</p>
          <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
            <p style={{ fontWeight: 600, color: "var(--color-limestone)", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Consumer Cooperative — MCL 450.3100 et seq.</p>
            <p style={{ fontSize: "0.8rem", marginBottom: "0.75rem" }}>
              Michigan does not have a standalone cooperative registration track. Incorporate as a nonprofit corporation
              through LARA, electing governance under Chapter 11 (the Consumer Cooperative Act). Chapter 11 requires
              the articles to specify the cooperative&apos;s financing basis.
            </p>
            <p style={{ fontSize: "0.8rem", marginBottom: "0" }}>
              <strong style={{ color: "var(--color-dome-gold)" }}>Phase-in option:</strong> A Michigan LLC with a cooperative
              Operating Agreement can be formed in days and explicitly anticipate conversion to nonprofit. Sacrifices
              statutory member protection for speed — acceptable if the cooperative needs to exist before the
              accountability campaign goes public.
            </p>
          </div>
        </div>

        {/* Governance */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Governance provisions</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { label: "Nonstock", desc: "No shares and no investor control (MCL 450.3131). Membership, not equity." },
              { label: "One member, one vote", desc: "Voting power tied to membership status, not capital contributions (MCL 450.3141)." },
              { label: "Dissolution requires a member vote", desc: "The board cannot dissolve the cooperative without member approval (MCL 450.3145)." },
              { label: "Distributed leadership", desc: "Co-directors or managing committee rather than a single executive, so no single departure can destabilize the organization." },
              { label: "Anti-absorption clause", desc: "Bylaws prohibit merger with any regional economic development entity unless at least two-thirds of membership votes to approve." },
              { label: "Archival deposit agreement", desc: "MSU Special Collections at incorporation — institutional records preserved regardless of what happens to the organization." },
              { label: "Default inclusion", desc: "Membership open to any Lansing-area individual or entity that supports the mission, with no categorical restrictions in the bylaws." },
            ].map(({ label, desc }) => (
              <div key={label} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,241,232,0.07)", borderRadius: "8px" }}>
                <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", fontSize: "0.8rem", minWidth: "180px", flexShrink: 0, margin: 0 }}>{label}</p>
                <p style={{ fontSize: "0.8rem", margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Membership */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Three paths into membership</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
            {[
              { label: "Cash", desc: "$50–$100/year, tiered by business revenue." },
              { label: "Service hours", desc: "8–12 hours/year of skilled work (web, bookkeeping, design, legal, accounting, marketing, photography) contributed to the cooperative and allocated to other members." },
              { label: "Infrastructure access", desc: "Members operating commercial kitchens, co-working spaces, or maker spaces may contribute member hours at the facility." },
            ].map(({ label, desc }) => (
              <div key={label} className="card--accent" style={{ padding: "1rem" }}>
                <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", marginBottom: "0.25rem", fontSize: "0.85rem" }}>{label}</p>
                <p style={{ fontSize: "0.8rem", margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", marginTop: "0.75rem" }}>
            The zero-cash option removes the barrier for startups and sole proprietors. Every service hour contributed is real work delivered to another member — the cooperative generates value from day one without needing outside funding.
          </p>
        </div>

        {/* What members get */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>What members get</p>
          <Callout>
            Keep the money in the community. Before going outside for a service, members look to other members first. The cooperative makes this easy by maintaining a directory and building a culture where spending within the community is the default.
          </Callout>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { service: "Members look to each other first", value: "Real business, not just introductions. Directory plus active introductions." },
              { service: "Health insurance via ICHRA", value: "$6,000–$24,000/year savings per small employer. Works for businesses with even one employee." },
              { service: "Shared retirement plans (Pooled Employer Plan)", value: "30–50% lower admin costs than setting up a plan alone, under the SECURE Act." },
              { service: "Workers' compensation group", value: "10–25% savings at 20+ employer members (MCL 418.611)." },
              { service: "Shared technology", value: "Group software subscriptions and self-hosted infrastructure." },
              { service: "Basic needs connections", value: "Healthcare navigation, childcare referrals, food business support, commercial kitchen access, broadband advocacy." },
              { service: "Online member directory", value: "Structured-data markup for search engine visibility for member businesses." },
              { service: "Advocacy on local issues", value: "Representation members actually voted on — not positions set by a board without member input." },
              { service: "Community events", value: "Quarterly markets, skill-shares, showcases, and cultural programming co-hosted with member businesses." },
            ].map(({ service, value }) => (
              <div key={service} style={{ display: "flex", gap: "1rem", padding: "0.65rem 1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,241,232,0.07)", borderRadius: "8px", alignItems: "flex-start" }}>
                <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.8rem", minWidth: "220px", flexShrink: 0, margin: 0 }}>{service}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Growth targets */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>Growth targets</p>
          <div style={{ display: "flex", gap: "0.3rem", overflowX: "auto" }}>
            {[
              { phase: "Formation", size: "20–40", focus: "Founding cohort, incorporation, bylaws, health insurance setup, first community events, relationship with Lansing cooperative ecosystem." },
              { phase: "Operations", size: "100–150", focus: "Local institutions joining the circle, brand development, retirement plans." },
              { phase: "Regional", size: "300–500", focus: "LCC and MSU joining the circle, leadership succession planning." },
              { phase: "Maturity", size: "1,000+", focus: "Full member services, recognized voice for Lansing small business, embedded in the broader cooperative ecosystem." },
            ].map((p, i, arr) => (
              <div key={p.phase} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ flex: 1, border: "1px solid rgba(244,241,232,0.1)", borderRadius: "6px", padding: "0.875rem", minWidth: "130px" }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", margin: 0 }}>{p.phase}</p>
                  <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-dome-gold)", margin: "0.2rem 0 0" }}>{p.size}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", margin: "0.3rem 0 0" }}>{p.focus}</p>
                </div>
                {i < arr.length - 1 && <span style={{ color: "rgba(244,241,232,0.2)", padding: "0 0.2rem", flexShrink: 0 }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Coordination */}
      <Section eyebrow="Coordination" heading="The cooperative must exist before the campaign goes public">
        <p style={{ maxWidth: "640px", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          A founding cohort and articles of incorporation are sufficient. Full operations are not required.
        </p>
        <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(244,241,232,0.1)" }}>
                {["Milestone", "Track A (Accountability)", "Track B (Cooperative)"].map(h => (
                  <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Complaints filed", "Must happen first", "—"],
                ["Brief published", "Cooperative must already exist", "Founding cohort assembled"],
                ["First defector letter", "Needs somewhere for defectors to go", "Cooperative has announced publicly"],
                ["Press coverage", "Both the scandal and the alternative are the story", "—"],
                ["Nonprofit member outreach", "IRS complaint must be acknowledged", "—"],
                ["LCC/MSU join the circle", "—", "100+ members, 1+ year track record"],
              ].map(([milestone, a, b]) => (
                <tr key={milestone} style={{ borderBottom: "1px solid rgba(244,241,232,0.05)" }}>
                  <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.8rem" }}>{milestone}</td>
                  <td style={{ padding: "0.5rem 0.75rem", fontSize: "0.78rem", color: a === "—" ? "rgba(154,176,200,0.3)" : "var(--color-steel-muted)" }}>{a}</td>
                  <td style={{ padding: "0.5rem 0.75rem", fontSize: "0.78rem", color: b === "—" ? "rgba(154,176,200,0.3)" : "var(--color-teal-accent)" }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Open research */}
      <Section eyebrow="Open research" heading="What still needs to be done">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { action: "Donor mapping by date and location", desc: "Cross-reference LRC-PAC donor records against council, planning commission, and township agendas during the same periods. Confirms or rules out correlation between donor geography and decisions affecting donors' home areas." },
            { action: "Legal review of complaint drafts", desc: "Attorney reviews all seven filings before submission." },
            { action: "Cooperative counsel retention", desc: "Michigan lawyer experienced in the Consumer Cooperative Act for incorporation, bylaws, and tax structuring. Leads: Jason Wiener P.C., Sustainable Economies Law Center, Michigan State Bar cooperative referral." },
            { action: "Founding cohort recruitment", desc: "Identify 20–40 grassroots businesses for the founding cohort." },
            { action: "CADL engagement", desc: "Meet with Capital Area District Library director and board about joining the cooperative's local circle so the library thinks of members first for printing, catering, tech support, or event services." },
            { action: "Lansing faith community outreach", desc: "Conversations with 10–20 churches, mosques, and other institutions about joining the circle." },
            { action: "The Soft Edge contract determination", desc: "Identify who contracted with The Soft Edge Inc. (McLean, VA) for the template-letter campaign. Check PAC and Chamber expenditure records for payments to 'Soft Edge' or 'Congress Plus'." },
          ].map(({ action, desc }) => (
            <div key={action} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,241,232,0.07)", borderRadius: "8px" }}>
              <span style={{ color: "rgba(154,176,200,0.3)", flexShrink: 0, marginTop: "0.1rem" }}>○</span>
              <div>
                <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.8rem", marginBottom: "0.15rem" }}>{action}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer nav */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "1rem", borderTop: "1px solid rgba(244,241,232,0.08)" }}>
        <Link href="/governance/issues/lansing-chamber-pac" className="btn btn--secondary btn--sm">Full Chamber case study →</Link>
        <Link href="/governance/issues" className="btn btn--ghost btn--sm">All board cases →</Link>
        <Link href="/governance" className="btn btn--ghost btn--sm">Governance →</Link>
      </div>

      <p style={{ fontSize: "0.72rem", color: "rgba(154,176,200,0.5)", marginTop: "1.5rem", maxWidth: "580px" }}>
        All findings sourced from public records: Michigan campaign finance filings (MiTN Committee 000516),
        IRS Form 990 returns, Michigan LARA business entity records, and county property records.
        Every claim is independently verifiable.
      </p>
    </div>
  );
}
