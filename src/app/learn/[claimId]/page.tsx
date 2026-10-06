import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CLAIMS, getClaimById, getReferenceById } from '@/content/evidence';
import { ACTIVITIES } from '@/content/activities';
import { Card } from '@/components/ui/Card';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';

interface Props {
  params: {
    claimId: string;
  };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CLAIMS.map((claim) => ({
    claimId: claim.id,
  }));
}


export function generateMetadata({ params }: Props): Metadata {
  const claim = getClaimById(params.claimId);
  if (!claim) {
    return { title: 'Evidence Claim | FocusLab' };
  }
  return {
    title: `${claim.title} | Evidence Bank`,
    description: claim.summary,
    openGraph: {
      title: `${claim.title} | FocusLab Evidence`,
      description: claim.summary,
    },
  };
}

export default function ClaimDetailPage({ params }: Props) {
  const claim = getClaimById(params.claimId);

  if (!claim) {
    notFound();
  }

  const references = claim.refIds
    .map((id) => getReferenceById(id))
    .filter(Boolean);

  const linkedActivities = ACTIVITIES.filter((a) => a.evidenceId === claim.id);

  return (
    <article className="space-y-6 py-2 max-w-[720px] mx-auto">
      <div>
        <Link
          href="/learn"
          className="text-xs font-semibold text-link hover:underline inline-flex items-center min-h-[44px]"
        >
          ← Back to Evidence Bank
        </Link>
      </div>

      {/* 1. Meter and outcome first */}
      <div className="space-y-3 p-4 sm:p-5 rounded-md border border-border bg-surface-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <EvidenceMeter tier={claim.tier} />
        </div>

        <div className="text-sm text-muted">
          <strong className="text-text">Measured Target Outcome:</strong>{' '}
          <span className="font-medium text-text">{claim.outcome}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text font-display">
          {claim.title}
        </h1>
      </div>

      {/* 2. Summary */}
      <Card className="p-4 sm:p-5 space-y-2 bg-surface-2 border-border">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wide">
          Plain-language summary
        </h2>
        <p className="text-sm sm:text-base text-text leading-relaxed">
          {claim.summary}
        </p>
      </Card>

      {/* 3. Caveat */}
      <Card className="p-4 sm:p-5 space-y-2 bg-surface border-border">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wide">
          Caveats & Study Limitations
        </h2>
        <p className="text-sm sm:text-base text-text leading-relaxed">
          {claim.caveat}
        </p>
      </Card>

      {/* 4. References */}
      <div className="space-y-3 pt-1">
        <h2 className="text-lg font-bold text-text font-display">
          Citations & Primary Sources ({references.length})
        </h2>
        <div className="space-y-2.5">
          {references.map((ref) => {
            if (!ref) return null;
            return (
              <Card key={ref.id} className="p-4 space-y-2 bg-surface border-border">
                <p className="text-xs sm:text-sm text-text leading-relaxed">
                  {ref.citation}
                </p>
                {ref.link && (
                  <div>
                    <a
                      href={ref.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-link hover:underline inline-flex items-center gap-1 min-h-[44px]"
                    >
                      <span>Open publication (DOI / PMC)</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* 5. Related activity link */}
      {linkedActivities.length > 0 && (
        <Card className="p-4 sm:p-5 space-y-3 bg-surface border-border">
          <h2 className="text-sm font-bold text-text font-display">
            Related Activities in FocusLab
          </h2>
          <div className="divide-y divide-border">
            {linkedActivities.map((act) => (
              <div
                key={act.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div>
                  <div className="text-sm font-bold text-text">{act.name}</div>
                  <div className="text-xs text-muted">{act.whenToUse}</div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/activities/${act.id}`}
                    className="text-xs font-semibold text-link hover:underline min-h-[44px] inline-flex items-center"
                  >
                    Practice activity
                  </Link>
                  <span className="text-muted self-center" aria-hidden="true">·</span>
                  <Link
                    href={`/experiments?activity=${act.id}`}
                    className="text-xs font-semibold text-link hover:underline min-h-[44px] inline-flex items-center"
                  >
                    Test protocol
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </article>
  );
}
