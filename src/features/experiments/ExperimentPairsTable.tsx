'use client';

import React from 'react';
import { PairComparison } from '@/lib/experiments';
import { ExperimentCondition } from '@/lib/conditions';

interface ExperimentPairsTableProps {
  pairs: PairComparison[];
  activeCondition: ExperimentCondition;
  controlCondition: ExperimentCondition;
  isConcurrent: boolean;
  formatDelta: (val: number) => string;
}

export const ExperimentPairsTable: React.FC<ExperimentPairsTableProps> = ({
  pairs,
  activeCondition,
  controlCondition,
  isConcurrent,
  formatDelta,
}) => {
  if (pairs.length === 0) return null;

  return (
    <div className="space-y-2 pt-2">
      {/* Stacked cards for mobile under 640px */}
      <div className="block sm:hidden space-y-2">
        <span className="text-xs font-semibold text-muted block">
          Run pairs list
        </span>
        {pairs.map((p) => (
          <div key={p.pairIndex} className="p-3.5 rounded-sm border border-border bg-surface space-y-2 text-xs">
            <div className="flex justify-between items-center border-b border-border pb-1.5">
              <span className="font-bold text-text">Pair #{p.pairIndex}</span>
              <span className="font-semibold text-text">
                {p.isWin ? `${activeCondition.name} faster` : p.isTie ? 'Tie' : `${controlCondition.name} faster`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono tabular-nums">
              <div>
                <span className="text-[10px] text-muted block">{activeCondition.name}:</span>
                <span className="text-text font-medium">{formatDelta(p.xDelta.deltaRt)}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block">{controlCondition.name}:</span>
                <span className="text-text font-medium">{formatDelta(p.restDelta.deltaRt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table on tablets and desktop >= 640px */}
      <div className="hidden sm:block overflow-x-auto border border-border rounded-md bg-surface">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-2 border-b border-border text-muted font-medium">
            <tr>
              <th className="p-3">Pair #</th>
              <th className="p-3">{activeCondition.name} {isConcurrent ? 'RT' : 'Δ RT'}</th>
              <th className="p-3">{controlCondition.name} {isConcurrent ? 'RT' : 'Δ RT'}</th>
              <th className="p-3">Faster Condition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border tabular-nums font-mono">
            {pairs.map((p) => (
              <tr key={p.pairIndex} className="hover:bg-surface-2">
                <td className="p-3">#{p.pairIndex}</td>
                <td className="p-3">{formatDelta(p.xDelta.deltaRt)}</td>
                <td className="p-3">{formatDelta(p.restDelta.deltaRt)}</td>
                <td className="p-3 font-sans font-semibold text-text">
                  {p.isWin ? activeCondition.name : p.isTie ? 'Tie' : controlCondition.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExperimentPairsTable;
