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
  title: "lansing.love — Civic Predictions",
  description: "Predict Lansing's future. Track who gets it right.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${merriweather.variable}`}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
