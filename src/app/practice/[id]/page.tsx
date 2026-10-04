import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getActivityById, ACTIVITIES } from '@/content/activities';
import { SessionPlayer } from '@/features/session/SessionPlayer';
import { Button } from '@/components/ui/Button';

interface PracticeDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return ACTIVITIES.map((act) => ({
    id: act.id,
  }));
}

export default function PracticeDetailPage({
  params,
}: PracticeDetailPageProps) {
  const activity = getActivityById(params.id);

  if (!activity) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/practice">
          <Button variant="subtle" className="text-xs">
            &larr; Back to Activities
          </Button>
        </Link>
      </div>

      <SessionPlayer activity={activity} />
    </div>
  );
}
