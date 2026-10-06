import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="night"]'],
  theme: {
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      maxWidth: {
        prose: '70ch',
        reading: '720px',
        container: '1200px',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        elevation: 'var(--shadow-elevation)',
      },
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.25rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.6' }],
        h1: ['var(--font-size-h1)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['var(--font-size-h2)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        h3: ['var(--font-size-h3)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      fontFamily: {
        sans: ['var(--font-text)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        bengali: ['var(--font-bn)', 'sans-serif'],
      },
      colors: {
        bg: 'var(--bg)',
        'bg-deep': 'var(--bg-deep)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        'border-subtle': 'var(--border-subtle)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'on-accent': 'var(--on-accent)',
        'accent-edge': 'var(--accent-edge)',
        'accent-contrast': 'var(--on-accent)',
        link: 'var(--link)',
        ring: 'var(--ring)',
        'tier-strong': 'var(--tier-strong)',
        'tier-moderate': 'var(--tier-moderate)',
        'tier-mixed': 'var(--tier-mixed)',
        'tier-emerging': 'var(--tier-emerging)',
        'tier-not-supported': 'var(--tier-not-supported)',
        signal: 'var(--link)',
        lamp: 'var(--accent)',
        ok: 'var(--ok)',
        warn: 'var(--warn)',
      },
    },
  },
  plugins: [],
};

export default config;
