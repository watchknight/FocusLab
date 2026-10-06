import { motionAllowed, isLowEndDevice, getCalmState } from './motion';
import { applyTheme, type ThemeProfile } from '@/components/ui/ThemeToggle';

/**
 * Executes a theme transition. If document.startViewTransition exists and motion
 * is allowed, animates a circular clip-path reveal from the toggle's centre on
 * ::view-transition-new(root) with the Web Animations API (500 ms, easing out).
 * Otherwise switches instantly.
 */
export function runThemeTransition(
  newTheme: ThemeProfile,
  toggleElement?: HTMLElement | null
): void {
  if (typeof document === 'undefined') return;

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const calm = getCalmState();
  const lowEnd = isLowEndDevice();

  const allowed = motionAllowed({
    reduced: Boolean(reduced),
    calm,
    lowEnd,
  });

  if (
    !allowed ||
    !('startViewTransition' in document) ||
    typeof document.startViewTransition !== 'function'
  ) {
    applyTheme(newTheme);
    return;
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

  const transition = document.startViewTransition(() => {
    applyTheme(newTheme);
  });

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
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    })
    .catch(() => {
      applyTheme(newTheme);
    });
}
