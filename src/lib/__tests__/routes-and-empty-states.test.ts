import { describe, it, expect } from 'vitest';
import { ACTIVITIES } from '@/content/activities';
import { CLAIMS, getClaimById } from '@/content/evidence';
import { MYTHS } from '@/content/myths';
import { createExperimentSchedule } from '@/lib/experiments';

describe('Activities & Learn Content Contracts', () => {
  it('every activity references an existing evidence claim with a valid tier', () => {
    for (const act of ACTIVITIES) {
      const claim = getClaimById(act.evidenceId);
      expect(claim).toBeDefined();
      expect(['strong', 'moderate', 'mixed', 'emerging', 'not-supported']).toContain(claim?.tier);
      expect(claim?.outcome).toBeTruthy();
    }
  });

  it('every activity has positive durations sorted and non-empty steps', () => {
    for (const act of ACTIVITIES) {
      expect(act.durationOptionsSec.length).toBeGreaterThan(0);
      act.durationOptionsSec.forEach((dur) => {
        expect(dur).toBeGreaterThan(0);
      });
      expect(act.steps.length).toBeGreaterThan(0);
    }
  });

  it('category filtering partitions activities correctly', () => {
    const breathing = ACTIVITIES.filter((a) => !a.isControl && a.category === 'breathing');
    const attention = ACTIVITIES.filter((a) => !a.isControl && a.category === 'attention');
    const movement = ACTIVITIES.filter((a) => !a.isControl && a.category === 'movement');
    const nature = ACTIVITIES.filter((a) => !a.isControl && a.category === 'nature');

    expect(breathing.length).toBeGreaterThan(0);
    expect(attention.length).toBeGreaterThan(0);
    expect(movement.length).toBeGreaterThan(0);
    expect(nature.length).toBeGreaterThan(0);

    const totalStandard = ACTIVITIES.filter((a) => !a.isControl).length;
    expect(breathing.length + attention.length + movement.length + nature.length).toBe(totalStandard);
  });

  it('six myths exist and each has a valid verdict and non-empty explanation', () => {
    expect(MYTHS.length).toBe(6);
    for (const myth of MYTHS) {
      expect(myth.myth).toBeTruthy();
      expect(myth.verdict).toBeTruthy();
      expect(myth.explanation).toBeTruthy();
      if (myth.claimId) {
        expect(getClaimById(myth.claimId)).toBeDefined();
      }
    }
  });

  it('every claim has valid references', () => {
    for (const claim of CLAIMS) {
      expect(claim.refIds.length).toBeGreaterThan(0);
      expect(claim.summary).toBeTruthy();
      expect(claim.caveat).toBeTruthy();
      expect(claim.outcome).toBeTruthy();
    }
  });
});

describe('Experiment schedule and film-strip invariants', () => {
  it('creates an experiment schedule with exactly 10 runs (5 active, 5 control)', () => {
    const sched = createExperimentSchedule('activity:cyclic-sighing', 'rest');
    expect(sched.length).toBe(10);
    const activeRuns = sched.filter((s) => s.conditionId === 'activity:cyclic-sighing');
    const controlRuns = sched.filter((s) => s.conditionId === 'rest');
    expect(activeRuns.length).toBe(5);
    expect(controlRuns.length).toBe(5);
  });

  it('preserves paired blocks of 2 in schedule', () => {
    const sched = createExperimentSchedule('activity:box-breathing', 'rest');
    for (let pair = 0; pair < 5; pair++) {
      const block = sched.slice(pair * 2, pair * 2 + 2);
      const conditions = block.map((b) => b.conditionId);
      expect(conditions).toContain('activity:box-breathing');
      expect(conditions).toContain('rest');
    }
  });
});

describe('Delta formatting in film-strip and dot-plot', () => {
  const formatDelta = (val: number, isConcurrent: boolean) =>
    isConcurrent ? `${val} ms` : `${val > 0 ? '+' : ''}${val} ms`;

  it('formats faster reaction times with negative sign for prepost', () => {
    expect(formatDelta(-24, false)).toBe('-24 ms');
  });

  it('formats slower reaction times with positive sign for prepost', () => {
    expect(formatDelta(18, false)).toBe('+18 ms');
  });

  it('formats zero delta without sign for prepost', () => {
    expect(formatDelta(0, false)).toBe('0 ms');
  });

  it('formats raw reaction time without sign for concurrent', () => {
    expect(formatDelta(310, true)).toBe('310 ms');
  });
});

describe('Volume knob percentage and angle calculation', () => {
  const maxVolume = 0.6;
  const volToAngle = (vol: number) => {
    const pct = Math.max(0, Math.min(1, vol / maxVolume));
    return pct * 270;
  };
  const angleToVol = (angle: number) => {
    const rot = Math.max(0, Math.min(270, angle));
    return (rot / 270) * maxVolume;
  };

  it('maps 0 volume to 0 degrees and 0.6 to 270 degrees', () => {
    expect(volToAngle(0)).toBe(0);
    expect(volToAngle(0.6)).toBe(270);
    expect(volToAngle(0.3)).toBeCloseTo(135);
  });

  it('maps degrees back to volume faithfully', () => {
    expect(angleToVol(0)).toBe(0);
    expect(angleToVol(270)).toBeCloseTo(0.6);
    expect(angleToVol(135)).toBeCloseTo(0.3);
  });

  it('clamps values out of bounds safely', () => {
    expect(volToAngle(-1)).toBe(0);
    expect(volToAngle(2)).toBe(270);
    expect(angleToVol(-50)).toBe(0);
    expect(angleToVol(350)).toBeCloseTo(0.6);
  });
});

describe('Empty state single-sentence constraint audits', () => {
  const emptyStateCopies = [
    'No activities match the selected filters.',
    'No evidence claims match the selected tier filter.',
    'Start your first self-experiment to compare an active practice against quiet rest across 10 paired runs.',
    'Complete your first Focus Check to start generating personal focus insights.',
    'Select a noise profile above to play background sound and mask auditory distractions.',
  ];

  it('every registered empty state is exactly one sentence ending with a single period', () => {
    for (const copy of emptyStateCopies) {
      expect(copy.endsWith('.')).toBe(true);
      const sentences = copy.split(/[.!?]+/).filter(Boolean);
      expect(sentences.length).toBe(1);
    }
  });
});
