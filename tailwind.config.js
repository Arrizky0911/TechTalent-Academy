/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        frame: "#151515",
        gray: {
          DEFAULT: "#1E1E1E",
        },
        "button-main": "#2A86FF",
        "home-course": "#1E1E1E",
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
