export default function ProportionBar({ pct }: { pct: number }) {
  return (
    <div style={{ height: "8px", borderRadius: "4px", background: "var(--color-surface)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, borderRadius: "4px", background: "var(--color-dome-gold)" }} />
    </div>
  );
}
