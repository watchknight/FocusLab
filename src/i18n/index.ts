'use client';

import { useCallback } from 'react';
import { create } from 'zustand';
import en from './en.json';
import bn from './bn.json';

export type Locale = 'en' | 'bn';
export type I18nKey = keyof typeof en;

const STORAGE_KEY = 'focuslab:lang';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const getInitialLocale = (): Locale => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'bn' || stored === 'en') {
        if (typeof document !== 'undefined') {
          document.documentElement.lang = stored;
        }
        return stored;
      }
    } catch {
      // Ignored
    }
  }
  return 'en';
};

export const useLanguageStore = create<LanguageState>((set) => ({
  locale: getInitialLocale(),
  setLocale: (nextLocale: Locale) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, nextLocale);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = nextLocale;
        }
      } catch {
        // Ignored
      }
    }
    set({ locale: nextLocale });
  },
}));

export function translate(
  key: I18nKey,
  locale: Locale,
  params?: Record<string, string | number>
): string {
  const dict = locale === 'bn' ? (bn as Record<string, string>) : (en as Record<string, string>);
  let text = dict[key];

  if ((!text || text.trim() === '') && locale === 'bn') {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[i18n] Missing Bengali translation for key: "${key}". Falling back to English.`);
    }
    text = (en as Record<string, string>)[key] || key;
  }

  if (!text) {
    text = key;
  }

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }

  return text;
}

export function useT() {
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);

  const t = useCallback(
    (key: I18nKey, params?: Record<string, string | number>) =>
      translate(key, locale, params),
    [locale]
  );

  return { t, locale, setLocale };
}
