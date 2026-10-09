import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ExperimentsClient } from './ExperimentsClient';

export const metadata: Metadata = {
  title: 'Self-Experiments — Measure What Beats Plain Rest',
  description:
    'Run alternating trials comparing evidence-based practices against plain rest to see what actually works for you.',
  openGraph: {
    title: 'Self-Experiments — Measure What Beats Plain Rest',
    description:
      'Run alternating trials comparing evidence-based practices against plain rest to see what actually works for you.',
  },
};

export default function ExperimentsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-8 text-center text-xs text-muted">
          Loading experiments...
        </div>
      }
    >
      <ExperimentsClient />
    </Suspense>
  );
}
