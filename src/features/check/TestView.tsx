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
        clearAllTimers();
        onAbort();
      } else if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleResponse();
      }
    };

    const abortOnHidden = () => {
      clearAllTimers();
      onAbort();
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('visibilitychange', () => document.hidden && abortOnHidden());
    window.addEventListener('blur', abortOnHidden);
    startNextTrial();

    return () => {
      clearInterval(minuteInterval);
      clearAllTimers();
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('visibilitychange', abortOnHidden);
      window.removeEventListener('blur', abortOnHidden);
    };
  }, [clearAllTimers, handleResponse, onAbort, startNextTrial, t]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Reaction test area. Press Space or tap anywhere to respond. Press Escape to abort."
      onClick={handleResponse}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-surface p-4 sm:p-6 select-none cursor-pointer focus:outline-none"
    >
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{t('check.testPrompt')}</span>
        <span>{t('check.testEsc')}</span>
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
                <span className="text-2xl font-bold tracking-widest">[ {t('check.testRespond')} ]</span>
              ) : (
                <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight">
                  {displayRt ?? 0} <span className="text-lg">ms</span>
                </span>
              )}
            </div>
          )}

          {phase === 'feedback' && (
            <div className="text-center font-mono">
              <span className={`text-3xl font-bold ${feedbackText.includes('early') || feedbackText.includes('দ্রুত') ? 'text-warn' : 'text-text'}`}>
                {feedbackText}
              </span>
            </div>
          )}

          {phase === 'waiting' && (
            <span className="text-xs text-muted font-mono tracking-wider">{t('check.testWait')}</span>
          )}
        </div>
      </div>

      {minuteNotice && (
        <div aria-live="polite" className="sr-only">
          {minuteNotice}
        </div>
      )}

      <div className="text-center text-xs text-muted pb-2">
        {t('check.testInstruction')}
      </div>
    </div>
  );
};
