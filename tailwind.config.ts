import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-deep": "var(--bg-deep)",
        border: "var(--border)",
        "purple-core": "var(--purple-core)",
        "purple-light": "var(--purple-light)",
        "text-bright": "var(--text-bright)",
        "text-muted": "var(--text-muted)",
        gold: "var(--gold)",
        green: "var(--green)",
      },
      fontFamily: {
        mono: ["var(--font-space-mono)", "Courier New", "monospace"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
