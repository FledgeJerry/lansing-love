import HistoryTimelineStrip from "@/components/HistoryTimelineStrip";

export default function SiteHeaderBanner() {
  return (
    <div>
      <img
        src="/lansing-love-banner.svg"
        alt="lansing.love — civic accountability, cooperative governance, community owned"
        style={{ width: "100%", display: "block" }}
      />
      <HistoryTimelineStrip />
    </div>
  );
}
