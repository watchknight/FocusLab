'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { getClaimById } from '@/content/evidence';
import { useT } from '@/i18n';

interface IntroViewProps {
  onStartRatings: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ onStartRatings }) => {
  const { t } = useT();
  const claim = getClaimById('pvt-check');

  return (
    <div className="w-full flex justify-center py-4 sm:py-8">
      <Panel className="w-full max-w-[720px] space-y-6">
        <div className="space-y-3">
          <h1 className="font-display font-[780] text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] text-text text-balance">
            {t('check.title')}
          </h1>
          <p className="text-xs font-mono text-muted">
            Lab version validated; this browser version is informal.
          </p>
          <p className="text-base sm:text-lg text-muted leading-relaxed">
            {t('check.introSub')}
          </p>
          <p className="text-sm sm:text-base text-text leading-relaxed">
            {t('check.introP1')} {t('check.introP2')}
          </p>
        </div>

        {claim && (
          <div className="p-4 rounded-[16px] border border-border bg-surface-2 text-xs sm:text-sm space-y-1.5 shadow-xs">
            <span className="font-semibold text-text block">{claim.title}</span>
            <p className="text-text leading-relaxed">{claim.summary}</p>
            {claim.caveat && <p className="text-muted italic">{claim.caveat}</p>}
          </div>
        )}

        <div className="pt-2">
          <Button
            variant="primary"
            onClick={onStartRatings}
            className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
          >
            {t('check.btnBegin')}
          </Button>
        </div>
      </Panel>
    </div>
  );
};
