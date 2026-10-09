'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Panel } from '@/components/ui/Panel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFocusLabStore } from '@/store';
import { analyzeExperiment } from '@/lib/experiments';
import { getConditionById } from '@/lib/conditions';
import { ScrambleStatTile } from './ScrambleStatTile';
import { DataManagement } from './DataManagement';
import { TimeOfDayData } from './TimeOfDayChart';

const HistoryChart = dynamic(() => import('@/features/check/HistoryChart'), {
  ssr: false,
  loading: () => <div className="h-48 flex items-center justify-center text-xs text-muted" aria-hidden="true">Loading chart...</div>,
});

const TimeOfDayChart = dynamic(() => import('./TimeOfDayChart'), {
  ssr: false,
  loading: () => <div className="h-48 flex items-center justify-center text-xs text-muted" aria-hidden="true">Loading chart...</div>,
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
    sessions.forEach((s) => {
      if (s.startedAt >= sevenDaysAgo) daysSet.add(new Date(s.startedAt).toDateString());
    });
    activityLogs.forEach((a) => {
      if (a.ts >= sevenDaysAgo) daysSet.add(new Date(a.ts).toDateString());
    });
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

  // 3. Time-of-day buckets (only with 5 or more sessions)
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

  // 4. Baseline medians
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
      <div className="space-y-2">
        <h1 className="font-display font-[780] text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] text-text text-balance">
          Insights & Trends
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-[54ch] leading-relaxed">
          Reaction-time baselines, session volume, and self-experiment outcomes.
        </p>
      </div>

      {isCompletelyEmpty && (
        <Panel variant="surface-2" className="space-y-4">
          <p className="text-sm text-text font-medium leading-relaxed">
            Complete your first Focus Check to start generating personal focus insights.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/check')}
            className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
          >
            Take a Focus Check
          </Button>
        </Panel>
      )}

      {/* 1. Stat tiles that scramble when value changes */}
      <Panel variant="surface-2" className="space-y-4">
        <h2 className="text-xs font-semibold text-muted block">This week</h2>
        <div className="rounded-[16px] bg-surface border border-border grid grid-cols-2 sm:grid-cols-4 shadow-xs overflow-hidden">
          <ScrambleStatTile
            label="Practice Days"
            value={`${practiceDaysThisWeek} / 7`}
            sublabel="Last 7 days"
          />
          <ScrambleStatTile
            label="Focused Minutes"
            value={`${totalFocusMin} min`}
            sublabel={`${totalSessions} session${totalSessions === 1 ? '' : 's'}`}
            className="border-l border-border"
          />
          <ScrambleStatTile
            label="Average Quality"
            value={avgQualityNum !== null ? `${avgQualityNum.toFixed(1)} / 5` : '—'}
            sublabel="Self-rated absorption"
            className="border-t sm:border-t-0 sm:border-l border-border"
          />
          <ScrambleStatTile
            label="Distractions"
            value={`${avgDistractionsNum.toFixed(1)}`}
            sublabel="Average per session"
            className="border-l border-t sm:border-t-0 sm:border-l border-border"
          />
        </div>
      </Panel>

      {/* 2. Histogram-style time-of-day bars (only with 5 or more sessions) */}
      <Card className="p-5 sm:p-6 space-y-4 bg-surface border-border">
        <h2 className="text-xs font-semibold text-muted block">Time of day distribution</h2>
        {timeBucketsData ? (
          <TimeOfDayChart data={timeBucketsData} />
        ) : (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted">
              Complete at least 5 focus sessions to reveal your time-of-day focus distribution ({totalSessions}/5 completed).
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/focus')}
              className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
            >
              Start a Focus Session
            </Button>
          </div>
        )}
      </Card>

      {/* 3. Baseline trend */}
      <Card className="p-5 sm:p-6 space-y-4 bg-surface border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted block">
            Baseline alertness trend (last 10 checks)
          </h2>
          <span className="text-xs text-muted font-mono tabular-nums">{baselineHistory.length} recorded</span>
        </div>
        {baselineHistory.length > 0 ? (
          <HistoryChart data={baselineHistory} />
        ) : (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted">
              Complete your first Focus Check to view your baseline reaction time trend.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/check')}
              className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
            >
              Take a Focus Check
            </Button>
          </div>
        )}
      </Card>

      {/* 4. Experiment list */}
      <Card className="p-5 sm:p-6 space-y-4 bg-surface border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted block">
            Self-experiment results
          </h2>
          <Link
            href="/experiments"
            className="text-xs font-semibold text-muted hover:text-text transition-colors min-h-[44px] inline-flex items-center"
          >
            Manage experiments
          </Link>
        </div>

        {experiments.length === 0 ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted">
              Start a 10-run self-experiment to measure what helps your focus compared to quiet rest.
            </p>
            <Button variant="primary" onClick={() => router.push('/experiments')} className="w-full sm:w-auto">
              Start an Experiment
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {experiments.map((exp) => {
              const analysis = analyzeExperiment(exp, checks);
              const activeCond = getConditionById(analysis.activeConditionId);
              return (
                <div key={exp.id} className="py-3.5 space-y-1.5 first:pt-1 last:pb-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-sm font-bold text-text">{activeCond.name} vs. Quiet Rest</span>
                    <span className="text-xs font-mono text-muted tabular-nums">
                      {exp.runs.length}/10 runs ({analysis.totalPairs} pairs completed)
                    </span>
                  </div>
                  <p className="text-sm font-medium text-text">{analysis.verdict}</p>
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
