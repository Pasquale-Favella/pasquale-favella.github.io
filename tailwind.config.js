/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"),require('@tailwindcss/typography'),require('@tailwindcss/aspect-ratio')],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          "primary":'#77C66E',
          "secondary": "#1FD65F",
          "accent": "#D99330",
          "neutral": "#110E0E",
          "base-100": "#171212",
          "base-300": "#1E1E1E"
        },
        light :{
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          "primary":'#269926'
        }
      },
    ],
  },
}