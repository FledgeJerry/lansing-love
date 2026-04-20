import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import SessionProvider from "@/components/SessionProvider";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lansing.love — Civic Predictions",
  description: "Predict Lansing's future. Track who gets it right.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <SessionProvider>
          <Nav />
          <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">{children}</main>
          <footer className="text-center text-xs text-gray-400 py-4">
            lansing.love — a civic prediction project
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
