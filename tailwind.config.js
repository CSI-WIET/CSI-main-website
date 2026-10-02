/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        manr: ['Manrope']
      },
      boxShadow: {
        'custom-top-bottom-strong': '0 -15px 30px -15px rgba(0, 0, 0, 0.5), 0 15px 30px -15px rgba(0, 0, 0, 0.5)',
        'bluish': '0 4px 6px -1px rgba(0, 0, 255, 0.1), 0 2px 4px -1px rgba(0, 0, 255, 0.06)',
        'inward': 'inset 0 4px 10px rgba(0, 0, 0, 0.8)',
      },
      
      
      colors: {
        dt: {
          blue: '#0F172A',
        },
        lt: {
          blue: '#2563EB',
        }
      },
    },
  },
  plugins: [],
}

