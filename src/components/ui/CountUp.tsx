'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useMotionAllowed } from '@/lib/motion';

export interface CountUpProps {
  value: number;
  duration?: number; // milliseconds
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 400,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}) => {
  const motionAllowed = useMotionAllowed();
  const [displayValue, setDisplayValue] = useState<number>(() => (motionAllowed ? 0 : value));
  const prevValueRef = useRef<number>(motionAllowed ? 0 : value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!motionAllowed) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    const startVal = prevValueRef.current;
    const endVal = value;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevValueRef.current = endVal;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, duration, motionAllowed]);

  const formatted = displayValue.toFixed(decimals);

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default CountUp;
