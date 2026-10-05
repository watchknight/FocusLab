'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OnboardingModal } from '@/features/onboarding';

export default function AboutPage() {
  const [resetMessage, setResetMessage] = useState(false);

  const handleRestartOnboarding = () => {
    try {
      localStorage.removeItem('focuslab:onboarded');
    } catch {
      // Ignored
    }
    window.dispatchEvent(new CustomEvent('focuslab:open-onboarding'));
    setResetMessage(true);
  };

  return (
    <div className="space-y-6 py-2">
      <OnboardingModal />

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text">About FocusLab</h1>
        <p className="text-sm text-muted">
          A free, local-first laboratory for testing attention tools against your own data.
        </p>
      </div>

      <Card className="p-4 space-y-3 bg-surface border-border">
        <h2 className="text-base font-bold text-text">What is FocusLab?</h2>
        <p className="text-xs text-text leading-relaxed">
          Most focus advice treats human cognition as uniform: one productivity influencer swears by 25-minute Pomodoro timers, another by brown noise or cold showers. In reality, cognitive responses vary considerably across individuals, task demands, and circadian rhythms.
        </p>
        <p className="text-xs text-text leading-relaxed">
          FocusLab replaces guesswork with an objective loop: <strong>Check → Practice → Compare</strong>. We combine evidence-labelled focus practices with a brief reaction-time test (PVT-B) so you can directly measure what enhances or degrades your alertness.
        </p>
      </Card>

      <Card className="p-4 space-y-3 bg-surface border-border">
        <h2 className="text-base font-bold text-text">Why Free & Zero Accounts?</h2>
        <p className="text-xs text-text leading-relaxed">
          Attention is deeply personal. We believe personal cognitive metrics should never be harvested, stored on remote clouds, monetized, or shared with third-party tracking networks.
        </p>
        <p className="text-xs text-text leading-relaxed">
          FocusLab is completely local-first: all your reaction-time scores, focus blocks, and experiment data live exclusively inside your web browser&apos;s storage on your device. No user accounts, no passwords, and no telemetry.
        </p>
      </Card>

      <Card className="p-4 space-y-3 bg-surface border-border">
        <h2 className="text-base font-bold text-text">Our Honesty Rules</h2>
        <ul className="text-xs text-text space-y-2 list-disc list-inside leading-relaxed">
          <li>
            <strong>Outcome-specific claims:</strong> We never promise to &ldquo;boost IQ&rdquo;, &ldquo;enhance focus&rdquo;, or give &ldquo;brain power&rdquo;. Every claim specifically names what was measured (e.g., vigor, physiological arousal, or goal attainment).
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
      </Card>

      <Card className="p-4 space-y-3 bg-surface-2 border-border">
        <h2 className="text-base font-bold text-text">Onboarding Tour</h2>
        <p className="text-xs text-muted leading-relaxed">
          Want to re-run the 3-step goal and obstacle onboarding questionnaire to see tailored recommendations?
        </p>
        <div className="pt-1 flex items-center gap-3">
          <Button variant="secondary" onClick={handleRestartOnboarding} className="min-h-[44px]">
            Restart Onboarding Tour
          </Button>
          {resetMessage && (
            <span className="text-xs text-accent font-medium">
              Tour restarted!
            </span>
          )}
        </div>
      </Card>

      <div className="pt-2 flex flex-wrap gap-4 text-xs text-muted border-t border-border">
        <Link href="/privacy" className="hover:text-text underline min-h-[32px] inline-flex items-center">
          Privacy Policy
        </Link>
        <Link href="/disclaimer" className="hover:text-text underline min-h-[32px] inline-flex items-center">
          Medical Disclaimer
        </Link>
        <Link href="/learn" className="hover:text-text underline min-h-[32px] inline-flex items-center">
          Evidence Bank
        </Link>
      </div>
    </div>
  );
}
