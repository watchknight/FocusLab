'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * GlobalEffects:
 * 1. Sets data-js-ready on <html> when client scripts mount.
 * 2. Refreshes ScrollTrigger after document.fonts.ready and route layout changes.
 */
export function GlobalEffects() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute('data-js-ready', 'true');

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }
  }, []);

  useEffect(() => {
    // Refresh ScrollTrigger instances after route changes
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
