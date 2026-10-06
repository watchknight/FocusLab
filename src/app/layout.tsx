import type { Metadata, Viewport } from 'next';
import './globals.css';
import { textFont, displayFont, bnFont } from '@/app/fonts';
import { Navbar } from '@/components/ui/Navbar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { DataIntegrityGuard } from '@/components/DataIntegrityGuard';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { MotionProvider } from '@/components/motion/MotionProvider';

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
};

const THEME_SCRIPT = `
(function(){
  try {
    var key = 'focuslab:theme';
    var saved = localStorage.getItem(key);
    if (saved === 'light') {
      saved = 'daylight';
      localStorage.setItem(key, 'daylight');
    } else if (saved === 'dark') {
      saved = 'night';
      localStorage.setItem(key, 'night');
    } else if (saved === 'system') {
      saved = 'system';
      localStorage.setItem(key, 'system');
    }

    var forcedColors = window.matchMedia && window.matchMedia('(forced-colors: active)').matches;
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    var resolved = 'daylight';
    if (forcedColors) {
      resolved = 'contrast';
    } else if (saved === 'contrast') {
      resolved = 'contrast';
    } else if (saved === 'night') {
      resolved = 'night';
    } else if (saved === 'daylight') {
      resolved = 'daylight';
    } else {
      resolved = prefersDark ? 'night' : 'daylight';
    }

    var root = document.documentElement;
    root.setAttribute('data-theme', resolved);
    if (resolved === 'night') {
      root.classList.add('night', 'dark');
    } else {
      root.classList.remove('night', 'dark');
    }

    root.style.colorScheme = resolved === 'daylight' ? 'light' : 'dark';

    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    var bg = getComputedStyle(root).getPropertyValue('--bg').trim();
    if (bg) {
      meta.setAttribute('content', bg);
    }

    try {
      if (sessionStorage.getItem('focuslab:hero-seen')) {
        root.setAttribute('data-hero-seen', 'true');
      }
      var lowEnd = (
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
        (navigator.connection && navigator.connection.saveData)
      );
      if (lowEnd) {
        root.setAttribute('data-lowend', 'true');
        root.setAttribute('data-low-end', 'true');
      }
    } catch (e) {}
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${textFont.variable} ${displayFont.variable} ${bnFont.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_SCRIPT,
          }}
        />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-bg text-text antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent focus:border-2 focus:border-accent-edge focus:rounded-sm focus:shadow-elevation focus:outline-none focus:ring-2 focus:ring-ring text-sm font-semibold min-h-[44px] inline-flex items-center"
        >
          Skip to main content
        </a>
        <ServiceWorkerRegister />
        <MotionProvider>
          <Navbar />
          <DataIntegrityGuard>
            <main
              id="main-content"
              tabIndex={-1}
              className="flex-1 w-full focus:outline-none min-w-0 pb-[calc(56px+env(safe-area-inset-bottom,0px)+1.5rem)] lg:pb-8"
            >
              <Container className="py-6 min-w-0">{children}</Container>
            </main>
          </DataIntegrityGuard>
          <Footer />
          <BottomNav />
        </MotionProvider>
      </body>
    </html>
  );
}
