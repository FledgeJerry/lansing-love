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
  title: { default: "lansing.love — Civic Predictions", template: "%s | lansing.love" },
  description: "Make predictions about Lansing, Michigan's future. Track who gets it right. A civic forecasting platform for Lansing residents and community leaders.",
  keywords: ["Lansing Michigan", "civic predictions", "Lansing forecast", "community predictions", "Lansing future", "civic engagement Lansing"],
  metadataBase: new URL("https://lansing.love"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "lansing.love",
    title: "lansing.love — Civic Predictions",
    description: "Make predictions about Lansing's future. Track who gets it right.",
    url: "https://lansing.love",
  },
  twitter: {
    card: "summary_large_image",
    title: "lansing.love — Civic Predictions",
    description: "Make predictions about Lansing's future. Track who gets it right.",
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
            description: "A civic prediction platform for Lansing, Michigan.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://lansing.love/submit",
              "query-input": "required name=search_term_string",
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
