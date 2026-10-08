import { describe, it, expect } from 'vitest';
import { REFERENCES, CLAIMS, getClaimById, EVIDENCE_TIERS } from '@/content/evidence';

describe('Landing page S2-S6 content and transparency integrity', () => {
  it('every reference has a non-empty Author Year label', () => {
    expect(REFERENCES.length).toBeGreaterThan(0);
    REFERENCES.forEach((ref) => {
      expect(ref.label).toBeDefined();
      expect(ref.label!.trim().length).toBeGreaterThan(0);
      expect(ref.label).toMatch(/\d{4}/); // Contains 4-digit year
    });
  });

  it('computes transparency counters accurately from content', () => {
    const studiesCount = REFERENCES.length;
    const claimsCount = CLAIMS.length;
    const mixedOrWeakerCount = CLAIMS.filter(
      (c) => c.tier === 'mixed' || c.tier === 'emerging' || c.tier === 'not-supported'
    ).length;

    expect(studiesCount).toBe(28);
    expect(claimsCount).toBe(16);
    expect(mixedOrWeakerCount).toBe(7);
  });

  it('all five S4 tiers map to existing claims with valid fields', () => {
    const s4ClaimIds = {
      strong: 'sleep',
      moderate: 'movement',
      mixed: 'noise',
      emerging: 'body-doubling',
      'not-supported': 'brain-training',
    } as const;

    Object.entries(s4ClaimIds).forEach(([tier, id]) => {
      const claim = getClaimById(id);
      expect(claim).toBeDefined();
      expect(claim?.tier).toBe(tier);
      expect(claim?.title.length).toBeGreaterThan(0);
      expect(claim?.outcome.length).toBeGreaterThan(0);
      expect(claim?.summary.length).toBeGreaterThan(0);
      expect(claim?.caveat.length).toBeGreaterThan(0);
    });
  });

  it('EVIDENCE_TIERS contains all 5 tiers with honest non-empty definitions', () => {
    expect(EVIDENCE_TIERS.length).toBe(5);
    const expectedTiers = ['strong', 'moderate', 'mixed', 'emerging', 'not-supported'];
    expect(EVIDENCE_TIERS.map((t) => t.tier)).toEqual(expectedTiers);
    EVIDENCE_TIERS.forEach((t) => {
      expect(t.label.length).toBeGreaterThan(0);
      expect(t.desc.length).toBeGreaterThan(0);
      expect(t.claimId.length).toBeGreaterThan(0);
      const claim = getClaimById(t.claimId);
      expect(claim).toBeDefined();
      expect(claim?.tier).toBe(t.tier);
    });
  });

  it('pinned scene activeIndex correctly maps progress to panels', () => {
    const getActiveIndex = (p: number) => (p < 0.33 ? 0 : p < 0.75 ? 1 : 2);
    expect(getActiveIndex(0)).toBe(0);
    expect(getActiveIndex(0.2)).toBe(0);
    expect(getActiveIndex(0.32)).toBe(0);
    expect(getActiveIndex(0.34)).toBe(1);
    expect(getActiveIndex(0.5)).toBe(1);
    expect(getActiveIndex(0.74)).toBe(1);
    expect(getActiveIndex(0.75)).toBe(2);
    expect(getActiveIndex(1.0)).toBe(2);
  });
});

