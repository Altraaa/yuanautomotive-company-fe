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
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
} satisfies Config;
