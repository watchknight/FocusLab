'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import {
  UserGoal,
  UserObstacle,
  getRecommendationsForObstacle,
  RecommendationItem,
} from '@/lib/recommend';
import { useT, I18nKey } from '@/i18n';

const ONBOARDED_KEY = 'focuslab:onboarded';

const GOAL_KEYS: Array<{ id: UserGoal; labelKey: I18nKey; descKey: I18nKey }> = [
  { id: 'work', labelKey: 'onboarding.goalWork', descKey: 'onboarding.goalWorkDesc' },
  { id: 'study', labelKey: 'onboarding.goalStudy', descKey: 'onboarding.goalStudyDesc' },
  { id: 'creative', labelKey: 'onboarding.goalCreative', descKey: 'onboarding.goalCreativeDesc' },
  { id: 'other', labelKey: 'onboarding.goalOther', descKey: 'onboarding.goalOtherDesc' },
];

const OBSTACLE_KEYS: Array<{ id: UserObstacle; labelKey: I18nKey; descKey: I18nKey }> = [
  { id: 'phone', labelKey: 'onboarding.obsPhone', descKey: 'onboarding.obsPhoneDesc' },
  { id: 'racing_thoughts', labelKey: 'onboarding.obsThoughts', descKey: 'onboarding.obsThoughtsDesc' },
  { id: 'tiredness', labelKey: 'onboarding.obsTired', descKey: 'onboarding.obsTiredDesc' },
  { id: 'noise', labelKey: 'onboarding.obsNoise', descKey: 'onboarding.obsNoiseDesc' },
  { id: 'cant_start', labelKey: 'onboarding.obsStart', descKey: 'onboarding.obsStartDesc' },
];

export const OnboardingModal: React.FC = () => {
  const { t } = useT();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal>('work');
  const [selectedObstacle, setSelectedObstacle] = useState<UserObstacle>('phone');
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  const modalRef = useRef<HTMLDivElement>(null);
  const prevActiveEl = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARDED_KEY)) setIsOpen(true);
    } catch { /* Ignored */ }

    const handleOpen = () => { setStep(1); setIsOpen(true); };
    window.addEventListener('focuslab:open-onboarding', handleOpen);
    return () => window.removeEventListener('focuslab:open-onboarding', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      prevActiveEl.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleDismiss(); };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    } else if (prevActiveEl.current) {
      prevActiveEl.current.focus();
    }
  }, [isOpen]);

  const handleDismiss = () => {
    try { localStorage.setItem(ONBOARDED_KEY, 'true'); } catch { /* Ignored */ }
    setIsOpen(false);
  };

  const handleNextToRecommendations = () => {
    setRecommendations(getRecommendationsForObstacle(selectedObstacle));
    setStep(3);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 focus:outline-none"
    >
      <Card className="max-w-lg w-full p-5 sm:p-6 space-y-5 bg-surface border-border shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between text-xs text-muted border-b border-border pb-3">
          <span className="font-semibold text-text">{t('onboarding.step', { step })}</span>
          <button
            type="button"
            onClick={handleDismiss}
            className="hover:text-text underline min-h-[44px] px-2 inline-flex items-center"
          >
            {t('onboarding.skip')}
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 id="onboarding-dialog-title" className="text-xl font-bold tracking-tight text-text">
                {t('onboarding.goalTitle')}
              </h2>
              <p className="text-xs text-muted">{t('onboarding.goalSub')}</p>
            </div>
            <div className="space-y-2">
              {GOAL_KEYS.map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors min-h-[44px] ${
                    selectedGoal === g.id ? 'border-accent bg-accent/5 dark:bg-accent/10 ring-1 ring-accent' : 'border-border bg-surface-2 hover:bg-surface'
                  }`}
                >
                  <span className="text-sm font-semibold text-text block">{t(g.labelKey)}</span>
                  <span className="text-xs text-muted block mt-0.5">{t(g.descKey)}</span>
                </button>
              ))}
            </div>
            <div className="pt-2">
              <Button variant="primary" onClick={() => setStep(2)} className="w-full">
                {t('onboarding.btnToObstacles')}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 id="onboarding-dialog-title" className="text-xl font-bold tracking-tight text-text">
                {t('onboarding.obstacleTitle')}
              </h2>
              <p className="text-xs text-muted">{t('onboarding.obstacleSub')}</p>
            </div>
            <div className="space-y-2">
              {OBSTACLE_KEYS.map((o) => (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => setSelectedObstacle(o.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors min-h-[44px] ${
                    selectedObstacle === o.id ? 'border-accent bg-accent/5 dark:bg-accent/10 ring-1 ring-accent' : 'border-border bg-surface-2 hover:bg-surface'
                  }`}
                >
                  <span className="text-sm font-semibold text-text block">{t(o.labelKey)}</span>
                  <span className="text-xs text-muted block mt-0.5">{t(o.descKey)}</span>
                </button>
              ))}
            </div>
            <div className="pt-2 flex gap-2">
              <Button variant="subtle" onClick={() => setStep(1)} className="w-auto">{t('common.back')}</Button>
              <Button variant="primary" onClick={handleNextToRecommendations} className="flex-1">
                {t('onboarding.btnToRecs')}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 id="onboarding-dialog-title" className="text-xl font-bold tracking-tight text-text">
                {t('onboarding.recsTitle')}
              </h2>
              <p className="text-xs text-muted">{t('onboarding.recsSub')}</p>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="p-3.5 space-y-2 bg-surface-2 border-border">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-text">{rec.title}</h3>
                    <EvidenceBadge tier={rec.tier} />
                  </div>
                  <p className="text-xs text-muted">{rec.description}</p>
                  <div className="pt-1.5 border-t border-border/60 text-[11px] text-muted space-y-1">
                    <p><strong className="text-text">{t('onboarding.whyThis')}</strong> {rec.whyThis}</p>
                    <p className="italic">{t('onboarding.measuredOutcome')} <span className="text-text not-italic">{rec.outcome}</span></p>
                  </div>
                  <div className="pt-1">
                    <Link
                      href={rec.actionHref}
                      onClick={handleDismiss}
                      className="text-xs font-semibold text-accent hover:underline inline-flex items-center min-h-[44px]"
                    >
                      {rec.actionLabel} →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
            <div className="pt-2">
              <Button variant="primary" onClick={handleDismiss} className="w-full">
                {t('onboarding.enter')}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
