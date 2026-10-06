'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Panel } from '@/components/ui/Panel';
import { CheckResult } from '@/store/types';
import { useFocusLabStore } from '@/store';
import { useT } from '@/i18n';
import { useMotionAllowed } from '@/lib/motion';

const HistoryChart = dynamic(() => import('./HistoryChart'), {
  ssr: false,
  loading: () => (
    <div className="h-48 sm:h-56 flex items-center justify-center text-xs text-muted" aria-hidden="true">
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
  const motionOk = useMotionAllowed();
  const allChecks = useFocusLabStore((state) => state.checks);
  const { medianRt, lapses, falseStarts } = result.metrics;

  const [displayRt, setDisplayRt] = useState<number>(() => (motionOk ? 0 : medianRt));
  const [trendAnimateReady, setTrendAnimateReady] = useState<boolean>(!motionOk);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!motionOk) {
      setDisplayRt(medianRt);
      setTrendAnimateReady(false);
      return;
    }

    const startTime = performance.now();
    const duration = 600;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Linear or subtle ease out
      const current = Math.round(progress * medianRt);
      setDisplayRt(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayRt(medianRt);
        setTrendAnimateReady(true);
      }
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [medianRt, motionOk]);

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

  return (
    <div className="w-full flex justify-center py-2 sm:py-4">
      <Panel className="w-full max-w-[720px] space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-text">{t('check.resultsTitle')}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-surface text-muted">
              <strong className="text-text mr-1">Measurement:</strong> Lab version validated; this browser version is informal.
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted">
            {t('check.resultsSub')}
          </p>
        </div>

        {/* Plain labelled numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-3 rounded-md bg-surface border border-border">
            <span className="text-xs text-muted block">{t('check.medianRt')}</span>
            <span className="text-3xl sm:text-4xl font-bold font-display tabular-nums text-text block mt-1">
              {displayRt} <span className="text-base font-normal text-muted">ms</span>
            </span>
          </div>

          <div className="p-3 rounded-md bg-surface border border-border">
            <span className="text-xs text-muted block">{t('check.lapses')} (≥ 355 ms)</span>
            <span className="text-3xl sm:text-4xl font-bold font-display tabular-nums text-text block mt-1">
              {lapses}
            </span>
          </div>

          <div className="p-3 rounded-md bg-surface border border-border">
            <span className="text-xs text-muted block">{t('check.falseStarts')} (&lt; 100 ms)</span>
            <span className="text-3xl sm:text-4xl font-bold font-display tabular-nums text-text block mt-1">
              {falseStarts}
            </span>
          </div>
        </div>

        {/* Caution text sitting directly under the numbers */}
        <div className="text-xs text-muted leading-relaxed px-1">
          Compare with your own earlier checks, not with other people. Sleep, caffeine and time of day change results.
        </div>

        {/* History Trend Line */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text">{t('check.historyTitle')}</h2>
            <span className="text-xs text-muted font-mono">{baselineHistory.length} total</span>
          </div>
          <HistoryChart
            key={trendAnimateReady ? 'trend-draw' : 'trend-wait'}
            data={baselineHistory}
            animate={trendAnimateReady && motionOk}
          />
        </Card>

        <div className="pt-2">
          <Button variant="primary" onClick={onReset} className="w-full sm:w-auto min-h-[44px]">
            {t('check.btnRetake')}
          </Button>
        </div>
      </Panel>
    </div>
  );
};
