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
        {/* Site-wide atmospheric backdrop — layered, fixed, behind everything.
            1+2. Warm orange + cool mint radial light sources.
            3. Three floating gradient orbs (3D-feeling spheres) with slow drift animation.
            4. Vignette-masked dot-grid texture. */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 65% at 85% -10%, rgba(255,107,53,0.22) 0%, rgba(255,107,53,0.08) 35%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 75% 60% at 10% 105%, rgba(52,211,153,0.16) 0%, rgba(52,211,153,0.055) 38%, transparent 72%)",
          }}
        />
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-32 -right-32 w-[640px] h-[640px] rounded-full opacity-50 animate-drift"
            style={{
              background:
                "radial-gradient(circle at 32% 32%, rgba(255,140,80,0.55), rgba(255,107,53,0.18) 45%, transparent 72%)",
              filter: "blur(60px)",
            }}
          />
          <div
            aria-hidden
            className="absolute top-[45%] -left-40 w-[540px] h-[540px] rounded-full opacity-45 animate-drift-slow"
            style={{
              background:
                "radial-gradient(circle at 38% 38%, rgba(80,235,180,0.5), rgba(52,211,153,0.16) 45%, transparent 72%)",
              filter: "blur(70px)",
            }}
          />
          <div
            aria-hidden
            className="absolute bottom-[8%] right-[18%] w-[440px] h-[440px] rounded-full opacity-30 animate-drift-reverse"
            style={{
              background:
                "radial-gradient(circle at 35% 32%, rgba(170,150,255,0.45), rgba(120,100,220,0.12) 48%, transparent 75%)",
              filter: "blur(80px)",
            }}
          />
        </div>
        <div
          aria-hidden
          className="fixed inset-0 -z-10 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fafafa 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 70% 55% at 50% 45%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 55% at 50% 45%, black 30%, transparent 80%)",
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
