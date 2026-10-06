'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { useT } from '@/i18n';

export const Footer: React.FC = () => {
  const { t } = useT();

  return (
    <footer
      data-chrome="footer"
      className="w-full border-t border-border bg-surface-2 py-8 mb-16 lg:mb-0 text-center space-y-4"
    >
      <Container className="space-y-4">
        <nav
          aria-label="Footer links"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted"
        >
          <Link href="/about" className="hover:text-text transition-colors min-h-[44px] inline-flex items-center">
            {t('footer.about')}
          </Link>
          <Link href="/privacy" className="hover:text-text transition-colors min-h-[44px] inline-flex items-center">
            {t('footer.privacy')}
          </Link>
          <Link href="/disclaimer" className="hover:text-text transition-colors min-h-[44px] inline-flex items-center">
            {t('footer.disclaimer')}
          </Link>
          <Link href="/learn" className="hover:text-text transition-colors min-h-[44px] inline-flex items-center">
            {t('footer.evidence')}
          </Link>
        </nav>
        <p className="text-sm text-muted max-w-[70ch] mx-auto leading-relaxed">
          {t('footer.notice')}
        </p>
      </Container>
    </footer>
  );
};
