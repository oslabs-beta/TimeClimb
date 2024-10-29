/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container:{
      center: true,
    },
    extend: {
      boxShadow: {
      'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05);',
      'glow': '0 0 0 2px rgb(147 51 234), 0 0 0 3px white, 0 0 0 5px rgb(147 51 234);'
      },
      size:{
        '100': '28rem',
        '124': '50rem'
      }
    },
  },
  plugins: [],
}