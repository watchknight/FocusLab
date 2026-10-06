import localFont from 'next/font/local';
import { Archivo, Hind_Siliguri } from 'next/font/google';

export const textFont = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-italic.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-text',
  display: 'swap',
  preload: true,
});

export const displayFont = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

export const bnFont = Hind_Siliguri({
  weight: ['400', '600'],
  subsets: ['bengali'],
  preload: false,
  variable: '--font-bn',
  display: 'swap',
});

