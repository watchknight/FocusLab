/**
 * Pure helper functions for trapping focus inside dialogs, sheets, and popovers.
 */

export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );
  return elements.filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  );
}

export function handleFocusTrapKeyDown(
  e: { key: string; shiftKey?: boolean; preventDefault: () => void },
  container: HTMLElement | null,
  onClose?: () => void
): boolean {
  if (e.key === 'Escape') {
    e.preventDefault();
    onClose?.();
    return true;
  }

  if (e.key !== 'Tab') {
    return false;
  }

  const focusables = getFocusableElements(container);
  if (focusables.length === 0) {
    e.preventDefault();
    return true;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null;

  if (e.shiftKey) {
    if (active === first || !container?.contains(active)) {
      e.preventDefault();
      last.focus();
      return true;
    }
  } else {
    if (active === last || !container?.contains(active)) {
      e.preventDefault();
      first.focus();
      return true;
    }
  }

  return false;
}

