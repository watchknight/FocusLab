import React from 'react';
import type { Metadata } from 'next';
import { CheckClient } from './CheckClient';

export const metadata: Metadata = {
  title: 'Focus Check — 3-Minute PVT-B Reaction Test',
  description:
    'Measure your baseline reaction time and attentional lapses using an informal 3-minute Psychomotor Vigilance Task.',
  openGraph: {
    title: 'Focus Check — 3-Minute PVT-B Reaction Test',
    description:
      'Measure your baseline reaction time and attentional lapses using an informal 3-minute Psychomotor Vigilance Task.',
  },
};

export default function CheckPage() {
  return <CheckClient />;
}
