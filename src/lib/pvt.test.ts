import { describe, it, expect } from 'vitest';
import {
  getRandomIsi,
  calculateMetrics,
  calculateMedian,
  MIN_ISI_MS,
  MAX_ISI_MS,
  MIN_VALID_RT_MS,
  LAPSE_THRESHOLD_MS,
  TIMEOUT_MS,
} from './pvt';
import { CheckTrial } from '@/store/types';

describe('PVT-B pure logic', () => {
  describe('getRandomIsi', () => {
    it('respects lower and upper bounds of 1000-4000 ms with mock RNG', () => {
      expect(getRandomIsi(() => 0)).toBe(MIN_ISI_MS);
      expect(getRandomIsi(() => 1)).toBe(MAX_ISI_MS);
      expect(getRandomIsi(() => 0.5)).toBe(2500);
    });

    it('generates values within bounds over multiple random iterations', () => {
      for (let i = 0; i < 50; i++) {
        const isi = getRandomIsi();
        expect(isi).toBeGreaterThanOrEqual(MIN_ISI_MS);
        expect(isi).toBeLessThanOrEqual(MAX_ISI_MS);
      }
    });
  });

  describe('calculateMedian', () => {
    it('returns 0 for empty array', () => {
      expect(calculateMedian([])).toBe(0);
    });

    it('calculates median for odd number of values', () => {
      expect(calculateMedian([320, 250, 400])).toBe(320);
    });

    it('calculates median for even number of values', () => {
      expect(calculateMedian([200, 300, 400, 500])).toBe(350);
    });
  });

  describe('calculateMetrics', () => {
    it('safely handles zero valid trials without producing NaN', () => {
      const emptyTrials: CheckTrial[] = [];
      const metrics = calculateMetrics(emptyTrials);

      expect(metrics.medianRt).toBe(0);
      expect(metrics.lapses).toBe(0);
      expect(metrics.falseStarts).toBe(0);
      expect(metrics.meanReciprocal).toBe(0);
      expect(Number.isNaN(metrics.medianRt)).toBe(false);
      expect(Number.isNaN(metrics.meanReciprocal)).toBe(false);
    });

    it('handles trial set consisting only of false starts without NaN', () => {
      const onlyFalseStarts: CheckTrial[] = [
        { isiMs: 2000, rtMs: null, falseStart: true },
        { isiMs: 3000, rtMs: 80, falseStart: true },
        { isiMs: 1500, rtMs: 50, falseStart: false }, // below MIN_VALID_RT_MS is also treated as false start
      ];
      const metrics = calculateMetrics(onlyFalseStarts);

      expect(metrics.falseStarts).toBe(3);
      expect(metrics.lapses).toBe(0);
      expect(metrics.medianRt).toBe(0);
      expect(metrics.meanReciprocal).toBe(0);
      expect(Number.isNaN(metrics.medianRt)).toBe(false);
      expect(Number.isNaN(metrics.meanReciprocal)).toBe(false);
    });

    it('correctly counts lapses (>= 355 ms) and 10s timeouts', () => {
      const trials: CheckTrial[] = [
        { isiMs: 2000, rtMs: 250, falseStart: false },
        { isiMs: 2500, rtMs: 354, falseStart: false }, // just below lapse
        { isiMs: 3000, rtMs: LAPSE_THRESHOLD_MS, falseStart: false }, // exactly lapse threshold
        { isiMs: 1500, rtMs: 420, falseStart: false }, // lapse
        { isiMs: 3500, rtMs: TIMEOUT_MS, falseStart: false }, // timeout lapse
      ];

      const metrics = calculateMetrics(trials);
      expect(metrics.lapses).toBe(3);
      expect(metrics.falseStarts).toBe(0);
    });

    it('accurately computes median RT and mean reciprocal response speed', () => {
      // 4 valid trials: 200, 250, 400, 500
      // Sorted: [200, 250, 400, 500] -> median = (250 + 400)/2 = 325
      // 1000/RT: 1000/200 = 5.0, 1000/250 = 4.0, 1000/400 = 2.5, 1000/500 = 2.0
      // Sum = 13.5, Mean = 13.5 / 4 = 3.375 -> rounded to 3.38
      const trials: CheckTrial[] = [
        { isiMs: 1000, rtMs: 500, falseStart: false },
        { isiMs: 1200, rtMs: 200, falseStart: false },
        { isiMs: 2000, rtMs: 50, falseStart: true }, // ignored for median & reciprocal
        { isiMs: 1400, rtMs: 400, falseStart: false },
        { isiMs: 1800, rtMs: 250, falseStart: false },
      ];

      const metrics = calculateMetrics(trials);
      expect(metrics.falseStarts).toBe(1);
      expect(metrics.medianRt).toBe(325);
      expect(metrics.meanReciprocal).toBe(3.38);
      expect(metrics.lapses).toBe(2); // 400 and 500 >= 355
    });

    it('identifies responses below 100ms as false starts and excludes them from valid RTs', () => {
      const trials: CheckTrial[] = [
        { isiMs: 1500, rtMs: 99, falseStart: false },
        { isiMs: 2000, rtMs: 100, falseStart: false }, // valid minimum
        { isiMs: 2500, rtMs: 200, falseStart: false },
      ];

      const metrics = calculateMetrics(trials);
      expect(metrics.falseStarts).toBe(1);
      expect(metrics.medianRt).toBe(150); // (100 + 200) / 2
    });
  });
});
