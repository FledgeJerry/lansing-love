import type { Metadata } from "next";
import { IBM_Plex_Sans, Merriweather } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import SessionProvider from "@/components/SessionProvider";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: { default: "lansing.love — Cooperative Governance", template: "%s | lansing.love" },
  description: "We know we #lovelansing — but does #lansingloveus? A cooperative governance dashboard tracking Lansing's legitimacy gap, co-op network, civic advocacy, and city council votes.",
  keywords: ["Lansing Michigan", "cooperative governance", "polycentric governance", "Lansing city council", "civic predictions", "Lansing housing", "Lansing co-ops", "The Fledge", "community ownership", "civic engagement Lansing"],
  metadataBase: new URL("https://lansing.love"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "lansing.love",
    title: "lansing.love — Cooperative Governance",
    description: "We know we #lovelansing — but does #lansingloveus? Tracking Lansing's legitimacy gap and the cooperative network building an alternative.",
    url: "https://lansing.love",
  },
  twitter: {
    card: "summary_large_image",
    title: "lansing.love — Cooperative Governance",
    description: "We know we #lovelansing — but does #lansingloveus? Tracking Lansing's legitimacy gap and the cooperative network building an alternative.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${merriweather.variable}`}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "lansing.love",
            url: "https://lansing.love",
            description: "A cooperative governance dashboard and civic prediction platform for Lansing, Michigan.",
            publisher: {
              "@type": "Organization",
              name: "The Fledge",
              url: "https://thefledge.com",
              address: { "@type": "PostalAddress", streetAddress: "1300 Eureka Street", addressLocality: "Lansing", addressRegion: "MI", postalCode: "48912" },
            },
          }) }}
        />
        <SessionProvider>
          <Nav />
          <main style={{ flex: 1, maxWidth: "900px", margin: "0 auto", width: "100%", padding: "2rem 1.5rem" }}>
            {children}
          </main>
          <footer className="site-footer">
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", margin: 0 }}>
              lansing.love — a civic prediction project ·{" "}
              <a href="/about">about</a>
            </p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
