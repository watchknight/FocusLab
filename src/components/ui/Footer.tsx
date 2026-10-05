'use client';

import React from 'react';
import Link from 'next/link';
import { useT } from '@/i18n';

export const Footer: React.FC = () => {
  const { t } = useT();

  return (
    <footer className="border-t border-border bg-surface-2 py-6 px-4 mb-16 md:mb-0 text-center space-y-3">
      <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
        <Link href="/about" className="hover:text-text transition-colors min-h-[36px] inline-flex items-center">
          {t('footer.about')}
        </Link>
        <span aria-hidden="true" className="text-border">·</span>
        <Link href="/privacy" className="hover:text-text transition-colors min-h-[36px] inline-flex items-center">
          {t('footer.privacy')}
        </Link>
        <span aria-hidden="true" className="text-border">·</span>
        <Link href="/disclaimer" className="hover:text-text transition-colors min-h-[36px] inline-flex items-center">
          {t('footer.disclaimer')}
        </Link>
        <span aria-hidden="true" className="text-border">·</span>
        <Link href="/learn" className="hover:text-text transition-colors min-h-[36px] inline-flex items-center">
          {t('footer.evidence')}
        </Link>
      </nav>
      <p className="text-[11px] text-muted max-w-prose mx-auto leading-relaxed">
        {t('footer.notice')}
      </p>
    </footer>
  );
};
