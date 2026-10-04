import React from 'react';
import clsx from 'clsx';

export type EvidenceTier =
  | 'strong'
  | 'moderate'
  | 'mixed'
  | 'emerging'
  | 'not-supported';

export interface EvidenceBadgeProps {
  tier: EvidenceTier;
  level?: EvidenceTier; // Backwards-compatible alias
  className?: string;
}

const TIER_CONFIG: Record<
  EvidenceTier,
  { label: string; icon: string; borderClass: string; textClass: string }
> = {
  strong: {
    label: 'Evidence: Strong',
    icon: '● [High-Replication]',
    borderClass: 'border-accent',
    textClass: 'text-accent',
  },
  moderate: {
    label: 'Evidence: Moderate',
    icon: '◈ [Controlled-Trials]',
    borderClass: 'border-border',
    textClass: 'text-text',
  },
  mixed: {
    label: 'Evidence: Mixed',
    icon: '◐ [Context-Dependent]',
    borderClass: 'border-warn',
    textClass: 'text-warn',
  },
  emerging: {
    label: 'Evidence: Emerging',
    icon: '◇ [Pilot/Exploratory]',
    borderClass: 'border-border',
    textClass: 'text-muted',
  },
  'not-supported': {
    label: 'Evidence: Not Supported',
    icon: '✕ [Disconfirmed]',
    borderClass: 'border-warn',
    textClass: 'text-text',
  },
};

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  tier,
  level,
  className,
}) => {
  const activeTier = tier || level || 'emerging';
  const config = TIER_CONFIG[activeTier] || TIER_CONFIG['emerging'];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border bg-surface-2',
        config.borderClass,
        config.textClass,
        className
      )}
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
