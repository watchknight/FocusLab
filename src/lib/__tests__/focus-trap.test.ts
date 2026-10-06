import { describe, it, expect, vi } from 'vitest';
import { getFocusableElements, handleFocusTrapKeyDown } from '../focus-trap';

function createMockElement(id: string, disabled = false, ariaHidden = false) {
  const el = {
    id,
    hasAttribute: (attr: string) => attr === 'disabled' && disabled,
    getAttribute: (attr: string) => (attr === 'aria-hidden' ? String(ariaHidden) : null),
    focus: vi.fn(),
  };
  return el as unknown as HTMLElement;
}

describe('focus-trap utilities', () => {
  it('returns empty array when container is null', () => {
    expect(getFocusableElements(null)).toEqual([]);
  });

  it('collects focusable elements in order, excluding disabled or hidden', () => {
    const el1 = createMockElement('btn1');
    const el2 = createMockElement('link1');
    const el3 = createMockElement('btnDisabled', true);
    const el4 = createMockElement('hidden', false, true);

    const container = {
      querySelectorAll: () => [el1, el2, el3, el4],
    } as unknown as HTMLElement;

    const elements = getFocusableElements(container);
    expect(elements.map((el) => el.id)).toEqual(['btn1', 'link1']);
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    const event = {
      key: 'Escape',
      preventDefault: vi.fn(),
    };

    const handled = handleFocusTrapKeyDown(event, null, onClose);
    expect(handled).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('returns false for unrelated keys', () => {
    const event = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
    };
    const handled = handleFocusTrapKeyDown(event, null);
    expect(handled).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('handles Tab when no focusables exist', () => {
    const container = {
      querySelectorAll: () => [],
    } as unknown as HTMLElement;

    const event = {
      key: 'Tab',
      preventDefault: vi.fn(),
    };

    const handled = handleFocusTrapKeyDown(event, container);
    expect(handled).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('cycles focus to first element when at the end of tab order', () => {
    const el1 = createMockElement('btn1');
    const el2 = createMockElement('btn2');

    const container = {
      querySelectorAll: () => [el1, el2],
      contains: () => true,
    } as unknown as HTMLElement;

    // Simulate global activeElement
    const originalDocument = globalThis.document;
    globalThis.document = { activeElement: el2 } as unknown as Document;

    const event = {
      key: 'Tab',
      shiftKey: false,
      preventDefault: vi.fn(),
    };

    const handled = handleFocusTrapKeyDown(event, container);
    expect(handled).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(el1.focus).toHaveBeenCalled();

    globalThis.document = originalDocument;
  });

  it('cycles focus to last element when shift-tabbing at the beginning of tab order', () => {
    const el1 = createMockElement('btn1');
    const el2 = createMockElement('btn2');

    const container = {
      querySelectorAll: () => [el1, el2],
      contains: () => true,
    } as unknown as HTMLElement;

    const originalDocument = globalThis.document;
    globalThis.document = { activeElement: el1 } as unknown as Document;

    const event = {
      key: 'Tab',
      shiftKey: true,
      preventDefault: vi.fn(),
    };

    const handled = handleFocusTrapKeyDown(event, container);
    expect(handled).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(el2.focus).toHaveBeenCalled();

    globalThis.document = originalDocument;
  });
});
