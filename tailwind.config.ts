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
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Syne'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  "#eef4ff",
          100: "#d9e8ff",
          200: "#bcd3ff",
          300: "#8eb6ff",
          400: "#598cff",
          500: "#3366ff",
          600: "#1a44f5",
          700: "#132fe1",
          800: "#1628b6",
          900: "#182890",
          950: "#131956",
        },
      },
      boxShadow: {
        card: "0 2px 12px 0 rgba(19,25,86,0.07)",
        "card-hover": "0 8px 30px 0 rgba(19,25,86,0.14)",
      },
    },
  },
  plugins: [],
};
export default config;
