'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ThemeToggle } from './ThemeToggle';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Check', href: '/check' },
  { label: 'Focus', href: '/focus' },
  { label: 'Activities', href: '/activities' },
  { label: 'Experiments', href: '/experiments' },
  { label: 'Insights', href: '/insights' },
  { label: 'Sounds', href: '/sounds' },
  { label: 'Learn', href: '/learn' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();

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
          {NAV_LINKS.map((item) => {
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
                {item.label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
};
