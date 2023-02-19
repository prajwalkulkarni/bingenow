/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: ["./src/**/*.html", "./src/**/*.vue", "./src/**/*.tsx","dist/*.html"],
  theme: {
    extend: {},
  },
  plugins: [],
}
