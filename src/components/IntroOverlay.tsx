'use client';

import React, { useRef } from 'react';
import { Lens } from '@/components/Lens';
import { gsap, useGSAP, getFx } from '@/lib/gsap';
import { tweenAperture } from '@/lib/motion-hooks';
import { applyAperture } from '@/lib/aperture';

const INTRO_STORAGE_KEY = 'focuslab:intro';

/**
 * Recipe S0: First-visit intro overlay.
 * Server-rendered full-screen overlay with closed lens (#07080B).
 * GSAP opens the iris (0.08 to 0.95, 1.1s), fades the overlay, and the hero starts.
 * Skippable by Esc or any key.
 * Only in fx full and when sessionStorage["focuslab:intro"] is unset (set after playing).
 * lite and off: no overlay. <noscript> hides it.
 */
export function IntroOverlay() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<SVGSVGElement | null>(null);

  useGSAP(
    () => {
      // Mark GSAP as ready on <html>
      document.documentElement.setAttribute('data-js-ready', 'true');

      const overlay = overlayRef.current;
      const lensSvg = lensRef.current;
      if (!overlay || !lensSvg) return;

      const fx = getFx();
      let hasSeen = false;
      try {
        hasSeen = Boolean(sessionStorage.getItem(INTRO_STORAGE_KEY));
      } catch {
        hasSeen = true;
      }

      // If fx is not full, or already seen this session: hide immediately
      if (fx !== 'full' || hasSeen) {
        overlay.style.display = 'none';
        return;
      }

      const markSeen = () => {
        try {
          sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
          document.documentElement.dataset.heroSeen = '1';
        } catch {
          // storage disabled
        }
      };

      // Build GSAP animation timeline
      const tl = gsap.timeline({
        onComplete: () => {
          markSeen();
          overlay.style.display = 'none';
        },
      });

      tl.add(tweenAperture(lensSvg, 0.08, 0.95, 1.1));
      tl.to(
        overlay,
        {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
        },
        '-=0.15'
      );

      let skipped = false;
      const skip = () => {
        if (skipped) return;
        skipped = true;
        cleanupListeners();
        tl.kill();
        markSeen();
        applyAperture(lensSvg, 0.95);
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.15,
          ease: 'power2.out',
          onComplete: () => {
            overlay.style.display = 'none';
          },
        });
      };

      const handleKeyDown = () => skip();
      const handleClick = () => skip();

      function cleanupListeners() {
        window.removeEventListener('keydown', handleKeyDown);
        overlay?.removeEventListener('click', handleClick);
      }

      window.addEventListener('keydown', handleKeyDown, { once: true });
      overlay.addEventListener('click', handleClick, { once: true });

      return () => {
        cleanupListeners();
        tl.kill();
      };
    },
    { scope: overlayRef }
  );

  return (
    <>
      <noscript>
        <style>{`#intro-overlay { display: none !important; }`}</style>
      </noscript>
      <div
        id="intro-overlay"
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-stage-bg text-stage-counter transition-opacity select-none cursor-pointer"
        tabIndex={-1}
      >
        <div className="relative flex items-center justify-center w-56 h-56 sm:w-72 sm:h-72">
          <Lens
            ref={lensRef}
            open={0.08}
            className="w-full h-full drop-shadow-2xl"
          />
        </div>
      </div>
    </>
  );
}
