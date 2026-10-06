'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import * as m from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { useT, I18nKey } from '@/i18n';
import { handleFocusTrapKeyDown } from '@/lib/focus-trap';
import { fadeVariants, slideVariants } from '@/lib/motion';

interface PrimaryNavEntry {
  key: I18nKey;
  href: string;
  icon: string;
}

interface SheetNavEntry {
  key: I18nKey;
  href: string;
  icon: string;
}

const PRIMARY_NAV: PrimaryNavEntry[] = [
  { key: 'nav.home', href: '/', icon: '○' },
  { key: 'nav.check', href: '/check', icon: '◐' },
  { key: 'nav.focus', href: '/focus', icon: '●' },
  { key: 'nav.activities', href: '/activities', icon: '◇' },
];

const SHEET_NAV: SheetNavEntry[] = [
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
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const closeSheet = () => {
    setMoreOpen(false);
    moreTriggerRef.current?.focus();
  };

  // Close sheet on outside backdrop click
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

  // Focus first link on sheet open
  useEffect(() => {
    if (moreOpen && sheetRef.current) {
      const firstFocusable = sheetRef.current.querySelector<HTMLElement>(
        'button, a[href]'
      );
      firstFocusable?.focus();
    }
  }, [moreOpen]);

  const isMoreActive = SHEET_NAV.some((item) => pathname === item.href);

  return (
    <>
      <AnimatePresence>
        {moreOpen && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.moreSections')}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="lg:hidden fixed inset-0 z-40 bg-bg/60 backdrop-blur-xs flex flex-col justify-end"
            onClick={closeSheet}
          >
            <m.div
              ref={sheetRef}
              tabIndex={-1}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onKeyDown={(e) => handleFocusTrapKeyDown(e, sheetRef.current, closeSheet)}
              className="bg-surface-2 border-t border-border rounded-t-md p-4 space-y-3 mb-14 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] shadow-elevation max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-sm font-bold text-text">
                  {t('nav.moreSections')}
                </span>
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
                        active
                          ? 'bg-surface text-text border-border font-bold'
                          : 'border-transparent text-muted hover:text-text hover:bg-surface'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span aria-hidden="true" className="font-mono text-sm">{item.icon}</span>
                      <span>{t(item.key)}</span>
                    </Link>
                  );
                })}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <nav
        data-chrome="bottom-nav"
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 min-h-[56px] border-t border-border bg-surface px-1 pb-[env(safe-area-inset-bottom,0px)] flex items-center justify-around min-w-0"
      >
        {PRIMARY_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'min-h-[56px] min-w-[44px] flex-1 px-1 py-1 text-sm font-semibold inline-flex flex-col items-center justify-center transition-colors text-center truncate min-w-0',
                active ? 'text-text font-bold' : 'text-muted hover:text-text'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <span aria-hidden="true" className="text-base leading-none">
                {item.icon}
              </span>
              <span className="truncate max-w-full text-sm mt-0.5">{t(item.key)}</span>
            </Link>
          );
        })}

        <button
          ref={moreTriggerRef}
          type="button"
          onClick={() => setMoreOpen(!moreOpen)}
          className={clsx(
            'min-h-[56px] min-w-[44px] flex-1 px-1 py-1 text-sm font-semibold inline-flex flex-col items-center justify-center transition-colors text-center min-w-0',
            isMoreActive || moreOpen ? 'text-text font-bold' : 'text-muted hover:text-text'
          )}
          aria-expanded={moreOpen}
          aria-label={t('nav.more')}
        >
          <span aria-hidden="true" className="text-base leading-none">
            ⋯
          </span>
          <span className="truncate max-w-full text-sm mt-0.5">{t('nav.more')}</span>
        </button>
      </nav>
    </>
  );
};
