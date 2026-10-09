'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Experiment } from '@/store/types';
import { useFocusLabStore } from '@/store';
import { analyzeExperiment } from '@/lib/experiments';
import { getConditionById } from '@/lib/conditions';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Plate } from '@/components/ui/Plate';
import { FeatureErrorBoundary } from '@/components/ui/FeatureErrorBoundary';
import { ExperimentRunner } from './ExperimentRunner';
import { ExperimentFilmStrip } from './ExperimentFilmStrip';

const ExperimentDotPlot = dynamic(() => import('./ExperimentDotPlot'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[220px] flex items-center justify-center text-xs text-muted" aria-hidden="true">
      Loading chart...
    </div>
  ),
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
  const isConcurrent = analysis.design === 'concurrent';

  if (isRunning && nextItem) {
    return (
      <FeatureErrorBoundary
        featureName="Experiment Runner"
        onReset={() => setIsRunning(false)}
      >
        <ExperimentRunner
          experimentId={experiment.id}
          design={experiment.design}
          runIndex={completedCount}
          conditionId={nextItem.conditionId}
          onRunComplete={() => setIsRunning(false)}
          onAbort={() => setIsRunning(false)}
        />
      </FeatureErrorBoundary>
    );
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-muted hover:text-text transition-colors min-h-[44px] inline-flex items-center"
        >
          Back to all experiments
        </button>
      )}

      {/* 1. Progress rail */}
      <div className="space-y-2.5 p-4 sm:p-5 rounded-[16px] border border-border bg-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <span className="font-bold text-text font-display tabular-nums">
            {isFinished ? 'Completed 10 of 10 runs' : `Run ${completedCount + 1} of 10`}
          </span>
          <span className="text-muted font-medium">
            {isFinished
              ? 'Protocol complete'
              : `Next condition: ${nextCondition ? nextCondition.name : 'Completed'}`}
          </span>
        </div>

        <div
          className="grid grid-cols-10 gap-1.5 w-full"
          role="progressbar"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-label="Experiment 10-run progress rail"
        >
          {experiment.schedule.map((_, idx) => {
            const isDone = idx < completedCount;
            const isCurrent = idx === completedCount;
            return (
              <div
                key={idx}
                className={`h-2.5 rounded-full transition-colors ${
                  isDone
                    ? 'bg-primary-bg'
                    : isCurrent
                    ? 'bg-surface-2 border-2 border-border-strong ring-1 ring-ring'
                    : 'bg-surface-2 border border-border'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Film-strip of run frames (activity or rest, change in ms) */}
      <ExperimentFilmStrip
        schedule={experiment.schedule}
        runs={experiment.runs}
        completedCount={completedCount}
        allChecks={allChecks}
        isConcurrent={isConcurrent}
      />

      {/* 3. Current run panel */}
      <Panel variant="surface-2" className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-muted block">
            {isFinished ? 'Protocol Completed' : 'Current Run'}
          </span>
          <h2 className="text-xl font-bold text-text font-display">
            {isFinished
              ? `${activeCondition.name} vs. ${controlCondition.name}`
              : `Run ${completedCount + 1} of 10: ${nextCondition?.name}`}
          </h2>
          <p className="text-xs text-muted leading-relaxed">
            {isFinished
              ? 'You have completed all 10 scheduled runs for this comparison. See the verdict and deltas below.'
              : 'Each run pairs a 3-minute pre-test, 3 minutes of practice or rest, and a 3-minute post-test.'}
          </p>
        </div>

        <div>
          {!isFinished && nextCondition ? (
            <Button
              variant="primary"
              onClick={() => setIsRunning(true)}
              className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
            >
              Start Run {completedCount + 1}
            </Button>
          ) : (
            onBack && (
              <Button
                variant="primary"
                onClick={onBack}
                className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
              >
                Back to all experiments
              </Button>
            )
          )}
        </div>
      </Panel>

      {/* 4. Results as a Plate with verdict in display type and caution line directly beneath */}
      <Plate as="section" className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted block">
            Experiment verdict
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-text leading-tight">
            {analysis.verdict}
          </h2>
          <p className="text-xs sm:text-sm text-muted italic border-l-2 border-border pl-3 py-1 leading-relaxed">
            {analysis.caveat}
          </p>
        </div>

        {/* Per-condition mean change in plain words */}
        <div className="p-4 rounded-sm bg-surface-2 border border-border space-y-2 text-xs">
          <span className="font-semibold text-text block text-xs">
            Per-condition mean change
          </span>
          <p className="text-text leading-relaxed">
            {analysis.activeStats.n > 0
              ? analysis.design === 'concurrent'
                ? `During ${activeCondition.name}, reaction time averaged ${analysis.activeStats.meanDeltaRt} ms across ${analysis.activeStats.n} runs.`
                : analysis.activeStats.meanDeltaRt < 0
                ? `During ${activeCondition.name}, reaction time was ${Math.abs(analysis.activeStats.meanDeltaRt)} ms faster on average after practice (n = ${analysis.activeStats.n}).`
                : analysis.activeStats.meanDeltaRt > 0
                ? `During ${activeCondition.name}, reaction time was ${analysis.activeStats.meanDeltaRt} ms slower on average after practice (n = ${analysis.activeStats.n}).`
                : `During ${activeCondition.name}, average reaction time showed no change after practice (n = ${analysis.activeStats.n}).`
              : `${activeCondition.name}: no completed runs yet.`}
          </p>
          <p className="text-text leading-relaxed">
            {analysis.controlStats.n > 0
              ? analysis.design === 'concurrent'
                ? `During ${controlCondition.name}, reaction time averaged ${analysis.controlStats.meanDeltaRt} ms across ${analysis.controlStats.n} runs.`
                : analysis.controlStats.meanDeltaRt < 0
                ? `During ${controlCondition.name}, reaction time was ${Math.abs(analysis.controlStats.meanDeltaRt)} ms faster on average after rest (n = ${analysis.controlStats.n}).`
                : analysis.controlStats.meanDeltaRt > 0
                ? `During ${controlCondition.name}, reaction time was ${analysis.controlStats.meanDeltaRt} ms slower on average after rest (n = ${analysis.controlStats.n}).`
                : `During ${controlCondition.name}, average reaction time showed no change after rest (n = ${analysis.controlStats.n}).`
              : `${controlCondition.name}: no completed runs yet.`}
          </p>
          {analysis.totalPairs > 0 && (
            <p className="text-muted pt-1 border-t border-border">
              {activeCondition.name} had faster reaction times in {analysis.wins} of {analysis.totalPairs} completed pairs ({Math.round(analysis.winRatio * 100)}%).
            </p>
          )}
        </div>

        {/* Dot plot with DrawSVG */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text">
            Per-Run Reaction Time Deltas
          </h3>
          <ExperimentDotPlot analysis={analysis} />
        </div>
      </Plate>
    </div>
  );
};

export default ExperimentDetail;
