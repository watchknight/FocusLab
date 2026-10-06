'use client';

import React, { useState } from 'react';
import { PlayerShell } from './PlayerShell';
import { Button } from '@/components/ui/Button';
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
    } else {
      // Already at 9, mis-tapped exhale instead of 9th exhale
      setLostCountEvents((c) => c + 1);
      setCurrentCount(1);
    }
  };

  const handleNinthExhale = () => {
    if (currentCount === 9) {
      setCompletedCycles((c) => c + 1);
      setCurrentCount(1);
    } else {
      // Pressed 9 too early
      setLostCountEvents((c) => c + 1);
      setCurrentCount(1);
    }
  };

  const handleLostCount = () => {
    setLostCountEvents((c) => c + 1);
    setCurrentCount(1);
  };

  return (
    <PlayerShell activity={activity} durationSec={durationSec} onClose={onClose}>
      {() => (
        <div className="flex flex-col items-center justify-center space-y-4 max-w-sm w-full text-center">
          {/* Count Display */}
          <div className="space-y-1">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-accent bg-surface-2 flex items-center justify-center mx-auto shadow-sm">
              <span className="text-4xl sm:text-5xl font-display font-bold text-text tabular-nums">
                {currentCount}
              </span>
            </div>
            <p className="text-xs text-muted pt-1">
              Count each exhale from 1 to 9.
            </p>
          </div>

          {/* Two large tap targets that fill the thumb zone on mobile */}
          <div className="grid grid-cols-2 gap-3 w-full pt-1">
            <button
              type="button"
              onClick={handleExhale}
              className="min-h-[56px] sm:min-h-[64px] px-3 py-2 rounded-md border border-border bg-surface text-text hover:bg-surface-2 active:bg-surface-2 text-sm sm:text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring flex flex-col items-center justify-center shadow-sm"
              aria-label={`Exhale breath, current count ${currentCount}`}
            >
              <span>Exhale</span>
              <span className="text-xs font-normal text-muted tabular-nums">1 to 8</span>
            </button>

            <button
              type="button"
              onClick={handleNinthExhale}
              className={`min-h-[56px] sm:min-h-[64px] px-3 py-2 rounded-md border text-sm sm:text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring flex flex-col items-center justify-center shadow-sm ${
                currentCount === 9
                  ? 'border-accent-edge bg-accent text-on-accent animate-pulse'
                  : 'border-border bg-surface-2 text-text hover:bg-surface'
              }`}
              aria-label="Ninth exhale, complete cycle and restart"
            >
              <span>9th Exhale</span>
              <span className="text-xs font-normal opacity-80">Cycle finish</span>
            </button>
          </div>

          {/* Reset / lost count option */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleLostCount}
              className="text-xs text-muted hover:text-text underline min-h-[44px] px-2 inline-flex items-center"
            >
              Lost count / Mind wandered (Restart at 1)
            </button>
          </div>

          {/* Stats Counters */}
          <div className="flex justify-center gap-4 text-xs text-muted tabular-nums pt-1 border-t border-border w-full">
            <span>Completed cycles: <strong className="text-text font-bold">{completedCycles}</strong></span>
            <span>Lost count: <strong className="text-text font-bold">{lostCountEvents}</strong></span>
          </div>
        </div>
      )}
    </PlayerShell>
  );
};
