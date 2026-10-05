'use client';

import React, { useState } from 'react';
import { PlayerShell } from './PlayerShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Activity } from '@/content/types';

interface BreathCounterProps {
  activity: Activity;
  durationSec: number;
  onClose: () => void;
}

export const BreathCounter: React.FC<BreathCounterProps> = ({
  activity,
  durationSec,
  onClose,
}) => {
  const [currentCount, setCurrentCount] = useState<number>(1);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [lostCountEvents, setLostCountEvents] = useState<number>(0);

  const handleExhale = () => {
    if (currentCount < 8) {
      setCurrentCount((c) => c + 1);
    } else if (currentCount === 8) {
      setCurrentCount(9);
    }
  };

  const handleNinthExhale = () => {
    setCompletedCycles((c) => c + 1);
    setCurrentCount(1);
  };

  const handleLostCount = () => {
    setLostCountEvents((c) => c + 1);
    setCurrentCount(1);
  };

  return (
    <PlayerShell activity={activity} durationSec={durationSec} onClose={onClose}>
      {() => (
        <div className="flex flex-col items-center justify-center space-y-6 max-w-sm w-full text-center">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Exhale Anchor
            </span>
            <div className="w-32 h-32 rounded-full border-2 border-accent bg-accent/5 flex items-center justify-center mx-auto">
              <span className="text-6xl font-mono font-bold text-accent">
                {currentCount}
              </span>
            </div>
            <p className="text-xs text-muted pt-1">
              Count each exhale from 1 to 9. Restart if attention drifts.
            </p>
          </div>

          <div className="w-full space-y-2.5">
            {currentCount < 9 ? (
              <Button
                variant="primary"
                onClick={handleExhale}
                className="w-full min-h-[48px] text-base font-semibold"
              >
                Tap on Exhale ({currentCount} → {currentCount + 1})
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNinthExhale}
                className="w-full min-h-[48px] text-base font-semibold bg-ok border-ok text-white hover:opacity-90"
              >
                9th Exhale (Complete Cycle & Restart)
              </Button>
            )}

            <Button
              variant="subtle"
              onClick={handleLostCount}
              className="w-full min-h-[44px] text-xs text-muted hover:text-text border border-border"
            >
              Lost count / Mind wandered (Restart at 1)
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full pt-2">
            <Card className="p-2.5 text-center bg-surface-2 border-border">
              <span className="text-xs text-muted block">Completed 1–9 Cycles</span>
              <span className="text-lg font-mono font-bold text-text">{completedCycles}</span>
            </Card>
            <Card className="p-2.5 text-center bg-surface-2 border-border">
              <span className="text-xs text-muted block">Lost-Count Events</span>
              <span className="text-lg font-mono font-bold text-text">{lostCountEvents}</span>
            </Card>
          </div>

          <p className="text-[11px] text-muted italic">
            Notice: This is a simplified practice version designed to support attentional anchoring, not the laboratory research paradigm.
          </p>
        </div>
      )}
    </PlayerShell>
  );
};
