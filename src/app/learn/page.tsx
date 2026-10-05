import React from 'react';
import type { Metadata } from 'next';
import { CLAIMS } from '@/content/evidence';
import { ClaimList } from '@/features/learn';

export const metadata: Metadata = {
  title: 'Learn — Evidence Bank | FocusLab',
  description:
    'Explore peer-reviewed evidence, effect sizes, and caveats behind focus practices and attention interventions.',
};

export default function LearnPage() {
  return (
    <div className="space-y-6 py-2">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Evidence Bank
        </h1>
        <p className="text-sm text-muted">
          Every practice in FocusLab is evaluated against empirical literature for the specific outcome it affects.
        </p>
      </div>

      <ClaimList claims={CLAIMS} />
    </div>
  );
}
