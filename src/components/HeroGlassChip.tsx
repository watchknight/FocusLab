'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DemoState } from '@/lib/reflex-demo';

export interface HeroGlassChipProps {
  readoutRef: React.Ref<HTMLDivElement>;
  caption: string;
  demoState: DemoState;
  onCardClick?: () => void;
  onReset?: () => void;
}

export const HeroGlassChip: React.FC<HeroGlassChipProps> = ({
  readoutRef,
  caption,
  demoState,
  onCardClick,
  onReset,
}) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Do not re-trigger if clicking directly on a button or link inside
      if ((e.target as HTMLElement).closest('button, a')) return;
      if (demoState === 'result') {
        onReset ? onReset() : onCardClick?.();
      } else if (onCardClick) {
        onCardClick();
      }
    },
    [demoState, onCardClick, onReset]
  );

  return (
    <div
      onClick={handleClick}
      className="glass-card absolute bottom-2 left-1/2 -translate-x-1/2 sm:bottom-3 sm:left-1/2 sm:-translate-x-1/2 lg:translate-x-0 lg:bottom-6 lg:left-[-20px] xl:bottom-8 xl:left-[-32px] 2xl:bottom-10 2xl:left-[-36px] z-20 pointer-events-auto rounded-[24px] sm:rounded-[28px] backdrop-blur-[18px] p-4 sm:p-5 lg:p-6 shadow-elevation min-w-[210px] sm:min-w-[250px] max-w-[90vw] text-left select-none cursor-pointer hover:border-border-strong transition-all duration-200"
    >
      <div className="text-xs sm:text-sm font-medium text-muted">
        {demoState === 'idle' ? 'Median reaction (sample)' : 'Your reaction'}
      </div>
      <div
        ref={readoutRef}
        className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-text tabular-nums mt-1"
      >
        {demoState === 'idle' ? '287 ms' : '- ms'}
      </div>
      <div className="text-xs sm:text-sm text-muted mt-2 sm:mt-2.5 leading-snug max-w-[28ch]">
        {caption}
      </div>
      {demoState === 'result' && (
        <div className="mt-3.5 pt-0.5 flex flex-col gap-2 w-full">
          <Link href="/check" className="w-full" onClick={(e) => e.stopPropagation()}>
            <Button variant="primary" className="min-h-[44px] h-11 px-5 text-xs font-semibold w-full">
              Start the 3-minute Check
            </Button>
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReset ? onReset() : onCardClick?.();
            }}
            className="text-xs font-semibold text-muted hover:text-text underline min-h-[36px] inline-flex items-center justify-center transition-colors"
          >
            Try another reflex
          </button>
        </div>
      )}
    </div>
  );
};
