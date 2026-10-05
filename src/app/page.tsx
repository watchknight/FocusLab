import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { OnboardingModal } from '@/features/onboarding';

const LOOP_STEPS = [
  {
    step: '1. Check',
    title: 'Measure Your Baseline',
    desc: 'Take an objective 3-minute reaction-time test (PVT-B) to measure sustained attention and alertness lapses.',
    href: '/check',
    cta: 'Take a Check',
  },
  {
    step: '2. Practice',
    title: 'Evidence-Labelled Tools',
    desc: 'Engage with structured focus sessions, breath pacing, and quiet rest—each clearly tagged with its empirical support.',
    href: '/activities',
    cta: 'Explore Activities',
  },
  {
    step: '3. Compare',
    title: 'Discover What Works',
    desc: 'Run self-directed A/B experiments comparing an active technique against quiet rest to test individual efficacy.',
    href: '/experiments',
    cta: 'View Experiments',
  },
];

const TIERS = ['strong', 'moderate', 'mixed', 'emerging', 'not-supported'] as const;

const FAQ_ITEMS = [
  {
    q: 'Is FocusLab completely free?',
    a: 'Yes. FocusLab is 100% free and open-source. There are no subscriptions, paywalls, tracking scripts, or advertisements.',
  },
  {
    q: 'Where is my data stored?',
    a: 'All data stays entirely on your own device in your browser local storage. Nothing is sent to an external server or cloud database.',
  },
  {
    q: 'Is FocusLab a medical or diagnostic tool?',
    a: 'No. FocusLab is an educational self-tracking project. It does not diagnose ADHD or other clinical conditions and does not offer medical advice.',
  },
  {
    q: 'Why use a reaction-time test to measure focus?',
    a: 'Subjective focus ratings are easily biased by expectations. Brief reaction-time testing (PVT-B) provides an objective, behavioral measure of attention lapses.',
  },
  {
    q: 'How is scientific evidence rated?',
    a: 'Claims are evaluated across 5 transparent tiers (Strong to Not Supported) derived directly from peer-reviewed meta-analyses for the specific outcome named.',
  },
];

export default function HomePage() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FocusLab',
    url: 'https://focuslab.app',
    description:
      'A calm, local-first web app to measure attentional states and test evidence-labelled focus protocols.',
  };

  return (
    <div className="space-y-12 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <OnboardingModal />

      {/* Hero Header */}
      <section className="text-center space-y-4 pt-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
          Build focus you can measure.
        </h1>
        <p className="text-base text-muted max-w-xl mx-auto leading-relaxed">
          A calm, local-first web laboratory pairing evidence-graded attention practices with objective reaction-time testing to find what truly works for you.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/check" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto text-sm px-6 py-3 min-h-[44px]">
              Start with a 3-minute Check
            </Button>
          </Link>
          <Link href="/learn" className="w-full sm:w-auto">
            <Button variant="subtle" className="w-full sm:w-auto text-sm px-5 py-3 min-h-[44px]">
              Explore the Science
            </Button>
          </Link>
        </div>
      </section>

      {/* The 3-Step Loop: Check -> Practice -> Compare */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-text">The FocusLab Loop</h2>
          <p className="text-xs text-muted">
            Move beyond subjective guesswork through structured self-experimentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LOOP_STEPS.map((step) => (
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
                  className="text-xs font-semibold text-accent hover:underline inline-flex items-center min-h-[36px]"
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
            Every tip shows how strong its evidence is.
          </h2>
          <p className="text-xs text-muted">
            We distinguish high-replication findings from preliminary pilots and disproven claims.
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
          Local-First Architecture
        </div>
        <p className="text-sm font-semibold text-text">
          No account. Your data stays on your device.
        </p>
        <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
          Zero trackers, zero remote databases, and no login walls. Your results live in your browser&apos;s private local storage.
        </p>
        <div className="pt-1">
          <Link href="/privacy" className="text-xs font-semibold text-accent hover:underline min-h-[36px] inline-flex items-center">
            Read our privacy principles →
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-text">Frequently Asked Questions</h2>
          <p className="text-xs text-muted">
            Transparent answers regarding methodology, privacy, and evidence.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <Card key={idx} className="p-4 space-y-1.5 bg-surface border-border">
              <h3 className="text-sm font-bold text-text">{item.q}</h3>
              <p className="text-xs text-muted leading-relaxed">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
