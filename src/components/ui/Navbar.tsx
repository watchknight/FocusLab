'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import * as m from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useT, I18nKey } from '@/i18n';
import { handleFocusTrapKeyDown } from '@/lib/focus-trap';
import { popVariants, springs, useMotionAllowed } from '@/lib/motion';

interface NavItem {
  key: I18nKey;
  href: string;
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { key: 'nav.check', href: '/check' },
  { key: 'nav.focus', href: '/focus' },
  { key: 'nav.activities', href: '/activities' },
  { key: 'nav.experiments', href: '/experiments' },
  { key: 'nav.insights', href: '/insights' },
];

const EXTRA_NAV_ITEMS: NavItem[] = [
  { key: 'nav.sounds', href: '/sounds' },
  { key: 'nav.learn', href: '/learn' },
];

const POPOVER_NAV_ITEMS: NavItem[] = [
  { key: 'nav.sounds', href: '/sounds' },
  { key: 'nav.learn', href: '/learn' },
  { key: 'nav.about', href: '/about' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useT();
  const motionOk = useMotionAllowed();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreTriggerRef = useRef<HTMLButtonElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const [indicator, setIndicator] = useState<{ x: number; scaleX: number; visible: boolean }>({
    x: 0,
    scaleX: 0,
    visible: false,
  });

  const updateIndicator = useCallback(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector<HTMLElement>('a[aria-current="page"]');
    if (activeEl) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeEl.getBoundingClientRect();
      setIndicator({
        x: linkRect.left - navRect.left,
        scaleX: Math.max(1, linkRect.width),
        visible: true,
      });
    } else {
      setIndicator((prev) => ({ ...prev, visible: false }));
    }
  }, []);

  useEffect(() => {
    updateIndicator();
    if (!navRef.current) return;
    const ro = new ResizeObserver(() => {
      updateIndicator();
    });
    ro.observe(navRef.current);
    const links = navRef.current.querySelectorAll('a');
    links.forEach((link) => ro.observe(link));
    return () => ro.disconnect();
  }, [pathname, updateIndicator]);

  const closeMore = () => {
    setMoreOpen(false);
    moreTriggerRef.current?.focus();
  };

  // Close popover when clicking outside
  useEffect(() => {
    if (!moreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(e.target as Node) &&
        moreTriggerRef.current &&
        !moreTriggerRef.current.contains(e.target as Node)
      ) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreOpen]);

  // Focus first link on popover open
  useEffect(() => {
    if (moreOpen && moreMenuRef.current) {
      const firstLink = moreMenuRef.current.querySelector<HTMLAnchorElement>('a');
      firstLink?.focus();
    }
  }, [moreOpen]);

  const isPopoverActive = POPOVER_NAV_ITEMS.some((item) => pathname === item.href);

  return (
    <header
      data-chrome="header"
      className="w-full sticky top-0 z-20 h-14 md:h-16 bg-surface pt-[env(safe-area-inset-top,0px)]"
    >
      <Container className="h-full flex items-center justify-between gap-3 min-w-0">
        {/* Logo */}
        <Link
          href="/"
          className="text-base font-bold text-text hover:text-accent flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-ring rounded-sm py-1 min-h-[44px] shrink-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-accent border border-accent-edge inline-block" aria-hidden="true" />
          <span className="tracking-tight">FocusLab</span>
        </Link>

        {/* Desktop nav: visible at >= 1024px (lg) */}
        <nav
          ref={navRef}
          aria-label="Main Navigation"
          className="relative hidden lg:flex items-center gap-1 min-w-0"
        >
          {/* Animated indicator sliding under the active nav link */}
          <m.div
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[2px] bg-accent pointer-events-none origin-left"
            style={{ width: 1 }}
            initial={false}
            animate={{
              x: indicator.x,
              scaleX: indicator.scaleX,
              opacity: indicator.visible ? 1 : 0,
            }}
            transition={
              motionOk
                ? springs.snappy
                : { duration: 0 }
            }
          />

          {/* Five primary links visible at 1024px and up */}
          {PRIMARY_NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'min-h-[44px] px-3 py-2 rounded-md text-sm font-semibold inline-flex items-center transition-colors',
                  active
                    ? 'bg-surface-2 text-text border border-border font-bold'
                    : 'text-muted hover:text-text hover:bg-surface-2'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {t(item.key)}
              </Link>
            );
          })}

          {/* Two extra links visible only at >= 1280px (xl) */}
          <div className="hidden xl:flex items-center gap-1">
            {EXTRA_NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'min-h-[44px] px-3 py-2 rounded-md text-sm font-semibold inline-flex items-center transition-colors',
                    active
                      ? 'bg-surface-2 text-text border border-border font-bold'
                      : 'text-muted hover:text-text hover:bg-surface-2'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </div>

          {/* "More" popover visible at 1024px-1279px (lg only) */}
          <div className="relative xl:hidden">
            <button
              ref={moreTriggerRef}
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              className={clsx(
                'min-h-[44px] px-3 py-2 rounded-md text-sm font-semibold inline-flex items-center gap-1 transition-colors',
                isPopoverActive || moreOpen
                  ? 'bg-surface-2 text-text border border-border font-bold'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              )}
            >
              <span>{t('nav.more')}</span>
              <span aria-hidden="true" className="text-xs">▾</span>
            </button>

            <AnimatePresence>
              {moreOpen && (
                <m.div
                  ref={moreMenuRef}
                  role="menu"
                  variants={popVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  aria-label="Additional navigation links"
                  onKeyDown={(e) => handleFocusTrapKeyDown(e, moreMenuRef.current, closeMore)}
                  className="absolute left-0 top-full mt-1.5 z-50 min-w-[150px] rounded-md border border-border bg-surface-2 shadow-lg p-1 space-y-0.5 origin-top-left"
                >
                  {POPOVER_NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setMoreOpen(false)}
                        className={clsx(
                          'min-h-[44px] w-full px-3 py-2 text-sm font-semibold rounded text-left flex items-center transition-colors',
                          active
                            ? 'bg-surface text-text font-bold'
                            : 'text-muted hover:text-text hover:bg-surface'
                        )}
                        aria-current={active ? 'page' : undefined}
                      >
                        {t(item.key)}
                      </Link>
                    );
                  })}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href="/check"
            className="hidden xl:inline-flex min-h-[44px] px-3.5 py-1.5 text-sm font-semibold rounded-sm bg-accent text-on-accent border-2 border-accent-edge shadow-elevation hover:brightness-105 items-center justify-center transition select-none active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {t('nav.startCheck')}
          </Link>
        </div>
      </Container>
    </header>
  );
};
