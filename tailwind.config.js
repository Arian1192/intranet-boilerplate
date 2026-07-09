/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F7F3FB',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#773C9F',
          700: '#633383',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        status: {
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          neutral: '#94A3B8',
        },
        news: {
          card: '#F7F6FC',
          border: '#EEE3F6',
        },
      },
    },
  },
  plugins: [],
};
