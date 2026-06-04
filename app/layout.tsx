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
        {/* Site-wide atmospheric backdrop — cranked 2026-06-04 to actually read against #0a0a0a.
            Values now hit hard enough to be visible against the dark page everywhere, not just
            where they reinforce an accent element.
            1. Subtle directional gradient on the page bg itself — warm top-right, cool bottom-left.
            2+3. Heavy warm orange + cool mint radial light sources.
            4. Three large floating gradient orbs (3D-feeling spheres) with slow drift animation.
            5. Vignette-masked dot-grid texture, opacity bumped. */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(140deg, #1a0f08 0%, #0a0a0a 35%, #0a0a0a 65%, #06100c 100%)",
          }}
        />
        <div
          aria-hidden
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 75% at 85% -5%, rgba(255,107,53,0.38) 0%, rgba(255,107,53,0.15) 32%, rgba(255,107,53,0.04) 55%, transparent 78%)",
          }}
        />
        <div
          aria-hidden
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 85% 65% at 8% 105%, rgba(52,211,153,0.28) 0%, rgba(52,211,153,0.10) 35%, rgba(52,211,153,0.03) 60%, transparent 78%)",
          }}
        />
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-40 -right-40 w-[820px] h-[820px] rounded-full opacity-80 animate-drift"
            style={{
              background:
                "radial-gradient(circle at 32% 32%, rgba(255,160,100,0.75), rgba(255,107,53,0.30) 42%, rgba(255,107,53,0.06) 65%, transparent 78%)",
              filter: "blur(50px)",
            }}
          />
          <div
            aria-hidden
            className="absolute top-[40%] -left-48 w-[720px] h-[720px] rounded-full opacity-75 animate-drift-slow"
            style={{
              background:
                "radial-gradient(circle at 38% 38%, rgba(100,240,190,0.65), rgba(52,211,153,0.25) 42%, rgba(52,211,153,0.06) 65%, transparent 78%)",
              filter: "blur(60px)",
            }}
          />
          <div
            aria-hidden
            className="absolute bottom-[5%] right-[15%] w-[620px] h-[620px] rounded-full opacity-60 animate-drift-reverse"
            style={{
              background:
                "radial-gradient(circle at 35% 32%, rgba(185,165,255,0.60), rgba(140,120,230,0.20) 45%, rgba(120,100,220,0.05) 65%, transparent 78%)",
              filter: "blur(70px)",
            }}
          />
        </div>
        <div
          aria-hidden
          className="fixed inset-0 -z-10 pointer-events-none opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fafafa 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 75% 60% at 50% 45%, black 35%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 60% at 50% 45%, black 35%, transparent 85%)",
          }}
        />

        <MobileNav />
        <div className="flex min-h-screen">
          <Nav />
          <main className="flex-1 px-6 md:px-12 py-10 max-w-5xl mx-auto w-full">{children}</main>
        </div>
        <footer className="border-t border-white/[0.08] py-6 text-center text-sm text-muted backdrop-blur-sm">
          Power Fox Media · Editors Hub · <a href="/claude#changelog" className="text-accent hover:text-accentHover">Changelog</a>
        </footer>
      </body>
    </html>
  );
}
