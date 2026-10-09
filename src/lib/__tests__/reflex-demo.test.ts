import { describe, it, expect } from 'vitest';
import {
  transitionDemoState,
  getRandomStimulusDelay,
  calculateReactionTime,
  formatResultAnnouncement,
  DEMO_CAPTIONS,
  DEMO_APERTURES,
} from '@/lib/reflex-demo';

describe('reflex-demo state machine', () => {
  it('transitions from idle to armed on tap with 0.12 aperture', () => {
    const res = transitionDemoState('idle', 'tap');
    expect(res.nextState).toBe('armed');
    expect(res.targetAperture).toBe(0.12);
    expect(res.caption).toBe(DEMO_CAPTIONS.armed);
  });

  it('transitions from armed to early on premature tap with 0.45 aperture', () => {
    const res = transitionDemoState('armed', 'tap');
    expect(res.nextState).toBe('early');
    expect(res.targetAperture).toBe(0.45);
    expect(res.caption).toBe(DEMO_CAPTIONS.early);
  });

  it('transitions from armed to lit on timeout with 0.95 stimulus snap', () => {
    const res = transitionDemoState('armed', 'timeout');
    expect(res.nextState).toBe('lit');
    expect(res.targetAperture).toBe(0.95);
  });

  it('ignores timeout event when not armed', () => {
    const res = transitionDemoState('idle', 'timeout');
    expect(res.nextState).toBe('idle');
  });

  it('transitions from lit to result on valid tap with 0.5 aperture', () => {
    const res = transitionDemoState('lit', 'tap');
    expect(res.nextState).toBe('result');
    expect(res.targetAperture).toBe(0.5);
    expect(res.caption).toBe(DEMO_CAPTIONS.result);
  });

  it('re-arms on subsequent tap after result or early', () => {
    const fromResult = transitionDemoState('result', 'tap');
    expect(fromResult.nextState).toBe('armed');

    const fromEarly = transitionDemoState('early', 'tap');
    expect(fromEarly.nextState).toBe('armed');
  });

  it('resets to idle on reset event', () => {
    const res = transitionDemoState('result', 'reset');
    expect(res.nextState).toBe('idle');
    expect(res.targetAperture).toBe(DEMO_APERTURES.idle);
  });

  it('supports full repeated testing loop without getting stuck', () => {
    // 1. First test: idle -> tap -> armed (0.12)
    let res = transitionDemoState('idle', 'tap');
    expect(res.nextState).toBe('armed');
    expect(res.targetAperture).toBe(0.12);

    // 2. Stimulus fires: armed -> timeout -> lit (0.95)
    res = transitionDemoState(res.nextState, 'timeout');
    expect(res.nextState).toBe('lit');
    expect(res.targetAperture).toBe(0.95);

    // 3. User responds: lit -> tap -> result (0.50)
    res = transitionDemoState(res.nextState, 'tap');
    expect(res.nextState).toBe('result');
    expect(res.targetAperture).toBe(0.5);

    // 4. Second test: result -> tap -> armed (0.12) - shutter closes again
    res = transitionDemoState(res.nextState, 'tap');
    expect(res.nextState).toBe('armed');
    expect(res.targetAperture).toBe(0.12);

    // 5. Stimulus fires again: armed -> timeout -> lit (0.95)
    res = transitionDemoState(res.nextState, 'timeout');
    expect(res.nextState).toBe('lit');
    expect(res.targetAperture).toBe(0.95);

    // 6. User responds to second test: lit -> tap -> result (0.50)
    res = transitionDemoState(res.nextState, 'tap');
    expect(res.nextState).toBe('result');
    expect(res.targetAperture).toBe(0.5);

    // 7. Third test: result -> tap -> armed (0.12) - shutter closes once more
    res = transitionDemoState(res.nextState, 'tap');
    expect(res.nextState).toBe('armed');
    expect(res.targetAperture).toBe(0.12);
  });

  it('handles early tap recovery cycle without latching', () => {
    // idle -> tap -> armed (0.12)
    let res = transitionDemoState('idle', 'tap');
    expect(res.nextState).toBe('armed');

    // premature tap -> early (0.45)
    res = transitionDemoState(res.nextState, 'tap');
    expect(res.nextState).toBe('early');
    expect(res.targetAperture).toBe(0.45);

    // retry tap -> armed (0.12)
    res = transitionDemoState(res.nextState, 'tap');
    expect(res.nextState).toBe('armed');
    expect(res.targetAperture).toBe(0.12);
  });
});

describe('reflex-demo helpers', () => {
  it('calculates stimulus delay within requested bounds', () => {
    const min = 1000;
    const max = 4000;
    const delayMid = getRandomStimulusDelay(min, max, () => 0.5);
    expect(delayMid).toBe(2500);

    const delayMin = getRandomStimulusDelay(min, max, () => 0);
    expect(delayMin).toBe(1000);

    const delayMax = getRandomStimulusDelay(min, max, () => 1);
    expect(delayMax).toBe(4000);
  });

  it('calculates reaction time accurately and handles non-negative bounds', () => {
    expect(calculateReactionTime(1000.4, 1287.6)).toBe(287);
    expect(calculateReactionTime(2000, 1950)).toBe(0);
  });

  it('formats aria-live polite announcement correctly', () => {
    const ann = formatResultAnnouncement(245);
    expect(ann).toContain('245 ms');
    expect(ann).toContain(DEMO_CAPTIONS.result);
  });
});
