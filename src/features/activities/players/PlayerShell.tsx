'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { Activity } from '@/content/types';
import { getClaimById } from '@/content/evidence';
import { computeTimerSnapshot, calculateElapsedMs, PauseInterval } from '@/lib/timer';
import { useFocusLabStore } from '@/store';
import { setCalm } from '@/lib/motion';

export interface PlayerShellProps {
  activity: Activity;
  durationSec: number;
  onClose: () => void;
  children: (props: {
    elapsedSec: number;
    remainingSec: number;
    isPaused: boolean;
    audioEnabled: boolean;
    reducedMotion: boolean;
  }) => React.ReactNode;
}

export const PlayerShell: React.FC<PlayerShellProps> = ({
  activity,
  durationSec,
  onClose,
  children,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [remainingSec, setRemainingSec] = useState(durationSec);
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const startedAtRef = useRef<number>(performance.now());
  const pausedAtRef = useRef<number | null>(null);
  const pausesRef = useRef<PauseInterval[]>([]);
  const hasSavedRef = useRef<boolean>(false);

  const addActivityLog = useFocusLabStore((state) => state.addActivityLog);
  const claim = getClaimById(activity.evidenceId);

  const handleClose = useCallback(() => {
    setCalm(false);
    onClose();
  }, [onClose]);

  const handleFinish = useCallback(() => {
    setIsCompleted(true);
    if (!hasSavedRef.current) {
      hasSavedRef.current = true;
      addActivityLog({
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ts: Date.now(),
        activityId: activity.id,
        durationSec,
        completed: true,
      });
    }
  }, [activity.id, durationSec, addActivityLog]);

  useEffect(() => {
    setCalm(true);
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);

    const totalDurationMs = durationSec * 1000;
    const interval = setInterval(() => {
      if (isCompleted) return;

      const now = performance.now();
      const snapshot = computeTimerSnapshot(
        startedAtRef.current,
        totalDurationMs,
        now,
        pausesRef.current,
        pausedAtRef.current
      );

      const currentElapsed = Math.floor(snapshot.elapsedMs / 1000);
      const currentRemaining = Math.ceil(snapshot.remainingMs / 1000);
      setElapsedSec(currentElapsed);
      setRemainingSec(currentRemaining);

      if (snapshot.isFinished) {
        clearInterval(interval);
        handleFinish();
      }
    }, 200);

    return () => {
      setCalm(false);
      clearInterval(interval);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [durationSec, isCompleted, handleClose, handleFinish]);

  const togglePause = () => {
    const now = performance.now();
    if (isPaused) {
      if (pausedAtRef.current !== null) {
        pausesRef.current.push({ pausedAt: pausedAtRef.current, resumedAt: now });
        pausedAtRef.current = null;
      }
      setIsPaused(false);
    } else {
      pausedAtRef.current = now;
      setIsPaused(true);
    }
  };

  const progressPercent = Math.min(100, Math.round((elapsedSec / durationSec) * 100));

  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface p-4">
        <Card className="max-w-md w-full p-6 text-center space-y-4 bg-surface-2 border-border">
          <div className="w-12 h-12 rounded-full border-2 border-accent bg-surface text-accent flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-text">{activity.name} Completed</h2>
            <p className="text-xs text-muted">
              {durationSec} seconds logged to your browser history.
            </p>
          </div>

          {claim && (
            <div className="pt-2 flex flex-col items-center gap-2 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text">{claim.title}</span>
                <EvidenceBadge tier={claim.tier} />
              </div>
              <p className="text-xs text-muted max-w-sm">{claim.summary}</p>
            </div>
          )}

          <div className="pt-3 flex gap-2 justify-center">
            <Button variant="primary" onClick={handleClose} className="w-full sm:w-auto">
              Return to Activities
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2.5 sm:p-4 border-b border-border bg-surface-2 pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="text-sm font-semibold text-text truncate">{activity.name}</span>
          {claim && <EvidenceBadge tier={claim.tier} />}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="text-xs text-muted hover:text-text min-h-[44px] px-2 rounded"
          >
            Sound: {audioEnabled ? 'On' : 'Off'}
          </button>
          <Button variant="subtle" onClick={handleClose} className="text-xs min-h-[44px] px-3">
            Exit (Esc)
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface-2 h-1.5 overflow-hidden">
        <div
          className="bg-accent h-full transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {children({
          elapsedSec,
          remainingSec,
          isPaused,
          audioEnabled,
          reducedMotion,
        })}
      </div>

      {/* Bottom Controls */}
      <div className="p-2.5 sm:p-4 border-t border-border bg-surface flex items-center justify-between text-xs text-muted pb-[env(safe-area-inset-bottom,0px)]">
        <span className="tabular-nums font-mono">{remainingSec}s remaining</span>
        <Button variant="secondary" onClick={togglePause} className="min-w-[100px] min-h-[44px]">
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
      </div>
    </div>
  );
};
