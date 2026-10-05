'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Experiment } from '@/store/types';
import { useFocusLabStore } from '@/store';
import { analyzeExperiment } from '@/lib/experiments';
import { getConditionById } from '@/lib/conditions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { ExperimentRunner } from './ExperimentRunner';

const ExperimentDotPlot = dynamic(() => import('./ExperimentDotPlot'), {
  ssr: false,
  loading: () => <div className="h-48 flex items-center justify-center text-xs text-muted">Loading chart...</div>,
});

interface ExperimentDetailProps {
  experiment: Experiment;
  onBack?: () => void;
}

export const ExperimentDetail: React.FC<ExperimentDetailProps> = ({
  experiment,
  onBack,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const allChecks = useFocusLabStore((state) => state.checks);

  const completedCount = experiment.runs.length;
  const isFinished = completedCount >= experiment.schedule.length;
  const nextItem = !isFinished ? experiment.schedule[completedCount] : null;
  const nextCondition = nextItem ? getConditionById(nextItem.conditionId) : null;

  const analysis = analyzeExperiment(experiment, allChecks);
  const activeCondition = getConditionById(analysis.activeConditionId);
  const controlCondition = getConditionById(analysis.controlConditionId);

  if (isRunning && nextItem) {
    return (
      <ExperimentRunner
        experimentId={experiment.id}
        runIndex={completedCount}
        conditionId={nextItem.conditionId}
        onRunComplete={() => setIsRunning(false)}
        onAbort={() => setIsRunning(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Progress */}
      <div className="space-y-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-muted hover:text-text min-h-[32px] inline-flex items-center"
          >
            ← Back to all experiments
          </button>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-text">
            {activeCondition.name} vs. {controlCondition.name}
          </h1>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface-2 border border-border">
            {completedCount} of 10 runs completed
          </span>
        </div>
        <p className="text-xs text-muted">
          5 paired comparisons between active practice and unstructured quiet rest.
        </p>
      </div>

      {/* Next Action Banner */}
      {!isFinished && nextCondition && (
        <Card className="p-4 bg-surface-2 border-accent/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider block">
                Next Scheduled Run
              </span>
              <p className="text-base font-bold text-text mt-0.5">
                Run {completedCount + 1} of 10: {nextCondition.name}
              </p>
              <p className="text-xs text-muted mt-1">
                Recommendation: Complete runs around the same time of day for consistent timing.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsRunning(true)}
              className="w-full sm:w-auto"
            >
              Start Run {completedCount + 1}
            </Button>
          </div>
        </Card>
      )}

      {/* Verdict & Caveat */}
      <Card className="p-4 sm:p-5 space-y-3 bg-surface-2 border-border">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
          Current Analysis Verdict
        </span>
        <h2 className="text-lg font-bold text-text">
          {analysis.verdict}
        </h2>
        {analysis.totalPairs > 0 && (
          <p className="text-xs text-muted">
            {activeCondition.name} won {analysis.wins} of {analysis.totalPairs} completed pairs (
            {Math.round(analysis.winRatio * 100)}%).
          </p>
        )}
        <div className="p-3 bg-surface rounded border border-border text-xs text-muted italic">
          {analysis.caveat}
        </div>
      </Card>

      {/* Condition Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Condition Stats */}
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-text border-b border-border pb-2">
            {activeCondition.name} (n = {analysis.activeStats.n})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Stat
              label="Mean Δ RT"
              value={`${analysis.activeStats.meanDeltaRt > 0 ? '+' : ''}${analysis.activeStats.meanDeltaRt} ms`}
              subtext="Negative = faster"
            />
            <Stat
              label="Range Δ RT"
              value={`${analysis.activeStats.minDeltaRt} to ${analysis.activeStats.maxDeltaRt} ms`}
            />
            <Stat
              label="Mean Δ Lapses"
              value={`${analysis.activeStats.meanDeltaLapses}`}
            />
            <Stat
              label="Range Lapses"
              value={`${analysis.activeStats.minDeltaLapses} to ${analysis.activeStats.maxDeltaLapses}`}
            />
          </div>
        </Card>

        {/* Control Rest Stats */}
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-text border-b border-border pb-2">
            {controlCondition.name} (n = {analysis.controlStats.n})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Stat
              label="Mean Δ RT"
              value={`${analysis.controlStats.meanDeltaRt > 0 ? '+' : ''}${analysis.controlStats.meanDeltaRt} ms`}
              subtext="Negative = faster"
            />
            <Stat
              label="Range Δ RT"
              value={`${analysis.controlStats.minDeltaRt} to ${analysis.controlStats.maxDeltaRt} ms`}
            />
            <Stat
              label="Mean Δ Lapses"
              value={`${analysis.controlStats.meanDeltaLapses}`}
            />
            <Stat
              label="Range Lapses"
              value={`${analysis.controlStats.minDeltaLapses} to ${analysis.controlStats.maxDeltaLapses}`}
            />
          </div>
        </Card>
      </div>

      {/* Dot Plot & Accessible Table */}
      <Card className="p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-semibold text-text uppercase tracking-wider">
          Per-Run Reaction Time Deltas
        </h3>
        <ExperimentDotPlot analysis={analysis} />
      </Card>
    </div>
  );
};
