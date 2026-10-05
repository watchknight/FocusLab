'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { OnboardingModal } from '@/features/onboarding';
import { useT } from '@/i18n';

const TIERS = ['strong', 'moderate', 'mixed', 'emerging', 'not-supported'] as const;

export const HomeContent: React.FC = () => {
  const { t } = useT();

  const loopSteps = [
    {
      step: t('home.loop1Step'),
      title: t('home.loop1Title'),
      desc: t('home.loop1Desc'),
      href: '/check',
      cta: t('home.loop1Cta'),
    },
    {
      step: t('home.loop2Step'),
      title: t('home.loop2Title'),
      desc: t('home.loop2Desc'),
      href: '/activities',
      cta: t('home.loop2Cta'),
    },
    {
      step: t('home.loop3Step'),
      title: t('home.loop3Title'),
      desc: t('home.loop3Desc'),
      href: '/experiments',
      cta: t('home.loop3Cta'),
    },
  ];

  const faqItems = [
    { q: t('home.faq1Q'), a: t('home.faq1A') },
    { q: t('home.faq2Q'), a: t('home.faq2A') },
    { q: t('home.faq3Q'), a: t('home.faq3A') },
    { q: t('home.faq4Q'), a: t('home.faq4A') },
    { q: t('home.faq5Q'), a: t('home.faq5A') },
  ];

  return (
    <div className="space-y-12 py-4">
      <OnboardingModal />

      {/* Hero Header */}
      <section className="text-center space-y-4 pt-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
          {t('home.headline')}
        </h1>
        <p className="text-base text-muted max-w-xl mx-auto leading-relaxed">
          {t('home.subhead')}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/check" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto text-sm px-6 py-3 min-h-[44px]">
              {t('home.ctaCheck')}
            </Button>
          </Link>
          <Link href="/learn" className="w-full sm:w-auto">
            <Button variant="subtle" className="w-full sm:w-auto text-sm px-5 py-3 min-h-[44px]">
              {t('home.ctaLearn')}
            </Button>
          </Link>
        </div>
      </section>

      {/* The 3-Step Loop: Check -> Practice -> Compare */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-text">{t('home.loopTitle')}</h2>
          <p className="text-xs text-muted">
            {t('home.loopSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loopSteps.map((step) => (
            <Card key={step.step} className="p-4 space-y-3 bg-surface border-border flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  {step.step}
                </span>
                <h3 className="text-base font-semibold text-text">{step.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
              </div>
              <div className="pt-2 border-t border-border/50">
                <Link
                  href={step.href}
                  className="text-xs font-semibold text-accent hover:underline inline-flex items-center min-h-[44px]"
                >
                  {step.cta} →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Evidence Tier Strip */}
      <section className="p-5 rounded-xl border border-border bg-surface-2 space-y-3">
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold text-text">
            {t('home.evidenceStripTitle')}
          </h2>
          <p className="text-xs text-muted">
            {t('home.evidenceStripSub')}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {TIERS.map((tier) => (
            <Link key={tier} href="/learn/how-we-rate">
              <EvidenceBadge tier={tier} className="hover:opacity-85 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      {/* Privacy Guarantee Banner */}
      <section className="text-center p-5 rounded-xl border border-border bg-surface space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-accent">
          {t('home.privacyBadge')}
        </div>
        <p className="text-sm font-semibold text-text">
          {t('home.privacyTitle')}
        </p>
        <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
          {t('home.privacyDesc')}
        </p>
        <div className="pt-1">
          <Link href="/privacy" className="text-xs font-semibold text-accent hover:underline min-h-[44px] inline-flex items-center">
            {t('home.privacyLink')} →
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-text">{t('home.faqTitle')}</h2>
          <p className="text-xs text-muted">
            {t('home.faqSubtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <Card key={idx} className="p-4 space-y-1.5 bg-surface border-border">
              <h3 className="text-sm font-bold text-text">{item.q}</h3>
              <p className="text-xs text-muted leading-relaxed">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
