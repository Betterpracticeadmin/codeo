import type { Config } from "tailwindcss";

// Palette "The Substance" : noir + jaune fluo + blanc.
// NB : les noms de tokens sont conservés pour limiter les changements —
//   green    = fond NOIR
//   greendark= noir pur (footer)
//   greenlight = gris très foncé (cartes / hover)
//   red      = JAUNE FLUO (titres + bandes)
//   cream    = blanc cassé (texte)
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: "#0a0a0a",
        greendark: "#000000",
        greenlight: "#171717",
        red: "#e8ff00",
        cream: "#f4f1ea",
        ink: "#0d0d0c",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
      maxWidth: {
        container: "1240px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
