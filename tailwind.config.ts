import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f1f2f6",
        foreground: "#2a2b3d",
        brand: {
          bg: "#f1f2f6",
          purple: "#887ed8",
          "purple-hover": "#786dc8",
          "purple-light": "#f4f3fb",
          "purple-soft": "#eceafd",
          "purple-dark": "#5c53a6",
          lavender: "#e4e2f7",
          yellow: "#fbc531",
          dark: "#2a2b3d",
          muted: "#64667a",
        },
      },
      fontFamily: {
        // Montserrat with cyrillic — injected as --font-sans via next/font
        sans: ["var(--font-sans)", "Montserrat", "Nunito", "sans-serif"],
        // Comfortaa with cyrillic — injected as --font-heading via next/font
        heading: ["var(--font-heading)", "Comfortaa", "Pangolin", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px rgba(136, 126, 216, 0.12)",
        "card-hover": "0 14px 36px rgba(136, 126, 216, 0.22)",
        button: "0 4px 14px rgba(136, 126, 216, 0.35)",
        "button-hover": "0 6px 20px rgba(136, 126, 216, 0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
