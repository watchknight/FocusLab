import React from 'react';
import clsx from 'clsx';
import { Card } from './Card';

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  subtext?: string;
  change?: {
    value: string | number;
    trend: 'positive' | 'negative' | 'neutral';
  };
}

export const Stat: React.FC<StatProps> = ({
  label,
  value,
  subtext,
  change,
  className,
  ...props
}) => {
  return (
    <Card className={clsx('space-y-1', className)} {...props}>
      <p className="text-xs font-semibold text-muted">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-text tabular-nums font-mono">
          {value}
        </span>
        {change && (
          <span
            className={clsx(
              'text-xs font-semibold font-mono tabular-nums',
              change.trend === 'positive' && 'text-ok',
              change.trend === 'negative' && 'text-warn',
              change.trend === 'neutral' && 'text-muted'
            )}
          >
            {change.value}
          </span>
        )}
      </div>
      {subtext && <p className="text-xs text-muted">{subtext}</p>}
    </Card>
  );
};
