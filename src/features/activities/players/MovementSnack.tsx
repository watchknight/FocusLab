'use client';

import React from 'react';
import { PlayerShell } from './PlayerShell';
import { Card } from '@/components/ui/Card';
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
          <div className="flex flex-col items-center justify-center space-y-6 max-w-sm w-full text-center">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted">
                Physical movement bout
              </span>
              <span className="text-6xl sm:text-7xl font-mono font-bold tracking-tight text-accent block tabular-nums">
                {timeDisplay}
              </span>
              <span className="text-sm text-muted block">
                Move continuously at a comfortable pace
              </span>
            </div>

            <Card className="p-4 space-y-2 bg-surface-2 border-border text-left">
              <span className="text-sm font-semibold text-text block">
                Effort guide: somewhat hard but safe
              </span>
              <p className="text-sm text-muted leading-relaxed">
                Aim for an effort where your heart rate rises and breathing deepens, but you can still speak in full sentences.
              </p>
              <div className="pt-1 flex flex-wrap gap-1.5 text-sm text-muted">
                <span className="px-2 py-0.5 rounded bg-surface border border-border">Brisk walking</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-border">Stairs</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-border">Bodyweight movement</span>
              </div>
            </Card>

            {activity.cautions && activity.cautions.length > 0 && (
              <div className="text-sm text-muted space-y-0.5 text-left bg-surface-2/40 p-2.5 rounded border border-border/50 w-full">
                <span className="font-semibold text-text block">Safety Notice</span>
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
