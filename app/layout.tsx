import type { Metadata } from "next";
import "./globals.css";
import Nav, { MobileNav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "PFM Editors Hub",
  description: "Onboarding, Claude pipeline, and resources for Power Fox Media editors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text">
        <MobileNav />
        <div className="flex min-h-screen">
          <Nav />
          <main className="flex-1 px-6 md:px-12 py-10 max-w-5xl mx-auto w-full">{children}</main>
        </div>
        <footer className="border-t border-border py-6 text-center text-sm text-muted">
          Power Fox Media · Editors Hub · <a href="/claude#changelog" className="text-accent hover:text-accentHover">Changelog</a>
        </footer>
      </body>
    </html>
  );
}
