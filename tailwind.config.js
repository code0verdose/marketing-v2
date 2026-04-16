/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DEDBC8",
        accent: {
          DEFAULT: "#F5A27C",
          soft: "rgba(245, 162, 124, 0.12)",
          glow: "rgba(245, 162, 124, 0.3)",
        },
      },
      boxShadow: {
        "glow-accent":
          "0 0 0 1px rgba(245, 162, 124, 0.35), 0 10px 40px -10px rgba(245, 162, 124, 0.4)",
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "serif"],
      },
    },
  },
  plugins: [],
};
