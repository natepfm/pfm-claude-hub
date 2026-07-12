import type { Config } from "tailwindcss";

// ============================================================
// PERSIMMON CLEAN v2 — orange/stone (locked by Sam 2026-07-11)
// Light utilitarian theme: stone canvas, white surfaces, ink
// text, persimmon accent, flat sharp components, mono labels.
// Source aesthetic: persimmons.studio minus its retro Win95
// layer. Replaces the dark glow theme (2026-06-03 B-pass).
// ============================================================

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)", // page canvas
        surface: "rgb(var(--color-surface) / <alpha-value>)", // cards, panels, modals
        surface2: "rgb(var(--color-surface-2) / <alpha-value>)", // sunken wells, inset regions, code chips
        surfaceActive: "rgb(var(--color-surface-active) / <alpha-value>)", // pressed / selected rows
        border: "rgb(var(--color-border) / <alpha-value>)", // default hairline
        borderInput: "rgb(var(--color-border-input) / <alpha-value>)", // controls + emphasis hairlines
        text: "rgb(var(--color-text) / <alpha-value>)", // primary ink
        muted: "rgb(var(--color-muted) / <alpha-value>)", // secondary text
        faint: "rgb(var(--color-faint) / <alpha-value>)", // placeholders, timestamps
        accent: "rgb(var(--color-accent) / <alpha-value>)", // persimmon
        accentHover: "rgb(var(--color-accent-hover) / <alpha-value>)",
        accentDeep: "rgb(var(--color-accent-deep) / <alpha-value>)", // links / tint text
        accentMuted: "rgb(var(--color-accent-muted) / <alpha-value>)", // orange tint surface
        success: "rgb(var(--color-success) / <alpha-value>)",
        successHover: "rgb(var(--color-success-hover) / <alpha-value>)",
        successMuted: "rgb(var(--color-success-muted) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        dark: "#1A1A1A", // ink bands (footers, hero strips)
        darkSurface: "#0F0F0F", // terminal / code blocks
        ink: "rgb(var(--color-ink) / <alpha-value>)", // brutalist borders + hard shadows
        tintBlue: "rgb(var(--color-tint-blue) / <alpha-value>)", // cool block fill
      },
      fontFamily: {
        heading: [
          "var(--font-heading)",
          "Playfair Display",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          '"SF Mono"',
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      // Fully sharp — the persimmons edge (v3, Sam 2026-07-11).
      // Every rounded-* utility flattens to square; rounded-full survives
      // for the number circles.
      borderRadius: {
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
      },
      // Hard offset ink shadows — mapped onto the existing elev names so
      // every card picks up the brutalist lift without per-component edits.
      boxShadow: {
        elev1: "3px 3px 0 0 rgb(var(--color-ink))",
        elev2: "4px 4px 0 0 rgb(var(--color-ink))",
        elev3: "6px 6px 0 0 rgb(var(--color-ink))",
        "hard-sm": "2px 2px 0 0 rgb(var(--color-ink))",
        // Accent-colored hard shadow — the highlighted-surface treatment.
        "glow-accent": "4px 4px 0 0 rgb(var(--color-accent))",
        "glow-success": "4px 4px 0 0 rgb(var(--color-success))",
      },
      // Text glow era is over — keys kept so existing classes no-op flat.
      dropShadow: {
        "text-depth": "0 0 0 rgba(0, 0, 0, 0)",
        "text-glow-accent": "0 0 0 rgba(0, 0, 0, 0)",
        "text-glow-success": "0 0 0 rgba(0, 0, 0, 0)",
        "text-glow-soft": "0 0 0 rgba(0, 0, 0, 0)",
      },
      // Former dark gradients/glass — flattened to the light system.
      backgroundImage: {
        "surface-gradient": "linear-gradient(180deg, rgb(var(--color-surface)) 0%, rgb(var(--color-surface)) 100%)",
        "surface-gradient-soft":
          "linear-gradient(180deg, rgb(var(--color-surface)) 0%, rgb(var(--color-surface)) 100%)",
        "accent-gradient": "linear-gradient(180deg, rgb(var(--color-accent-muted)) 0%, rgb(var(--color-bg)) 100%)",
        "header-gradient":
          "linear-gradient(120deg, rgb(var(--header-a)) 0%, rgb(var(--header-b)) 52%, rgb(var(--header-c)) 100%)",
        "editors-gradient":
          "linear-gradient(100deg, rgb(var(--editors-a)) 0%, rgb(var(--editors-b)) 55%, rgb(var(--editors-c)) 100%)",
        "glass-light":
          "linear-gradient(180deg, rgb(var(--color-surface) / 0.78) 0%, rgb(var(--color-surface) / 0.6) 100%)",
        "glass-accent":
          "linear-gradient(180deg, rgb(var(--color-accent-muted) / 0.85) 0%, rgb(var(--color-bg) / 0.62) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
