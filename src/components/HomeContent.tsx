'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { HeroLamp } from '@/components/HeroLamp';
import { Plate } from '@/components/ui/Plate';
import { Button } from '@/components/ui/Button';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { getClaimById } from '@/content/evidence';
import { useT } from '@/i18n';

const OnboardingModal = dynamic(
  () => import('@/features/onboarding').then((mod) => mod.OnboardingModal),
  { ssr: false }
);


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
      {/* 2. How it works: Open 3-column editorial layout split by 1px rules */}
      <section className="space-y-6 pt-2">
        <h2 className="text-xl sm:text-2xl font-bold text-text">{t('home.loopTitle')}</h2>
        <div className="border-y border-border py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              {
                num: '1',
                title: t('home.loop1Title'),
                desc: t('home.loop1Desc'),
                cta: t('home.loop1Cta'),
                href: '/check',
              },
              {
                num: '2',
                title: t('home.loop2Title'),
                desc: t('home.loop2Desc'),
                cta: t('home.loop2Cta'),
                href: '/activities',
              },
              {
                num: '3',
                title: t('home.loop3Title'),
                desc: t('home.loop3Desc'),
                cta: t('home.loop3Cta'),
                href: '/experiments',
              },
            ].map((step) => (
              <div key={step.num} className="p-4 sm:p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <span className="block font-display font-extrabold text-3xl sm:text-4xl text-text tabular-nums">
                    {step.num}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-text">{step.title}</h3>
                  <p className="text-base text-muted leading-relaxed">{step.desc}</p>
                </div>
                <div className="pt-2">
                  <Link
                    href={step.href}
                    className="text-sm font-semibold text-link underline hover:text-text min-h-[44px] inline-flex items-center"
                  >
                    {step.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Evidence section: 5 tiers rubric + real claim Plate */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-text">
            {t('home.evidenceStripTitle')}
          </h2>
          <p className="text-base text-muted">
            {t('home.evidenceStripSub')}
          </p>
        </div>

        {/* Five tiers rubric in order — open list separated by 1px rules */}
        <div className="border-y border-border divide-y divide-border/70 py-1">
          {TIER_ROWS.map((row) => (
            <div
              key={row.tier}
              className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 py-3.5"
            >
              <div className="w-44 shrink-0">
                <EvidenceMeter tier={row.tier} />
              </div>
              <p className="text-base text-muted leading-relaxed flex-1">
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
                className="text-xs font-semibold text-link underline hover:text-text inline-flex items-center min-h-[44px]"
              >
                View scientific reference
              </Link>
            }
          >
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-text">
                {breathworkClaim.title}
              </h3>
              <p className="text-sm font-semibold text-muted">
                Outcome: {breathworkClaim.outcome}
              </p>
              <p className="text-base text-text leading-relaxed">
                {breathworkClaim.summary}
              </p>
              <p className="text-sm text-muted border-t border-border/60 pt-2 leading-relaxed">
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
            {t('home.headline')}
          </h2>
          <p className="text-sm text-muted">
            {t('home.subhead')}
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
