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
import { useT } from '@/i18n';
import { setCalm } from '@/lib/motion';

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
  const { t } = useT();
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

  const handleAbort = useCallback(() => {
    setCalm(false);
    clearAllTimers();
    onAbort();
  }, [clearAllTimers, onAbort]);

  const startNextTrial = useCallback(() => {
    const elapsed = performance.now() - testStartTimeRef.current;
    if (elapsed >= testDurationMs) {
      setCalm(false);
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
      requestAnimationFrame((paintTimestamp) => {
        onsetTimeRef.current = paintTimestamp;
        setPhase('stimulus');

        timeoutTimerRef.current = setTimeout(() => {
          trialsRef.current.push({ isiMs: currentIsiRef.current, rtMs: TIMEOUT_MS, falseStart: false });
          setPhase('feedback');
          setFeedbackText(t('check.testTimeout'));
          feedbackTimerRef.current = setTimeout(startNextTrial, FEEDBACK_DURATION_MS);
        }, TIMEOUT_MS);
      });
    }, isi);
  }, [testDurationMs, rng, clearAllTimers, onFinishTest, t]);

  const handleResponse = useCallback(() => {
    const responseTime = performance.now();

    if (phase === 'waiting') {
      if (isiTimerRef.current) clearTimeout(isiTimerRef.current);
      trialsRef.current.push({ isiMs: currentIsiRef.current, rtMs: null, falseStart: true });
      setPhase('feedback');
      setFeedbackText(t('check.testTooEarly'));
      feedbackTimerRef.current = setTimeout(startNextTrial, FEEDBACK_DURATION_MS);
      return;
    }

    if (phase === 'stimulus') {
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      const rt = Math.round(responseTime - onsetTimeRef.current);
      setDisplayRt(rt);

      const isFalseStart = rt < MIN_VALID_RT_MS;
      trialsRef.current.push({ isiMs: currentIsiRef.current, rtMs: rt, falseStart: isFalseStart });
      setPhase('feedback');
      setFeedbackText(isFalseStart ? t('check.testTooEarly') : `${rt} ms`);
      feedbackTimerRef.current = setTimeout(startNextTrial, FEEDBACK_DURATION_MS);
    }
  }, [phase, startNextTrial, t]);

  useEffect(() => {
    if (phase !== 'stimulus' || reducedMotion) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      return;
    }

    const updateCounter = () => {
      setDisplayRt(Math.floor(performance.now() - onsetTimeRef.current));
      rafIdRef.current = requestAnimationFrame(updateCounter);
    };

    rafIdRef.current = requestAnimationFrame(updateCounter);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [phase, reducedMotion]);

  useEffect(() => {
    testStartTimeRef.current = performance.now();
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const minuteInterval = setInterval(() => {
      const minutes = Math.floor((performance.now() - testStartTimeRef.current) / 60000);
      if (minutes > 0) {
        setMinuteNotice(t('check.minuteElapsed', { minutes, plural: minutes > 1 ? 's' : '' }));
      }
    }, 60000);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleAbort();
      } else if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleResponse();
      }
    };

    const abortOnHidden = () => {
      handleAbort();
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('visibilitychange', () => document.hidden && abortOnHidden());
    window.addEventListener('blur', abortOnHidden);
    setCalm(true);
    startNextTrial();

    return () => {
      setCalm(false);
      clearInterval(minuteInterval);
      clearAllTimers();
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('visibilitychange', abortOnHidden);
      window.removeEventListener('blur', abortOnHidden);
    };
  }, [clearAllTimers, handleAbort, handleResponse, startNextTrial, t]);

  const isLit = phase === 'stimulus';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Reaction test area. Press Space or tap anywhere to respond. Press Escape or End to exit."
      onClick={handleResponse}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none cursor-pointer focus:outline-none"
      style={{ backgroundColor: 'var(--bg-deep)' }}
    >
      {/* Visible exit control */}
      <div className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] sm:top-6 sm:right-6 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAbort();
          }}
          className="min-h-[44px] min-w-[44px] px-3.5 py-1.5 rounded-md border border-border bg-surface text-text text-xs sm:text-sm font-medium hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ring"
        >
          End (Esc)
        </button>
      </div>

      {/* Centred lamp circle and millisecond counter below it */}
      <div className="flex flex-col items-center justify-center">
        <div
          className={`w-24 h-24 sm:w-36 sm:h-36 rounded-full transition-colors duration-75 flex items-center justify-center ${
            isLit
              ? 'bg-accent border-4 border-accent-edge shadow-elevation'
              : 'bg-surface-2 border-2 border-border'
          }`}
          aria-hidden="true"
        />

        <div className="mt-4 sm:mt-6 h-10 flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold tabular-nums text-text">
          {phase === 'stimulus' && (
            <span>{displayRt ?? 0} ms</span>
          )}
          {phase === 'feedback' && (
            <span className={feedbackText.includes('early') || feedbackText.includes('দ্রুত') ? 'text-warn' : 'text-text'}>
              {feedbackText}
            </span>
          )}
          {phase === 'waiting' && (
            <span className="text-muted text-base font-normal tracking-wide">·</span>
          )}
        </div>
      </div>

      {minuteNotice && (
        <div aria-live="polite" className="sr-only">
          {minuteNotice}
        </div>
      )}
    </div>
  );
};
