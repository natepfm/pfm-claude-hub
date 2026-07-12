"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const pages = [
  { href: "/", label: "Dashboard" },
  { href: "/workflow", label: "Workflow" },
  { href: "/skills", label: "Skills" },
  { href: "/creatives", label: "Creatives" },
  { href: "/resources", label: "Resources" },
  { href: "/onboarding", label: "Onboarding" },
];

function baseRoute(pathname: string): string {
  if (pathname.startsWith("/workflow") || pathname.startsWith("/claude")) return "/workflow";
  if (pathname.startsWith("/skills")) return "/skills";
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
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = !darkMode;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("pfm-hub-theme", next ? "dark" : "light");
    setDarkMode(next);
  }

  return (
    <header className="sticky top-0 z-20 bg-header-gradient border-b border-ink text-ink">
      <div className="relative flex justify-center px-14 md:px-28 py-3.5">
        <Link href="/" className="font-heading font-bold text-xl md:text-2xl text-ink">
          <span>PFM </span>
          <span className="italic bg-editors-gradient bg-clip-text text-transparent">Editors</span>
          <span className="font-mono font-semibold text-ink/70 text-[10px] uppercase tracking-[0.08em] ml-2 align-middle">Hub</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={darkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 border border-ink/60 bg-white/15 px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.06em] text-ink hover:bg-white/25 transition-colors"
        >
          <span aria-hidden className="text-base leading-none">{mounted && darkMode ? "☀" : "☾"}</span>
          <span className="hidden sm:inline">{mounted && darkMode ? "Light" : "Dark"}</span>
        </button>
      </div>
      <ul className="nav-scrollbar flex overflow-x-auto border-t border-ink/70 divide-x divide-ink/70">
        {pages.map((p) => {
          const isActive = active === p.href;
          return (
            <li key={p.href} className="flex-none min-w-[94px] md:min-w-0 md:flex-1">
              <Link
                href={p.href}
                className={`flex min-h-11 items-center justify-center px-2 py-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.04em] md:tracking-[0.08em] transition-colors ${
                  isActive
                    ? "bg-black/15 text-ink font-bold"
                    : "text-ink/75 hover:text-ink hover:bg-white/20"
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
