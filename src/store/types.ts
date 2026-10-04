export type Rating1To5 = 1 | 2 | 3 | 4 | 5;

export interface CheckTrial {
  isiMs: number;
  rtMs: number | null;
  falseStart: boolean;
}

export interface CheckMetrics {
  medianRt: number;
  lapses: number;
  falseStarts: number;
  meanReciprocal: number;
}

export interface CheckResult {
  id: string;
  ts: number;
  context: 'baseline' | 'experiment';
  runId?: string;
  phase?: 'before' | 'after' | 'concurrent';
  preRatings: {
    alertness: Rating1To5;
    mindWandering: Rating1To5;
  };
  trials: CheckTrial[];
  metrics: CheckMetrics;
}

export interface Session {
  id: string;
  startedAt: number;
  intention: string;
  ifThen?: {
    when: string;
    then: string;
  };
  presetId: string;
  plannedFocusSec: number;
  actualFocusSec: number;
  blocks: number;
  quality?: Rating1To5;
  distractions: number;
  parked: string[];
  note?: string;
}

export interface ActivityLog {
  id: string;
  ts: number;
  activityId: string;
  durationSec: number;
  completed: boolean;
}

export interface ExperimentRun {
  id: string;
  ts: number;
  conditionId: string;
  checkIds: string[];
}

export interface Experiment {
  id: string;
  createdAt: number;
  design: 'prepost' | 'concurrent';
  conditionIds: string[];
  schedule: Array<{ conditionId: string }>;
  runs: ExperimentRun[];
}

export interface FocusLabSnapshot {
  version: 1;
  exportedAt: string;
  checks: CheckResult[];
  sessions: Session[];
  activityLogs: ActivityLog[];
  experiments: Experiment[];
}
