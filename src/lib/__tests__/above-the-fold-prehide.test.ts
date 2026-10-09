import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Above-the-fold pre-hiding and data-js-ready verification', () => {
  const rootDir = path.resolve(__dirname, '../../../');
  const heroPath = path.join(rootDir, 'src/components/Hero.tsx');
  const globalEffectsPath = path.join(rootDir, 'src/components/GlobalEffects.tsx');
  const introOverlayPath = path.join(rootDir, 'src/components/IntroOverlay.tsx');
  const useHeadlineRevealPath = path.join(rootDir, 'src/lib/motion/use-headline-reveal.ts');
  const useHeroMotionPath = path.join(rootDir, 'src/lib/hero-motion.ts');
  const fxCssPath = path.join(rootDir, 'src/styles/fx.css');

  it('Hero.tsx carries data-hide-until-js on all above-the-fold animated entrance elements', () => {
    const heroCode = fs.readFileSync(heroPath, 'utf8');

    // 1. Headline (data-split="headline") has data-hide-until-js
    expect(heroCode).toMatch(/data-split="headline"[\s\S]*?data-hide-until-js/);

    // 2. Subhead (ref={subheadRef}) has data-hide-until-js
    expect(heroCode).toMatch(/ref=\{subheadRef\}[\s\S]*?data-hide-until-js/);

    // 3. CTA buttons (ref={buttonsRef}) has data-hide-until-js
    expect(heroCode).toMatch(/ref=\{buttonsRef\}[\s\S]*?data-hide-until-js/);

    // 4. Lens wrapper (ref={lensWrapperRef}) has data-hide-until-js
    expect(heroCode).toMatch(/ref=\{lensWrapperRef\}[\s\S]*?data-hide-until-js/);
  });

  it('Never places data-hide-until-js on below-the-fold landing sections or other routes', () => {
    const homeSections = [
      'ManifestoSection.tsx',
      'HowItWorksSection.tsx',
      'PinnedScene.tsx',
      'EvidenceSharpnessSection.tsx',
      'TransparencySection.tsx',
      'FaqCtaSection.tsx',
    ];

    for (const file of homeSections) {
      const filePath = path.join(rootDir, 'src/components/home', file);
      if (fs.existsSync(filePath)) {
        const code = fs.readFileSync(filePath, 'utf8');
        expect(code).not.toContain('data-hide-until-js');
      }
    }

    // Check Footer
    const footerCode = fs.readFileSync(path.join(rootDir, 'src/components/ui/Footer.tsx'), 'utf8');
    expect(footerCode).not.toContain('data-hide-until-js');

    // Check features
    const featureDirs = ['check', 'session', 'activities', 'experiments', 'sounds', 'insights', 'learn'];
    for (const fDir of featureDirs) {
      const dirPath = path.join(rootDir, 'src/features', fDir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.tsx'));
        for (const f of files) {
          const code = fs.readFileSync(path.join(dirPath, f), 'utf8');
          expect(code).not.toContain('data-hide-until-js');
        }
      }
    }
  });

  it('GlobalEffects sets data-js-ready on <html> when GSAP mounts via useGSAP', () => {
    const globalEffectsCode = fs.readFileSync(globalEffectsPath, 'utf8');
    expect(globalEffectsCode).toContain('useGSAP');
    expect(globalEffectsCode).toMatch(/useGSAP\(\(\)\s*=>\s*\{[\s\S]*?setAttribute\('data-js-ready',\s*'true'\)/);
  });

  it('IntroOverlay sets data-js-ready on <html> in useGSAP', () => {
    const introOverlayCode = fs.readFileSync(introOverlayPath, 'utf8');
    expect(introOverlayCode).toContain('useGSAP');
    expect(introOverlayCode).toContain("setAttribute('data-js-ready', 'true')");
  });

  it('useHeadlineReveal prevents FOUC by maintaining autoAlpha: 0 until SplitText is ready', () => {
    const headlineRevealCode = fs.readFileSync(useHeadlineRevealPath, 'utf8');

    // Sets autoAlpha: 0 synchronously inside useGSAP when fx === "full"
    expect(headlineRevealCode).toContain('gsap.set(el, { autoAlpha: 0 });');

    // Reveals container only when SplitText is ready to animate words
    expect(headlineRevealCode).toContain('SplitText.create');

    // Uses gsap.fromTo for word reveal to guarantee initial hidden state
    expect(headlineRevealCode).toMatch(/gsap\.fromTo\(\s*self\.words,\s*\{[\s\S]*?opacity:\s*0/);

    // Unhides container only after words are initialized to opacity: 0
    expect(headlineRevealCode).toMatch(/gsap\.fromTo\([\s\S]*?gsap\.set\(el,\s*\{\s*autoAlpha:\s*1\s*\}\)/);

    // Prevents re-animating entrance on window resize splits
    expect(headlineRevealCode).toContain('hasAnimated');

    // Cleans up with GSAP context and guards against unmounted / calm-mode leaks
    expect(headlineRevealCode).toContain('context.isReverted');
    expect(headlineRevealCode).toContain('context.add');

    // Checks font loading API availability safely
    expect(headlineRevealCode).toMatch(/["']fonts["']\s*in\s*document/);

    // Inside fontsPromise handler, SplitText.create is invoked before unhiding container
    const thenBlock = headlineRevealCode.slice(headlineRevealCode.indexOf('fontsPromise'));
    expect(thenBlock.indexOf('SplitText.create')).toBeLessThan(thenBlock.indexOf('gsap.set(el, { autoAlpha: 1 })'));

    // Has safety timer fallback so content is never permanently hidden if font loading fails
    expect(headlineRevealCode).toContain('safetyTimer');
  });

  it('useHeroMotion uses fromTo to guarantee immediate hidden initial rendering of subhead and buttons', () => {
    const heroMotionCode = fs.readFileSync(useHeroMotionPath, 'utf8');

    // Uses gsap.fromTo for subheadRef and buttonsRef in fx === 'full'
    expect(heroMotionCode).toMatch(/gsap\.fromTo\(\s*\[subheadRef\.current,\s*buttonsRef\.current\],\s*\{\s*y:\s*24,\s*autoAlpha:\s*0\s*\}/);

    // Uses gsap.fromTo for subheadRef and buttonsRef in fx === 'lite'
    expect(heroMotionCode).toMatch(/gsap\.fromTo\(\s*\[subheadRef\.current,\s*buttonsRef\.current\],\s*\{\s*autoAlpha:\s*0\s*\}/);
  });

  it('fx.css enforces safety net, reduced-motion bypass, and data-js-ready visibility rules', () => {
    const fxCss = fs.readFileSync(fxCssPath, 'utf8');

    // 1. Full fx hides until js with 2.5s safety net
    expect(fxCss).toContain('html[data-fx="full"] [data-hide-until-js] { visibility: hidden; animation: fx-safety 0s 2.5s forwards; }');

    // 2. Off fx makes hide-until-js immediately visible
    expect(fxCss).toContain('html[data-fx="off"] [data-hide-until-js] { visibility: visible !important; }');

    // 3. data-js-ready cancels safety animation and sets visibility: visible
    expect(fxCss).toContain('html[data-js-ready] [data-hide-until-js] { animation: none; visibility: visible; }');
  });
});
