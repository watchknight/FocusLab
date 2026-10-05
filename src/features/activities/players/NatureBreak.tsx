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
        <div className="flex flex-col items-center justify-between w-full h-full max-w-lg p-2 text-center select-none">
          {/* Subtle nature SVG artwork */}
          <div className="w-full max-w-md aspect-[16/10] rounded-2xl overflow-hidden border border-border shadow-inner bg-gradient-to-b from-teal-900/10 via-emerald-800/15 to-emerald-950/25 flex items-center justify-center relative">
            <svg
              viewBox="0 0 400 250"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Soft sky and subtle hill layers */}
              <circle cx="200" cy="80" r="45" fill="var(--accent)" opacity="0.12" />
              <path
                d="M0 250 Q100 160 200 200 T400 210 L400 250 Z"
                fill="var(--accent)"
                opacity="0.25"
              />
              <path
                d="M0 250 Q150 180 280 215 T400 230 L400 250 Z"
                fill="var(--accent)"
                opacity="0.35"
              />
              {/* Gentle foliage leaves */}
              <g stroke="var(--accent)" strokeWidth="2" fill="none" opacity="0.6">
                <path d="M70 240 Q85 190 95 180 Q105 195 90 240" fill="var(--accent)" fillOpacity="0.2" />
                <path d="M90 240 Q110 185 125 170 Q130 190 115 240" fill="var(--accent)" fillOpacity="0.15" />
                <path d="M290 240 Q310 190 325 175 Q335 195 315 240" fill="var(--accent)" fillOpacity="0.2" />
                <path d="M315 240 Q330 195 345 185 Q355 205 340 240" fill="var(--accent)" fillOpacity="0.15" />
              </g>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/30 backdrop-blur-[2px]">
              <span className="text-6xl font-mono font-bold tracking-tight text-text drop-shadow-sm">
                {remainingSec}s
              </span>
              <span className="text-xs uppercase tracking-widest text-muted mt-1 font-semibold">
                Rest your eyes
              </span>
            </div>
          </div>

          <div className="space-y-2 py-4">
            <p className="text-sm font-medium text-text">
              If you can, look at real plants through a window instead.
            </p>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Soft gaze on natural textures allows your executive attention network to recover without conscious effort.
            </p>
          </div>
        </div>
      )}
    </PlayerShell>
  );
};
