"use client";

import { usePathname } from "next/navigation";

// Server-rendered content (e.g. the site header banner) can still be passed
// in as children — this just decides client-side whether to show it, same
// reasoning as AskLansing/FeedbackWidget: admin is Jerry's own tool, not a
// visitor-facing surface, so the decorative header doesn't belong there.
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
