/**
 * Motion configuration, constants, and utilities (FocusLab v2)
 * GSAP tokens, calm mode, reduced motion, low-end detection.
 */

import { useState, useEffect, useCallback } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/** Native hook: returns whether prefers-reduced-motion matches. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);
  return reduced;
}

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
export const DURATION_FAST = 0.12;
export const DURATION_NORMAL = durations.quick;
export const DURATION_HERO_FOCUS = durations.hero;

export const easings = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  cubicOut: [0.22, 1, 0.36, 1] as const,
  cubicInOut: [0.65, 0, 0.35, 1] as const,
} as const;

export const EASE_OUT = easings.out;
export const EASE_IN_OUT = easings.inOut;

export const springs = {
  soft: { type: 'spring', stiffness: 140, damping: 22 },
  snappy: { type: 'spring', stiffness: 320, damping: 30 },
} as const;

export const SPRING_SOFT = springs.soft;
export const SPRING_SNAPPY = springs.snappy;
export const SPRING_GENTLE = springs.soft;

export const loadDomAnimation = () => Promise.resolve();

export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: durations.quick, ease: easings.cubicOut } },
  exit: { opacity: 0, transition: { duration: 0.14, ease: easings.cubicOut } },
};

export const popVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: durations.quick, ease: easings.cubicOut } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.14, ease: easings.cubicOut } },
};

export const slideVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: durations.quick, ease: easings.cubicOut } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.14, ease: easings.cubicOut } },
};

export const fadeSlideVariants = slideVariants;

export const heroLensVariants = {
  initial: { opacity: 0.7, filter: 'blur(3px)', scale: 0.99 },
  animate: { opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: durations.hero, ease: easings.cubicOut } },
};

export interface MotionAllowedParams {
  reduced?: boolean;
  calm?: boolean;
  lowEnd?: boolean;
}

/** Pure function: determine if motion is allowed. */
export function motionAllowed(params: MotionAllowedParams): boolean {
  const { reduced = false, calm = false, lowEnd = false } = params;
  return !reduced && !calm && !lowEnd;
}

/** Feature detect low-end devices: hardwareConcurrency <= 4, deviceMemory <= 4, saveData */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const lowCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
  const lowMem = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const saveData = Boolean(nav.connection?.saveData);
  return Boolean(lowCores || lowMem || saveData);
}

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
  return () => { calmListeners.delete(listener); };
}

export function setCalmMode(enabled: boolean): void {
  currentCalmState = enabled;
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    const chromeElements = document.querySelectorAll<HTMLElement>('[data-chrome]');
    if (enabled) {
      root.setAttribute('data-calm', 'on');
      chromeElements.forEach((el) => { el.setAttribute('inert', ''); });
      try {
        ScrollTrigger.getAll().forEach((t) => t.disable(false));
      } catch (e) {}
      gsap.globalTimeline.clear();
    } else {
      root.removeAttribute('data-calm');
      chromeElements.forEach((el) => { el.removeAttribute('inert'); });
      try {
        ScrollTrigger.getAll().forEach((t) => t.enable(false));
        ScrollTrigger.refresh();
      } catch (e) {}
    }
  } else {
    if (enabled) {
      gsap.globalTimeline.clear();
    }
  }
  calmListeners.forEach((listener) => listener(enabled));
}

export const setCalm = setCalmMode;

export function initPerformanceAttributes(): void {
  if (typeof document === 'undefined') return;
  if (isLowEndDevice()) {
    document.documentElement.setAttribute('data-low-end', 'true');
  }
}

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

export function useLowEnd(): boolean {
  const [lowEnd, setLowEnd] = useState(false);
  useEffect(() => { setLowEnd(isLowEndDevice()); }, []);
  return lowEnd;
}

export function useMotionAllowed(): boolean {
  const [mounted, setMounted] = useState(false);
  const { calm } = useCalm();
  const lowEnd = useLowEnd();
  const reduced = useReducedMotion();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return true;

  return motionAllowed({
    reduced: Boolean(reduced),
    calm,
    lowEnd,
  });
}

/** React hook for coordinating GSAP enter/exit unmounting. */
export function useGsapPresence(isOpen: boolean) {
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [isRendered, setIsRendered] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setIsRendered(true);
    }
  }

  const onExitComplete = useCallback(() => {
    setIsRendered(false);
  }, []);

  return { isRendered, onExitComplete };
}
