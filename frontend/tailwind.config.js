/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        console: {
          base: "#0b111a",
          panel: "#0c1421",
          surface: "#0f172a",
          card: "#111b2d",
          border: "#1f2937",
          accent: "#22d3ee",
          accentAlt: "#38bdf8",
          muted: "#94a3b8",
          subtle: "#64748b",
          emphasis: "#e5e7eb",
          success: "#34d399",
          warning: "#f59e0b",
          danger: "#ef4444",
        },
      },
      fontSize: {
        "console-xs": ["0.75rem", { lineHeight: "1.1rem" }],
        "console-sm": ["0.85rem", { lineHeight: "1.25rem" }],
        "console-base": ["0.95rem", { lineHeight: "1.4rem" }],
        "console-md": ["1.1rem", { lineHeight: "1.6rem" }],
        "console-lg": ["1.35rem", { lineHeight: "1.75rem" }],
      },
      borderRadius: {
        console: "10px",
        panel: "14px",
      },
      spacing: {
        "3.5": "0.875rem",
        "4.5": "1.125rem",
        "18": "4.5rem",
      },
      boxShadow: {
        console: "0 1px 0 0 rgba(255,255,255,0.03)",
      },
    },
  },
  corePlugins: {
    animation: false,
  },
  plugins: [],
};
