'use client';

import React from 'react';
import Link from 'next/link';
import { Plate } from '@/components/ui/Plate';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import type { EvidenceClaim } from '@/content/types';

interface ClaimCardProps {
  claim: EvidenceClaim;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim }) => {
  return (
    <Plate
      as="article"
      tier={claim.tier}
      meter={<EvidenceMeter tier={claim.tier} />}
      caption={`Target outcome: ${claim.outcome}`}
      className="claim-card-item h-full flex flex-col justify-between hover:border-border-strong transition-colors duration-150"
    >
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-text font-display leading-snug">
          {claim.title}
        </h2>

        <div className="text-sm text-text">
          <span className="font-semibold text-muted">Target outcome: </span>
          <span className="font-medium text-text">{claim.outcome}</span>
        </div>

        <p className="text-sm sm:text-base text-muted line-clamp-2 leading-relaxed">
          {claim.summary}
        </p>
      </div>

      <div className="pt-3 border-t border-border mt-3">
        <Link
          href={`/learn/${claim.id}`}
          className="text-xs font-semibold text-text hover:underline inline-flex items-center min-h-[44px] transition-colors"
        >
          View study details and citations ({claim.refIds.length})
        </Link>
      </div>
    </Plate>
  );
};

export default ClaimCard;
