'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useDial } from '@/lib/motion/use-dial';
import { gsap } from '@/lib/gsap';

interface FocusDialProps {
  value: number; // 15 to 90
  onChange: (minutes: number) => void;
  className?: string;
}

// 60 ticks around a 220px lens focus ring (precomputed with fixed 2-decimal precision to prevent SSR hydration mismatch)
const DIAL_TICKS = Array.from({ length: 60 }, (_, i) => {
  const angle = i * 6; // 360 / 60 = 6 deg
  const isMajor = i % 5 === 0;
  const rad = (angle * Math.PI) / 180;
  const rOuter = 96;
  const rInner = isMajor ? 82 : 88;
  const x1 = Number((110 + rInner * Math.sin(rad)).toFixed(2));
  const y1 = Number((110 - rInner * Math.cos(rad)).toFixed(2));
  const x2 = Number((110 + rOuter * Math.sin(rad)).toFixed(2));
  const y2 = Number((110 - rOuter * Math.cos(rad)).toFixed(2));
  return { id: i, x1, y1, x2, y2, isMajor, angle };
});

export const FocusDial: React.FC<FocusDialProps> = ({ value, onChange, className }) => {
  const dialRef = useRef<HTMLDivElement>(null);

  const handleDialValue = useCallback(
    (deg: number) => {
      const stepIndex = Math.max(0, Math.min(15, Math.round((deg - -135) / 18)));
      const nextMin = 15 + stepIndex * 5;
      onChange(nextMin);
    },
    [onChange]
  );

  useDial(dialRef, {
    min: -135,
    max: 135,
    step: 18,
    onValue: handleDialValue,
  });

  useEffect(() => {
    if (dialRef.current) {
      const targetDeg = -135 + ((value - 15) / 5) * 18;
      gsap.set(dialRef.current, { rotation: targetDeg });
      import('@/lib/gsap-drag').then(({ Draggable }) => {
        if (dialRef.current) {
          const dragger = Draggable.get(dialRef.current);
          if (dragger) dragger.update();
        }
      });
    }
  }, [value]);

  // Compute recommended break duration
  const breakMin = value >= 60 ? 15 : value >= 45 ? 10 : 5;

  return (
    <div className={`flex flex-col items-center select-none ${className || ''}`}>
      {/* Visual dial housing */}
      <div className="relative w-56 h-56 sm:w-60 sm:h-60 landscape:w-44 landscape:h-44 flex items-center justify-center">
        {/* Top index alignment marker (lens aperture index) */}
        <div
          className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-primary-bg rounded-full z-20 pointer-events-none"
          aria-hidden="true"
        />

        {/* Outer tactile bezel ring */}
        <div
          className="absolute inset-0 rounded-full border border-border bg-surface-2 shadow-inner pointer-events-none"
          aria-hidden="true"
        />

        {/* Rotating focus ring with 60 SVG ticks (driven by Draggable useDial) */}
        <div
          ref={dialRef}
          className="relative w-full h-full rounded-full cursor-grab active:cursor-grabbing touch-none z-10 flex items-center justify-center will-change-transform"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 220 220"
            className="w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            {/* Tick ring circle */}
            <circle
              cx="110"
              cy="110"
              r="96"
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
            {DIAL_TICKS.map((t) => (
              <line
                key={t.id}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.isMajor ? 'var(--text)' : 'var(--border-strong)'}
                strokeWidth={t.isMajor ? 1.75 : 1}
                opacity={t.isMajor ? 0.9 : 0.55}
              />
            ))}
            {/* Active pointer pip */}
            <circle
              cx="110"
              cy="16"
              r="3.5"
              fill="var(--primary-bg)"
            />
          </svg>
        </div>

        {/* Central HUD readout plate */}
        <div className="absolute inset-10 landscape:inset-7 rounded-full bg-surface border border-border shadow-elevation flex flex-col items-center justify-center pointer-events-none z-15">
          <span className="text-3xl sm:text-4xl landscape:text-2xl font-mono font-bold tracking-tight text-text tabular-nums">
            {value}m
          </span>
          <span className="text-[11px] text-muted font-mono mt-0.5">
            +{breakMin}m break
          </span>
        </div>
      </div>

      {/* Accessible range slider kept in sync */}
      <div className="w-full max-w-xs mt-3 sm:mt-4 space-y-1.5 px-2">
        <div className="flex justify-between items-center text-xs font-mono text-muted">
          <span>15 min</span>
          <span className="font-semibold text-text tabular-nums">{value} minutes</span>
          <span>90 min</span>
        </div>
        <input
          type="range"
          min={15}
          max={90}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Focus duration in minutes"
          aria-valuemin={15}
          aria-valuemax={90}
          aria-valuenow={value}
          aria-valuetext={`${value} minutes`}
          className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-primary-bg focus-visible:outline-2 focus-visible:outline-ring"
        />
        <p className="text-[11px] text-center text-muted">
          Drag dial or slide slider in 5-minute steps
        </p>
      </div>
    </div>
  );
};

export default FocusDial;
