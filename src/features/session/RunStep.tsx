'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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

        // Ring progress updated once per second
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
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex flex-col justify-between p-3 sm:p-6 landscape:p-2 bg-[#07080B] text-[#F2F3F5] select-none"
      style={{
        backgroundColor: 'var(--stage-bg, #07080B)',
        color: 'var(--stage-counter, #F2F3F5)',
        animation: 'none',
      }}
    >
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#2A2F3B] w-full max-w-4xl mx-auto pt-[env(safe-area-inset-top,0px)]">
        <div className="min-w-0 pr-2">
          <span className="text-[11px] font-mono text-[#9AA1AE] block">
            Intention
          </span>
          <p className="text-sm font-semibold text-[#F2F3F5] truncate max-w-sm sm:max-w-md">
            {intention}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAbort}
          className="min-h-[44px] min-w-[44px] px-3 py-1 rounded-sm border border-[#9AA1AE]/30 bg-transparent text-[#9AA1AE] text-xs font-mono hover:text-[#F2F3F5] hover:border-[#9AA1AE]/60 focus-visible:outline-2 focus-visible:outline-[#F2F3F5] shrink-0"
          aria-label="End session (Escape)"
        >
          End (Esc)
        </button>
      </div>

      {/* Optional If-Then Plan reminder badge */}
      {ifThen && ifThen.when && (
        <div className="text-xs px-3 py-1 rounded-full bg-[#14171E] border border-[#2A2F3B] text-[#9AA1AE] max-w-md mx-auto my-1 truncate text-center">
          <span className="text-[#F2F3F5] font-medium">Plan: </span>
          If {ifThen.when}, then I will {ifThen.then}
        </div>
      )}

      {/* Main Focus Stage: Responsive and compact on landscape phones */}
      <div className="my-auto w-full max-w-4xl mx-auto py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center landscape-compact-grid">
          {/* Ring Timer + Controls */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-3 sm:space-y-4">
            <RingTimer
              circleRef={circleRef}
              displayTime={displayTime}
              isPaused={isPaused}
              isFlexible={rhythm.isFlexible}
            />

            <div aria-live="polite" className="sr-only">
              {minuteAria}
            </div>

            {/* Three Controls: Pause / Resume, End Block, I got distracted */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 w-full max-w-md px-1">
              <button
                type="button"
                onClick={handleTogglePause}
                className="flex-1 min-h-[44px] min-w-[90px] px-4 rounded-full bg-[#F2F3F5] text-[#07080B] text-xs sm:text-sm font-semibold hover:bg-white active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#F2F3F5]"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                type="button"
                onClick={completeBlock}
                className="flex-1 min-h-[44px] min-w-[90px] px-4 rounded-full border border-[#9AA1AE]/40 bg-[#14171E] text-[#F2F3F5] text-xs sm:text-sm font-semibold hover:bg-[#1B1F28] active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#F2F3F5]"
              >
                End block
              </button>
              <button
                type="button"
                onClick={() => setDistractions((c) => c + 1)}
                className="flex-1 min-h-[44px] min-w-[130px] px-3 rounded-full border border-[#9AA1AE]/30 bg-transparent text-[#9AA1AE] text-xs font-semibold hover:text-[#F2F3F5] hover:border-[#9AA1AE]/60 tabular-nums active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#F2F3F5]"
              >
                I got distracted ({distractions})
              </button>
            </div>
          </div>

          {/* Right Column: Parking Lot */}
          <div className="lg:col-span-5 w-full">
            <ParkingLot
              stageMode={true}
              thoughts={parkedThoughts}
              onAddThought={(thought) => setParkedThoughts((prev) => [...prev, thought])}
            />
          </div>
        </div>
      </div>

      {/* Bottom spacer for safe area */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </div>
  );
};

export default RunStep;
