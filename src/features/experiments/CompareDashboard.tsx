'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useFocusStore } from '@/store/useFocusStore';
import { ACTIVITIES } from '@/content/activities';
import { computeActivityDeltas } from '@/lib/experiments';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Lazy-load Recharts to optimize initial bundle performance
const DeltasChart = dynamic(
  () =>
    import('./DeltasChart').then((mod) => ({ default: mod.DeltasChart })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center text-xs text-content-muted">
        Loading chart...
      </div>
    ),
  }
);

export const CompareDashboard: React.FC = () => {
  const checkLogs = useFocusStore((s) => s.checkLogs);
  const sessionLogs = useFocusStore((s) => s.sessionLogs);

  const stats = ACTIVITIES.map((act) => {
    const delta = computeActivityDeltas(act.id, sessionLogs, checkLogs);
    return {
      activity: act,
      delta,
    };
  }).filter((item) => item.delta.count > 0);

  const chartData = stats.map((item) => ({
    activity: item.activity.title.split(' ')[0] || item.activity.title,
    energyChange: item.delta.meanEnergyDelta,
    distractionChange: item.delta.meanDistractionDelta,
    moodChange: item.delta.meanMoodDelta,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-content-primary">
          Compare: Test What Works For You
        </h1>
        <p className="text-xs text-content-secondary">
          Aggregated pre-to-post change from your personal local sessions.
          Positive changes in energy/mood indicate uplift; negative distraction
          indicates reduced urge to divert focus.
        </p>
      </div>

      <Card as="section" className="space-y-4">
        <h2 className="text-sm font-semibold text-content-primary">
          Average Shift by Activity
        </h2>
        <DeltasChart data={chartData} />
      </Card>

      <Card as="section" className="space-y-3">
        <h2 className="text-sm font-semibold text-content-primary">
          Activity Comparison Table
        </h2>
        {stats.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-xs text-content-muted">
              No paired sessions found. Complete a Check, practice an activity,
              and finish with a Post-Check to see your personal results here.
            </p>
            <Link href="/practice">
              <Button variant="primary">Start Practice Session</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-border text-content-muted">
                  <th className="py-2 pr-3 font-semibold">Activity</th>
                  <th className="py-2 px-2 font-semibold">Sessions</th>
                  <th className="py-2 px-2 font-semibold">Δ Energy</th>
                  <th className="py-2 px-2 font-semibold">Δ Distraction</th>
                  <th className="py-2 pl-2 font-semibold">Δ Mood</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {stats.map(({ activity, delta }) => (
                  <tr key={activity.id} className="text-content-secondary">
                    <td className="py-2.5 pr-3 font-medium text-content-primary">
                      {activity.title}
                    </td>
                    <td className="py-2.5 px-2">{delta.count}</td>
                    <td className="py-2.5 px-2">
                      {delta.meanEnergyDelta > 0 ? '+' : ''}
                      {delta.meanEnergyDelta}
                    </td>
                    <td className="py-2.5 px-2">
                      {delta.meanDistractionDelta > 0 ? '+' : ''}
                      {delta.meanDistractionDelta}
                    </td>
                    <td className="py-2.5 pl-2">
                      {delta.meanMoodDelta > 0 ? '+' : ''}
                      {delta.meanMoodDelta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
