'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Rating1To5 } from '@/store/types';
import { useT } from '@/i18n';

interface PreRatingViewProps {
  onRatingsComplete: (ratings: { alertness: Rating1To5; mindWandering: Rating1To5 }) => void;
  onBack: () => void;
}

const RATING_VALUES: Rating1To5[] = [1, 2, 3, 4, 5];

export const PreRatingView: React.FC<PreRatingViewProps> = ({ onRatingsComplete, onBack }) => {
  const { t } = useT();
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
    <form onSubmit={handleSubmit} className="w-full flex justify-center py-2 sm:py-4">
      <Panel className="w-full max-w-[720px] space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-text">{t('check.ratingsTitle')}</h2>
          <p className="text-xs sm:text-sm text-muted">
            {t('check.ratingsSub')}
          </p>
        </div>

        {/* Alertness 5-step segmented control */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-text" id="alertness-label">
            Current Alertness
          </label>
          <div
            role="radiogroup"
            aria-labelledby="alertness-label"
            className="grid grid-cols-5 p-1 rounded-md bg-surface border border-border"
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
                  className={`min-h-[44px] min-w-[44px] rounded-xs text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent tabular-nums flex items-center justify-center ${
                    isSelected
                      ? 'bg-accent text-accent-contrast shadow-sm'
                      : 'text-text hover:bg-surface-2'
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-xs text-muted px-1">
            <span>1 — Exhausted</span>
            <span>5 — Fully alert</span>
          </div>
        </div>

        {/* Mind Wandering 5-step segmented control */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-text" id="mind-wandering-label">
            Mind Wandering
          </label>
          <div
            role="radiogroup"
            aria-labelledby="mind-wandering-label"
            className="grid grid-cols-5 p-1 rounded-md bg-surface border border-border"
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
                  className={`min-h-[44px] min-w-[44px] rounded-xs text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent tabular-nums flex items-center justify-center ${
                    isSelected
                      ? 'bg-accent text-accent-contrast shadow-sm'
                      : 'text-text hover:bg-surface-2'
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-xs text-muted px-1">
            <span>1 — Grounded</span>
            <span>5 — Highly distracted</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={!canProceed}
            className="w-full sm:w-auto min-h-[44px]"
          >
            {t('check.btnStartTest')}
          </Button>
          <Button
            type="button"
            variant="subtle"
            onClick={onBack}
            className="w-full sm:w-auto min-h-[44px]"
          >
            {t('common.back')}
          </Button>
        </div>
      </Panel>
    </form>
  );
};
