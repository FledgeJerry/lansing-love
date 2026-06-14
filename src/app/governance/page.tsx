import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Governing Like a Cooperative",
  description: "Lansing runs from one center — the mayor's office. Polycentric governance is the alternative: decisions close to the people who live with them. Four reforms, all doable. The cooperative network is already proving the model.",
  alternates: { canonical: "/governance" },
  openGraph: { title: "Governing Like a Cooperative | lansing.love", description: "Lansing's governance problem and the polycentric alternative. Four reforms, all doable.", url: "https://lansing.love/governance" },
};

// ─── SVG helpers ──────────────────────────────────────────────────────────────

function pent(cx: number, cy: number, r: number): [number, number][] {
  return Array.from({ length: 5 }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
}

function seg(x1: number, y1: number, x2: number, y2: number, r1: number, r2: number) {
  const dx = x2 - x1, dy = y2 - y1;
  const d = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / d, uy = dy / d;
  return { x1: x1 + ux * r1, y1: y1 + uy * r1, x2: x2 - ux * r2, y2: y2 - uy * r2 };
}

// ─── Diagram 1: Monocentric vs. Polycentric ───────────────────────────────────

function MonoPolyDiagram() {
  const MC: [number, number] = [200, 160];
  const PC: [number, number] = [580, 160];
  const mNodes = pent(MC[0], MC[1], 90);
  const pNodes = pent(PC[0], PC[1], 95);

  const mLabels = ["Boards", "Commissions", "Departments", "BWL", "Contracts"];
  const pLabels: { lines: string[]; anchor: "middle" | "start" | "end"; dx: number; dy: number }[] = [
    { lines: ["Neighborhood", "councils"],  anchor: "middle", dx: 0,   dy: -28 },
    { lines: ["Expert", "boards"],          anchor: "start",  dx: 26,  dy: 0   },
    { lines: ["Citizens'", "assembly"],     anchor: "middle", dx: 0,   dy: 28  },
    { lines: ["Part.", "budget"],           anchor: "middle", dx: 0,   dy: 28  },
    { lines: ["Cooperative", "network"],    anchor: "end",    dx: -26, dy: 0   },
  ];

  const CR = 30; const NR = 22; const PCR = 22; const PNR = 19;
  const fill = "#0f1e2e";
  const line = "rgba(244,241,232,0.18)";
  const nodeStroke = "rgba(244,241,232,0.3)";
  const centerStroke = "rgba(244,241,232,0.6)";
  const txt = "rgba(244,241,232,0.75)";
  const dim = "rgba(244,241,232,0.35)";
  const arr = "rgba(244,241,232,0.4)";

  return (
    <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
      <svg viewBox="0 0 780 315" style={{ width: "100%", minWidth: "560px", maxHeight: "315px", display: "block" }}>
        <defs>
          <marker id="m-out" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 0 1 L 7 4 L 0 7 z" fill={arr} />
          </marker>
          <marker id="m-fwd" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 0 1 L 7 4 L 0 7 z" fill={arr} />
          </marker>
          <marker id="m-rev" viewBox="0 0 8 8" refX="1" refY="4" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 1 L 7 4 L 0 7 z" fill={arr} />
          </marker>
        </defs>

        {/* Labels */}
        <text x={MC[0]} y="16" textAnchor="middle" fontSize="9" fill={dim} letterSpacing="0.1em">MONOCENTRIC — TODAY</text>
        <text x={PC[0]} y="16" textAnchor="middle" fontSize="9" fill={dim} letterSpacing="0.1em">POLYCENTRIC — THE GOAL</text>

        {/* Divider */}
        <line x1="390" y1="8" x2="390" y2="278" stroke="rgba(244,241,232,0.07)" strokeDasharray="3,5" />

        {/* Monocentric spokes */}
        {mNodes.map(([nx, ny], i) => {
          const s = seg(MC[0], MC[1], nx, ny, CR, NR);
          return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={line} strokeWidth="1.5" markerEnd="url(#m-out)" />;
        })}
        <circle cx={MC[0]} cy={MC[1]} r={CR} fill={fill} stroke={centerStroke} strokeWidth="1.5" />
        <text x={MC[0]} y={MC[1] - 5} textAnchor="middle" fontSize="8.5" fill={txt} fontWeight="600">Mayor&apos;s</text>
        <text x={MC[0]} y={MC[1] + 7} textAnchor="middle" fontSize="8.5" fill={txt} fontWeight="600">Office</text>
        {mNodes.map(([nx, ny], i) => (
          <g key={i}>
            <circle cx={nx} cy={ny} r={NR} fill={fill} stroke={nodeStroke} strokeWidth="1" />
            <text x={nx} y={ny + 4} textAnchor="middle" fontSize="8" fill={txt}>{mLabels[i]}</text>
          </g>
        ))}
        <text x={MC[0]} y="302" textAnchor="middle" fontSize="9.5" fill={dim} fontStyle="italic">One center decides. Everything else reports up.</text>

        {/* Polycentric bidirectional lines */}
        {pNodes.map(([nx, ny], i) => {
          const s = seg(PC[0], PC[1], nx, ny, PCR, PNR);
          return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={line} strokeWidth="1.5" markerEnd="url(#m-fwd)" markerStart="url(#m-rev)" />;
        })}
        <circle cx={PC[0]} cy={PC[1]} r={PCR} fill={fill} stroke={nodeStroke} strokeWidth="1" />
        <text x={PC[0]} y={PC[1] - 4} textAnchor="middle" fontSize="7.5" fill={dim}>City</text>
        <text x={PC[0]} y={PC[1] + 6} textAnchor="middle" fontSize="7.5" fill={dim}>gov&apos;t</text>
        {pNodes.map(([nx, ny], i) => {
          const { lines, anchor, dx, dy } = pLabels[i];
          const lx = nx + dx, ly = ny + dy;
          return (
            <g key={i}>
              <circle cx={nx} cy={ny} r={PNR} fill={fill} stroke={nodeStroke} strokeWidth="1" />
              {lines.map((line, j) => (
                <text key={j} x={lx} y={ly + (j - (lines.length - 1) / 2) * 11} textAnchor={anchor} fontSize="8.5" fill={txt}>
                  {line}
                </text>
              ))}
            </g>
          );
        })}
        <text x={PC[0]} y="302" textAnchor="middle" fontSize="9.5" fill={dim} fontStyle="italic">Many centers. Decisions sit close to who lives with them.</text>
      </svg>
    </div>
  );
}

// ─── Diagram 2: Two Traditions ────────────────────────────────────────────────

function TwoTraditionsDiagram() {
  const left = ["Open membership", "Democratic member control", "Economic participation", "Autonomy", "Education", "Cooperation among cooperatives", "Concern for community"];
  const right = ["Clear boundaries", "Those affected decide", "Rules fit local conditions", "Collective monitoring", "Graduated sanctions", "Conflict resolution", "Right to organize", "Nested units"];

  return (
    <div style={{ border: "1px solid rgba(244,241,232,0.08)", borderRadius: "12px", padding: "1.5rem", margin: "1.5rem 0", background: "rgba(255,255,255,0.02)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.25rem" }}>
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>
            Cooperative Movement (1844)
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {left.map((item) => (
              <li key={item} style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", gap: "0.4rem" }}>
                <span style={{ color: "rgba(244,241,232,0.2)" }}>—</span>{item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-steel-muted)", marginBottom: "0.75rem" }}>
            Bloomington School / Ostrom (1961–1990)
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {right.map((item) => (
              <li key={item} style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", gap: "0.4rem" }}>
                <span style={{ color: "rgba(244,241,232,0.2)" }}>—</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(244,241,232,0.08)", paddingTop: "1rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.7rem", color: "var(--color-steel-muted)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Both traditions converge on the same principle</p>
        <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-limestone)", fontStyle: "italic" }}>
          &ldquo;People govern things better when they own the decision.&rdquo;
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GovernancePage() {
  return (
    <div style={{ maxWidth: "860px", paddingBottom: "5rem" }}>

      {/* Hero */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">Polycentric Governance</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", lineHeight: 1.15, marginBottom: "1rem" }}>
          One city.<br />Run from one center.<br />
          <span style={{ color: "var(--color-steel-muted)" }}>That&apos;s the problem.</span>
        </h1>
        <p style={{ fontSize: "1rem", maxWidth: "640px", lineHeight: 1.75 }}>
          Lansing&apos;s government concentrates decisions in the mayor&apos;s office.
          Every board, every commission, every department head — appointed from one center.
          That&apos;s not a scandal. It&apos;s the charter.
          And it&apos;s where every governance problem in this city grows from.
        </p>
        <MonoPolyDiagram />
      </section>

      <hr className="divider" />

      {/* Section A */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">What it means</span>
        <h2 style={{ marginBottom: "1rem" }}>Many centers, not one</h2>
        <div style={{ maxWidth: "680px" }}>
          <p>&ldquo;Polycentric&rdquo; just means decisions sit close to the people who live with them, not at one address downtown.</p>
          <p>
            It&apos;s not a new idea. The United States already runs much of its government this way — nearly 40,000 special districts for water, fire, and parks, each with its own board; eight regional councils managing ocean fisheries with working fishermen as voting members; 99 funded neighborhood councils in Los Angeles with a formal line into city hall.
          </p>
          <p>The question isn&apos;t whether polycentric governance works. It&apos;s whether Lansing has it. It doesn&apos;t. Not in any meaningful way.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1.75rem" }}>
          {[
            { label: "Responsiveness", desc: "Decisions made close to the people who live with them" },
            { label: "Resilience",     desc: "One unit's failure stays contained — it doesn't take the whole city down" },
            { label: "Legitimacy",     desc: "Built into the structure, not dependent on who's in office" },
            { label: "Local retention", desc: "Value and decision-making power kept in the neighborhoods where they're generated" },
          ].map(({ label, desc }) => (
            <div key={label} className="card--accent" style={{ padding: "1rem 1.25rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-dome-gold)", marginBottom: "0.3rem", fontSize: "0.9rem" }}>{label}</p>
              <p style={{ fontSize: "0.8rem", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Section B */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">Intellectual roots</span>
        <h2 style={{ marginBottom: "1rem" }}>The cooperative movement and Nobel Prize economics landed on the same design</h2>
        <div style={{ maxWidth: "680px" }}>
          <p>
            In 1844, a group of workers in Rochdale, England wrote down a set of rules for running an enterprise together.
            Seven principles: open membership, democratic control, economic participation, autonomy, education, cooperation among cooperatives, concern for community.
          </p>
          <p>
            In 1990, economist Elinor Ostrom published the results of decades studying how ordinary communities successfully govern shared resources — fisheries, groundwater, forests. She won the Nobel Prize in Economics in 2009. Her eight design principles for durable governance: clear boundaries, those affected decide, monitoring, graduated response, the right to organize, nested units.
          </p>
          <p>They never talked to each other. They described nearly the same system.</p>
        </div>
        <TwoTraditionsDiagram />
      </section>

      <hr className="divider" />

      {/* Section C */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">Local record</span>
        <h2 style={{ marginBottom: "0.75rem" }}>What one center tends to produce</h2>
        <p style={{ maxWidth: "640px", marginBottom: "1.75rem" }}>
          This isn&apos;t a theory about what concentrated power might do. It&apos;s a record of what it has done in Lansing.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Dark money",            desc: "Seventeen 501(c)(4) nonprofits operating from a single address, all incorporated by one attorney. A utility moving tens of millions through anonymous nonprofits that fund other nonprofits.", link: null },
            { label: "PAC capture",           desc: "Most council members funded by a small set of PACs that then appear before them on votes.", link: null },
            { label: "Conflicts of interest", desc: "An ethics body that declined to opine on a sitting member's documented conflict. The Housing Commission sold public units to a private firm while accumulating $30M+ in public funds.", link: "/governance/issues/lansing-housing-commission" },
            { label: "Manufactured consent",  desc: "Astroturf campaigns presented as public input at council hearings.", link: null },
            { label: "Appointed non-experts", desc: "Boards that require expertise filled by appointment, not qualification. The Housing Commission board approved a $17.7M sale with no resident vote.", link: "/governance/issues/lansing-housing-commission" },
            { label: "Opacity",               desc: "Hard to see who decided what, and why. FOIA requests blocked with $807.60 fees. Decisions made before public hearings, not during them.", link: "/governance/issues/lansing-housing-commission" },
          ].map(({ label, desc, link }) => (
            <div key={label} className="card" style={{ padding: "1.25rem", borderLeft: "3px solid rgba(192,57,43,0.5)" }}>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", marginBottom: "0.35rem", fontSize: "0.9rem" }}>{label}</p>
              <p style={{ fontSize: "0.8rem", margin: 0, marginBottom: link ? "0.5rem" : 0 }}>{desc}</p>
              {link && <Link href={link} style={{ fontSize: "0.75rem", color: "var(--color-dome-gold)" }}>Case study: LHC →</Link>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1.25rem", background: "rgba(232,200,74,0.05)", border: "1px solid rgba(232,200,74,0.2)", borderRadius: "8px", padding: "1rem 1.25rem", maxWidth: "640px" }}>
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-dome-gold)", marginBottom: "0.25rem" }}>Case study: Lansing Housing Commission</p>
          <p style={{ fontSize: "0.8rem", color: "var(--color-steel-muted)", marginBottom: "0.5rem" }}>
            51 families evicted. $17.7M in public housing sold for $87,600/unit while construction cost $357,000/unit. 85+ children displaced mid-school-year. All seven cooperative principles violated.
          </p>
          <Link href="/governance/issues/lansing-housing-commission" style={{ fontSize: "0.8rem", color: "var(--color-dome-gold)" }}>Read the full analysis →</Link>
        </div>
        <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "1rem", maxWidth: "640px" }}>
          Documented through public reporting by{" "}
          <a href="https://rhinocerosmedia.org" target="_blank" rel="noopener noreferrer">Rhinoceros Media</a>
          {" "}and the city&apos;s own public records.{" "}
          <Link href="/governance/issues" style={{ color: "var(--color-dome-gold)" }}>See all case studies →</Link>
        </p>
        <div style={{ marginTop: "1.25rem" }}>
          <Link href="/governance/alternatives/chamber" className="btn btn--ghost btn--sm">How to build an alternative to a chamber →</Link>
        </div>
      </section>

      <hr className="divider" />

      {/* Section D */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">What changes</span>
        <h2 style={{ marginBottom: "0.75rem" }}>Four reforms. All of them doable.</h2>
        <p style={{ maxWidth: "640px", marginBottom: "1.75rem" }}>
          None of these require a new constitution. Some need only a council ordinance. The deeper ones need a charter vote. All of them have been done in other American cities.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { num: "1", label: "Neighborhood councils with real authority", desc: "A binding say in decisions that affect the neighborhood — not advisory only. Funded. With a formal line to city hall. Los Angeles has 99 of them. Lansing already has 59 registered neighborhood organizations — the infrastructure exists.", link: "/neighborhoods" },
            { num: "2", label: "Participatory budgeting",                   desc: "Residents vote directly on part of the city's spending. Grand Rapids ran a $2 million PB program by ordinary council ordinance — no charter change required.", link: undefined },
            { num: "3", label: "Stakeholder and expert boards",             desc: "The people affected by a decision, and the people who understand it, seated as decision-makers — not just advisors the mayor can ignore.", link: undefined },
            { num: "4", label: "Citizens' assembly (sortition)",            desc: "For capture-prone questions: a panel chosen by lot, like a jury. Can't be campaigned for. Can't be bought. Ireland used one to repeal the Eighth Amendment.", link: undefined },
          ].map(({ num, label, desc, link }) => (
            <div key={num} className="card" style={{ padding: "1.25rem" }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--color-teal-accent)", marginBottom: "0.4rem" }}>{num}</p>
              <p style={{ fontWeight: 600, color: "var(--color-limestone)", marginBottom: "0.4rem", fontSize: "0.9rem" }}>{label}</p>
              <p style={{ fontSize: "0.8rem", margin: 0 }}>{desc}</p>
              {link && <Link href={link} style={{ fontSize: "0.75rem", color: "var(--color-dome-gold)", display: "inline-block", marginTop: "0.5rem" }}>See the directory →</Link>}
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,241,232,0.08)", borderRadius: "8px", padding: "1rem 1.25rem", maxWidth: "640px" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--color-steel-muted)", margin: 0 }}>
            Distributing power doesn&apos;t fix itself. Each of these has a built-in failure mode — capture, low turnout, walling off resources.
            The design builds against those failures.{" "}
            <Link href="/governance/roadmap" style={{ color: "var(--color-dome-gold)" }}>See how on the roadmap →</Link>
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* Section E */}
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">The cooperative network</span>
        <h2 style={{ marginBottom: "1rem" }}>We&apos;re not lobbying for the model. We are the model.</h2>
        <div style={{ maxWidth: "640px" }}>
          <p>
            The Fledge cooperative network isn&apos;t trying to become Lansing&apos;s government. That would undermine the whole point.
          </p>
          <p>
            What cooperatives do is prove it. Every cooperative that runs with one member, one vote, open books, and a standing question — &ldquo;is power staying distributed, or starting to concentrate?&rdquo; — is a working unit of polycentric governance. The city-scale argument is just that pattern, repeated and connected.
          </p>
          <p>
            <strong>[MOVEMENT_NAME]</strong> builds the network. Organizes the community. Backs aligned candidates. Carries the charter changes to the ballot when the political conditions are ready.
          </p>
          <p>
            The reformed city is still the chartered government — it keeps police, taxation, lawmaking, and the enforcement of rights, because only a body accountable to everyone should hold those. What changes is whether it&apos;s run from one center or many.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          <Link href="/governance/roadmap" className="btn btn--secondary btn--sm">Learn about the roadmap →</Link>
          <Link href="/governance/dashboard" className="btn btn--ghost btn--sm">See the predictions dashboard →</Link>
        </div>
      </section>

    </div>
  );
}
