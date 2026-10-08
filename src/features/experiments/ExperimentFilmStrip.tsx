'use client';

import React from 'react';
import { Experiment, CheckResult } from '@/store/types';
import { computeRunDelta } from '@/lib/experiments';
import { getConditionById } from '@/lib/conditions';

interface ExperimentFilmStripProps {
  schedule: Experiment['schedule'];
  runs: Experiment['runs'];
  completedCount: number;
  allChecks: CheckResult[];
  isConcurrent: boolean;
}

export const ExperimentFilmStrip: React.FC<ExperimentFilmStripProps> = ({
  schedule,
  runs,
  completedCount,
  allChecks,
  isConcurrent,
}) => {
  const checksMap = new Map(allChecks.map((c) => [c.id, c]));

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-muted block uppercase tracking-wider">
        Run Film-strip (10 frames)
      </span>
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex gap-2 min-w-max">
          {schedule.map((item, idx) => {
            const cond = getConditionById(item.conditionId);
            const run = runs[idx];
            const isDone = idx < completedCount;
            const isCurrent = idx === completedCount;
            const isRest = item.conditionId === 'rest' || item.conditionId === 'sound:silence';

            let deltaText = 'Pending';
            if (isDone && run) {
              const delta = computeRunDelta(run, checksMap, isConcurrent);
              if (delta) {
                deltaText = isConcurrent
                  ? `${delta.deltaRt} ms`
                  : `${delta.deltaRt > 0 ? '+' : ''}${delta.deltaRt} ms`;
              } else {
                deltaText = 'Done';
              }
            } else if (isCurrent) {
              deltaText = 'Next';
            }

            return (
              <div
                key={idx}
                className={`w-32 rounded-sm border p-2 flex flex-col justify-between text-xs transition-colors ${
                  isDone
                    ? 'bg-surface border-border-strong text-text'
                    : isCurrent
                    ? 'bg-surface-2 border-primary-bg text-text ring-1 ring-ring'
                    : 'bg-surface-2/60 border-border text-muted'
                }`}
              >
                <div className="flex items-center justify-between pb-1 border-b border-border text-[10px] font-mono text-muted">
                  <span>#{String(idx + 1).padStart(2, '0')}</span>
                  {isRest ? (
                    <span className="w-2 h-2 rotate-45 bg-muted inline-block" title="Rest marker" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-primary-bg inline-block" title="Activity marker" />
                  )}
                </div>
                <div className="py-2 space-y-0.5">
                  <span className="font-bold text-text block truncate text-[11px]">
                    {cond.name}
                  </span>
                  <span className="text-[10px] text-muted block">
                    {isRest ? 'Control rest' : 'Practice'}
                  </span>
                </div>
                <div className="pt-1 border-t border-border font-mono font-semibold tabular-nums text-[11px] text-text">
                  {deltaText}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExperimentFilmStrip;
