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
    <div className="landscape-compact-ring relative w-48 h-48 sm:w-60 sm:h-60 landscape:w-40 landscape:h-40 flex items-center justify-center shrink-0">
      <svg
        className="w-full h-full transform -rotate-90 pointer-events-none"
        viewBox="0 0 240 240"
        aria-hidden="true"
      >
        {/* Background track circle (fixed stage token) */}
        <circle
          cx="120"
          cy="120"
          r={RING_RADIUS}
          stroke="#1B1F28"
          strokeWidth="10"
          fill="none"
        />
        {/* Progress ring circle (fixed stage token, updated once per second) */}
        <circle
          ref={circleRef}
          cx="120"
          cy="120"
          r={RING_RADIUS}
          stroke="#F2F3F5"
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

      {/* Central Martian Mono time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
        <span
          className="text-3xl sm:text-5xl landscape:text-2xl font-mono font-bold tracking-tight text-[#F2F3F5] tabular-nums"
          aria-label={`Time: ${displayTime}`}
        >
          {displayTime}
        </span>
        <span className="text-xs landscape:text-[10px] text-[#9AA1AE] mt-1 font-mono uppercase tracking-wider">
          {isPaused ? 'Paused' : isFlexible ? 'Focusing' : 'Remaining'}
        </span>
      </div>
    </div>
  );
};

export default RingTimer;
