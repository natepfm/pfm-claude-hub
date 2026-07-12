"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pages = [
  { href: "/", label: "Dashboard" },
  { href: "/claude", label: "Claude" },
  { href: "/creatives", label: "Creatives" },
  { href: "/resources", label: "Resources" },
  { href: "/onboarding", label: "Onboarding" },
];

function baseRoute(pathname: string): string {
  if (pathname.startsWith("/claude")) return "/claude";
  if (pathname.startsWith("/creatives")) return "/creatives";
  if (pathname.startsWith("/resources")) return "/resources";
  if (pathname.startsWith("/onboarding")) return "/onboarding";
  return "/";
}

// Universal top toolbar — same on desktop and mobile (Sam 2026-07-11:
// desktop nav moved off the left sidebar to match the mobile top bar).
export default function TopNav() {
  const pathname = usePathname() || "/";
  const active = baseRoute(pathname);

  return (
    <header className="sticky top-0 z-20 bg-surface border-b border-ink">
      <div className="px-4 md:px-6 py-3">
        <Link href="/" className="font-heading font-bold text-lg md:text-xl">
          <span className="text-text">PFM </span>
          <span className="italic text-accent">Editors</span>
          <span className="font-mono font-normal text-muted text-[10px] uppercase tracking-[0.08em] ml-2 align-middle">Hub</span>
        </Link>
      </div>
      <ul className="flex border-t border-ink divide-x divide-ink">
        {pages.map((p) => {
          const isActive = active === p.href;
          return (
            <li key={p.href} className="flex-1">
              <Link
                href={p.href}
                className={`flex items-center justify-center py-2.5 md:py-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.04em] md:tracking-[0.08em] transition-colors ${
                  isActive
                    ? "bg-accentMuted text-text font-medium"
                    : "text-muted hover:text-text hover:bg-bg"
                }`}
              >
                {p.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </header>
  );
}
