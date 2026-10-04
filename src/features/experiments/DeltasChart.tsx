'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export interface ChartDatum {
  activity: string;
  energyChange: number;
  distractionChange: number;
  moodChange: number;
}

interface DeltasChartProps {
  data: ChartDatum[];
}

export const DeltasChart: React.FC<DeltasChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-content-muted">
        No paired check sessions available for visual comparison yet.
      </div>
    );
  }

  return (
    <div className="w-full h-64" aria-label="Bar chart comparing pre- and post-activity state changes">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis
            dataKey="activity"
            stroke="var(--text-secondary)"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke="var(--text-secondary)"
            fontSize={11}
            domain={[-4, 4]}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: 'var(--border-subtle)',
              borderRadius: '6px',
              fontSize: '12px',
              color: 'var(--text-primary)',
            }}
          />
          <ReferenceLine y={0} stroke="var(--border-strong)" />
          <Bar dataKey="energyChange" fill="var(--teal-accent)" name="Energy Change" />
          <Bar dataKey="distractionChange" fill="#704b12" name="Distraction Change" />
          <Bar dataKey="moodChange" fill="#2b556b" name="Mood Change" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
