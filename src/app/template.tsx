'use client';

import React, { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { durations, easings, setCalm, useMotionAllowed } from '@/lib/motion';

let isFirstRender = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
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
      {isHome ? (
        children
      ) : (
        <Container className="py-6 min-w-0">{children}</Container>
      )}
    </div>
  );
}
