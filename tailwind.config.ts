import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          50: "#fffbf5",
          100: "#fff1e0",
          200: "#ffdbb3",
          300: "#ffbf80",
          400: "#ff9d4d",
          500: "#ff7b1a",
          600: "#e66000",
          700: "#cc4d00",
          800: "#a63a00",
          900: "#8c3100",
          950: "#451304",
        },
        canvas: {
          bg: "#FAFAF9",
          panel: "#FFFFFF",
        },
        surface: {
          DEFAULT: "#FAFAF9",
          elevated: "#FFFFFF",
          card: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#ff7b1a",
          50: "#fffbf5",
          100: "#fff1e0",
          200: "#ffdbb3",
          300: "#ffbf80",
          400: "#ff9d4d",
          500: "#ff7b1a",
          600: "#e66000",
          700: "#cc4d00",
          800: "#a63a00",
          900: "#8c3100",
        },
      },
      boxShadow: {
        soft: "0 4px 30px rgba(0,0,0,0.02)",
        "soft-lg": "0 8px 30px rgba(0,0,0,0.04)",
        brand: "0 8px 30px rgb(230,96,0,0.15)",
        "brand-lg": "0 10px 40px rgb(230,96,0,0.2)",
      },
      animation: {
        "orb-pulse": "orb-pulse 8s ease-in-out infinite",
      },
      keyframes: {
        "orb-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
