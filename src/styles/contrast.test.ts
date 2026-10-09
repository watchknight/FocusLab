import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

function hexToRgb(hex: string): [number, number, number] {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleaned, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [lr, lg, lb] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function mixRgbToHex(hex1: string, hex2: string, weight1: number): string {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const r = Math.round(r1 * weight1 + r2 * (1 - weight1));
  const g = Math.round(g1 * weight1 + g2 * (1 - weight1));
  const b = Math.round(b1 * weight1 + b2 * (1 - weight1));
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function parseTokensCss(): Record<string, Record<string, string>> {
  const cssPath = path.resolve(__dirname, 'tokens.css');
  const content = fs.readFileSync(cssPath, 'utf8');

  const profiles: Record<string, Record<string, string>> = {
    studio: {},
    darkroom: {},
    contrast: {},
  };

  // Find blocks for each theme
  const blockRegex = /(?::root|\[data-theme=['"]?([a-z0-9_-]+)['"]?\])[^{]*\{([^}]+)\}/gi;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(content)) !== null) {
    const rawTheme = (match[1] || 'studio').toLowerCase();
    const targetTheme =
      rawTheme === 'studio' || rawTheme === 'light'
        ? 'studio'
        : rawTheme === 'darkroom' || rawTheme === 'dark' || rawTheme === 'night'
          ? 'darkroom'
          : rawTheme === 'contrast'
            ? 'contrast'
            : null;

    if (!targetTheme || !profiles[targetTheme]) continue;

    const blockBody = match[2];
    const varRegex = /--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8});/g;
    let varMatch: RegExpExecArray | null;
    while ((varMatch = varRegex.exec(blockBody)) !== null) {
      const varName = varMatch[1];
      const varVal = varMatch[2].trim();
      profiles[targetTheme][varName] = varVal;
    }
  }

  return profiles;
}

describe('Design Tokens Contrast Verification (v3 Rack Focus)', () => {
  const parsed = parseTokensCss();
  const profiles = ['studio', 'darkroom', 'contrast'] as const;
  const tiers = [
    'tier-strong',
    'tier-moderate',
    'tier-mixed',
    'tier-emerging',
    'tier-not-supported',
  ] as const;

  profiles.forEach((profile) => {
    describe(`Profile: ${profile}`, () => {
      const tokens = parsed[profile];

      it('defines all required tokens', () => {
        const required = [
          'bg',
          'surface',
          'surface-2',
          'border-strong',
          'text',
          'muted',
          'primary-bg',
          'primary-text',
          'ring',
          ...tiers,
        ];
        required.forEach((tok) => {
          expect(tokens[tok], `Missing token --${tok} in ${profile}`).toBeDefined();
        });
      });

      it('asserts text / bg has contrast >= 4.5', () => {
        const ratio = contrastRatio(tokens.text, tokens.bg);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('asserts text / surface has contrast >= 4.5', () => {
        const ratio = contrastRatio(tokens.text, tokens.surface);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('asserts muted / surface-2 has contrast >= 4.5', () => {
        const ratio = contrastRatio(tokens.muted, tokens['surface-2']);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('asserts muted / surface has contrast >= 4.5 (surface layer for glass card)', () => {
        const ratio = contrastRatio(tokens.muted, tokens.surface);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('asserts text and muted against composite glass have contrast >= 4.5', () => {
        const compositeGlassHex = mixRgbToHex(tokens.surface, tokens.bg, 0.62);
        const textRatio = contrastRatio(tokens.text, compositeGlassHex);
        const mutedRatio = contrastRatio(tokens.muted, compositeGlassHex);
        expect(textRatio).toBeGreaterThanOrEqual(4.5);
        expect(mutedRatio).toBeGreaterThanOrEqual(4.5);
      });

      it('asserts primary-text / primary-bg has contrast >= 4.5', () => {
        const ratio = contrastRatio(tokens['primary-text'], tokens['primary-bg']);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      tiers.forEach((tier) => {
        it(`asserts ${tier} / bg has contrast >= 4.5`, () => {
          const ratio = contrastRatio(tokens[tier], tokens.bg);
          expect(ratio).toBeGreaterThanOrEqual(4.5);
        });

        it(`asserts ${tier} / surface has contrast >= 4.5`, () => {
          const ratio = contrastRatio(tokens[tier], tokens.surface);
          expect(ratio).toBeGreaterThanOrEqual(4.5);
        });

        it(`asserts ${tier} / surface-2 has contrast >= 4.5`, () => {
          const ratio = contrastRatio(tokens[tier], tokens['surface-2']);
          expect(ratio).toBeGreaterThanOrEqual(4.5);
        });
      });

      it('asserts ring / bg has contrast >= 3.0', () => {
        const ratio = contrastRatio(tokens.ring, tokens.bg);
        expect(ratio).toBeGreaterThanOrEqual(3.0);
      });

      it('asserts ring / surface has contrast >= 3.0', () => {
        const ratio = contrastRatio(tokens.ring, tokens.surface);
        expect(ratio).toBeGreaterThanOrEqual(3.0);
      });

      it('asserts border-strong / bg has contrast >= 3.0', () => {
        const ratio = contrastRatio(tokens['border-strong'], tokens.bg);
        expect(ratio).toBeGreaterThanOrEqual(3.0);
      });

      it('asserts border-strong / surface has contrast >= 3.0', () => {
        const ratio = contrastRatio(tokens['border-strong'], tokens.surface);
        expect(ratio).toBeGreaterThanOrEqual(3.0);
      });
    });
  });
});
