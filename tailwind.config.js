/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    container: {
      center: true,
      padding: "16px",
    },
    extend: {
      colors: {
        primary: "#32012F",
        bground: "#E2DFD0",
        bglight: "#F97300",
        secondary: "#64748b",
        bgbrown: "#524C42",
        bgslight: "#fffbdf",
      },
      fontFamily: {
        lato: ["Lato"],
      },
      screens: {
        "2xl": "1320px",
      },
    },
  },
  plugins: [],
};
