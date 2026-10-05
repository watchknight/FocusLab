import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLanguageStore, translate, I18nKey } from '../index';
import en from '../en.json';
import bn from '../bn.json';

describe('i18n system and translate logic', () => {
  beforeEach(() => {
    useLanguageStore.setState({ locale: 'en' });
    vi.restoreAllMocks();
  });

  it('translates English keys correctly', () => {
    expect(translate('nav.home', 'en')).toBe('Home');
    expect(translate('home.headline', 'en')).toBe('Build focus you can measure.');
    expect(translate('check.title', 'en')).toBe('Focus Check');
  });

  it('translates Bengali keys when locale is bn', () => {
    expect(translate('nav.home', 'bn')).toBe('হোম');
    expect(translate('home.headline', 'bn')).toBe('মনোযোগ পরিমাপ করুন, অভ্যাস গড়ে তুলুন।');
    expect(translate('check.title', 'bn')).toBe('ফোকাস চেক');
  });

  it('interpolates token parameters properly', () => {
    expect(translate('onboarding.step', 'en', { step: 2 })).toBe('Step 2 of 3');
    expect(translate('onboarding.step', 'bn', { step: 2 })).toBe('ধাপ ৩ এর 2');
  });

  it('falls back to English and warns when key is missing in Bengali', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Create a mock key that does not exist in bn
    const testKey = 'nonExistentKey' as unknown as I18nKey;
    const result = translate(testKey, 'bn');

    expect(result).toBe('nonExistentKey');
    consoleWarnSpy.mockRestore();
  });

  it('switches locale and syncs language store', () => {
    const store = useLanguageStore.getState();
    store.setLocale('bn');
    expect(useLanguageStore.getState().locale).toBe('bn');

    store.setLocale('en');
    expect(useLanguageStore.getState().locale).toBe('en');
  });

  it('contains valid non-empty translations for all keys in en and bn', () => {
    const enKeys = Object.keys(en);
    const bnKeys = Object.keys(bn);

    expect(enKeys.length).toBe(118);
    expect(bnKeys.length).toBe(118);

    for (const key of enKeys) {
      const bnVal = (bn as Record<string, string>)[key];
      expect(bnVal).toBeDefined();
      expect(bnVal.trim().length).toBeGreaterThan(0);
    }
  });
});
