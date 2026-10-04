import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      maxWidth: {
        prose: '65ch',
      },
      colors: {
        surface: {
          primary: 'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          tertiary: 'var(--surface-tertiary)',
          border: 'var(--border-subtle)',
          'border-strong': 'var(--border-strong)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        teal: {
          accent: 'var(--teal-accent)',
          'accent-hover': 'var(--teal-hover)',
          'accent-subtle': 'var(--teal-subtle)',
          'accent-contrast': 'var(--teal-contrast)',
        },
        evidence: {
          strong: 'var(--evidence-strong)',
          moderate: 'var(--evidence-moderate)',
          mixed: 'var(--evidence-mixed)',
          emerging: 'var(--evidence-emerging)',
          unsupported: 'var(--evidence-unsupported)',
        },
      },
      fontWeight: {
        regular: '400',
        semibold: '600',
      },
      spacing: {
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '8': '64px',
      },
    },
  },
  plugins: [],
};

export default config;
