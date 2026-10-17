import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('GSAP Public Plugins & Registry Integrity', () => {
  const rootDir = process.cwd();

  it('verifies package.json depends only on public "gsap" and "@gsap/react"', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    expect(pkg.dependencies.gsap).toBeDefined();
    expect(pkg.dependencies['@gsap/react']).toBeDefined();
    expect(pkg.dependencies['gsap-trial']).toBeUndefined();
    expect(pkg.devDependencies?.['gsap-trial']).toBeUndefined();
  });

  it('confirms absence of .npmrc private registry or GreenSock token configuration', () => {
    const npmrcPath = path.join(rootDir, '.npmrc');
    const npmrcExists = fs.existsSync(npmrcPath);
    if (npmrcExists) {
      const content = fs.readFileSync(npmrcPath, 'utf8');
      expect(content).not.toContain('npm.greensock.com');
      expect(content).not.toContain('GSAP_TOKEN');
      expect(content).not.toContain('@gsap:registry');
    } else {
      expect(npmrcExists).toBe(false);
    }
  });

  it('verifies all GSAP plugin wrapper modules import from "gsap/<Plugin>"', () => {
    const checkImport = (relPath: string, expectedPlugin: string) => {
      const fullPath = path.join(rootDir, relPath);
      expect(fs.existsSync(fullPath)).toBe(true);
      const code = fs.readFileSync(fullPath, 'utf8');
      expect(code).toContain(`from "gsap/${expectedPlugin}"`);
      expect(code).not.toContain('gsap-trial');
    };

    checkImport('src/lib/gsap.ts', 'ScrollTrigger');
    checkImport('src/lib/gsap.ts', 'CustomEase');
    checkImport('src/lib/gsap-text.ts', 'SplitText');
    checkImport('src/lib/gsap-text.ts', 'ScrambleTextPlugin');
    checkImport('src/lib/gsap-flip.ts', 'Flip');
    checkImport('src/lib/gsap-drag.ts', 'Draggable');
    checkImport('src/lib/gsap-drag.ts', 'InertiaPlugin');
    checkImport('src/lib/gsap-draw.ts', 'DrawSVGPlugin');
  });

  it('scans all src/ files to ensure no forbidden trial, token, or private registry references exist', () => {
    const scanDir = (dir: string): string[] => {
      let files: string[] = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== '.next') {
            files = files.concat(scanDir(full));
          }
        } else if ((entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.mjs')) && !entry.name.includes('.test.')) {
          files.push(full);
        }
      }
      return files;
    };

    const files = scanDir(path.join(rootDir, 'src'));
    const forbiddenPatterns = [
      /gsap-trial/,
      /npm\.greensock\.com/,
      /GSAP_TOKEN/,
      /from\s+['"]@gsap\/shockingly/,
    ];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      for (const pattern of forbiddenPatterns) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  it('verifies dynamic loaders include cancellation guards preventing leaks on unmount', () => {
    const dialCode = fs.readFileSync(path.join(rootDir, 'src/lib/motion/use-dial.ts'), 'utf8');
    expect(dialCode).toContain('let cancelled = false');
    expect(dialCode).toContain('if (cancelled || !ref.current) return');
    expect(dialCode).toContain('cancelled = true');

    const knobCode = fs.readFileSync(path.join(rootDir, 'src/features/sounds/VolumeKnob.tsx'), 'utf8');
    expect(knobCode).toContain('let cancelled = false');
    expect(knobCode).toContain('if (cancelled || !knobRef.current) return');
    expect(knobCode).toContain('cancelled = true');

    const dotPlotCode = fs.readFileSync(path.join(rootDir, 'src/features/experiments/ExperimentDotPlot.tsx'), 'utf8');
    expect(dotPlotCode).toContain('let cancelled = false');
    expect(dotPlotCode).toContain('if (cancelled || !svgRef.current) return');
    expect(dotPlotCode).toContain('cancelled = true');

    const historyChartCode = fs.readFileSync(path.join(rootDir, 'src/features/check/HistoryChart.tsx'), 'utf8');
    expect(historyChartCode).toContain('let cancelled = false');
    expect(historyChartCode).toContain('if (cancelled || !pathRef.current) return');
    expect(historyChartCode).toContain('cancelled = true');

    const scrambleCode = fs.readFileSync(path.join(rootDir, 'src/lib/motion/scramble-to.ts'), 'utf8');
    expect(scrambleCode).toContain('if (!el.isConnected) return');
  });
});
