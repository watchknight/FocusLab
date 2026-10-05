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

  // Prepare scatter data
  // Condition X on x=1, Rest on x=2
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

  return (
    <div className="space-y-4">
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
                  label={{
                    value: `Mean ${activeStats.meanDeltaRt}ms`,
                    fill: 'var(--accent)',
                    fontSize: 10,
                    position: 'insideTopLeft',
                  }}
                />
              )}
              {controlStats.n > 0 && (
                <ReferenceLine
                  y={controlStats.meanDeltaRt}
                  stroke="var(--muted)"
                  strokeDasharray="4 4"
                  label={{
                    value: `Control Mean ${controlStats.meanDeltaRt}ms`,
                    fill: 'var(--muted)',
                    fontSize: 10,
                    position: 'insideTopRight',
                  }}
                />
              )}
              <Scatter name={activeCondition.name} data={scatterDataX} fill="var(--accent)" />
              <Scatter name={controlCondition.name} data={scatterDataRest} fill="var(--muted)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-xs text-muted text-center py-4">No completed runs to plot yet.</p>
      )}

      {/* Accessible Table Fallback for Screen Readers & Clarity */}
      <div className="overflow-x-auto border border-border rounded-md bg-surface">
        <table className="w-full text-left text-xs">
          <caption className="sr-only">Detailed run-by-run reaction times</caption>
          <thead className="bg-surface-2 border-b border-border text-muted font-medium">
            <tr>
              <th className="p-2">Pair #</th>
              <th className="p-2">{activeCondition.name} {isConcurrent ? 'RT' : 'Δ RT'}</th>
              <th className="p-2">{controlCondition.name} {isConcurrent ? 'RT' : 'Δ RT'}</th>
              <th className="p-2">Pair Winner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pairs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-3 text-center text-muted">
                  No completed pairs yet.
                </td>
              </tr>
            ) : (
              pairs.map((p) => (
                <tr key={p.pairIndex} className="hover:bg-surface-2/40">
                  <td className="p-2 font-mono">#{p.pairIndex}</td>
                  <td className="p-2 font-mono">
                    {isConcurrent
                      ? `${p.xDelta.deltaRt} ms`
                      : `${p.xDelta.deltaRt > 0 ? '+' : ''}${p.xDelta.deltaRt} ms`}
                  </td>
                  <td className="p-2 font-mono">
                    {isConcurrent
                      ? `${p.restDelta.deltaRt} ms`
                      : `${p.restDelta.deltaRt > 0 ? '+' : ''}${p.restDelta.deltaRt} ms`}
                  </td>
                  <td className="p-2 font-semibold">
                    {p.isWin ? (
                      <span className="text-accent">{activeCondition.name}</span>
                    ) : p.isTie ? (
                      <span className="text-muted">Tie</span>
                    ) : (
                      <span className="text-muted">{controlCondition.name}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExperimentDotPlot;
