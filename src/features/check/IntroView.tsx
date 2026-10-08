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
    <div className="w-full flex justify-center py-2 sm:py-4">
      <Panel className="w-full max-w-[720px] space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-text">{t('check.title')}</h1>
            <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium border border-border bg-surface text-muted leading-snug">
              <strong className="text-text mr-1">Measurement:</strong> Lab version validated; this browser version is informal.
            </span>
          </div>
          <p className="text-sm sm:text-base text-muted">
            {t('check.introSub')}
          </p>
          <p className="text-sm sm:text-base text-text leading-relaxed">
            {t('check.introP1')} {t('check.introP2')}
          </p>
        </div>

        {claim && (
          <div className="p-3.5 rounded-xs border border-border bg-surface text-xs sm:text-sm space-y-1.5">
            <span className="font-semibold text-text block">{claim.title}</span>
            <p className="text-text leading-relaxed">{claim.summary}</p>
            {claim.caveat && <p className="text-muted italic">{claim.caveat}</p>}
          </div>
        )}

        <div className="pt-2">
          <Button variant="primary" onClick={onStartRatings} className="w-full sm:w-auto min-h-[44px]">
            {t('check.btnBegin')}
          </Button>
        </div>
      </Panel>
    </div>
  );
};
