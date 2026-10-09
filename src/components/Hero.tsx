'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Lens } from '@/components/Lens';
import { HeroBokeh } from '@/components/HeroBokeh';
import { HeroGlassChip } from '@/components/HeroGlassChip';
import { Button } from '@/components/ui/Button';
import { getFx } from '@/lib/gsap';
import { applyAperture } from '@/lib/aperture';
import { useHeadlineReveal } from '@/lib/motion/use-headline-reveal';
import { tweenAperture } from '@/lib/motion/tween-aperture';
import { scrambleTo } from '@/lib/motion/scramble-to';
import { useHeroMotion } from '@/lib/hero-motion';
import {
  DemoState, transitionDemoState, getRandomStimulusDelay,
  calculateReactionTime, formatResultAnnouncement,
  DEMO_CAPTIONS, DEMO_APERTURES,
} from '@/lib/reflex-demo';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const lensSvgRef = useRef<SVGSVGElement | null>(null);
  const lensWrapperRef = useRef<HTMLDivElement | null>(null);
  const bokehParallaxRef = useRef<HTMLDivElement | null>(null);
  const glintRef = useRef<HTMLDivElement | null>(null);
  const subheadRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLDivElement | null>(null);

  const [demoState, setDemoState] = useState<DemoState>('idle');
  const [caption, setCaption] = useState<string>(DEMO_CAPTIONS.idle);
  const [announcement, setAnnouncement] = useState<string>('');

  const currentApertureRef = useRef<number>(DEMO_APERTURES.idle);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);
  const stimulusTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stimulusTsRef = useRef<number>(0);
  const lastActionTsRef = useRef<number>(0);

  useHeadlineReveal(heroRef);

  useHeroMotion({
    heroRef,
    lensWrapperRef,
    bokehParallaxRef,
    glintRef,
    subheadRef,
    buttonsRef,
  });

  useEffect(() => {
    return () => {
      if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current);
      if (activeTweenRef.current) activeTweenRef.current.kill();
    };
  }, []);

  const setAperture = useCallback((target: number, duration: number) => {
    const svg = lensSvgRef.current;
    if (!svg) return;
    const fx = getFx();

    if (activeTweenRef.current) {
      activeTweenRef.current.kill();
      activeTweenRef.current = null;
    }

    if (fx === 'full') {
      const from = currentApertureRef.current;
      activeTweenRef.current = tweenAperture(svg, from, target, duration);
      activeTweenRef.current.eventCallback('onUpdate', function (this: gsap.core.Tween) {
        const targets = this.targets() as { open: number }[];
        if (targets?.[0]) currentApertureRef.current = targets[0].open;
      });
      activeTweenRef.current.eventCallback('onComplete', () => {
        currentApertureRef.current = target;
        activeTweenRef.current = null;
      });
    } else {
      applyAperture(svg, target);
      currentApertureRef.current = target;
    }
  }, []);

  const handleLensAction = useCallback(() => {
    const now = performance.now();
    if (now - lastActionTsRef.current < 60) return;
    lastActionTsRef.current = now;

    if (demoState === 'armed') {
      if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current);
      const res = transitionDemoState('armed', 'tap');
      setDemoState(res.nextState);
      setCaption(res.caption);
      setAperture(res.targetAperture, 0.4);
      return;
    }

    if (demoState === 'lit') {
      const elapsed = calculateReactionTime(stimulusTsRef.current, now);
      const res = transitionDemoState('lit', 'tap');
      setDemoState(res.nextState);
      setCaption(res.caption);
      setAnnouncement(formatResultAnnouncement(elapsed));
      setAperture(res.targetAperture, 0.6);

      if (readoutRef.current) {
        scrambleTo(readoutRef.current, `${elapsed} ms`);
      }
      return;
    }

    // From idle, early, or result -> arm reflex test
    const res = transitionDemoState(demoState, 'tap');
    setDemoState(res.nextState);
    setCaption(res.caption);
    if (readoutRef.current) readoutRef.current.textContent = '- ms';
    setAperture(res.targetAperture, 0.4);

    const delay = getRandomStimulusDelay(1000, 4000);
    stimulusTimerRef.current = setTimeout(() => {
      const snap = transitionDemoState('armed', 'timeout');
      setDemoState(snap.nextState);
      setCaption(snap.caption);
      stimulusTsRef.current = performance.now();

      if (lensSvgRef.current) {
        if (activeTweenRef.current) {
          activeTweenRef.current.kill();
          activeTweenRef.current = null;
        }
        applyAperture(lensSvgRef.current, snap.targetAperture);
        currentApertureRef.current = snap.targetAperture;
      }
    }, delay);
  }, [demoState, setAperture]);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col justify-between pt-[clamp(20px,3.5vw,48px)] pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:pb-20 lg:pb-0 select-none"
    >
      <HeroBokeh ref={bokehParallaxRef} />

      {/* Viewfinder corner HUD marks: 28px, 2px stroke, 55% opacity */}
      <div aria-hidden="true" className="pointer-events-none absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 w-7 h-7 border-t-2 border-l-2 border-border-strong opacity-55" />
      <div aria-hidden="true" className="pointer-events-none absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 w-7 h-7 border-t-2 border-r-2 border-border-strong opacity-55" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-18 left-4 sm:bottom-20 sm:left-6 lg:bottom-8 lg:left-8 w-7 h-7 border-b-2 border-l-2 border-border-strong opacity-55" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-18 right-4 sm:bottom-20 sm:right-6 lg:bottom-8 lg:right-8 w-7 h-7 border-b-2 border-r-2 border-border-strong opacity-55" />

      {/* Screen reader polite live region: announces ONLY the reflex result */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div className="w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 px-[clamp(20px,5vw,72px)] max-w-[1440px] mx-auto min-w-0 z-10 relative">
        {/* Left Column: Headline, subhead, actions */}
        <div className="w-full lg:max-w-[560px] xl:max-w-[640px] flex flex-col justify-center space-y-6 sm:space-y-8 text-left py-2 sm:py-4 lg:py-12 z-20">
          <h1
            data-split="headline"
            data-hide-until-js
            className="font-display font-[780] text-text leading-[0.92] tracking-[-0.02em] text-[clamp(3rem,1.2rem+8vw,8.5rem)] text-balance"
            style={{ fontStretch: '92%' }}
          >
            <span className="block">Build focus</span>
            <span className="block">you can</span>
            <span className="block">measure.</span>
          </h1>

          <p
            ref={subheadRef}
            data-hide-until-js
            className="text-base sm:text-lg lg:text-xl text-muted leading-relaxed max-w-[46ch]"
          >
            Take a 3-minute reaction test, try short practices, and see which ones beat plain rest for you. Free, private, no account.
          </p>

          <div
            ref={buttonsRef}
            data-hide-until-js
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-6 pt-2"
          >
            <Link href="/check">
              <Button variant="primary" magnetic className="px-7 py-3 min-h-[52px] text-sm font-semibold">
                Start the 3-minute Check
              </Button>
            </Link>
            <Link
              href="/learn/how-we-rate"
              className="text-sm font-semibold text-text underline underline-offset-4 hover:opacity-80 min-h-[44px] inline-flex items-center"
            >
              How we rate evidence
            </Link>
          </div>
        </div>

        {/* Right Column: Lens Demo */}
        <div className="w-full lg:flex-1 flex items-center justify-center lg:justify-end relative lg:static">
          <div
            ref={lensWrapperRef}
            data-hide-until-js
            className="relative lg:absolute lg:right-[-12%] lg:bottom-[-16%] xl:right-[-10%] xl:bottom-[-18%] 2xl:right-[-8%] 2xl:bottom-[-20%] w-[min(340px,88vw)] max-h-[38vh] sm:max-h-none sm:w-[460px] md:w-[520px] lg:w-[760px] xl:w-[880px] 2xl:w-[1000px] aspect-square translate-y-0 lg:translate-y-0"
          >
            <button
              type="button"
              onClick={handleLensAction}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleLensAction(); }
              }}
              aria-label="Try one reflex"
              className="relative group w-full h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring rounded-full select-none"
            >
              <Lens
                ref={lensSvgRef}
                open={0.45}
                className="w-full h-full drop-shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
              />

              {/* Glint overlay: 25% white conic highlight rotating once per 24s */}
              <div
                ref={glintRef}
                data-glint
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, transparent 25deg, rgba(255, 255, 255, 0.25) 45deg, transparent 65deg, transparent 360deg)',
                  mixBlendMode: 'screen',
                }}
              />
            </button>

            <HeroGlassChip
              readoutRef={readoutRef}
              caption={caption}
              demoState={demoState}
              onCardClick={demoState !== 'result' ? handleLensAction : undefined}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
