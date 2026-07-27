"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Masthead only — the hub is a single page (Sam 2026-07-26), so the
// page-tab row is gone. Logo + wordmark + sign-out + theme toggle.
export default function TopNav({
  userEmail,
  signOutAction,
}: {
  userEmail?: string | null;
  signOutAction?: () => Promise<void>;
}) {
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
        {userEmail && signOutAction && (
          <form
            action={signOutAction}
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2"
          >
            <button
              type="submit"
              title={`Signed in as ${userEmail} — sign out`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 border border-ink/60 bg-white/15 px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.06em] text-ink hover:bg-white/25 transition-colors"
            >
              <span aria-hidden className="text-sm leading-none">⏻</span>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        )}
        <Link
          href="/"
          aria-label="Power Fox Media Editors Hub"
          className="group inline-flex items-center gap-2 text-ink transition-opacity hover:opacity-80 md:gap-3"
        >
          <span className="relative h-7 w-7 shrink-0 overflow-hidden md:hidden" aria-hidden>
            <Image
              src="/brand/pfm-logo-h-dark.png"
              alt=""
              width={1844}
              height={224}
              priority
              className="h-7 w-auto max-w-none dark:hidden"
            />
            <Image
              src="/brand/pfm-logo-h-white.png"
              alt=""
              width={1844}
              height={224}
              priority
              className="hidden h-7 w-auto max-w-none dark:block"
            />
          </span>
          <span className="hidden shrink-0 md:block" aria-hidden>
            <Image
              src="/brand/pfm-logo-h-dark.png"
              alt=""
              width={1844}
              height={224}
              priority
              className="h-[22px] w-auto dark:hidden"
            />
            <Image
              src="/brand/pfm-logo-h-white.png"
              alt=""
              width={1844}
              height={224}
              priority
              className="hidden h-[22px] w-auto dark:block"
            />
          </span>
          <span className="h-7 w-px shrink-0 bg-ink/45" aria-hidden />
          <span className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="font-heading text-xl font-bold italic bg-editors-gradient bg-clip-text text-transparent md:text-2xl">Editors</span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink/70">Hub</span>
          </span>
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
    </header>
  );
}
