'use client';

import React, { useState } from 'react';
import { FocusCheckRunner } from '@/features/check';
import { ActivityPlayer } from '@/features/activities/players/ActivityPlayer';
import { getActivityById } from '@/content/activities';
import { getConditionById } from '@/lib/conditions';
import { startNoise, stopNoise } from '@/lib/noise';
import { CheckResult, ExperimentRun } from '@/store/types';
import { useFocusLabStore } from '@/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ExperimentRunnerProps {
  experimentId: string;
  design?: 'prepost' | 'concurrent';
  runIndex: number; // 0-based
  conditionId: string;
  onRunComplete: () => void;
  onAbort: () => void;
}

type RunPhase = 'intro' | 'pre_check' | 'condition' | 'post_check' | 'concurrent_check' | 'done';

export const ExperimentRunner: React.FC<ExperimentRunnerProps> = ({
  experimentId,
  design = 'prepost',
  runIndex,
  conditionId,
  onRunComplete,
  onAbort,
}) => {
  const isConcurrent = design === 'concurrent';
  const [phase, setPhase] = useState<RunPhase>('intro');
  const [runId] = useState<string>(
    () => `run_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
  );
  const [preCheckId, setPreCheckId] = useState<string | null>(null);

  const addExperimentRun = useFocusLabStore((state) => state.addExperimentRun);
  const condition = getConditionById(conditionId);
  const activity = condition.activityId ? getActivityById(condition.activityId) : undefined;

  // Prepost flow handlers
  const handlePreCheckComplete = (res: CheckResult) => {
    setPreCheckId(res.id);
    setPhase('condition');
  };

  const handleConditionComplete = () => {
    setPhase('post_check');
  };

  const handlePostCheckComplete = (postRes: CheckResult) => {
    if (preCheckId) {
      const run: ExperimentRun = {
        id: runId,
        ts: Date.now(),
        conditionId,
        checkIds: [preCheckId, postRes.id],
      };
      addExperimentRun(experimentId, run);
    }
    setPhase('done');
  };

  // Concurrent flow handlers
  const handleConcurrentStart = () => {
    if (condition.soundType && condition.soundType !== 'silence') {
      startNoise({ color: condition.soundType, volume: 0.2, softness: 0.5 });
    }
  };

  const handleConcurrentEnd = () => {
    stopNoise();
  };

  const handleConcurrentComplete = (res: CheckResult) => {
    stopNoise();
    const run: ExperimentRun = {
      id: runId,
      ts: Date.now(),
      conditionId,
      checkIds: [res.id],
    };
    addExperimentRun(experimentId, run);
    setPhase('done');
  };

  const handleAbort = () => {
    stopNoise();
    onAbort();
  };

  if (phase === 'concurrent_check') {
    return (
      <FocusCheckRunner
        context="experiment"
        runId={runId}
        phase="concurrent"
        onStart={handleConcurrentStart}
        onEnd={handleConcurrentEnd}
        onComplete={handleConcurrentComplete}
      />
    );
  }

  if (phase === 'pre_check') {
    return (
      <FocusCheckRunner
        context="experiment"
        runId={runId}
        phase="before"
        onComplete={handlePreCheckComplete}
        onEnd={handleAbort}
      />
    );
  }

  if (phase === 'condition' && activity) {
    return (
      <ActivityPlayer
        activity={activity}
        durationSec={condition.defaultDurationSec}
        onClose={handleConditionComplete}
      />
    );
  }

  if (phase === 'post_check') {
    return (
      <FocusCheckRunner
        context="experiment"
        runId={runId}
        phase="after"
        onComplete={handlePostCheckComplete}
        onEnd={handleAbort}
      />
    );
  }

  if (phase === 'done') {
    return (
      <Card className="max-w-md mx-auto p-6 text-center space-y-4 bg-surface-2 border-border">
        <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <h2 className="text-xl font-bold text-text">Run #{runIndex + 1} Saved</h2>
        <p className="text-xs text-muted">
          {condition.name} condition performance successfully recorded.
        </p>
        <div className="pt-2">
          <Button variant="primary" onClick={onRunComplete} className="w-full sm:w-auto">
            View Experiment Progress
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto p-6 space-y-4 bg-surface-2 border-border">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">
          Experiment Run #{runIndex + 1} of 10
        </span>
        <h2 className="text-xl font-bold text-text">Condition: {condition.name}</h2>
        <p className="text-xs text-muted">
          {isConcurrent
            ? `Perform a 3-minute Focus Check while listening to ${condition.name}.`
            : `This run consists of three steps: Focus Check (before) → ${condition.name} (3 min) → Focus Check (after).`}
        </p>
      </div>

      <div className="p-3 bg-surface rounded text-xs text-muted space-y-1 border border-border">
        <p className="font-semibold text-text">Recommendation</p>
        <p>Try to run all checks around the same time of day to keep baseline alertness consistent.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button
          variant="primary"
          onClick={() => setPhase(isConcurrent ? 'concurrent_check' : 'pre_check')}
          className="w-full sm:w-auto"
        >
          {isConcurrent ? 'Begin Check with Audio' : 'Start Pre-Check'}
        </Button>
        <Button variant="subtle" onClick={handleAbort} className="w-full sm:w-auto">
          Cancel
        </Button>
      </div>
    </Card>
  );
};
