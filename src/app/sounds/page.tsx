import React from 'react';
import type { Metadata } from 'next';
import { NoisePlayer, EvidencePanel } from '@/features/sounds';

export const metadata: Metadata = {
  title: 'Ambient Soundscapes — Continuous Synthesized Noise',
  description:
    'Generate continuous white, pink, or brown noise locally in your browser to mask distracting auditory environments.',
  openGraph: {
    title: 'Ambient Soundscapes — Continuous Synthesized Noise',
    description:
      'Generate continuous white, pink, or brown noise locally in your browser to mask distracting auditory environments.',
  },
};

export default function SoundsPage() {
  return (
    <div className="space-y-6 py-2">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text font-display">
          Ambient Soundscapes
        </h1>
        <p className="text-sm text-muted">
          Continuous runtime noise generation to mask distracting auditory environments.
        </p>
      </div>

      <NoisePlayer />

      <EvidencePanel />
    </div>
  );
}
