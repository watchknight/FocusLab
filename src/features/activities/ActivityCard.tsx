'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { Activity } from '@/content/types';
import { getClaimById } from '@/content/evidence';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const claim = getClaimById(activity.evidenceId);

  return (
    <Link
      href={`/activities/${activity.id}`}
      className="block group focus-visible:outline-2 focus-visible:outline-accent rounded-lg"
    >
      <Card className="h-full p-4 flex flex-col justify-between transition-colors group-hover:border-accent/60">
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-text group-hover:text-accent transition-colors">
              {activity.name}
            </h3>
            {claim && <EvidenceBadge tier={claim.tier} />}
          </div>

          {claim && (
            <p className="text-xs text-muted">
              Evidenced for <span className="font-semibold text-text">{claim.outcome}</span>
            </p>
          )}

          <p className="text-xs text-muted line-clamp-2">
            {activity.whenToUse}
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-1.5 items-center">
          {activity.durationOptionsSec.map((sec) => (
            <span
              key={sec}
              className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-surface border border-border text-text"
            >
              {sec < 60 ? `${sec}s` : `${Math.round(sec / 60)}m`}
            </span>
          ))}
        </div>
      </Card>
    </Link>
  );
};
