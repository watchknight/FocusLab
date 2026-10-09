import React from 'react';
import type { Metadata } from 'next';
import { InsightsOverview } from '@/features/insights';

export const metadata: Metadata = {
  title: 'Insights & Trends — Personal Attention Analytics',
  description:
    'Review your historical reaction-time trends, diurnal patterns, and session metrics stored locally in your browser.',
  openGraph: {
    title: 'Insights & Trends — Personal Attention Analytics',
    description:
      'Review your historical reaction-time trends, diurnal patterns, and session metrics stored locally in your browser.',
  },
};

export default function InsightsPage() {
  return (
    <div className="py-6 sm:py-8 lg:py-10">
      <InsightsOverview />
    </div>
  );
}
