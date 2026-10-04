'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ActivityDefinition } from '@/content/types';
import { computeTimerSnapshot } from '@/lib/timer';
import { useFocusStore } from '@/store/useFocusStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckForm } from '@/features/check/CheckForm';

interface SessionPlayerProps {
  activity: ActivityDefinition;
  preCheckId?: string;
}

export const SessionPlayer: React.FC<SessionPlayerProps> = ({
  activity,
  preCheckId,
}) => {
  const router = useRouter();
  const totalDurationMs = activity.durationSeconds * 1000;

  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [showPostCheck, setShowPostCheck] = useState(false);

  // Pure timestamp tracking using performance.now()
  const startPerfTimeRef = useRef<number>(0);
  const accumulatedMsRef = useRef<number>(0);
  const lastAnnouncedMinuteRef = useRef<number>(-1);
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');

  const completeSession = useFocusStore((s) => s.completeSession);
  const startStoreSession = useFocusStore((s) => s.startSession);

  // Start on mount
  useEffect(() => {
    startPerfTimeRef.current = performance.now();
    startStoreSession(activity.id, totalDurationMs, preCheckId);
    setIsRunning(true);
  }, [activity.id, totalDurationMs, preCheckId, startStoreSession]);

  // Animation frame loop computing snapshot strictly from performance.now()
  useEffect(() => {
    if (!isRunning || isFinished) return;

    let animId: number;

    const tick = () => {
      const currentNow = performance.now();
      const currentSegment = currentNow - startPerfTimeRef.current;
      const totalElapsed = accumulatedMsRef.current + currentSegment;

      const snapshot = computeTimerSnapshot(0, totalDurationMs, totalElapsed);
      setElapsedMs(snapshot.elapsedMs);

      // Accessibility: aria-live announced once per minute
      const currentRemainingMinutes = Math.floor(snapshot.remainingMs / 60000);
      if (
        currentRemainingMinutes !== lastAnnouncedMinuteRef.current &&
        snapshot.remainingMs > 0
      ) {
        lastAnnouncedMinuteRef.current = currentRemainingMinutes;
        setAriaAnnouncement(`${currentRemainingMinutes + 1} minutes remaining`);
      }

      if (snapshot.isFinished) {
        setIsRunning(false);
        setIsFinished(true);
        setAriaAnnouncement('Activity session completed.');
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, isFinished, totalDurationMs]);

  const togglePause = () => {
    if (isRunning) {
      accumulatedMsRef.current += performance.now() - startPerfTimeRef.current;
      setIsRunning(false);
    } else {
      startPerfTimeRef.current = performance.now();
      setIsRunning(true);
    }
  };

  const handleManualComplete = () => {
    setIsRunning(false);
    setIsFinished(true);
    setShowPostCheck(true);
  };

  const handlePostCheckDone = (postCheckId: string) => {
    completeSession(true, postCheckId);
    router.push('/compare');
  };

  const handleSkipPostCheck = () => {
    completeSession(true, undefined);
    router.push('/compare');
  };

  const snapshot = computeTimerSnapshot(0, totalDurationMs, elapsedMs);

  if (showPostCheck || isFinished) {
    return (
      <div className="space-y-4">
        <Card className="text-center py-4 space-y-2">
          <p className="text-sm font-semibold text-teal-accent">
            Session Completed: {activity.title}
          </p>
          <p className="text-xs text-content-secondary">
            Perform a quick post-check to log how your state shifted.
          </p>
        </Card>
        <CheckForm
          title="Post-Practice Self-Check"
          description="Rate your mental state now to quantify the effect of this activity."
          onSaved={handlePostCheckDone}
        />
        <div className="text-center">
          <Button variant="subtle" onClick={handleSkipPostCheck}>
            Skip Post-Check & View Trends
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="space-y-5">
      <div className="text-center space-y-2">
        <h1 className="text-lg font-semibold text-content-primary">
          {activity.title}
        </h1>
        <div
          className="text-4xl font-mono font-semibold text-teal-accent tracking-wider"
          aria-hidden="true"
        >
          {snapshot.formattedMinutesSeconds}
        </div>
        {/* Accessible screen-reader live region updating only once per minute */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {ariaAnnouncement}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2 bg-surface-tertiary rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(snapshot.progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Activity progress"
      >
        <div
          className="h-full bg-teal-accent transition-all duration-150"
          style={{ width: `${snapshot.progressPercent}%` }}
        />
      </div>

      <div className="bg-surface-primary p-3 rounded border border-surface-border text-xs space-y-2">
        <p className="font-semibold text-content-primary">Instructions:</p>
        <ul className="list-disc list-inside space-y-1 text-content-secondary">
          {activity.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <Button
          variant={isRunning ? 'secondary' : 'primary'}
          onClick={togglePause}
          fullWidth
        >
          {isRunning ? 'Pause' : 'Resume'}
        </Button>
        <Button variant="primary" onClick={handleManualComplete} fullWidth>
          Finish Early
        </Button>
      </div>
    </Card>
  );
};
