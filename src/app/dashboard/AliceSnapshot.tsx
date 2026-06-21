import { ALICE_SNAPSHOT as A } from "./aliceData";

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(244,241,232,0.08)", borderRadius: "10px", padding: "1rem 1.25rem" }}>
      <p style={{ fontSize: "1.9rem", fontWeight: 700, color: "var(--color-limestone)", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", marginTop: "0.3rem" }}>{label}</p>
      {sub && <p style={{ fontSize: "0.7rem", color: "var(--color-steel-muted)", marginTop: "0.15rem" }}>{sub}</p>}
    </div>
  );
}

export default function AliceSnapshot() {
  return (
    <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
      <p style={{ fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.95rem" }}>ALICE in Lansing</p>
      <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", marginBottom: "1rem", maxWidth: "720px" }}>
        ALICE = Asset Limited, Income Constrained, Employed — households earning above the federal poverty
        line but still unable to afford a basic cost of living. Everything below this point on the page is
        ultimately about whether the cooperative network is closing this gap, not just whether it exists.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
        <Stat value={`${A.lansingAlicePct}%`} label="Below ALICE threshold" sub={`Lansing city, ${A.lansingAlicePctYear}`} />
        <Stat value={`${A.inghamPovertyPct}%`} label="In poverty" sub={`Ingham County, ${A.inghamYear}`} />
        <Stat value={A.homelessCount.toLocaleString()} label="People homeless" sub={`Ingham Co. PIT count, ${A.homelessCountDate}`} />
        <Stat value={`+${A.utilityElectricIncreasePct}%`} label="Electric rate increase" sub={`BWL, effective ${A.utilityIncreaseEffective}`} />
        <Stat value={`+${A.utilityWaterIncreasePct}%`} label="Water rate increase" sub={`BWL, effective ${A.utilityIncreaseEffective}`} />
      </div>
      <p style={{ fontSize: "0.68rem", color: "var(--color-steel-muted)", marginTop: "0.75rem" }}>
        City and county figures are from different report years and won&apos;t perfectly reconcile — see source notes in code. Annual reports, not live data; due for a refresh when new reports publish.
      </p>
    </div>
  );
}
