import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0B0B',
        card: '#171717',
        card2: '#1D1D1D',
        accent: '#FF2D2D',
        secondary: '#D7263D',
        muted: '#AAAAAA',
        success: '#00D084',
      },
      fontFamily: {
        display: ['var(--font-rajdhani)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(255,45,45,0.35)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.035)' },
        },
        blip: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.7)' },
        },
      },
      animation: {
        breathe: 'breathe 3.4s ease-in-out infinite',
        blip: 'blip 1.1s infinite',
      },
    },
  },
  plugins: [],
};
export default config;
