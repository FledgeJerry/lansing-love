import { ALICE_SNAPSHOT as A } from "./aliceData";
import { PersonPictogram, MiniPictogram } from "@/components/Pictogram";
import ProportionBar from "@/components/ProportionBar";
import TrendBadge from "@/components/TrendBadge";

function Stat({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)", borderRadius: "10px", padding: "1.1rem 1.25rem" }}>
      {children}
      {sub && <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "0.5rem", lineHeight: 1.4 }}>{sub}</p>}
    </div>
  );
}

function StatTopRow({ value, label, trend }: { value: string; label: string; trend?: "up" | "down" }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.55rem" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.55rem", fontWeight: 500, color: "var(--color-limestone)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
      {trend
        ? <TrendBadge direction={trend} />
        : <span style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-steel-muted)" }}>{label}</span>}
    </div>
  );
}

type LiveStats = { source: string; rentBurdenedPct: number; noVehiclePct: number } | null;

export default function AliceSnapshot({ live }: { live?: LiveStats }) {
  return (
    <div className="card" style={{ padding: "1.75rem clamp(1.25rem, 4vw, 2.25rem)", marginBottom: "2.5rem" }}>
      <span className="eyebrow">ALICE · Asset Limited, Income Constrained, Employed</span>
      <h2 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(1.5rem, 4vw, 2rem)", margin: "0.4rem 0 0.85rem", lineHeight: 1.15 }}>
        Does Lansing Love Us?
      </h2>
      <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "var(--color-steel-muted)", maxWidth: "62ch", marginBottom: "1.75rem" }}>
        We know we #lovelansing. This is the other half of that question — households earning above the
        federal poverty line but still unable to afford a basic cost of living. Everything below this point
        on the page is ultimately about whether the cooperative network is closing this gap, not just
        whether it exists.
      </p>

      {/* Headline pictogram */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(220px, 300px)", gap: "2.5rem", alignItems: "center", paddingBottom: "1.75rem", marginBottom: "1.75rem", borderBottom: "1px solid var(--color-border)" }}>
        <PersonPictogram pct={A.lansingAlicePct} />
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(2.2rem, 6vw, 2.9rem)", fontWeight: 500, color: "var(--color-dome-gold)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {A.lansingAlicePct}%
          </div>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-limestone)", marginTop: "0.5rem" }}>
            of Lansing households are below the ALICE threshold
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
            Earning above the federal poverty line, but still unable to afford a basic cost of living — rent, food, transportation, healthcare. Lansing city, {A.lansingAlicePctYear}.
          </div>
        </div>
      </div>

      {/* Supporting stats */}
      <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        The rest of the picture
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem" }}>
        <Stat sub={`Ingham County, ${A.inghamYear}`}>
          <StatTopRow value={`${A.inghamPovertyPct}%`} label="In poverty" />
          <MiniPictogram pct={A.inghamPovertyPct} />
        </Stat>

        <Stat sub={`~${A.foodInsecureCount.toLocaleString()} people, Ingham Co. ${A.foodInsecureYear}`}>
          <StatTopRow value={`${A.foodInsecurePct}%`} label="Food insecure" />
          <MiniPictogram pct={A.foodInsecurePct} />
        </Stat>

        {live && (
          <>
            <Stat sub="Spending 30%+ of income on rent · live Census">
              <StatTopRow value={`${live.rentBurdenedPct}%`} label="Rent-burdened renters" />
              <ProportionBar pct={live.rentBurdenedPct} />
            </Stat>

            <Stat sub="Households with no car · live Census">
              <StatTopRow value={`${live.noVehiclePct}%`} label="No vehicle access" />
              <ProportionBar pct={live.noVehiclePct} />
            </Stat>
          </>
        )}

        <Stat sub={`BWL, effective ${A.utilityIncreaseEffective}`}>
          <StatTopRow value={`+${A.utilityElectricIncreasePct}%`} label="Electric rate increase" trend="up" />
          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-steel-muted)" }}>Electric rate increase</div>
        </Stat>

        <Stat sub={`BWL, effective ${A.utilityIncreaseEffective}`}>
          <StatTopRow value={`+${A.utilityWaterIncreasePct}%`} label="Water rate increase" trend="up" />
          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-steel-muted)" }}>Water rate increase</div>
        </Stat>

        <Stat sub={`Ingham Co. PIT count, ${A.homelessCountDate} — a count, not a percentage, so it stays a plain number.`}>
          <StatTopRow value={A.homelessCount.toLocaleString()} label="People homeless" />
        </Stat>
      </div>

      <p style={{ fontSize: "0.68rem", color: "var(--color-text-muted)", marginTop: "1.5rem", lineHeight: 1.5 }}>
        City and county figures are from different report years and won&apos;t perfectly reconcile — see source notes in code. Most figures are annual reports, not live data, due for a refresh when new reports publish
        {live && " (rent burden and vehicle access pull live from the Census ACS)"}.
      </p>
    </div>
  );
}
