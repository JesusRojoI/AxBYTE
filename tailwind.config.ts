import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta AxBYTE basada en el logo
        peach: {
          DEFAULT: '#F5C7B1',
          dark: '#E89B7A',
          light: '#FBE4D8',
        },
        sage: {
          DEFAULT: '#D9F0D3',
          dark: '#B5DFA8',
          light: '#EAF7E6',
        },
        neutralgray: {
          DEFAULT: '#808080',
          light: '#B0B0B0',
          dark: '#4A4A4A',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          soft: '#2A2A2A',
        },
        cream: '#FAFAF8',
      },
      fontFamily: {
        sans: ['var(--font-silkscreen)', 'system-ui', 'sans-serif'],
        display: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(128,128,128,0.15)',
        'peach': '0 10px 40px -10px rgba(245,199,177,0.5)',
        'sage': '0 10px 40px -10px rgba(217,240,211,0.6)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'flicker': 'flicker 3s linear infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'triangle-drift': 'triangleDrift 15s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        triangleDrift: {
          '0%, 100%': { transform: 'translate(0,0) rotate(0deg)' },
          '33%': { transform: 'translate(20px,-15px) rotate(10deg)' },
          '66%': { transform: 'translate(-15px,20px) rotate(-8deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;