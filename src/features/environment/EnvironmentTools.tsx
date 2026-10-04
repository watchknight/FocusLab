'use client';

import React, { useState } from 'react';
import { getEvidenceById } from '@/content/evidence';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const EnvironmentTools: React.FC = () => {
  const [declutterDone, setDeclutterDone] = useState<Record<string, boolean>>({
    monitors: false,
    phone: false,
    tabs: false,
  });

  const [cue, setCue] = useState('');
  const [action, setAction] = useState('');
  const [savedPlan, setSavedPlan] = useState<string | null>(null);

  const declutterEvidence = getEvidenceById('ev_workspace_declutter');
  const ifThenEvidence = getEvidenceById('ev_implementation_intentions');

  const toggleDeclutter = (key: string) => {
    setDeclutterDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cue.trim() || !action.trim()) return;
    setSavedPlan(`If ${cue.trim()}, then I will ${action.trim()}.`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-content-primary">
          Environment & Intention Tools
        </h1>
        <p className="text-xs text-content-secondary">
          Targeted modifications to your sensory environment and behavioral plans
          backed by cognitive research.
        </p>
      </div>

      <Card as="section" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-content-primary">
            Visual Field Declutter Protocol
          </h2>
          {declutterEvidence && (
            <EvidenceBadge level={declutterEvidence.level} />
          )}
        </div>
        <p className="text-xs text-content-secondary">
          Reduces neural stimulus competition in visual cortex (McMains &
          Kastner, 2011).
        </p>

        <div className="space-y-2 pt-1">
          {[
            {
              id: 'monitors',
              label: 'Clear immediate desk surface within arm’s reach of screen',
            },
            {
              id: 'phone',
              label: 'Place phone out of direct line-of-sight (e.g. drawer or behind monitor)',
            },
            {
              id: 'tabs',
              label: 'Close or hide unrelated browser tabs and window notifications',
            },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 p-2.5 rounded border border-surface-border bg-surface-primary cursor-pointer hover:bg-surface-secondary/50 text-xs text-content-primary"
            >
              <input
                type="checkbox"
                checked={declutterDone[item.id] || false}
                onChange={() => toggleDeclutter(item.id)}
                className="w-4 h-4 rounded text-teal-accent accent-teal-accent cursor-pointer"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card as="section" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-content-primary">
            If-Then Contingency Builder
          </h2>
          {ifThenEvidence && <EvidenceBadge level={ifThenEvidence.level} />}
        </div>
        <p className="text-xs text-content-secondary">
          Pre-commit to an immediate behavioral rule upon encountering a
          trigger (Gollwitzer & Sheeran, 2006).
        </p>

        <form onSubmit={handleSavePlan} className="space-y-3 pt-1">
          <div>
            <label
              htmlFor="cue-input"
              className="block text-xs font-semibold text-content-primary mb-1"
            >
              Situational Cue (Trigger)
            </label>
            <input
              id="cue-input"
              type="text"
              placeholder="e.g., I reach for my phone to check notifications"
              value={cue}
              onChange={(e) => setCue(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 text-xs bg-surface-primary border border-surface-border rounded-md text-content-primary focus-visible:ring-2 focus-visible:ring-teal-accent"
            />
          </div>

          <div>
            <label
              htmlFor="action-input"
              className="block text-xs font-semibold text-content-primary mb-1"
            >
              Intended Response
            </label>
            <input
              id="action-input"
              type="text"
              placeholder="e.g., take 1 physiological sigh and write the idea on a scratchpad"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 text-xs bg-surface-primary border border-surface-border rounded-md text-content-primary focus-visible:ring-2 focus-visible:ring-teal-accent"
            />
          </div>

          <Button type="submit" variant="primary" fullWidth>
            Formulate Intention
          </Button>
        </form>

        {savedPlan && (
          <div className="p-3 bg-surface-primary border border-teal-accent rounded text-xs space-y-1">
            <p className="font-semibold text-teal-accent">Active Rule:</p>
            <p className="text-content-primary italic">&ldquo;{savedPlan}&rdquo;</p>
          </div>
        )}
      </Card>
    </div>
  );
};
