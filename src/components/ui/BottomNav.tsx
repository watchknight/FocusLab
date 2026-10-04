'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NAV_LINKS } from './Navbar';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-surface px-2 py-1 flex items-center justify-around overflow-x-auto gap-1"
    >
      {NAV_LINKS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'min-h-[44px] min-w-[44px] px-2 py-2 text-[11px] font-semibold rounded inline-flex flex-col items-center justify-center transition-colors text-center whitespace-nowrap',
              active
                ? 'text-accent font-bold underline underline-offset-4'
                : 'text-muted hover:text-text'
            )}
            aria-current={active ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
