import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'FocusLab — Evidence-Labelled Focus Tools',
  description:
    'A free, local-first web app that helps people build focus through evidence-labelled activities and lets them test what works for them. No tracking, no accounts.',
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
      <body className="min-h-screen flex flex-col bg-surface-primary text-content-primary">
        <Navbar />
        <main className="flex-1 w-full max-w-prose mx-auto px-4 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
