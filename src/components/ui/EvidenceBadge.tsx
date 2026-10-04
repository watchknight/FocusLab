import React from 'react';
import { EvidenceLevel } from '@/content/types';

interface EvidenceBadgeProps {
  level: EvidenceLevel;
  className?: string;
}

const BADGE_CONFIG: Record<
  EvidenceLevel,
  { label: string; icon: string; borderClass: string; textClass: string }
> = {
  strong: {
    label: 'Evidence: Strong',
    icon: '● [High-Replication]',
    borderClass: 'border-teal-accent',
    textClass: 'text-teal-accent',
  },
  moderate: {
    label: 'Evidence: Moderate',
    icon: '◈ [Controlled-Trials]',
    borderClass: 'border-surface-border-strong',
    textClass: 'text-content-primary',
  },
  mixed: {
    label: 'Evidence: Mixed',
    icon: '◐ [Context-Dependent]',
    borderClass: 'border-surface-border-strong',
    textClass: 'text-content-secondary',
  },
  emerging: {
    label: 'Evidence: Emerging',
    icon: '◇ [Pilot/Exploratory]',
    borderClass: 'border-surface-border',
    textClass: 'text-content-muted',
  },
  'not-supported': {
    label: 'Evidence: Not Supported',
    icon: '✕ [Disconfirmed]',
    borderClass: 'border-surface-border-strong',
    textClass: 'text-content-primary',
  },
};

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  level,
  className = '',
}) => {
  const config = BADGE_CONFIG[level] || BADGE_CONFIG['emerging'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border bg-surface-secondary ${config.borderClass} ${config.textClass} ${className}`}
      role="status"
      aria-label={`Scientific evidence level: ${config.label}`}
    >
      <span aria-hidden="true" className="font-mono">
        {config.icon}
      </span>
      <span>{config.label}</span>
    </span>
  );
};
