'use client';

import React from 'react';
import { PlayerShell } from './PlayerShell';
import { Card } from '@/components/ui/Card';
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
          <div className="flex flex-col items-center justify-center space-y-6 max-w-sm w-full text-center">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted">
                Unstructured baseline rest
              </span>
              <span className="text-6xl sm:text-7xl font-mono font-bold tracking-tight text-text block tabular-nums">
                {timeDisplay}
              </span>
              <span className="text-xs text-muted block">
                Sit comfortably and let your mind idle
              </span>
            </div>

            <Card className="p-4 space-y-2 bg-surface-2 border-border text-center">
              <span className="text-sm font-bold text-warn block">
                No phone, no screen.
              </span>
              <p className="text-xs text-muted">
                Close your eyes or hold an unfocused gaze. Avoid reading, browsing, or intentional cognitive tasks.
              </p>
            </Card>

            <p className="text-xs text-muted max-w-xs">
              This condition serves as an active control for comparing structured interventions against unstructured recovery.
            </p>
          </div>
        );
      }}
    </PlayerShell>
  );
};
