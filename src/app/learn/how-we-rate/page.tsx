import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TierRubric } from '@/features/learn';

export const metadata: Metadata = {
  title: 'How We Rate Evidence | FocusLab',
  description:
    'Our transparent five-tier methodology for evaluating scientific research on focus, attention, and cognitive practices.',
  openGraph: {
    title: 'How We Rate Evidence | FocusLab',
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
          className="text-xs font-semibold text-link hover:underline inline-flex items-center min-h-[44px]"
        >
          ← Back to Evidence Bank
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text font-display">
          How We Rate Evidence
        </h1>
        <p className="text-sm text-muted">
          Our editorial criteria for assessing scientific findings and assigning evidence tiers.
        </p>
      </div>

      <TierRubric />
    </div>
  );
}
