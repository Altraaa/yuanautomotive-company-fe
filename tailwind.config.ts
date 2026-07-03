import type { Config } from "tailwindcss";

/**
 * DESIGN TOKENS — single source of truth for the "Red × Gold" racing aesthetic.
 * Pixel-sampled from the approved Claude Design comp (Yuan Dewata Automotive — Home).
 * Never hardcode a hex value in a component — always reference a token.
 */
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        bg: "#141416",
        surface: {
          DEFAULT: "#1C1C20",
          raised: "#18181B",
          sunken: "#0E0E10",
          black: "#000000",
        },
        border: {
          DEFAULT: "#26262B",
          strong: "#33333A",
        },
        // Brand accents (equal weight: red = action, gold = premium)
        red: {
          DEFAULT: "#D32F2F",
          soft: "#E85B5B",
          dark: "#B02525",
        },
        gold: {
          DEFAULT: "#D4A53C",
          soft: "#E0BE6E",
          dark: "#B8892A",
        },
        whatsapp: "#25D366",
        // Text
        fg: {
          DEFAULT: "#FFFFFF",
          soft: "#C9C9D1",
          muted: "#9D9DA6",
          subtle: "#8A8A94",
          faint: "#55555E",
        },
      },
      fontFamily: {
        // Chakra Petch — display/headlines (italic, uppercase)
        display: ["var(--font-chakra)", "system-ui", "sans-serif"],
        // Barlow — body copy
        sans: ["var(--font-barlow)", "system-ui", "sans-serif"],
        // Barlow Condensed — labels / partner logos
        condensed: ["var(--font-barlow-condensed)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      transitionTimingFunction: {
        // Snappy, slightly-overshooting curve for a sporty feel.
        sport: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.85)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        "fade-in": "fade-in 0.25s ease-out both",
        "fade-out": "fade-out 0.2s ease-in both",
        "slide-in-right": "slide-in-right 0.32s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-out-right": "slide-out-right 0.24s cubic-bezier(0.55, 0, 1, 0.45) both",
        "scale-in": "scale-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
} satisfies Config;
