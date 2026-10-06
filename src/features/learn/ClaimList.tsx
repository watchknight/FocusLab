'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { EvidenceClaim, EvidenceTier } from '@/content/types';
import { Button } from '@/components/ui/Button';
import { ClaimCard } from './ClaimCard';

interface ClaimListProps {
  claims: EvidenceClaim[];
}

type FilterTier = 'all' | EvidenceTier;

const TIERS: Array<{ id: FilterTier; label: string }> = [
  { id: 'all', label: 'All Tiers' },
  { id: 'strong', label: 'Strong' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'mixed', label: 'Mixed' },
  { id: 'emerging', label: 'Emerging' },
  { id: 'not-supported', label: 'Not Supported' },
];

export const ClaimList: React.FC<ClaimListProps> = ({ claims }) => {
  const [activeTier, setActiveTier] = useState<FilterTier>('all');

  const filteredClaims = useMemo(() => {
    if (activeTier === 'all') return claims;
    return claims.filter((c) => c.tier === activeTier);
  }, [claims, activeTier]);

  return (
    <div className="space-y-6">
      {/* Navigation to sub-sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/learn/myths"
          className="p-3.5 rounded-md border border-border bg-surface-2 hover:border-border-strong transition-colors flex items-center justify-between min-h-[48px]"
        >
          <div>
            <div className="text-sm font-semibold text-text font-display">Six Popular Myths</div>
            <div className="text-xs text-muted">What the literature doesn&apos;t support</div>
          </div>
        </Link>

        <Link
          href="/learn/how-we-rate"
          className="p-3.5 rounded-md border border-border bg-surface-2 hover:border-border-strong transition-colors flex items-center justify-between min-h-[48px]"
        >
          <div>
            <div className="text-sm font-semibold text-text font-display">How We Rate Evidence</div>
            <div className="text-xs text-muted">Our 5-tier evaluation rubric</div>
          </div>
        </Link>
      </div>

      {/* Tier Filter Chips with aria-pressed */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted block">
          Filter by Evidence Strength
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Evidence tier filter chips">
          {TIERS.map((tier) => {
            const isSelected = activeTier === tier.id;
            const count =
              tier.id === 'all'
                ? claims.length
                : claims.filter((c) => c.tier === tier.id).length;

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setActiveTier(tier.id)}
                aria-pressed={isSelected}
                className={`min-h-[44px] px-3.5 py-1.5 text-xs rounded-full border font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  isSelected
                    ? 'bg-accent text-on-accent border-accent-edge shadow-elevation font-semibold'
                    : 'bg-surface text-muted border-border hover:text-text hover:bg-surface-2'
                }`}
              >
                {tier.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-3">
        <div className="text-xs text-muted tabular-nums">
          Showing {filteredClaims.length} of {claims.length} registered claims
        </div>

        {filteredClaims.length === 0 ? (
          <div className="p-6 rounded-md border border-border bg-surface space-y-3 text-center">
            <p className="text-sm text-muted">
              No evidence claims registered for the selected tier filter.
            </p>
            <Button
              variant="primary"
              onClick={() => setActiveTier('all')}
              className="text-xs"
            >
              Show all claims
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimList;
