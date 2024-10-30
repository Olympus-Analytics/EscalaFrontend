/** @type {import('tailwindcss').Config} */
import animations from '@midudev/tailwind-animations'
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
    colors: {
      "primary": "#252B6D",
      "secondary": "#EF7422",
      "terciary": '#EFBF54',
      "quaternary": '#EEFEFF',
      "secondary-trans": '#ef7422a3',
      "black": "#000",
    }
  },
  plugins: [
    animations
  ],
}

