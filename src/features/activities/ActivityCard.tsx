'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Plate } from '@/components/ui/Plate';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { Activity } from '@/content/types';
import { getClaimById } from '@/content/evidence';

interface ActivityCardProps {
  activity: Activity;
  className?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, className }) => {
  const claim = getClaimById(activity.evidenceId);

  return (
    <Link
      href={`/activities/${activity.id}`}
      className={clsx(
        'block group focus-visible:outline-2 focus-visible:outline-ring rounded-[16px] h-full focus-visible:outline-offset-2',
        className
      )}
    >
      <Plate
        tier={claim?.tier}
        caption={claim?.outcome ? `Outcome: ${claim.outcome}` : activity.whenToUse}
        meter={claim ? <EvidenceMeter tier={claim.tier} /> : null}
        className="h-full transition-colors duration-150 group-hover:border-border-strong"
      >
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-display text-text leading-snug">
            {activity.name}
          </h3>

          <p className="text-sm text-muted line-clamp-2 leading-relaxed">
            {activity.whenToUse}
          </p>

          <div className="pt-1 flex flex-wrap gap-1.5 items-center">
            {activity.durationOptionsSec.map((sec) => (
              <span
                key={sec}
                className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-surface-2 border border-border text-text tabular-nums"
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

export default ActivityCard;
