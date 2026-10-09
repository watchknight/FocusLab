import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { setCalm, getCalmState, setCalmMode } from '@/lib/motion';
import { gsap } from '@/lib/gsap';
import { resolveSystemTheme, applyTheme } from '@/components/ui/ThemeToggle';
import { isCalmRoute } from '@/components/IrisTransition';

describe('QA Robustness & Accessibility Verification', () => {
  beforeEach(() => {
    setCalmMode(false);
    gsap.globalTimeline.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    setCalmMode(false);
    gsap.globalTimeline.clear();
  });

  describe('1. Calm Mode Invariants (Check, Focus, Breathing)', () => {
    it('clears GSAP globalTimeline to 0 children and sets data-calm="on"', () => {
      const dummy = { val: 0 };
      gsap.to(dummy, { val: 100, duration: 5 });
      expect(gsap.globalTimeline.getChildren().length).toBeGreaterThan(0);

      let calmVal: string | null = null;
      const mockRoot = {
        setAttribute: vi.fn((attr: string, val: string) => {
          if (attr === 'data-calm') calmVal = val;
        }),
        removeAttribute: vi.fn((attr: string) => {
          if (attr === 'data-calm') calmVal = null;
        }),
        getAttribute: vi.fn((attr: string) => (attr === 'data-calm' ? calmVal : null)),
      };
      const mockChromeEls = [
        { setAttribute: vi.fn(), removeAttribute: vi.fn() },
        { setAttribute: vi.fn(), removeAttribute: vi.fn() },
      ];

      vi.stubGlobal('document', {
        documentElement: mockRoot,
        querySelectorAll: vi.fn((sel: string) => (sel === '[data-chrome]' ? mockChromeEls : [])),
      });

      setCalm(true);
      expect(getCalmState()).toBe(true);
      expect(mockRoot.setAttribute).toHaveBeenCalledWith('data-calm', 'on');
      mockChromeEls.forEach((el) => {
        expect(el.setAttribute).toHaveBeenCalledWith('inert', '');
      });
      expect(gsap.globalTimeline.getChildren().length).toBe(0);

      setCalm(false);
      expect(getCalmState()).toBe(false);
      expect(mockRoot.removeAttribute).toHaveBeenCalledWith('data-calm');
      mockChromeEls.forEach((el) => {
        expect(el.removeAttribute).toHaveBeenCalledWith('inert');
      });
    });

    it('verifies Check test stage has a visible End control and fixed stage tokens', () => {
      const filePath = path.resolve(__dirname, '../../features/check/TestView.tsx');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain('End (Esc)');
      expect(content).toContain('min-h-[44px]');
      expect(content).toContain("backgroundColor: 'var(--stage-bg, #07080B)'");
      expect(content).toContain("color: 'var(--stage-counter, #F2F3F5)'");
      expect(content).toContain("backgroundColor: 'var(--stage-stimulus, #FFFFFF)'");
    });

    it('verifies Focus run stage has a visible End control and fixed stage tokens', () => {
      const filePath = path.resolve(__dirname, '../../features/session/RunStep.tsx');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain('End (Esc)');
      expect(content).toContain('min-h-[44px]');
      expect(content).toContain("backgroundColor: 'var(--stage-bg, #07080B)'");
      expect(content).toContain("color: 'var(--stage-counter, #F2F3F5)'");
    });

    it('verifies Breathing player shell has a visible Exit control and fixed stage tokens', () => {
      const filePath = path.resolve(__dirname, '../../features/activities/players/PlayerShell.tsx');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain('Exit (Esc)');
      expect(content).toContain('min-h-[44px]');
      expect(content).toContain('bg-[#07080B]');
      expect(content).toContain('text-[#F2F3F5]');
    });
  });

  describe('2. Iris Transition & Navigation Invariants', () => {
    it('correctly classifies calm routes where iris wipes must not run', () => {
      expect(isCalmRoute('/check')).toBe(true);
      expect(isCalmRoute('/focus')).toBe(true);
      expect(isCalmRoute('/activities/cyclic-sighing')).toBe(true);
      expect(isCalmRoute('/activities/box-breathing')).toBe(true);
      expect(isCalmRoute('/activities/breath-counting')).toBe(true);
      expect(isCalmRoute('/')).toBe(false);
      expect(isCalmRoute('/learn')).toBe(false);
      expect(isCalmRoute('/experiments')).toBe(false);
    });

    it('verifies IrisProviderFull contains popstate, pageshow and double-click safeguards', () => {
      const filePath = path.resolve(__dirname, '../../components/IrisProviderFull.tsx');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain('window.addEventListener("popstate"');
      expect(content).toContain('window.addEventListener("pageshow"');
      expect(content).toContain('if (busy.current) {\n        return;\n      }');
      expect(content).toContain('isCalmRoute(pathname)');
    });

    it('verifies TransitionLink implements double-click debounce', () => {
      const filePath = path.resolve(__dirname, '../../components/IrisTransition.tsx');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain('lastClickRef');
      expect(content).toContain('now - lastClickRef.current < 400');
    });
  });

  describe('3. Keyboard & Focus Trap Invariants', () => {
    it('verifies PinnedScene manages inert attribute and does not trap focus', () => {
      const filePath = path.resolve(__dirname, '../motion/use-pinned-scene.ts');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain('panel.removeAttribute("inert")');
      expect(content).toContain('panel.setAttribute("inert", "")');
    });

    it('verifies DataManagement delete confirmation handles Esc and focus trap', () => {
      const filePath = path.resolve(__dirname, '../../features/insights/DataManagement.tsx');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain('handleFocusTrapKeyDown');
      expect(content).toContain('closeDeleteDialog');
      expect(content).toContain('deleteTriggerRef');
    });

    it('verifies Skip to main content link exists in layout', () => {
      const filePath = path.resolve(__dirname, '../../app/layout.tsx');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain('href="#main-content"');
      expect(content).toContain('Skip to main content');
      expect(content).toContain('id="main-content"');
      expect(content).toContain('tabIndex={-1}');
    });
  });

  describe('4. Theme & Forced Colors Invariants', () => {
    it('resolves contrast theme when forced-colors is active', () => {
      vi.stubGlobal('window', { matchMedia: vi.fn((q: string) => ({ matches: q === '(forced-colors: active)' })) });
      expect(resolveSystemTheme()).toBe('contrast');
    });

    it('resolves darkroom theme when prefers-color-scheme is dark', () => {
      vi.stubGlobal('window', { matchMedia: vi.fn((q: string) => ({ matches: q === '(prefers-color-scheme: dark)' })) });
      expect(resolveSystemTheme()).toBe('darkroom');
    });

    it('resolves studio theme when prefers-color-scheme is light', () => {
      vi.stubGlobal('window', { matchMedia: vi.fn(() => ({ matches: false })) });
      expect(resolveSystemTheme()).toBe('studio');
    });

    it('applies theme attributes to root element and updates color scheme', () => {
      const mockRoot = {
        setAttribute: vi.fn(),
        classList: { add: vi.fn(), remove: vi.fn() },
        style: { colorScheme: '' },
      };
      vi.stubGlobal('document', {
        documentElement: mockRoot,
        querySelector: vi.fn(() => null),
        createElement: vi.fn(() => ({ setAttribute: vi.fn() })),
        head: { appendChild: vi.fn() },
      });
      vi.stubGlobal('window', {
        getComputedStyle: vi.fn(() => ({ getPropertyValue: () => '#F1F3F5' })),
        matchMedia: vi.fn(() => ({ matches: false })),
      });

      applyTheme('studio');
      expect(mockRoot.setAttribute).toHaveBeenCalledWith('data-theme', 'studio');
      expect(mockRoot.style.colorScheme).toBe('light');

      applyTheme('darkroom');
      expect(mockRoot.setAttribute).toHaveBeenCalledWith('data-theme', 'darkroom');
      expect(mockRoot.style.colorScheme).toBe('dark');
    });
  });

  describe('5. Bengali Typography and Tokens', () => {
    it('defines Hind Siliguri fallback for Bengali font in tokens.css', () => {
      const filePath = path.resolve(__dirname, '../../styles/tokens.css');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain("--font-bn: var(--font-bn, 'Anek Bangla', 'Hind Siliguri', sans-serif);");
    });

    it('defines relaxed letter-spacing and line-height for Bengali in globals.css', () => {
      const filePath = path.resolve(__dirname, '../../app/globals.css');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain("html[lang='bn'] h1");
      expect(content).toContain('letter-spacing: 0;');
      expect(content).toContain('font-stretch: 100%;');
      expect(content).toContain('line-height: 1.15;');
    });

    it('defines overflow-x: hidden and clip on html and body in globals.css', () => {
      const filePath = path.resolve(__dirname, '../../app/globals.css');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain('overflow-x: hidden;');
      expect(content).toContain('overflow-x: clip;');
    });

    it('neutralizes letter-spacing for font-display and tracking on Bengali in globals.css', () => {
      const filePath = path.resolve(__dirname, '../../app/globals.css');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain("html[lang='bn'] .font-display");
      expect(content).toContain("html[lang='bn'] [class*='tracking-']");
    });

    it('verifies IrisTransition guards against self-navigation to avoid blackouts', () => {
      const filePath = path.resolve(__dirname, '../../components/IrisTransition.tsx');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain('currentClean === targetClean');
    });

    it('verifies DataManagement dialog handles backdrop click dismissal', () => {
      const filePath = path.resolve(__dirname, '../../features/insights/DataManagement.tsx');
      const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

      expect(content).toContain('if (e.target === e.currentTarget) closeDeleteDialog();');
    });
  });
});

