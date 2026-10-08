import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TierRubric } from '@/features/learn';

export const metadata: Metadata = {
  title: 'How We Rate Evidence',
  description:
    'Our transparent five-tier methodology for evaluating scientific research on focus, attention, and cognitive practices.',
  openGraph: {
    title: 'How We Rate Evidence',
    description:
      'Our transparent five-tier methodology for evaluating scientific research on focus, attention, and cognitive practices.',
  },
};

export default function HowWeRatePage() {
  return (
    <div className="space-y-6 py-2 max-w-[720px] mx-auto">
      <div>
        <Link
          href="/learn"
          className="text-xs font-semibold text-muted hover:text-text inline-flex items-center min-h-[44px] transition-colors"
        >
          Back to Evidence Bank
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text font-display">
          How We Rate Evidence
        </h1>
        <p className="text-base text-muted max-w-prose">
          Our editorial criteria for assessing scientific findings and assigning evidence tiers.
        </p>
      </div>

      <TierRubric />
    </div>
  );
}
