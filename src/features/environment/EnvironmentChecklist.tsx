'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';
import { getClaimById } from '@/content/evidence';

interface EnvironmentChecklistProps {
  onContinue?: () => void;
  onBack?: () => void;
  embedded?: boolean;
}

interface ChecklistItemConfig {
  id: string;
  label: string;
  claimId?: string;
  customSummary?: string;
}

const CHECKLIST_ITEMS: ChecklistItemConfig[] = [
  {
    id: 'notifications',
    label: 'Notifications silenced or disabled',
    claimId: 'phone-blocking',
  },
  {
    id: 'phone-out-of-reach',
    label: 'Phone placed out of sight or out of reach',
    claimId: 'phone-presence',
  },
  {
    id: 'single-task',
    label: 'Single concrete task clearly defined',
    claimId: 'if-then',
  },
  {
    id: 'tabs-closed',
    label: 'Unneeded tabs and background apps closed',
    claimId: 'multitasking',
  },
  {
    id: 'water',
    label: 'Glass of water or hydration nearby',
    customSummary:
      'Having water within reach prevents interrupting your focus block to search for hydration.',
  },
];

export const EnvironmentChecklist: React.FC<EnvironmentChecklistProps> = ({
  onContinue,
  onBack,
  embedded = false,
}) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [openInfoId, setOpenInfoId] = useState<string | null>(null);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleInfo = (id: string) => {
    setOpenInfoId((curr) => (curr === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-bold tracking-tight text-text">Environment Checklist</h3>
        <p className="text-xs text-muted">
          Adjustments to reduce friction and external interruptions.
        </p>
      </div>

      <div className="space-y-2">
        {CHECKLIST_ITEMS.map((item) => {
          const isChecked = !!checkedIds[item.id];
          const isInfoOpen = openInfoId === item.id;
          const claim = item.claimId ? getClaimById(item.claimId) : undefined;

          return (
            <Card key={item.id} className="p-3 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-3 cursor-pointer flex-1 min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(item.id)}
                    className="w-5 h-5 rounded-xs border border-border-strong bg-surface text-accent accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
                  />
                  <span className={`text-sm ${isChecked ? 'line-through text-muted' : 'text-text'}`}>
                    {item.label}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => toggleInfo(item.id)}
                  aria-expanded={isInfoOpen}
                  aria-label={`View evidence for ${item.label}`}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-xs font-mono text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-xs"
                >
                  ⓘ
                </button>
              </div>

              {isInfoOpen && (
                <div className="mt-2.5 pt-2.5 border-t border-border text-xs text-muted space-y-1.5 bg-surface p-2.5 rounded">
                  {claim ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text">{claim.title}</span>
                        <EvidenceMeter tier={claim.tier} />
                      </div>
                      <p>{claim.summary}</p>
                      <p className="italic">{claim.caveat}</p>
                    </>
                  ) : (
                    <p>{item.customSummary}</p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {!embedded && onContinue && (
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button variant="primary" onClick={onContinue} className="w-full sm:w-auto">
            Continue to Rhythm
          </Button>
          {onBack && (
            <Button variant="subtle" onClick={onBack} className="w-full sm:w-auto">
              Back
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
