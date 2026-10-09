'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Lens } from '@/components/Lens';
import { TransitionLink, isCalmRoute } from '@/components/IrisTransition';
import { useT, I18nKey } from '@/i18n';
import { useCalm } from '@/components/motion/CalmProvider';
import { handleFocusTrapKeyDown } from '@/lib/focus-trap';
import { durations, easings, useGsapPresence } from '@/lib/motion';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';

interface NavItem {
  key: I18nKey;
  href: string;
}

const PRIMARY_FIVE: NavItem[] = [
  { key: 'nav.check', href: '/check' },
  { key: 'nav.focus', href: '/focus' },
  { key: 'nav.activities', href: '/activities' },
  { key: 'nav.experiments', href: '/experiments' },
  { key: 'nav.insights', href: '/insights' },
];

const EXTRA_TWO: NavItem[] = [
  { key: 'nav.sounds', href: '/sounds' },
  { key: 'nav.learn', href: '/learn' },
];

const POPOVER_ITEMS: NavItem[] = [...EXTRA_TWO, { key: 'nav.about', href: '/about' }];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { calm } = useCalm();
  const { t } = useT();
  const headerRef = useRef<HTMLElement | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreTriggerRef = useRef<HTMLButtonElement | null>(null);
  const moreScopeRef = useRef<HTMLDivElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  const { isRendered, onExitComplete } = useGsapPresence(moreOpen);

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header || calm || isCalmRoute(pathname)) {
        if (header) header.classList.remove('header-glass');
        return;
      }

      const st = ScrollTrigger.create({
        start: 24,
        end: 999999,
        toggleClass: { targets: header, className: 'header-glass' },
      });

      return () => {
        st.kill();
        header.classList.remove('header-glass');
      };
    },
    { scope: headerRef, dependencies: [pathname, calm] }
  );

  useGSAP(
    () => {
      if (!isRendered || !moreMenuRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (moreOpen) {
          gsap.fromTo(moreMenuRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: durations.quick, ease: easings.out });
        } else {
          gsap.to(moreMenuRef.current, { opacity: 0, scale: 0.96, duration: 0.14, ease: easings.out, onComplete: onExitComplete });
        }
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (moreOpen) {
          gsap.fromTo(moreMenuRef.current, { opacity: 0 }, { opacity: 1, duration: durations.instant, ease: easings.out });
        } else {
          gsap.to(moreMenuRef.current, { opacity: 0, duration: durations.instant, ease: easings.out, onComplete: onExitComplete });
        }
      });
    },
    { scope: moreScopeRef, dependencies: [moreOpen, isRendered] }
  );

  const closeMore = useCallback(() => {
    setMoreOpen(false);
    moreTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node) &&
        moreTriggerRef.current && !moreTriggerRef.current.contains(e.target as Node)
      ) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [moreOpen]);

  useEffect(() => {
    if (moreOpen && moreMenuRef.current) moreMenuRef.current.querySelector<HTMLAnchorElement>('a')?.focus();
  }, [moreOpen]);

  const renderNavLink = (item: NavItem) => {
    const active = pathname === item.href;
    const label = t(item.key);
    return (
      <TransitionLink
        key={item.href}
        href={item.href}
        aria-current={active ? 'page' : undefined}
        className={clsx(
          'group relative min-h-[44px] px-3 py-2 text-sm font-semibold inline-flex items-center justify-center select-none transition-colors rounded-xs focus-visible:outline-2 focus-visible:outline-ring whitespace-nowrap',
          active ? 'text-text font-bold' : 'text-muted hover:text-text'
        )}
      >
        <span className="relative inline-flex flex-col h-[1.3em] overflow-hidden leading-[1.3em]">
          <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full motion-reduce:group-hover:transform-none">
            {label}
          </span>
          <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full motion-reduce:hidden">
            {label}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={clsx(
            'absolute bottom-1.5 left-2.5 right-2.5 h-[2px] bg-text origin-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none pointer-events-none',
            active ? 'scale-x-100' : 'scale-x-0'
          )}
        />
      </TransitionLink>
    );
  };

  const isPopoverActive = POPOVER_ITEMS.some((item) => pathname === item.href);

  return (
    <header
      ref={headerRef}
      data-chrome="header"
      className="w-full sticky top-0 z-40 h-14 md:h-16 pt-[env(safe-area-inset-top,0px)] bg-bg/85 backdrop-blur-md border-b border-border transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300"
    >
      <Container className="h-full flex items-center justify-between gap-2 sm:gap-3 min-w-0 !max-w-none px-3 sm:px-6 md:px-[clamp(20px,5vw,72px)]">
        <TransitionLink
          href="/"
          aria-label="FocusLab home"
          className="flex items-center gap-2 sm:gap-2.5 min-h-[44px] shrink-0 text-text group focus-visible:outline-2 focus-visible:outline-ring rounded-full px-1 py-1"
        >
          <Lens open={0.42} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 transition-transform duration-300 group-hover:scale-105" />
          <span className="font-display font-extrabold text-lg sm:text-xl tracking-[-0.02em] leading-none text-text">
            FocusLab
          </span>
        </TransitionLink>

        <nav aria-label="Main Navigation" className="relative hidden lg:flex items-center gap-0.5 xl:gap-1 min-w-0">
          {PRIMARY_FIVE.map(renderNavLink)}
          <div className="hidden xl:flex items-center gap-1">{EXTRA_TWO.map(renderNavLink)}</div>

          <div ref={moreScopeRef} className="relative xl:hidden">
            <button
              ref={moreTriggerRef}
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && moreOpen) {
                  e.preventDefault();
                  closeMore();
                }
              }}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              className={clsx(
                'min-h-[44px] px-3 py-2 rounded-xs text-sm font-semibold inline-flex items-center transition-colors select-none focus-visible:outline-2 focus-visible:outline-ring whitespace-nowrap',
                isPopoverActive || moreOpen ? 'text-text font-bold bg-surface-2' : 'text-muted hover:text-text hover:bg-surface-2'
              )}
            >
              <span>{t('nav.more')}</span>
            </button>
            {isRendered && (
              <div
                ref={moreMenuRef}
                role="menu"
                aria-label="Additional navigation links"
                onKeyDown={(e) => handleFocusTrapKeyDown(e, moreMenuRef.current, closeMore)}
                className="absolute left-0 top-full mt-1.5 z-50 min-w-[150px] rounded-md border border-border bg-surface shadow-elevation p-1 space-y-0.5 origin-top-left"
              >
                {POPOVER_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <TransitionLink
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setMoreOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={clsx(
                        'min-h-[44px] w-full px-3 py-2 text-sm font-semibold rounded-sm text-left flex items-center transition-colors focus-visible:outline-2 focus-visible:outline-ring whitespace-nowrap',
                        active ? 'bg-surface-2 text-text font-bold' : 'text-muted hover:text-text hover:bg-surface-2'
                      )}
                    >
                      {t(item.key)}
                    </TransitionLink>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <LanguageToggle />
          <ThemeToggle />
          <TransitionLink
            href="/check"
            className="hidden xl:inline-flex min-h-[44px] px-5 py-2 text-sm font-semibold rounded-full bg-primary-bg text-primary-text items-center justify-center hover:opacity-90 transition select-none active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring whitespace-nowrap"
          >
            {t('nav.startCheck')}
          </TransitionLink>
        </div>
      </Container>
    </header>
  );
};
