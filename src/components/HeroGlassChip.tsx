'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DemoState } from '@/lib/reflex-demo';

export interface HeroGlassChipProps {
  readoutRef: React.Ref<HTMLDivElement>;
  caption: string;
  demoState: DemoState;
  onCardClick?: () => void;
}

export const HeroGlassChip: React.FC<HeroGlassChipProps> = ({
  readoutRef,
  caption,
  demoState,
  onCardClick,
}) => {
  const isClickable = demoState !== 'result' && Boolean(onCardClick);

  return (
    <div
      onClick={isClickable ? onCardClick : undefined}
      className={`glass-card absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 lg:translate-x-0 lg:bottom-[12%] lg:left-[4%] xl:bottom-[12%] xl:left-[4%] 2xl:bottom-[12%] 2xl:left-[4%] z-20 pointer-events-auto rounded-[28px] bg-[var(--glass)] backdrop-blur-[18px] p-5 sm:p-6 min-w-[220px] sm:min-w-[260px] max-w-[90vw] text-left select-none ${
        isClickable ? 'cursor-pointer hover:border-border-strong transition-colors' : ''
      }`}
    >
      <div className="text-xs sm:text-sm font-medium text-muted">
        {demoState === 'idle' ? 'Median reaction (sample)' : 'Your reaction'}
      </div>
      <div
        ref={readoutRef}
        className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-text tabular-nums mt-1"
      >
        - ms
      </div>
      <div className="text-xs sm:text-sm text-muted mt-2 sm:mt-2.5 leading-snug max-w-[28ch]">
        {caption}
      </div>
      {demoState === 'result' && (
        <div className="mt-3.5 pt-0.5">
          <Link href="/check">
            <Button variant="primary" className="min-h-[44px] h-11 px-5 text-xs font-semibold w-full">
              Start the 3-minute Check
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
