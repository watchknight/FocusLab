'use client';

import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { durations, easings, setCalm, useMotionAllowed } from '@/lib/motion';

let isFirstRender = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const motionOk = useMotionAllowed();

  useEffect(() => {
    isFirstRender = false;
    setCalm(false);
    return () => {
      setCalm(false);
    };
  }, []);

  useGSAP(
    () => {
      if (isFirstRender || !motionOk || !containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: durations.quick,
            ease: easings.out,
          }
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: durations.instant,
            ease: easings.out,
          }
        );
      });
    },
    { scope: containerRef, dependencies: [motionOk] }
  );

  return (
    <div ref={containerRef} className="w-full min-w-0">
      {children}
    </div>
  );
}
