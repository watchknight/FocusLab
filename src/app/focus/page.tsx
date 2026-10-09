import React from 'react';
import type { Metadata } from 'next';
import { SessionFlow } from '@/features/session';
import { FeatureErrorBoundary } from '@/components/ui/FeatureErrorBoundary';

export const metadata: Metadata = {
  title: 'Focus Session — Single-Task Blocks & Rhythms',
  description:
    'Structure work intervals with custom duration dials, implementation intentions, and an environment checklist.',
  openGraph: {
    title: 'Focus Session — Single-Task Blocks & Rhythms',
    description:
      'Structure work intervals with custom duration dials, implementation intentions, and an environment checklist.',
  },
};

export default function FocusPage() {
  return (
    <div className="py-6 sm:py-8 lg:py-10">
      <FeatureErrorBoundary featureName="Focus Session">
        <SessionFlow />
      </FeatureErrorBoundary>
    </div>
  );
}
