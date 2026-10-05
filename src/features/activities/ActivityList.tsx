'use client';

import React, { useState, useMemo } from 'react';
import { ActivityCard } from './ActivityCard';
import { Card } from '@/components/ui/Card';
import { ACTIVITIES } from '@/content/activities';
import { Activity } from '@/content/types';

type CategoryFilter = 'all' | 'breathing' | 'attention' | 'movement' | 'nature';

export const ActivityList: React.FC = () => {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [maxDurationSec, setMaxDurationSec] = useState<number>(0); // 0 = any

  const { standardActivities, controlActivities } = useMemo(() => {
    const standard: Activity[] = [];
    const control: Activity[] = [];

    for (const act of ACTIVITIES) {
      if (act.isControl) {
        control.push(act);
      } else {
        standard.push(act);
      }
    }
    return { standardActivities: standard, controlActivities: control };
  }, []);

  const filteredStandard = useMemo(() => {
    return standardActivities.filter((act) => {
      if (category !== 'all' && act.category !== category) return false;
      if (maxDurationSec > 0) {
        const minDuration = Math.min(...act.durationOptionsSec);
        if (minDuration > maxDurationSec) return false;
      }
      return true;
    });
  }, [standardActivities, category, maxDurationSec]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-text">Evidence-Labelled Activities</h1>
        <p className="text-sm text-muted">
          Paced breathing, attention anchoring, and movement micro-breaks labelled with scientific replication tiers.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-3 bg-surface-2 border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Filter */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
              Category
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'breathing', 'attention', 'movement', 'nature'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`min-h-[36px] px-3 py-1 text-xs rounded-md font-medium border transition-colors capitalize ${
                    category === cat
                      ? 'bg-accent border-accent text-accent-contrast'
                      : 'bg-surface border-border text-text hover:bg-surface-2'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Max Duration Filter */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
              Max Duration
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Any', value: 0 },
                { label: '≤ 2 min', value: 120 },
                { label: '≤ 5 min', value: 300 },
                { label: '≤ 10 min', value: 600 },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setMaxDurationSec(opt.value)}
                  className={`min-h-[36px] px-3 py-1 text-xs rounded-md font-medium border transition-colors ${
                    maxDurationSec === opt.value
                      ? 'bg-accent border-accent text-accent-contrast'
                      : 'bg-surface border-border text-text hover:bg-surface-2'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Standard Activities Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
          Practice Activities ({filteredStandard.length})
        </h2>
        {filteredStandard.length === 0 ? (
          <p className="text-xs text-muted py-6 text-center">
            No activities match the current filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStandard.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>

      {/* Control / Used for Experiments Group */}
      {controlActivities.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
              Used for Experiments
            </h2>
            <p className="text-xs text-muted">
              Active baseline controls without structured sensory stimulation, used for comparing conditions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {controlActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
