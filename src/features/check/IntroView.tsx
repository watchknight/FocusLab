'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { getClaimById } from '@/content/evidence';
import { useT } from '@/i18n';

interface IntroViewProps {
  onStartRatings: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ onStartRatings }) => {
  const { t } = useT();
  const claim = getClaimById('pvt-check');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-text">{t('check.title')}</h1>
          {claim && <EvidenceBadge tier={claim.tier} />}
        </div>
        <p className="text-sm text-muted">
          {t('check.introSub')}
        </p>
        <p className="text-xs text-muted leading-relaxed">
          {t('check.introP1')} {t('check.introP2')}
        </p>
      </div>

      {claim && (
        <Card className="space-y-2 border-border bg-surface-2 text-xs">
          <p className="font-semibold text-text">{claim.title}</p>
          <p className="text-muted">{claim.summary}</p>
          <p className="text-muted italic">{claim.caveat}</p>
        </Card>
      )}

      <div className="pt-2">
        <Button variant="primary" onClick={onStartRatings} className="w-full sm:w-auto min-h-[44px]">
          {t('check.btnBegin')}
        </Button>
      </div>
    </div>
  );
};
