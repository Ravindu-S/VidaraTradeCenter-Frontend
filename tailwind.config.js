/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1a1a32",
        "accent-gold": "#b89e6c",
        "background-light": "#f6f6f7",
        "background-dark": "#16161c",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};