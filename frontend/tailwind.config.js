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
        // Sports & Martial Arts Identity Design System
        primary: {
          navy: '#102137',
          DEFAULT: '#102137',
        },
        secondary: {
          navy: '#183B5B',
          DEFAULT: '#183B5B',
        },
        navy: {
          950: '#0B1726', // Deep Navy
          900: '#102137', // Primary Navy
          850: '#142b46',
          800: '#183B5B', // Secondary Blue
          700: '#224d77',
          600: '#2d6296',
          500: '#3e7ebc',
          400: '#649dd6',
          300: '#95bee9',
          200: '#c5dcf6',
          100: '#e5effb',
          50: '#f2f7fd',
        },
        gold: {
          antique: '#C6A04A', // Gold
          light: '#D9B96E',   // Light Gold
          DEFAULT: '#C6A04A',
          950: '#352504',
          900: '#523c0b',
          800: '#7a5a15',
          700: '#a37b25',
          600: '#C6A04A',
          500: '#D9B96E',
          400: '#e4ca8c',
          300: '#eddcae',
          200: '#f5edd1',
          100: '#faf6e8',
          50: '#fdfbf4',
        },
        brand: {
          navy: '#102137',
          navyDeep: '#0B1726',
          navySecondary: '#183B5B',
          gold: '#C6A04A',
          goldLight: '#D9B96E',
          white: '#FFFFFF',
          lightBg: '#F8FAFC',
          text: '#182332',
          textMuted: '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        outfit: ['Outfit', 'Poppins', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'sports-sm': '0 1px 3px 0 rgba(16, 33, 55, 0.06), 0 1px 2px -1px rgba(16, 33, 55, 0.04)',
        'sports': '0 4px 14px -2px rgba(16, 33, 55, 0.08), 0 2px 6px -2px rgba(16, 33, 55, 0.04)',
        'sports-lg': '0 16px 32px -4px rgba(16, 33, 55, 0.12), 0 4px 12px -3px rgba(16, 33, 55, 0.06)',
        'gold-glow': '0 0 25px -4px rgba(198, 160, 74, 0.4)',
        'navy-glow': '0 0 25px -4px rgba(16, 33, 55, 0.4)',
      },
    },
  },
  plugins: [],
}
