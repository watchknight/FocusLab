/**
 * Motion configuration, constants, and utilities (FocusLab v2)
 *
 * Rules:
 * - Animate transform, opacity, and small-area filter only. Never width/height/top/left.
 * - All timings, easings, and spring values live here.
 * - Non-user-triggered motion is limited to the hero focus-pull and hero pointer lamp.
 * - prefers-reduced-motion: opacity-only fades <= 150ms.
 * - Calm mode: data-calm="on" on <html> stops decorative motion and inerts chrome.
 * - Low-end mode: hardwareConcurrency <= 4, deviceMemory <= 4, or saveData active.
 */

import { useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';

export const durations = {
  instant: 0.12,
  quick: 0.2,
  base: 0.32,
  slow: 0.56,
  hero: 0.9,
} as const;

export const DURATION_INSTANT = durations.instant;
export const DURATION_QUICK = durations.quick;
export const DURATION_BASE = durations.base;
export const DURATION_SLOW = durations.slow;
export const DURATION_HERO = durations.hero;

// Compatibility aliases
export const DURATION_FAST = 0.12;
export const DURATION_NORMAL = durations.quick;
export const DURATION_HERO_FOCUS = durations.hero;

export const easings = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const EASE_OUT = easings.out;
export const EASE_IN_OUT = easings.inOut;

export const springs = {
  soft: {
    type: 'spring',
    stiffness: 140,
    damping: 22,
  },
  snappy: {
    type: 'spring',
    stiffness: 320,
    damping: 30,
  },
} as const;

export const SPRING_SOFT = springs.soft;
export const SPRING_SNAPPY = springs.snappy;
export const SPRING_GENTLE = springs.soft;

export const loadDomAnimation = () =>
  import('motion/react').then((res) => res.domAnimation);

/**
 * Variant helpers (distance <= 12px, enter 200ms, exit 140ms)
 */
export const fadeVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: durations.quick, ease: easings.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.14, ease: easings.out },
  },
};

export const popVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.quick, ease: easings.out },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.14, ease: easings.out },
  },
};

export const slideVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.quick, ease: easings.out },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: { duration: 0.14, ease: easings.out },
  },
};

export const fadeSlideVariants = slideVariants;

export const heroLensVariants = {
  initial: { opacity: 0.7, filter: 'blur(3px)', scale: 0.99 },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: durations.hero,
      ease: easings.out,
    },
  },
};

/**
 * Pure function: determine if motion is allowed.
 * Motion is allowed ONLY when neither reduced motion, calm mode, nor low-end mode is active.
 */
export interface MotionAllowedParams {
  reduced?: boolean;
  calm?: boolean;
  lowEnd?: boolean;
}

export function motionAllowed(params: MotionAllowedParams): boolean {
  const { reduced = false, calm = false, lowEnd = false } = params;
  return !reduced && !calm && !lowEnd;
}

/**
 * Feature detect low-end devices:
 * - hardwareConcurrency <= 4
 * - deviceMemory <= 4 (GB)
 * - saveData is active
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  const lowCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
  const lowMem = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const saveData = Boolean(nav.connection?.saveData);

  return Boolean(lowCores || lowMem || saveData);
}

/**
 * Calm Mode state subscription and DOM attribute sync
 */
type CalmListener = (calm: boolean) => void;
const calmListeners = new Set<CalmListener>();
let currentCalmState = false;

export function getCalmState(): boolean {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('data-calm') === 'on';
  }
  return currentCalmState;
}

export function subscribeCalm(listener: CalmListener): () => void {
  calmListeners.add(listener);
  return () => {
    calmListeners.delete(listener);
  };
}

export function setCalmMode(enabled: boolean): void {
  currentCalmState = enabled;
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    const chromeElements = document.querySelectorAll<HTMLElement>('[data-chrome]');
    if (enabled) {
      root.setAttribute('data-calm', 'on');
      chromeElements.forEach((el) => {
        el.setAttribute('inert', '');
      });
    } else {
      root.removeAttribute('data-calm');
      chromeElements.forEach((el) => {
        el.removeAttribute('inert');
      });
    }
  }
  calmListeners.forEach((listener) => listener(enabled));
}

export const setCalm = setCalmMode;

export function initPerformanceAttributes(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (isLowEndDevice()) {
    root.setAttribute('data-low-end', 'true');
  }
}

/**
 * Calm hook returning { calm, setCalm }
 */
export function useCalm(): {
  calm: boolean;
  setCalm: (action: boolean | ((prev: boolean) => boolean)) => void;
} {
  const [calm, setCalmState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return getCalmState();
  });

  useEffect(() => {
    setCalmState(getCalmState());
    return subscribeCalm((val) => setCalmState(val));
  }, []);

  const setCalm = useCallback((action: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof action === 'function' ? action(getCalmState()) : action;
    setCalmMode(next);
  }, []);

  return { calm, setCalm };
}

/**
 * SSR-safe hook detecting low-end hardware
 */
export function useLowEnd(): boolean {
  const [lowEnd, setLowEnd] = useState(false);

  useEffect(() => {
    setLowEnd(isLowEndDevice());
  }, []);

  return lowEnd;
}

/**
 * SSR-safe hook returning whether full motion is allowed
 */
export function useMotionAllowed(): boolean {
  const [mounted, setMounted] = useState(false);
  const { calm } = useCalm();
  const lowEnd = useLowEnd();
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return true;
  }

  return motionAllowed({
    reduced: Boolean(reduced),
    calm,
    lowEnd,
  });
}
