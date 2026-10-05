'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { getClaimById } from '@/content/evidence';

interface IntroViewProps {
  onStartRatings: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ onStartRatings }) => {
  const claim = getClaimById('pvt-check');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-text">Focus Check</h1>
          {claim && <EvidenceBadge tier={claim.tier} />}
        </div>
        <p className="text-sm text-muted">
          A 3-minute reaction-time check measuring sustained alertness and lapses. Find a quiet place without distractions. Use the same device and browser each time for consistent timing. Compare results only with yourself, not others. This is an informal self-tracking tool, not a medical test.
        </p>
      </div>

      {claim && (
        <Card className="space-y-2 border-border bg-surface-2 text-xs">
          <p className="font-semibold text-text">{claim.title}</p>
          <p className="text-muted">{claim.summary}</p>
          <p className="text-muted italic">{claim.caveat}</p>
        </Card>
      )}

      <div className="pt-2">
        <Button variant="primary" onClick={onStartRatings} className="w-full sm:w-auto">
          Continue to Pre-Ratings
        </Button>
      </div>
    </div>
  );
};
