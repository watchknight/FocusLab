'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import type { EvidenceClaim, EvidenceTier } from '@/content/types';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { useGSAP, getFx } from '@/lib/gsap';
import type { FlipState } from '@/lib/gsap-flip';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<FlipState | null>(null);
  const flipRef = useRef<typeof import('@/lib/gsap-flip') | null>(null);

  React.useEffect(() => {
    if (getFx() !== 'off') {
      import('@/lib/gsap-flip').then((mod) => {
        flipRef.current = mod;
      });
    }
  }, []);

  const filteredClaims = useMemo(() => {
    if (activeTier === 'all') return claims;
    return claims.filter((c) => c.tier === activeTier);
  }, [claims, activeTier]);

  const handleTierChange = (tier: FilterTier) => {
    if (getFx() !== 'off' && containerRef.current && flipRef.current) {
      flipStateRef.current = flipRef.current.Flip.getState('.claim-card-item');
    }
    setActiveTier(tier);
  };

  const handleReset = () => {
    if (getFx() !== 'off' && containerRef.current && flipRef.current) {
      flipStateRef.current = flipRef.current.Flip.getState('.claim-card-item');
    }
    setActiveTier('all');
  };

  useGSAP(
    () => {
      if (flipStateRef.current && getFx() !== 'off' && flipRef.current) {
        flipRef.current.Flip.from(flipStateRef.current, {
          duration: 0.35,
          ease: 'focus',
          stagger: 0.02,
          absolute: false,
        });
        flipStateRef.current = null;
      }
    },
    { scope: containerRef, dependencies: [filteredClaims] }
  );

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Navigation to sub-sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/learn/myths"
          className="p-4 rounded-sm border border-border bg-surface-2 hover:border-border-strong transition-colors flex items-center justify-between min-h-[48px]"
        >
          <div>
            <div className="text-sm font-bold text-text font-display">Six Popular Myths</div>
            <div className="text-xs text-muted">What the literature doesn&apos;t support</div>
          </div>
        </Link>

        <Link
          href="/learn/how-we-rate"
          className="p-4 rounded-sm border border-border bg-surface-2 hover:border-border-strong transition-colors flex items-center justify-between min-h-[48px]"
        >
          <div>
            <div className="text-sm font-bold text-text font-display">How We Rate Evidence</div>
            <div className="text-xs text-muted">Our 5-tier evaluation rubric</div>
          </div>
        </Link>
      </div>

      {/* Tier Filter Chips with Flip reflow */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted block">
          Filter by evidence strength
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Evidence tier filter chips">
          {TIERS.map((tier) => {
            const isSelected = activeTier === tier.id;
            const count =
              tier.id === 'all'
                ? claims.length
                : claims.filter((c) => c.tier === tier.id).length;

            return (
              <Chip
                key={tier.id}
                selected={isSelected}
                onClick={() => handleTierChange(tier.id)}
              >
                {tier.label} ({count})
              </Chip>
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
          <div className="p-8 rounded-[16px] border border-border bg-surface space-y-4 text-center">
            <p className="text-sm text-muted">
              No evidence claims match the selected tier filter.
            </p>
            <Button
              variant="primary"
              onClick={handleReset}
            >
              Show all claims
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
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
