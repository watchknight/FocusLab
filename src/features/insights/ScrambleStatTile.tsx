'use client';

import React, { useRef } from 'react';
import { scrambleTo } from '@/lib/motion/scramble-to';
import { useGSAP } from '@/lib/gsap';

interface ScrambleStatTileProps {
  label: string;
  value: string;
  sublabel: string;
}

export const ScrambleStatTile: React.FC<ScrambleStatTileProps> = ({ label, value, sublabel }) => {
  const valueRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (valueRef.current) {
        scrambleTo(valueRef.current, value);
      }
    },
    { scope: valueRef, dependencies: [value] }
  );

  return (
    <div className="p-3.5 rounded-sm bg-surface border border-border space-y-1">
      <span className="text-xs font-semibold text-muted block uppercase tracking-wider">{label}</span>
      <div
        ref={valueRef}
        className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-text"
      >
        {value}
      </div>
      <span className="text-[11px] text-muted block">{sublabel}</span>
    </div>
  );
};

export default ScrambleStatTile;
