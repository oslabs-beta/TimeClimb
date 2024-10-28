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
      'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05);'
      },
      size:{
        '100': '28rem'
      }
    },
  },
  plugins: [],
}

