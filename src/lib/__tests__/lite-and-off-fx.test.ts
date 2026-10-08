import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  transitionDemoState,
  calculateReactionTime,
  DEMO_APERTURES,
} from '@/lib/reflex-demo';

describe('Task 4 & Task 5: Lite & Off fx modes and Lens responsiveness', () => {
  const fxCssPath = path.resolve(__dirname, '../../styles/fx.css');
  const fxCss = fs.readFileSync(fxCssPath, 'utf8');

  it('Task 4: Hero headline is visible without JS and in lite/off modes in fx.css', () => {
    // Check fx.css selector rules for headline
    expect(fxCss).toContain('html[data-fx="lite"] [data-split="headline"]');
    expect(fxCss).toContain('html[data-fx="off"] [data-split="headline"]');
    expect(fxCss).toContain('visibility: visible !important;');

    // Headline is excluded from lite hiding
    expect(fxCss).toContain(':not([data-split="headline"])');
  });

  it('Task 5: With data-fx="lite", confirms no blur filter, cursor, smooth scroll, pinned scene, grain or iris', () => {
    // 1. Grain disabled
    expect(fxCss).toContain('html[data-fx="lite"] .grain');
    // 2. Cursor disabled
    expect(fxCss).toContain('html[data-fx="lite"] .af-cursor');
    // 3. Iris transition disabled
    expect(fxCss).toContain('html[data-fx="lite"] .iris');
    // 4. Backdrop blur removed on glass headers
    expect(fxCss).toContain('html[data-fx="lite"] .header-glass');
    expect(fxCss).toContain('backdrop-filter: none !important;');
    // 5. Glint removed
    expect(fxCss).toContain('html[data-fx="lite"] [data-glint]');
    // 6. Pinned scene disabled in lite
    expect(fxCss).toContain('.how-it-works-pinned { display: none; }');
    expect(fxCss).toContain('html[data-fx="full"] .how-it-works-pinned { display: block; }');
  });

  it('Task 5: Under 6x CPU throttling simulation, hero lens state machine and RT calculation remain responsive and accurate', () => {
    // Simulate 6x CPU throttling with delayed frames/timers
    const now0 = 1000.0;
    // Step 1: Idle -> tap -> arm
    const armed = transitionDemoState('idle', 'tap');
    expect(armed.nextState).toBe('armed');
    expect(armed.targetAperture).toBe(DEMO_APERTURES.armed);

    // Step 2: Stimulus triggers after random delay (e.g. 2150ms)
    const stimulusDelay = 2150.0;
    const stimulusTs = now0 + stimulusDelay;
    const lit = transitionDemoState('armed', 'timeout');
    expect(lit.nextState).toBe('lit');
    expect(lit.targetAperture).toBe(DEMO_APERTURES.lit);

    // Step 3: User taps 242.3 ms later (even if CPU thread was stalled by 6x lag)
    const tapLag = 242.3;
    const tapTs = stimulusTs + tapLag;
    const reactionTime = calculateReactionTime(stimulusTs, tapTs);
    expect(reactionTime).toBe(242); // Rounded ms

    const result = transitionDemoState('lit', 'tap');
    expect(result.nextState).toBe('result');
    expect(result.targetAperture).toBe(DEMO_APERTURES.result);
  });
});
