'use client';

import React from 'react';
import Link from 'next/link';
import { Plate } from '@/components/ui/Plate';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { getClaimById } from '@/content/evidence';

export const EvidencePanel: React.FC = () => {
  const claim = getClaimById('noise');

  return (
    <Plate
      as="section"
      tier={claim?.tier}
      meter={claim ? <EvidenceMeter tier={claim.tier} /> : null}
      caption={claim ? claim.outcome : 'Auditory masking'}
      className="text-xs space-y-4"
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-sm font-bold text-text font-display">
          What the science says
        </h2>
        {claim && (
          <Link
            href={`/learn/${claim.id}`}
            className="text-xs font-semibold text-link hover:underline min-h-[44px] inline-flex items-center"
          >
            Read full claim details →
          </Link>
        )}
      </div>

      {claim && (
        <div className="space-y-2">
          <p className="text-muted leading-relaxed">
            <strong className="text-text">Finding:</strong> {claim.summary}
          </p>
          <p className="text-muted italic border-l-2 border-border pl-3 py-0.5">
            <strong className="not-italic text-text">Caveat:</strong> {claim.caveat}
          </p>
        </div>
      )}

      <div className="pt-2 border-t border-border space-y-1">
        <p className="font-semibold text-text text-sm font-display">
          Try it, then test it.
        </p>
        <p className="text-muted leading-relaxed">
          Background noise may aid attention in higher-distraction environments while distracting in quiet spaces. Use the secondary button above to schedule a 10-run self-experiment against silence.
        </p>
      </div>
    </Plate>
  );
};

export default EvidencePanel;
