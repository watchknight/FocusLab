'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { EvidenceClaim, EvidenceTier } from '@/content/types';
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
          className="p-3.5 rounded-lg border border-border bg-surface-2 hover:border-accent/40 transition-colors flex items-center justify-between min-h-[48px]"
        >
          <div>
            <div className="text-sm font-semibold text-text">Six Popular Myths</div>
            <div className="text-xs text-muted">What the literature doesn&apos;t support</div>
          </div>
          <span className="text-accent text-sm font-bold ml-2">→</span>
        </Link>

        <Link
          href="/learn/how-we-rate"
          className="p-3.5 rounded-lg border border-border bg-surface-2 hover:border-accent/40 transition-colors flex items-center justify-between min-h-[48px]"
        >
          <div>
            <div className="text-sm font-semibold text-text">How We Rate Evidence</div>
            <div className="text-xs text-muted">Our 5-tier evaluation rubric</div>
          </div>
          <span className="text-accent text-sm font-bold ml-2">→</span>
        </Link>
      </div>

      {/* Tier Filter Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider block">
          Filter by Evidence Strength
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Evidence tier filter">
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
                className={`min-h-[44px] px-3 py-1.5 text-xs rounded-md border font-medium transition-colors ${
                  isSelected
                    ? 'bg-surface-2 text-accent border-accent'
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
        <div className="text-xs text-muted">
          Showing {filteredClaims.length} of {claims.length} registered claims
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      </div>
    </div>
  );
};
