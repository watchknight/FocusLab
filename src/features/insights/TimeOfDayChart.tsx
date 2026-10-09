'use client';

import React from 'react';
import clsx from 'clsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useMotionAllowed } from '@/lib/motion';

export interface TimeOfDayData {
  period: string;
  label: string;
  count: number;
}

interface TimeOfDayChartProps {
  data: TimeOfDayData[];
}

export const TimeOfDayChart: React.FC<TimeOfDayChartProps> = ({ data }) => {
  const motionAllowed = useMotionAllowed();

  return (
    <div className="space-y-4">
      <div className="w-full h-48 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
            <XAxis
              dataKey="period"
              stroke="var(--muted)"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="var(--muted)"
              fontSize={11}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface-2)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--text)',
              }}
              formatter={(value: number) => [`${value} session${value === 1 ? '' : 's'}`, 'Volume']}
              labelFormatter={(label) => {
                const item = data.find((d) => d.period === label);
                return item ? item.label : String(label);
              }}
            />
            <Bar
              dataKey="count"
              fill="var(--primary-bg)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={motionAllowed}
              animationDuration={500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible data summary plate for screen readers and small devices */}
      <div className="rounded-[16px] bg-surface border border-border grid grid-cols-2 sm:grid-cols-4 shadow-xs overflow-hidden">
        {data.map((item, idx) => (
          <div
            key={item.period}
            className={clsx(
              'p-3 text-center min-w-0',
              idx === 1 && 'border-l border-border',
              idx === 2 && 'border-t sm:border-t-0 sm:border-l border-border',
              idx === 3 && 'border-l border-t sm:border-t-0 sm:border-l border-border'
            )}
          >
            <span className="text-[11px] text-muted block truncate">{item.label}</span>
            <span className="text-base sm:text-lg font-bold font-display tabular-nums text-text">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeOfDayChart;
