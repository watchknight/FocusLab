'use client';

import React, { useRef, useState } from 'react';
import { gsap, useGSAP, getFx } from '@/lib/gsap';

export interface HistoryPoint {
  index: number;
  medianRt: number;
  dateStr: string;
}

interface HistoryChartProps {
  data: HistoryPoint[];
  animate?: boolean;
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ data, animate = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [activePoint, setActivePoint] = useState<HistoryPoint | null>(null);

  useGSAP(
    () => {
      if (!pathRef.current || data.length < 2) return;
      const fx = getFx();
      if (fx === 'off' || !animate) {
        if (pathRef.current) pathRef.current.style.strokeDashoffset = '0';
        return;
      }
      import('@/lib/gsap-draw').then(() => {
        if (!pathRef.current) return;
        gsap.fromTo(
          pathRef.current,
          { drawSVG: '0%' },
          { drawSVG: '100%', duration: 1.1, ease: 'focus' }
        );
      });
    },
    { scope: containerRef, dependencies: [data, animate] }
  );

  if (data.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-muted font-mono" aria-hidden="true">
        No earlier baseline checks recorded yet.
      </div>
    );
  }

  // Layout bounds
  const W = 520;
  const H = 180;
  const padL = 48;
  const padR = 24;
  const padT = 20;
  const padB = 32;

  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const rts = data.map((d) => d.medianRt);
  const rawMin = Math.min(...rts);
  const rawMax = Math.max(...rts);
  const yMin = Math.max(100, Math.floor((rawMin - 20) / 10) * 10);
  const yMax = Math.max(yMin + 40, Math.ceil((rawMax + 20) / 10) * 10);
  const yRange = yMax - yMin;

  const points = data.map((d, i) => {
    const x = data.length === 1 ? padL + chartW / 2 : padL + (i / (data.length - 1)) * chartW;
    const y = padT + chartH - ((d.medianRt - yMin) / yRange) * chartH;
    return { ...d, x, y };
  });

  const pathD =
    points.length === 1
      ? `M ${padL} ${points[0].y} L ${padL + chartW} ${points[0].y}`
      : `M ${points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`;

  const yTicks = [
    { val: yMax, y: padT },
    { val: Math.round((yMax + yMin) / 2), y: padT + chartH / 2 },
    { val: yMin, y: padT + chartH },
  ];

  return (
    <div ref={containerRef} className="w-full space-y-2">
      {/* Active tooltip indicator */}
      <div className="h-5 flex items-center justify-between text-xs font-mono text-muted px-1">
        <span>{activePoint ? `Check #${activePoint.index} (${activePoint.dateStr})` : 'Recent trend'}</span>
        <span className="font-semibold text-text tabular-nums">
          {activePoint ? `${activePoint.medianRt} ms` : `${data[data.length - 1].medianRt} ms latest`}
        </span>
      </div>

      <div className="w-full aspect-[26/9] max-h-[200px] relative select-none">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Reaction time trend line chart"
        >
          {/* Horizontal grid lines and Y-axis labels */}
          {yTicks.map((t, idx) => (
            <g key={idx}>
              <line
                x1={padL}
                y1={t.y}
                x2={padL + chartW}
                y2={t.y}
                stroke="var(--border)"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <text
                x={padL - 8}
                y={t.y + 3.5}
                textAnchor="end"
                className="fill-[var(--muted)] text-[10px] font-mono tabular-nums"
              >
                {t.val}ms
              </text>
            </g>
          ))}

          {/* DrawSVG trend line */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="var(--primary-bg)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive data point dots */}
          {points.map((p) => {
            const isHovered = activePoint?.index === p.index;
            return (
              <g
                key={p.index}
                className="cursor-pointer focus:outline-none"
                tabIndex={0}
                onMouseEnter={() => setActivePoint(p)}
                onMouseLeave={() => setActivePoint(null)}
                onFocus={() => setActivePoint(p)}
                onBlur={() => setActivePoint(null)}
                aria-label={`Check #${p.index}: ${p.medianRt} ms on ${p.dateStr}`}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 3.5}
                  fill="var(--surface)"
                  stroke="var(--primary-bg)"
                  strokeWidth={isHovered ? '2.5' : '2'}
                  className="transition-all duration-150"
                />
                {/* Touch target hit area */}
                <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
                {/* X-axis tick label */}
                <text
                  x={p.x}
                  y={H - 10}
                  textAnchor="middle"
                  className="fill-[var(--muted)] text-[10px] font-mono tabular-nums"
                >
                  #{p.index}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Screen-reader summary */}
      <div className="sr-only">
        <ul>
          {data.map((d) => (
            <li key={d.index}>
              Check {d.index} on {d.dateStr}: median {d.medianRt} milliseconds
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistoryChart;
