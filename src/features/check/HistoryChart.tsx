'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface HistoryPoint {
  index: number;
  medianRt: number;
  dateStr: string;
}

interface HistoryChartProps {
  data: HistoryPoint[];
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-muted">
        No earlier baseline checks recorded yet.
      </div>
    );
  }

  return (
    <div className="w-full h-48 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
          <XAxis
            dataKey="index"
            stroke="var(--muted)"
            fontSize={11}
            tickLine={false}
            tickFormatter={(val) => `#${val}`}
          />
          <YAxis
            stroke="var(--muted)"
            fontSize={11}
            tickLine={false}
            unit="ms"
            domain={['dataMin - 20', 'dataMax + 20']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface-2)',
              borderColor: 'var(--border)',
              borderRadius: '6px',
              fontSize: '12px',
              color: 'var(--text)',
            }}
            formatter={(value: number) => [`${value} ms`, 'Median RT']}
            labelFormatter={(label) => {
              const item = data.find((d) => d.index === label);
              return item ? `Check #${item.index} (${item.dateStr})` : `Check #${label}`;
            }}
          />
          <Line
            type="monotone"
            dataKey="medianRt"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--accent)' }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;
