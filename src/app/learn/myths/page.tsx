import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MYTHS } from '@/content/myths';
import { MythCard } from '@/features/learn';

export const metadata: Metadata = {
  title: 'Six Myths About Focus',
  description:
    'Examine six widespread productivity claims that are unsupported or strongly conflicting in cognitive science.',
  openGraph: {
    title: 'Six Myths About Focus',
    description:
      'Examine six widespread productivity claims that are unsupported or strongly conflicting in cognitive science.',
  },
};

export default function MythsPage() {
  return (
    <div className="space-y-6 py-2 max-w-[720px] mx-auto">
      <div>
        <Link
          href="/learn"
          className="text-xs font-semibold text-link hover:underline inline-flex items-center min-h-[44px]"
        >
          Back to Evidence Bank
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text font-display">
          Six Myths About Focus
        </h1>
        <p className="text-sm text-muted">
          Popular productivity culture is full of confident claims. Here is what controlled trials actually show.
        </p>
      </div>

      {/* Accordion built on <details> */}
      <div className="space-y-3">
        {MYTHS.map((myth, idx) => (
          <MythCard key={myth.id} myth={myth} defaultOpen={idx === 0} />
        ))}
      </div>
    </div>
  );
}
