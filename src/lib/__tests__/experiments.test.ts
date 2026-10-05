import { describe, it, expect } from 'vitest';
import {
  createExperimentSchedule,
  analyzeExperiment,
  computeRunDelta,
  EXPERIMENT_CAVEAT,
} from '../experiments';
import { CheckResult, Experiment, ExperimentRun } from '@/store/types';

function createMockCheck(id: string, medianRt: number, lapses: number): CheckResult {
  return {
    id,
    ts: Date.now(),
    context: 'experiment',
    preRatings: { alertness: 3, mindWandering: 3 },
    trials: [],
    metrics: { medianRt, lapses, falseStarts: 0, meanReciprocal: 3.0 },
  };
}

function buildPrepostPairs(xDiffs: number[], restDiffs: number[]) {
  const checks: CheckResult[] = [];
  const runs: ExperimentRun[] = [];
  for (let i = 0; i < xDiffs.length; i++) {
    checks.push(createMockCheck(`x_${i}_pre`, 350, 1));
    checks.push(createMockCheck(`x_${i}_post`, 350 + xDiffs[i], 1));
    runs.push({
      id: `x_run_${i}`,
      ts: i * 2,
      conditionId: 'activity:cyclic-sighing',
      checkIds: [`x_${i}_pre`, `x_${i}_post`],
    });

    checks.push(createMockCheck(`r_${i}_pre`, 350, 1));
    checks.push(createMockCheck(`r_${i}_post`, 350 + restDiffs[i], 1));
    runs.push({
      id: `r_run_${i}`,
      ts: i * 2 + 1,
      conditionId: 'rest',
      checkIds: [`r_${i}_pre`, `r_${i}_post`],
    });
  }
  return { checks, runs };
}

describe('experiments pure analysis logic', () => {
  it('creates 5 pairs (10 runs) with predictable seeded RNG', () => {
    let callCount = 0;
    const mockRng = () => (++callCount % 2 === 1 ? 0.2 : 0.8);
    const schedule = createExperimentSchedule('activity:cyclic-sighing', undefined, mockRng);

    expect(schedule.length).toBe(10);
    expect(schedule.filter((s) => s.conditionId === 'activity:cyclic-sighing').length).toBe(5);
    expect(schedule.filter((s) => s.conditionId === 'rest').length).toBe(5);
    expect(schedule[0].conditionId).toBe('activity:cyclic-sighing');
    expect(schedule[1].conditionId).toBe('rest');
  });

  it('correctly calculates after minus before deltas for prepost design', () => {
    const checksMap = new Map<string, CheckResult>([
      ['pre', createMockCheck('pre', 350, 4)],
      ['post', createMockCheck('post', 310, 1)],
    ]);
    const run: ExperimentRun = {
      id: 'run_1',
      ts: Date.now(),
      conditionId: 'activity:cyclic-sighing',
      checkIds: ['pre', 'post'],
    };
    const delta = computeRunDelta(run, checksMap, false);
    expect(delta?.deltaRt).toBe(-40);
    expect(delta?.deltaLapses).toBe(-3);
  });

  it('returns "Not enough data yet" when fewer than 4 pairs are completed', () => {
    const { checks, runs } = buildPrepostPairs([-20], [5]);
    const experiment: Experiment = {
      id: 'exp_1',
      createdAt: Date.now(),
      design: 'prepost',
      conditionIds: ['activity:cyclic-sighing', 'rest'],
      schedule: [],
      runs,
    };
    const analysis = analyzeExperiment(experiment, checks);
    expect(analysis.totalPairs).toBe(1);
    expect(analysis.verdict).toBe('Not enough data yet — 6 more runs');
    expect(analysis.caveat).toBe(EXPERIMENT_CAVEAT);
  });

  it('returns "Promising for you" when prepost wins >= 75% and mean diff favours X', () => {
    const { checks, runs } = buildPrepostPairs([-30, -20, -40, 5], [0, -5, -10, 20]);
    const experiment: Experiment = {
      id: 'exp_promising',
      createdAt: Date.now(),
      design: 'prepost',
      conditionIds: ['activity:cyclic-sighing', 'rest'],
      schedule: [],
      runs,
    };
    const analysis = analyzeExperiment(experiment, checks);
    expect(analysis.wins).toBe(4);
    expect(analysis.verdict).toBe('Promising for you — keep testing.');
  });

  it('handles concurrent design with single check per run and lower RT as win', () => {
    // Concurrent design: 4 pairs of sound:brown vs sound:silence
    // Brown RTs: [280, 290, 275, 295] -> all lower than Silence RTs [310, 315, 305, 320]
    const checks: CheckResult[] = [];
    const runs: ExperimentRun[] = [];

    const brownRts = [280, 290, 275, 295];
    const silenceRts = [310, 315, 305, 320];

    for (let i = 0; i < 4; i++) {
      checks.push(createMockCheck(`b_${i}`, brownRts[i], 0));
      runs.push({
        id: `r_b_${i}`,
        ts: i * 2,
        conditionId: 'sound:brown',
        checkIds: [`b_${i}`],
      });

      checks.push(createMockCheck(`s_${i}`, silenceRts[i], 0));
      runs.push({
        id: `r_s_${i}`,
        ts: i * 2 + 1,
        conditionId: 'sound:silence',
        checkIds: [`s_${i}`],
      });
    }

    const experiment: Experiment = {
      id: 'exp_concurrent',
      createdAt: Date.now(),
      design: 'concurrent',
      conditionIds: ['sound:brown', 'sound:silence'],
      schedule: [],
      runs,
    };

    const analysis = analyzeExperiment(experiment, checks);
    expect(analysis.design).toBe('concurrent');
    expect(analysis.totalPairs).toBe(4);
    expect(analysis.wins).toBe(4);
    expect(analysis.winRatio).toBe(1.0);
    expect(analysis.verdict).toBe('Promising for you — keep testing.');
  });

  it('returns "Doesn\'t seem to help you." in concurrent design when wins <= 25%', () => {
    // Sound is slower than silence in 3 of 4 pairs
    const checks: CheckResult[] = [];
    const runs: ExperimentRun[] = [];

    const whiteRts = [330, 340, 350, 280]; // wins only 4th pair
    const silenceRts = [300, 310, 310, 310];

    for (let i = 0; i < 4; i++) {
      checks.push(createMockCheck(`w_${i}`, whiteRts[i], 0));
      runs.push({
        id: `r_w_${i}`,
        ts: i * 2,
        conditionId: 'sound:white',
        checkIds: [`w_${i}`],
      });

      checks.push(createMockCheck(`s_${i}`, silenceRts[i], 0));
      runs.push({
        id: `r_s_${i}`,
        ts: i * 2 + 1,
        conditionId: 'sound:silence',
        checkIds: [`s_${i}`],
      });
    }

    const experiment: Experiment = {
      id: 'exp_conc_unhelpful',
      createdAt: Date.now(),
      design: 'concurrent',
      conditionIds: ['sound:white', 'sound:silence'],
      schedule: [],
      runs,
    };

    const analysis = analyzeExperiment(experiment, checks);
    expect(analysis.wins).toBe(1);
    expect(analysis.winRatio).toBe(0.25);
    expect(analysis.verdict).toBe("Doesn't seem to help you.");
  });

  it('correctly handles ties and zero lapses in concurrent design', () => {
    const checks: CheckResult[] = [];
    const runs: ExperimentRun[] = [];

    for (let i = 0; i < 4; i++) {
      checks.push(createMockCheck(`x_${i}`, 300, 0));
      runs.push({ id: `rx_${i}`, ts: i * 2, conditionId: 'sound:pink', checkIds: [`x_${i}`] });
      checks.push(createMockCheck(`s_${i}`, 300, 0));
      runs.push({ id: `rs_${i}`, ts: i * 2 + 1, conditionId: 'sound:silence', checkIds: [`s_${i}`] });
    }

    const experiment: Experiment = {
      id: 'exp_conc_ties',
      createdAt: Date.now(),
      design: 'concurrent',
      conditionIds: ['sound:pink', 'sound:silence'],
      schedule: [],
      runs,
    };

    const analysis = analyzeExperiment(experiment, checks);
    expect(analysis.pairs.every((p) => p.isTie)).toBe(true);
    expect(analysis.wins).toBe(0);
    expect(analysis.verdict).toBe("Doesn't seem to help you.");
  });
});
