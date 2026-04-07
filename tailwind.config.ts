import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "var(--color-navy)",
        "navy-mid": "var(--color-navy-mid)",
        "navy-light": "var(--color-navy-light)",
        slate: "var(--color-slate)",
        "blue-accent": "var(--color-blue-accent)",
        "blue-light": "var(--color-blue-light)",
        "blue-muted": "var(--color-blue-muted)",
        white: "var(--color-white)",
        "off-white": "var(--color-off-white)",
        "gray-soft": "var(--color-gray-soft)",
        "gray-muted": "var(--color-gray-muted)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
      },
      fontFamily: {
        display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        sans: ["var(--font-open-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: [
          "clamp(2.25rem, 4.8vw, 3.75rem)",
          { lineHeight: "1.08", letterSpacing: "-0.02em" },
        ],
        h1: [
          "clamp(2.25rem, 5vw, 3.75rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
        h2: [
          "clamp(2rem, 4vw, 3rem)",
          { lineHeight: "1.15", letterSpacing: "-0.01em" },
        ],
        h3: [
          "clamp(1.5rem, 2.5vw, 2rem)",
          { lineHeight: "1.2" },
        ],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        label: [
          "0.8125rem",
          { lineHeight: "1.4", letterSpacing: "0.08em" },
        ],
        cta: ["0.9375rem", { lineHeight: "1.4" }],
      },
      maxWidth: {
        content: "1200px",
      },
      backgroundImage: {
        noise: "url('/textures/noise.svg')",
      },
      borderRadius: {
        card: "0.75rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
