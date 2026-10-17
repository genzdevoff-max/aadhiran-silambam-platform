/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#060a0b',
          900: '#0a1012',
          850: '#0f1619',
          800: '#141d20',
          700: '#1e292a',
          600: '#2a383a',
          500: '#3f5053',
          400: '#647476',
          300: '#95a4a6',
          200: '#c4cfd0',
          100: '#e8eeee',
        },
        crimson: {
          900: '#040942',
          800: '#06106a',
          700: '#08179c',
          600: '#020ee3',
          500: '#2233ef',
          400: '#4b60f6',
          300: '#7d90fa',
        },
        gold: {
          700: '#7a6608',
          600: '#a8890c',
          500: '#c6ad11',
          400: '#f5cf16',
          300: '#f8da4d',
          200: '#fbe88f',
          100: '#fdf5cf',
        },
        cobalt: {
          950: '#03062b',
          900: '#040942',
          800: '#071063',
          700: '#0a1890',
          600: '#0f24c9',
          500: '#2f63f9',
          400: '#5f88fb',
          300: '#8aa4df',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cinzel', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-crimson': '0 0 25px -5px rgba(2, 14, 227, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(245, 207, 22, 0.3)',
      }
    },
  },
  plugins: [],
}
