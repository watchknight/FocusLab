'use client';

import React, { useState } from 'react';
import { EVIDENCE_REGISTRY } from '@/content/evidence';
import { MYTHS } from '@/content/myths';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { Card } from '@/components/ui/Card';
import { EvidenceLevel } from '@/content/types';

export const EvidenceExplorer: React.FC = () => {
  const [tab, setTab] = useState<'evidence' | 'myths'>('evidence');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const evidenceList = Object.values(EVIDENCE_REGISTRY);

  const filteredEvidence = evidenceList.filter((item) => {
    if (filterLevel === 'all') return true;
    return item.level === filterLevel;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-content-primary">
          Evidence & Science Registry
        </h1>
        <p className="text-xs text-content-secondary">
          FocusLab never writes claims from memory. All items stem directly from
          our peer-reviewed documentation in docs/EVIDENCE.md.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('evidence')}
          className={`min-h-[44px] flex-1 text-xs font-semibold rounded border transition-colors ${
            tab === 'evidence'
              ? 'border-teal-accent bg-teal-accent text-white'
              : 'border-surface-border bg-surface-secondary text-content-secondary hover:bg-surface-tertiary'
          }`}
          aria-pressed={tab === 'evidence'}
        >
          Cataloged Interventions
        </button>
        <button
          onClick={() => setTab('myths')}
          className={`min-h-[44px] flex-1 text-xs font-semibold rounded border transition-colors ${
            tab === 'myths'
              ? 'border-teal-accent bg-teal-accent text-white'
              : 'border-surface-border bg-surface-secondary text-content-secondary hover:bg-surface-tertiary'
          }`}
          aria-pressed={tab === 'myths'}
        >
          Debunked Myths
        </button>
      </div>

      {tab === 'evidence' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="level-filter" className="font-semibold text-content-secondary">
              Filter by strength:
            </label>
            <select
              id="level-filter"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-surface-secondary border border-surface-border rounded px-2.5 py-1.5 text-xs text-content-primary focus-visible:ring-2 focus-visible:ring-teal-accent"
            >
              <option value="all">All Levels</option>
              <option value="strong">Strong</option>
              <option value="moderate">Moderate</option>
              <option value="mixed">Mixed</option>
              <option value="emerging">Emerging</option>
              <option value="not-supported">Not Supported</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredEvidence.map((record) => (
              <Card key={record.id} as="article" className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono text-content-muted">
                    {record.id}
                  </span>
                  <EvidenceBadge level={record.level as EvidenceLevel} />
                </div>

                <p className="text-sm font-semibold text-content-primary">
                  {record.claimSummary}
                </p>

                <div className="text-xs text-content-secondary space-y-1">
                  <p>
                    <strong>Target Outcomes:</strong>{' '}
                    {record.primaryOutcomes.join(', ')}
                  </p>
                  {record.counterClaimOrCaveat && (
                    <p className="text-content-muted">
                      <strong>Caveat:</strong> {record.counterClaimOrCaveat}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-surface-border text-xs text-content-muted">
                  <strong>Citation:</strong> {record.sources[0]?.citation}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {MYTHS.map((myth) => (
            <Card key={myth.id} as="article" className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-content-primary">
                  Popular Belief: {myth.claim}
                </h2>
                <EvidenceBadge level="not-supported" />
              </div>

              <div className="bg-surface-primary p-3 rounded border border-surface-border text-xs space-y-1">
                <p className="font-semibold text-teal-accent">
                  Evidence-Based Reality:
                </p>
                <p className="text-content-secondary">{myth.reality}</p>
              </div>

              <p className="text-xs text-content-muted">
                <strong>Fallacy Mechanism:</strong> {myth.fallacyType}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
