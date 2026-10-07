'use client';

import React from 'react';
import Link from 'next/link';
import { Plate } from '@/components/ui/Plate';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { getClaimById } from '@/content/evidence';
import { useT } from '@/i18n';

export const EvidencePanel: React.FC = () => {
  const { t } = useT();
  const claim = getClaimById('noise');

  return (
    <Plate
      as="section"
      tier={claim?.tier}
      meter={claim ? <EvidenceMeter tier={claim.tier} /> : null}
      caption={claim ? claim.outcome : 'Auditory masking'}
      className="text-sm space-y-4"
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-base font-bold text-text font-display">
          {t('sounds.evidenceTitle')}
        </h2>
        {claim && (
          <Link
            href={`/learn/${claim.id}`}
            className="text-sm font-semibold text-link hover:underline min-h-[44px] inline-flex items-center"
          >
            {t('sounds.evidenceReadFull')}
          </Link>
        )}
      </div>

      {claim && (
        <div className="space-y-2">
          <p className="text-sm text-muted leading-relaxed">
            <strong className="text-text">{t('sounds.findingLabel')}</strong> {claim.summary}
          </p>
          <p className="text-sm text-muted italic border-l-2 border-border pl-3 py-0.5">
            <strong className="not-italic text-text">{t('sounds.caveatLabel')}</strong> {claim.caveat}
          </p>
        </div>
      )}

      <div className="pt-2 border-t border-border space-y-1">
        <p className="font-semibold text-text text-base font-display">
          {t('sounds.tryThenTestTitle')}
        </p>
        <p className="text-sm text-muted leading-relaxed">
          {t('sounds.tryThenTestBody')}
        </p>
      </div>
    </Plate>
  );
};

export default EvidencePanel;
