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
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [minuteNotice, setMinuteNotice] = useState<string>('');

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

  const phaseRef = useRef<TestPhase>(phase);
  phaseRef.current = phase;

  const handleAbortRef = useRef(handleAbort);
  handleAbortRef.current = handleAbort;

  const handleResponse = useCallback(() => {
    const responseTime = performance.now();
    const currentPhase = phaseRef.current;

    if (currentPhase === 'waiting') {
      if (isiTimerRef.current) clearTimeout(isiTimerRef.current);
      trialsRef.current.push({ isiMs: currentIsiRef.current, rtMs: null, falseStart: true });
      setPhase('feedback');
      setFeedbackText(t('check.testTooEarly'));
      feedbackTimerRef.current = setTimeout(startNextTrial, FEEDBACK_DURATION_MS);
      return;
    }

    if (currentPhase === 'stimulus') {
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      const rt = Math.round(responseTime - onsetTimeRef.current);

      const isFalseStart = rt < MIN_VALID_RT_MS;
      trialsRef.current.push({ isiMs: currentIsiRef.current, rtMs: rt, falseStart: isFalseStart });
      setPhase('feedback');
      setFeedbackText(isFalseStart ? t('check.testTooEarly') : `${rt} ms`);
      feedbackTimerRef.current = setTimeout(startNextTrial, FEEDBACK_DURATION_MS);
    }
  }, [startNextTrial, t]);

  const handleResponseRef = useRef(handleResponse);
  handleResponseRef.current = handleResponse;

  useEffect(() => {
    testStartTimeRef.current = performance.now();

    const minuteInterval = setInterval(() => {
      const minutes = Math.floor((performance.now() - testStartTimeRef.current) / 60000);
      if (minutes > 0) {
        setMinuteNotice(t('check.minuteElapsed', { minutes, plural: minutes > 1 ? 's' : '' }));
      }
    }, 60000);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleAbortRef.current();
      } else if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleResponseRef.current();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleAbortRef.current();
      }
    };

    const handleBlur = () => {
      handleAbortRef.current();
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    setCalm(true);
    startNextTrial();

    return () => {
      setCalm(false);
      clearInterval(minuteInterval);
      clearAllTimers();
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [clearAllTimers, startNextTrial, t]);

  const isLit = phase === 'stimulus';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Reaction test area. Press Space or tap anywhere to respond. Press Escape to exit."
      onClick={handleResponse}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none cursor-pointer focus:outline-none bg-[#07080B] text-[#F2F3F5]"
      style={{
        backgroundColor: 'var(--stage-bg, #07080B)',
        color: 'var(--stage-counter, #F2F3F5)',
        animation: 'none',
      }}
    >
      {/* 4 Viewfinder corner brackets (28px = w-7 h-7, 2px, 55% opacity) */}
      <span aria-hidden="true" className="absolute top-4 left-4 sm:top-6 sm:left-6 w-7 h-7 border-t-2 border-l-2 border-[#9AA1AE]/55 pointer-events-none" />
      <span aria-hidden="true" className="absolute top-4 right-4 sm:top-6 sm:right-6 w-7 h-7 border-t-2 border-r-2 border-[#9AA1AE]/55 pointer-events-none" />
      <span aria-hidden="true" className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-7 h-7 border-b-2 border-l-2 border-[#9AA1AE]/55 pointer-events-none" />
      <span aria-hidden="true" className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-7 h-7 border-b-2 border-r-2 border-[#9AA1AE]/55 pointer-events-none" />

      {/* Visible End control for all users (touch and desktop), positioned clear of the corner bracket */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleAbort();
        }}
        className="absolute top-3.5 right-12 sm:top-5 sm:right-16 z-50 min-h-[44px] px-3 py-1 text-xs font-mono rounded-sm border border-[#9AA1AE]/30 bg-transparent text-[#9AA1AE] hover:text-[#F2F3F5] hover:border-[#9AA1AE]/60 focus-visible:outline-2 focus-visible:outline-[#F2F3F5] inline-flex items-center justify-center cursor-pointer select-none"
        aria-label="End test (or press Escape)"
      >
        End (Esc)
      </button>

      {/* Centred 80px AF square, stimulus disc, and Martian Mono counter below */}
      <div className="flex flex-col items-center justify-center pointer-events-none">
        {/* Central 80px AF square */}
        <div
          className="relative w-[80px] h-[80px] border border-[#9AA1AE]/40 flex items-center justify-center"
          aria-hidden="true"
        >
          {/* AF corner tick marks */}
          <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#9AA1AE]" />
          <span className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#9AA1AE]" />
          <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#9AA1AE]" />
          <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#9AA1AE]" />

          {/* The stimulus disc appearing in ONE FRAME (no tween, no CSS transition) */}
          {isLit && (
            <div
              className="w-[72px] h-[72px] rounded-full bg-[#FFFFFF]"
              style={{
                backgroundColor: 'var(--stage-stimulus, #FFFFFF)',
                animation: 'none',
                transition: 'none',
              }}
            />
          )}
        </div>

        {/* Counter in Martian Mono below */}
        <div className="mt-6 h-10 flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold tabular-nums text-[#F2F3F5]">
          {phase === 'feedback' ? (
            <span className={feedbackText.includes('early') || feedbackText.includes('দ্রুত') ? 'text-[#FF8A8A]' : 'text-[#F2F3F5]'}>
              {feedbackText}
            </span>
          ) : (
            <span className="text-[#9AA1AE]/70 font-mono text-xl">— ms</span>
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
