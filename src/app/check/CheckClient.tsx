'use client';

import React from 'react';
import { FocusCheckRunner } from '@/features/check';
import { FeatureErrorBoundary } from '@/components/ui/FeatureErrorBoundary';

export function CheckClient() {
  return (
    <div className="py-2">
      <FeatureErrorBoundary featureName="Focus Check">
        <FocusCheckRunner onComplete={() => {}} />
      </FeatureErrorBoundary>
    </div>
  );
}
