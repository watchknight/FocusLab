import React from 'react';
import type { Metadata } from 'next';
import { ActivityList } from '@/features/activities';

export const metadata: Metadata = {
  title: 'Attention Practices — Evidence-Graded Interventions',
  description:
    'Browse physiological and behavioral practices graded by replication strength to test what restores your focus.',
  openGraph: {
    title: 'Attention Practices — Evidence-Graded Interventions',
    description:
      'Browse physiological and behavioral practices graded by replication strength to test what restores your focus.',
  },
};

export default function ActivitiesPage() {
  return (
    <div className="py-2">
      <ActivityList />
    </div>
  );
}
