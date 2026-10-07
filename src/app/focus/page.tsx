'use client';

import React from 'react';
import { SessionFlow } from '@/features/session';
import { FeatureErrorBoundary } from '@/components/ui/FeatureErrorBoundary';

export default function FocusPage() {
  return (
    <div className="py-2">
      <FeatureErrorBoundary featureName="Focus Session">
        <SessionFlow />
      </FeatureErrorBoundary>
    </div>
  );
}
