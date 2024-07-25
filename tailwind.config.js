/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FBFAF7",
        secondary: "#222831",
        gray: {
          DEFAULT: "#6B7280",
        },
      },
      fontFamily: {
        geisThin: ["Geist-thin", "sans-serif"],
        geistBlack: ["Geist-Black", "sans-serif"],
        geistBold: ["Geist-Bold", "sans-serif"],
        geistMedium: ["Geist-Medium", "sans-serif"],
        geistLight: ["Geist-Light", "sans-serif"],
        geistRegular: ["Geist-Regular", "sans-serif"],
        geistSemiBold: ["Geist-SemiBold", "sans-serif"],
        geistUltraLight: ["Geist-UltraLight", "sans-serif"],
      },
    },
  },
  plugins: [],
};
