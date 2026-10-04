import React from 'react';
import { ActivityList } from '@/features/activities/ActivityList';

export default function PracticePage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-content-primary">
          Evidence-Labelled Activities
        </h1>
        <p className="text-xs text-content-secondary">
          Choose a brief protocol to practice. Each activity is labeled with its
          measured cognitive outcome and scientific evidence level.
        </p>
      </div>

      <ActivityList />
    </div>
  );
}
