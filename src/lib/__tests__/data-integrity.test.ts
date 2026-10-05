import { describe, it, expect, beforeEach } from 'vitest';

describe('Data Integrity Guard logic', () => {
  const STORAGE_KEY = 'focuslab:v1';
  const memoryStore = new Map<string, string>();

  const storage = {
    getItem: (key: string) => memoryStore.get(key) ?? null,
    setItem: (key: string, val: string) => memoryStore.set(key, val),
    removeItem: (key: string) => memoryStore.delete(key),
    clear: () => memoryStore.clear(),
  };

  beforeEach(() => {
    storage.clear();
  });

  it('detects unparseable JSON string as corrupted', () => {
    const corruptString = '{"checks": [invalid json syntax...';
    storage.setItem(STORAGE_KEY, corruptString);

    let isCorrupted = false;
    let preservedText = '';

    const raw = storage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) {
          isCorrupted = true;
          preservedText = raw;
        }
      } catch {
        isCorrupted = true;
        preservedText = raw;
      }
    }

    expect(isCorrupted).toBe(true);
    expect(preservedText).toBe(corruptString);
  });

  it('detects primitive non-object JSON as corrupted state', () => {
    const corruptPrimitive = '12345';
    storage.setItem(STORAGE_KEY, corruptPrimitive);

    let isCorrupted = false;
    const raw = storage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) {
          isCorrupted = true;
        }
      } catch {
        isCorrupted = true;
      }
    }

    expect(isCorrupted).toBe(true);
  });

  it('resets corrupted storage cleanly without error', () => {
    storage.setItem(STORAGE_KEY, 'invalid');
    expect(storage.getItem(STORAGE_KEY)).toBe('invalid');

    storage.removeItem(STORAGE_KEY);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });
});
