import type { Metadata, Viewport } from 'next';
import './globals.css';
import { textFont, displayFont, monoFont, bnFont } from '@/app/fonts';
import { Navbar } from '@/components/ui/Navbar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { DataIntegrityGuard } from '@/components/DataIntegrityGuard';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { CalmProvider } from '@/components/motion/CalmProvider';
import { IrisProvider } from '@/components/IrisTransition';
import { FxFullDecorations } from '@/components/fx/FxFullDecorations';
import { GlobalEffects } from '@/components/GlobalEffects';

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
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'FocusLab — Build focus you can measure',
    description:
      'A free, local-first web app to measure attentional states and test evidence-labelled focus protocols.',
    url: 'https://focuslab.app',
    siteName: 'FocusLab',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FocusLab — Build focus you can measure',
    description:
      'A free, local-first web app to measure attentional states and test evidence-labelled focus protocols.',
    images: ['/og.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const HEAD_INIT_SCRIPT = `
(function(){
  try {
    var key = 'focuslab:theme';
    var saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'daylight' || saved === 'studio') {
      saved = 'studio';
      localStorage.setItem(key, 'studio');
    } else if (saved === 'dark' || saved === 'night' || saved === 'darkroom') {
      saved = 'darkroom';
      localStorage.setItem(key, 'darkroom');
    } else if (saved === 'contrast') {
      saved = 'contrast';
      localStorage.setItem(key, 'contrast');
    } else {
      saved = 'system';
    }

    var forcedColors = window.matchMedia && window.matchMedia('(forced-colors: active)').matches;
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    var resolved = 'studio';
    if (forcedColors) {
      resolved = 'contrast';
    } else if (saved === 'contrast') {
      resolved = 'contrast';
    } else if (saved === 'darkroom') {
      resolved = 'darkroom';
    } else if (saved === 'studio') {
      resolved = 'studio';
    } else {
      resolved = prefersDark ? 'darkroom' : 'studio';
    }

    var root = document.documentElement;
    root.setAttribute('data-theme', resolved);
    if (resolved === 'darkroom') {
      root.classList.add('darkroom', 'dark');
    } else {
      root.classList.remove('darkroom', 'dark');
    }
    root.style.colorScheme = resolved === 'studio' ? 'light' : 'dark';

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

    // Run FX_SCRIPT logic before paint
    var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var nav = navigator;
    var isSlowConn = !!(nav.connection && (nav.connection.saveData || nav.connection.effectiveType === 'slow-2g' || nav.connection.effectiveType === '2g' || nav.connection.effectiveType === '3g'));
    var low = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4 || isSlowConn;
    root.dataset.fx = reduced ? 'off' : (low ? 'lite' : 'full');

    var sp = new URLSearchParams(window.location.search);
    if (sp.get('theme')) {
      resolved = sp.get('theme');
      root.setAttribute('data-theme', resolved);
      if (resolved === 'darkroom') root.classList.add('darkroom', 'dark');
      else root.classList.remove('darkroom', 'dark');
      root.style.colorScheme = resolved === 'studio' ? 'light' : 'dark';
    }
    if (sp.get('fx')) {
      root.dataset.fx = sp.get('fx');
    }
    if (sp.get('skipIntro')) {
      try {
        localStorage.setItem('focuslab:onboarded', 'true');
        sessionStorage.setItem('focuslab:intro', '1');
      } catch (e) {}
      root.dataset.heroSeen = '1';
    }

    if (sessionStorage.getItem('focuslab:intro')) {
      root.dataset.heroSeen = '1';
    }
  } catch (e) {
    document.documentElement.dataset.fx = 'off';
  }
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
      className={`${textFont.variable} ${displayFont.variable} ${monoFont.variable} ${bnFont.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: HEAD_INIT_SCRIPT,
          }}
        />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-bg text-text antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-bg focus:text-primary-text focus:border-2 focus:border-border-strong focus:rounded-sm focus:shadow-elevation focus:outline-none focus:ring-2 focus:ring-ring text-sm font-semibold min-h-[44px] inline-flex items-center"
        >
          Skip to main content
        </a>
        <ServiceWorkerRegister />
        <CalmProvider>
          <IrisProvider>
            <GlobalEffects />
            <FxFullDecorations />
            <div className="grain" aria-hidden="true" />
            <Navbar />
            <DataIntegrityGuard>
              <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 w-full focus:outline-none min-w-0 pb-[calc(56px+env(safe-area-inset-bottom,0px)+1.5rem)] lg:pb-8"
              >
                {children}
              </main>
            </DataIntegrityGuard>
            <Footer />
            <BottomNav />
          </IrisProvider>
        </CalmProvider>
      </body>
    </html>
  );
}
