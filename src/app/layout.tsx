import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Footer } from '@/components/ui/Footer';
import { DataIntegrityGuard } from '@/components/DataIntegrityGuard';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  metadataBase: new URL('https://focuslab.app'),
  title: {
    default: 'FocusLab — Build focus you can measure',
    template: '%s | FocusLab',
  },
  description:
    'A free, local-first web app to measure attentional states and test evidence-labelled focus protocols.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: 'FocusLab — Build focus you can measure',
    description:
      'A free, local-first web app to measure attentional states and test evidence-labelled focus protocols.',
    url: 'https://focuslab.app',
    siteName: 'FocusLab',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FocusLab — Build focus you can measure',
    description:
      'A free, local-first web app to measure attentional states and test evidence-labelled focus protocols.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f766e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-surface text-text">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-contrast focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-text text-sm font-semibold min-h-[44px] inline-flex items-center"
        >
          Skip to main content
        </a>
        <ServiceWorkerRegister />
        <Navbar />
        <DataIntegrityGuard>
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 w-full max-w-prose mx-auto px-4 py-6 mb-16 md:mb-0 focus:outline-none"
          >
            {children}
          </main>
        </DataIntegrityGuard>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
