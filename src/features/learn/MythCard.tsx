'use client';

import React from 'react';
import Link from 'next/link';
import type { Myth } from '@/content/types';

interface MythCardProps {
  myth: Myth;
  defaultOpen?: boolean;
}

export const MythCard: React.FC<MythCardProps> = ({ myth, defaultOpen = false }) => {
  const isNotSupported = myth.verdict.toLowerCase().includes('not supported');

  return (
    <details
      className="group rounded-md border border-border bg-surface-2 p-4 text-text open:bg-surface transition-colors duration-150"
      open={defaultOpen}
    >
      <summary className="flex items-center justify-between gap-3 cursor-pointer select-none list-none font-semibold min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <div className="space-y-1 pr-2">
          <span className="text-xs text-muted block font-normal">Common belief</span>
          <h2 className="text-sm sm:text-base font-bold text-text leading-snug font-display">
            &ldquo;{myth.myth}&rdquo;
          </h2>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
              isNotSupported
                ? 'bg-tier-not-supported/10 text-tier-not-supported border-tier-not-supported/30'
                : 'bg-tier-mixed/10 text-tier-mixed border-tier-mixed/30'
            }`}
          >
            {myth.verdict}
          </span>
          <span
            aria-hidden="true"
            className="text-muted transition-transform duration-200 group-open:rotate-180 text-xs"
          >
            ▼
          </span>
        </div>
      </summary>

      <div className="pt-3 mt-3 border-t border-border space-y-3 text-sm">
        <div className="space-y-1">
          <span className="font-semibold text-muted block text-xs">What research shows</span>
          <p className="text-text leading-relaxed text-base">{myth.explanation}</p>
        </div>

        {myth.claimId && (
          <div className="pt-1">
            <Link
              href={`/learn/${myth.claimId}`}
              className="text-xs font-semibold text-text hover:underline min-h-[44px] inline-flex items-center transition-colors"
            >
              Read full claim details and evidence
            </Link>
          </div>
        )}
      </div>
    </details>
  );
};

export default MythCard;
