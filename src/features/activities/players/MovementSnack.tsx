'use client';

import React from 'react';
import { PlayerShell } from './PlayerShell';
import { Activity } from '@/content/types';

interface MovementSnackProps {
  activity: Activity;
  durationSec: number;
  onClose: () => void;
}

export const MovementSnack: React.FC<MovementSnackProps> = ({
  activity,
  durationSec,
  onClose,
}) => {
  return (
    <PlayerShell activity={activity} durationSec={durationSec} onClose={onClose}>
      {({ remainingSec }) => {
        const minutes = Math.floor(remainingSec / 60);
        const seconds = remainingSec % 60;
        const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        return (
          <div className="flex flex-col items-center justify-center space-y-4 max-w-sm w-full text-center select-none">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#9AA1AE] uppercase tracking-wider block">
                Physical movement bout
              </span>
              <span className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-[#F2F3F5] block tabular-nums">
                {timeDisplay}
              </span>
              <span className="text-xs text-[#9AA1AE] block">
                Move continuously at a comfortable pace
              </span>
            </div>

            <div className="p-4 space-y-2 rounded-[16px] bg-[#14171E] border border-[#2A2F3B] text-left">
              <span className="text-sm font-semibold text-[#F2F3F5] block">
                Effort guide: somewhat hard but safe
              </span>
              <p className="text-xs text-[#9AA1AE] leading-relaxed">
                Aim for an effort where your heart rate rises and breathing deepens, but you can still speak in full sentences.
              </p>
              <div className="pt-1 flex flex-wrap gap-1.5 text-xs text-[#9AA1AE]">
                <span className="px-2 py-0.5 rounded-sm bg-[#07080B] border border-[#2A2F3B]">Brisk walking</span>
                <span className="px-2 py-0.5 rounded-sm bg-[#07080B] border border-[#2A2F3B]">Stairs</span>
                <span className="px-2 py-0.5 rounded-sm bg-[#07080B] border border-[#2A2F3B]">Bodyweight movement</span>
              </div>
            </div>

            {activity.cautions && activity.cautions.length > 0 && (
              <div className="text-xs text-[#9AA1AE] space-y-0.5 text-left bg-[#14171E]/60 p-2.5 rounded-[12px] border border-[#2A2F3B] w-full">
                <span className="font-semibold text-[#F2F3F5] block">Safety Notice</span>
                {activity.cautions.map((c, i) => (
                  <p key={i}>• {c}</p>
                ))}
              </div>
            )}
          </div>
        );
      }}
    </PlayerShell>
  );
};

export default MovementSnack;
