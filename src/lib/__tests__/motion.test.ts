import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  durations,
  easings,
  springs,
  fadeVariants,
  popVariants,
  slideVariants,
  heroLensVariants,
  motionAllowed,
  isLowEndDevice,
  setCalmMode,
  initPerformanceAttributes,
  DURATION_FAST,
  DURATION_NORMAL,
  DURATION_HERO_FOCUS,
  EASE_OUT,
  SPRING_SNAPPY,
  fadeSlideVariants,
} from '../motion';

describe('motion constants and specifications', () => {
  it('defines exact duration specifications', () => {
    expect(durations.instant).toBe(0.12);
    expect(durations.quick).toBe(0.2);
    expect(durations.base).toBe(0.32);
    expect(durations.slow).toBe(0.56);
    expect(durations.hero).toBe(0.9);

    // Backwards-compatible aliases
    expect(DURATION_FAST).toBeLessThanOrEqual(0.15);
    expect(DURATION_NORMAL).toBe(0.2);
    expect(DURATION_HERO_FOCUS).toBe(0.9);
  });

  it('defines exact easing curves', () => {
    expect(easings.out).toEqual([0.22, 1, 0.36, 1]);
    expect(easings.inOut).toEqual([0.65, 0, 0.35, 1]);
    expect(EASE_OUT).toEqual([0.22, 1, 0.36, 1]);
  });

  it('defines exact springs', () => {
    expect(springs.soft).toEqual({
      type: 'spring',
      stiffness: 140,
      damping: 22,
    });
    expect(springs.snappy).toEqual({
      type: 'spring',
      stiffness: 320,
      damping: 30,
    });
    expect(SPRING_SNAPPY).toEqual(springs.snappy);
  });

  it('provides variants that animate only transform, opacity, and small-area filter', () => {
    const allowed = ['opacity', 'transform', 'filter', 'scale', 'y', 'x', 'transition'];
    const checkProps = (obj: Record<string, unknown>) => {
      for (const key of Object.keys(obj)) {
        expect(allowed).toContain(key);
      }
    };

    checkProps(fadeVariants.initial);
    checkProps(fadeVariants.animate);
    checkProps(fadeVariants.exit);

    checkProps(popVariants.initial);
    checkProps(popVariants.animate);
    checkProps(popVariants.exit);

    checkProps(slideVariants.initial);
    checkProps(slideVariants.animate);
    checkProps(slideVariants.exit);

    // Slide distance must be <= 12px
    expect(Math.abs(slideVariants.initial.y)).toBeLessThanOrEqual(12);
    expect(Math.abs(slideVariants.exit.y)).toBeLessThanOrEqual(12);

    checkProps(heroLensVariants.initial);
    checkProps(heroLensVariants.animate);
    expect(fadeSlideVariants).toBe(slideVariants);
  });
});

describe('motionAllowed pure function (all 8 combinations)', () => {
  it('allows motion ONLY when neither reduced motion, calm mode, nor low-end hardware is active', () => {
    // 1. [false, false, false] => true
    expect(
      motionAllowed({ reduced: false, calm: false, lowEnd: false })
    ).toBe(true);

    // 2. [true, false, false] => false
    expect(
      motionAllowed({ reduced: true, calm: false, lowEnd: false })
    ).toBe(false);

    // 3. [false, true, false] => false
    expect(
      motionAllowed({ reduced: false, calm: true, lowEnd: false })
    ).toBe(false);

    // 4. [false, false, true] => false
    expect(
      motionAllowed({ reduced: false, calm: false, lowEnd: true })
    ).toBe(false);

    // 5. [true, true, false] => false
    expect(
      motionAllowed({ reduced: true, calm: true, lowEnd: false })
    ).toBe(false);

    // 6. [true, false, true] => false
    expect(
      motionAllowed({ reduced: true, calm: false, lowEnd: true })
    ).toBe(false);

    // 7. [false, true, true] => false
    expect(
      motionAllowed({ reduced: false, calm: true, lowEnd: true })
    ).toBe(false);

    // 8. [true, true, true] => false
    expect(
      motionAllowed({ reduced: true, calm: true, lowEnd: true })
    ).toBe(false);
  });

  it('handles empty parameter object with safe defaults', () => {
    expect(motionAllowed({})).toBe(true);
  });
});

describe('calm mode and chrome inert control', () => {
  let mockRoot: { setAttribute: ReturnType<typeof vi.fn>; removeAttribute: ReturnType<typeof vi.fn> };
  let mockChromeEl1: { setAttribute: ReturnType<typeof vi.fn>; removeAttribute: ReturnType<typeof vi.fn> };
  let mockChromeEl2: { setAttribute: ReturnType<typeof vi.fn>; removeAttribute: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRoot = {
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    };
    mockChromeEl1 = {
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    };
    mockChromeEl2 = {
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    };

    vi.stubGlobal('document', {
      documentElement: mockRoot,
      querySelectorAll: vi.fn((sel: string) => {
        if (sel === '[data-chrome]') return [mockChromeEl1, mockChromeEl2];
        return [];
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sets data-calm="on" and marks chrome elements inert when calm mode is on', () => {
    setCalmMode(true);
    expect(mockRoot.setAttribute).toHaveBeenCalledWith('data-calm', 'on');
    expect(mockChromeEl1.setAttribute).toHaveBeenCalledWith('inert', '');
    expect(mockChromeEl2.setAttribute).toHaveBeenCalledWith('inert', '');
  });

  it('removes data-calm and un-inerts chrome elements when calm mode is off', () => {
    setCalmMode(false);
    expect(mockRoot.removeAttribute).toHaveBeenCalledWith('data-calm');
    expect(mockChromeEl1.removeAttribute).toHaveBeenCalledWith('inert');
    expect(mockChromeEl2.removeAttribute).toHaveBeenCalledWith('inert');
  });
});

describe('low-end device detection', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('flags hardwareConcurrency <= 4 as low-end', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('navigator', { hardwareConcurrency: 4 });
    expect(isLowEndDevice()).toBe(true);
  });

  it('flags deviceMemory <= 4 as low-end', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('navigator', { hardwareConcurrency: 8, deviceMemory: 4 });
    expect(isLowEndDevice()).toBe(true);
  });

  it('flags saveData as low-end', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('navigator', {
      hardwareConcurrency: 8,
      deviceMemory: 8,
      connection: { saveData: true },
    });
    expect(isLowEndDevice()).toBe(true);
  });

  it('does not flag high-end hardware as low-end', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('navigator', {
      hardwareConcurrency: 8,
      deviceMemory: 8,
      connection: { saveData: false },
    });
    expect(isLowEndDevice()).toBe(false);
  });

  it('applies data-low-end attribute on document root', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('navigator', { hardwareConcurrency: 2 });
    const mockRoot = { setAttribute: vi.fn() };
    vi.stubGlobal('document', { documentElement: mockRoot });

    initPerformanceAttributes();
    expect(mockRoot.setAttribute).toHaveBeenCalledWith('data-low-end', 'true');
  });
});
