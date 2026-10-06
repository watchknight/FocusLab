'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { ParkingLot } from './ParkingLot';
import { RingTimer, CIRCUMFERENCE } from './RingTimer';
import {
  computeTimerSnapshot,
  calculateElapsedMs,
  formatTimeRemaining,
  PauseInterval,
} from '@/lib/timer';
import { playSoftChime } from '@/lib/audio';
import { setCalm } from '@/lib/motion';
import { useWakeLock } from '@/lib/wakelock';
import { RhythmConfig } from './RhythmStep';

interface RunStepProps {
  intention: string;
  ifThen?: { when: string; then: string };
  rhythm: RhythmConfig;
  onFinishBlock: (actualFocusSec: number, distractions: number, parked: string[]) => void;
  onAbort: () => void;
}

export const RunStep: React.FC<RunStepProps> = ({
  intention,
  ifThen,
  rhythm,
  onFinishBlock,
  onAbort,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [displayTime, setDisplayTime] = useState(
    rhythm.isFlexible ? '00:00' : formatTimeRemaining(rhythm.focusSec * 1000)
  );
  const [distractions, setDistractions] = useState(0);
  const [parkedThoughts, setParkedThoughts] = useState<string[]>([]);
  const [minuteAria, setMinuteAria] = useState('');

  const circleRef = useRef<SVGCircleElement>(null);
  const startedAtRef = useRef<number>(performance.now());
  const pausedAtRef = useRef<number | null>(null);
  const pausesRef = useRef<PauseInterval[]>([]);
  const lastMinuteAnnouncedRef = useRef<number>(-1);
  const lastSecRef = useRef<number>(-1);

  const { release: releaseWakeLock } = useWakeLock(!isPaused);

  const completeBlock = useCallback(() => {
    setCalm(false);
    releaseWakeLock();
    playSoftChime();
    const elapsed = calculateElapsedMs(
      startedAtRef.current,
      pausesRef.current,
      pausedAtRef.current,
      performance.now()
    );
    onFinishBlock(Math.max(1, Math.floor(elapsed / 1000)), distractions, parkedThoughts);
  }, [distractions, parkedThoughts, onFinishBlock, releaseWakeLock]);

  const handleAbort = useCallback(() => {
    setCalm(false);
    releaseWakeLock();
    onAbort();
  }, [onAbort, releaseWakeLock]);

  useEffect(() => {
    setCalm(true);
    if (circleRef.current) circleRef.current.style.strokeDashoffset = '0px';

    const interval = setInterval(() => {
      const now = performance.now();
      const p = pausedAtRef.current;

      if (rhythm.isFlexible) {
        const ms = calculateElapsedMs(startedAtRef.current, pausesRef.current, p, now);
        const fmt = formatTimeRemaining(ms);
        setDisplayTime(fmt);
        document.title = `(${fmt}) FocusLab`;

        const sec = Math.floor(ms / 1000);
        if (sec !== lastSecRef.current && circleRef.current) {
          lastSecRef.current = sec;
          const offset = CIRCUMFERENCE * (1 - (sec % 60) / 60);
          circleRef.current.style.strokeDashoffset = `${offset}px`;
        }

        const mins = Math.floor(ms / 60000);
        if (mins !== lastMinuteAnnouncedRef.current && mins > 0) {
          lastMinuteAnnouncedRef.current = mins;
          setMinuteAria(`${mins} minute${mins > 1 ? 's' : ''} elapsed`);
        }
      } else {
        const totalMs = rhythm.focusSec * 1000;
        const snap = computeTimerSnapshot(startedAtRef.current, totalMs, now, pausesRef.current, p);
        setDisplayTime(snap.formattedMinutesSeconds);
        document.title = `(${snap.formattedMinutesSeconds}) FocusLab`;

        const sec = Math.floor(snap.elapsedMs / 1000);
        if (sec !== lastSecRef.current && circleRef.current) {
          lastSecRef.current = sec;
          const offset = CIRCUMFERENCE * Math.min(1, snap.elapsedMs / totalMs);
          circleRef.current.style.strokeDashoffset = `${offset}px`;
        }

        const remMins = Math.floor(snap.remainingMs / 60000);
        if (remMins !== lastMinuteAnnouncedRef.current) {
          lastMinuteAnnouncedRef.current = remMins;
          setMinuteAria(`${remMins} minute${remMins > 1 ? 's' : ''} remaining`);
        }

        if (snap.isFinished && !p) completeBlock();
      }
    }, 250);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleAbort();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      setCalm(false);
      clearInterval(interval);
      window.removeEventListener('keydown', onKeyDown);
      document.title = 'FocusLab';
    };
  }, [rhythm, completeBlock, handleAbort]);

  const handleTogglePause = () => {
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

  return (
    <div className="w-full space-y-4">
      {/* Top Bar with visible Exit Control */}
      <div className="flex items-center justify-between pb-1 border-b border-border">
        <div className="min-w-0 pr-2">
          <span className="text-xs text-muted block">Intention</span>
          <p className="text-sm font-semibold text-text truncate max-w-sm">{intention}</p>
        </div>
        <button
          type="button"
          onClick={handleAbort}
          className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-md border border-border bg-surface text-text text-xs sm:text-sm font-medium hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ring shrink-0"
        >
          End (Esc)
        </button>
      </div>

      {ifThen && ifThen.when && (
        <div className="text-xs px-3 py-1.5 rounded bg-surface-2 border border-border text-text">
          <span className="text-muted">Plan: </span>
          If {ifThen.when}, then I will {ifThen.then}
        </div>
      )}

      {/* Main Focus Stage: adapts in landscape phones */}
      <div className="landscape-compact-grid grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
        {/* Left Column: Ring Timer + 3 Controls */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
          <RingTimer
            circleRef={circleRef}
            displayTime={displayTime}
            isPaused={isPaused}
            isFlexible={rhythm.isFlexible}
          />

          <div aria-live="polite" className="sr-only">{minuteAria}</div>

          {/* Three controls: Pause, End, Distracted */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-md">
            <Button
              variant="primary"
              onClick={handleTogglePause}
              className="flex-1 min-h-[44px] min-w-[100px] text-sm font-semibold"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              variant="secondary"
              onClick={completeBlock}
              className="flex-1 min-h-[44px] min-w-[100px] text-sm font-semibold"
            >
              End block
            </Button>
            <Button
              variant="subtle"
              onClick={() => setDistractions((c) => c + 1)}
              className="flex-1 min-h-[44px] min-w-[140px] text-xs font-semibold border border-border tabular-nums"
            >
              I got distracted ({distractions})
            </Button>
          </div>
        </div>

        {/* Right Column: Parking-lot field */}
        <div className="lg:col-span-5 w-full">
          <ParkingLot
            thoughts={parkedThoughts}
            onAddThought={(thought) => setParkedThoughts((prev) => [...prev, thought])}
          />
        </div>
      </div>
    </div>
  );
};
