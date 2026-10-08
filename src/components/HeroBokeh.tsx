'use client';

import React, { forwardRef, useRef } from 'react';
import { gsap, useGSAP, getFx } from '@/lib/gsap';

export interface HeroBokehProps {
  className?: string;
}

// 7 large discs (140px to 330px) matching Section 2 tokens & docs/target/hero.png
const LARGE_DISCS = [
  { size: 310, top: '12%', left: '16%', colorVar: 'var(--bokeh-4)', opacity: 0.70 },
  { size: 290, top: '56%', left: '6%', colorVar: 'var(--bokeh-2)', opacity: 0.74 },
  { size: 280, top: '6%', left: '56%', colorVar: 'var(--bokeh-5)', opacity: 0.72 },
  { size: 260, top: '34%', left: '34%', colorVar: 'var(--bokeh-1)', opacity: 0.70 },
  { size: 330, top: '12%', left: '82%', colorVar: 'var(--bokeh-1)', opacity: 0.80 },
  { size: 320, top: '64%', left: '46%', colorVar: 'var(--bokeh-3)', opacity: 0.76 },
  { size: 260, top: '76%', left: '85%', colorVar: 'var(--bokeh-3)', opacity: 0.70 },
];

// 8 small crisp discs (18px to 46px, 1px edge) curving along the outer lens rim contour (matching hero.png)
const SMALL_DISCS = [
  { size: 42, top: '21%', left: '57%' },
  { size: 26, top: '29%', left: '54%' },
  { size: 46, top: '39%', left: '51%' },
  { size: 36, top: '48%', left: '49%' },
  { size: 22, top: '57%', left: '48%' },
  { size: 32, top: '65%', left: '50%' },
  { size: 18, top: '73%', left: '52%' },
  { size: 24, top: '15%', left: '54%' },
];

export const HeroBokeh = forwardRef<HTMLDivElement, HeroBokehProps>(function HeroBokeh(
  { className },
  ref
) {
  const driftRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (getFx() !== 'full' || !driftRef.current) return;

      const large = driftRef.current.querySelectorAll<HTMLElement>('.bokeh-large');
      large.forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? '+=18' : '-=14',
          x: i % 3 === 0 ? '+=12' : '-=10',
          duration: 5.5 + i * 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    },
    { scope: driftRef }
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`bokeh absolute -inset-8 pointer-events-none overflow-hidden select-none ${className || ''}`}
      style={{ opacity: 'var(--bokeh-opacity, 1)' }}
    >
      <div ref={driftRef} className="relative w-full h-full">
        {LARGE_DISCS.map((d, i) => (
          <div
            key={`l-${i}`}
            className="bokeh-large absolute rounded-full"
            style={{
              width: d.size,
              height: d.size,
              top: d.top,
              left: d.left,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${d.colorVar} 0%, ${d.colorVar} 26%, transparent 72%)`,
              opacity: d.opacity,
            }}
          />
        ))}

        {SMALL_DISCS.map((d, i) => (
          <div
            key={`s-${i}`}
            className="hidden lg:block absolute rounded-full"
            style={{
              width: d.size,
              height: d.size,
              top: d.top,
              left: d.left,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--bokeh-small-fill)',
              border: '1px solid var(--bokeh-small-edge)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          />
        ))}
      </div>
    </div>
  );
});
