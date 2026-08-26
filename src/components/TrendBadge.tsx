export default function TrendBadge({ direction = "up" }: { direction?: "up" | "down" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.2rem 0.55rem",
        borderRadius: "999px",
        background: "rgba(192, 57, 43, 0.14)",
        border: "1px solid rgba(192, 57, 43, 0.35)",
        color: "#E27A6C",
        fontSize: "0.72rem",
        fontWeight: 600,
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ width: "11px", height: "11px", transform: direction === "down" ? "scaleY(-1)" : undefined }}>
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
      {direction}
    </span>
  );
}
