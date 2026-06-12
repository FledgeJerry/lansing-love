import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lansing Board of Ethics: 4 Complaints, 0 Opinions",
  description: "Four residents filed documented conflict-of-interest complaints against Council Member Jeremy Garza. The Board of Ethics declined to issue any opinion — by voice vote, without a roll call — after the city attorney narrowed the legal standard.",
  alternates: { canonical: "/governance/issues/board-of-ethics" },
  openGraph: { title: "Board of Ethics: 4 Complaints, 0 Opinions | lansing.love", description: "Four conflict-of-interest complaints. Zero opinions issued. City attorney narrowed the legal test. The Board chose not to establish precedent.", url: "https://lansing.love/governance/issues/board-of-ethics" },
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-limestone)", lineHeight: 1, margin: 0 }}>{value}</p>
      <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.3rem", marginBottom: 0 }}>{label}</p>
    </div>
  );
}

export default function BoardOfEthicsPage() {
  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        <Link href="/governance/issues" style={{ color: "var(--color-steel-muted)" }}>Issues</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Lansing Board of Ethics
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Case Study · Ethics Oversight</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
          4 Complaints. 0 Opinions.
        </h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>April 2026</span>
          <span className="badge badge--muted">Lansing Board of Ethics</span>
          <span className="badge badge--muted">Jeremy Garza conflict</span>
        </div>
      </section>

      <div style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: "12px", marginBottom: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 0 }}>
        <Stat value="4" label="Complaints filed" />
        <Stat value="0" label="Opinions issued" />
        <Stat value="1" label="Voice vote taken" />
        <Stat value="0" label="Roll call recorded" />
        <Stat value="$126,742" label="Garza annual salary (Pipe Trades)" />
        <Stat value="0" label="Precedent established" />
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <p style={{ fontSize: "1rem", lineHeight: 1.8, maxWidth: "680px", borderLeft: "3px solid rgba(192,57,43,0.4)", paddingLeft: "1.25rem" }}>
          The Lansing Board of Ethics exists to provide guidance on conflicts of interest and ethical conduct by city officials. In April 2026, four residents filed complaints alleging that Council Member Jeremy Garza&apos;s $126,742 annual salary from the Michigan Pipe Trades Association — while voting on union construction work as a council member — created a disqualifying financial conflict. The Board declined to issue any opinion, by voice vote, without recording a roll call, after the city attorney narrowed the applicable legal standard. No precedent was established for future similar situations.
        </p>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">The Garza conflict</span>
        <h2 style={{ marginBottom: "1.25rem" }}>What was alleged</h2>
        <div style={{ maxWidth: "680px" }}>
          <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
            <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>The conflict</p>
            <p style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>Council Member Jeremy Garza simultaneously holds:</p>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <li style={{ fontSize: "0.85rem" }}>Vice President, UA Local 333 (Plumbers and Pipefitters)</li>
              <li style={{ fontSize: "0.85rem" }}>$126,742 annual salary from Michigan Pipe Trades Association</li>
              <li style={{ fontSize: "0.85rem" }}>Voting member of the City Council on construction contracts and development approvals involving union labor</li>
              <li style={{ fontSize: "0.85rem" }}>Chair, Committee on Development and Planning — which controls agenda for zoning and development votes</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
            <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem", marginBottom: "0.4rem" }}>The charter standard</p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}>
              Lansing&apos;s City Charter prohibits council members from voting when they have &ldquo;any income or benefit, directly or indirectly&rdquo; from the matter at hand. Requesters argued Garza&apos;s Pipe Trades salary and union leadership role creates exactly this interest in votes on union construction work.
            </p>
          </div>
          <div className="card" style={{ padding: "1.25rem", borderLeft: "3px solid rgba(192,57,43,0.4)" }}>
            <p style={{ fontWeight: 600, color: "#c0392b", fontSize: "0.9rem", marginBottom: "0.4rem" }}>The city attorney&apos;s rewrite</p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}>
              City Attorney Greg Venker redefined the conflict test from the Charter&apos;s &ldquo;any income or benefit, directly or indirectly&rdquo; to a narrower requirement of a &ldquo;direct contractual relationship.&rdquo; The Board relied on this narrowed standard to decline acting — without explaining why the charter language was being read more narrowly than written.
            </p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">The Board&apos;s response</span>
        <h2 style={{ marginBottom: "1.25rem" }}>How they declined</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "640px" }}>
          {[
            { step: "April 14, 2026", desc: "Board meets. Motion stated the Board would \"not provide an opinion at this time, as the matter is no longer ripe.\" Ripeness was not part of the original filing — the Board introduced this framing." },
            { step: "Voice vote taken", desc: "Approved by voice vote. No roll call recorded. Individual board members&apos; positions are not part of the public record of the decision." },
            { step: "Deep Green cited as moot", desc: "The Board cited the withdrawal of the Deep Green data center project (which involved union labor) as mooting the complaint — declining to address requesters&apos; broader concern about Garza&apos;s ongoing role in future construction-related votes." },
            { step: "No precedent set", desc: "The Board explicitly declined to establish guidance on conflict standards for future similar situations involving council members with financial ties to industries they regulate." },
          ].map(({ step, desc }) => (
            <div key={step} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0.75rem", alignItems: "start" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-dome-gold)", margin: 0, paddingTop: "0.1rem" }}>{step}</p>
              <p style={{ fontSize: "0.85rem", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Why it matters</span>
        <h2 style={{ marginBottom: "1rem" }}>The structural problem</h2>
        <div style={{ maxWidth: "640px" }}>
          <p>An ethics body that declines to rule — by voice vote, without a roll call, using a legal standard narrower than the charter text — is not providing oversight. It is providing cover.</p>
          <p>
            Garza&apos;s situation is not unique in Lansing. Council members routinely vote on matters involving their employers, donors, and affiliated organizations. The LRC-PAC funded 6 of 8 council members who vote on Chamber-preferred development projects. The Board of Ethics&apos; refusal to establish conflict standards for financial-interest situations leaves every future complainant with no precedent to cite.
          </p>
          <p>
            The practical effect: the Charter&apos;s conflict-of-interest provisions are unenforceable as long as the ethics oversight body declines to define when they apply.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Recommendations</span>
        <h2 style={{ marginBottom: "1rem" }}>What functioning ethics oversight looks like</h2>
        <div style={{ maxWidth: "640px" }}>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
            {[
              "Require roll call votes on all Board of Ethics decisions — voice votes on conflict-of-interest rulings are incompatible with public accountability",
              "Adopt a written conflict-of-interest policy that operationalizes the Charter standard — define \"income or benefit, directly or indirectly\" with specific examples",
              "Require mandatory recusal and public recusal statements when council members vote on matters involving their employers or salary sources",
              "Establish an independent ethics officer (not the city attorney) to advise the Board — the city attorney serves the mayor, creating a structural conflict in narrowing conflict standards",
              "Issue advisory opinions proactively on standing conflict situations — waiting for individual complaints lets ongoing conflicts continue without resolution",
            ].map(r => <li key={r} style={{ fontSize: "0.85rem" }}>{r}</li>)}
          </ul>
        </div>
      </section>

      <div style={{ borderTop: "1px solid rgba(244,241,232,0.08)", paddingTop: "1.25rem", marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Sources</p>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {[
            "Rhinoceros Media. \"Lansing Board of Ethics Declines to Issue Opinion on Council Member's Potential Conflicts.\"",
            "Lansing City Charter — conflict-of-interest provisions.",
            "Board of Ethics meeting minutes, April 14, 2026.",
            "Michigan Pipe Trades Association — public compensation records.",
          ].map(s => <li key={s} style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{s}</li>)}
        </ul>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/governance/issues" className="btn btn--ghost btn--sm">← All issues</Link>
        <Link href="/governance/issues/lansing-chamber-pac" className="btn btn--ghost btn--sm">Related: Chamber PAC →</Link>
        <Link href="/predictions" className="btn btn--secondary btn--sm">Track Garza&apos;s votes →</Link>
      </div>
    </div>
  );
}
