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
    },
  },
  plugins: [],
};

export default config;
