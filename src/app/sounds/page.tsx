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
    <div className="space-y-8 py-4 sm:py-8 max-w-5xl mx-auto">
      <div className="space-y-2">
        <h1 className="font-display font-[780] text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] text-text text-balance">
          Ambient Soundscapes
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-[54ch] leading-relaxed">
          Continuous runtime noise generation to mask distracting auditory environments.
        </p>
      </div>

      <NoisePlayer />

      <EvidencePanel />
    </div>
  );
}
