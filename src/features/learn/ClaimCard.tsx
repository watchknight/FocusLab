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
      caption={claim.outcome}
      className="h-full flex flex-col justify-between hover:border-accent transition-colors"
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h2 className="text-base font-bold text-text font-display leading-snug">
            {claim.title}
          </h2>
          <EvidenceMeter tier={claim.tier} showLabel={false} />
        </div>

        {/* One-sentence outcome */}
        <div className="text-sm text-text">
          <span className="font-semibold text-muted">Target outcome: </span>
          <span className="font-medium text-text">{claim.outcome}</span>
        </div>

        <p className="text-base text-muted line-clamp-2 leading-relaxed">
          {claim.summary}
        </p>
      </div>

      <div className="pt-3">
        <Link
          href={`/learn/${claim.id}`}
          className="text-sm font-semibold text-link hover:underline inline-flex items-center min-h-[44px]"
        >
          View study details and citations ({claim.refIds.length})
        </Link>
      </div>
    </Plate>
  );
};

export default ClaimCard;
