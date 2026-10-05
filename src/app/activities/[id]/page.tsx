import React from 'react';
import { notFound } from 'next/navigation';
import { ACTIVITIES, getActivityById } from '@/content/activities';
import { ActivityDetail } from '@/features/activities';

interface ActivityPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return ACTIVITIES.map((activity) => ({
    id: activity.id,
  }));
}

export default function ActivityPage({ params }: ActivityPageProps) {
  const activity = getActivityById(params.id);

  if (!activity) {
    notFound();
  }

  return (
    <div className="py-2">
      <ActivityDetail activity={activity} />
    </div>
  );
}
