'use client';

import React from 'react';
import { PlayerShell } from './PlayerShell';
import { Activity } from '@/content/types';

interface QuietRestProps {
  activity: Activity;
  durationSec: number;
  onClose: () => void;
}

export const QuietRest: React.FC<QuietRestProps> = ({
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
              <span className="text-xs font-mono text-[#9AA1AE] block">
                Unstructured baseline rest
              </span>
              <span className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-[#F2F3F5] block tabular-nums">
                {timeDisplay}
              </span>
              <span className="text-xs text-[#9AA1AE] block">
                Sit comfortably and let your mind idle
              </span>
            </div>

            <div className="p-4 space-y-2 rounded-[16px] bg-[#14171E] border border-[#2A2F3B] text-center">
              <span className="text-sm font-bold text-[#FF8A8A] block">
                No phone, no screen.
              </span>
              <p className="text-xs text-[#9AA1AE]">
                Close your eyes or hold an unfocused gaze. Avoid reading, browsing, or intentional cognitive tasks.
              </p>
            </div>

            <p className="text-[11px] text-[#9AA1AE]/80 max-w-xs">
              This condition serves as an active control for comparing structured interventions against unstructured recovery.
            </p>
          </div>
        );
      }}
    </PlayerShell>
  );
};

export default QuietRest;
