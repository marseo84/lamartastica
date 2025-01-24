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
        primary: "#E6AB30",
        secondary: "#4bc1bd",
        tertiary: "#6f0f3e",
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
