'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { getClaimById } from '@/content/evidence';

interface IfThenPlanEditorProps {
  showIfThen: boolean;
  onToggleShow: (show: boolean) => void;
  whenTrigger: string;
  onWhenChange: (val: string) => void;
  thenAction: string;
  onThenChange: (val: string) => void;
}

const STARTER_TEMPLATES = [
  {
    when: 'I reach for my phone',
    then: 'take one slow breath and return to the task',
    label: 'Phone urge → slow breath',
  },
  {
    when: 'I feel the urge to open a new tab',
    then: 'write the thought in my parked list',
    label: 'New tab impulse → park thought',
  },
  {
    when: 'my attention drifts',
    then: 'note it without judgment and reread my task goal',
    label: 'Mind wandering → reread goal',
  },
];

export const IfThenPlanEditor: React.FC<IfThenPlanEditorProps> = ({
  showIfThen,
  onToggleShow,
  whenTrigger,
  onWhenChange,
  thenAction,
  onThenChange,
}) => {
  const ifThenClaim = getClaimById('if-then');

  const applyTemplate = (tmpl: (typeof STARTER_TEMPLATES)[0]) => {
    onToggleShow(true);
    onWhenChange(tmpl.when);
    onThenChange(tmpl.then);
  };

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text">If-then plan (optional)</span>
          {ifThenClaim && <EvidenceMeter tier={ifThenClaim.tier} />}
        </div>
        <button
          type="button"
          onClick={() => onToggleShow(!showIfThen)}
          className="text-xs font-semibold text-link hover:underline min-h-[44px] inline-flex items-center"
        >
          {showIfThen ? 'Hide plan' : '+ Add if-then plan'}
        </button>
      </div>

      {ifThenClaim && (
        <p className="text-xs text-muted leading-relaxed">
          {ifThenClaim.summary}
        </p>
      )}

      {showIfThen && (
        <div className="space-y-3 pt-1 border-t border-border">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted">Quick templates:</span>
            <div className="flex flex-wrap gap-1.5">
              {STARTER_TEMPLATES.map((tmpl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => applyTemplate(tmpl)}
                  className="text-xs px-2.5 py-1.5 rounded-xs border border-border bg-surface-2 text-text hover:bg-surface text-left min-h-[44px] flex items-center"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label htmlFor="when-trigger" className="block text-xs font-medium text-muted mb-1">
                When (trigger):
              </label>
              <input
                id="when-trigger"
                type="text"
                value={whenTrigger}
                onChange={(e) => onWhenChange(e.target.value)}
                placeholder="e.g. I feel the urge to open Twitter"
                className="w-full min-h-[44px] px-3 py-1.5 rounded-xs border border-border bg-surface text-text text-xs focus-visible:outline-2 focus-visible:outline-ring"
              />
            </div>

            <div>
              <label htmlFor="then-action" className="block text-xs font-medium text-muted mb-1">
                Then I will (action):
              </label>
              <input
                id="then-action"
                type="text"
                value={thenAction}
                onChange={(e) => onThenChange(e.target.value)}
                placeholder="e.g. write the thought in my parked list"
                className="w-full min-h-[44px] px-3 py-1.5 rounded-xs border border-border bg-surface text-text text-xs focus-visible:outline-2 focus-visible:outline-ring"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
