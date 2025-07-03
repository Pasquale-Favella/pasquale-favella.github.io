/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minHeight: {
        'layout': '92vh',
      },
      typography : {
        DEFAULT : {
          css : {
            pre : {
              'background-color' : '#282c34'
            }
          }
        }
      }
    },
  },
  plugins: [require("daisyui"),require('@tailwindcss/typography'),require("tailwindcss-animate"),require('@tailwindcss/aspect-ratio')],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "primary":'#5abf4e',
          "secondary": "#1FD65F",
          "accent": "#D99330",
          "neutral": "#110E0E",
          "base-100": "#171212",
          "base-300": "#1E1E1E",
          "primary-content" : "rgb(166, 173, 186,0.1)"
        },
        light :{
          ...require("daisyui/src/theming/themes")["light"],
          "primary":'#269926',
          "warning": "#f2920a",
          "primary-content" : "whitesmoke"
        }
      },
    ],
  },
}