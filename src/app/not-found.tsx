'use client';

import React, { useRef } from 'react';
import { Lens } from '@/components/Lens';
import { TransitionLink } from '@/components/IrisTransition';
import { gsap, useGSAP, getFx } from '@/lib/gsap';
import { tweenAperture } from '@/lib/motion-hooks';

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<SVGSVGElement | null>(null);

  useGSAP(
    () => {
      if (getFx() === 'off' || !lensRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!lensRef.current) return;
        // The lens closing: from 0.85 down to 0.12
        tweenAperture(lensRef.current, 0.85, 0.12, 1.2);
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center text-center py-16 sm:py-24 space-y-6 max-w-lg mx-auto min-h-[60vh]"
    >
      {/* The Lens closing */}
      <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
        <Lens ref={lensRef} open={0.85} className="w-full h-full drop-shadow-md" />
      </div>

      <div className="space-y-2">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] text-text">
          That page is out of focus.
        </h1>
      </div>

      <p className="text-sm sm:text-base text-muted max-w-md mx-auto leading-relaxed">
        The coordinate you followed has shifted or does not exist. All FocusLab tools and your local data remain intact.
      </p>

      <div className="pt-2">
        <TransitionLink
          href="/"
          className="rounded-full bg-primary-bg text-primary-text min-h-[44px] px-6 py-2.5 text-sm font-semibold inline-flex items-center justify-center hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-ring select-none"
        >
          Return to home
        </TransitionLink>
      </div>
    </div>
  );
}
