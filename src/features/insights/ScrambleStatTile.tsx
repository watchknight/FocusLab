'use client';

import React, { useRef } from 'react';
import clsx from 'clsx';
import { scrambleTo } from '@/lib/motion/scramble-to';
import { useGSAP } from '@/lib/gsap';

interface ScrambleStatTileProps {
  label: string;
  value: string;
  sublabel: string;
  className?: string;
}

export const ScrambleStatTile: React.FC<ScrambleStatTileProps> = ({
  label,
  value,
  sublabel,
  className,
}) => {
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
    <div className={clsx('p-4 space-y-1 min-w-0', className)}>
      <span className="text-xs font-medium text-muted block">{label}</span>
      <div
        ref={valueRef}
        className="text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums text-text truncate"
      >
        {value}
      </div>
      <span className="text-xs text-muted block truncate">{sublabel}</span>
    </div>
  );
};

export default ScrambleStatTile;
