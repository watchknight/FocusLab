import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RestartOnboardingButton } from '@/features/onboarding';

export const metadata: Metadata = {
  title: 'About FocusLab | Philosophy & Honesty Rules',
  description:
    'Learn about our evidence-first philosophy, local-only data storage, and strict honesty rules.',
  openGraph: {
    title: 'About FocusLab',
    description:
      'Learn about our evidence-first philosophy, local-only data storage, and strict honesty rules.',
  },
};

export default function AboutPage() {
  return (
    <div className="space-y-6 py-2 max-w-[720px] mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text">About FocusLab</h1>
        <p className="text-base text-muted">
          A free, local-first laboratory for testing attention tools against your own data.
        </p>
      </div>

      <div className="border-t border-border divide-y divide-border">
        <section className="py-6 space-y-3">
          <h2 className="text-lg font-bold text-text">What is FocusLab?</h2>
          <p className="text-base text-text leading-relaxed">
            Most focus advice treats human cognition as uniform: one productivity influencer swears by 25-minute Pomodoro timers, another by brown noise or cold showers. In reality, cognitive responses vary considerably across individuals, task demands, and circadian rhythms.
          </p>
          <p className="text-base text-text leading-relaxed">
            FocusLab replaces guesswork with a direct loop: <strong>Check → Practice → Compare</strong>. We combine evidence-labelled focus practices with an informal browser reaction-time test (PVT-B) so you can directly measure what enhances or degrades your alertness.
          </p>
        </section>

        <section className="py-6 space-y-3">
          <h2 className="text-lg font-bold text-text">Why free and zero accounts?</h2>
          <p className="text-base text-text leading-relaxed">
            Attention is deeply personal. We believe personal cognitive metrics should never be harvested, stored on remote clouds, monetized, or shared with third-party tracking networks.
          </p>
          <p className="text-base text-text leading-relaxed">
            FocusLab is completely local-first: all your reaction-time scores, focus blocks, and experiment data live exclusively inside your web browser&apos;s storage on your device. No user accounts, no passwords, and no telemetry.
          </p>
        </section>

        <section className="py-6 space-y-3">
          <h2 className="text-lg font-bold text-text">Our honesty rules</h2>
          <ul className="text-base text-text space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <strong>Outcome-specific claims:</strong> We avoid vague performance promises. Every claim specifically names what was measured (e.g., vigor, physiological arousal, or goal attainment).
            </li>
            <li>
              <strong>No commercial hype:</strong> Every claim comes directly from registered peer-reviewed literature with explicit effect sizes and limitations.
            </li>
            <li>
              <strong>Clear evidence tiers:</strong> Every technique shows an EvidenceBadge ranging from Strong to Not Supported.
            </li>
            <li>
              <strong>Not a medical device:</strong> FocusLab is an educational self-experimentation tool, not an ADHD diagnostic or clinical screening instrument.
            </li>
          </ul>
        </section>

        <section className="py-6 space-y-3">
          <h2 className="text-lg font-bold text-text">Onboarding tour</h2>
          <p className="text-base text-muted leading-relaxed">
            Want to re-run the 3-step goal and obstacle onboarding questionnaire to see tailored recommendations?
          </p>
          <div className="pt-1">
            <RestartOnboardingButton />
          </div>
        </section>
      </div>

      <div className="pt-2 flex flex-wrap gap-4 text-sm text-muted border-t border-border">
        <Link href="/privacy" className="hover:text-text underline min-h-[44px] inline-flex items-center">
          Privacy Policy
        </Link>
        <Link href="/disclaimer" className="hover:text-text underline min-h-[44px] inline-flex items-center">
          Medical Disclaimer
        </Link>
        <Link href="/learn" className="hover:text-text underline min-h-[44px] inline-flex items-center">
          Evidence Bank
        </Link>
      </div>
    </div>
  );
}
