/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src//*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        oooh: ['Oooh Baby'],
        agatholight: ['AgathoLight', 'sans-serif'],
        agathobold: ['AgathoBold', 'sans-serif'],
      },
      colors: {
        'green-light': '#287233',
        'green-dark': '#18491F',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}