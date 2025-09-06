/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'media', // Enable system preference detection
  theme: {
    extend: {
      colors: {
        // BikeForU Design System Colors
        'bike': {
          'background': '#f8f6f1',
          'secondary-bg': '#f0ede5',
          'card': '#ffffff',
          'text-primary': '#2d2d2d',
          'text-secondary': '#5a5a5a',
          'primary': '#654321',
          'secondary': '#A0522D',
          'accent': '#8B4513',
          'trail': '#228B22',
          'mountain': '#696969',
          'sky': '#87CEEB',
          'earth': '#8B4513',
          'stone': '#C0C0C0',
          'wood': '#A0522D',
          'moss': '#556B2F',
          'sunset': '#FF8C00',
          'water': '#4682B4',
          'border': '#d2b48c',
          'success': '#228B22',
          'warning': '#DAA520',
          'error': '#8B0000',
        },
        'bike-dark': {
          'background': '#1a1a1a',
          'secondary-bg': '#2a2a2a',
          'card': '#2a2a2a',
          'text-primary': '#e8e8e8',
          'text-secondary': '#b0b0b0',
          'primary': '#CD853F',
          'secondary': '#DEB887',
          'accent': '#D2691E',
          'trail': '#32CD32',
          'mountain': '#A9A9A9',
          'sky': '#4682B4',
          'earth': '#D2691E',
          'stone': '#808080',
          'wood': '#DEB887',
          'moss': '#6B8E23',
          'sunset': '#FFA500',
          'water': '#87CEEB',
          'border': '#696969',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.15s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.98)' },
        },
      },
      scale: {
        '98': '0.98',
      }
    },
  },
  plugins: [],
} 