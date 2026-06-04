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
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(140deg, #140e09 0%, #0a0a0a 40%, #0a0a0a 60%, #080d0b 100%)",
          }}
        />
        <div
          aria-hidden
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 95% 70% at 85% -8%, rgba(255,107,53,0.20) 0%, rgba(255,107,53,0.07) 35%, transparent 72%)",
          }}
        />
        <div
          aria-hidden
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 8% 105%, rgba(52,211,153,0.14) 0%, rgba(52,211,153,0.045) 38%, transparent 74%)",
          }}
        />
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-40 -right-40 w-[720px] h-[720px] rounded-full opacity-55 animate-drift"
            style={{
              background:
                "radial-gradient(circle at 32% 32%, rgba(255,150,95,0.50), rgba(255,107,53,0.18) 42%, transparent 72%)",
              filter: "blur(70px)",
            }}
          />
          <div
            aria-hidden
            className="absolute top-[42%] -left-44 w-[620px] h-[620px] rounded-full opacity-45 animate-drift-slow"
            style={{
              background:
                "radial-gradient(circle at 38% 38%, rgba(90,235,180,0.42), rgba(52,211,153,0.14) 42%, transparent 72%)",
              filter: "blur(75px)",
            }}
          />
          <div
            aria-hidden
            className="absolute bottom-[8%] right-[18%] w-[500px] h-[500px] rounded-full opacity-30 animate-drift-reverse"
            style={{
              background:
                "radial-gradient(circle at 35% 32%, rgba(175,155,255,0.40), rgba(140,120,230,0.12) 45%, transparent 74%)",
              filter: "blur(85px)",
            }}
          />
        </div>
        <div
          aria-hidden
          className="fixed inset-0 z-0 pointer-events-none opacity-[0.06]"
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

        {/* Content layer — z-10 so it sits above the atmosphere (which is at z-0).
            Without this wrapper, content would render at z-auto and the atmosphere divs
            would cover it on every page. */}
        <div className="relative z-10">
          <MobileNav />
          <div className="flex min-h-screen">
            <Nav />
            <main className="flex-1 px-6 md:px-12 py-10 max-w-5xl mx-auto w-full">{children}</main>
          </div>
          <footer className="border-t border-white/[0.08] py-6 text-center text-sm text-muted backdrop-blur-sm">
            Power Fox Media · Editors Hub · <a href="/claude#changelog" className="text-accent hover:text-accentHover">Changelog</a>
          </footer>
        </div>
      </body>
    </html>
  );
}
