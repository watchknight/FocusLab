'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { getClaimById } from '@/content/evidence';

export const EvidencePanel: React.FC = () => {
  const claim = getClaimById('noise');

  return (
    <Card className="p-4 sm:p-5 space-y-3 bg-surface-2 border-border text-xs">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-text">What the Science Says</h2>
        {claim && <EvidenceBadge tier={claim.tier} />}
      </div>

      {claim && (
        <div className="space-y-2">
          <p className="text-muted leading-relaxed">
            <strong className="text-text">Finding:</strong> {claim.summary}
          </p>
          <p className="text-muted italic border-l-2 border-border pl-2.5">
            <strong className="not-italic text-text">Caveat:</strong> {claim.caveat}
          </p>
        </div>
      )}

      <div className="pt-2 border-t border-border">
        <p className="font-semibold text-accent text-sm">
          Try it, then test it.
        </p>
        <p className="text-muted mt-0.5">
          Noise may help some people while worsening performance for others. Run a 10-run self-experiment to see what works for your personal attention-task performance.
        </p>
      </div>
    </Card>
  );
};
