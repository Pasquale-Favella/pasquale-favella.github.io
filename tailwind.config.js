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
          "primary":'#77C66E'
        },
        light :{
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          "primary":'#269926'
        }
      },
    ],
  },
}