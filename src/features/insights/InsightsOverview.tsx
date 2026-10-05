'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { useFocusLabStore } from '@/store';
import { analyzeExperiment } from '@/lib/experiments';
import { getConditionById } from '@/lib/conditions';
import { DataManagement } from './DataManagement';

const HistoryChart = dynamic(() => import('@/features/check/HistoryChart'), {
  ssr: false,
  loading: () => <div className="h-44 flex items-center justify-center text-xs text-muted">Loading chart...</div>,
});

export const InsightsOverview: React.FC = () => {
  const sessions = useFocusLabStore((state) => state.sessions);
  const activityLogs = useFocusLabStore((state) => state.activityLogs);
  const checks = useFocusLabStore((state) => state.checks);
  const experiments = useFocusLabStore((state) => state.experiments);

  // 1. Practice days this week (neutral wording, no streak-loss framing)
  const practiceDaysThisWeek = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const daysSet = new Set<string>();
    sessions.forEach((s) => {
      if (s.startedAt >= sevenDaysAgo) {
        daysSet.add(new Date(s.startedAt).toDateString());
      }
    });
    activityLogs.forEach((a) => {
      if (a.ts >= sevenDaysAgo) {
        daysSet.add(new Date(a.ts).toDateString());
      }
    });
    return daysSet.size;
  }, [sessions, activityLogs]);

  // 2. Sessions, focused minutes, quality, distractions
  const totalSessions = sessions.length;
  const totalFocusMin = Math.round(
    sessions.reduce((acc, s) => acc + s.actualFocusSec, 0) / 60
  );

  const ratedSessions = sessions.filter((s) => s.quality !== undefined);
  const avgQuality =
    ratedSessions.length > 0
      ? (ratedSessions.reduce((acc, s) => acc + (s.quality || 0), 0) / ratedSessions.length).toFixed(1)
      : '—';

  const avgDistractions =
    totalSessions > 0
      ? (sessions.reduce((acc, s) => acc + s.distractions, 0) / totalSessions).toFixed(1)
      : '0';

  // 3. Time-of-day buckets (only with 5 or more sessions)
  const timeBuckets = useMemo(() => {
    if (totalSessions < 5) return null;
    const buckets = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
    sessions.forEach((s) => {
      const hour = new Date(s.startedAt).getHours();
      if (hour >= 6 && hour < 12) buckets.Morning++;
      else if (hour >= 12 && hour < 18) buckets.Afternoon++;
      else if (hour >= 18 && hour < 24) buckets.Evening++;
      else buckets.Night++;
    });
    return buckets;
  }, [sessions, totalSessions]);

  // 4. Last 10 baseline medians for chart
  const baselineHistory = useMemo(() => {
    return checks
      .filter((c) => c.context === 'baseline')
      .sort((a, b) => a.ts - b.ts)
      .slice(-10)
      .map((c, i) => ({
        index: i + 1,
        medianRt: c.metrics.medianRt,
        dateStr: new Date(c.ts).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
      }));
  }, [checks]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-text">Insights & Trends</h1>
        <p className="text-sm text-muted">
          Objective reaction-time baselines, session volume, and self-experiment outcomes.
        </p>
      </div>

      {/* Overview Stat Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat
          label="Practice Days"
          value={`${practiceDaysThisWeek} / 7`}
          subtext="Active in the last 7 days"
        />
        <Stat
          label="Total Focus"
          value={`${totalFocusMin} min`}
          subtext={`${totalSessions} session${totalSessions !== 1 ? 's' : ''}`}
        />
        <Stat
          label="Avg Quality"
          value={avgQuality !== '—' ? `${avgQuality} / 5` : '—'}
          subtext="Self-rated absorption"
        />
        <Stat
          label="Distractions"
          value={avgDistractions}
          subtext="Avg per session"
        />
      </div>

      {/* Time-of-Day Distribution */}
      <Card className="p-4 sm:p-5 space-y-3">
        <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
          Time of Day Distribution
        </h2>
        {timeBuckets ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-2.5 rounded bg-surface-2 border border-border text-center">
              <span className="text-xs text-muted block">Morning (6a–12p)</span>
              <span className="text-lg font-mono font-bold text-text">{timeBuckets.Morning}</span>
            </div>
            <div className="p-2.5 rounded bg-surface-2 border border-border text-center">
              <span className="text-xs text-muted block">Afternoon (12p–6p)</span>
              <span className="text-lg font-mono font-bold text-text">{timeBuckets.Afternoon}</span>
            </div>
            <div className="p-2.5 rounded bg-surface-2 border border-border text-center">
              <span className="text-xs text-muted block">Evening (6p–12a)</span>
              <span className="text-lg font-mono font-bold text-text">{timeBuckets.Evening}</span>
            </div>
            <div className="p-2.5 rounded bg-surface-2 border border-border text-center">
              <span className="text-xs text-muted block">Night (12a–6a)</span>
              <span className="text-lg font-mono font-bold text-text">{timeBuckets.Night}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted">
            Time-of-day distribution unlocks after you log at least 5 completed focus sessions ({totalSessions}/5 logged).
          </p>
        )}
      </Card>

      {/* Last 10 Baseline Medians */}
      <Card className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
            Baseline Alertness Trend (Last 10 Checks)
          </h2>
          <span className="text-xs text-muted font-mono">{baselineHistory.length} total</span>
        </div>
        <HistoryChart data={baselineHistory} />
      </Card>

      {/* Experiment Results List */}
      <Card className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
            Experiment Results
          </h2>
          <Link href="/experiments" className="text-xs text-accent hover:underline">
            Manage experiments →
          </Link>
        </div>

        {experiments.length === 0 ? (
          <p className="text-xs text-muted">No self-experiments created yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {experiments.map((exp) => {
              const analysis = analyzeExperiment(exp, checks);
              const activeCond = getConditionById(analysis.activeConditionId);
              return (
                <div key={exp.id} className="py-3 space-y-1 first:pt-1 last:pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-text">
                      {activeCond.name} vs. Quiet Rest
                    </span>
                    <span className="text-xs font-mono text-muted">
                      {exp.runs.length}/10 runs ({analysis.totalPairs} pairs)
                    </span>
                  </div>
                  <p className="text-xs font-medium text-accent">
                    {analysis.verdict}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Local Data Privacy & Management */}
      <DataManagement />
    </div>
  );
};
