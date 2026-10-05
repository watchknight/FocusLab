import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://focuslab.app'),
  title: {
    default: 'FocusLab — Build focus you can measure',
    template: '%s | FocusLab',
  },
  description:
    'A free, local-first web app to measure attentional states and test evidence-labelled focus protocols.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-surface text-text">
        <Navbar />
        <main className="flex-1 w-full max-w-prose mx-auto px-4 py-6 mb-16 md:mb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
