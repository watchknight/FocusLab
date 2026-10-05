'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { CheckResult } from '@/store/types';
import { useFocusLabStore } from '@/store';
import { useT } from '@/i18n';

const HistoryChart = dynamic(() => import('./HistoryChart'), {
  ssr: false,
  loading: () => (
    <div className="h-48 flex items-center justify-center text-xs text-muted">
      Loading chart...
    </div>
  ),
});

interface ResultsViewProps {
  result: CheckResult;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const { t } = useT();
  const allChecks = useFocusLabStore((state) => state.checks);

  const baselineHistory = allChecks
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

  const { medianRt, lapses, falseStarts, meanReciprocal } = result.metrics;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-text">{t('check.resultsTitle')}</h2>
        <p className="text-sm font-medium text-text">
          {t('check.medianRt')}: {medianRt} ms · {lapses} {t('check.lapses')} · {falseStarts} {t('check.falseStarts')}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label={t('check.medianRt')} value={`${medianRt} ms`} />
        <Stat label={t('check.lapses')} value={lapses} subtext="RT ≥ 355 ms" />
        <Stat label={t('check.falseStarts')} value={falseStarts} subtext="< 100 ms or early" />
        <Stat label={t('check.speed')} value={meanReciprocal} subtext="Mean reciprocal" />
      </div>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">{t('check.historyTitle')}</h3>
          <span className="text-xs text-muted font-mono">{baselineHistory.length} total</span>
        </div>
        <HistoryChart data={baselineHistory} />
      </Card>

      <Card className="border-border bg-surface-2 p-3 text-xs text-muted">
        <p className="font-semibold text-text mb-1">Interpretation Note</p>
        <p>
          Compare with your own earlier checks, not with other people. Sleep, caffeine and time of day change results.
        </p>
      </Card>

      <div className="pt-2">
        <Button variant="primary" onClick={onReset} className="w-full sm:w-auto min-h-[44px]">
          {t('check.btnRetake')}
        </Button>
      </div>
    </div>
  );
};
