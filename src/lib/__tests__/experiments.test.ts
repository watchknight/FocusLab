import { describe, it, expect } from 'vitest';
import { computeActivityDeltas } from '../experiments';
import { SelfCheckLog, PracticeSessionLog } from '../legacy-types';

describe('experiments calculation', () => {
  it('computes correct mean deltas for matched pre- and post-checks', () => {
    const checks: SelfCheckLog[] = [
      { id: 'pre1', timestamp: 1000, energyLevel: 2, distractionLevel: 4, moodLevel: 2 },
      { id: 'post1', timestamp: 2000, energyLevel: 4, distractionLevel: 2, moodLevel: 4 },
      { id: 'pre2', timestamp: 3000, energyLevel: 3, distractionLevel: 5, moodLevel: 3 },
      { id: 'post2', timestamp: 4000, energyLevel: 4, distractionLevel: 2, moodLevel: 4 },
    ];

    const sessions: PracticeSessionLog[] = [
      {
        id: 's1',
        activityId: 'act_phys_sigh',
        startedAt: 1000,
        completedAt: 2000,
        durationMs: 120000,
        preCheckId: 'pre1',
        postCheckId: 'post1',
        completedFully: true,
      },
      {
        id: 's2',
        activityId: 'act_phys_sigh',
        startedAt: 3000,
        completedAt: 4000,
        durationMs: 120000,
        preCheckId: 'pre2',
        postCheckId: 'post2',
        completedFully: true,
      },
    ];

    const deltas = computeActivityDeltas('act_phys_sigh', sessions, checks);
    expect(deltas.count).toBe(2);
    // pre1 -> post1: energy +2, distraction -2, mood +2
    // pre2 -> post2: energy +1, distraction -3, mood +1
    // mean energy delta: (2 + 1)/2 = 1.5
    // mean distraction delta: (-2 + -3)/2 = -2.5
    // mean mood delta: (2 + 1)/2 = 1.5
    expect(deltas.meanEnergyDelta).toBe(1.5);
    expect(deltas.meanDistractionDelta).toBe(-2.5);
    expect(deltas.meanMoodDelta).toBe(1.5);
  });

  it('handles empty sessions gracefully', () => {
    const deltas = computeActivityDeltas('act_none', [], []);
    expect(deltas.count).toBe(0);
    expect(deltas.meanEnergyDelta).toBe(0);
  });
});
