'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plate } from '@/components/ui/Plate';
import { getActivityById } from '@/content/activities';
import { getClaimById } from '@/content/evidence';
import { computeTimerSnapshot, formatTimeRemaining } from '@/lib/timer';
import { playSoftChime } from '@/lib/audio';

interface BreakStepProps {
  breakSec: number;
  blockNumber: number;
  onNextBlock: () => void;
  onFinishSession: () => void;
}

export const BreakStep: React.FC<BreakStepProps> = ({
  breakSec,
  blockNumber,
  onNextBlock,
  onFinishSession,
}) => {
  const [remainingTime, setRemainingTime] = useState(formatTimeRemaining(breakSec * 1000));
  const [isFinished, setIsFinished] = useState(false);
  const startedAtRef = useRef<number>(performance.now());

  // Determine recommended activity based on break length
  let activityId = 'nature-microbreak';
  if (breakSec < 180) {
    activityId = 'nature-microbreak';
  } else if (breakSec <= 300) {
    activityId = 'cyclic-sighing';
  } else {
    activityId = 'movement-snack';
  }

  const activity = getActivityById(activityId);
  const claim = activity ? getClaimById(activity.evidenceId) : undefined;

  useEffect(() => {
    const totalDurationMs = breakSec * 1000;
    const interval = setInterval(() => {
      const now = performance.now();
      const snapshot = computeTimerSnapshot(startedAtRef.current, totalDurationMs, now);
      setRemainingTime(snapshot.formattedMinutesSeconds);
      document.title = `(${snapshot.formattedMinutesSeconds} Break) FocusLab`;

      if (snapshot.isFinished) {
        setIsFinished(true);
        clearInterval(interval);
        playSoftChime();
      }
    }, 500);

    return () => {
      clearInterval(interval);
      document.title = 'FocusLab';
    };
  }, [breakSec]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-muted">
          Block #{blockNumber} complete
        </span>
        <h2 className="text-xl font-bold tracking-tight text-text">Rest & Restore</h2>
        <p className="text-sm text-muted">
          Step away from screens. Breaks help with vigor and fatigue, even if brief.
        </p>
      </div>

      <div className="py-4 flex flex-col items-center justify-center space-y-2">
        <span className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-text tabular-nums">
          {remainingTime}
        </span>
        <span className="text-xs text-muted font-mono">
          {isFinished ? 'Break finished' : 'Break countdown'}
        </span>
      </div>

      {activity && (
        <Plate
          tier={claim?.tier}
          caption={claim?.outcome ? `Evidenced for: ${claim.outcome}` : undefined}
          className="max-w-lg mx-auto w-full"
        >
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-muted block">
                Suggested break activity
              </span>
              <h3 className="text-base font-bold text-text mt-0.5">{activity.name}</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">{activity.whenToUse}</p>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href={`/activities/${activity.id}?play=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-xs bg-accent text-on-accent font-semibold text-xs sm:text-sm hover:brightness-105 focus-visible:outline-2 focus-visible:outline-ring"
              >
                Start activity
              </Link>
              <button
                type="button"
                onClick={onNextBlock}
                className="text-xs sm:text-sm text-muted hover:text-text underline min-h-[44px] inline-flex items-center"
              >
                Skip break
              </button>
            </div>
          </div>
        </Plate>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button variant="primary" onClick={onNextBlock} className="w-full sm:w-auto min-h-[44px]">
          Start Next Block (#{blockNumber + 1})
        </Button>
        <Button variant="secondary" onClick={onFinishSession} className="w-full sm:w-auto min-h-[44px]">
          Finish Session & Reflect
        </Button>
      </div>
    </div>
  );
};
