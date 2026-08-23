import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Site Index",
  description: "Every page on lansing.love, organized by section — a human-readable map of the site.",
  alternates: { canonical: "/site-index" },
};

const SECTIONS: { label: string; pages: { href: string; title: string; desc?: string }[] }[] = [
  {
    label: "Home & Governance Dashboard",
    pages: [
      { href: "/", title: "Cooperative Governance", desc: "Legitimacy gap, cooperative network, civic advocacy, and the Ownership Check." },
      { href: "/governance", title: "Governance", desc: "Boards, commissions, departments, BWL, contracts." },
      { href: "/governance/dashboard", title: "Why the Dashboard" },
      { href: "/governance/roadmap", title: "The Roadmap" },
    ],
  },
  {
    label: "History",
    pages: [
      { href: "/history", title: "History", desc: "Accounting, Map, Relationships, and Timeline — Lansing's civic and family history." },
    ],
  },
  {
    label: "Cases — The Full Accounting",
    pages: [
      { href: "/governance/cases", title: "Cases", desc: "Who got the benefit, who paid the cost — 14 documented cases of Lansing institutional accountability." },
      { href: "/governance/charter", title: "Charter" },
      { href: "/governance/alternatives/chamber", title: "How to Build an Alternative to a Chamber of Commerce" },
      { href: "/governance/policy/participatory-budgeting", title: "Participatory Budgeting in Lansing" },
    ],
  },
  {
    label: "Pattern Language",
    pages: [
      { href: "/patterns", title: "Pattern Language — Polycentric Governance", desc: "28 patterns across four scales, evidenced by the Cases." },
    ],
  },
  {
    label: "Boards, Neighborhoods & Co-ops",
    pages: [
      { href: "/boards", title: "Lansing Boards & Commissions" },
      { href: "/neighborhoods", title: "Lansing Neighborhood Organizations" },
      { href: "/directory", title: "Co-op Directory" },
    ],
  },
  {
    label: "Civic Predictions",
    pages: [
      { href: "/predictions", title: "Predictions", desc: "Predict Lansing City Council votes and track who gets it right." },
      { href: "/leaderboard", title: "Leaderboard" },
      { href: "/submit", title: "Submit a Prediction Question" },
      { href: "/unhoused-cost-calculator", title: "Unhoused Cost Calculator" },
    ],
  },
  {
    label: "About & Search",
    pages: [
      { href: "/about", title: "About" },
      { href: "/search", title: "Search" },
    ],
  },
  {
    label: "Account",
    pages: [
      { href: "/login", title: "Sign in" },
      { href: "/register", title: "Join" },
      { href: "/profile", title: "Profile" },
      { href: "/forgot-password", title: "Forgot Password" },
      { href: "/reset-password", title: "Reset Password" },
      { href: "/unsubscribe", title: "Unsubscribe" },
    ],
  },
];

export default function SiteIndexPage() {
  return (
    <div style={{ maxWidth: "760px", paddingBottom: "4rem" }}>
      <span className="eyebrow">Site Index</span>
      <h1 style={{ marginBottom: "0.5rem" }}>Every page on lansing.love</h1>
      <p style={{ color: "var(--color-steel-muted)", marginBottom: "2.5rem" }}>
        A human-readable map of the site, organized by section. For search engines, see the{" "}
        <a href="/sitemap.xml">XML sitemap</a>.
      </p>

      {SECTIONS.map(section => (
        <section key={section.label} style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-dome-gold)", marginBottom: "0.75rem" }}>{section.label}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {section.pages.map(p => (
              <Link key={p.href} href={p.href} style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--color-limestone)", fontSize: "0.9rem" }}>{p.title}</span>
                  {p.desc && <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{p.desc}</span>}
                  <span style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>{p.href}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
