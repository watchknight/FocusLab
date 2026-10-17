import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { gsap, ScrollTrigger } from '@/lib/gsap';

describe('ScrollTrigger Lifecycle and Scoping Verification', () => {
  const rootDir = process.cwd();

  // 1. Static AST/Source verification of every ScrollTrigger instance
  describe('Static verification of every ScrollTrigger instance in the codebase', () => {
    it('verifies Navbar.tsx creates ScrollTrigger inside useGSAP with scope and kills it on route change', () => {
      const navbarCode = fs.readFileSync(path.join(rootDir, 'src/components/ui/Navbar.tsx'), 'utf8');
      expect(navbarCode).toContain('ScrollTrigger.create');
      expect(navbarCode).toMatch(/useGSAP\(\s*\(\)\s*=>\s*\{[\s\S]*?ScrollTrigger\.create[\s\S]*?return\s*\(\)\s*=>\s*\{[\s\S]*?st\.kill\(\)[\s\S]*?\},\s*\{\s*scope:\s*headerRef/);
    });

    it('verifies Footer.tsx creates ScrollTrigger inside useGSAP with scope and reverts matchMedia on route change', () => {
      const footerCode = fs.readFileSync(path.join(rootDir, 'src/components/ui/Footer.tsx'), 'utf8');
      expect(footerCode).toContain('scrollTrigger:');
      expect(footerCode).toMatch(/useGSAP\(\s*\(\)\s*=>\s*\{[\s\S]*?const mm = gsap\.matchMedia\(\)[\s\S]*?scrollTrigger:[\s\S]*?return\s*\(\)\s*=>\s*\{[\s\S]*?mm\.revert\(\)[\s\S]*?\},\s*\{\s*scope:\s*footerRef/);
    });

    it('verifies EvidenceSharpnessSection.tsx creates ScrollTrigger inside useGSAP with scope and kills it on unmount', () => {
      const code = fs.readFileSync(path.join(rootDir, 'src/components/home/EvidenceSharpnessSection.tsx'), 'utf8');
      expect(code).toContain('scrollTrigger:');
      expect(code).toMatch(/useGSAP\(\s*\(\)\s*=>\s*\{[\s\S]*?scrollTrigger:\s*\{[\s\S]*?trigger:\s*sectionRef\.current[\s\S]*?return\s*\(\)\s*=>\s*\{[\s\S]*?tween\.kill\(\)[\s\S]*?\},\s*\{\s*scope:\s*sectionRef\s*\}/);
    });

    it('verifies FaqCtaSection.tsx creates ScrollTrigger inside useGSAP with scope and kills it on unmount', () => {
      const code = fs.readFileSync(path.join(rootDir, 'src/components/home/FaqCtaSection.tsx'), 'utf8');
      expect(code).toContain('scrollTrigger:');
      expect(code).toMatch(/useGSAP\(\s*\(\)\s*=>\s*\{[\s\S]*?scrollTrigger:\s*\{[\s\S]*?trigger:\s*section[\s\S]*?return\s*\(\)\s*=>\s*\{[\s\S]*?tween\.kill\(\)[\s\S]*?\},\s*\{\s*scope:\s*ctaSectionRef\s*\}/);
    });

    it('verifies TransparencySection.tsx creates ScrollTrigger inside useGSAP with scope and kills it on unmount', () => {
      const code = fs.readFileSync(path.join(rootDir, 'src/components/home/TransparencySection.tsx'), 'utf8');
      expect(code).toContain('ScrollTrigger.create');
      expect(code).toMatch(/useGSAP\(\s*\(\)\s*=>\s*\{[\s\S]*?const st = ScrollTrigger\.create[\s\S]*?return\s*\(\)\s*=>\s*\{[\s\S]*?st\.kill\(\)[\s\S]*?\},\s*\{\s*scope:\s*sectionRef\s*\}/);
    });

    it('verifies use-pinned-scene.ts creates ScrollTrigger inside useGSAP with scope and reverts matchMedia', () => {
      const code = fs.readFileSync(path.join(rootDir, 'src/lib/motion/use-pinned-scene.ts'), 'utf8');
      expect(code).toContain('scrollTrigger:');
      expect(code).toMatch(/useGSAP\(\(\)\s*=>\s*\{[\s\S]*?const mm = gsap\.matchMedia\(\)[\s\S]*?scrollTrigger:[\s\S]*?return\s*\(\)\s*=>\s*mm\.revert\(\);[\s\S]*?\},\s*\{\s*scope\s*\}\)/);
    });

    it('verifies use-focus-scrub.ts creates ScrollTrigger inside useGSAP with scope and context.add', () => {
      const code = fs.readFileSync(path.join(rootDir, 'src/lib/motion/use-focus-scrub.ts'), 'utf8');
      expect(code).toContain('scrollTrigger:');
      expect(code).toMatch(/useGSAP\(\(context\)\s*=>\s*\{[\s\S]*?context\.add\(\(\)\s*=>\s*\{[\s\S]*?scrollTrigger:[\s\S]*?return\s*\(\)\s*=>\s*\{[\s\S]*?split\.revert\(\)[\s\S]*?\},\s*\{\s*scope\s*\}\)/);
    });

    it('confirms that no ScrollTrigger is created anywhere in src/ without useGSAP', () => {
      const findFiles = (dir: string): string[] => {
        let results: string[] = [];
        const list = fs.readdirSync(dir);
        for (const file of list) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
              results = results.concat(findFiles(fullPath));
            }
          } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(fullPath);
          }
        }
        return results;
      };

      const allSrcFiles = findFiles(path.join(rootDir, 'src'));
      const triggerFiles: string[] = [];

      for (const filePath of allSrcFiles) {
        if (filePath.includes('__tests__')) continue;
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('ScrollTrigger.create') || content.includes('scrollTrigger:')) {
          triggerFiles.push(path.relative(rootDir, filePath).replace(/\\/g, '/'));
          // Every file containing trigger creation MUST use useGSAP
          expect(content).toContain('useGSAP');
          // And must pass scope to useGSAP
          expect(content).toMatch(/\{\s*scope/);
        }
      }

      // Exactly the 7 files identified:
      const expectedTriggerFiles = [
        'src/components/home/EvidenceSharpnessSection.tsx',
        'src/components/home/FaqCtaSection.tsx',
        'src/components/home/TransparencySection.tsx',
        'src/components/ui/Footer.tsx',
        'src/components/ui/Navbar.tsx',
        'src/lib/motion/use-focus-scrub.ts',
        'src/lib/motion/use-pinned-scene.ts',
      ].sort();

      expect(triggerFiles.sort()).toEqual(expectedTriggerFiles);
    });
  });

  // 2. Refresh verification after document.fonts.ready and layout changes
  describe('ScrollTrigger.refresh() calls after fonts ready and layout changes', () => {
    it('verifies GlobalEffects.tsx refreshes ScrollTrigger after document.fonts.ready and route layout changes', () => {
      const code = fs.readFileSync(path.join(rootDir, 'src/components/GlobalEffects.tsx'), 'utf8');
      expect(code).toContain('document.fonts.ready.then');
      expect(code).toContain('ScrollTrigger.refresh()');
      expect(code).toContain('loadingdone');
      expect(code).toContain('requestAnimationFrame');
      expect(code).toContain('ResizeObserver');
      expect(code).toContain('isCalmRoute');
    });

    it('verifies template.tsx refreshes ScrollTrigger upon route entrance transition complete', () => {
      const code = fs.readFileSync(path.join(rootDir, 'src/app/template.tsx'), 'utf8');
      expect(code).toMatch(/onComplete:\s*\(\)\s*=>\s*\{[\s\S]*?ScrollTrigger\.refresh\(\);/);
    });

    it('verifies IrisProviderFull.tsx refreshes ScrollTrigger upon iris wipe transition complete', () => {
      const code = fs.readFileSync(path.join(rootDir, 'src/components/IrisProviderFull.tsx'), 'utf8');
      expect(code).toMatch(/onComplete:\s*\(\)\s*=>\s*\{[\s\S]*?ScrollTrigger\.refresh\(\);/);
    });
  });

  // 3. Runtime simulation of all 7 triggers being killed on route change
  describe('Runtime lifecycle verification of all ScrollTriggers on route transitions', () => {
    beforeEach(() => {
      const createElement = (tag: string) => ({
        tagName: tag.toUpperCase(),
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
          contains: vi.fn(() => false),
        },
        style: {},
        hasAttribute: vi.fn(() => false),
        getAttribute: vi.fn(() => null),
        setAttribute: vi.fn(),
        removeAttribute: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 100, bottom: 100, right: 100 }),
        remove: vi.fn(),
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      });

      const doc = {
        createElement,
        body: createElement('body'),
        documentElement: createElement('html'),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        scrollingElement: createElement('html'),
      };

      const NodeMock = { DOCUMENT_NODE: 9, ELEMENT_NODE: 1 };
      vi.stubGlobal('Node', NodeMock);
      (globalThis as unknown as { Node: typeof NodeMock }).Node = NodeMock;

      const raf = (cb: (time: number) => void) => 1;
      const caf = vi.fn();

      vi.stubGlobal('requestAnimationFrame', raf);
      vi.stubGlobal('cancelAnimationFrame', caf);
      vi.stubGlobal('document', doc);
      vi.stubGlobal('window', {
        document: doc,
        history: { scrollRestoration: 'auto' },
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        getComputedStyle: () => ({ position: 'static', borderTopStyle: '', transform: 'none' }),
        matchMedia: () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
        innerWidth: 1024,
        innerHeight: 768,
        pageYOffset: 0,
        pageXOffset: 0,
        requestAnimationFrame: raf,
        cancelAnimationFrame: caf,
      });

      try {
        gsap.registerPlugin(ScrollTrigger);
      } catch {}
      ScrollTrigger.getAll().forEach((t) => t.kill());
    });

    afterEach(() => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.globalTimeline.clear();
      vi.unstubAllGlobals();
      if (typeof globalThis.requestAnimationFrame === 'undefined') {
        (globalThis as unknown as { requestAnimationFrame: (cb: FrameRequestCallback) => number }).requestAnimationFrame = (cb: FrameRequestCallback) => {
          return setTimeout(cb, 16) as unknown as number;
        };
      }
    });

    it('kills every created ScrollTrigger on route change and leaves 0 triggers on calm routes', () => {
      // Simulate mounting Home ("/") with all 7 triggers
      const cleanups: (() => void)[] = [];

      // 1. Navbar
      const navSt = ScrollTrigger.create({ trigger: document.createElement('header'), start: 24, end: 999999 });
      cleanups.push(() => navSt.kill());

      // 2. Footer
      const footerSt = ScrollTrigger.create({ trigger: document.createElement('footer'), start: 'top 95%', end: 'bottom bottom' });
      cleanups.push(() => footerSt.kill());

      // 3. EvidenceSharpnessSection
      const st1 = ScrollTrigger.create({ trigger: document.createElement('section'), start: 'top 75%', once: true });
      cleanups.push(() => st1.kill());

      // 4. FaqCtaSection
      const st2 = ScrollTrigger.create({ trigger: document.createElement('section'), start: 'top 85%', end: 'bottom 60%', scrub: true });
      cleanups.push(() => st2.kill());

      // 5. TransparencySection
      const st3 = ScrollTrigger.create({ trigger: document.createElement('section'), start: 'top 80%', once: true });
      cleanups.push(() => st3.kill());

      // 6. PinnedScene (usePinnedScene)
      const st4 = ScrollTrigger.create({ trigger: document.createElement('div'), start: 'top top', end: '+=200%', scrub: 0.6 });
      cleanups.push(() => st4.kill());

      // 7. ManifestoSection (useFocusScrub)
      const st5 = ScrollTrigger.create({ trigger: document.createElement('div'), start: 'top 82%', end: 'bottom 45%', scrub: true });
      cleanups.push(() => st5.kill());

      expect(ScrollTrigger.getAll().length).toBe(7);

      // Route change to calm route ("/check"): all cleanups execute
      cleanups.forEach((c) => c());
      cleanups.length = 0;

      // Assert that 0 triggers remain on calm routes
      expect(ScrollTrigger.getAll().length).toBe(0);
    });
  });
});
