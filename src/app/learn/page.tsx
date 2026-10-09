import React from 'react';
import type { Metadata } from 'next';
import { CLAIMS } from '@/content/evidence';
import { ClaimList } from '@/features/learn';

export const metadata: Metadata = {
  title: 'Evidence Bank',
  description:
    'Explore peer-reviewed evidence, effect sizes, and caveats behind focus practices and attention interventions.',
  openGraph: {
    title: 'Evidence Bank',
    description:
      'Explore peer-reviewed evidence, effect sizes, and caveats behind focus practices and attention interventions.',
  },
};

export default function LearnPage() {
  return (
    <div className="space-y-8 py-4 sm:py-8 max-w-[840px] mx-auto">
      <div className="space-y-2">
        <h1 className="font-display font-[780] text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] text-text text-balance">
          Evidence Bank
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-[54ch] leading-relaxed">
          Every practice in FocusLab is evaluated against empirical literature for the specific outcome it affects.
        </p>
      </div>

      <ClaimList claims={CLAIMS} />
    </div>
  );
}
