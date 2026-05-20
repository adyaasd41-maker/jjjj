import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 2px 24px 0 rgba(0,0,0,0.07)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addComponents }: any) {
      addComponents({
        '.card': {
          borderRadius: '1.5rem',
          border: '1px solid rgba(226,232,240,0.7)',
          backgroundColor: 'rgba(255,255,255,0.85)',
          padding: '1.25rem',
          boxShadow: '0 2px 24px 0 rgba(0,0,0,0.07)',
          backdropFilter: 'blur(8px)',
        },
        '.btn': {
          borderRadius: '1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          fontWeight: '500',
          transition: 'all 0.15s',
          cursor: 'pointer',
        },
        '.input': {
          width: '100%',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          backgroundColor: '#fff',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          outline: 'none',
        },
      });
    },
  ],
};

export default config;
