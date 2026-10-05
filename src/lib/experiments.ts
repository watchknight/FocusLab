import { CheckResult, Experiment, ExperimentRun } from '@/store/types';

export const EXPERIMENT_CAVEAT =
  'This is a small personal experiment — a hint, not proof. Scores often improve with practice, which is why we compare against rest.';

export interface RunDelta {
  runId: string;
  conditionId: string;
  beforeCheckId: string;
  afterCheckId: string;
  beforeRt: number;
  afterRt: number;
  deltaRt: number; // For prepost: after - before. For concurrent: check's own medianRt.
  beforeLapses: number;
  afterLapses: number;
  deltaLapses: number;
}

export interface ConditionStats {
  conditionId: string;
  n: number;
  meanDeltaRt: number;
  minDeltaRt: number;
  maxDeltaRt: number;
  meanDeltaLapses: number;
  minDeltaLapses: number;
  maxDeltaLapses: number;
  deltas: RunDelta[];
}

export interface PairComparison {
  pairIndex: number;
  xDelta: RunDelta;
  restDelta: RunDelta;
  isWin: boolean; // xDelta.deltaRt < restDelta.deltaRt (lower is better)
  isTie: boolean;
}

export interface ExperimentAnalysis {
  experimentId: string;
  design: 'prepost' | 'concurrent';
  activeConditionId: string;
  controlConditionId: string;
  activeStats: ConditionStats;
  controlStats: ConditionStats;
  pairs: PairComparison[];
  totalPairs: number;
  wins: number;
  winRatio: number;
  verdict: string;
  caveat: string;
  runsNeededForVerdict: number;
}

/**
 * Creates a schedule of 5 pairs (10 runs) alternating between active condition and control.
 */
export function createExperimentSchedule(
  activityConditionId: string,
  controlConditionId?: string,
  rng: () => number = Math.random
): Array<{ conditionId: string }> {
  const controlId =
    controlConditionId || (activityConditionId.startsWith('sound:') ? 'sound:silence' : 'rest');
  const schedule: Array<{ conditionId: string }> = [];
  for (let i = 0; i < 5; i++) {
    const isActivityFirst = rng() < 0.5;
    if (isActivityFirst) {
      schedule.push({ conditionId: activityConditionId });
      schedule.push({ conditionId: controlId });
    } else {
      schedule.push({ conditionId: controlId });
      schedule.push({ conditionId: activityConditionId });
    }
  }
  return schedule;
}

export function computeRunDelta(
  run: ExperimentRun,
  checksMap: Map<string, CheckResult>,
  isConcurrent: boolean = false
): RunDelta | null {
  if (!run.checkIds || run.checkIds.length === 0) return null;

  if (isConcurrent) {
    const check = checksMap.get(run.checkIds[0]);
    if (!check) return null;
    return {
      runId: run.id,
      conditionId: run.conditionId,
      beforeCheckId: check.id,
      afterCheckId: check.id,
      beforeRt: check.metrics.medianRt,
      afterRt: check.metrics.medianRt,
      deltaRt: check.metrics.medianRt, // outcome is check's own medianRt
      beforeLapses: check.metrics.lapses,
      afterLapses: check.metrics.lapses,
      deltaLapses: check.metrics.lapses,
    };
  }

  if (run.checkIds.length < 2) return null;
  const [beforeId, afterId] = run.checkIds;
  const beforeCheck = checksMap.get(beforeId);
  const afterCheck = checksMap.get(afterId);
  if (!beforeCheck || !afterCheck) return null;

  const deltaRt = afterCheck.metrics.medianRt - beforeCheck.metrics.medianRt;
  const deltaLapses = afterCheck.metrics.lapses - beforeCheck.metrics.lapses;

  return {
    runId: run.id,
    conditionId: run.conditionId,
    beforeCheckId: beforeId,
    afterCheckId: afterId,
    beforeRt: beforeCheck.metrics.medianRt,
    afterRt: afterCheck.metrics.medianRt,
    deltaRt: Math.round(deltaRt * 10) / 10,
    beforeLapses: beforeCheck.metrics.lapses,
    afterLapses: afterCheck.metrics.lapses,
    deltaLapses,
  };
}

function computeConditionStats(conditionId: string, deltas: RunDelta[]): ConditionStats {
  if (deltas.length === 0) {
    return {
      conditionId,
      n: 0,
      meanDeltaRt: 0,
      minDeltaRt: 0,
      maxDeltaRt: 0,
      meanDeltaLapses: 0,
      minDeltaLapses: 0,
      maxDeltaLapses: 0,
      deltas: [],
    };
  }

  const rtDeltas = deltas.map((d) => d.deltaRt);
  const lapseDeltas = deltas.map((d) => d.deltaLapses);
  const sumRt = rtDeltas.reduce((a, b) => a + b, 0);
  const sumLapses = lapseDeltas.reduce((a, b) => a + b, 0);

  return {
    conditionId,
    n: deltas.length,
    meanDeltaRt: Math.round((sumRt / deltas.length) * 10) / 10,
    minDeltaRt: Math.min(...rtDeltas),
    maxDeltaRt: Math.max(...rtDeltas),
    meanDeltaLapses: Math.round((sumLapses / deltas.length) * 100) / 100,
    minDeltaLapses: Math.min(...lapseDeltas),
    maxDeltaLapses: Math.max(...lapseDeltas),
    deltas,
  };
}

export function analyzeExperiment(
  experiment: Experiment,
  allChecks: CheckResult[]
): ExperimentAnalysis {
  const isConcurrent = experiment.design === 'concurrent';
  const checksMap = new Map<string, CheckResult>();
  for (const c of allChecks) checksMap.set(c.id, c);

  const controlConditionId =
    experiment.conditionIds.find((id) => id === 'rest' || id === 'sound:silence') ||
    (isConcurrent ? 'sound:silence' : 'rest');
  const activeConditionId =
    experiment.conditionIds.find((id) => id !== controlConditionId) ||
    experiment.conditionIds[0] ||
    '';

  const xDeltas: RunDelta[] = [];
  const restDeltas: RunDelta[] = [];

  for (const run of experiment.runs) {
    const delta = computeRunDelta(run, checksMap, isConcurrent);
    if (!delta) continue;
    if (delta.conditionId === controlConditionId) {
      restDeltas.push(delta);
    } else {
      xDeltas.push(delta);
    }
  }

  const activeStats = computeConditionStats(activeConditionId, xDeltas);
  const controlStats = computeConditionStats(controlConditionId, restDeltas);

  const numPairs = Math.min(xDeltas.length, restDeltas.length);
  const pairs: PairComparison[] = [];
  let wins = 0;

  for (let i = 0; i < numPairs; i++) {
    const x = xDeltas[i];
    const rest = restDeltas[i];
    const isWin = x.deltaRt < rest.deltaRt; // Lower is better in both prepost and concurrent
    const isTie = x.deltaRt === rest.deltaRt;
    if (isWin) wins += 1;

    pairs.push({ pairIndex: i + 1, xDelta: x, restDelta: rest, isWin, isTie });
  }

  const winRatio = numPairs > 0 ? Math.round((wins / numPairs) * 100) / 100 : 0;
  const runsNeededForVerdict = Math.max(0, 4 - xDeltas.length) + Math.max(0, 4 - restDeltas.length);

  let verdict = '';
  if (numPairs < 4) {
    verdict = `Not enough data yet — ${runsNeededForVerdict} more run${runsNeededForVerdict === 1 ? '' : 's'}`;
  } else {
    const meanDiff = activeStats.meanDeltaRt - controlStats.meanDeltaRt;
    if (winRatio >= 0.75 && meanDiff < 0) {
      verdict = 'Promising for you — keep testing.';
    } else if (winRatio <= 0.25) {
      verdict = "Doesn't seem to help you.";
    } else {
      verdict = 'No clear difference.';
    }
  }

  return {
    experimentId: experiment.id,
    design: experiment.design,
    activeConditionId,
    controlConditionId,
    activeStats,
    controlStats,
    pairs,
    totalPairs: numPairs,
    wins,
    winRatio,
    verdict,
    caveat: EXPERIMENT_CAVEAT,
    runsNeededForVerdict,
  };
}
