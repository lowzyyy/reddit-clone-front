/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '450px',
      '3xl': '2000px',
      ...defaultTheme.screens
    },
    extend: {
      keyframes: {
        rolFromUp: {
          '0%': { height: 0 },
          '100%': { height: 'auto' }
        },
        slideFromRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        rolFromUp: 'rolFromUp 1s',
        slideRight: 'slideFromRight 0.5s'
      }
    }
  }
}
