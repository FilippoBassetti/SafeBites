/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
  theme: {
    extend:{
      fontFamily: {
        oooh: ['Oooh Baby'],
        agatholight: ['AgathoLight', 'sans-serif'],
        agathobold: ['AgathoBold', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
