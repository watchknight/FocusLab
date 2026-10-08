'use client';

import type { RefObject } from 'react';
import { gsap, useGSAP, getFx } from '@/lib/gsap';

export interface HeroMotionRefs {
  heroRef: RefObject<HTMLElement | null>;
  lensWrapperRef: RefObject<HTMLElement | null>;
  bokehParallaxRef: RefObject<HTMLElement | null>;
  glintRef: RefObject<HTMLElement | null>;
  subheadRef: RefObject<HTMLElement | null>;
  buttonsRef: RefObject<HTMLElement | null>;
}

export function useHeroMotion({
  heroRef,
  lensWrapperRef,
  bokehParallaxRef,
  glintRef,
  subheadRef,
  buttonsRef,
}: HeroMotionRefs) {
  // Entrance reveals & Glint rotation
  useGSAP(
    () => {
      const fx = getFx();
      if (fx === 'off') return;

      if (fx === 'full') {
        if (subheadRef.current && buttonsRef.current) {
          gsap.from([subheadRef.current, buttonsRef.current], {
            y: 24,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'focus',
            stagger: 0.08,
            delay: 0.1,
          });
        }
        if (lensWrapperRef.current) {
          gsap.fromTo(
            lensWrapperRef.current,
            { filter: 'blur(18px)', scale: 1.06, autoAlpha: 0 },
            { filter: 'blur(0px)', scale: 1, autoAlpha: 1, duration: 1.4, ease: 'focus' }
          );
        }
        if (glintRef.current) {
          const glintTween = gsap.to(glintRef.current, {
            rotation: 360,
            duration: 24,
            repeat: -1,
            ease: 'none',
          });
          const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) glintTween.play();
            else glintTween.pause();
          });
          if (heroRef.current) obs.observe(heroRef.current);
          return () => {
            obs.disconnect();
            glintTween.kill();
          };
        }
      } else if (fx === 'lite') {
        if (subheadRef.current && buttonsRef.current) {
          gsap.from([subheadRef.current, buttonsRef.current], {
            autoAlpha: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
          });
        }
        if (lensWrapperRef.current) {
          gsap.fromTo(lensWrapperRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 });
        }
      }
    },
    { scope: heroRef }
  );

  // Fine pointer parallax on lens and bokeh with quickTo
  useGSAP(
    () => {
      const hero = heroRef.current;
      const lens = lensWrapperRef.current;
      const bokeh = bokehParallaxRef.current;
      if (!hero || !lens || !bokeh) return;

      const mm = gsap.matchMedia();
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        if (getFx() !== 'full') return;

        const lensXTo = gsap.quickTo(lens, 'x', { duration: 0.9, ease: 'power2.out' });
        const lensYTo = gsap.quickTo(lens, 'y', { duration: 0.9, ease: 'power2.out' });
        const bokehXTo = gsap.quickTo(bokeh, 'x', { duration: 1.3, ease: 'power2.out' });
        const bokehYTo = gsap.quickTo(bokeh, 'y', { duration: 1.3, ease: 'power2.out' });

        const onMove = (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          lensXTo(nx * -20);
          lensYTo(ny * -16);
          bokehXTo(nx * 26);
          bokehYTo(ny * 22);
        };
        const onLeave = () => {
          lensXTo(0);
          lensYTo(0);
          bokehXTo(0);
          bokehYTo(0);
        };

        hero.addEventListener('pointermove', onMove);
        hero.addEventListener('pointerleave', onLeave);
        return () => {
          hero.removeEventListener('pointermove', onMove);
          hero.removeEventListener('pointerleave', onLeave);
        };
      });
      return () => mm.revert();
    },
    { scope: heroRef }
  );
}
