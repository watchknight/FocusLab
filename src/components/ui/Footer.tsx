'use client';

import React, { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from './Container';
import { TransitionLink, isCalmRoute } from '@/components/IrisTransition';
import { useT } from '@/i18n';
import { useCalm } from '@/components/motion/CalmProvider';
import { gsap, useGSAP, getFx } from '@/lib/gsap';

export const Footer: React.FC = () => {
  const { t } = useT();
  const pathname = usePathname();
  const { calm } = useCalm();
  const footerRef = useRef<HTMLElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const fx = getFx();
      if (fx === 'off' || calm || isCalmRoute(pathname) || !wordmarkRef.current || !footerRef.current) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!wordmarkRef.current || !footerRef.current) return;
        if (fx === 'full') {
          gsap.fromTo(
            wordmarkRef.current,
            { filter: 'blur(12px)', opacity: 0.2 },
            {
              filter: 'blur(0px)',
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: footerRef.current,
                start: 'top 95%',
                end: 'bottom bottom',
                scrub: true,
              },
            }
          );
        } else {
          // fx === 'lite': opacity reveal only, no blur
          gsap.fromTo(
            wordmarkRef.current,
            { opacity: 0.35 },
            {
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: footerRef.current,
                start: 'top 95%',
                end: 'bottom bottom',
                scrub: true,
              },
            }
          );
        }
      });
    },
    { scope: footerRef, dependencies: [pathname, calm] }
  );

  return (
    <footer
      ref={footerRef}
      data-chrome="footer"
      className="w-full border-t border-border bg-surface-2 pt-12 pb-16 mb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:mb-0 text-center space-y-8 select-none overflow-x-hidden"
    >
      <Container className="space-y-8 max-w-[1320px]">
        {/* Giant FocusLab wordmark that sharpens on scroll entry */}
        <div className="overflow-hidden py-4 max-w-full">
          <div
            ref={wordmarkRef}
            className="font-display font-extrabold text-[clamp(2.75rem,13vw,10.5rem)] leading-[0.92] tracking-[-0.02em] text-text transition-opacity text-center max-w-full break-normal"
          >
            FocusLab
          </div>
        </div>

        {/* Navigation links */}
        <nav
          aria-label="Footer links"
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-semibold text-muted"
        >
          <TransitionLink
            href="/about"
            className="hover:text-text transition-colors min-h-[44px] inline-flex items-center px-2 focus-visible:outline-2 focus-visible:outline-ring rounded-xs"
          >
            {t('footer.about')}
          </TransitionLink>
          <TransitionLink
            href="/privacy"
            className="hover:text-text transition-colors min-h-[44px] inline-flex items-center px-2 focus-visible:outline-2 focus-visible:outline-ring rounded-xs"
          >
            {t('footer.privacy')}
          </TransitionLink>
          <TransitionLink
            href="/disclaimer"
            className="hover:text-text transition-colors min-h-[44px] inline-flex items-center px-2 focus-visible:outline-2 focus-visible:outline-ring rounded-xs"
          >
            {t('footer.disclaimer')}
          </TransitionLink>
          <TransitionLink
            href="/learn"
            className="hover:text-text transition-colors min-h-[44px] inline-flex items-center px-2 focus-visible:outline-2 focus-visible:outline-ring rounded-xs"
          >
            {t('footer.evidence')}
          </TransitionLink>
        </nav>

        {/* Medical disclaimer and privacy notice */}
        <p className="text-xs sm:text-sm text-muted max-w-[66ch] mx-auto leading-relaxed">
          {t('footer.notice')}
        </p>
      </Container>
    </footer>
  );
};
