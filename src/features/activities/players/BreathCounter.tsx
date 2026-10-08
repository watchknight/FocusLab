'use client';

import React, { useState } from 'react';
import { PlayerShell } from './PlayerShell';
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
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 landscape:space-y-2 max-w-sm w-full text-center select-none">
          {/* Centred Count Display */}
          <div className="space-y-1">
            <div className="w-20 h-20 sm:w-28 sm:h-28 landscape:w-16 landscape:h-16 rounded-full border-2 border-[#2A2F3B] bg-[#14171E] flex items-center justify-center mx-auto shadow-sm">
              <span className="text-4xl sm:text-5xl landscape:text-3xl font-mono font-bold text-[#F2F3F5] tabular-nums">
                {currentCount}
              </span>
            </div>
            <p className="text-xs text-[#9AA1AE] pt-0.5 font-mono">
              Count each exhale from 1 to 9
            </p>
          </div>

          {/* Two large tap targets filling the thumb zone on mobile */}
          <div className="grid grid-cols-2 gap-3 w-full pt-1">
            <button
              type="button"
              onClick={handleExhale}
              className="min-h-[56px] sm:min-h-[64px] landscape:min-h-[48px] px-3 py-2 rounded-[16px] border border-[#2A2F3B] bg-[#14171E] text-[#F2F3F5] hover:bg-[#1B1F28] active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#F2F3F5] flex flex-col items-center justify-center shadow-sm"
              aria-label={`Exhale breath, current count ${currentCount}`}
            >
              <span className="text-sm sm:text-base font-semibold">Exhale</span>
              <span className="text-xs font-mono text-[#9AA1AE] tabular-nums">1 to 8</span>
            </button>

            <button
              type="button"
              onClick={handleNinthExhale}
              className={`min-h-[56px] sm:min-h-[64px] landscape:min-h-[48px] px-3 py-2 rounded-[16px] border text-sm sm:text-base font-semibold active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-[#F2F3F5] flex flex-col items-center justify-center shadow-sm ${
                currentCount === 9
                  ? 'border-white bg-[#F2F3F5] text-[#07080B]'
                  : 'border-[#2A2F3B] bg-[#14171E] text-[#F2F3F5] hover:bg-[#1B1F28]'
              }`}
              aria-label="Ninth exhale, complete cycle and restart"
            >
              <span className="text-sm sm:text-base font-semibold">9th Exhale</span>
              <span className="text-xs font-mono opacity-80">Cycle finish</span>
            </button>
          </div>

          {/* Reset / lost count option */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={handleLostCount}
              className="text-xs text-[#9AA1AE] hover:text-[#F2F3F5] underline min-h-[44px] px-2 inline-flex items-center"
            >
              Lost count / Mind wandered (Restart at 1)
            </button>
          </div>

          {/* Stats Counters */}
          <div className="flex justify-center gap-4 text-xs font-mono text-[#9AA1AE] tabular-nums pt-1 border-t border-[#2A2F3B] w-full">
            <span>
              Cycles: <strong className="text-[#F2F3F5]">{completedCycles}</strong>
            </span>
            <span>
              Lost count: <strong className="text-[#F2F3F5]">{lostCountEvents}</strong>
            </span>
          </div>
        </div>
      )}
    </PlayerShell>
  );
};

export default BreathCounter;
