'use client';

import React, { useRef, useEffect } from 'react';
import { gsap, useGSAP, getFx } from '@/lib/gsap';

interface VolumeKnobProps {
  volume: number; // 0 to 0.6
  maxVolume?: number; // default 0.6
  onChange: (vol: number) => void;
}

export const VolumeKnob: React.FC<VolumeKnobProps> = ({
  volume,
  maxVolume = 0.6,
  onChange,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const draggerRef = useRef<{ kill: () => void }[] | null>(null);

  const pct = Math.max(0, Math.min(1, volume / maxVolume));
  const currentAngle = pct * 270; // 0 to 270 deg

  useGSAP(
    () => {
      if (!knobRef.current) return;
      if (typeof window === 'undefined') return;

      // Set initial rotation
      gsap.set(knobRef.current, { rotation: currentAngle });

      if (getFx() === 'off') return;

      import('@/lib/gsap-drag').then(({ Draggable }) => {
        if (!knobRef.current) return;
        const instances = Draggable.create(knobRef.current, {
          type: 'rotation',
          bounds: { minRotation: 0, maxRotation: 270 },
          inertia: false,
          onDrag() {
            const rot = Math.max(0, Math.min(270, this.rotation));
            const newPct = rot / 270;
            onChange(newPct * maxVolume);
          },
        });

        draggerRef.current = instances;
      });

      return () => {
        if (draggerRef.current) {
          draggerRef.current.forEach((d) => d.kill());
          draggerRef.current = null;
        }
      };
    },
    { scope: knobRef }
  );

  // Sync external volume updates to knob rotation
  useEffect(() => {
    if (knobRef.current) {
      gsap.set(knobRef.current, { rotation: currentAngle });
    }
  }, [currentAngle]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const newVol = (val / 100) * maxVolume;
    onChange(newVol);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full text-xs">
        <label htmlFor="volume-range-input" className="font-semibold text-text uppercase tracking-wider">
          Volume (Draggable dial)
        </label>
        <span className="font-mono tabular-nums text-text font-bold">
          {Math.round(pct * 100)}%
        </span>
      </div>

      {/* Rotary Dial */}
      <div className="relative w-24 h-24 flex items-center justify-center select-none touch-none">
        {/* Outer tick marks SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {Array.from({ length: 19 }).map((_, i) => {
            const angle = (i / 18) * 270 - 135;
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 44 * Math.cos(rad);
            const y1 = 50 + 44 * Math.sin(rad);
            const x2 = 50 + 38 * Math.cos(rad);
            const y2 = 50 + 38 * Math.sin(rad);
            const isActive = (i / 18) <= pct;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? 'var(--primary-bg)' : 'var(--border)'}
                strokeWidth={i === 0 || i === 18 ? 2 : 1.25}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Draggable Knob body */}
        <div
          ref={knobRef}
          role="slider"
          aria-label="Tactile rotary volume dial"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct * 100)}
          className="w-16 h-16 rounded-full bg-surface border-2 border-border-strong shadow-elevation flex items-center justify-center cursor-grab active:cursor-grabbing relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {/* Lens aperture notch / indicator line */}
          <div className="absolute top-1.5 w-1 h-3 rounded-full bg-primary-bg" />
          <div className="w-8 h-8 rounded-full border border-border bg-surface-2 flex items-center justify-center pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-muted/60" />
          </div>
        </div>
      </div>

      {/* Synchronized accessible range input */}
      <input
        id="volume-range-input"
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pct * 100)}
        onChange={handleRangeChange}
        aria-label="Volume slider, synchronized with dial"
        className="w-full h-2 bg-surface-2 border border-border rounded-full accent-primary-bg cursor-pointer focus-visible:outline-2 focus-visible:outline-ring"
      />
    </div>
  );
};

export default VolumeKnob;
