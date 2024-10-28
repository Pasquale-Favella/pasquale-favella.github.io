const daisyuiColorObj = require('daisyui/src/theming/index')

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
      },
	  colors: {
        border: daisyuiColorObj['base-content'],
        input: daisyuiColorObj['base-content'],
        ring: daisyuiColorObj['base-content'],
        background: daisyuiColorObj['base-100'],
        foreground: daisyuiColorObj['base-content'],
        primary: {
          DEFAULT: daisyuiColorObj['primary'],
          foreground: daisyuiColorObj['primary-content'],
        },
        secondary: {
          DEFAULT: daisyuiColorObj['secondary'],
          foreground: daisyuiColorObj['secondary-content'],
        },
        destructive: {
          DEFAULT: daisyuiColorObj['error'],
          foreground: daisyuiColorObj['error-content'],
        },
        muted: {
          DEFAULT: daisyuiColorObj['base-300'],
          foreground: daisyuiColorObj['base-content'],
        },
        accent: {
          DEFAULT: daisyuiColorObj['accent'],
          foreground: daisyuiColorObj['accent-content'],
        },
        popover: {
          DEFAULT: daisyuiColorObj['base-100'],
          foreground: daisyuiColorObj['base-content'],
        },
        card: {
          DEFAULT: daisyuiColorObj['base-100'],
          foreground: daisyuiColorObj['base-content'],
        },
      },
      borderRadius: {
        lg: 'var(--rounded-btn)',
        md: 'calc(var(--rounded-btn) - 2px)',
        sm: 'calc(var(--rounded-btn) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require("daisyui"),require('@tailwindcss/typography'),require('@tailwindcss/aspect-ratio'), require("tailwindcss-animate")],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "primary":'#5abf4e',
          "secondary": "#00e353",
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