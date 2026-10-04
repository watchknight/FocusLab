import { describe, it, expect } from 'vitest';
import { computeTimerSnapshot, formatTimeRemaining } from '../timer';

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
});
