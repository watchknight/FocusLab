'use client';

import React from 'react';
import Link from 'next/link';
import { HeroLamp } from '@/components/HeroLamp';
import { Plate } from '@/components/ui/Plate';
import { Button } from '@/components/ui/Button';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { OnboardingModal } from '@/features/onboarding';
import { getClaimById } from '@/content/evidence';
import { useT } from '@/i18n';

const TIER_ROWS = [
  {
    tier: 'strong' as const,
    desc: 'Consistent findings across several randomized controlled trials (RCTs) or meta-analyses for the specific named outcome.',
  },
  {
    tier: 'moderate' as const,
    desc: 'Several controlled studies or meta-analyses showing small-to-moderate effect sizes.',
  },
  {
    tier: 'mixed' as const,
    desc: 'Conflicting trial results across research teams, or outcomes that strongly depend on individual differences.',
  },
  {
    tier: 'emerging' as const,
    desc: 'Few or small-scale studies, pilot investigations, or self-reported observational surveys.',
  },
  {
    tier: 'not-supported' as const,
    desc: 'Well-tested interventions where rigorous trials fail to demonstrate the claimed benefit.',
  },
];

export const HomeContent: React.FC = () => {
  const { t } = useT();
  const breathworkClaim = getClaimById('breathwork-mood');

  const faqItems = [
    { q: t('home.faq1Q'), a: t('home.faq1A') },
    { q: t('home.faq2Q'), a: t('home.faq2A') },
    { q: t('home.faq3Q'), a: t('home.faq3A') },
    { q: t('home.faq4Q'), a: t('home.faq4A') },
    { q: t('home.faq5Q'), a: t('home.faq5A') },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 py-2 sm:py-4">
      <OnboardingModal />

      {/* 1. Hero: Cyanotype & Lamp focal area */}
      <HeroLamp />

      {/* 2. How it works: ONE wide Plate split into three columns by 1px rules */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-text">How it works</h2>
        <Plate as="div" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Step 1: Check */}
            <div className="p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="block font-display font-extrabold text-3xl sm:text-4xl text-accent tabular-nums">
                  1
                </span>
                <h3 className="text-base sm:text-lg font-bold text-text">Check</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Take an informal 3-minute reaction test in your browser to spot lapses in alertness.
                  Repeating it over days builds your personal baseline on your own hardware.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/check"
                  className="text-sm font-semibold text-link underline hover:text-text min-h-[44px] inline-flex items-center"
                >
                  Take the Check
                </Link>
              </div>
            </div>

            {/* Step 2: Practice */}
            <div className="p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="block font-display font-extrabold text-3xl sm:text-4xl text-accent tabular-nums">
                  2
                </span>
                <h3 className="text-base sm:text-lg font-bold text-text">Practice</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Try short focus sessions, breathwork, or deliberate rest blocks.
                  Every activity clearly lists what outcome it is evidenced for, from mood to sustained attention.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/activities"
                  className="text-sm font-semibold text-link underline hover:text-text min-h-[44px] inline-flex items-center"
                >
                  Browse activities
                </Link>
              </div>
            </div>

            {/* Step 3: Compare */}
            <div className="p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="block font-display font-extrabold text-3xl sm:text-4xl text-accent tabular-nums">
                  3
                </span>
                <h3 className="text-base sm:text-lg font-bold text-text">Compare</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Run simple self-directed tests to see what actually works for your own workday.
                  Compare an active technique against quiet rest using your measured reaction times.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/experiments"
                  className="text-sm font-semibold text-link underline hover:text-text min-h-[44px] inline-flex items-center"
                >
                  Run an experiment
                </Link>
              </div>
            </div>
          </div>
        </Plate>
      </section>

      {/* 3. Evidence section: 5 tiers + real claim Plate */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-text">
            Every tip shows how strong its evidence is.
          </h2>
          <p className="text-sm text-muted">
            We rate claims strictly for the specific outcome measured in randomized trials.
          </p>
        </div>

        {/* Five tiers rubric in order */}
        <div className="rounded-md border border-border bg-surface-2 p-5 sm:p-6 space-y-3.5 shadow-elevation">
          {TIER_ROWS.map((row) => (
            <div
              key={row.tier}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4 py-2 border-b border-border/60 last:border-b-0"
            >
              <div className="w-40 shrink-0">
                <EvidenceMeter tier={row.tier} />
              </div>
              <p className="text-sm text-muted leading-relaxed flex-1">
                {row.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Real breathwork-mood claim Plate (demonstrates what we do NOT claim) */}
        {breathworkClaim && (
          <Plate
            tier={breathworkClaim.tier}
            caption={
              <Link
                href={`/learn/${breathworkClaim.id}`}
                className="text-xs font-semibold text-link underline hover:text-text inline-flex items-center min-h-[32px]"
              >
                View scientific reference
              </Link>
            }
          >
            <div className="space-y-2">
              <h3 className="text-base font-bold text-text">
                {breathworkClaim.title}
              </h3>
              <p className="text-xs font-semibold text-muted">
                Outcome: {breathworkClaim.outcome}
              </p>
              <p className="text-sm text-text leading-relaxed">
                {breathworkClaim.summary}
              </p>
              <p className="text-xs text-muted border-t border-border/60 pt-2 leading-relaxed">
                <strong>Caveat:</strong> {breathworkClaim.caveat}
              </p>
            </div>
          </Plate>
        )}
      </section>

      {/* 4. FAQ with native <details> */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-text">{t('home.faqTitle')}</h2>
          <p className="text-sm text-muted">{t('home.faqSubtitle')}</p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-md border border-border bg-surface p-4 text-text transition-colors"
            >
              <summary className="cursor-pointer font-semibold text-text flex items-center justify-between min-h-[44px] select-none list-none focus-visible:outline-2 focus-visible:outline-ring">
                <span className="text-sm sm:text-base pr-3">{item.q}</span>
                <span
                  aria-hidden="true"
                  className="text-muted shrink-0 text-base font-bold transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2.5 text-sm text-muted leading-relaxed max-w-prose">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 5. Closing band with primary button */}
      <section className="rounded-md border border-border bg-surface-2 p-6 sm:p-8 text-center space-y-4 shadow-elevation">
        <div className="space-y-1.5 max-w-reading mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-text">
            Build focus you can measure.
          </h2>
          <p className="text-sm text-muted">
            Three minutes. Zero accounts. All data stays right in your browser.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/check">
            <Button
              variant="primary"
              className="px-6 py-3 min-h-[44px] text-sm font-semibold"
            >
              {t('home.ctaCheck')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;
