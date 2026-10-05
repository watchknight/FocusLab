'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useT, I18nKey } from '@/i18n';

interface NavItem {
  key: I18nKey;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.check', href: '/check' },
  { key: 'nav.focus', href: '/focus' },
  { key: 'nav.activities', href: '/activities' },
  { key: 'nav.experiments', href: '/experiments' },
  { key: 'nav.insights', href: '/insights' },
  { key: 'nav.sounds', href: '/sounds' },
  { key: 'nav.learn', href: '/learn' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useT();

  return (
    <header className="border-b border-border bg-surface sticky top-0 z-20">
      <div className="max-w-prose mx-auto px-4 py-2 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="text-base font-semibold text-text hover:text-accent flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-accent rounded-sm py-1"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" aria-hidden="true" />
          FocusLab
        </Link>

        {/* Desktop / tablet navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'min-h-[44px] px-2 py-2 rounded-md text-xs font-semibold inline-flex items-center transition-colors',
                  active
                    ? 'bg-surface-2 text-accent border border-accent'
                    : 'text-muted hover:text-text hover:bg-surface-2'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
