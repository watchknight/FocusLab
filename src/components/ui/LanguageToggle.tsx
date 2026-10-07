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
      className="inline-flex items-center rounded-full border border-border bg-surface-2 p-0.5 shrink-0 whitespace-nowrap text-xs font-semibold"
    >
      <button
        type="button"
        lang="en"
        aria-pressed={locale === 'en'}
        onClick={() => setLocale('en')}
        className={clsx(
          'min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-full transition-colors inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-ring select-none',
          locale === 'en'
            ? 'bg-primary-bg text-primary-text font-bold shadow-xs'
            : 'text-muted hover:text-text'
        )}
      >
        EN
      </button>
      <span className="text-border px-0.5 select-none" aria-hidden="true">|</span>
      <button
        type="button"
        lang="bn"
        aria-pressed={locale === 'bn'}
        onClick={() => setLocale('bn')}
        className={clsx(
          'min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-full transition-colors inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-ring font-bengali select-none',
          locale === 'bn'
            ? 'bg-primary-bg text-primary-text font-bold shadow-xs'
            : 'text-muted hover:text-text'
        )}
      >
        বাংলা
      </button>
    </div>
  );
};
