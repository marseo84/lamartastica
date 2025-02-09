/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./src/styles.css"],
  theme: {
    extend: {
      fontFamily: {
        headline: ["Poppins", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
      },
      colors: {
        primary: "#F8F6F2",
        secondary: "#6F0F3E",
        tertiary: "#106070",
        quaternary: "#080623",
        "primary-text": "#f2efdf",
        "secondary-text": "#0d0d0d",
        "tertiary-text": "#bf2633",
        link: "#A83E85",
        "link-hover": "#D32B9B",
        "link-active": "#7E446A",
        "primary-bg": "#0d0d0d",
        "secondary-bg": "#f2efdf",
        "tertiary-bg": "#e9ecef",
      },
    },
  },
  plugins: [],
};
