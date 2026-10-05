'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
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
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">
          Block #{blockNumber} Complete
        </span>
        <h2 className="text-xl font-bold tracking-tight text-text">Rest & Restore</h2>
        <p className="text-sm text-muted">
          Step away from screens. Breaks help with vigor and fatigue, even if brief.
        </p>
      </div>

      <div className="py-6 flex flex-col items-center justify-center space-y-2">
        <span className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-text">
          {remainingTime}
        </span>
        <span className="text-xs text-muted font-mono">
          {isFinished ? 'Break finished' : 'Break countdown'}
        </span>
      </div>

      {activity && (
        <Card className="p-4 space-y-3 bg-surface-2 border-border">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                Suggested Break Activity
              </span>
              <h3 className="text-base font-bold text-text mt-0.5">{activity.name}</h3>
            </div>
            {claim && <EvidenceBadge tier={claim.tier} />}
          </div>

          <p className="text-xs text-muted">{activity.whenToUse}</p>

          <div className="pt-1 flex items-center gap-3">
            <Link
              href="/activities"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-accent hover:underline inline-flex items-center min-h-[44px]"
            >
              Open guided activity ↗
            </Link>
          </div>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Button variant="primary" onClick={onNextBlock} className="w-full sm:w-auto">
          Start Next Block (#{blockNumber + 1})
        </Button>
        <Button variant="secondary" onClick={onFinishSession} className="w-full sm:w-auto">
          Finish Session & Reflect
        </Button>
      </div>
    </div>
  );
};
