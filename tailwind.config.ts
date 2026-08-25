import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefaf5',
          100: '#d8f5e7',
          200: '#b6ebd3',
          300: '#82d9b2',
          400: '#4cae89',
          500: '#278d69',
          600: '#1f785b',
          700: '#1b604a',
          800: '#194c3d',
          900: '#153f34',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
