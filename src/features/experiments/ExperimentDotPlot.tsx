'use client';

import React, { useRef, useState } from 'react';
import { ExperimentAnalysis } from '@/lib/experiments';
import { getConditionById } from '@/lib/conditions';
import { gsap, useGSAP, getFx } from '@/lib/gsap';
import { ExperimentPairsTable } from './ExperimentPairsTable';

interface ExperimentDotPlotProps {
  analysis: ExperimentAnalysis;
}

export const ExperimentDotPlot: React.FC<ExperimentDotPlotProps> = ({ analysis }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeTooltip, setActiveTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const { activeStats, controlStats, pairs } = analysis;
  const activeCondition = getConditionById(analysis.activeConditionId);
  const controlCondition = getConditionById(analysis.controlConditionId);
  const isConcurrent = analysis.design === 'concurrent';

  const formatDelta = (val: number) =>
    isConcurrent ? `${val} ms` : `${val > 0 ? '+' : ''}${val} ms`;

  // Chart dimensions
  const W = 520;
  const H = 220;
  const padL = 50;
  const padR = 40;
  const padT = 30;
  const padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const allDeltas = [
    ...activeStats.deltas.map((d) => d.deltaRt),
    ...controlStats.deltas.map((d) => d.deltaRt),
  ];
  if (!isConcurrent) allDeltas.push(0);

  const rawMin = allDeltas.length > 0 ? Math.min(...allDeltas) : -40;
  const rawMax = allDeltas.length > 0 ? Math.max(...allDeltas) : 40;
  const yMin = Math.floor((rawMin - 15) / 10) * 10;
  const yMax = Math.ceil((rawMax + 15) / 10) * 10;
  const yRange = Math.max(20, yMax - yMin);

  const getY = (val: number) => padT + chartH - ((val - yMin) / yRange) * chartH;
  const xActive = padL + chartW * 0.3;
  const xControl = padL + chartW * 0.7;

  useGSAP(
    () => {
      if (!svgRef.current) return;
      const lines = svgRef.current.querySelectorAll<SVGLineElement>('.chart-draw-line');
      if (lines.length === 0) return;

      if (getFx() === 'off') {
        lines.forEach((line) => { line.style.strokeDashoffset = '0'; });
        return;
      }
      import('@/lib/gsap-draw').then(() => {
        if (!svgRef.current) return;
        const currentLines = svgRef.current.querySelectorAll('.chart-draw-line');
        gsap.fromTo(
          currentLines,
          { drawSVG: '0%' },
          { drawSVG: '100%', duration: 0.9, ease: 'focus', stagger: 0.08 }
        );
      });
    },
    { scope: svgRef, dependencies: [analysis] }
  );

  const hasData = activeStats.deltas.length > 0 || controlStats.deltas.length > 0;

  return (
    <div className="space-y-4">
      {/* Direct labels with non-color shape indicators */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text">
        <div className="inline-flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="var(--primary-bg)" stroke="var(--border)" strokeWidth="1.5" />
          </svg>
          <span>{activeCondition.name} (circle marker)</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <polygon points="7,2 12,7 7,12 2,7" fill="var(--muted)" stroke="var(--border)" strokeWidth="1.5" />
          </svg>
          <span>{controlCondition.name} (diamond marker)</span>
        </div>
      </div>

      {hasData ? (
        <div className="w-full relative aspect-[26/11] max-h-[240px] select-none bg-surface-2 rounded-md border border-border p-2">
          {activeTooltip && (
            <div
              className="absolute z-10 pointer-events-none px-2 py-1 text-[11px] font-mono rounded-xs bg-primary-bg text-primary-text border border-border shadow-elevation -translate-x-1/2 -translate-y-8"
              style={{ left: `${(activeTooltip.x / W) * 100}%`, top: `${(activeTooltip.y / H) * 100}%` }}
            >
              {activeTooltip.text}
            </div>
          )}

          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-full overflow-visible"
            role="img"
            aria-label="Reaction time delta dot plot"
          >
            {/* Grid & Zero baseline (crisp dashed reference line, not overridden by DrawSVG) */}
            {!isConcurrent && (
              <line
                x1={padL - 10}
                y1={getY(0)}
                x2={padL + chartW + 10}
                y2={getY(0)}
                stroke="var(--border-strong)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
            )}

            {/* Mean delta lines (drawn with DrawSVG) */}
            {activeStats.n > 0 && (
              <g>
                <line
                  x1={xActive - 35}
                  y1={getY(activeStats.meanDeltaRt)}
                  x2={xActive + 35}
                  y2={getY(activeStats.meanDeltaRt)}
                  stroke="var(--primary-bg)"
                  strokeWidth="2"
                  className="chart-draw-line"
                />
                <text
                  x={xActive + 40}
                  y={getY(activeStats.meanDeltaRt) + 3}
                  className="fill-[var(--text)] text-[9px] font-mono tabular-nums"
                >
                  Mean {activeStats.meanDeltaRt}ms
                </text>
              </g>
            )}

            {controlStats.n > 0 && (
              <g>
                <line
                  x1={xControl - 35}
                  y1={getY(controlStats.meanDeltaRt)}
                  x2={xControl + 35}
                  y2={getY(controlStats.meanDeltaRt)}
                  stroke="var(--muted)"
                  strokeWidth="2"
                  className="chart-draw-line"
                />
                <text
                  x={xControl + 40}
                  y={getY(controlStats.meanDeltaRt) + 3}
                  className="fill-[var(--muted)] text-[9px] font-mono tabular-nums"
                >
                  Mean {controlStats.meanDeltaRt}ms
                </text>
              </g>
            )}

            {/* X-axis labels */}
            <text x={xActive} y={H - 12} textAnchor="middle" className="fill-[var(--text)] text-[11px] font-bold">
              {activeCondition.name}
            </text>
            <text x={xControl} y={H - 12} textAnchor="middle" className="fill-[var(--muted)] text-[11px] font-bold">
              {controlCondition.name}
            </text>

            {/* Y-axis Ticks */}
            <text x={padL - 12} y={padT + 4} textAnchor="end" className="fill-[var(--muted)] text-[10px] font-mono tabular-nums">
              {yMax}ms
            </text>
            <text x={padL - 12} y={padT + chartH + 3} textAnchor="end" className="fill-[var(--muted)] text-[10px] font-mono tabular-nums">
              {yMin}ms
            </text>

            {/* Active Data Points (Circles) */}
            {activeStats.deltas.map((d, i) => {
              const y = getY(d.deltaRt);
              return (
                <circle
                  key={`act-${i}`}
                  cx={xActive}
                  cy={y}
                  r="5.5"
                  fill="var(--primary-bg)"
                  stroke="var(--border)"
                  strokeWidth="1.5"
                  className="cursor-pointer focus:outline-none transition-transform hover:scale-125"
                  tabIndex={0}
                  onMouseEnter={() => setActiveTooltip({ text: `Run ${i + 1}: ${formatDelta(d.deltaRt)}`, x: xActive, y })}
                  onMouseLeave={() => setActiveTooltip(null)}
                  aria-label={`${activeCondition.name} Run ${i + 1}: ${formatDelta(d.deltaRt)}`}
                />
              );
            })}

            {/* Control Data Points (Diamonds) */}
            {controlStats.deltas.map((d, i) => {
              const y = getY(d.deltaRt);
              return (
                <polygon
                  key={`ctl-${i}`}
                  points={`${xControl},${y - 6} ${xControl + 6},${y} ${xControl},${y + 6} ${xControl - 6},${y}`}
                  fill="var(--muted)"
                  stroke="var(--border)"
                  strokeWidth="1.5"
                  className="cursor-pointer focus:outline-none transition-transform hover:scale-125"
                  tabIndex={0}
                  onMouseEnter={() => setActiveTooltip({ text: `Control Run ${i + 1}: ${formatDelta(d.deltaRt)}`, x: xControl, y })}
                  onMouseLeave={() => setActiveTooltip(null)}
                  aria-label={`${controlCondition.name} Run ${i + 1}: ${formatDelta(d.deltaRt)}`}
                />
              );
            })}
          </svg>
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-muted border border-border rounded-md bg-surface">
          No completed runs to plot yet.
        </div>
      )}

      {/* Responsive pairs table stacking under 640px */}
      <ExperimentPairsTable
        pairs={pairs}
        activeCondition={activeCondition}
        controlCondition={controlCondition}
        isConcurrent={isConcurrent}
        formatDelta={formatDelta}
      />
    </div>
  );
};

export default ExperimentDotPlot;
