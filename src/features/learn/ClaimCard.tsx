import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import type { EvidenceClaim } from '@/content/types';

interface ClaimCardProps {
  claim: EvidenceClaim;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim }) => {
  return (
    <Card className="p-4 space-y-3 bg-surface border-border flex flex-col justify-between hover:border-accent/40 transition-colors">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="text-sm font-bold text-text leading-snug">
            {claim.title}
          </h3>
          <EvidenceBadge tier={claim.tier} />
        </div>

        <div className="text-xs text-muted">
          <span className="font-semibold text-text">Target Outcome:</span>{' '}
          {claim.outcome}
        </div>

        <p className="text-xs text-muted line-clamp-3 leading-relaxed">
          {claim.summary}
        </p>
      </div>

      <div className="pt-2 border-t border-border/50">
        <Link
          href={`/learn/${claim.id}`}
          className="text-xs font-semibold text-accent hover:underline inline-flex items-center min-h-[36px]"
        >
          View study details & citations ({claim.refIds.length}) →
        </Link>
      </div>
    </Card>
  );
};
