'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { getClaimById } from '@/content/evidence';

interface IntentionStepProps {
  onContinue: (intention: string, ifThen?: { when: string; then: string }) => void;
}

const STARTER_TEMPLATES = [
  {
    when: 'I reach for my phone',
    then: 'take one slow breath and return to the task',
    label: 'Phone urge: slow breath',
  },
  {
    when: 'I feel the urge to open a new tab',
    then: 'write the thought in my parked list',
    label: 'New tab impulse: park thought',
  },
  {
    when: 'my attention drifts',
    then: 'note it without judgment and reread my task goal',
    label: 'Mind wandering: reread goal',
  },
];

export const IntentionStep: React.FC<IntentionStepProps> = ({ onContinue }) => {
  const [task, setTask] = useState('');
  const [showIfThen, setShowIfThen] = useState(false);
  const [whenTrigger, setWhenTrigger] = useState('');
  const [thenAction, setThenAction] = useState('');

  const claim = getClaimById('if-then');

  const applyTemplate = (t: (typeof STARTER_TEMPLATES)[0]) => {
    setShowIfThen(true);
    setWhenTrigger(t.when);
    setThenAction(t.then);
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    const ifThen =
      showIfThen && whenTrigger.trim() && thenAction.trim()
        ? { when: whenTrigger.trim(), then: thenAction.trim() }
        : undefined;

    onContinue(task.trim(), ifThen);
  };

  return (
    <form onSubmit={handleProceed} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-text">Set your focus intention</h1>
        <p className="text-sm text-muted">
          Define a single clear goal before starting your work block.
        </p>
      </div>

      <Card className="space-y-3">
        <label htmlFor="task-input" className="block text-sm font-semibold text-text">
          What is the single task you will work on?
        </label>
        <input
          id="task-input"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. Write section 2 of the project proposal"
          maxLength={120}
          className="w-full min-h-[44px] px-3 py-2 rounded-xs border border-border-strong bg-surface text-text text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          autoFocus
        />
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text">If-then plan (optional)</span>
            {claim && <EvidenceMeter tier={claim.tier} />}
          </div>
          <button
            type="button"
            onClick={() => setShowIfThen(!showIfThen)}
            className="text-xs font-semibold text-link hover:underline self-start sm:self-auto min-h-[44px] inline-flex items-center"
          >
            {showIfThen ? 'Hide if-then plan' : '+ Add an if-then plan'}
          </button>
        </div>

        {claim && (
          <p className="text-xs text-muted">
            {claim.summary}
          </p>
        )}

        {showIfThen && (
          <div className="space-y-3 pt-1 border-t border-border">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted block">
                Starter templates
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_TEMPLATES.map((tmpl) => (
                  <button
                    type="button"
                    key={tmpl.label}
                    onClick={() => applyTemplate(tmpl)}
                    className="min-h-[44px] px-2.5 py-1 text-xs rounded-xs border border-border-strong bg-surface text-text hover:bg-surface-2 transition-colors text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label htmlFor="when-input" className="block text-xs font-medium text-muted mb-1">
                  When (obstacle / trigger)...
                </label>
                <input
                  id="when-input"
                  type="text"
                  value={whenTrigger}
                  onChange={(e) => setWhenTrigger(e.target.value)}
                  placeholder="e.g. I reach for my phone"
                  className="w-full min-h-[44px] px-3 py-2 rounded-xs border border-border-strong bg-surface text-text text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                />
              </div>
              <div>
                <label htmlFor="then-input" className="block text-xs font-medium text-muted mb-1">
                  I will (pre-set response)...
                </label>
                <input
                  id="then-input"
                  type="text"
                  value={thenAction}
                  onChange={(e) => setThenAction(e.target.value)}
                  placeholder="e.g. take one breath and return"
                  className="w-full min-h-[44px] px-3 py-2 rounded-xs border border-border-strong bg-surface text-text text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      <Button
        type="submit"
        variant="primary"
        disabled={!task.trim()}
        className="w-full sm:w-auto"
      >
        Continue to Checklist
      </Button>
    </form>
  );
};
