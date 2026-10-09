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
    <div className="p-4 rounded-[16px] bg-surface border border-border shadow-xs space-y-1">
      <span className="text-xs font-medium text-muted block">{label}</span>
      <div
        ref={valueRef}
        className="text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums text-text"
      >
        {value}
      </div>
      <span className="text-xs text-muted block">{sublabel}</span>
    </div>
  );
};

export default ScrambleStatTile;
