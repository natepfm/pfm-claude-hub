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
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ['"SF Mono"', "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        // Elevation tiers — each combines an outer drop shadow + a 1px top ridge highlight
        // for the "lit from above" feel. Use elev1 for resting cards, elev2 for hover/raised,
        // elev3 for floating/sticky surfaces.
        elev1: "0 1px 2px rgba(0,0,0,0.4), 0 4px 14px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
        elev2: "0 2px 4px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.06)",
        elev3: "0 4px 8px rgba(0,0,0,0.55), 0 24px 56px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        // Accent glow — for highlighted boxes (the accent-muted call-outs)
        "glow-accent": "0 0 0 1px rgba(255,107,53,0.25), 0 8px 32px rgba(255,107,53,0.18), inset 0 1px 0 rgba(255,180,140,0.12)",
      },
      backgroundImage: {
        // Subtle vertical gradient on surfaces so cards aren't flat slabs
        "surface-gradient": "linear-gradient(180deg, #181818 0%, #0f0f0f 100%)",
        "surface-gradient-soft": "linear-gradient(180deg, #161616 0%, #111111 100%)",
        "accent-gradient": "linear-gradient(135deg, #3a1f15 0%, #1a0d08 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
