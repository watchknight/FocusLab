import { CheckTrial, CheckMetrics } from '@/store/types';

export const MIN_VALID_RT_MS = 100;
export const LAPSE_THRESHOLD_MS = 355;
export const TIMEOUT_MS = 10000;
export const FEEDBACK_DURATION_MS = 1000;
export const TOTAL_TEST_DURATION_MS = 180000; // 3 minutes

export const MIN_ISI_MS = 1000;
export const MAX_ISI_MS = 4000;

/**
 * Returns a random inter-stimulus interval (ISI) uniformly distributed between 1000 and 4000 ms.
 * Accepts an injectable random number generator (rng) for deterministic unit testing.
 */
export function getRandomIsi(rng: () => number = Math.random): number {
  const r = Math.max(0, Math.min(1, rng()));
  return MIN_ISI_MS + r * (MAX_ISI_MS - MIN_ISI_MS);
}

/**
 * Computes median value of an array of numbers. Returns 0 for an empty array (never NaN).
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
}

/**
 * Computes PVT-B performance metrics from trial records:
 * - medianRt: median RT across valid non-false-start trials (0 if none)
 * - lapses: trials with RT >= 355 ms (including 10s timeouts)
 * - falseStarts: anticipation responses before onset or with RT < 100 ms
 * - meanReciprocal: mean of (1000 / RT) across valid trials (0 if none)
 */
export function calculateMetrics(trials: CheckTrial[]): CheckMetrics {
  let falseStarts = 0;
  let lapses = 0;
  const validRts: number[] = [];

  for (const trial of trials) {
    if (trial.falseStart || (trial.rtMs !== null && trial.rtMs < MIN_VALID_RT_MS)) {
      falseStarts += 1;
      continue;
    }

    if (trial.rtMs !== null) {
      if (trial.rtMs >= LAPSE_THRESHOLD_MS) {
        lapses += 1;
      }
      if (trial.rtMs >= MIN_VALID_RT_MS) {
        validRts.push(trial.rtMs);
      }
    }
  }

  const medianRt = calculateMedian(validRts);

  let meanReciprocal = 0;
  if (validRts.length > 0) {
    const sumReciprocal = validRts.reduce((sum, rt) => sum + 1000 / rt, 0);
    meanReciprocal = Math.round((sumReciprocal / validRts.length) * 100) / 100;
  }

  return {
    medianRt,
    lapses,
    falseStarts,
    meanReciprocal,
  };
}
