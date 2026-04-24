/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#01696f',
          hover:   '#015458',
          faint:   'rgba(1,105,111,0.10)',
          faint2:  'rgba(1,105,111,0.17)',
          dark:    '#029099',
        },
        bg: {
          DEFAULT: '#f7f6f2',
          subtle:  '#efede6',
          dark:    '#171614',
          'dark-subtle': '#1b1a17',
        },
        surface: {
          DEFAULT: '#ffffff',
          2: '#f3f1ea',
          3: '#eae8e0',
          inv: '#18170f',
          dark: '#1e1d1a',
          'dark-2': '#252420',
          'dark-3': '#2c2a25',
        },
        ink: {
          DEFAULT: '#18170f',
          2: '#3b3a30',
          3: '#6c6a60',
          4: '#9c9a90',
        },
        border: {
          DEFAULT: 'rgba(24,23,15,0.08)',
          2: 'rgba(24,23,15,0.14)',
          3: 'rgba(24,23,15,0.22)',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Boska', 'Georgia', 'serif'],
        mono:    ['"SF Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        1: '0 1px 2px rgba(24,23,15,0.05)',
        2: '0 1px 4px rgba(24,23,15,0.07), 0 4px 12px rgba(24,23,15,0.04)',
        3: '0 4px 16px rgba(24,23,15,0.09), 0 14px 40px rgba(24,23,15,0.06)',
        4: '0 8px 32px rgba(24,23,15,0.12), 0 24px 64px rgba(24,23,15,0.08)',
      },
      animation: {
        shimmer: 'shimmer 1.5s ease infinite',
        'toast-in': 'toastIn .22s cubic-bezier(0.16,1,0.3,1)',
        'fade-in': 'fadeIn 150ms ease forwards',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        toastIn: { from: { transform: 'translateX(12px) scale(.96)', opacity: 0 }, to: { transform: 'none', opacity: 1 } },
        fadeIn:  { from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'none' } },
      },
    },
  },
  plugins: [],
}
