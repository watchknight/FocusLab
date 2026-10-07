'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useT, I18nKey } from '@/i18n';
import { handleFocusTrapKeyDown } from '@/lib/focus-trap';
import { durations, easings, useGsapPresence } from '@/lib/motion';
import { gsap, useGSAP } from '@/lib/gsap';

interface NavItem { key: I18nKey; href: string }

const PRIMARY_NAV: NavItem[] = [
  { key: 'nav.check', href: '/check' },
  { key: 'nav.focus', href: '/focus' },
  { key: 'nav.activities', href: '/activities' },
  { key: 'nav.experiments', href: '/experiments' },
  { key: 'nav.insights', href: '/insights' },
];
const EXTRA_NAV: NavItem[] = [
  { key: 'nav.sounds', href: '/sounds' },
  { key: 'nav.learn', href: '/learn' },
  { key: 'nav.about', href: '/about' },
];
const POPOVER_NAV: NavItem[] = [...EXTRA_NAV];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useT();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreTriggerRef = useRef<HTMLButtonElement | null>(null);
  const moreScopeRef = useRef<HTMLDivElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const hasPositioned = useRef(false);
  const [resizeTick, setResizeTick] = useState(0);

  const { isRendered: isMoreRendered, onExitComplete: onMoreExitComplete } = useGsapPresence(moreOpen);

  useEffect(() => {
    if (!navRef.current) return;
    const ro = new ResizeObserver(() => setResizeTick((tk) => tk + 1));
    ro.observe(navRef.current);
    navRef.current.querySelectorAll('a').forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  useGSAP(() => {
    if (!navRef.current || !indicatorRef.current) return;
    const activeEl = navRef.current.querySelector<HTMLElement>('a[aria-current="page"]');
    const mm = gsap.matchMedia();
    if (!activeEl) {
      gsap.to(indicatorRef.current, { opacity: 0, duration: durations.quick, ease: easings.out, overwrite: 'auto' });
      return;
    }
    const navRect = navRef.current.getBoundingClientRect();
    const linkRect = activeEl.getBoundingClientRect();
    const targetX = linkRect.left - navRect.left;
    const targetScaleX = Math.max(1, linkRect.width);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (!hasPositioned.current) {
        hasPositioned.current = true;
        gsap.set(indicatorRef.current, { x: targetX, scaleX: targetScaleX, opacity: 1 });
      } else {
        gsap.to(indicatorRef.current, { x: targetX, scaleX: targetScaleX, opacity: 1, duration: durations.quick, ease: easings.out, overwrite: 'auto' });
      }
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      hasPositioned.current = true;
      gsap.set(indicatorRef.current, { x: targetX, scaleX: targetScaleX });
      gsap.to(indicatorRef.current, { opacity: 1, duration: durations.instant, ease: easings.out, overwrite: 'auto' });
    });
  }, { scope: navRef, dependencies: [pathname, resizeTick] });

  useGSAP(() => {
    if (!isMoreRendered || !moreMenuRef.current) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (moreOpen) {
        gsap.fromTo(moreMenuRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: durations.quick, ease: easings.out, overwrite: 'auto' });
      } else {
        gsap.to(moreMenuRef.current, { opacity: 0, scale: 0.96, duration: 0.14, ease: easings.out, overwrite: 'auto', onComplete: onMoreExitComplete });
      }
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      if (moreOpen) {
        gsap.fromTo(moreMenuRef.current, { opacity: 0 }, { opacity: 1, duration: durations.instant, ease: easings.out, overwrite: 'auto' });
      } else {
        gsap.to(moreMenuRef.current, { opacity: 0, duration: durations.instant, ease: easings.out, overwrite: 'auto', onComplete: onMoreExitComplete });
      }
    });
  }, { scope: moreScopeRef, dependencies: [moreOpen, isMoreRendered] });

  const closeMore = () => { setMoreOpen(false); moreTriggerRef.current?.focus(); };

  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node) && moreTriggerRef.current && !moreTriggerRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [moreOpen]);

  useEffect(() => {
    if (moreOpen && moreMenuRef.current) moreMenuRef.current.querySelector<HTMLAnchorElement>('a')?.focus();
  }, [moreOpen]);

  const renderLink = (item: NavItem) => {
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? 'page' : undefined}
        className={clsx(
          'min-h-[44px] px-3 py-2 rounded-md text-sm font-semibold inline-flex items-center transition-colors',
          active ? 'bg-surface-2 text-text border border-border font-bold' : 'text-muted hover:text-text hover:bg-surface-2'
        )}
      >
        {t(item.key)}
      </Link>
    );
  };

  const isPopoverActive = POPOVER_NAV.some((item) => pathname === item.href);

  return (
    <header data-chrome="header" className="w-full sticky top-0 z-20 h-14 md:h-16 bg-surface pt-[env(safe-area-inset-top,0px)]">
      <Container className="h-full flex items-center justify-between gap-3 min-w-0 !max-w-[1536px]">
        <Link href="/" className="text-base font-bold text-text hover:text-accent flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-ring rounded-sm py-1 min-h-[44px] shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-accent border border-accent-edge inline-block" aria-hidden="true" />
          <span className="tracking-tight">FocusLab</span>
        </Link>
        <nav ref={navRef} aria-label="Main Navigation" className="relative hidden lg:flex items-center gap-1 min-w-0">
          <div ref={indicatorRef} aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] bg-accent pointer-events-none origin-left opacity-0" style={{ width: 1 }} />
          {PRIMARY_NAV.map(renderLink)}
          <div className="hidden xl:flex items-center gap-1">{EXTRA_NAV.map(renderLink)}</div>
          <div ref={moreScopeRef} className="relative xl:hidden">
            <button
              ref={moreTriggerRef}
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              className={clsx(
                'min-h-[44px] px-3 py-2 rounded-md text-sm font-semibold inline-flex items-center gap-1 transition-colors',
                isPopoverActive || moreOpen ? 'bg-surface-2 text-text border border-border font-bold' : 'text-muted hover:text-text hover:bg-surface-2'
              )}
            >
              <span>{t('nav.more')}</span>
              <span aria-hidden="true" className="text-xs">▾</span>
            </button>
            {isMoreRendered && (
              <div
                ref={moreMenuRef}
                role="menu"
                aria-label="Additional navigation links"
                onKeyDown={(e) => handleFocusTrapKeyDown(e, moreMenuRef.current, closeMore)}
                className="absolute left-0 top-full mt-1.5 z-50 min-w-[150px] rounded-md border border-border bg-surface-2 shadow-lg p-1 space-y-0.5 origin-top-left"
              >
                {POPOVER_NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setMoreOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={clsx(
                        'min-h-[44px] w-full px-3 py-2 text-sm font-semibold rounded text-left flex items-center transition-colors',
                        active ? 'bg-surface text-text font-bold' : 'text-muted hover:text-text hover:bg-surface'
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href="/check"
            className="hidden xl:inline-flex min-h-[44px] px-3.5 py-1.5 text-sm font-semibold rounded-md border border-border bg-surface-2 text-text hover:bg-surface items-center justify-center transition select-none active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {t('nav.startCheck')}
          </Link>
        </div>
      </Container>
    </header>
  );
};
