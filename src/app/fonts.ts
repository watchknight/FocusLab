import localFont from 'next/font/local';

export const textFont = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2',
      weight: '200 800',
      style: 'normal',
    },
  ],
  variable: '--font-text',
  display: 'swap',
  preload: true,
});

export const displayFont = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2',
      weight: '200 800',
      style: 'normal',
    },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

export const monoFont = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/martian-mono/files/martian-mono-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/martian-mono/files/martian-mono-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
});

export const bnFont = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/anek-bangla/files/anek-bangla-bengali-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/anek-bangla/files/anek-bangla-bengali-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  preload: false,
  variable: '--font-bn',
  display: 'swap',
});
