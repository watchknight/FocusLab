'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { ReflexLamp } from '@/components/ReflexLamp';
import { useT } from '@/i18n';

// Dynamically import pointer lamp to isolate Motion springs & grid canvas
const HeroPointerLamp = dynamic(
  () => import('./HeroPointerLamp').then((mod) => mod.HeroPointerLamp),
  { ssr: false }
);

export const HeroLamp: React.FC = () => {
  const { t } = useT();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem('focuslab:hero-seen', 'true');
      document.documentElement.setAttribute('data-hero-seen', 'true');
    } catch {
      // Ignore private browsing storage quota issues
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-md border border-border bg-surface-2 p-5 sm:p-8 lg:p-10 shadow-elevation"
    >
      {/* Dynamic pointer lamp overlay — fine pointer only, pauses off-screen */}
      <HeroPointerLamp containerRef={heroRef} />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Copy & CTAs */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-text leading-[1.12]">
            <span className="block hero-focus-line-1">Build focus</span>
            <span className="block hero-focus-line-2">you can measure.</span>
          </h1>

          <p className="hero-focus-line-2 text-sm sm:text-base lg:text-lg text-muted leading-relaxed max-w-[62ch]">
            {t('home.subhead')}
          </p>

          <div className="hero-focus-line-2 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link href="/check" className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="w-full sm:w-auto px-6 py-3 min-h-[44px] text-sm font-semibold"
              >
                {t('home.ctaCheck')}
              </Button>
            </Link>

            <Link
              href="/learn/how-we-rate"
              className="text-sm font-semibold text-link underline hover:text-text min-h-[44px] inline-flex items-center justify-center sm:justify-start"
            >
              {t('home.ctaLearn')}
            </Link>
          </div>
        </div>

        {/* Right column: ReflexLamp demo card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
          <ReflexLamp />
        </div>
      </div>
    </section>
  );
};

export default HeroLamp;
