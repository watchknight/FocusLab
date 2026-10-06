'use client';

import React from 'react';

export const RING_RADIUS = 100;
export const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface RingTimerProps {
  circleRef: React.RefObject<SVGCircleElement>;
  displayTime: string;
  isPaused: boolean;
  isFlexible: boolean;
}

export const RingTimer: React.FC<RingTimerProps> = ({
  circleRef,
  displayTime,
  isPaused,
  isFlexible,
}) => {
  return (
    <div className="landscape-compact-ring relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 240 240"
        aria-hidden="true"
      >
        <circle
          cx="120"
          cy="120"
          r={RING_RADIUS}
          className="stroke-surface-2"
          strokeWidth="10"
          fill="none"
        />
        <circle
          ref={circleRef}
          cx="120"
          cy="120"
          r={RING_RADIUS}
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: 0,
            transition: isPaused ? 'none' : 'stroke-dashoffset 1s linear',
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
        <span
          className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-text tabular-nums"
          aria-label={`Time: ${displayTime}`}
        >
          {displayTime}
        </span>
        <span className="text-xs text-muted mt-1 uppercase tracking-wider font-semibold">
          {isPaused ? 'Paused' : isFlexible ? 'Focusing' : 'Remaining'}
        </span>
      </div>
    </div>
  );
};
