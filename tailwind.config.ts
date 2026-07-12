import type { Config } from "tailwindcss";

// ============================================================
// PERSIMMON CLEAN v2 — orange/stone (locked by Sam 2026-07-11)
// Light utilitarian theme: stone canvas, white surfaces, ink
// text, persimmon accent, flat sharp components, mono labels.
// Source aesthetic: persimmons.studio minus its retro Win95
// layer. Replaces the dark glow theme (2026-06-03 B-pass).
// ============================================================

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F7F4EF", // page canvas — warm stone
        surface: "#FFFFFF", // cards, panels, modals
        surface2: "#F0EDE6", // sunken wells, inset regions, code chips
        surfaceActive: "#E9E5DD", // pressed / selected rows
        border: "#E9E5DD", // default warm hairline
        borderInput: "#D1D5DB", // form controls + emphasis hairlines
        text: "#1A1A1A", // primary ink
        muted: "#52525B", // secondary text
        faint: "#A1A1AA", // placeholders, timestamps
        accent: "#EA580C", // persimmon
        accentHover: "#C2410C",
        accentDeep: "#9A3412", // link text, text on orange tints
        accentMuted: "#FFEDD5", // orange tint surface
        success: "#16A34A", // text-safe green on light
        successHover: "#15803D",
        successMuted: "#E6F4EA", // green tint surface
        warning: "#EAB308", // amber — deliberately off the accent hue
        dark: "#1A1A1A", // ink bands (footers, hero strips)
        darkSurface: "#0F0F0F", // terminal / code blocks
        ink: "#1A1A1A", // brutalist borders + hard shadows
        tintBlue: "#E8EDF5", // cool block fill (pairs with accentMuted + successMuted)
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
        elev1: "3px 3px 0 0 #1A1A1A",
        elev2: "4px 4px 0 0 #1A1A1A",
        elev3: "6px 6px 0 0 #1A1A1A",
        "hard-sm": "2px 2px 0 0 #1A1A1A",
        // Accent-colored hard shadow — the highlighted-surface treatment.
        "glow-accent": "4px 4px 0 0 #EA580C",
        "glow-success": "4px 4px 0 0 #16A34A",
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
        "surface-gradient": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
        "surface-gradient-soft":
          "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
        "accent-gradient": "linear-gradient(180deg, #FFEDD5 0%, #FFF7EF 100%)",
        "header-gradient":
          "linear-gradient(120deg, #D47A4B 0%, #E19A69 52%, #CA7046 100%)",
        "editors-gradient":
          "linear-gradient(100deg, #173B57 0%, #2E6486 55%, #1D4867 100%)",
        "glass-light":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.6) 100%)",
        "glass-accent":
          "linear-gradient(180deg, rgba(255, 237, 213, 0.85) 0%, rgba(255, 247, 239, 0.62) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
