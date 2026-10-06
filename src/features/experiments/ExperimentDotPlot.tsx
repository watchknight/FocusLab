'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { ExperimentAnalysis } from '@/lib/experiments';
import { getConditionById } from '@/lib/conditions';

interface ExperimentDotPlotProps {
  analysis: ExperimentAnalysis;
}

export const ExperimentDotPlot: React.FC<ExperimentDotPlotProps> = ({ analysis }) => {
  const { activeStats, controlStats, pairs } = analysis;
  const activeCondition = getConditionById(analysis.activeConditionId);
  const controlCondition = getConditionById(analysis.controlConditionId);

  const scatterDataX = activeStats.deltas.map((d, i) => ({
    x: 1,
    y: d.deltaRt,
    runNumber: i + 1,
    condition: activeCondition.name,
    deltaLapses: d.deltaLapses,
  }));

  const scatterDataRest = controlStats.deltas.map((d, i) => ({
    x: 2,
    y: d.deltaRt,
    runNumber: i + 1,
    condition: controlCondition.name,
    deltaLapses: d.deltaLapses,
  }));

  const hasData = scatterDataX.length > 0 || scatterDataRest.length > 0;
  const isConcurrent = analysis.design === 'concurrent';

  const formatDelta = (val: number) =>
    isConcurrent ? `${val} ms` : `${val > 0 ? '+' : ''}${val} ms`;

  return (
    <div className="space-y-4">
      {/* Direct Labels with Shape Indicators */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text">
        <div className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-accent inline-block border border-border shrink-0" aria-hidden="true" />
          <span>{activeCondition.name} (circle marker)</span>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rotate-45 bg-muted inline-block border border-border shrink-0" aria-hidden="true" />
          <span>{controlCondition.name} (diamond marker)</span>
        </div>
      </div>

      {hasData ? (
        <div className="w-full h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis
                type="number"
                dataKey="x"
                domain={[0.5, 2.5]}
                ticks={[1, 2]}
                tickFormatter={(val) => (val === 1 ? activeCondition.name : controlCondition.name)}
                stroke="var(--muted)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={isConcurrent ? 'Reaction Time' : 'Delta RT'}
                unit=" ms"
                stroke="var(--muted)"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface-2)',
                  borderColor: 'var(--border)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: 'var(--text)',
                }}
                formatter={(val: number) => [
                  `${isConcurrent ? val : (val > 0 ? '+' : '') + val} ms`,
                  isConcurrent ? 'Reaction Time' : 'Delta RT',
                ]}
              />
              {!isConcurrent && <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1.5} />}
              {activeStats.n > 0 && (
                <ReferenceLine
                  y={activeStats.meanDeltaRt}
                  stroke="var(--accent)"
                  strokeDasharray="4 4"
                  label={{ value: `Mean ${activeStats.meanDeltaRt}ms`, fill: 'var(--accent)', fontSize: 10, position: 'insideTopLeft' }}
                />
              )}
              {controlStats.n > 0 && (
                <ReferenceLine
                  y={controlStats.meanDeltaRt}
                  stroke="var(--muted)"
                  strokeDasharray="4 4"
                  label={{ value: `Control Mean ${controlStats.meanDeltaRt}ms`, fill: 'var(--muted)', fontSize: 10, position: 'insideTopRight' }}
                />
              )}
              <Scatter name={activeCondition.name} data={scatterDataX} fill="var(--accent)" shape="circle" isAnimationActive={false} />
              <Scatter name={controlCondition.name} data={scatterDataRest} fill="var(--muted)" shape="diamond" isAnimationActive={false} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-xs text-muted text-center py-4">No completed runs to plot yet.</p>
      )}

      {/* Responsive Runs Display: Stacked Rows under 640px, Table on sm+ */}
      {pairs.length === 0 ? (
        <div className="p-3 text-center text-xs text-muted border border-border rounded-md bg-surface">
          No completed pairs yet.
        </div>
      ) : (
        <>
          {/* Mobile Stacked Rows (< 640px) */}
          <div className="block sm:hidden space-y-2">
            <span className="text-xs font-semibold text-muted block">Run pairs list</span>
            {pairs.map((p) => (
              <div key={p.pairIndex} className="p-3 rounded-md border border-border bg-surface space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-border/50 pb-1">
                  <span className="font-semibold text-text">Pair #{p.pairIndex}</span>
                  <span className="font-medium text-xs">
                    {p.isWin ? (
                      <span className="text-ok font-semibold">{activeCondition.name} won</span>
                    ) : p.isTie ? (
                      <span className="text-muted">Tie</span>
                    ) : (
                      <span className="text-muted">{controlCondition.name} won</span>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 tabular-nums">
                  <div>
                    <span className="text-[11px] text-muted block">{activeCondition.name}:</span>
                    <span className="font-mono text-text font-medium">{formatDelta(p.xDelta.deltaRt)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted block">{controlCondition.name}:</span>
                    <span className="font-mono text-text font-medium">{formatDelta(p.restDelta.deltaRt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table on Desktop / Tablets (>= 640px) */}
          <div className="hidden sm:block overflow-x-auto border border-border rounded-md bg-surface">
            <table className="w-full text-left text-xs">
              <caption className="sr-only">Detailed run-by-run reaction times</caption>
              <thead className="bg-surface-2 border-b border-border text-muted font-medium">
                <tr>
                  <th className="p-2.5">Pair #</th>
                  <th className="p-2.5">{activeCondition.name} {isConcurrent ? 'RT' : 'Δ RT'}</th>
                  <th className="p-2.5">{controlCondition.name} {isConcurrent ? 'RT' : 'Δ RT'}</th>
                  <th className="p-2.5">Pair Winner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border tabular-nums font-mono">
                {pairs.map((p) => (
                  <tr key={p.pairIndex} className="hover:bg-surface-2/40">
                    <td className="p-2.5">#{p.pairIndex}</td>
                    <td className="p-2.5">{formatDelta(p.xDelta.deltaRt)}</td>
                    <td className="p-2.5">{formatDelta(p.restDelta.deltaRt)}</td>
                    <td className="p-2.5 font-sans font-semibold">
                      {p.isWin ? (
                        <span className="text-ok">{activeCondition.name}</span>
                      ) : p.isTie ? (
                        <span className="text-muted">Tie</span>
                      ) : (
                        <span className="text-muted">{controlCondition.name}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ExperimentDotPlot;
