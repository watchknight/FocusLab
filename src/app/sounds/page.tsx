'use client';

import React from 'react';
import { NoisePlayer, EvidencePanel } from '@/features/sounds';

export default function SoundsPage() {
  return (
    <div className="space-y-6 py-2">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text">Ambient Soundscapes</h1>
        <p className="text-sm text-muted">
          Continuous runtime noise generation to mask distracting auditory environments.
        </p>
      </div>

      <NoisePlayer />

      <EvidencePanel />
    </div>
  );
}
