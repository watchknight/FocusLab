import React from 'react';
import clsx from 'clsx';

export type EvidenceTier =
  | 'strong'
  | 'moderate'
  | 'mixed'
  | 'emerging'
  | 'not-supported';

export interface EvidenceMeterProps {
  tier: EvidenceTier;
  level?: EvidenceTier; // Backwards-compatible alias
  className?: string;
  showLabel?: boolean;
}

interface TierConfig {
  label: string;
  filledBars: number;
  hasZigzag?: boolean;
  hasSlash?: boolean;
  colorClass: string;
  barColorClass: string;
}

const TIER_CONFIG: Record<EvidenceTier, TierConfig> = {
  strong: {
    label: 'Strong evidence',
    filledBars: 4,
    colorClass: 'text-tier-strong',
    barColorClass: 'bg-tier-strong',
  },
  moderate: {
    label: 'Moderate evidence',
    filledBars: 3,
    colorClass: 'text-tier-moderate',
    barColorClass: 'bg-tier-moderate',
  },
  mixed: {
    label: 'Mixed evidence',
    filledBars: 2,
    hasZigzag: true,
    colorClass: 'text-tier-mixed',
    barColorClass: 'bg-tier-mixed',
  },
  emerging: {
    label: 'Emerging evidence',
    filledBars: 1,
    colorClass: 'text-tier-emerging',
    barColorClass: 'bg-tier-emerging',
  },
  'not-supported': {
    label: 'Not supported',
    filledBars: 0,
    hasSlash: true,
    colorClass: 'text-tier-not-supported',
    barColorClass: 'bg-tier-not-supported',
  },
};

export const EvidenceMeter: React.FC<EvidenceMeterProps> = ({
  tier,
  level,
  className,
  showLabel = true,
}) => {
  const activeTier = tier || level || 'emerging';
  const config = TIER_CONFIG[activeTier] || TIER_CONFIG.emerging;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 text-xs font-semibold shrink-0 select-none',
        config.colorClass,
        className
      )}
      role="status"
      aria-label={`Evidence level: ${config.label}`}
    >
      <span
        aria-hidden="true"
        className="inline-flex items-center gap-[3px] h-3.5 relative"
      >
        {[0, 1, 2, 3].map((index) => {
          const isFilled = index < config.filledBars;
          return (
            <span
              key={index}
              className={clsx(
                'w-[3.5px] h-3 rounded-[1px] transition-colors',
                isFilled
                  ? config.barColorClass
                  : 'bg-border/60 border border-border'
              )}
            />
          );
        })}
        {config.hasZigzag && (
          <span
            className="text-[10px] leading-none font-bold ml-0.5"
            title="Mixed results"
          >
            ↯
          </span>
        )}
        {config.hasSlash && (
          <span
            className="text-[10px] leading-none font-bold ml-0.5"
            title="Not supported"
          >
            /
          </span>
        )}
      </span>

      {showLabel && <span className="leading-none tracking-normal">{config.label}</span>}
    </span>
  );
};

// Backwards-compatible export
export const EvidenceBadge = EvidenceMeter;
export default EvidenceMeter;
