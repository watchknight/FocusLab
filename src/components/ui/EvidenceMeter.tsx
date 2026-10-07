'use client';

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
  size?: number; // Default 28px
}

interface TierConfig {
  label: string;
  colorClass: string;
}

const TIER_CONFIG: Record<EvidenceTier, TierConfig> = {
  strong: {
    label: 'Strong evidence',
    colorClass: 'text-tier-strong',
  },
  moderate: {
    label: 'Moderate evidence',
    colorClass: 'text-tier-moderate',
  },
  mixed: {
    label: 'Mixed evidence',
    colorClass: 'text-tier-mixed',
  },
  emerging: {
    label: 'Emerging evidence',
    colorClass: 'text-tier-emerging',
  },
  'not-supported': {
    label: 'Not supported',
    colorClass: 'text-tier-not-supported',
  },
};

export const EvidenceMeter: React.FC<EvidenceMeterProps> = ({
  tier,
  level,
  className,
  showLabel = true,
  size = 28,
}) => {
  const activeTier = tier || level || 'emerging';
  const config = TIER_CONFIG[activeTier] || TIER_CONFIG.emerging;

  return (
    <span
      className={clsx(
        'evidence-meter inline-flex items-center gap-2 text-xs font-semibold shrink-0 select-none group',
        config.colorClass,
        className
      )}
      role="status"
      aria-label={`Evidence level: ${config.label}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="evidence-meter-target shrink-0 transition-[filter] duration-300 group-hover:[filter:blur(0px)] group-hover:animate-[rack-focus_300ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        {activeTier === 'strong' && (
          <>
            {/* 4 corner brackets */}
            <path d="M3 7V3H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M21 3H25V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 21V25H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M21 25H25V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Crosshairs */}
            <line x1="14" y1="2" x2="14" y2="7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <line x1="14" y1="21" x2="14" y2="26" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <line x1="2" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <line x1="21" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            {/* Solid circle */}
            <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.75" />
          </>
        )}

        {activeTier === 'moderate' && (
          <>
            {/* 2 brackets (top-left & bottom-right) */}
            <path d="M3 7V3H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M21 25H25V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Crosshairs */}
            <line x1="14" y1="2" x2="14" y2="7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <line x1="14" y1="21" x2="14" y2="26" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <line x1="2" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <line x1="21" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            {/* Solid circle */}
            <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.75" />
          </>
        )}

        {activeTier === 'mixed' && (
          <>
            {/* Crosshairs */}
            <line x1="14" y1="2" x2="14" y2="7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <line x1="14" y1="21" x2="14" y2="26" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <line x1="2" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <line x1="21" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            {/* Dashed circle */}
            <circle
              cx="14"
              cy="14"
              r="7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeDasharray="3.5 2.5"
            />
          </>
        )}

        {activeTier === 'emerging' && (
          <>
            {/* Dotted circle */}
            <circle
              cx="14"
              cy="14"
              r="7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeDasharray="1.5 3"
            />
          </>
        )}

        {activeTier === 'not-supported' && (
          <>
            {/* Solid circle with diagonal slash */}
            <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.75" />
            <line x1="9" y1="19" x2="19" y2="9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </>
        )}
      </svg>

      {showLabel && <span className="leading-none tracking-normal font-sans">{config.label}</span>}
    </span>
  );
};

export default EvidenceMeter;
