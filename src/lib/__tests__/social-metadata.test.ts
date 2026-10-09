import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Social Metadata & Theme-Color Contracts', () => {
  it('verifies public/og.jpg and public/icon.svg exist with proper constraints', () => {
    const ogPath = path.resolve(__dirname, '../../../public/og.jpg');
    const iconPath = path.resolve(__dirname, '../../../public/icon.svg');
    expect(fs.existsSync(ogPath)).toBe(true);
    expect(fs.existsSync(iconPath)).toBe(true);

    const stat = fs.statSync(ogPath);
    expect(stat.size).toBeLessThan(150 * 1024);
    expect(stat.size).toBeGreaterThan(10 * 1024);
  });

  it('verifies RootLayout exports metadataBase, openGraph, twitter and themeColor descriptors', () => {
    const layoutPath = path.resolve(__dirname, '../../app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf8');

    expect(content).toContain('metadataBase: new URL(');
    expect(content).toContain("card: 'summary_large_image'");
    expect(content).toContain("images: [{ url: '/og.jpg', width: 1200, height: 630");
    expect(content).toContain("icon: '/icon.svg'");
    expect(content).toContain("media: '(forced-colors: active)', color: '#000000'");
    expect(content).toContain("media: '(prefers-color-scheme: dark)', color: '#0C0E13'");
    expect(content).toContain("media: '(prefers-color-scheme: light)', color: '#F1F3F5'");
  });

  it('verifies essential routes export per-page titles and descriptions', () => {
    const routes = [
      'check/page.tsx',
      'focus/page.tsx',
      'activities/page.tsx',
      'activities/[id]/page.tsx',
      'experiments/page.tsx',
      'sounds/page.tsx',
      'insights/page.tsx',
      'about/page.tsx',
      'privacy/page.tsx',
      'disclaimer/page.tsx',
      'learn/page.tsx',
    ];

    for (const route of routes) {
      const fullPath = path.resolve(__dirname, `../../app/${route}`);
      expect(fs.existsSync(fullPath)).toBe(true);
      const code = fs.readFileSync(fullPath, 'utf8');
      expect(code).toMatch(/title:/);
      expect(code).toMatch(/description:/);
    }
  });
});
