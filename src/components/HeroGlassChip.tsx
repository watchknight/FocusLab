'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DemoState } from '@/lib/reflex-demo';

export interface HeroGlassChipProps {
  readoutRef: React.Ref<HTMLDivElement>;
  caption: string;
  demoState: DemoState;
}

export const HeroGlassChip: React.FC<HeroGlassChipProps> = ({
  readoutRef,
  caption,
  demoState,
}) => {
  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 sm:bottom-32 sm:left-1/2 sm:-translate-x-1/2 lg:translate-x-0 lg:bottom-[30%] lg:left-[-2%] xl:bottom-[32%] xl:left-[0%] 2xl:bottom-[34%] 2xl:left-[2%] z-20 pointer-events-auto rounded-[28px] border border-white/25 dark:border-white/10 bg-[var(--glass)] backdrop-blur-[18px] p-5 sm:p-6 shadow-elevation min-w-[210px] sm:min-w-[250px] max-w-[90vw] text-left select-none">
      <div className="text-xs sm:text-sm font-medium text-muted">
        Your reaction
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
            <Button variant="primary" className="h-10 px-5 text-xs font-semibold w-full">
              Start the 3-minute Check
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
