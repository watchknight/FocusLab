import { describe, it, expect } from 'vitest';
import {
  computeTimerSnapshot,
  formatTimeRemaining,
  calculateElapsedMs,
  computeFlexibleBreakMinutes,
  computeFlexibleBreakSec,
  PauseInterval,
} from '../timer';

describe('timer pure logic', () => {
  it('formats remaining milliseconds to MM:SS correctly', () => {
    expect(formatTimeRemaining(0)).toBe('00:00');
    expect(formatTimeRemaining(1000)).toBe('00:01');
    expect(formatTimeRemaining(60000)).toBe('01:00');
    expect(formatTimeRemaining(125000)).toBe('02:05');
  });

  it('computes initial snapshot accurately', () => {
    const snapshot = computeTimerSnapshot(1000, 60000, 1000);
    expect(snapshot.elapsedMs).toBe(0);
    expect(snapshot.remainingMs).toBe(60000);
    expect(snapshot.progressPercent).toBe(0);
    expect(snapshot.isFinished).toBe(false);
    expect(snapshot.formattedMinutesSeconds).toBe('01:00');
  });

  it('computes midway snapshot without tick drift', () => {
    const snapshot = computeTimerSnapshot(1000, 60000, 31000);
    expect(snapshot.elapsedMs).toBe(30000);
    expect(snapshot.remainingMs).toBe(30000);
    expect(snapshot.progressPercent).toBe(50);
    expect(snapshot.isFinished).toBe(false);
    expect(snapshot.formattedMinutesSeconds).toBe('00:30');
  });

  it('caps progress at 100% when elapsed exceeds duration', () => {
    const snapshot = computeTimerSnapshot(1000, 60000, 75000);
    expect(snapshot.elapsedMs).toBe(60000);
    expect(snapshot.remainingMs).toBe(0);
    expect(snapshot.progressPercent).toBe(100);
    expect(snapshot.isFinished).toBe(true);
    expect(snapshot.formattedMinutesSeconds).toBe('00:00');
  });

  it('handles zero or negative duration gracefully', () => {
    const snapshot = computeTimerSnapshot(1000, 0, 1000);
    expect(snapshot.isFinished).toBe(true);
    expect(snapshot.progressPercent).toBe(100);
  });

  describe('elapsed time with pauses', () => {
    it('accurately discounts completed pause intervals', () => {
      const startedAt = 0;
      const pauses: PauseInterval[] = [
        { pausedAt: 10000, resumedAt: 15000 }, // 5s pause
        { pausedAt: 30000, resumedAt: 40000 }, // 10s pause
      ];
      // Total wall clock: 50s. Paused time: 15s. Active elapsed: 35s.
      const elapsed = calculateElapsedMs(startedAt, pauses, null, 50000);
      expect(elapsed).toBe(35000);

      const snapshot = computeTimerSnapshot(startedAt, 60000, 50000, pauses, null);
      expect(snapshot.elapsedMs).toBe(35000);
      expect(snapshot.remainingMs).toBe(25000);
    });

    it('freezes elapsed time while actively paused', () => {
      const startedAt = 0;
      const pauses: PauseInterval[] = [];
      const pausedAt = 20000;
      // Wall clock advances from 20s to 80s (60s in pause state)
      const elapsedAtPause = calculateElapsedMs(startedAt, pauses, pausedAt, 20000);
      const elapsedLater = calculateElapsedMs(startedAt, pauses, pausedAt, 80000);

      expect(elapsedAtPause).toBe(20000);
      expect(elapsedLater).toBe(20000);

      const snapshot = computeTimerSnapshot(startedAt, 60000, 80000, pauses, pausedAt);
      expect(snapshot.isPaused).toBe(true);
      expect(snapshot.elapsedMs).toBe(20000);
      expect(snapshot.remainingMs).toBe(40000);
    });
  });

  describe('flexible break calculation', () => {
    it('enforces a minimum break of 2 minutes for short focus blocks', () => {
      // 1 minute focus (60s) -> 1/5 is 12s -> min 2 min
      expect(computeFlexibleBreakMinutes(60)).toBe(2);
      expect(computeFlexibleBreakSec(60)).toBe(120);

      // 5 minutes focus (300s) -> 1/5 is 1 min -> min 2 min
      expect(computeFlexibleBreakMinutes(300)).toBe(2);
      expect(computeFlexibleBreakSec(300)).toBe(120);
    });

    it('calculates one fifth of focus time rounded to whole minutes', () => {
      // 25 minutes focus (1500s) -> 1/5 is 5 min
      expect(computeFlexibleBreakMinutes(1500)).toBe(5);
      expect(computeFlexibleBreakSec(1500)).toBe(300);

      // 50 minutes focus (3000s) -> 1/5 is 10 min
      expect(computeFlexibleBreakMinutes(3000)).toBe(10);
      expect(computeFlexibleBreakSec(3000)).toBe(600);

      // 12 minutes focus (720s) -> 1/5 is 2.4 min -> rounded is 2 min
      expect(computeFlexibleBreakMinutes(720)).toBe(2);

      // 14 minutes focus (840s) -> 1/5 is 2.8 min -> rounded is 3 min
      expect(computeFlexibleBreakMinutes(840)).toBe(3);
      expect(computeFlexibleBreakSec(840)).toBe(180);
    });
  });

  describe('background-tab throttling resistance', () => {
    it('computes correct elapsed time and remaining time after a simulated 60s tab throttle', () => {
      const startedAt = 10000;
      const totalDurationMs = 120000; // 2 minutes

      // State before throttle at t = 20s (10s elapsed)
      const beforeThrottle = computeTimerSnapshot(startedAt, totalDurationMs, 20000);
      expect(beforeThrottle.elapsedMs).toBe(10000);
      expect(beforeThrottle.remainingMs).toBe(110000);

      // Tab was throttled for 60s without any tick events.
      // Next call occurs at t = 80s (no ticks ran during the 60s gap).
      const afterThrottle = computeTimerSnapshot(startedAt, totalDurationMs, 80000);
      expect(afterThrottle.elapsedMs).toBe(70000); // 80s - 10s = exactly 70s
      expect(afterThrottle.remainingMs).toBe(50000);
      expect(afterThrottle.formattedMinutesSeconds).toBe('00:50');
    });

    it('correctly tracks paused timer even if tab is throttled during pause', () => {
      const startedAt = 0;
      const pausedAt = 15000;
      // Paused at 15s. Tab throttles for 60s until t = 75s.
      const snapshot = computeTimerSnapshot(startedAt, 60000, 75000, [], pausedAt);
      expect(snapshot.elapsedMs).toBe(15000);
      expect(snapshot.remainingMs).toBe(45000);

      // User resumes at t = 75s.
      const pauses: PauseInterval[] = [{ pausedAt: 15000, resumedAt: 75000 }];
      // At t = 85s (10s active after resume):
      const resumedSnapshot = computeTimerSnapshot(startedAt, 60000, 85000, pauses, null);
      expect(resumedSnapshot.elapsedMs).toBe(25000); // 15s before pause + 10s after resume
      expect(resumedSnapshot.remainingMs).toBe(35000);
    });
  });
});
