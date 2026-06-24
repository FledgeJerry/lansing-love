"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

const fmt  = (n: number) => "$" + Math.round(Math.abs(n)).toLocaleString();
const fmtS = (n: number) => (n < 0 ? "-$" : "$") + Math.round(Math.abs(n)).toLocaleString();
const fmtPct = (n: number) => n.toFixed(2) + "%";

const SQ_SLIDERS = [
  { id: "er",      label: "Emergency room / hospital",       color: "var(--color-river-blue)", default: 18000, min: 5000,  max: 30000, step: 500,
    tip: "Default $18,000/person/yr — healthcare research average for unhoused high-utilizers. Includes repeated ED visits, inpatient stays, and psychiatric holds. Unhoused individuals use ERs at 3–5× the rate of housed people. Source: LinkedIn/Premier Wireless citing healthcare research." },
  { id: "police",  label: "Police / law enforcement",        color: "var(--color-dome-gold)", default: 6000,  min: 2000,  max: 15000, step: 250,
    tip: "Default $6,000/person/yr — national benchmark. Includes repeated 911 calls, crisis response, transport to jail or hospital, booking, and court time. Some cities report $10,000–$30,000/yr for high-contact individuals." },
  { id: "shelter", label: "Emergency shelter",               color: "var(--color-danger)", default: 12800, min: 4000,  max: 20000, step: 500,
    tip: "Default $12,800/person/yr — NAEH (National Alliance to End Homelessness) 2023 national average nightly shelter cost × average occupancy days. Lansing shelter costs may differ. Emergency shelter is more expensive than a Housing First voucher in most markets." },
  { id: "grants",  label: "Grants / HUD voucher admin",      color: "#854F0B", default: 4000,  min: 1000,  max: 10000, step: 250,
    tip: "Default $4,000/person/yr — administrative cost of managing HUD Continuum of Care grants, voucher processing, compliance reporting, and HMIS data entry. Does not include the voucher subsidy itself." },
  { id: "prop",    label: "Property damage / code enforce.", color: "var(--color-midnight-steel)", default: 1800,  min: 500,   max: 5000,  step: 250,
    tip: "Default $1,800/person/yr — includes NEAT violation notices, administrative hearings, abandoned property cleanup, and graffiti abatement attributable to encampments. Highly variable by city enforcement posture." },
  { id: "neat",    label: "NEAT monitoring / city cleanup",  color: "var(--color-success)", default: 900,   min: 200,   max: 3000,  step: 100,
    tip: "Default $900/person/yr — Lansing's NEAT program generates ~$1M/yr city-wide (City Pulse). Monitoring fee is $165/mo per tagged property. This line captures the per-person share of encampment sweeps, trash removal, and code-enforcement staff time." },
];

const TIERS = [
  {
    name: "Rapid Re-Housing",
    desc: "Short-term rental subsidy (6–24 mo.) + minimal case management. For households that need a bridge, not ongoing support.",
    rent: 6500, sw: 1200, mh: 600, admin: 200,
  },
  {
    name: "Scattered-site PSH",
    desc: "Permanent voucher in private market + regular social worker visits (2–4×/mo). Standard Housing First model.",
    rent: 10000, sw: 3500, mh: 2500, admin: 479,
  },
  {
    name: "ACT / High-intensity PSH",
    desc: "Assertive Community Treatment — daily social worker contact, co-located mental health + substance use services. For the most complex cases.",
    rent: 10000, sw: 10000, mh: 6500, admin: 1500,
  },
];

export default function CostCalculator() {
  const [homeless,   setHomeless]   = useState(232);
  const [households, setHouseholds] = useState(51600);
  const [income,     setIncome]     = useState(54382);

  const [sqCosts, setSqCosts] = useState<Record<string, number>>(
    Object.fromEntries(SQ_SLIDERS.map((s) => [s.id, s.default]))
  );

  const [activeTier, setActiveTier] = useState(0);
  const [hfRent,  setHfRent]  = useState(TIERS[0].rent);
  const [hfSw,    setHfSw]    = useState(TIERS[0].sw);
  const [hfMh,    setHfMh]    = useState(TIERS[0].mh);
  const [hfAdmin, setHfAdmin] = useState(TIERS[0].admin);
  const [hfSave,  setHfSave]  = useState(16282);

  const setSqCost = useCallback((id: string, v: number) => {
    setSqCosts((prev) => ({ ...prev, [id]: v }));
  }, []);

  function selectTier(i: number) {
    setActiveTier(i);
    setHfRent(TIERS[i].rent);
    setHfSw(TIERS[i].sw);
    setHfMh(TIERS[i].mh);
    setHfAdmin(TIERS[i].admin);
  }

  // Status quo calcs
  const sqPerPerson = Object.values(sqCosts).reduce((a, b) => a + b, 0);
  const sqTotal     = sqPerPerson * homeless;
  const sqPerHH     = sqTotal / households;
  const pctIncome   = (sqPerHH / income) * 100;
  const maxSqCost   = Math.max(...Object.values(sqCosts));
  const sqTotalDisplay = sqTotal >= 1e6
    ? "$" + (sqTotal / 1e6).toFixed(1) + "M"
    : fmt(sqTotal);

  // Housing First calcs
  const hfGross  = hfRent + hfSw + hfMh + hfAdmin;
  const hfNet    = hfGross - hfSave;
  const hfPerHH  = (hfNet * homeless) / households;
  const diff     = sqPerHH - hfPerHH;

  // Comparison bars
  const barMax = Math.max(sqPerPerson, hfGross, Math.max(hfNet, 1));
  const sqBarW    = Math.round((sqPerPerson / barMax) * 100);
  const grossBarW = Math.round((hfGross     / barMax) * 100);
  const netBarW   = hfNet > 0 ? Math.max(Math.round((hfNet / barMax) * 100), 2) : 0;

  return (
    <div>
      {/* Sticky summary bar */}
      <div style={{
        position: "sticky", top: "0", zIndex: 10,
        background: "var(--color-deep-navy)",
        margin: "0 -1rem",
        padding: "0.5rem 1rem",
        display: "flex", alignItems: "center", gap: "0", flexWrap: "wrap",
      }}>
        {[
          { label: "Per household", value: fmt(sqPerHH), highlight: true },
          { label: "City-wide", value: sqTotalDisplay },
          { label: "% of income", value: fmtPct(pctIncome) },
          { label: "Per person", value: fmt(sqPerPerson) },
          { label: "Unhoused", value: homeless.toLocaleString() },
          { label: "HF net/hh", value: fmtS(hfPerHH), color: hfPerHH < sqPerHH ? "#6EE7B7" : "#FCA5A5" },
          { label: "HF saves/hh", value: fmt(diff), color: diff >= 0 ? "#6EE7B7" : "#FCA5A5" },
        ].map((item, i, arr) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ padding: "0.35rem 0.875rem" }}>
              <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "rgba(255,255,255,0.5)", display: "block" }}>{item.label}</span>
              <span style={{ fontSize: item.highlight ? "1.3rem" : "0.95rem", fontWeight: 800, fontFamily: item.highlight ? "var(--font-serif)" : "var(--font-sans)", color: item.color ?? "#fff", lineHeight: 1.15 }}>{item.value}</span>
            </div>
            {i < arr.length - 1 && <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      {/* Breadcrumb */}
      <nav style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", margin: "1.5rem 0" }}>
        <Link href="/" style={{ color: "var(--color-text-muted)" }}>lansing.love</Link>
        <span style={{ margin: "0 0.5rem" }}>›</span>
        <span>Unhoused Cost Calculator</span>
      </nav>

      <div style={{ maxWidth: "720px" }}>
        <span className="eyebrow">Housing · Data Tool</span>
        <h1 style={{ marginBottom: "0.5rem" }}>What does homelessness cost a Lansing household?</h1>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "2.5rem" }}>
          An interactive estimate. Adjust the sliders to reflect local data.{" "}
          Source methodology:{" "}
          <a href="https://rhinocerii.github.io/blahrgg/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-teal-accent)" }}>Rhinoceros</a>
          {" "}and{" "}
          <a href="https://lansing-housing.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-teal-accent)" }}>Lansing Housing Tracker</a>.
        </p>

        {/* ── Context inputs ── */}
        <SectionHead>Lansing context</SectionHead>
        <SliderRow label="Number of unhoused people" value={homeless} min={100} max={3000} step={10}
          display={homeless.toLocaleString()} onChange={setHomeless}
          tip="Default 232 = PATH by-name list, Jan 2024 (WLNS). Official Ingham CoC Point-in-Time count was 111 (2023 federal methodology — undercounts people sheltering indoors). The true number is likely between these figures or higher. Enter your own estimate for any city." />
        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", background: "var(--color-surface-raised)", borderRadius: "10px", padding: "0.65rem 0.875rem", marginBottom: "1rem", lineHeight: 1.7 }}>
          Default 232 = PATH (Project for Assistance in Transition from Homelessness) by-name list, January 2024,
          reported by <a href="https://www.wlns.com/news/annual-count-of-homeless-shows-increase/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-teal-accent)" }}>WLNS Feb 6, 2024</a>.
          PATH outreach coordinator Leesa Leyrer: <em>&ldquo;We have a by-names list — within the last 90 days, that we have proof of homelessness.
          Whether it be in a shelter, abandoned cars, buildings — there are 232 of those people.&rdquo;</em>{" "}
          The official Ingham CoC Point-in-Time count for 2023 was 111 (federal methodology, conducted in late January;
          undercounts people sheltering in cars or indoors). Slide to 111 for the federal floor; slide up for PATH&apos;s more complete tracking.
        </div>
        <SliderRow label="Taxpayer households" value={households} min={40000} max={65000} step={500}
          display={households.toLocaleString()} onChange={setHouseholds}
          tip="Default 51,600 — U.S. Census 2024 ACS estimate for Lansing city. Used to divide the total cost burden across all households and show the per-household share." />
        <SliderRow label="Median household income" value={income} min={40000} max={75000} step={500}
          display={"$" + income.toLocaleString()} onChange={setIncome}
          tip="Default $54,382 — U.S. Census 2024 ACS, Lansing city. Used to calculate what percentage of a typical household's annual income goes toward homelessness-related public costs." />

        <Divider />

        {/* ── Status quo cost inputs ── */}
        <SectionHead>Annual cost per unhoused person (adjust to local data)</SectionHead>
        {SQ_SLIDERS.map((s) => (
          <SliderRow key={s.id} label={s.label} value={sqCosts[s.id]} min={s.min} max={s.max} step={s.step}
            display={fmt(sqCosts[s.id])} onChange={(v) => setSqCost(s.id, v)} tip={s.tip} />
        ))}

        <Divider />

        {/* ── Total box ── */}
        <div className="card" style={{ textAlign: "center", padding: "2rem", marginBottom: "1.5rem", background: "var(--color-surface-raised)" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>Annual cost to a median-income Lansing household</p>
          <p style={{ fontSize: "2.75rem", fontWeight: 700, fontFamily: "var(--font-serif)", color: "var(--color-text-primary)", marginBottom: "0.4rem" }}>{fmt(sqPerHH)}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
            {fmtPct(pctIncome)} of median income · {homeless.toLocaleString()} unhoused · {households.toLocaleString()} households
          </p>
        </div>

        {/* Metric cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
          <MetricCard label="City-wide annual cost" value={sqTotalDisplay} sub="all households" />
          <MetricCard label="Cost per unhoused person" value={fmt(sqPerPerson)} sub="all line items" />
          <MetricCard label="Share of median income" value={fmtPct(pctIncome)} sub="% of household income" />
          <MetricCard label="If housed: savings" value="$16,282" sub="per person/yr (UPenn 2022)" />
        </div>

        {/* Cost bars */}
        <SectionHead>Where does the cost go?</SectionHead>
        <div style={{ marginBottom: "2rem" }}>
          {SQ_SLIDERS.map((s) => {
            const pct = maxSqCost > 0 ? Math.round((sqCosts[s.id] / maxSqCost) * 100) : 0;
            return (
              <div key={s.id} style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                  <span>{s.label}</span>
                  <span>{fmt(sqCosts[s.id])}/person</span>
                </div>
                <div style={{ background: "var(--color-surface-raised)", borderRadius: "4px", height: "10px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "10px", borderRadius: "4px", background: s.color, transition: "width 0.2s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        <Divider />

        {/* ── Housing First ── */}
        <SectionHead>Housing First cost model</SectionHead>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
          Housing First places people directly into stable housing — no sobriety or compliance prerequisites.
          The cost depends heavily on what intensity of social work support is included. Select a model below, then adjust the individual cost components.
        </p>

        {/* Tier selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
          {TIERS.map((t, i) => {
            const gross = t.rent + t.sw + t.mh + t.admin;
            return (
              <button key={t.name} onClick={() => selectTier(i)} style={{
                background: "none", cursor: "pointer", textAlign: "left",
                padding: "0.875rem", borderRadius: "10px",
                border: activeTier === i ? "2px solid var(--color-success)" : "1px solid var(--color-border)",
                fontFamily: "var(--font-sans)",
              }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "0.3rem" }}>{t.name}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "0.5rem" }}>{t.desc}</p>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-success)" }}>${gross.toLocaleString()}/person/yr</p>
              </button>
            );
          })}
        </div>

        {/* HF sliders */}
        <SliderRow label="Housing subsidy / rent" value={hfRent} min={3000} max={18000} step={250}
          display={fmt(hfRent)} onChange={setHfRent}
          tip="Monthly voucher or rent subsidy annualized. Lansing fair market rent for a 1BR is ~$850/mo (~$10,200/yr). Rapid Re-Housing uses a time-limited subsidy; PSH uses a permanent voucher. HUD Section 8 vouchers cover the gap between 30% of income and market rent." />
        <SliderRow label="Social worker caseload cost" value={hfSw} min={0} max={15000} step={250}
          display={fmt(hfSw)} onChange={setHfSw}
          tip="Per-person share of social worker salary and benefits. Median MSW salary ~$65,000 ÷ 25-client caseload = $2,600/yr at full-time. Default $1,200 reflects a part-time/shared allocation in scattered-site PSH. ACT model (daily contact) runs $8,000–$12,000/person/yr." />
        <SliderRow label="Mental health / substance svcs" value={hfMh} min={0} max={12000} step={250}
          display={fmt(hfMh)} onChange={setHfMh}
          tip="Outpatient mental health therapy, psychiatric medication management, and substance use treatment. Rapid Re-Housing: minimal or none. Scattered-site PSH: referral-based, low cost. ACT: intensive co-located services, $5,000–$10,000/yr." />
        <SliderRow label="Admin / case management overhead" value={hfAdmin} min={0} max={5000} step={100}
          display={fmt(hfAdmin)} onChange={setHfAdmin}
          tip="Agency overhead: intake processing, HMIS data entry, compliance reporting, supervision, office costs. Typically 10–20% of direct service costs. Default $200 reflects minimal overhead in a lean scattered-site program." />
        <SliderRow label="Downstream savings credit" value={hfSave} min={0} max={25000} step={500}
          display={fmt(hfSave)} onChange={setHfSave} accentColor="var(--color-success)" valueColor="var(--color-success)"
          tip="Public cost reduction per person after housing placement — fewer ER visits, jail days, and psychiatric hospitalizations. UPenn 2022: $16,282 average. CDC/Community Guide median: $18,247. High-utilizer populations often show $30,000+ in savings. Set to $0 to see gross cost only." />
        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", background: "var(--color-surface-raised)", borderRadius: "10px", padding: "0.65rem 0.875rem", marginBottom: "1.25rem", lineHeight: 1.7 }}>
          Savings slider default $16,282 = UPenn 2022 average public cost reduction per person after PSH placement
          (fewer ER visits, jail days, psychiatric hospitalization). CDC/Community Guide median is $18,247.
          Slide to $0 to see gross cost only; slide up for high-utilizer populations where savings are larger.
        </div>

        {/* Result cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div className="card" style={{ borderColor: "var(--color-danger)", borderWidth: "1.5px" }}>
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>Status quo per household</p>
            <p style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-danger)" }}>{fmt(sqPerHH)}</p>
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>reactive system</p>
          </div>
          <div className="card" style={{ borderColor: "var(--color-success)", borderWidth: "1.5px" }}>
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>Housing First per household</p>
            <p style={{ fontSize: "1.35rem", fontWeight: 700, color: hfPerHH < 0 ? "var(--color-success)" : "var(--color-text-primary)" }}>{fmtS(hfPerHH)}</p>
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>net after savings</p>
          </div>
          <div className="card" style={{ borderColor: "var(--color-river-blue)", borderWidth: "1.5px" }}>
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>Difference</p>
            <p style={{ fontSize: "1.35rem", fontWeight: 700, color: diff >= 0 ? "var(--color-success)" : "var(--color-danger)" }}>{fmtS(diff)}</p>
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
              {diff >= 0 ? "per household cheaper/yr" : "per household more expensive/yr"}
            </p>
          </div>
        </div>

        {/* Cost breakdown */}
        <div style={{ background: "var(--color-surface-raised)", borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "1.25rem", fontSize: "0.8rem", color: "var(--color-text-secondary)", lineHeight: 2 }}>
          {[
            { label: "Housing subsidy", val: fmt(hfRent), color: undefined },
            { label: "Social worker (per-person share)", val: fmt(hfSw), color: undefined },
            { label: "Mental health / substance services", val: fmt(hfMh), color: undefined },
            { label: "Admin overhead", val: fmt(hfAdmin), color: undefined },
            { label: "Gross program cost/person", val: fmt(hfGross), color: "var(--color-text-muted)" },
            { label: "Downstream savings (ER, jail, shelter avoided)", val: "–" + fmt(hfSave), color: "var(--color-success)" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={row.color ? { color: row.color } : {}}>{row.label}</span>
              <span style={row.color ? { color: row.color } : {}}>{row.val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, color: "var(--color-text-primary)", borderTop: "1px solid var(--color-border)", paddingTop: "0.35rem", marginTop: "0.25rem" }}>
            <span>Net cost per person</span>
            <span>{fmtS(hfNet)}{hfNet < 0 ? " (net saving)" : ""}</span>
          </div>
        </div>

        {/* Comparison bars */}
        <div style={{ marginBottom: "2rem" }}>
          {[
            { label: "Status quo cost/person", value: fmt(sqPerPerson) + "/person", width: sqBarW, color: "var(--color-danger)" },
            { label: "Housing First gross cost/person", value: fmt(hfGross) + "/person gross", width: grossBarW, color: "var(--color-river-blue)" },
            { label: "Housing First net cost/person (after savings)", value: fmtS(hfNet) + "/person net", width: netBarW, color: "var(--color-success)" },
          ].map((bar) => (
            <div key={bar.label} style={{ marginBottom: "0.875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                <span>{bar.label}</span><span>{bar.value}</span>
              </div>
              <div style={{ background: "var(--color-surface-raised)", borderRadius: "4px", height: "14px", overflow: "hidden" }}>
                <div style={{ width: `${bar.width}%`, height: "14px", borderRadius: "4px", background: bar.color, transition: "width 0.25s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", lineHeight: 1.8, borderTop: "1px solid var(--color-border)", paddingTop: "1.25rem" }}>
          <strong style={{ color: "var(--color-text-secondary)" }}>232 baseline source:</strong>{" "}
          PATH by-name list, January 2024. Leesa Leyrer, PATH outreach coordinator, Housing Services of Mid-Michigan, quoted in{" "}
          <a href="https://www.wlns.com/news/annual-count-of-homeless-shows-increase/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-teal-accent)" }}>WLNS, Feb 6, 2024</a>.
          Official Ingham CoC Point-in-Time count for 2023 was 111 (federal methodology; structurally undercounts people sheltering indoors).
          <br /><br />
          <strong style={{ color: "var(--color-text-secondary)" }}>Housing First tiers:</strong>{" "}
          Rapid Re-Housing ($8,500) from NAEH benchmarks. Scattered-site PSH ($16,479) = CDC/Community Guide systematic review median (AJPM, 2021), 20 U.S. studies.
          ACT/high-intensity ($28,000) = upper range from RAND (2025). Social worker caseload: median MSW salary $65,000 ÷ 25-client caseload = $2,600/yr;
          slider defaults to $1,200 reflecting part-time allocation. Savings default $16,282 = UPenn (2022).
          <br /><br />
          <strong style={{ color: "var(--color-text-secondary)" }}>Other baselines:</strong>{" "}
          ER $18,000/yr; shelter $12,800/yr (NAEH 2023); Lansing median income $54,382; 51,600 households (Census 2024 ACS);
          NEAT ~$1M/yr city-wide (City Pulse). A Lansing-specific audit requires FOIA requests to LHC, Lansing PD, and Sparrow Health.
          <br /><br />
          Sources:{" "}
          <a href="https://rhinocerii.github.io/blahrgg/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-teal-accent)" }}>Rhinoceros</a> ·{" "}
          <a href="https://lansing-housing.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-teal-accent)" }}>Lansing Housing Tracker</a> ·{" "}
          <a href="https://rhinocerii.github.io/blahrgg/posts/lansing-housing-network.html" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-teal-accent)" }}>LHC Network post</a> ·{" "}
          <a href="https://rhinocerii.github.io/blahrgg/posts/red-tag-homeowner-permit-ban.html" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-teal-accent)" }}>Red-tag post</a>
        </p>
      </div>
    </div>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
      {children}
    </p>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "2rem 0" }} />;
}

function SliderRow({ label, value, min, max, step, display, onChange, accentColor, valueColor, tip }: {
  label: string; value: number; min: number; max: number; step: number; display: string;
  onChange: (v: number) => void; accentColor?: string; valueColor?: string; tip?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
      <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", minWidth: "210px", flexShrink: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}>
        {label}{tip && <InfoTip text={tip} />}
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: accentColor ?? "var(--color-river-blue)", cursor: "pointer" }}
      />
      <span style={{ fontSize: "0.8rem", fontWeight: 600, minWidth: "75px", textAlign: "right", color: valueColor ?? "var(--color-text-primary)" }}>{display}</span>
    </div>
  );
}

function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        style={{
          border: "none", cursor: "pointer", padding: 0,
          width: "15px", height: "15px", borderRadius: "50%",
          background: "var(--color-border-strong)",
          color: "var(--color-text-secondary)", fontSize: "0.6rem", fontWeight: 700,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, lineHeight: 1,
        }}
        aria-label="Show assumption"
      >i</button>
      {open && (
        <span style={{
          position: "absolute", left: "18px", top: "-4px", zIndex: 50,
          background: "var(--color-deep-navy)", color: "#fff",
          fontSize: "0.72rem", lineHeight: 1.6,
          padding: "0.6rem 0.85rem", borderRadius: "10px",
          width: "280px", boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          pointerEvents: "none",
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card" style={{ padding: "1rem" }}>
      <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>{label}</p>
      <p style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-text-primary)" }}>{value}</p>
      <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>{sub}</p>
    </div>
  );
}
