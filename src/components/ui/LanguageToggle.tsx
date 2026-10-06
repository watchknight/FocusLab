'use client';

import React from 'react';
import clsx from 'clsx';
import { useT } from '@/i18n';

export const LanguageToggle: React.FC = () => {
  const { locale, setLocale, t } = useT();

  return (
    <div
      role="group"
      aria-label={t('common.language')}
      className="inline-flex items-center rounded-md border border-border bg-surface-2 p-0.5 shrink-0 whitespace-nowrap"
    >
      <button
        type="button"
        lang="en"
        aria-pressed={locale === 'en'}
        onClick={() => setLocale('en')}
        className={clsx(
          'min-h-[44px] min-w-[44px] px-2.5 py-1 text-sm font-semibold rounded-xs transition-colors inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-ring',
          locale === 'en'
            ? 'bg-surface text-text shadow-elevation font-bold border border-border'
            : 'text-muted hover:text-text'
        )}
      >
        EN
      </button>
      <button
        type="button"
        lang="bn"
        aria-pressed={locale === 'bn'}
        onClick={() => setLocale('bn')}
        className={clsx(
          'min-h-[44px] min-w-[44px] px-2.5 py-1 text-sm font-semibold rounded-xs transition-colors inline-flex items-center justify-center font-bengali focus-visible:outline-2 focus-visible:outline-ring',
          locale === 'bn'
            ? 'bg-surface text-text shadow-elevation font-bold border border-border'
            : 'text-muted hover:text-text'
        )}
      >
        বাংলা
      </button>
    </div>
  );
};
