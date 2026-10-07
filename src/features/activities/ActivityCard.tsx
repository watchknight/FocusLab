'use client';

import React from 'react';
import Link from 'next/link';
import { Plate } from '@/components/ui/Plate';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
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
      className="block group focus-visible:outline-2 focus-visible:outline-ring rounded-md h-full"
    >
      <Plate
        tier={claim?.tier}
        caption={claim ? `Outcome: ${claim.outcome}` : undefined}
        meter={claim ? <EvidenceMeter tier={claim.tier} /> : null}
        className="h-full transition-colors group-hover:border-accent"
      >
        <div className="space-y-2.5">
          <h3 className="text-base font-bold text-text group-hover:text-accent transition-colors">
            {activity.name}
          </h3>

          <p className="text-sm text-muted line-clamp-2">
            {activity.whenToUse}
          </p>

          <div className="pt-2 flex flex-wrap gap-1.5 items-center">
            {activity.durationOptionsSec.map((sec) => (
              <span
                key={sec}
                className="text-xs font-mono font-medium px-2 py-0.5 rounded-xs bg-surface border border-border text-text tabular-nums"
              >
                {sec < 60 ? `${sec}s` : `${Math.round(sec / 60)}m`}
              </span>
            ))}
          </div>
        </div>
      </Plate>
    </Link>
  );
};
