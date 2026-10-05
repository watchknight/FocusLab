'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getTestableActivityConditions, getConditionById } from '@/lib/conditions';
import { createExperimentSchedule } from '@/lib/experiments';
import { useFocusLabStore } from '@/store';
import { Experiment } from '@/store/types';

interface ExperimentCreateProps {
  initialActivityId?: string;
  onSelectExperiment: (experimentId: string) => void;
}

export const ExperimentCreate: React.FC<ExperimentCreateProps> = ({
  initialActivityId,
  onSelectExperiment,
}) => {
  const conditions = getTestableActivityConditions();
  const defaultConditionId = initialActivityId
    ? `activity:${initialActivityId}`
    : conditions[0]?.id || 'activity:cyclic-sighing';

  const [selectedConditionId, setSelectedConditionId] = useState<string>(defaultConditionId);

  const experiments = useFocusLabStore((state) => state.experiments);
  const addExperiment = useFocusLabStore((state) => state.addExperiment);

  const handleCreate = () => {
    const schedule = createExperimentSchedule(selectedConditionId);
    const newExperiment: Experiment = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
      design: 'prepost',
      conditionIds: [selectedConditionId, 'rest'],
      schedule,
      runs: [],
    };

    addExperiment(newExperiment);
    onSelectExperiment(newExperiment.id);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-text">Self-Experiments</h1>
        <p className="text-sm text-muted">
          Test whether a specific practice reliably helps your reaction time and lapses compared to baseline quiet rest.
        </p>
      </div>

      {/* Ongoing Experiments */}
      {experiments.length > 0 && (
        <Card className="p-4 sm:p-5 space-y-3 bg-surface-2 border-border">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
            Your Ongoing Experiments
          </span>
          <div className="divide-y divide-border">
            {experiments.map((exp) => {
              const activeId = exp.conditionIds.find((c) => c !== 'rest') || exp.conditionIds[0];
              const cond = getConditionById(activeId);
              return (
                <div
                  key={exp.id}
                  className="py-3 flex items-center justify-between gap-3 first:pt-1 last:pb-1"
                >
                  <div>
                    <h3 className="text-sm font-bold text-text">
                      {cond.name} vs. Quiet Rest
                    </h3>
                    <p className="text-xs text-muted">
                      {exp.runs.length} of 10 runs completed
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => onSelectExperiment(exp.id)}
                    className="text-xs min-h-[36px]"
                  >
                    Resume
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Create New Experiment */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-text">Design a New Experiment</h2>
          <p className="text-xs text-muted">
            Select an activity to test. You will complete 5 randomized pairs (10 total runs) alternating with quiet rest.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="activity-select" className="block text-xs font-semibold text-text uppercase tracking-wider">
            Choose Activity Condition
          </label>
          <select
            id="activity-select"
            value={selectedConditionId}
            onChange={(e) => setSelectedConditionId(e.target.value)}
            className="w-full min-h-[44px] px-3 py-2 rounded-md border border-border bg-surface text-text text-sm focus-visible:outline-2 focus-visible:outline-accent"
          >
            {conditions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 bg-surface-2 rounded border border-border text-xs text-muted space-y-1">
          <p className="font-semibold text-text">Experiment Structure</p>
          <p>• 10 total runs (5 active practice, 5 quiet rest control).</p>
          <p>• Each run takes ~7 minutes: 3m pre-check → 3m activity/rest → 3m post-check.</p>
          <p>• Complete runs on different days or spaced out at the same time of day.</p>
        </div>

        <Button variant="primary" onClick={handleCreate} className="w-full sm:w-auto">
          Create 10-Run Experiment
        </Button>
      </Card>
    </div>
  );
};
