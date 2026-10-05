import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CLAIMS, getClaimById, getReferenceById } from '@/content/evidence';
import { ACTIVITIES } from '@/content/activities';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { Card } from '@/components/ui/Card';

interface ClaimPageProps {
  params: {
    claimId: string;
  };
}

export function generateStaticParams() {
  return CLAIMS.map((claim) => ({
    claimId: claim.id,
  }));
}

export function generateMetadata({ params }: ClaimPageProps): Metadata {
  const claim = getClaimById(params.claimId);
  if (!claim) return { title: 'Claim Not Found | FocusLab' };
  return {
    title: `${claim.title} | FocusLab Evidence`,
    description: claim.summary,
    openGraph: {
      title: `${claim.title} | FocusLab Evidence`,
      description: claim.summary,
    },
  };
}

export default function ClaimDetailPage({ params }: ClaimPageProps) {
  const claim = getClaimById(params.claimId);

  if (!claim) {
    notFound();
  }

  const references = claim.refIds
    .map((id) => getReferenceById(id))
    .filter(Boolean);

  const linkedActivities = ACTIVITIES.filter((a) => a.evidenceId === claim.id);

  return (
    <article className="space-y-6 py-2">
      <div>
        <Link
          href="/learn"
          className="text-xs font-semibold text-accent hover:underline inline-flex items-center min-h-[32px]"
        >
          ← Back to Evidence Bank
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight text-text">
            {claim.title}
          </h1>
          <EvidenceBadge tier={claim.tier} />
        </div>

        <div className="text-sm text-muted">
          <strong className="text-text">Measured Target Outcome:</strong>{' '}
          <span className="font-medium text-text">{claim.outcome}</span>
        </div>
      </div>

      {/* Summary */}
      <Card className="p-4 space-y-2 bg-surface-2 border-border">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wider">
          Plain-Language Summary
        </h2>
        <p className="text-sm text-text leading-relaxed">{claim.summary}</p>
      </Card>

      {/* Caveat */}
      <Card className="p-4 space-y-2 bg-surface border-border">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wider">
          Caveats & Study Limitations
        </h2>
        <p className="text-xs text-text leading-relaxed">{claim.caveat}</p>
      </Card>

      {/* Related Interactive Tools if any */}
      {linkedActivities.length > 0 && (
        <Card className="p-4 space-y-3 bg-surface border-border">
          <h2 className="text-xs font-bold text-muted uppercase tracking-wider">
            Related Activities in FocusLab
          </h2>
          <div className="space-y-2">
            {linkedActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-border/40 first:border-0 first:pt-0"
              >
                <div>
                  <div className="text-xs font-semibold text-text">{act.name}</div>
                  <div className="text-[11px] text-muted">{act.whenToUse}</div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/activities/${act.id}`}
                    className="text-xs text-accent hover:underline min-h-[32px] inline-flex items-center"
                  >
                    Practice →
                  </Link>
                  <Link
                    href={`/experiments?activity=${act.id}`}
                    className="text-xs text-accent hover:underline min-h-[32px] inline-flex items-center"
                  >
                    Test Protocol →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Peer-Reviewed References */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm font-bold text-text">
          Citations & Primary Sources ({references.length})
        </h2>
        <div className="space-y-2.5">
          {references.map((ref) => {
            if (!ref) return null;
            return (
              <Card key={ref.id} className="p-3.5 space-y-1.5 bg-surface border-border">
                <p className="text-xs text-text leading-relaxed">{ref.citation}</p>
                {ref.link && (
                  <div>
                    <a
                      href={ref.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1 min-h-[32px]"
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
    </article>
  );
}
