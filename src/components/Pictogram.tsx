const PERSON_PATH = "M12 14c-6 0-9 3.4-9 10.5V30h18v-5.5C21 17.4 18 14 12 14z";

function Person({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 30" fill="currentColor" style={{ width: "100%", height: "auto", display: "block", color: filled ? "var(--color-dome-gold)" : "var(--color-text-muted)", opacity: filled ? 1 : 0.55 }}>
      <circle cx="12" cy="6" r="5.2" />
      <path d={PERSON_PATH} />
    </svg>
  );
}

// Full-size icon grid (default 100 icons, 1 per percentage point) — for a
// single headline stat, e.g. "50% of households are below the ALICE threshold."
export function PersonPictogram({ pct, total = 100 }: { pct: number; total?: number }) {
  const filled = Math.round((pct / 100) * total);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 1fr)", gap: "4px", maxWidth: "340px" }}>
      {Array.from({ length: total }, (_, i) => <Person key={i} filled={i < filled} />)}
    </div>
  );
}

// 10-icon version for a supporting stat — rounds to the nearest person out
// of 10, coarser than a bar but reads as "a picture" at a glance.
export function MiniPictogram({ pct }: { pct: number }) {
  const filled = Math.round(pct / 10);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "3px", maxWidth: "130px" }}>
      {Array.from({ length: 10 }, (_, i) => <Person key={i} filled={i < filled} />)}
    </div>
  );
}
