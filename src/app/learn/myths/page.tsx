import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MYTHS } from '@/content/myths';
import { MythCard } from '@/features/learn';

export const metadata: Metadata = {
  title: 'Six Myths About Focus | FocusLab',
  description:
    'Examine six widespread productivity claims that are unsupported or strongly conflicting in cognitive science.',
  openGraph: {
    title: 'Six Myths About Focus | FocusLab',
    description:
      'Examine six widespread productivity claims that are unsupported or strongly conflicting in cognitive science.',
  },
};

export default function MythsPage() {
  return (
    <div className="space-y-6 py-2">
      <div>
        <Link
          href="/learn"
          className="text-xs font-semibold text-accent hover:underline inline-flex items-center min-h-[32px]"
        >
          ← Back to Evidence Bank
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Six Myths About Focus
        </h1>
        <p className="text-sm text-muted">
          Popular productivity culture is full of confident claims. Here is what controlled trials actually show.
        </p>
      </div>

      <div className="space-y-4">
        {MYTHS.map((myth) => (
          <MythCard key={myth.id} myth={myth} />
        ))}
      </div>
    </div>
  );
}
