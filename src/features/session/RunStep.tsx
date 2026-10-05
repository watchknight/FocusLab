'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  computeTimerSnapshot,
  calculateElapsedMs,
  formatTimeRemaining,
  PauseInterval,
} from '@/lib/timer';
import { playSoftChime } from '@/lib/audio';
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
  const [parkInput, setParkInput] = useState('');
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [minuteAria, setMinuteAria] = useState('');
  const [notifGranted, setNotifGranted] = useState(false);

  const startedAtRef = useRef<number>(performance.now());
  const pausedAtRef = useRef<number | null>(null);
  const pausesRef = useRef<PauseInterval[]>([]);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const lastMinuteAnnouncedRef = useRef<number>(-1);

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch {
      // Graceful fallback
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      setNotifGranted(res === 'granted');
    }
  };

  const completeBlock = useCallback(() => {
    releaseWakeLock();
    if (chimeEnabled) playSoftChime();

    if (notifGranted && typeof window !== 'undefined' && 'Notification' in window) {
      new Notification('Focus block finished', {
        body: 'Time to take a restorative break.',
      });
    }

    const totalElapsedMs = calculateElapsedMs(
      startedAtRef.current,
      pausesRef.current,
      pausedAtRef.current,
      performance.now()
    );
    const actualFocusSec = Math.max(1, Math.floor(totalElapsedMs / 1000));
    onFinishBlock(actualFocusSec, distractions, parkedThoughts);
  }, [chimeEnabled, notifGranted, distractions, parkedThoughts, onFinishBlock, releaseWakeLock]);

  // Main timer loop computed strictly from timestamps
  useEffect(() => {
    requestWakeLock();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifGranted(Notification.permission === 'granted');
    }

    const interval = setInterval(() => {
      const now = performance.now();
      const currentPausedAt = pausedAtRef.current;

      if (rhythm.isFlexible) {
        const elapsedMs = calculateElapsedMs(startedAtRef.current, pausesRef.current, currentPausedAt, now);
        const formatted = formatTimeRemaining(elapsedMs);
        setDisplayTime(formatted);
        document.title = `(${formatted}) FocusLab`;

        const minutes = Math.floor(elapsedMs / 60000);
        if (minutes !== lastMinuteAnnouncedRef.current && minutes > 0) {
          lastMinuteAnnouncedRef.current = minutes;
          setMinuteAria(`${minutes} minute${minutes > 1 ? 's' : ''} of focus elapsed`);
        }
      } else {
        const totalDurationMs = rhythm.focusSec * 1000;
        const snapshot = computeTimerSnapshot(startedAtRef.current, totalDurationMs, now, pausesRef.current, currentPausedAt);
        setDisplayTime(snapshot.formattedMinutesSeconds);
        document.title = `(${snapshot.formattedMinutesSeconds}) FocusLab`;

        const remainingMinutes = Math.floor(snapshot.remainingMs / 60000);
        if (remainingMinutes !== lastMinuteAnnouncedRef.current) {
          lastMinuteAnnouncedRef.current = remainingMinutes;
          setMinuteAria(`${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} remaining`);
        }

        if (snapshot.isFinished) {
          clearInterval(interval);
          completeBlock();
        }
      }
    }, 250);

    return () => {
      clearInterval(interval);
      releaseWakeLock();
      document.title = 'FocusLab';
    };
  }, [rhythm, completeBlock, requestWakeLock, releaseWakeLock]);

  const handleTogglePause = () => {
    const now = performance.now();
    if (isPaused) {
      if (pausedAtRef.current !== null) {
        pausesRef.current.push({ pausedAt: pausedAtRef.current, resumedAt: now });
        pausedAtRef.current = null;
      }
      setIsPaused(false);
      requestWakeLock();
    } else {
      pausedAtRef.current = now;
      setIsPaused(true);
      releaseWakeLock();
    }
  };

  const handleAddParkedThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (parkInput.trim()) {
      setParkedThoughts((prev) => [...prev, parkInput.trim()]);
      setParkInput('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Block Intention</span>
        <div className="flex items-center gap-3">
          {!notifGranted && (
            <button
              type="button"
              onClick={requestNotificationPermission}
              className="hover:text-text underline"
            >
              Enable reminders
            </button>
          )}
          <button
            type="button"
            onClick={() => setChimeEnabled(!chimeEnabled)}
            className="hover:text-text"
          >
            Chime: {chimeEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      <Card className="p-4 space-y-1 bg-surface-2 border-border text-center sm:text-left">
        <h2 className="text-base font-bold text-text truncate">{intention}</h2>
        {ifThen && (
          <p className="text-xs text-muted">
            If {ifThen.when} → {ifThen.then}
          </p>
        )}
      </Card>

      <div className="py-8 flex flex-col items-center justify-center space-y-4">
        <span
          className="text-6xl sm:text-7xl font-mono font-bold tracking-tight text-text"
          aria-label={`Time: ${displayTime}`}
        >
          {displayTime}
        </span>
        <div aria-live="polite" className="sr-only">
          {minuteAria}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button variant="primary" onClick={handleTogglePause} className="min-w-[120px]">
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button variant="secondary" onClick={completeBlock}>
            End Block
          </Button>
          <Button variant="subtle" onClick={onAbort}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-3.5 space-y-2">
          <label htmlFor="park-thought" className="block text-xs font-semibold text-text uppercase tracking-wider">
            Park a thought
          </label>
          <form onSubmit={handleAddParkedThought} className="flex gap-2">
            <input
              id="park-thought"
              type="text"
              value={parkInput}
              onChange={(e) => setParkInput(e.target.value)}
              placeholder="Jot down a sudden distraction..."
              className="flex-1 min-h-[44px] px-3 py-1.5 text-xs rounded border border-border bg-surface text-text focus-visible:outline-2 focus-visible:outline-accent"
            />
            <Button type="submit" variant="secondary" className="text-xs px-3 min-h-[44px]">
              Add
            </Button>
          </form>
          {parkedThoughts.length > 0 && (
            <ul className="text-xs text-muted space-y-1 max-h-24 overflow-y-auto pt-1">
              {parkedThoughts.map((t, idx) => (
                <li key={idx} className="truncate">• {t}</li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-3.5 flex flex-col justify-between space-y-2">
          <div>
            <span className="block text-xs font-semibold text-text uppercase tracking-wider">
              Distraction Counter
            </span>
            <p className="text-xs text-muted mt-0.5">
              Notice when attention drifts without judging it.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setDistractions((c) => c + 1)}
            className="w-full min-h-[44px] text-xs font-semibold"
          >
            I got distracted ({distractions})
          </Button>
        </Card>
      </div>
    </div>
  );
};
