import { getFx } from './gsap';
import { getCalmState } from './motion';
import { applyTheme, type ThemeProfile } from '@/components/ui/ThemeToggle';

interface TransitionWithSkip {
  skipTransition?: () => void;
}

let activeTransition: TransitionWithSkip | null = null;

/**
 * Executes a theme transition. If document.startViewTransition exists and fx is not 'off',
 * animates a circular clip-path reveal from the toggle's centre on
 * ::view-transition-new(root) with the Web Animations API (500 ms).
 * Skipped when fx is off (instant fallback).
 */
export function runThemeTransition(
  newTheme: ThemeProfile,
  toggleElement?: HTMLElement | null
): void {
  if (typeof document === 'undefined') return;

  const fx = getFx();
  const calm = getCalmState();

  // Instant fallback when fx is off, calm route, or View Transitions API unsupported
  if (
    fx === 'off' ||
    calm ||
    !('startViewTransition' in document) ||
    typeof document.startViewTransition !== 'function'
  ) {
    applyTheme(newTheme);
    return;
  }

  // If a transition is already active, cleanly skip it before launching new one
  if (activeTransition && typeof activeTransition.skipTransition === 'function') {
    try {
      activeTransition.skipTransition();
    } catch {
      // Ignore abort errors
    }
  }

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  if (toggleElement) {
    const rect = toggleElement.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  }

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  try {
    const transition = document.startViewTransition(() => {
      applyTheme(newTheme);
    });

    activeTransition = transition as TransitionWithSkip;

    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration: 500,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {
        applyTheme(newTheme);
      })
      .finally(() => {
        if (activeTransition === (transition as TransitionWithSkip)) {
          activeTransition = null;
        }
      });
  } catch {
    applyTheme(newTheme);
  }
}
