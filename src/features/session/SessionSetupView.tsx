'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { EnvironmentChecklist } from '@/features/environment';
import { getClaimById } from '@/content/evidence';
import { IfThenPlanEditor } from './IfThenPlanEditor';
import { RhythmConfig } from './RhythmStep';
import { FocusDial } from './FocusDial';

interface SessionSetupViewProps {
  initialIntention?: string;
  initialIfThen?: { when: string; then: string };
  initialRhythm?: RhythmConfig;
  onStartSession: (
    intention: string,
    ifThen: { when: string; then: string } | undefined,
    rhythm: RhythmConfig
  ) => void;
}

export const SessionSetupView: React.FC<SessionSetupViewProps> = ({
  initialIntention = '',
  initialIfThen,
  initialRhythm,
  onStartSession,
}) => {
  const [intention, setIntention] = useState(initialIntention);
  const [showIfThen, setShowIfThen] = useState(Boolean(initialIfThen));
  const [whenTrigger, setWhenTrigger] = useState(initialIfThen?.when || '');
  const [thenAction, setThenAction] = useState(initialIfThen?.then || '');

  // Focus duration in minutes: 15 to 90 in 5-minute steps
  const [focusMin, setFocusMin] = useState<number>(() => {
    if (initialRhythm && initialRhythm.focusSec > 0) {
      const mins = Math.round(initialRhythm.focusSec / 60);
      const snapped = Math.round(mins / 5) * 5;
      return Math.max(15, Math.min(90, snapped));
    }
    return 25;
  });

  const breaksClaim = getClaimById('breaks-performance');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intention.trim()) return;

    const plan =
      showIfThen && whenTrigger.trim() && thenAction.trim()
        ? { when: whenTrigger.trim(), then: thenAction.trim() }
        : undefined;

    const breakMin = focusMin >= 60 ? 15 : focusMin >= 45 ? 10 : 5;
    const computedRhythm: RhythmConfig = {
      presetId: 'custom',
      focusSec: focusMin * 60,
      breakSec: breakMin * 60,
      isFlexible: false,
    };

    onStartSession(intention.trim(), plan, computedRhythm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="font-display font-[780] text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] text-text text-balance">
          Focus Session Setup
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-[54ch] leading-relaxed">
          Dial your duration, define your intention, and set up your space.
        </p>
      </div>

      {/* Two columns on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Session Configuration (Time Dial + Intention + If-Then) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-text">Focus Dial (15–90 min)</span>
              {breaksClaim && <EvidenceMeter tier={breaksClaim.tier} />}
            </div>

            <FocusDial
              value={focusMin}
              onChange={setFocusMin}
            />
          </Card>

          <Card className="p-5 space-y-3">
            <label htmlFor="task-input" className="block text-sm font-semibold text-text">
              What is the single task you will work on?
            </label>
            <input
              id="task-input"
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="e.g. Write section 2 of the project proposal"
              maxLength={120}
              className="w-full min-h-[44px] px-3 py-2 rounded-xs border border-border-strong bg-surface text-text text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <p className="text-[11px] text-muted">
              Choose one distinct outcome. Single-tasking lowers task-switching costs.
            </p>
          </Card>

          <IfThenPlanEditor
            showIfThen={showIfThen}
            onToggleShow={setShowIfThen}
            whenTrigger={whenTrigger}
            onWhenChange={setWhenTrigger}
            thenAction={thenAction}
            onThenChange={setThenAction}
          />
        </div>

        {/* Right Column: Environment Checklist + CTA grouped together */}
        <div className="lg:col-span-6 space-y-4">
          <EnvironmentChecklist embedded />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={!intention.trim()}
              className="w-full min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
            >
              Start Focus Session ({focusMin}m)
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SessionSetupView;
