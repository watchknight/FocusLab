import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CLAIMS, getClaimById, getReferenceById } from '@/content/evidence';
import { ACTIVITIES } from '@/content/activities';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { Plate } from '@/components/ui/Plate';

interface Props {
  params: Promise<{
    claimId: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CLAIMS.map((claim) => ({
    claimId: claim.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { claimId } = await params;
  const claim = getClaimById(claimId);
  if (!claim) {
    return { title: 'Evidence Claim' };
  }
  return {
    title: claim.title,
    description: claim.summary,
    openGraph: {
      title: `${claim.title} | FocusLab Evidence`,
      description: claim.summary,
    },
  };
}

export default async function ClaimDetailPage({ params }: Props) {
  const { claimId } = await params;
  const claim = getClaimById(claimId);

  if (!claim) {
    notFound();
  }

  const references = claim.refIds
    .map((id) => getReferenceById(id))
    .filter(Boolean);

  const linkedActivities = ACTIVITIES.filter((a) => a.evidenceId === claim.id);

  return (
    <div className="py-6 sm:py-8 lg:py-10 xl:grid xl:grid-cols-[minmax(0,720px)_280px] xl:gap-12 xl:justify-center">
      {/* Main article content at reading width (720px) */}
      <article className="space-y-8 min-w-0 max-w-[720px] mx-auto xl:mx-0">
        <div>
          <Link
            href="/learn"
            className="text-xs font-semibold text-muted hover:text-text transition-colors inline-flex items-center min-h-[44px]"
          >
            Back to Evidence Bank
          </Link>
        </div>

        {/* 1. Meter and outcome first, with display-size title */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <EvidenceMeter tier={claim.tier} />
            <span className="text-sm font-medium text-text">
              Target outcome: {claim.outcome}
            </span>
          </div>

          <h1 className="font-display font-[780] text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] text-text text-balance">
            {claim.title}
          </h1>
        </div>

        {/* 2. Core Plate with summary and caveat */}
        <Plate
          as="section"
          tier={claim.tier}
          meter={<EvidenceMeter tier={claim.tier} />}
          caption={`Measured outcome: ${claim.outcome}`}
          className="space-y-4"
        >
          <div className="space-y-2">
            <h2 className="text-base font-bold text-text font-display">
              Plain-language summary
            </h2>
            <p className="text-base text-text leading-relaxed">
              {claim.summary}
            </p>
          </div>

          <div className="p-4 rounded-sm bg-surface-2 border border-border text-xs text-muted space-y-1">
            <strong className="text-text block font-semibold text-xs">
              Caveats & study limitations:
            </strong>
            <p className="italic leading-relaxed">{claim.caveat}</p>
          </div>
        </Plate>

        {/* 3. Citations & primary sources */}
        <section className="space-y-3 pt-2" aria-label="Citations and primary sources">
          <h2 className="text-lg font-bold text-text font-display">
            Citations & primary sources ({references.length})
          </h2>
          <div className="border-y border-border divide-y divide-border">
            {references.map((ref) => {
              if (!ref) return null;
              return (
                <div key={ref.id} className="py-4 space-y-1.5">
                  <p className="text-xs sm:text-sm text-text leading-relaxed">
                    {ref.citation}
                  </p>
                  {ref.link && (
                    <div>
                      <a
                        href={ref.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-text hover:underline inline-flex items-center min-h-[44px]"
                      >
                        Open publication (DOI / PubMed)
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Related activities in FocusLab */}
        {linkedActivities.length > 0 && (
          <section className="space-y-3 pt-2" aria-label="Related activities">
            <h2 className="text-base font-bold text-text font-display">
              Related practices in FocusLab
            </h2>
            <div className="border-y border-border divide-y divide-border">
              {linkedActivities.map((act) => (
                <div
                  key={act.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-bold text-text">{act.name}</div>
                    <div className="text-xs text-muted">{act.whenToUse}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/activities/${act.id}`}
                      className="text-xs font-semibold text-text hover:underline min-h-[44px] inline-flex items-center"
                    >
                      Practice activity
                    </Link>
                    <Link
                      href={`/experiments?activity=${act.id}`}
                      className="text-xs font-semibold text-text hover:underline min-h-[44px] inline-flex items-center"
                    >
                      Test in experiment
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Side notes rail at 1280px and up (xl:) */}
      <aside className="hidden xl:block space-y-6 pt-12 sticky top-20 self-start text-xs border-l border-border pl-6">
        <div className="space-y-1.5">
          <span className="font-semibold text-text block text-xs">
            Replication tier
          </span>
          <EvidenceMeter tier={claim.tier} />
          <p className="text-muted leading-relaxed pt-1">
            Graded against empirical pre-registered trials and meta-analytic evidence.
          </p>
        </div>

        <div className="space-y-1.5 pt-4 border-t border-border">
          <span className="font-semibold text-text block text-xs">
            Target outcome
          </span>
          <p className="text-text font-medium leading-relaxed">
            {claim.outcome}
          </p>
          <p className="text-muted leading-relaxed">
            Claims name specific cognitive or physiological outcomes rather than broad promises.
          </p>
        </div>

        <div className="space-y-1.5 pt-4 border-t border-border">
          <span className="font-semibold text-text block text-xs">
            Citation count
          </span>
          <p className="font-mono tabular-nums text-text font-bold text-sm">
            {references.length} peer-reviewed source{references.length === 1 ? '' : 's'}
          </p>
          <p className="text-muted leading-relaxed">
            All citations derive from controlled trials with measurable focus or reaction metrics.
          </p>
        </div>

        {linkedActivities.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-border">
            <span className="font-semibold text-text block text-xs">
              Self-experiment
            </span>
            <p className="text-muted leading-relaxed">
              Test whether this effect holds for your own cognitive baseline.
            </p>
            <Link
              href={`/experiments?activity=${linkedActivities[0].id}`}
              className="text-xs font-semibold text-text hover:underline block"
            >
              Start 10-run protocol
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
