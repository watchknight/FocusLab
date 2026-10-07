'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';

type LampState = 'idle' | 'armed' | 'lit' | 'early' | 'result';

export const ReflexLamp: React.FC = () => {
  const [state, setState] = useState<LampState>('idle');
  const [rt, setRt] = useState<number | null>(null);
  const [borderGlow, setBorderGlow] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const litTimeRef = useRef<number>(0);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
    };
  }, []);

  const triggerLight = useCallback(() => {
    // Measure from the frame where the lamp first paints
    requestAnimationFrame(() => {
      litTimeRef.current = performance.now();
      setState('lit');
      setBorderGlow(true);

      // Brief border glow duration
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
      glowTimerRef.current = setTimeout(() => {
        setBorderGlow(false);
      }, 700);
    });
  }, []);

  const armLamp = useCallback(() => {
    setState('armed');
    setRt(null);
    setBorderGlow(false);

    // Random delay between 1.0 s and 4.0 s (1000ms - 4000ms)
    const delay = 1000 + Math.random() * 3000;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(triggerLight, delay);
  }, [triggerLight]);

  const handleAction = useCallback(() => {
    if (state === 'idle' || state === 'early') {
      armLamp();
    } else if (state === 'armed') {
      // Pressed too early
      if (timerRef.current) clearTimeout(timerRef.current);
      setState('early');
    } else if (state === 'lit') {
      // Measured response time
      const elapsed = Math.round(performance.now() - litTimeRef.current);
      setRt(elapsed);
      setState('result');
      setBorderGlow(false);
    }
  }, [state, armLamp]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (state === 'result') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleAction();
      }
    },
    [state, handleAction]
  );

  const handleReset = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setState('idle');
    setRt(null);
    setBorderGlow(false);
  }, []);

  return (
    <div
      role={state !== 'result' ? 'button' : undefined}
      tabIndex={state !== 'result' ? 0 : undefined}
      aria-label={
        state === 'idle'
          ? 'Reflex lamp test: Tap to arm'
          : state === 'armed'
          ? 'Reflex lamp test: Armed, waiting for light'
          : state === 'lit'
          ? 'Reflex lamp test: Light is on! Tap now'
          : state === 'early'
          ? 'Reflex lamp test: Too early. Tap to try again'
          : undefined
      }
      onClick={state !== 'result' ? handleAction : undefined}
      onKeyDown={handleKeyDown}
      className={clsx(
        'hero-focus-card w-full max-w-sm mx-auto min-h-[300px] rounded-md border p-6 flex flex-col items-center justify-center text-center transition-colors duration-200 select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        borderGlow
          ? 'border-accent bg-surface-2 ring-2 ring-accent shadow-[0_0_24px_rgba(255,194,71,0.35)]'
          : 'border-border-strong bg-surface-2 shadow-elevation hover:border-accent/80'
      )}
    >
      {/* Polite live region announces only the final result */}
      <div aria-live="polite" className="sr-only">
        {state === 'result' && rt !== null
          ? `Result: ${rt} milliseconds. One tap is noisy. The 3-minute Check gives you a baseline.`
          : ''}
      </div>

      {state !== 'result' ? (
        <div className="space-y-4 py-2 flex flex-col items-center">
          {/* Lamp Circle */}
          <div
            className={clsx(
              'w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex items-center justify-center transition-all duration-150',
              state === 'idle' && 'border-accent/70 bg-surface shadow-[inset_0_0_12px_rgba(255,194,71,0.12)]',
              state === 'armed' && 'border-accent bg-surface text-text ring-2 ring-accent/30',
              state === 'early' && 'border-tier-not-supported bg-surface text-tier-not-supported',
              state === 'lit' && 'border-2 border-accent-edge bg-accent shadow-[0_0_32px_rgba(255,194,71,0.9)] scale-105'
            )}
          >
            <div
              className={clsx(
                'w-4 h-4 rounded-full transition-colors',
                state === 'idle' && 'bg-accent/80 border border-accent-edge shadow-[0_0_8px_rgba(255,194,71,0.5)]',
                state === 'armed' && 'bg-accent/40 animate-pulse',
                state === 'early' && 'bg-tier-not-supported',
                state === 'lit' && 'bg-on-accent'
              )}
            />
          </div>

          <div className="space-y-1">
            <p className="text-base font-semibold text-text">
              {state === 'idle' && 'Tap to arm'}
              {state === 'armed' && 'Wait for light...'}
              {state === 'lit' && 'Tap now!'}
              {state === 'early' && 'Too early. Tap to try again.'}
            </p>
            <p className="text-xs text-muted">
              {state === 'idle' && 'Or press Space / Enter'}
              {state === 'armed' && 'Lights in 1–4 seconds'}
              {state === 'lit' && 'Measuring frame response'}
              {state === 'early' && 'Tap or press Space'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-1 text-center flex flex-col items-center w-full">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted">
              Reaction time
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-accent tabular-nums tracking-tight">
              {rt} ms
            </div>
          </div>

          <p className="text-sm text-muted max-w-[32ch] leading-snug">
            One tap is noisy. The 3-minute Check gives you a baseline.
          </p>

          <div className="pt-2 flex flex-col gap-2 w-full">
            <Link href="/check" className="w-full">
              <Button
                variant="primary"
                className="w-full px-4 py-2.5 min-h-[44px] text-sm font-semibold"
              >
                Start the 3-minute Check
              </Button>
            </Link>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-muted hover:text-text underline min-h-[44px] inline-flex items-center justify-center transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflexLamp;
