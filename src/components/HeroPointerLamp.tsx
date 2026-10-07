'use client';

import React, { useEffect, useState, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { easings } from '@/lib/motion';

interface HeroPointerLampProps {
  containerRef: React.RefObject<HTMLElement>;
}

export const HeroPointerLamp: React.FC<HeroPointerLampProps> = ({ containerRef }) => {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const lowEnd = root.hasAttribute('data-lowend') || root.hasAttribute('data-low-end');
    const calm = root.getAttribute('data-calm') === 'on';

    if (finePointer && !reducedMotion && !lowEnd && !calm) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, enabled]);

  useGSAP(
    () => {
      if (!enabled || !containerRef.current || !lampRef.current) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const pos = { x: -1000, y: -1000 };
        const qx = gsap.quickTo(pos, 'x', {
          duration: 0.4,
          ease: easings.out,
          onUpdate: () => {
            lampRef.current?.style.setProperty('--lamp-x', `${pos.x}px`);
          },
        });
        const qy = gsap.quickTo(pos, 'y', {
          duration: 0.4,
          ease: easings.out,
          onUpdate: () => {
            lampRef.current?.style.setProperty('--lamp-y', `${pos.y}px`);
          },
        });

        const el = containerRef.current;
        if (!el) return;

        const handlePointerMove = (e: PointerEvent) => {
          if (!isVisible) return;
          const rect = el.getBoundingClientRect();
          qx(e.clientX - rect.left);
          qy(e.clientY - rect.top);
        };

        const handlePointerLeave = () => {
          qx(-1000);
          qy(-1000);
        };

        el.addEventListener('pointermove', handlePointerMove, { passive: true });
        el.addEventListener('pointerleave', handlePointerLeave, { passive: true });

        return () => {
          el.removeEventListener('pointermove', handlePointerMove);
          el.removeEventListener('pointerleave', handlePointerLeave);
        };
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        lampRef.current?.style.setProperty('--lamp-x', '-1000px');
        lampRef.current?.style.setProperty('--lamp-y', '-1000px');
      });
    },
    { scope: lampRef, dependencies: [enabled, isVisible, containerRef] }
  );

  // All lighting is restricted strictly to the ReflexLamp component per AGENTS.md
  return null;
};

export default HeroPointerLamp;
