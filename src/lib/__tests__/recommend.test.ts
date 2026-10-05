import { describe, it, expect } from 'vitest';
import { getRecommendationsForObstacle, UserObstacle } from '../recommend';
import { getClaimById } from '@/content/evidence';

describe('recommendations deterministic mapping', () => {
  const obstacles: UserObstacle[] = [
    'phone',
    'racing_thoughts',
    'tiredness',
    'noise',
    'cant_start',
  ];

  it.each(obstacles)('generates valid recommendations for obstacle: %s', (obs) => {
    const recs = getRecommendationsForObstacle(obs);
    expect(recs.length).toBe(2);

    for (const rec of recs) {
      expect(rec.title).toBeTruthy();
      expect(rec.actionHref).toBeTruthy();
      expect(rec.whyThis).toBeTruthy();

      // Ensure every claimId refers to an authentic claim in evidence bank
      const claim = getClaimById(rec.claimId);
      expect(claim).toBeDefined();
      expect(rec.outcome).toBe(claim?.outcome);
      expect(rec.tier).toBe(claim?.tier);
    }
  });

  it('maps "phone" obstacle to environment checklist and if-then plan', () => {
    const recs = getRecommendationsForObstacle('phone');
    expect(recs.map((r) => r.claimId)).toEqual(['phone-presence', 'if-then']);
  });

  it('maps "racing_thoughts" to breath counting and cyclic sighing', () => {
    const recs = getRecommendationsForObstacle('racing_thoughts');
    expect(recs.map((r) => r.claimId)).toEqual(['focused-attention', 'breathwork-mood']);
  });

  it('maps "tiredness" to movement snack and sleep card', () => {
    const recs = getRecommendationsForObstacle('tiredness');
    expect(recs.map((r) => r.claimId)).toEqual(['movement', 'sleep']);
  });

  it('maps "noise" to noise self-experiment and environment control', () => {
    const recs = getRecommendationsForObstacle('noise');
    expect(recs.map((r) => r.claimId)).toEqual(['noise', 'multitasking']);
  });

  it('maps "cant_start" to if-then plan and manageable focus interval', () => {
    const recs = getRecommendationsForObstacle('cant_start');
    expect(recs.map((r) => r.claimId)).toEqual(['if-then', 'breaks-energy']);
  });
});
