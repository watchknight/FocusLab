'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Rating1To5 } from '@/store/types';

interface PreRatingViewProps {
  onRatingsComplete: (ratings: { alertness: Rating1To5; mindWandering: Rating1To5 }) => void;
  onBack: () => void;
}

const RATING_VALUES: Rating1To5[] = [1, 2, 3, 4, 5];

export const PreRatingView: React.FC<PreRatingViewProps> = ({ onRatingsComplete, onBack }) => {
  const [alertness, setAlertness] = useState<Rating1To5 | null>(null);
  const [mindWandering, setMindWandering] = useState<Rating1To5 | null>(null);

  const canProceed = alertness !== null && mindWandering !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alertness && mindWandering) {
      onRatingsComplete({ alertness, mindWandering });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-text">Pre-Check State</h2>
        <p className="text-xs text-muted">
          Rate your current state before starting the test.
        </p>
      </div>

      <Card className="space-y-3">
        <label className="block text-sm font-semibold text-text" id="alertness-label">
          Alertness (1 = very sleepy, 5 = fully alert)
        </label>
        <div
          role="radiogroup"
          aria-labelledby="alertness-label"
          className="grid grid-cols-5 gap-2"
        >
          {RATING_VALUES.map((val) => {
            const isSelected = alertness === val;
            return (
              <button
                type="button"
                key={val}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setAlertness(val)}
                className={`min-h-[44px] min-w-[44px] rounded-md border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                  isSelected
                    ? 'border-accent bg-accent text-accent-contrast'
                    : 'border-border bg-surface-2 text-text hover:bg-surface'
                }`}
              >
                {val}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="space-y-3">
        <label className="block text-sm font-semibold text-text" id="mind-wandering-label">
          Mind wandering right now (1 = not at all, 5 = constantly wandering)
        </label>
        <div
          role="radiogroup"
          aria-labelledby="mind-wandering-label"
          className="grid grid-cols-5 gap-2"
        >
          {RATING_VALUES.map((val) => {
            const isSelected = mindWandering === val;
            return (
              <button
                type="button"
                key={val}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setMindWandering(val)}
                className={`min-h-[44px] min-w-[44px] rounded-md border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                  isSelected
                    ? 'border-accent bg-accent text-accent-contrast'
                    : 'border-border bg-surface-2 text-text hover:bg-surface'
                }`}
              >
                {val}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={!canProceed}
          className="w-full sm:w-auto"
        >
          Start Test (3 Minutes)
        </Button>
        <Button
          type="button"
          variant="subtle"
          onClick={onBack}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
      </div>
    </form>
  );
};
