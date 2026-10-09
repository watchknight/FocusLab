import React from 'react';
import type { Metadata } from 'next';
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

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const { id } = await params;
  const activity = getActivityById(id);
  if (!activity) {
    return { title: 'Attention Practice' };
  }
  return {
    title: `${activity.name} — Attention Practice`,
    description: activity.whenToUse,
    openGraph: {
      title: `${activity.name} — Attention Practice | FocusLab`,
      description: activity.whenToUse,
    },
  };
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
