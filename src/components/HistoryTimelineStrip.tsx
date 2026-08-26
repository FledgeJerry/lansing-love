import Link from "next/link";
import { prisma } from "@/lib/prisma";

const DOMAIN_COLORS: Record<string, string> = {
  housing: "#E8C84A", food: "#4A9B8E", healthcare: "#2E6DA4", labor: "#C0392B",
  governance: "#8B5CF6", education: "#4A9B8E", environment: "#4A9B8E",
  energy: "#E8C84A", justice: "#C0392B", technology: "#9AB0C8",
};

function formatYear(d: Date, precision: string): string {
  if (precision === "decade") return `${Math.floor(d.getFullYear() / 10) * 10}s`;
  if (precision === "approximate") return `~${d.getFullYear()}`;
  return String(d.getFullYear());
}

export default async function HistoryTimelineStrip() {
  const events = await prisma.historyEvent.findMany({
    where: { isPublic: true, timelineVisible: true, significance: { gte: 4 }, eventDate: { not: null } },
    orderBy: { eventDate: "asc" },
    select: { id: true, title: true, eventDate: true, datePrecision: true, domains: true },
  });

  if (events.length === 0) return null;

  const items = events.map((e) => ({
    id: e.id,
    year: formatYear(e.eventDate!, e.datePrecision),
    title: e.title,
    color: DOMAIN_COLORS[e.domains[0]] ?? "#9AB0C8",
  }));

  // Duplicate the list so the CSS animation can loop seamlessly from -50%
  const track = [...items, ...items];

  return (
    <div
      style={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        marginBottom: 0,
        overflow: "hidden",
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        padding: "1rem 0",
      }}
    >
      <div className="timeline-strip-track" style={{ display: "flex", width: "max-content" }}>
        {track.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.5rem",
              padding: "0 1.5rem",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.color, flexShrink: 0, alignSelf: "center" }} />
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--color-dome-gold)", fontVariantNumeric: "tabular-nums" }}>
              {item.year}
            </span>
            <span style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)" }}>{item.title}</span>
          </div>
        ))}
      </div>
      <style>{`
        .timeline-strip-track {
          animation: timeline-strip-scroll 260s linear infinite;
        }
        .timeline-strip-track:hover {
          animation-play-state: paused;
        }
        @keyframes timeline-strip-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .timeline-strip-track { animation: none; }
        }
      `}</style>
      <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
        <Link href="/history" style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>
          Explore the full history →
        </Link>
      </div>
    </div>
  );
}
