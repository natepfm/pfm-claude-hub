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
    <nav className="hidden md:flex flex-col w-60 shrink-0 border-r border-ink px-6 py-10 bg-surface sticky top-0 self-start max-h-screen overflow-y-auto">
      <Link href="/" className="block mb-8">
        <div className="font-heading font-bold text-2xl">
          <span className="text-text">PFM </span>
          <span className="italic text-accent">Editors</span>
        </div>
        <div className="font-mono text-[10px] text-muted mt-1 uppercase tracking-[0.08em]">Hub</div>
      </Link>

      {/* Primary pages — boxed toolbar cells */}
      <ul className="mb-6 border border-ink divide-y divide-ink">
        {pages.map((p) => {
          const isActive = active === p.href;
          return (
            <li key={p.href}>
              <Link
                href={p.href}
                className={`flex items-center gap-2 px-3 py-2.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors ${
                  isActive
                    ? "bg-accentMuted text-text font-medium"
                    : "text-muted hover:text-text hover:bg-bg"
                }`}
              >
                <span className="text-sm">{p.icon}</span>
                {p.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Contextual "on this page" links */}
      {subs.length > 0 && (
        <>
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted/70 px-3 mb-2">On this page</div>
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
    <div className="md:hidden sticky top-0 z-20 bg-surface border-b border-ink">
      <div className="px-4 py-3">
        <Link href="/" className="font-heading font-bold text-lg">
          <span className="text-text">PFM </span>
          <span className="italic text-accent">Editors</span>
          <span className="font-mono font-normal text-muted text-[10px] uppercase tracking-[0.08em] ml-2">Hub</span>
        </Link>
      </div>
      <ul className="flex border-t border-ink divide-x divide-ink">
        {pages.map((p) => {
          const isActive = active === p.href;
          return (
            <li key={p.href} className="flex-1">
              <Link
                href={p.href}
                className={`flex items-center justify-center gap-1.5 py-2.5 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors ${
                  isActive
                    ? "bg-accentMuted text-text font-medium"
                    : "text-muted"
                }`}
              >
                <span className="text-xs">{p.icon}</span>
                {p.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
