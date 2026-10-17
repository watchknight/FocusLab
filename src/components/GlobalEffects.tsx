'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { isCalmRoute } from '@/components/IrisTransition';

/**
 * GlobalEffects:
 * 1. Sets data-js-ready on <html> when GSAP mounts.
 * 2. Refreshes ScrollTrigger after document.fonts.ready and route layout changes.
 */
export function GlobalEffects() {
  const pathname = usePathname();

  useGSAP(() => {
    document.documentElement.setAttribute('data-js-ready', 'true');
  });

  // 1. Refresh ScrollTrigger after document.fonts.ready and font face loading events
  useEffect(() => {
    if (typeof document === 'undefined' || !('fonts' in document)) return;

    const onFontsReady = () => {
      if (!isCalmRoute(pathname)) {
        ScrollTrigger.refresh();
      }
    };

    document.fonts.ready.then(onFontsReady);

    if ('addEventListener' in document.fonts) {
      document.fonts.addEventListener('loadingdone', onFontsReady);
      return () => {
        document.fonts.removeEventListener('loadingdone', onFontsReady);
      };
    }
  }, [pathname]);

  // 2. Refresh ScrollTrigger after route layout changes
  useEffect(() => {
    if (isCalmRoute(pathname)) return;

    // Immediate refresh on route change
    ScrollTrigger.refresh();

    // Re-verify after font metrics settle on new route
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (!isCalmRoute(pathname)) {
          ScrollTrigger.refresh();
        }
      });
    }

    // Refresh after DOM layout commit and paint
    const rafId = requestAnimationFrame(() => {
      if (!isCalmRoute(pathname)) {
        ScrollTrigger.refresh();
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  // 3. Refresh ScrollTrigger after content layout changes (ResizeObserver)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') return;
    if (isCalmRoute(pathname)) return;

    let timeoutId: NodeJS.Timeout | null = null;
    const ro = new ResizeObserver(() => {
      if (timeoutId) clearTimeout(timeoutId);
      // Throttle/debounce to at most ~3 times per second (300ms) to respect motion rules
      timeoutId = setTimeout(() => {
        if (!isCalmRoute(pathname)) {
          ScrollTrigger.refresh();
        }
      }, 300);
    });

    const target = document.getElementById('main-content') || document.body;
    if (target) {
      ro.observe(target);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      ro.disconnect();
    };
  }, [pathname]);

  return null;
}
