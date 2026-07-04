import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        menu: {
          accent: 'var(--menu-accent)',
          text: 'var(--menu-text)',
          'text-secondary': 'var(--menu-text-secondary)',
          card: 'var(--menu-card)',
          border: 'var(--menu-border)',
        },
      },
      boxShadow: {
        menu: 'var(--menu-shadow)',
        'menu-hover': 'var(--menu-shadow-hover)',
      },
    },
  },
  plugins: [],
};

export default config;
