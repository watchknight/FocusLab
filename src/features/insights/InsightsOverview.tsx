'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Panel } from '@/components/ui/Panel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CountUp } from '@/components/ui/CountUp';
import { useFocusLabStore } from '@/store';
import { analyzeExperiment } from '@/lib/experiments';
import { getConditionById } from '@/lib/conditions';
import { DataManagement } from './DataManagement';
import { TimeOfDayData } from './TimeOfDayChart';

const HistoryChart = dynamic(() => import('@/features/check/HistoryChart'), {
  ssr: false,
  loading: () => <div className="h-44 flex items-center justify-center text-xs text-muted">Loading chart...</div>,
});

const TimeOfDayChart = dynamic(() => import('./TimeOfDayChart'), {
  ssr: false,
  loading: () => <div className="h-44 flex items-center justify-center text-xs text-muted">Loading chart...</div>,
});

export const InsightsOverview: React.FC = () => {
  const router = useRouter();
  const sessions = useFocusLabStore((state) => state.sessions);
  const activityLogs = useFocusLabStore((state) => state.activityLogs);
  const checks = useFocusLabStore((state) => state.checks);
  const experiments = useFocusLabStore((state) => state.experiments);

  // 1. Practice days this week
  const practiceDaysThisWeek = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const daysSet = new Set<string>();
    sessions.forEach((s) => { if (s.startedAt >= sevenDaysAgo) daysSet.add(new Date(s.startedAt).toDateString()); });
    activityLogs.forEach((a) => { if (a.ts >= sevenDaysAgo) daysSet.add(new Date(a.ts).toDateString()); });
    return daysSet.size;
  }, [sessions, activityLogs]);

  // 2. Focused minutes, quality, distractions
  const totalSessions = sessions.length;
  const totalFocusMin = Math.round(sessions.reduce((acc, s) => acc + s.actualFocusSec, 0) / 60);
  const ratedSessions = sessions.filter((s) => s.quality !== undefined);
  const avgQualityNum = ratedSessions.length > 0
    ? ratedSessions.reduce((acc, s) => acc + (s.quality || 0), 0) / ratedSessions.length
    : null;
  const avgDistractionsNum = totalSessions > 0
    ? sessions.reduce((acc, s) => acc + s.distractions, 0) / totalSessions
    : 0;

  // 3. Time-of-day buckets
  const timeBucketsData = useMemo<TimeOfDayData[] | null>(() => {
    if (totalSessions < 5) return null;
    const counts = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
    sessions.forEach((s) => {
      const hour = new Date(s.startedAt).getHours();
      if (hour >= 6 && hour < 12) counts.Morning++;
      else if (hour >= 12 && hour < 18) counts.Afternoon++;
      else if (hour >= 18 && hour < 24) counts.Evening++;
      else counts.Night++;
    });
    return [
      { period: 'Morning', label: 'Morning (6a–12p)', count: counts.Morning },
      { period: 'Afternoon', label: 'Afternoon (12p–6p)', count: counts.Afternoon },
      { period: 'Evening', label: 'Evening (6p–12a)', count: counts.Evening },
      { period: 'Night', label: 'Night (12a–6a)', count: counts.Night },
    ];
  }, [sessions, totalSessions]);

  // 4. Last 10 baseline medians
  const baselineHistory = useMemo(() => {
    return checks
      .filter((c) => c.context === 'baseline')
      .sort((a, b) => a.ts - b.ts)
      .slice(-10)
      .map((c, i) => ({
        index: i + 1,
        medianRt: c.metrics.medianRt,
        dateStr: new Date(c.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      }));
  }, [checks]);

  const isCompletelyEmpty = totalSessions === 0 && checks.length === 0 && experiments.length === 0;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text font-display">Insights & Trends</h1>
        <p className="text-sm text-muted">Reaction-time baselines, session volume, and self-experiment outcomes.</p>
      </div>

      {isCompletelyEmpty && (
        <Panel variant="surface-2" className="space-y-3 border-accent/40">
          <p className="text-sm text-text font-medium">
            Complete your first Focus Check or timed session to start generating personal focus insights.
          </p>
          <Button variant="primary" onClick={() => router.push('/check')} className="w-full sm:w-auto">
            Take a Focus Check
          </Button>
        </Panel>
      )}

      {/* 1. "This week" panel with four stats in display numerals */}
      <Panel variant="surface-2" className="space-y-4">
        <h2 className="text-sm font-bold text-text uppercase tracking-wide">This week</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-md bg-surface border border-border space-y-1">
            <span className="text-xs font-semibold text-muted block">Practice Days</span>
            <div className="text-2xl sm:text-3xl font-bold font-display tabular-nums text-text">
              <CountUp value={practiceDaysThisWeek} suffix=" / 7" />
            </div>
            <span className="text-[11px] text-muted block">Last 7 days</span>
          </div>

          <div className="p-3 rounded-md bg-surface border border-border space-y-1">
            <span className="text-xs font-semibold text-muted block">Focused Minutes</span>
            <div className="text-2xl sm:text-3xl font-bold font-display tabular-nums text-text">
              <CountUp value={totalFocusMin} suffix=" min" />
            </div>
            <span className="text-[11px] text-muted block tabular-nums">{totalSessions} session{totalSessions === 1 ? '' : 's'}</span>
          </div>

          <div className="p-3 rounded-md bg-surface border border-border space-y-1">
            <span className="text-xs font-semibold text-muted block">Average Quality</span>
            <div className="text-2xl sm:text-3xl font-bold font-display tabular-nums text-text">
              {avgQualityNum !== null ? <CountUp value={avgQualityNum} decimals={1} suffix=" / 5" /> : '—'}
            </div>
            <span className="text-[11px] text-muted block">Self-rated absorption</span>
          </div>

          <div className="p-3 rounded-md bg-surface border border-border space-y-1">
            <span className="text-xs font-semibold text-muted block">Distractions</span>
            <div className="text-2xl sm:text-3xl font-bold font-display tabular-nums text-text">
              <CountUp value={avgDistractionsNum} decimals={1} />
            </div>
            <span className="text-[11px] text-muted block">Average per session</span>
          </div>
        </div>
      </Panel>

      {/* 2. Time-of-day chart only with enough data */}
      <Card className="p-4 sm:p-5 space-y-3 bg-surface border-border">
        <h2 className="text-sm font-semibold text-text">Time of Day Distribution</h2>
        {timeBucketsData ? (
          <TimeOfDayChart data={timeBucketsData} />
        ) : (
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted">
              Complete at least 5 focus sessions to reveal your time-of-day focus distribution ({totalSessions}/5 completed).
            </p>
            <Button variant="primary" onClick={() => router.push('/focus')} className="w-full sm:w-auto text-xs">
              Start a Focus Session
            </Button>
          </div>
        )}
      </Card>

      {/* 3. The baseline trend */}
      <Card className="p-4 sm:p-5 space-y-3 bg-surface border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">Baseline Alertness Trend (Last 10 Checks)</h2>
          <span className="text-xs text-muted font-mono tabular-nums">{baselineHistory.length} recorded</span>
        </div>
        {baselineHistory.length > 0 ? (
          <HistoryChart data={baselineHistory} />
        ) : (
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted">Complete your first Focus Check to view your baseline reaction time trend.</p>
            <Button variant="primary" onClick={() => router.push('/check')} className="w-full sm:w-auto text-xs">
              Take a Focus Check
            </Button>
          </div>
        )}
      </Card>

      {/* 4. The experiment list */}
      <Card className="p-4 sm:p-5 space-y-3 bg-surface border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">Self-Experiment Results</h2>
          <Link href="/experiments" className="text-xs font-semibold text-link hover:underline min-h-[44px] inline-flex items-center">
            Manage experiments
          </Link>
        </div>

        {experiments.length === 0 ? (
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted">Start a 10-run self-experiment to measure what helps your focus compared to quiet rest.</p>
            <Button variant="primary" onClick={() => router.push('/experiments')} className="w-full sm:w-auto text-xs">
              Start an Experiment
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {experiments.map((exp) => {
              const analysis = analyzeExperiment(exp, checks);
              const activeCond = getConditionById(analysis.activeConditionId);
              return (
                <div key={exp.id} className="py-3 space-y-1.5 first:pt-1 last:pb-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-sm font-bold text-text">{activeCond.name} vs. Quiet Rest</span>
                    <span className="text-xs font-mono text-muted tabular-nums">
                      {exp.runs.length}/10 runs ({analysis.totalPairs} pairs completed)
                    </span>
                  </div>
                  <p className="text-xs font-medium text-text">{analysis.verdict}</p>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* 5. "Your data" panel */}
      <DataManagement />
    </div>
  );
};

export default InsightsOverview;
