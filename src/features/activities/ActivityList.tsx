import React from 'react';
import Link from 'next/link';
import { ACTIVITIES } from '@/content/activities';
import { getEvidenceById } from '@/content/evidence';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { Card } from '@/components/ui/Card';

export const ActivityList: React.FC = () => {
  return (
    <div className="space-y-4">
      {ACTIVITIES.map((activity) => {
        const evidence = getEvidenceById(activity.evidenceId);
        return (
          <Card key={activity.id} as="article" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-content-primary">
                {activity.title}
              </h2>
              {evidence && <EvidenceBadge level={evidence.level} />}
            </div>

            <p className="text-xs text-content-secondary">
              {activity.shortDescription}
            </p>

            {evidence && (
              <div className="text-xs text-content-muted bg-surface-primary p-2.5 rounded border border-surface-border space-y-1">
                <p>
                  <strong>Measured Outcome:</strong>{' '}
                  {evidence.primaryOutcomes.join(', ')}
                </p>
                <p>
                  <strong>Citation:</strong> {evidence.sources[0]?.citation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-content-muted">
                Duration: {Math.round(activity.durationSeconds / 60)} min
              </span>
              <Link
                href={`/practice/${activity.id}`}
                className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-semibold rounded-md bg-teal-accent text-white hover:bg-teal-accent-hover inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-teal-accent"
              >
                Begin Activity
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
