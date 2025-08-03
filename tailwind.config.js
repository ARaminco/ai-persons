/** @type {import('tailwindcss').Config} */
export default {
  // Add dark mode support with the 'class' strategy
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // We can add custom fonts, colors, etc. here later
      fontFamily: {
        vazir: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
