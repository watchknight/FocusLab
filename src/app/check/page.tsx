'use client';

import React from 'react';
import { FocusCheckRunner } from '@/features/check';
import { FeatureErrorBoundary } from '@/components/ui/FeatureErrorBoundary';

export default function CheckPage() {
  return (
    <div className="py-2">
      <FeatureErrorBoundary featureName="Focus Check">
        <FocusCheckRunner onComplete={() => {}} />
      </FeatureErrorBoundary>
    </div>
  );
}
