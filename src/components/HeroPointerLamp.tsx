'use client';

import React, { useEffect, useState } from 'react';
import { m, useMotionValue, useSpring, useMotionTemplate } from 'motion/react';
import { springs } from '@/lib/motion';

interface HeroPointerLampProps {
  containerRef: React.RefObject<HTMLElement>;
}

export const HeroPointerLamp: React.FC<HeroPointerLampProps> = ({ containerRef }) => {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Raw pointer coordinates relative to container
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Soft spring smoothing per motion.ts specification
  const smoothX = useSpring(mouseX, springs.soft);
  const smoothY = useSpring(mouseY, springs.soft);

  // CSS mask revealing the measurement grid beneath
  const gridMask = useMotionTemplate`radial-gradient(circle 240px at ${smoothX}px ${smoothY}px, black 0%, transparent 100%)`;
  // Soft radial lamp glow
  const lampGlow = useMotionTemplate`radial-gradient(circle 300px at ${smoothX}px ${smoothY}px, rgba(255, 194, 71, 0.14), transparent 70%)`;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Must be fine pointer + hover capable, not low-end, and not reduced motion
    const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const lowEnd = root.hasAttribute('data-lowend') || root.hasAttribute('data-low-end');
    const calm = root.getAttribute('data-calm') === 'on';

    if (finePointer && !reducedMotion && !lowEnd && !calm) {
      setEnabled(true);
    }
  }, []);

  // IntersectionObserver to pause when hero is off-screen
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

  // Pointer move handler on hero container
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!isVisible) return;
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handlePointerLeave = () => {
      mouseX.set(-1000);
      mouseY.set(-1000);
    };

    el.addEventListener('pointermove', handlePointerMove, { passive: true });
    el.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [containerRef, enabled, isVisible, mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-lamp pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Faint measurement grid revealed under the pointer lamp */}
      <m.div
        className="absolute inset-0 opacity-35"
        style={{
          maskImage: gridMask,
          WebkitMaskImage: gridMask,
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Soft radial light aura */}
      <m.div
        className="absolute inset-0 opacity-90"
        style={{
          background: lampGlow,
        }}
      />
    </div>
  );
};

export default HeroPointerLamp;
