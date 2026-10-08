'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { Activity } from '@/content/types';
import { getClaimById } from '@/content/evidence';
import { computeTimerSnapshot, PauseInterval } from '@/lib/timer';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07080B] text-[#F2F3F5] select-none">
        <Card className="max-w-md w-full p-6 text-center space-y-4 bg-[#14171E] border-[#2A2F3B] text-[#F2F3F5]">
          <div className="w-12 h-12 rounded-full border-2 border-[#5FE3A1] bg-[#14171E] text-[#5FE3A1] flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#F2F3F5]">{activity.name} Completed</h2>
            <p className="text-xs text-[#9AA1AE]">
              {durationSec} seconds logged to your browser history.
            </p>
          </div>

          {claim && (
            <div className="pt-2 flex flex-col items-center gap-2 border-t border-[#2A2F3B]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#F2F3F5]">{claim.title}</span>
                <EvidenceMeter tier={claim.tier} />
              </div>
              <p className="text-xs text-[#9AA1AE] max-w-sm">{claim.summary}</p>
            </div>
          )}

          <div className="pt-3 flex gap-2 justify-center">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto min-h-[44px] px-6 rounded-full bg-[#F2F3F5] text-[#07080B] font-semibold text-sm hover:bg-white"
            >
              Return to Activities
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#07080B] text-[#F2F3F5] select-none"
      style={{
        backgroundColor: 'var(--stage-bg, #07080B)',
        color: 'var(--stage-counter, #F2F3F5)',
        animation: 'none',
      }}
    >
      {/* Top Bar with fixed stage tokens */}
      <div className="flex items-center justify-between p-2.5 sm:p-4 landscape:py-1.5 border-b border-[#2A2F3B] bg-[#07080B] pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="text-sm font-semibold text-[#F2F3F5] truncate">{activity.name}</span>
          {claim && (
            <>
              <EvidenceMeter tier={claim.tier} showLabel={false} className="sm:hidden" />
              <EvidenceMeter tier={claim.tier} className="hidden sm:inline-flex" />
            </>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="text-xs text-[#9AA1AE] hover:text-[#F2F3F5] min-h-[44px] px-2 rounded font-mono"
          >
            Sound: {audioEnabled ? 'On' : 'Off'}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="min-h-[44px] min-w-[44px] px-3 py-1 text-xs font-mono rounded-sm border border-[#9AA1AE]/30 text-[#9AA1AE] hover:text-[#F2F3F5] hover:border-[#9AA1AE]/60"
            aria-label="Exit activity (Escape)"
          >
            Exit (Esc)
          </button>
        </div>
      </div>

      {/* Thin overall progress bar */}
      <div className="w-full bg-[#1B1F28] h-1 overflow-hidden" aria-hidden="true">
        <div
          className="bg-[#F2F3F5] h-full transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 landscape:py-1 relative overflow-y-auto">
        {children({
          elapsedSec,
          remainingSec,
          isPaused,
          audioEnabled,
          reducedMotion,
        })}
      </div>

      {/* Bottom Bar Controls */}
      <div className="p-2 sm:p-4 landscape:py-1.5 border-t border-[#2A2F3B] bg-[#07080B] flex items-center justify-between text-xs text-[#9AA1AE] pb-[env(safe-area-inset-bottom,0px)]">
        <span className="tabular-nums font-mono text-sm text-[#F2F3F5]">{remainingSec}s remaining</span>
        <button
          type="button"
          onClick={togglePause}
          className="min-w-[100px] min-h-[44px] px-4 rounded-full border border-[#9AA1AE]/40 bg-[#14171E] text-[#F2F3F5] font-semibold text-xs sm:text-sm hover:bg-[#1B1F28]"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
};

export default PlayerShell;
