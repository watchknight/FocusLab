export type DemoState = 'idle' | 'armed' | 'early' | 'lit' | 'result';

export type DemoEvent = 'tap' | 'timeout' | 'reset';

export interface DemoTransitionResult {
  nextState: DemoState;
  targetAperture: number;
  caption: string;
}

export const DEMO_CAPTIONS: Record<DemoState, string> = {
  idle: 'Tap the lens to try one reflex.',
  armed: 'Wait for it.',
  early: 'Too early. Tap the lens to try again.',
  lit: 'Wait for it.',
  result: 'One tap is noisy. The 3-minute Check gives you a baseline.',
};

export const DEMO_APERTURES: Record<DemoState, number> = {
  idle: 0.45,
  armed: 0.12,
  early: 0.45,
  lit: 0.95,
  result: 0.5,
};

/** Calculate random delay between minMs (default 1000) and maxMs (default 4000). */
export function getRandomStimulusDelay(
  minMs = 1000,
  maxMs = 4000,
  rng: () => number = Math.random
): number {
  return minMs + rng() * (maxMs - minMs);
}

/** Compute integer reaction time in milliseconds from high-resolution timestamps. */
export function calculateReactionTime(stimulusTs: number, tapTs: number): number {
  return Math.max(0, Math.round(tapTs - stimulusTs));
}

/** Pure state transition logic for the Hero reflex demo. */
export function transitionDemoState(
  currentState: DemoState,
  event: DemoEvent
): DemoTransitionResult {
  let nextState: DemoState = currentState;

  if (event === 'reset') {
    nextState = 'idle';
  } else if (event === 'timeout') {
    if (currentState === 'armed') {
      nextState = 'lit';
    }
  } else if (event === 'tap') {
    switch (currentState) {
      case 'idle':
      case 'early':
      case 'result':
        nextState = 'armed';
        break;
      case 'armed':
        nextState = 'early';
        break;
      case 'lit':
        nextState = 'result';
        break;
    }
  }

  return {
    nextState,
    targetAperture: DEMO_APERTURES[nextState],
    caption: DEMO_CAPTIONS[nextState],
  };
}

/** Screen-reader polite announcement generated only on completed reflex results. */
export function formatResultAnnouncement(reactionTimeMs: number): string {
  return `Your reaction: ${reactionTimeMs} ms. ${DEMO_CAPTIONS.result}`;
}
