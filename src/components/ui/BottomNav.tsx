'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useT, I18nKey } from '@/i18n';
import { handleFocusTrapKeyDown } from '@/lib/focus-trap';
import { durations, easings, useGsapPresence } from '@/lib/motion';
import { gsap, useGSAP } from '@/lib/gsap';

interface NavEntry { key: I18nKey; href: string; icon: string }

const PRIMARY_NAV: NavEntry[] = [
  { key: 'nav.home', href: '/', icon: '○' },
  { key: 'nav.check', href: '/check', icon: '◐' },
  { key: 'nav.focus', href: '/focus', icon: '●' },
  { key: 'nav.activities', href: '/activities', icon: '◇' },
];

const SHEET_NAV: NavEntry[] = [
  { key: 'nav.experiments', href: '/experiments', icon: '◬' },
  { key: 'nav.insights', href: '/insights', icon: '▤' },
  { key: 'nav.sounds', href: '/sounds', icon: '♬' },
  { key: 'nav.learn', href: '/learn', icon: '◈' },
  { key: 'nav.about', href: '/about', icon: 'ℹ' },
  { key: 'nav.privacy', href: '/privacy', icon: '🔒' },
  { key: 'nav.disclaimer', href: '/disclaimer', icon: '⚖' },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useT();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreTriggerRef = useRef<HTMLButtonElement | null>(null);
  const sheetContainerRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const { isRendered, onExitComplete } = useGsapPresence(moreOpen);

  useGSAP(
    () => {
      if (!isRendered || !backdropRef.current || !sheetRef.current) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (moreOpen) {
          gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: durations.quick, ease: easings.out, overwrite: 'auto' });
          gsap.fromTo(sheetRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: durations.quick, ease: easings.out, overwrite: 'auto' });
        } else {
          gsap.to(backdropRef.current, { opacity: 0, duration: 0.14, ease: easings.out, overwrite: 'auto' });
          gsap.to(sheetRef.current, { opacity: 0, y: 16, duration: 0.14, ease: easings.out, overwrite: 'auto', onComplete: onExitComplete });
        }
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (moreOpen) {
          gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: durations.instant, ease: easings.out, overwrite: 'auto' });
          gsap.fromTo(sheetRef.current, { opacity: 0 }, { opacity: 1, duration: durations.instant, ease: easings.out, overwrite: 'auto' });
        } else {
          gsap.to(backdropRef.current, { opacity: 0, duration: durations.instant, ease: easings.out, overwrite: 'auto' });
          gsap.to(sheetRef.current, { opacity: 0, duration: durations.instant, ease: easings.out, overwrite: 'auto', onComplete: onExitComplete });
        }
      });
    },
    { scope: sheetContainerRef, dependencies: [moreOpen, isRendered] }
  );

  const closeSheet = () => {
    setMoreOpen(false);
    moreTriggerRef.current?.focus();
  };

  useEffect(() => {
    if (!moreOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSheet();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [moreOpen]);

  useEffect(() => {
    if (moreOpen && sheetRef.current) {
      sheetRef.current.querySelector<HTMLElement>('button, a[href]')?.focus();
    }
  }, [moreOpen]);

  const isMoreActive = SHEET_NAV.some((item) => pathname === item.href);

  return (
    <>
      {isRendered && (
        <div ref={sheetContainerRef} className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
          <div ref={backdropRef} className="absolute inset-0 bg-bg/60 backdrop-blur-xs" onClick={closeSheet} />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.moreSections')}
            tabIndex={-1}
            onKeyDown={(e) => handleFocusTrapKeyDown(e, sheetRef.current, closeSheet)}
            className="relative z-10 bg-surface-2 border-t border-border rounded-t-md p-4 space-y-3 mb-14 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] shadow-elevation max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm font-bold text-text">{t('nav.moreSections')}</span>
              <button
                type="button"
                onClick={closeSheet}
                className="text-sm text-muted hover:text-text min-h-[44px] min-w-[44px] inline-flex items-center justify-center font-bold rounded-md"
                aria-label={t('common.close')}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {SHEET_NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={clsx(
                      'min-h-[44px] px-3 py-2 text-sm font-semibold rounded-md border inline-flex items-center gap-2 transition-colors',
                      active ? 'bg-surface text-text border-border font-bold' : 'border-transparent text-muted hover:text-text hover:bg-surface'
                    )}
                  >
                    <span aria-hidden="true" className="font-mono text-base">{item.icon}</span>
                    <span>{t(item.key)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        data-chrome="bottom-nav"
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-surface border-t border-border flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0px)]"
      >
        {PRIMARY_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs rounded-sm transition-colors',
                active ? 'text-accent font-bold' : 'text-muted hover:text-text'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <span aria-hidden="true" className="font-mono text-base leading-none">{item.icon}</span>
              <span className="text-[11px] mt-0.5 tracking-tight">{t(item.key)}</span>
            </Link>
          );
        })}

        <button
          ref={moreTriggerRef}
          type="button"
          onClick={() => setMoreOpen(!moreOpen)}
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          aria-label={t('nav.moreSections')}
          className={clsx(
            'min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs rounded-sm transition-colors',
            moreOpen || isMoreActive ? 'text-accent font-bold' : 'text-muted hover:text-text'
          )}
        >
          <span aria-hidden="true" className="font-mono text-base leading-none">⋯</span>
          <span className="text-[11px] mt-0.5 tracking-tight">{t('nav.more')}</span>
        </button>
      </nav>
    </>
  );
};
