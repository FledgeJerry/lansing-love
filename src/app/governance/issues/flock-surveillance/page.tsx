import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Flock Surveillance: 20 Cameras, No Vote, No Policy",
  description: "Lansing deployed 20 Flock Safety automatic license plate reader cameras in September 2025 — 7 months before any public discussion, no Board of Police Commissioners review, no written policy, no civilian oversight. Documented oversight failure.",
  alternates: { canonical: "/governance/issues/flock-surveillance" },
  openGraph: { title: "Flock Surveillance: 20 Cameras, No Vote, No Policy | lansing.love", description: "20 cameras deployed 7 months before public discussion. No board review. No written policy. No civilian oversight.", url: "https://lansing.love/governance/issues/flock-surveillance" },
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-limestone)", lineHeight: 1, margin: 0 }}>{value}</p>
      <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.3rem", marginBottom: 0 }}>{label}</p>
    </div>
  );
}

export default function FlockPage() {
  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        <Link href="/governance/issues" style={{ color: "var(--color-steel-muted)" }}>Issues</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Flock Surveillance
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Case Study · Surveillance Oversight</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
          20 Cameras, No Vote, No Policy
        </h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>April–June 2026</span>
          <span className="badge badge--muted">Board of Police Commissioners</span>
          <span className="badge badge--muted">Flock Safety</span>
        </div>
      </section>

      <div style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: "12px", marginBottom: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 0 }}>
        <Stat value="20" label="Cameras deployed" />
        <Stat value="7 mo." label="Before public discussion" />
        <Stat value="0" label="Board votes recorded" />
        <Stat value="0" label="Written policies" />
        <Stat value="0" label="Civilian oversight bodies" />
        <Stat value="20B+" label="Vehicle scans/month (national)" />
        <Stat value="50+" label="Agencies surveilling protests" />
        <Stat value="30+" label="Localities cancelled Flock (2025)" />
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <p style={{ fontSize: "1rem", lineHeight: 1.8, maxWidth: "680px", borderLeft: "3px solid rgba(192,57,43,0.4)", paddingLeft: "1.25rem" }}>
          In September 2025, Lansing deployed approximately 20 Flock Safety automatic license plate reader cameras citywide. The first public discussion of the program occurred April 23, 2026 — seven months later. No vote was recorded in the Board of Police Commissioners at any 2025–2026 meeting. No written policy existed at the time of that first public discussion. No civilian oversight mechanism has been documented.
        </p>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">The deployment gap</span>
        <h2 style={{ marginBottom: "1.25rem" }}>Who approved it?</h2>
        <p style={{ maxWidth: "640px", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
          Chief Robert Backus confirmed the program at the April 23 committee hearing. His account of safeguards was verbal and contained contradictions. The approval chain before that hearing has no documented public record.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem", maxWidth: "720px" }}>
          {[
            { name: "Mayor Andy Schor", finding: "No executive directive on record. No public statement about the program prior to April 2026." },
            { name: "Chief Robert Backus", finding: "Appointed July 2024. Confirmed deployment verbally at April 2026 hearing. Described safeguards with no written documentation to back them." },
            { name: "Board of Police Commissioners", finding: "No documented review at any 2025–2026 meeting. First public discussion: April 23, 2026 committee hearing — no vote taken." },
            { name: "City Council", finding: "No vote located in public records prior to April 2026. Deployment came to public attention only through North Carolina police records release." },
          ].map(({ name, finding }) => (
            <div key={name} className="card" style={{ padding: "1rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.85rem", marginBottom: "0.3rem" }}>{name}</p>
              <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", margin: 0 }}>{finding}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">What the chief said</span>
        <h2 style={{ marginBottom: "1rem" }}>Six documented oversight gaps</h2>
        <div style={{ maxWidth: "680px" }}>
          <p style={{ fontSize: "0.875rem", marginBottom: "1.25rem" }}>Chief Backus&apos;s own statements at the April 23 committee hearing confirmed the following gaps:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              "No civilian oversight of the program",
              "No review by the Board of Police Commissioners",
              "No scheduled review of who has searched the system — audits happen \"regularly but not scheduled\"",
              "No alerts when the audit log is accessed",
              "No discipline cases recorded, despite theoretical policy against misuse",
              "No FOIA guidance established — City Attorney stated the question \"has not come up\"",
            ].map((gap, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#c0392b", minWidth: "18px", marginTop: "0.15rem" }}>{i + 1}</span>
                <p style={{ fontSize: "0.85rem", margin: 0 }}>{gap}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">National record</span>
        <h2 style={{ marginBottom: "1rem" }}>Documented misuse across Flock&apos;s network</h2>
        <p style={{ maxWidth: "640px", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
          Flock Safety operates in 49 states and processes 20+ billion vehicle scans per month. Its national network has a documented record of misuse that Lansing&apos;s deployment — with no written policy and no civilian oversight — does nothing to prevent locally.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "680px" }}>
          {[
            { place: "Illinois", desc: "Flock facilitated U.S. Customs and Border Protection access to ALPR data in violation of a 2023 Illinois statute restricting immigration enforcement cooperation." },
            { place: "Washington State", desc: "University of Washington study found at least 10 agencies had back-door access to Flock data without formal authorization." },
            { place: "Kansas", desc: "Police chief conducted 228 Flock searches tracking an ex-partner&apos;s vehicle." },
            { place: "Milwaukee", desc: "Officer ran 124 unauthorized queries on a partner&apos;s license plate." },
            { place: "Texas", desc: "Deputy used the 83,000-camera national network to track a woman who had obtained an abortion. Logged as: \"had an abortion, search for female.\"" },
            { place: "National (EFF)", desc: "Over 50 agencies conducted protest-related surveillance searches. National network documents 4,000+ ICE/immigration-related queries." },
          ].map(({ place, desc }) => (
            <div key={place} className="card" style={{ padding: "1rem 1.25rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.75rem" }}>
              <p style={{ fontWeight: 700, color: "var(--color-dome-gold)", fontSize: "0.82rem", margin: 0, whiteSpace: "nowrap" }}>{place}</p>
              <p style={{ fontSize: "0.8rem", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,241,232,0.08)", borderRadius: "8px", padding: "0.875rem 1.25rem", maxWidth: "640px" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--color-steel-muted)", margin: 0 }}>
            Ferndale, Michigan terminated its Flock program (November 2025) after discovering the national lookup feature was active &ldquo;when it wasn&apos;t supposed to be.&rdquo; At least 30 U.S. localities canceled Flock since early 2025. Bipartisan Michigan House Bills 5492-5493 proposing 14-day data retention limits and quarterly public reporting were still in committee as of April 2026.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Recommendations</span>
        <h2 style={{ marginBottom: "1rem" }}>Minimum requirements for accountable surveillance</h2>
        <div style={{ maxWidth: "640px" }}>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
            {[
              "Require a City Council vote before deploying any new surveillance technology — retroactively ratify or terminate the existing Flock deployment",
              "Adopt a written Surveillance Technology Use Policy with data retention limits (aligned with HB 5492-5493), prohibited uses, and quarterly public audit reports",
              "Establish civilian oversight with subpoena power — Board of Police Commissioners must review all surveillance programs on a documented schedule",
              "Prohibit sharing Lansing Flock data with federal immigration enforcement agencies without a warrant",
              "Publish searchable audit logs showing who queried Lansing cameras, when, and for what stated purpose",
            ].map(r => <li key={r} style={{ fontSize: "0.85rem" }}>{r}</li>)}
          </ul>
        </div>
      </section>

      <div style={{ borderTop: "1px solid rgba(244,241,232,0.08)", paddingTop: "1.25rem", marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Sources</p>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {[
            "Rhinoceros Media. \"Who Owns and Funds the Cameras Watching Lansing.\"",
            "Rhinoceros Media. \"Lansing's First Flock Briefing.\"",
            "Rhinoceros Media. \"What the Evidence and the Record Show About Flock's Cameras.\"",
            "Rhinoceros Media. \"Lansing City Operations Committee, April 23.\"",
            "Electronic Frontier Foundation. ALPR data analysis, 2025.",
            "University of Washington. Flock network access study.",
            "North Carolina police records release (program brought to public attention).",
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
