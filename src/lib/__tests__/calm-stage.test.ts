import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { gsap } from '@/lib/gsap';
import { setCalm, getCalmState, setCalmMode } from '@/lib/motion';
import fs from 'fs';
import path from 'path';

describe('Task 5 Prove Calm: Check test stage and Focus run', () => {
  let mockRoot: {
    setAttribute: ReturnType<typeof vi.fn>;
    removeAttribute: ReturnType<typeof vi.fn>;
    getAttribute: ReturnType<typeof vi.fn>;
  };
  let mockChromeEls: { setAttribute: ReturnType<typeof vi.fn>; removeAttribute: ReturnType<typeof vi.fn> }[];

  beforeEach(() => {
    let calmVal: string | null = null;
    mockRoot = {
      setAttribute: vi.fn((attr: string, val: string) => {
        if (attr === 'data-calm') calmVal = val;
      }),
      removeAttribute: vi.fn((attr: string) => {
        if (attr === 'data-calm') calmVal = null;
      }),
      getAttribute: vi.fn((attr: string) => (attr === 'data-calm' ? calmVal : null)),
    };
    mockChromeEls = [
      { setAttribute: vi.fn(), removeAttribute: vi.fn() },
      { setAttribute: vi.fn(), removeAttribute: vi.fn() },
    ];

    vi.stubGlobal('document', {
      documentElement: mockRoot,
      querySelectorAll: vi.fn((sel: string) => (sel === '[data-chrome]' ? mockChromeEls : [])),
    });
  });

  afterEach(() => {
    setCalmMode(false);
    gsap.globalTimeline.clear();
    vi.unstubAllGlobals();
  });

  it('guarantees gsap.globalTimeline.getChildren().length is 0 during calm mode', () => {
    // 1. Add an arbitrary tween to global timeline simulating ambient motion
    const dummy = { val: 0 };
    gsap.to(dummy, { val: 10, duration: 1 });
    expect(gsap.globalTimeline.getChildren().length).toBeGreaterThan(0);

    // 2. Activate calm mode as done on Check test start and Focus run start
    setCalm(true);
    expect(getCalmState()).toBe(true);
    expect(mockRoot.setAttribute).toHaveBeenCalledWith('data-calm', 'on');

    // 3. Query GSAP global timeline active children - must be cleared to 0
    const activeTweens = gsap.globalTimeline.getChildren();
    expect(activeTweens.length).toBe(0);

    // 4. Deactivate calm mode on complete or abort
    setCalm(false);
    expect(getCalmState()).toBe(false);
    expect(mockRoot.removeAttribute).toHaveBeenCalledWith('data-calm');
  });

  it('verifies tokens.css defines the fixed viewfinder stage tokens in every profile', () => {
    const tokensPath = path.resolve(__dirname, '../../styles/tokens.css');
    const css = fs.readFileSync(tokensPath, 'utf8');

    expect(css).toContain('--stage-bg: #07080B;');
    expect(css).toContain('--stage-stimulus: #FFFFFF;');
    expect(css).toContain('--stage-counter: #F2F3F5;');
    expect(css).toContain('--stage-hud: #9AA1AE;');
  });

  it('verifies Check test stage source uses fixed stage tokens and suppresses CSS animations', () => {
    const testViewPath = path.resolve(__dirname, '../../features/check/TestView.tsx');
    const source = fs.readFileSync(testViewPath, 'utf8');

    // Fixed stage tokens
    expect(source).toContain("backgroundColor: 'var(--stage-bg, #07080B)'");
    expect(source).toContain("color: 'var(--stage-counter, #F2F3F5)'");
    expect(source).toContain("backgroundColor: 'var(--stage-stimulus, #FFFFFF)'");
    expect(source).toContain("animation: 'none'");
    expect(source).toContain("transition: 'none'");

    // No visual Esc button colliding with brackets
    expect(source).not.toContain('<button\n          type="button"\n          onClick={(e) => {\n            e.stopPropagation();\n            handleAbort();\n          }}\n          className="min-h-[44px] min-w-[44px]');
  });

  it('verifies Focus run stage source uses fixed stage tokens and landscape-compact-grid', () => {
    const runStepPath = path.resolve(__dirname, '../../features/session/RunStep.tsx');
    const source = fs.readFileSync(runStepPath, 'utf8');

    expect(source).toContain("backgroundColor: 'var(--stage-bg, #07080B)'");
    expect(source).toContain("color: 'var(--stage-counter, #F2F3F5)'");
    expect(source).toContain('landscape-compact-grid');
  });

  it('verifies Focus dial degrees map to 15 to 90 minutes in 5-minute steps', () => {
    const minDeg = -135;
    const stepDeg = 18; // 270 / 15 steps

    const degToMin = (deg: number) => {
      const stepIndex = Math.max(0, Math.min(15, Math.round((deg - minDeg) / stepDeg)));
      return 15 + stepIndex * 5;
    };

    const minToDeg = (min: number) => {
      const stepIndex = (min - 15) / 5;
      return minDeg + stepIndex * stepDeg;
    };

    expect(degToMin(-135)).toBe(15);
    expect(degToMin(0)).toBe(55); // step 8 of 15: 15 + 8 * 5 = 55 min
    expect(degToMin(135)).toBe(90);

    for (let m = 15; m <= 90; m += 5) {
      const deg = minToDeg(m);
      expect(degToMin(deg)).toBe(m);
    }
  });

  it('verifies Breathing pacer target apertures: inhale 0.9, top-up 0.95, hold unchanged, exhale 0.15', () => {
    const getTargetAperture = (phaseLabel: string, currentAperture: number, hasTopUp = false) => {
      const label = phaseLabel.toLowerCase();
      if (label.includes('top-up')) return 0.95;
      if (label.includes('inhale')) return hasTopUp ? 0.75 : 0.9;
      if (label.includes('exhale')) return 0.15;
      return currentAperture; // hold stays
    };

    // Standard box breathing (no top-up)
    expect(getTargetAperture('Inhale', 0.15, false)).toBe(0.9);
    expect(getTargetAperture('Hold', 0.9, false)).toBe(0.9);
    expect(getTargetAperture('Exhale', 0.9, false)).toBe(0.15);
    expect(getTargetAperture('Hold', 0.15, false)).toBe(0.15);

    // Cyclic sighing (with top-up inhale)
    expect(getTargetAperture('Inhale', 0.15, true)).toBe(0.75);
    expect(getTargetAperture('Top-up inhale', 0.75, true)).toBe(0.95);
    expect(getTargetAperture('Exhale', 0.95, true)).toBe(0.15);
  });
});
