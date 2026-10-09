'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';

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

  useEffect(() => {
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
