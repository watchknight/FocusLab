'use client';

import React from 'react';
import { PlayerShell } from './PlayerShell';
import { Activity } from '@/content/types';

interface NatureBreakProps {
  activity: Activity;
  durationSec: number;
  onClose: () => void;
}

export const NatureBreak: React.FC<NatureBreakProps> = ({
  activity,
  durationSec,
  onClose,
}) => {
  return (
    <PlayerShell activity={activity} durationSec={durationSec} onClose={onClose}>
      {({ remainingSec }) => (
        <div className="flex flex-col items-center justify-center w-full max-w-md p-2 text-center select-none space-y-3 landscape:space-y-1">
          {/* Quiet SVG scene with stdDeviation <= 8px and fixed stage tokens */}
          <div className="w-full aspect-[16/10] max-h-[180px] sm:max-h-[220px] landscape:max-h-[130px] rounded-[16px] overflow-hidden border border-[#2A2F3B] bg-[#14171E] flex items-center justify-center relative shadow-sm">
            <svg
              viewBox="0 0 400 250"
              className="w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <filter id="nature-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                  {/* stdDeviation <= 8px */}
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>

              {/* Quiet sun disc in stage palette */}
              <circle
                cx="200"
                cy="75"
                r="36"
                fill="#F2F3F5"
                opacity="0.18"
                filter="url(#nature-soft-glow)"
              />

              {/* Gentle layered contours */}
              <path
                d="M0 250 Q120 165 240 195 T400 205 L400 250 Z"
                fill="#2A2F3B"
                opacity="0.5"
              />
              <path
                d="M0 250 Q160 185 280 210 T400 225 L400 250 Z"
                fill="#07080B"
                opacity="0.75"
              />

              {/* Minimalist reeds */}
              <g stroke="#9AA1AE" strokeWidth="1.5" opacity="0.4" fill="none">
                <path d="M60 250 Q75 200 85 190 Q95 205 80 250" />
                <path d="M80 250 Q95 195 110 180 Q115 200 100 250" />
                <path d="M300 250 Q315 200 325 185 Q335 205 320 250" />
                <path d="M320 250 Q335 205 345 195 Q355 215 340 250" />
              </g>
            </svg>

            {/* Countdown overlay in Martian Mono */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07080B]/40 backdrop-blur-[2px]">
              <span className="text-4xl sm:text-5xl landscape:text-3xl font-mono font-bold tracking-tight text-[#F2F3F5] tabular-nums">
                {remainingSec}s
              </span>
              <span className="text-xs text-[#9AA1AE] mt-0.5 font-mono">
                Rest your gaze
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-medium text-[#F2F3F5]">
              If you can, look at real plants or out a window.
            </p>
            <p className="text-[11px] text-[#9AA1AE] max-w-xs mx-auto line-clamp-2">
              Viewing greenery has small reductions in attention errors across trials.
            </p>
          </div>
        </div>
      )}
    </PlayerShell>
  );
};

export default NatureBreak;
