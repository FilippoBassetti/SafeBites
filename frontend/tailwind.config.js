/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        oooh: ['Oooh Baby'],
        agatholight: ['AgathoLight', 'sans-serif'],
        agathobold: ['AgathoBold', 'sans-serif'],
        agatholightmin: ['AgathoLightmin', 'sans-serif'],
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
 plugins: [],
}