import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runThemeTransition } from '../theme-transition';
import { isCalmRoute } from '@/components/IrisTransition';

describe('theme-transition', () => {
  let mockDoc: {
    documentElement: {
      setAttribute: ReturnType<typeof vi.fn>;
      classList: { add: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> };
      style: { colorScheme: string };
      dataset: Record<string, string>;
      animate: ReturnType<typeof vi.fn>;
      getAttribute: ReturnType<typeof vi.fn>;
    };
    querySelector: ReturnType<typeof vi.fn>;
    createElement?: ReturnType<typeof vi.fn>;
    head?: { appendChild: ReturnType<typeof vi.fn> };
    startViewTransition?: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockDoc = {
      documentElement: {
        setAttribute: vi.fn(),
        classList: { add: vi.fn(), remove: vi.fn() },
        style: { colorScheme: 'light' },
        dataset: { fx: 'full' },
        animate: vi.fn(),
        getAttribute: vi.fn((attr: string) => (attr === 'data-calm' ? null : null)),
      },
      querySelector: vi.fn(),
      createElement: vi.fn(() => ({
        setAttribute: vi.fn(),
      })),
      head: {
        appendChild: vi.fn(),
      },
      startViewTransition: vi.fn((cb: () => void) => {
        cb();
        return {
          ready: Promise.resolve(),
          finished: Promise.resolve(),
          skipTransition: vi.fn(),
        };
      }),
    };
    vi.stubGlobal('document', mockDoc);
    vi.stubGlobal('window', {
      innerWidth: 1024,
      innerHeight: 768,
      matchMedia: vi.fn(() => ({ matches: false })),
      getComputedStyle: vi.fn(() => ({
        getPropertyValue: vi.fn(() => '#0C0E13'),
      })),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('performs instant fallback when fx is "off"', () => {
    mockDoc.documentElement.dataset.fx = 'off';
    runThemeTransition('darkroom');
    expect(mockDoc.startViewTransition).not.toHaveBeenCalled();
    expect(mockDoc.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'darkroom');
  });

  it('performs instant fallback when calm mode is on', () => {
    mockDoc.documentElement.getAttribute = vi.fn((attr: string) => (attr === 'data-calm' ? 'on' : null));
    runThemeTransition('darkroom');
    expect(mockDoc.startViewTransition).not.toHaveBeenCalled();
    expect(mockDoc.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'darkroom');
  });

  it('performs instant fallback when startViewTransition is unsupported', () => {
    delete mockDoc.startViewTransition;
    runThemeTransition('studio');
    expect(mockDoc.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'studio');
  });

  it('runs circular reveal view transition when fx is full and supported', async () => {
    const mockButton = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 200,
        width: 44,
        height: 44,
      }),
    } as unknown as HTMLElement;

    runThemeTransition('darkroom', mockButton);
    expect(mockDoc.startViewTransition).toHaveBeenCalled();
  });

  it('gracefully handles rapid successive theme transitions by skipping previous', () => {
    const skipMock = vi.fn();
    mockDoc.startViewTransition = vi.fn((cb: () => void) => {
      cb();
      return {
        ready: Promise.resolve(),
        finished: Promise.resolve(),
        skipTransition: skipMock,
      };
    });

    runThemeTransition('studio');
    expect(mockDoc.startViewTransition).toHaveBeenCalledTimes(1);

    runThemeTransition('contrast');
    expect(skipMock).toHaveBeenCalledTimes(1);
    expect(mockDoc.startViewTransition).toHaveBeenCalledTimes(2);
  });

  it('falls back to applyTheme if startViewTransition throws', () => {
    mockDoc.startViewTransition = vi.fn(() => {
      throw new Error('Transition rejected');
    });

    runThemeTransition('darkroom');
    expect(mockDoc.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'darkroom');
  });
});

describe('isCalmRoute helper', () => {
  it('identifies /check and /focus as calm routes', () => {
    expect(isCalmRoute('/check')).toBe(true);
    expect(isCalmRoute('/check/results')).toBe(true);
    expect(isCalmRoute('/focus')).toBe(true);
    expect(isCalmRoute('/focus/timer')).toBe(true);
  });

  it('identifies breathing activities as calm routes', () => {
    expect(isCalmRoute('/activities/cyclic-sighing')).toBe(true);
    expect(isCalmRoute('/activities/box-breathing')).toBe(true);
    expect(isCalmRoute('/activities/breath-counting')).toBe(true);
  });

  it('identifies non-calm routes correctly', () => {
    expect(isCalmRoute('/')).toBe(false);
    expect(isCalmRoute('/activities')).toBe(false);
    expect(isCalmRoute('/experiments')).toBe(false);
    expect(isCalmRoute('/insights')).toBe(false);
    expect(isCalmRoute('/about')).toBe(false);
    expect(isCalmRoute('/learn')).toBe(false);
  });
});
