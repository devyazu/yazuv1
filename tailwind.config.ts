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
        primary: {
          DEFAULT: "#ff6100",
          50: "#fff5ef",
          100: "#ffe8db",
          200: "#ffcdb8",
          300: "#ffa885",
          400: "#ff7d4d",
          500: "#ff6100",
          600: "#f04a00",
          700: "#c73a00",
          800: "#9e3009",
          900: "#7f2b0b",
          950: "#451304",
        },
        surface: {
          DEFAULT: "#0f0f0f",
          elevated: "#1a1a1a",
          card: "#161616",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
