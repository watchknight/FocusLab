'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFocusStore } from '@/store/useFocusStore';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const theme = useFocusStore((s) => s.theme);
  const setTheme = useFocusStore((s) => s.setTheme);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const navItems = [
    { label: 'Check', href: '/check' },
    { label: 'Practice', href: '/practice' },
    { label: 'Compare', href: '/compare' },
    { label: 'Sounds', href: '/sounds' },
    { label: 'Learn', href: '/learn' },
  ];

  return (
    <header className="border-b border-surface-border bg-surface-primary sticky top-0 z-20">
      <div className="max-w-prose mx-auto px-4 py-2 flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold text-content-primary hover:text-teal-accent flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-teal-accent rounded-sm py-1"
        >
          <span className="w-3 h-3 rounded-full bg-teal-accent inline-block" aria-hidden="true" />
          FocusLab
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Main Navigation" className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`min-h-[44px] px-2.5 py-2 rounded-md text-xs sm:text-sm font-semibold inline-flex items-center transition-colors ${
                    active
                      ? 'bg-teal-subtle text-teal-accent'
                      : 'text-content-secondary hover:text-content-primary hover:bg-surface-secondary'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggleTheme}
            className="min-h-[44px] min-w-[44px] p-2 text-content-secondary hover:text-content-primary rounded-md inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-teal-accent"
            aria-label="Toggle dark and light color theme"
          >
            <span aria-hidden="true" className="text-xs font-mono">
              {theme === 'dark' ? '☀' : '☾'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
