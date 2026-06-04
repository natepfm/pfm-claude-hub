import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        surface: "#141414",
        surface2: "#1c1c1c",
        border: "#2a2a2a",
        text: "#fafafa",
        muted: "#a1a1a1",
        accent: "#FF6B35",
        accentHover: "#E55A2B",
        accentMuted: "#3a1f15",
        // Secondary accent — mint/emerald green for "shipped" / "live" / "success" /
        // positive-state semantics. Pairs cleanly with the orange on dark without competing.
        success: "#34D399",
        successHover: "#10B981",
        successMuted: "#0F2F26",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ['"SF Mono"', "Menlo", "Monaco", "Consolas", "monospace"],
      },
      keyframes: {
        // Slow drifting orb motion — three subtly different paths so each orb has its own life
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.05)" },
          "66%": { transform: "translate(-30px, 45px) scale(0.95)" },
        },
        "drift-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-55px, 40px) scale(1.1)" },
        },
        "drift-reverse": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "40%": { transform: "translate(60px, -40px) scale(0.92)" },
          "80%": { transform: "translate(-35px, 25px) scale(1.08)" },
        },
      },
      animation: {
        drift: "drift 22s ease-in-out infinite",
        "drift-slow": "drift-slow 32s ease-in-out infinite",
        "drift-reverse": "drift-reverse 28s ease-in-out infinite",
      },
      dropShadow: {
        // Text depth — multi-layer stacked shadows for a real extruded feel under headlines.
        // Top hairline highlight + tight dark drop + diffuse atmospheric shadow.
        "text-depth": [
          "0 1px 0 rgba(255,255,255,0.08)",
          "0 2px 3px rgba(0,0,0,0.7)",
          "0 8px 24px rgba(0,0,0,0.6)",
        ],
        // Accent text glow — big orange halo on the accent word(s). Now actually lit-from-within.
        "text-glow-accent": [
          "0 0 32px rgba(255,140,80,0.7)",
          "0 0 12px rgba(255,107,53,0.65)",
          "0 2px 4px rgba(0,0,0,0.5)",
        ],
        // Success text glow — green halo equivalent for any green-accent headline
        "text-glow-success": [
          "0 0 28px rgba(80,235,180,0.55)",
          "0 0 10px rgba(52,211,153,0.5)",
          "0 2px 4px rgba(0,0,0,0.5)",
        ],
        // Subtle eyebrow glow — for the uppercase tracking-widest labels
        "text-glow-soft": "0 0 12px rgba(255,107,53,0.4)",
      },
      boxShadow: {
        // Elevation tiers — each combines an outer drop shadow + a 1px top ridge highlight
        // for the "lit from above" feel. Use elev1 for resting cards, elev2 for hover/raised,
        // elev3 for floating/sticky surfaces. Cranked 2026-06-03 (B-pass) — deeper drops +
        // brighter ridges so cards visibly sit above the page, not on it.
        elev1: "0 2px 4px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        elev2: "0 4px 8px rgba(0,0,0,0.55), 0 20px 48px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.10)",
        elev3: "0 6px 12px rgba(0,0,0,0.6), 0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
        // Accent glow — for highlighted boxes (the accent-muted call-outs). Wider halo so the
        // light visibly "bleeds" out into the page bg rather than stopping at the border.
        "glow-accent": "0 0 0 1px rgba(255,107,53,0.35), 0 0 80px rgba(255,107,53,0.22), 0 16px 48px rgba(255,107,53,0.2), inset 0 1px 0 rgba(255,180,140,0.18)",
        // Success glow — for green/shipped/live highlighted surfaces (use sparingly).
        "glow-success": "0 0 0 1px rgba(52,211,153,0.32), 0 0 60px rgba(52,211,153,0.18), 0 12px 36px rgba(52,211,153,0.16), inset 0 1px 0 rgba(180,255,220,0.15)",
      },
      backgroundImage: {
        // Vertical gradient on surfaces — more contrast top→bottom so cards aren't flat slabs.
        // Cranked 2026-06-03 (B-pass) from ~5-8% range to ~12-15%.
        "surface-gradient": "linear-gradient(180deg, #1e1e1e 0%, #0c0c0c 100%)",
        "surface-gradient-soft": "linear-gradient(180deg, #1a1a1a 0%, #0c0c0c 100%)",
        "accent-gradient": "linear-gradient(135deg, #4a261a 0%, #1a0d08 100%)",
        // Glass surfaces — translucent + meant to be paired with `backdrop-blur-xl` (or 2xl).
        // The page bg atmosphere (radial spotlight + dot-grid) shows through, which is the point.
        // glass-light = neutral frost (diagram panels, expand-toggles).
        // glass-accent = warm orange frost (Update hero + accent callouts).
        "glass-light": "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
        "glass-accent": "linear-gradient(180deg, rgba(255,107,53,0.13) 0%, rgba(255,107,53,0.03) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
