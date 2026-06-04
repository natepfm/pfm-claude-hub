"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pages = [
  { href: "/", label: "Onboarding", icon: "🚀" },
  { href: "/claude", label: "Claude", icon: "🤖" },
  { href: "/creatives", label: "Creatives", icon: "🎬" },
  { href: "/resources", label: "Resources", icon: "📚" },
];

const subLinks: Record<string, { href: string; label: string }[]> = {
  "/": [
    { href: "#welcome", label: "Welcome" },
    { href: "#checklist", label: "Day-one checklist" },
    { href: "#apps", label: "Apps & accounts" },
    { href: "#training", label: "Training path" },
    { href: "#claude-setup", label: "Set up Claude" },
  ],
  "/claude": [
    { href: "#update", label: "Update my skills" },
    { href: "#overview", label: "How to use" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#setup-mac", label: "Setup · Mac" },
    { href: "#setup-windows", label: "Setup · Windows" },
    { href: "#skills", label: "Skills" },
    { href: "#editor", label: "Editor" },
    { href: "#changelog", label: "Changelog" },
  ],
  "/creatives": [
    { href: "#types", label: "Creative types" },
    { href: "#variations", label: "Variation types" },
    { href: "#verticals", label: "Verticals" },
    { href: "#building-blocks", label: "Building blocks" },
  ],
  "/resources": [
    { href: "#landers", label: "Landers" },
    { href: "#tools", label: "Tools & logins" },
    { href: "#brand", label: "Brand & guidelines" },
    { href: "#assets", label: "Shared assets" },
    { href: "#sops", label: "SOPs & guides" },
  ],
};

function baseRoute(pathname: string): string {
  if (pathname.startsWith("/claude")) return "/claude";
  if (pathname.startsWith("/creatives")) return "/creatives";
  if (pathname.startsWith("/resources")) return "/resources";
  return "/";
}

export default function Nav() {
  const pathname = usePathname() || "/";
  const active = baseRoute(pathname);
  const subs = subLinks[active] ?? [];

  return (
    <nav className="hidden md:flex flex-col w-60 shrink-0 border-r border-white/[0.08] px-6 py-10 bg-surface/60 backdrop-blur-2xl sticky top-0 self-start max-h-screen overflow-y-auto">
      <Link href="/" className="block mb-8">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-text">PFM </span>
          <span className="text-accent">Editors</span>
        </div>
        <div className="text-xs text-muted mt-1 uppercase tracking-widest">Hub</div>
      </Link>

      {/* Primary pages */}
      <ul className="space-y-1 mb-6">
        {pages.map((p) => {
          const isActive = active === p.href;
          return (
            <li key={p.href}>
              <Link
                href={p.href}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? "bg-accentMuted text-text font-semibold border-l-2 border-accent"
                    : "text-muted hover:text-text hover:bg-surface2"
                }`}
              >
                <span>{p.icon}</span>
                {p.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Contextual "on this page" links */}
      {subs.length > 0 && (
        <>
          <div className="text-[10px] uppercase tracking-widest text-muted/70 px-3 mb-2">On this page</div>
          <ul className="space-y-0.5 border-l border-border ml-3 pl-2">
            {subs.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block px-3 py-1.5 rounded text-muted hover:text-text hover:bg-surface2 transition-colors text-sm"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-auto pt-10 text-xs text-muted">
        v1.0 · Power Fox Media
      </div>
    </nav>
  );
}

// Compact top bar for mobile (the sidebar is hidden below md)
export function MobileNav() {
  const pathname = usePathname() || "/";
  const active = baseRoute(pathname);

  return (
    <div className="md:hidden sticky top-0 z-20 bg-surface/70 backdrop-blur-2xl border-b border-white/[0.08]">
      <div className="px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="text-text">PFM </span>
          <span className="text-accent">Editors</span>
          <span className="text-muted text-xs uppercase tracking-widest ml-2">Hub</span>
        </Link>
      </div>
      <ul className="flex border-t border-border">
        {pages.map((p) => {
          const isActive = active === p.href;
          return (
            <li key={p.href} className="flex-1">
              <Link
                href={p.href}
                className={`flex items-center justify-center gap-1.5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "text-accent font-semibold border-b-2 border-accent"
                    : "text-muted"
                }`}
              >
                <span>{p.icon}</span>
                {p.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
