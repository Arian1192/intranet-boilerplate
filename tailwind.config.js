/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Carbón neutro (re-tema del live). Los stops 50/100/400/500/600/700
        // salen del live; 200/300 se interpolan entre 100 y 400 siguiendo la
        // curva de las rampas neutras de Tailwind (200 al ~16 % del tramo,
        // 300 al ~41 %, como slate) y 800/900 continúan oscureciendo desde 700.
        brand: {
          50: '#F6F6F7',
          100: '#ECECED',
          200: '#DBDBDE',
          300: '#C1C1C6',
          400: '#84848D',
          500: '#5F5F68',
          600: '#44444C',
          700: '#37373D',
          800: '#2B2B30',
          900: '#1F1F23',
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
