'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plate } from '@/components/ui/Plate';
import { Chip } from '@/components/ui/Chip';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { Activity } from '@/content/types';
import { getClaimById, getReferenceById } from '@/content/evidence';
import { ActivityPlayer } from './players/ActivityPlayer';

interface ActivityDetailProps {
  activity: Activity;
}

export const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity }) => {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState<number>(
    activity.durationOptionsSec[0] || 180
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRefs, setShowRefs] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('play') === '1') {
        setIsPlaying(true);
      }
    }
  }, []);

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
    <article className="space-y-8 max-w-[720px] mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/activities"
          className="text-xs font-semibold text-muted hover:text-text inline-flex items-center min-h-[44px] transition-colors"
        >
          Back to activities
        </Link>
      </div>

      {/* 1. Display-size title */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text font-display leading-[0.95]">
          {activity.name}
        </h1>

        {/* 2. Meter and outcome first */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {claim && <EvidenceMeter tier={claim.tier} />}
          <span className="text-sm font-medium text-text">
            {claim?.outcome ? `Outcome: ${claim.outcome}` : activity.whenToUse}
          </span>
        </div>

        <p className="text-sm text-muted pt-1 leading-relaxed">
          {activity.whenToUse}
        </p>
      </div>

      {/* 3. Steps */}
      <Card className="p-5 sm:p-6 space-y-4 bg-surface border-border">
        <h2 className="text-base font-bold text-text font-display">
          How to do it
        </h2>
        <ol className="space-y-3 text-sm text-text list-decimal list-inside">
          {activity.steps.map((step, idx) => (
            <li key={idx} className="leading-relaxed">
              <span className="text-text">{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* 4. The science Plate */}
      {claim && (
        <Plate
          as="section"
          tier={claim.tier}
          meter={<EvidenceMeter tier={claim.tier} />}
          caption={claim.outcome}
          className="space-y-4"
        >
          <div className="space-y-3">
            <h2 className="text-base font-bold text-text font-display">
              What the science says
            </h2>
            <p className="text-sm text-text leading-relaxed">
              {claim.summary}
            </p>
            <div className="p-3.5 rounded-sm bg-surface-2 border border-border text-xs text-muted space-y-1">
              <strong className="text-text block font-semibold">Caveat & limitations:</strong>
              <p className="italic leading-relaxed">{claim.caveat}</p>
            </div>
          </div>

          {references.length > 0 && (
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowRefs(!showRefs)}
                className="text-xs font-semibold text-text hover:underline min-h-[44px] inline-flex items-center"
              >
                {showRefs ? 'Hide citations' : `View citations (${references.length})`}
              </button>
              {showRefs && (
                <ul className="mt-2 space-y-2 text-xs text-muted bg-surface-2 p-3 rounded-sm border border-border">
                  {references.map((r) =>
                    r ? (
                      <li key={r.id} className="leading-relaxed">
                        • {r.citation}
                        {r.link && (
                          <a
                            href={r.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-text underline"
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
        </Plate>
      )}

      {/* 5. Cautions */}
      {activity.cautions && activity.cautions.length > 0 && (
        <Card className="p-4 sm:p-5 space-y-2 border-tier-not-supported/40 bg-surface-2">
          <h2 className="text-sm font-bold text-tier-not-supported uppercase tracking-wider">
            Cautions
          </h2>
          <ul className="space-y-1.5 text-xs text-muted list-disc list-inside">
            {activity.cautions.map((caution, idx) => (
              <li key={idx} className="leading-relaxed">{caution}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* 6. Start & 7. "Test this activity" */}
      <Card className="p-5 sm:p-6 space-y-5 bg-surface border-border">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted block uppercase tracking-wider">
            Select duration
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Duration selection">
            {activity.durationOptionsSec.map((sec) => (
              <Chip
                key={sec}
                selected={selectedDuration === sec}
                onClick={() => setSelectedDuration(sec)}
              >
                {sec < 60 ? `${sec} seconds` : `${Math.round(sec / 60)} minutes`}
              </Chip>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setIsPlaying(true)}
            className="w-full sm:w-auto"
          >
            Start activity
          </Button>

          <Button
            variant="secondary"
            onClick={() => router.push(`/experiments?activity=${activity.id}`)}
            className="w-full sm:w-auto text-xs"
          >
            Test this activity
          </Button>
        </div>
      </Card>
    </article>
  );
};

export default ActivityDetail;
