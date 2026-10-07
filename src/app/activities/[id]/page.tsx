import React from 'react';
import { notFound } from 'next/navigation';
import { ACTIVITIES, getActivityById } from '@/content/activities';
import { ActivityDetail } from '@/features/activities';

interface ActivityPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ACTIVITIES.map((activity) => ({
    id: activity.id,
  }));
}


export default async function ActivityPage({ params }: ActivityPageProps) {
  const { id } = await params;
  const activity = getActivityById(id);

  if (!activity) {
    notFound();
  }

  return (
    <div className="py-2">
      <ActivityDetail activity={activity} />
    </div>
  );
}
