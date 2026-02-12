const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        kh: ["var(--font-kh)", "serif"],
      },
      colors: {
        kh: {
          gold: "#d4af37",
          "gold-light": "#f4e4bc",
          "gold-dark": "#8b7355",
          blue: "#0a1628",
          "blue-light": "#1a2d4a",
          silver: "#c0c0c0",
          heart: "#e84393",
        },
      },
      boxShadow: {
        "kh-glow": "0 0 20px rgba(212, 175, 55, 0.3)",
        "kh-glow-sm": "0 0 10px rgba(212, 175, 55, 0.2)",
      },
    },
  },
  plugins: [heroui()],
};
