'use client';

import React, { useState } from 'react';
import { IntroView } from './IntroView';
import { PreRatingView } from './PreRatingView';
import { TestView } from './TestView';
import { ResultsView } from './ResultsView';
import { calculateMetrics } from '@/lib/pvt';
import { CheckResult, CheckTrial, Rating1To5 } from '@/store/types';
import { useFocusLabStore } from '@/store';

export interface FocusCheckRunnerProps {
  onComplete: (result: CheckResult) => void;
  onStart?: () => void;
  onEnd?: () => void;
  context?: 'baseline' | 'experiment';
  runId?: string;
  phase?: 'before' | 'after' | 'concurrent';
  testDurationMs?: number;
  rng?: () => number;
}

type RunnerStep = 'intro' | 'preratings' | 'test' | 'results';

export const FocusCheckRunner: React.FC<FocusCheckRunnerProps> = ({
  onComplete,
  onStart,
  onEnd,
  context = 'baseline',
  runId,
  phase,
  testDurationMs,
  rng,
}) => {
  const [step, setStep] = useState<RunnerStep>('intro');
  const [ratings, setRatings] = useState<{
    alertness: Rating1To5;
    mindWandering: Rating1To5;
  } | null>(null);
  const [latestResult, setLatestResult] = useState<CheckResult | null>(null);

  const addCheck = useFocusLabStore((state) => state.addCheck);

  const handleStartRatings = () => {
    setStep('preratings');
  };

  const handleRatingsComplete = (newRatings: {
    alertness: Rating1To5;
    mindWandering: Rating1To5;
  }) => {
    setRatings(newRatings);
    onStart?.();
    setStep('test');
  };

  const handleFinishTest = (trials: CheckTrial[]) => {
    if (!ratings) return;

    const metrics = calculateMetrics(trials);
    const newResult: CheckResult = {
      id: `chk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ts: Date.now(),
      context,
      runId,
      phase,
      preRatings: ratings,
      trials,
      metrics,
    };

    addCheck(newResult);
    onComplete(newResult);
    onEnd?.();

    setLatestResult(newResult);
    setStep('results');
  };

  const handleAbort = () => {
    onEnd?.();
    setStep('intro');
    setRatings(null);
  };

  const handleReset = () => {
    setStep('intro');
    setRatings(null);
    setLatestResult(null);
  };

  return (
    <div className="w-full">
      {step === 'intro' && <IntroView onStartRatings={handleStartRatings} />}

      {step === 'preratings' && (
        <PreRatingView
          onRatingsComplete={handleRatingsComplete}
          onBack={() => setStep('intro')}
        />
      )}

      {step === 'test' && (
        <TestView
          onFinishTest={handleFinishTest}
          onAbort={handleAbort}
          testDurationMs={testDurationMs}
          rng={rng}
        />
      )}

      {step === 'results' && latestResult && (
        <ResultsView result={latestResult} onReset={handleReset} />
      )}
    </div>
  );
};
