'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { Activity } from '@/content/types';
import { getClaimById, getReferenceById } from '@/content/evidence';
import { ActivityPlayer } from './players/ActivityPlayer';

interface ActivityDetailProps {
  activity: Activity;
}

export const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity }) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(
    activity.durationOptionsSec[0] || 180
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRefs, setShowRefs] = useState(false);

  const claim = getClaimById(activity.evidenceId);
  const references = claim
    ? claim.refIds.map((id) => getReferenceById(id)).filter(Boolean)
    : [];

  if (isPlaying) {
    return (
      <ActivityPlayer
        activity={activity}
        durationSec={selectedDuration}
        onClose={() => setIsPlaying(false)}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-prose mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href="/activities"
          className="text-xs text-muted hover:text-text inline-flex items-center gap-1 min-h-[44px]"
        >
          Back to activities
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
            {activity.name}
          </h1>
          {claim && <EvidenceMeter tier={claim.tier} />}
        </div>
        <p className="text-sm text-muted">{activity.whenToUse}</p>
      </div>

      {/* How to do it */}
      <Card className="p-4 sm:p-5 space-y-3">
        <h2 className="text-base font-bold text-text">How to do it</h2>
        <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
          {activity.steps.map((step, idx) => (
            <li key={idx} className="leading-relaxed">
              <span className="text-text">{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* What the science says */}
      {claim && (
        <Card className="p-4 sm:p-5 space-y-3 bg-surface-2 border-border">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-text">What the science says</h2>
            <EvidenceMeter tier={claim.tier} />
          </div>

          <div className="text-xs space-y-2">
            <p>
              <strong className="text-text">Measured Outcome:</strong>{' '}
              <span className="text-muted">{claim.outcome}</span>
            </p>
            <p className="text-muted leading-relaxed">{claim.summary}</p>
            <p className="text-muted italic border-l-2 border-border pl-2.5">
              <strong className="not-italic text-text">Caveat:</strong> {claim.caveat}
            </p>
          </div>

          {references.length > 0 && (
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowRefs(!showRefs)}
                className="text-xs font-semibold text-link hover:underline min-h-[44px] inline-flex items-center"
              >
                {showRefs ? 'Hide citations' : `View citations (${references.length})`}
              </button>
              {showRefs && (
                <ul className="mt-2 space-y-2 text-xs text-muted bg-surface p-3 rounded-xs border border-border">
                  {references.map((r) =>
                    r ? (
                      <li key={r.id} className="leading-relaxed">
                        • {r.citation}
                        {r.link && (
                          <a
                            href={r.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-link underline"
                          >
                            [Link]
                          </a>
                        )}
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Cautions */}
      {activity.cautions && activity.cautions.length > 0 && (
        <Card className="p-4 space-y-2 border-tier-not-supported/40 bg-surface-2">
          <h2 className="text-sm font-bold text-tier-not-supported">Cautions</h2>
          <ul className="space-y-1 text-xs text-muted list-disc list-inside">
            {activity.cautions.map((caution, idx) => (
              <li key={idx}>{caution}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Duration Picker and Launch Action */}
      <Card className="p-4 sm:p-5 space-y-4">
        <span className="text-xs font-semibold text-text block">
          Select duration
        </span>
        <div className="flex flex-wrap gap-2">
          {activity.durationOptionsSec.map((sec) => (
            <button
              type="button"
              key={sec}
              onClick={() => setSelectedDuration(sec)}
              className={`min-h-[44px] px-4 py-2 text-sm font-semibold rounded-sm border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] motion-reduce:active:scale-100 ${
                selectedDuration === sec
                  ? 'bg-accent border-2 border-accent-edge text-on-accent shadow-elevation'
                  : 'bg-surface-2 border-border text-text hover:bg-surface'
              }`}
            >
              {sec < 60 ? `${sec} seconds` : `${Math.round(sec / 60)} minutes`}
            </button>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setIsPlaying(true)}
            className="w-full sm:w-auto"
          >
            Start activity
          </Button>

          <Link
            href={`/experiments?activity=${activity.id}`}
            className="text-xs font-semibold text-link hover:underline min-h-[44px] inline-flex items-center"
          >
            Test this activity in an experiment
          </Link>
        </div>
      </Card>
    </div>
  );
};
