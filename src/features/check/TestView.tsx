'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  getRandomIsi,
  MIN_VALID_RT_MS,
  TIMEOUT_MS,
  FEEDBACK_DURATION_MS,
  TOTAL_TEST_DURATION_MS,
} from '@/lib/pvt';
import { CheckTrial } from '@/store/types';

interface TestViewProps {
  onFinishTest: (trials: CheckTrial[]) => void;
  onAbort: () => void;
  testDurationMs?: number;
  rng?: () => number;
}

type TestPhase = 'waiting' | 'stimulus' | 'feedback';

export const TestView: React.FC<TestViewProps> = ({
  onFinishTest,
  onAbort,
  testDurationMs = TOTAL_TEST_DURATION_MS,
  rng = Math.random,
}) => {
  const [phase, setPhase] = useState<TestPhase>('waiting');
  const [displayRt, setDisplayRt] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [minuteNotice, setMinuteNotice] = useState<string>('');
  const [reducedMotion, setReducedMotion] = useState(false);

  const trialsRef = useRef<CheckTrial[]>([]);
  const testStartTimeRef = useRef<number>(0);
  const onsetTimeRef = useRef<number>(0);
  const currentIsiRef = useRef<number>(0);

  const isiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const clearAllTimers = useCallback(() => {
    if (isiTimerRef.current) clearTimeout(isiTimerRef.current);
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
  }, []);

  const startNextTrial = useCallback(() => {
    const elapsed = performance.now() - testStartTimeRef.current;
    if (elapsed >= testDurationMs) {
      clearAllTimers();
      onFinishTest(trialsRef.current);
      return;
    }

    setPhase('waiting');
    setDisplayRt(null);
    setFeedbackText('');

    const isi = getRandomIsi(rng);
    currentIsiRef.current = isi;

    isiTimerRef.current = setTimeout(() => {
      // Paint frame timestamp onset
      requestAnimationFrame((paintTimestamp) => {
        onsetTimeRef.current = paintTimestamp;
        setPhase('stimulus');

        // 10-second lapse timeout
        timeoutTimerRef.current = setTimeout(() => {
          trialsRef.current.push({
            isiMs: currentIsiRef.current,
            rtMs: TIMEOUT_MS,
            falseStart: false,
          });
          setPhase('feedback');
          setFeedbackText('Time out (>10 s)');
          feedbackTimerRef.current = setTimeout(startNextTrial, FEEDBACK_DURATION_MS);
        }, TIMEOUT_MS);
      });
    }, isi);
  }, [testDurationMs, rng, clearAllTimers, onFinishTest]);

  const handleResponse = useCallback(() => {
    const responseTime = performance.now();

    if (phase === 'waiting') {
      // Responded before onset = false start
      if (isiTimerRef.current) clearTimeout(isiTimerRef.current);
      trialsRef.current.push({
        isiMs: currentIsiRef.current,
        rtMs: null,
        falseStart: true,
      });
      setPhase('feedback');
      setFeedbackText('Too early');
      feedbackTimerRef.current = setTimeout(startNextTrial, FEEDBACK_DURATION_MS);
      return;
    }

    if (phase === 'stimulus') {
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      const rt = Math.round(responseTime - onsetTimeRef.current);
      setDisplayRt(rt);

      if (rt < MIN_VALID_RT_MS) {
        // Anticipation under 100ms = false start
        trialsRef.current.push({
          isiMs: currentIsiRef.current,
          rtMs: rt,
          falseStart: true,
        });
        setPhase('feedback');
        setFeedbackText('Too early');
      } else {
        trialsRef.current.push({
          isiMs: currentIsiRef.current,
          rtMs: rt,
          falseStart: false,
        });
        setPhase('feedback');
        setFeedbackText(`${rt} ms`);
      }

      feedbackTimerRef.current = setTimeout(startNextTrial, FEEDBACK_DURATION_MS);
    }
  }, [phase, startNextTrial]);

  // Handle animation frame running counter
  useEffect(() => {
    if (phase !== 'stimulus' || reducedMotion) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      return;
    }

    const updateCounter = () => {
      const currentRt = Math.floor(performance.now() - onsetTimeRef.current);
      setDisplayRt(currentRt);
      rafIdRef.current = requestAnimationFrame(updateCounter);
    };

    rafIdRef.current = requestAnimationFrame(updateCounter);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [phase, reducedMotion]);

  // Initialize test and setup listeners
  useEffect(() => {
    testStartTimeRef.current = performance.now();
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // Minute timer announcements for accessibility
    const minuteInterval = setInterval(() => {
      const elapsedSec = Math.floor((performance.now() - testStartTimeRef.current) / 1000);
      const minutes = Math.floor(elapsedSec / 60);
      if (minutes > 0) {
        setMinuteNotice(`${minutes} minute${minutes > 1 ? 's' : ''} elapsed`);
      }
    }, 60000);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearAllTimers();
        onAbort();
        return;
      }
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleResponse();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearAllTimers();
        onAbort();
      }
    };

    const onBlur = () => {
      clearAllTimers();
      onAbort();
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);

    startNextTrial();

    return () => {
      clearInterval(minuteInterval);
      clearAllTimers();
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
    };
  }, [clearAllTimers, handleResponse, onAbort, startNextTrial]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Reaction test area. Press Space or tap anywhere to respond. Press Escape to abort."
      onClick={handleResponse}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-surface p-4 sm:p-6 select-none cursor-pointer focus:outline-none"
    >
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border">Space</kbd> or tap anywhere</span>
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border">Esc</kbd> to abort</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div
          className={`w-full max-w-sm aspect-video rounded-xl border-2 flex flex-col items-center justify-center transition-colors ${
            phase === 'stimulus'
              ? 'bg-accent border-accent text-accent-contrast shadow-lg'
              : phase === 'feedback'
              ? 'bg-surface-2 border-border text-text'
              : 'bg-surface-2/40 border-border/50 text-muted'
          }`}
        >
          {phase === 'stimulus' && (
            <div className="text-center">
              {reducedMotion ? (
                <span className="text-2xl font-bold tracking-widest">[ RESPOND NOW ]</span>
              ) : (
                <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight">
                  {displayRt ?? 0} <span className="text-lg">ms</span>
                </span>
              )}
            </div>
          )}

          {phase === 'feedback' && (
            <div className="text-center font-mono">
              <span className={`text-3xl font-bold ${feedbackText.includes('early') ? 'text-warn' : 'text-text'}`}>
                {feedbackText}
              </span>
            </div>
          )}

          {phase === 'waiting' && (
            <span className="text-xs text-muted font-mono tracking-wider">Wait for stimulus...</span>
          )}
        </div>
      </div>

      {minuteNotice && (
        <div aria-live="polite" className="sr-only">
          {minuteNotice}
        </div>
      )}

      <div className="text-center text-xs text-muted pb-2">
        Keep your eyes on the box. Respond as quickly as possible.
      </div>
    </div>
  );
};
