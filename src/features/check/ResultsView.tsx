'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Panel } from '@/components/ui/Panel';
import { CheckResult } from '@/store/types';
import { useFocusLabStore } from '@/store';
import { useT } from '@/i18n';
import { scrambleTo } from '@/lib/motion/scramble-to';
import HistoryChart from './HistoryChart';
import { shareOrDownloadCard } from './generateShareCard';

interface ResultsViewProps {
  result: CheckResult;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const { t } = useT();
  const allChecks = useFocusLabStore((state) => state.checks);
  const { medianRt, lapses, falseStarts } = result.metrics;
  const medianRtRef = useRef<HTMLSpanElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    try {
      setIsSharing(true);
      await shareOrDownloadCard(result);
    } catch {
      // Ignored
    } finally {
      setIsSharing(false);
    }
  };

  useEffect(() => {
    if (medianRtRef.current) {
      scrambleTo(medianRtRef.current, `${medianRt}`);
    }
  }, [medianRt]);

  const baselineHistory = useMemo(
    () =>
      allChecks
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
        })),
    [allChecks]
  );

  return (
    <div className="w-full flex justify-center py-4 sm:py-8">
      <Panel className="w-full max-w-[720px] space-y-6">
        <div className="space-y-3">
          <h1 className="font-display font-[780] text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] text-text text-balance">
            {t('check.resultsTitle')}
          </h1>
          <p className="text-xs font-mono text-muted">
            Lab version validated; this browser version is informal.
          </p>
          <p className="text-base sm:text-lg text-muted leading-relaxed">
            {t('check.resultsSub')}
          </p>
        </div>

        {/* Plain labelled numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 sm:p-5 rounded-[16px] bg-surface-2 border border-border shadow-xs space-y-1">
            <span className="text-xs font-medium text-muted block">{t('check.medianRt')}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                ref={medianRtRef}
                className="text-3xl sm:text-4xl font-bold font-mono tracking-tight tabular-nums text-text block"
              >
                {medianRt}
              </span>
              <span className="text-base font-normal text-muted">ms</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-[16px] bg-surface-2 border border-border shadow-xs space-y-1">
            <span className="text-xs font-medium text-muted block">{t('check.lapses')} (≥ 355 ms)</span>
            <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight tabular-nums text-text block mt-1">
              {lapses}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-[16px] bg-surface-2 border border-border shadow-xs space-y-1">
            <span className="text-xs font-medium text-muted block">{t('check.falseStarts')} (&lt; 100 ms)</span>
            <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight tabular-nums text-text block mt-1">
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
          <HistoryChart data={baselineHistory} />
        </Card>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="primary"
            onClick={onReset}
            className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
          >
            {t('check.btnRetake')}
          </Button>
          <Button
            variant="secondary"
            onClick={handleShare}
            disabled={isSharing}
            className="w-full sm:w-auto min-h-[52px] h-[52px] px-6 rounded-full text-sm font-semibold"
          >
            {isSharing ? 'Generating card...' : 'Share Card (1080×1350)'}
          </Button>
        </div>
      </Panel>
    </div>
  );
};
