import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        champagne: {
          50: '#FDFBF7',
          100: '#FAF5EA',
          200: '#F4E8D0',
          300: '#EBD7B0',
          400: '#DEC087',
          500: '#D4AF37', // Gold champion
          600: '#C5A059',
          700: '#A6823C',
          800: '#85662B',
          900: '#5C441A',
        },
        navy: {
          800: '#1C2541',
          900: '#0B132B',
          950: '#060B18',
        },
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F5EFEB',
          300: '#ECE2D8',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F4E8D0 0%, #D4AF37 50%, #A6823C 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent)',
        'dark-gradient': 'radial-gradient(ellipse at top, #1C2541 0%, #0B132B 50%, #060B18 100%)',
        'pearl-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.35)',
        'card-soft': '0 10px 30px -10px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.02)',
      },
    },
  },
  plugins: [],
};

export default config;
