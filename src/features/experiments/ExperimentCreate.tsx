'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
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
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display font-[780] text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] text-text text-balance">
          Self-Experiments
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-[54ch] leading-relaxed">
          Test whether a specific practice reliably helps your reaction time and lapses compared to baseline quiet rest.
        </p>
      </div>

      {/* Empty State Banner when no experiments exist: exactly one sentence and one primary button */}
      {experiments.length === 0 && (
        <Panel variant="surface-2" className="space-y-4">
          <p className="text-sm text-text font-medium leading-relaxed">
            Start your first self-experiment to compare an active practice against quiet rest across 10 paired runs.
          </p>
          <Button
            variant="primary"
            onClick={handleCreate}
            className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
          >
            Start 10-Run Experiment
          </Button>
        </Panel>
      )}

      {/* Ongoing Experiments List */}
      {experiments.length > 0 && (
        <Card className="p-4 sm:p-5 space-y-3 bg-surface-2 border-border">
          <span className="text-xs font-semibold text-muted block">
            Your ongoing experiments
          </span>
          <div className="divide-y divide-border">
            {experiments.map((exp) => {
              const activeId = exp.conditionIds.find((c) => c !== 'rest') || exp.conditionIds[0];
              const cond = getConditionById(activeId);
              return (
                <div
                  key={exp.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-1 last:pb-1"
                >
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-bold text-text">
                      {cond.name} vs. Quiet Rest
                    </h2>
                    <p className="text-xs text-muted tabular-nums">
                      {exp.runs.length} of 10 runs completed
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => onSelectExperiment(exp.id)}
                    className="text-xs min-h-[44px] w-full sm:w-auto"
                  >
                    Resume
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Design New Experiment */}
      <Card className="p-5 sm:p-6 space-y-4 bg-surface border-border">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-text font-display">Design a new experiment</h2>
          <p className="text-xs text-muted">
            Select an activity to test. You will complete 5 randomized pairs (10 total runs) alternating with quiet rest.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="activity-select" className="block text-xs font-semibold text-text">
            Choose activity condition
          </label>
          <select
            id="activity-select"
            value={selectedConditionId}
            onChange={(e) => setSelectedConditionId(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-sm border border-border bg-surface text-text text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
          >
            {conditions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-3.5 bg-surface-2 rounded-sm border border-border text-xs text-muted space-y-1">
          <p className="font-semibold text-text">Experiment Structure</p>
          <p>• 10 total runs (5 active practice, 5 quiet rest control).</p>
          <p>• Each run takes ~7 minutes: 3m pre-check, 3m activity/rest, 3m post-check.</p>
          <p>• Complete runs on different days or spaced out at the same time of day.</p>
        </div>

        <Button
          variant="primary"
          onClick={handleCreate}
          className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
        >
          Create 10-Run Experiment
        </Button>
      </Card>
    </div>
  );
};

export default ExperimentCreate;
