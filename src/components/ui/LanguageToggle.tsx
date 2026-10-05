'use client';

import React from 'react';
import { useT } from '@/i18n';

export const LanguageToggle: React.FC = () => {
  const { locale, setLocale, t } = useT();

  const toggleLanguage = () => {
    const next = locale === 'en' ? 'bn' : 'en';
    setLocale(next);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 text-xs font-semibold rounded-md border border-border bg-surface-2 text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent inline-flex items-center justify-center gap-1 transition-colors"
      aria-label={`${t('common.language')}: ${locale === 'en' ? 'English' : 'বাংলা'}. Click to switch language.`}
    >
      <span aria-hidden="true" className="font-mono text-xs">
        {locale === 'en' ? 'বাং' : 'EN'}
      </span>
      <span className="hidden sm:inline">
        {locale === 'en' ? 'বাংলা' : 'English'}
      </span>
    </button>
  );
};
