import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Participatory Budgeting in Lansing — What the City Does vs. What Real PB Is",
  description: "Lansing's 'Participatory Budget Nights' are public hearings with better facilitation — not participatory budgeting. Here's the difference, and what a real PB pilot would require.",
  alternates: { canonical: "/governance/policy/participatory-budgeting" },
  openGraph: { title: "Participatory Budgeting in Lansing | lansing.love", url: "https://lansing.love/governance/policy/participatory-budgeting" },
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

export default function PBPage() {
  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      {/* Breadcrumb */}
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Policy
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Participatory Budgeting
      </p>

      {/* Header */}
      <section style={{ marginBottom: "3rem" }}>
        <span className="eyebrow">Policy Analysis</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
          Lansing does not have participatory budgeting
        </h1>
        <p style={{ fontSize: "0.95rem", maxWidth: "640px", color: "var(--color-steel-muted)" }}>
          What the city calls &ldquo;Participatory Budget Nights&rdquo; is a public hearing with better facilitation.
          That&apos;s worth something. It isn&apos;t the same thing, and the difference matters for what we&apos;re building toward.
        </p>
      </section>

      {/* What Lansing does */}
      <Section eyebrow="What Lansing does" heading="Budget Nights — what actually happens">
        <p style={{ maxWidth: "640px", marginBottom: "1.25rem" }}>
          Mayor Schor&apos;s office created &ldquo;Participatory Budget Nights&rdquo; to foster communication between government and residents.
          The format: community members attend an evening session, the Finance Director explains the city budget,
          and residents share feedback on priorities for the coming year. The mayor and department heads are present. Residents can speak.
        </p>
        <p style={{ maxWidth: "640px", marginBottom: "1.25rem" }}>
          One genuine outcome: Lansing switched to <strong>program-based budgeting</strong> — distributing spending by functional area
          rather than by department — because it better aligned with how residents talk about their needs. That&apos;s a structural
          change that came from listening. It&apos;s real, and it matters.
        </p>
        <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "3px solid rgba(232,200,74,0.5)", maxWidth: "640px" }}>
          <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", fontSize: "0.85rem", marginBottom: "0.35rem" }}>What it is not</p>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.35rem", margin: 0 }}>
            {[
              "Residents don't vote on specific allocations",
              "There are no budget delegates who develop proposals",
              "No binding decision-making power is transferred to the community",
              "Ward or neighborhood-level budget authority doesn't exist",
            ].map(item => <li key={item} style={{ fontSize: "0.82rem" }}>{item}</li>)}
          </ul>
        </div>
      </Section>

      {/* The tell */}
      <Section eyebrow="The tell" heading="Kelsea Hector proposed it as something new">
        <div style={{ maxWidth: "640px" }}>
          <p>
            In the 2025 mayoral race, challenger Kelsea Hector explicitly proposed Lansing&apos;s <em>first</em> participatory
            budgeting program as a campaign platform.
          </p>
          <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "3px solid var(--color-teal-accent)" }}>
            <p style={{ margin: 0, fontStyle: "italic", fontSize: "0.875rem", color: "var(--color-limestone)" }}>
              If the current format were real participatory budgeting, proposing &ldquo;Lansing&apos;s first PB program&rdquo;
              wouldn&apos;t make sense as a campaign proposal. The fact that it did is the clearest signal that what exists now
              is something different.
            </p>
          </div>
          <p style={{ marginTop: "1rem" }}>
            Schor won re-election, so the current format remains. The proposal didn&apos;t go anywhere, but it confirmed
            that people who follow Lansing government closely understand the current process as something other than real PB.
          </p>
        </div>
      </Section>

      {/* What real PB looks like */}
      <Section eyebrow="What real PB looks like" heading="The process Lansing's version skips">
        <p style={{ maxWidth: "640px", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
          Real participatory budgeting — Porto Alegre (1989), Cambridge MA, NYC district model — runs a multi-stage cycle:
        </p>
        <div style={{ display: "flex", gap: "0.3rem", overflowX: "auto", marginBottom: "1.25rem" }}>
          {[
            { step: "1", label: "Idea submission", desc: "Community members submit budget ideas for their district or ward" },
            { step: "2", label: "Delegate development", desc: "Elected budget delegates develop ideas into concrete proposals" },
            { step: "3", label: "Community vote", desc: "All eligible residents vote on proposals with a real dollar amount attached" },
            { step: "4", label: "Binding implementation", desc: "Winning proposals are funded — the city is obligated to implement them" },
          ].map(({ step, label, desc }, i, arr) => (
            <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ flex: 1, border: "1px solid rgba(244,241,232,0.1)", borderRadius: "6px", padding: "0.875rem", minWidth: "120px" }}>
                <p style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-teal-accent)", margin: 0 }}>{step}</p>
                <p style={{ fontWeight: 600, fontSize: "0.78rem", color: "var(--color-limestone)", margin: "0.2rem 0 0" }}>{label}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", margin: "0.2rem 0 0" }}>{desc}</p>
              </div>
              {i < arr.length - 1 && <span style={{ color: "rgba(244,241,232,0.2)", padding: "0 0.2rem", flexShrink: 0 }}>→</span>}
            </div>
          ))}
        </div>
        <p style={{ maxWidth: "640px", fontSize: "0.875rem" }}>
          Lansing&apos;s version compresses all of that into &ldquo;show up and tell the mayor what you think.&rdquo;
          That&apos;s closer to a public hearing with better facilitation than to the process described above.
        </p>
      </Section>

      {/* Against the framework */}
      <Section eyebrow="Against the cooperative framework" heading="Five places Lansing's process falls short">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "720px" }}>
          {[
            {
              n: "1",
              label: "No real decision-making authority transferred",
              desc: "The mayor retains full discretion. Community input informs but doesn't bind. In Ostrom's commons governance model, the people affected by rules must have meaningful participation in modifying those rules — not just commenting on them. That's the line Lansing hasn't crossed.",
            },
            {
              n: "2",
              label: "Consultative, not deliberative",
              desc: "Real PB (Porto Alegre, Cambridge, NYC) runs multi-month cycles with delegate-driven proposal development and a community vote. Lansing compresses that into a single evening. Facilitation quality is not the same as structural authority.",
            },
            {
              n: "3",
              label: "No subsidiarity",
              desc: "Decisions don't get made at the neighborhood level first and escalate up. They get made at city hall and residents are invited to comment. That's the opposite of the subsidiarity principle — power flowing down to where decisions affect people, not up to where it's most concentrated.",
            },
            {
              n: "4",
              label: "No cooperative ownership dimension",
              desc: "PB in its strongest forms (Porto Alegre's original model, some Latin American adaptations) links budget decisions to community development priorities. Lansing's version is entirely municipal — it doesn't touch the cooperative economy or community wealth-building at all.",
            },
            {
              n: "5",
              label: "Ward structure is underused",
              desc: "The four wards exist, and some boards are ward-structured, but Lansing doesn't have ward-level PB. Everything flows up to the mayor's budget. The infrastructure for neighborhood-level decision-making exists — the 59 registered neighborhood organizations, the ward structure — but budget authority doesn't sit there.",
            },
          ].map(({ n, label, desc }) => (
            <div key={n} className="card" style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#c0392b", margin: 0, minWidth: "18px" }}>#{n}</p>
              <div>
                <p style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem", marginBottom: "0.3rem" }}>{label}</p>
                <p style={{ fontSize: "0.8rem", margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Where there is alignment */}
      <Section eyebrow="Where there is alignment" heading="What Lansing's process has actually produced">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "640px" }}>
          <div className="card" style={{ padding: "1.25rem", borderLeft: "3px solid var(--color-teal-accent)" }}>
            <p style={{ fontWeight: 600, color: "var(--color-limestone)", marginBottom: "0.35rem", fontSize: "0.875rem" }}>Program-based budgeting</p>
            <p style={{ fontSize: "0.8rem", margin: 0 }}>
              The shift from department-based to program-based budgeting as a direct result of community feedback is genuinely meaningful —
              it&apos;s a structural change that came from listening. That&apos;s a real win, and it shows the process can produce real outcomes
              even if it isn&apos;t full PB.
            </p>
          </div>
          <div className="card" style={{ padding: "1.25rem", borderLeft: "3px solid rgba(244,241,232,0.2)" }}>
            <p style={{ fontWeight: 600, color: "var(--color-limestone)", marginBottom: "0.35rem", fontSize: "0.875rem" }}>Neighborhood Grants program</p>
            <p style={{ fontSize: "0.8rem", margin: 0 }}>
              The city runs a separate Neighborhood Grants program — small-dollar grants to registered neighborhood organizations for
              community improvement projects. That&apos;s a grant program, not participatory governance, but it does route public money
              through the{" "}
              <Link href="/neighborhoods" style={{ color: "var(--color-dome-gold)" }}>59 registered neighborhood organizations</Link>
              {" "}— which is at least a thin version of subsidiarity. The orgs decide what to do with the money within their area.
            </p>
          </div>
        </div>
      </Section>

      {/* What real PB pilot requires */}
      <Section eyebrow="What a real pilot would require" heading="Grand Rapids precedent: no charter change needed">
        <p style={{ maxWidth: "640px", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
          Grand Rapids launched a $2 million participatory budgeting pilot in 2022 by ordinary council ordinance — no charter change
          required. That&apos;s the precedent that makes this an ordinance-track reform in Lansing, not a charter amendment.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "640px" }}>
          {[
            "A designated budget envelope — the dollar amount residents will actually decide, by ward or citywide",
            "An idea submission process open to all residents, not just meeting attendees",
            "Budget delegates — elected or randomly selected — who develop ideas into fundable proposals",
            "A public vote with a binding result the council commits to implementing",
            "Ward-level structure so south and west side residents control decisions affecting south and west side neighborhoods",
          ].map(item => (
            <div key={item} style={{ display: "flex", gap: "0.75rem", padding: "0.6rem 0.875rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,241,232,0.07)", borderRadius: "8px" }}>
              <span style={{ color: "var(--color-teal-accent)", flexShrink: 0 }}>○</span>
              <span style={{ fontSize: "0.82rem" }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ maxWidth: "640px", marginTop: "1.25rem", fontSize: "0.875rem", color: "var(--color-steel-muted)" }}>
          None of this requires replacing what the city already does. Budget Nights can continue as community engagement.
          A PB pilot would add a parallel track where the community engagement actually produces binding decisions.
        </p>
      </Section>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "1rem", borderTop: "1px solid rgba(244,241,232,0.08)" }}>
        <Link href="/governance/roadmap" className="btn btn--secondary btn--sm">See the roadmap →</Link>
        <Link href="/governance" className="btn btn--ghost btn--sm">Governance overview →</Link>
        <Link href="/neighborhoods" className="btn btn--ghost btn--sm">Neighborhood organizations →</Link>
      </div>
    </div>
  );
}
