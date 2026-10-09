'use client';

import React, { useState, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { ActivityCard } from './ActivityCard';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { ACTIVITIES } from '@/content/activities';
import { Activity } from '@/content/types';
import { useGSAP, getFx } from '@/lib/gsap';
import type { FlipState } from '@/lib/gsap-flip';

type CategoryFilter = 'all' | 'breathing' | 'attention' | 'movement' | 'nature';

const DURATION_FILTERS: Array<{ label: string; value: number }> = [
  { label: 'Any duration', value: 0 },
  { label: '≤ 2 min', value: 120 },
  { label: '≤ 5 min', value: 300 },
  { label: '≤ 10 min', value: 600 },
];

const CATEGORIES: CategoryFilter[] = ['all', 'breathing', 'attention', 'movement', 'nature'];

export const ActivityList: React.FC = () => {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [maxDurationSec, setMaxDurationSec] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<FlipState | null>(null);
  const flipRef = useRef<typeof import('@/lib/gsap-flip') | null>(null);

  React.useEffect(() => {
    if (getFx() !== 'off') {
      import('@/lib/gsap-flip').then((mod) => {
        flipRef.current = mod;
      });
    }
  }, []);

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

  const handleCategoryChange = (cat: CategoryFilter) => {
    if (getFx() !== 'off' && containerRef.current && flipRef.current) {
      flipStateRef.current = flipRef.current.Flip.getState('.activity-card-item');
    }
    setCategory(cat);
  };

  const handleDurationChange = (dur: number) => {
    if (getFx() !== 'off' && containerRef.current && flipRef.current) {
      flipStateRef.current = flipRef.current.Flip.getState('.activity-card-item');
    }
    setMaxDurationSec(dur);
  };

  const handleResetFilters = () => {
    if (getFx() !== 'off' && containerRef.current && flipRef.current) {
      flipStateRef.current = flipRef.current.Flip.getState('.activity-card-item');
    }
    setCategory('all');
    setMaxDurationSec(0);
  };

  useGSAP(
    () => {
      if (flipStateRef.current && getFx() !== 'off' && flipRef.current) {
        flipRef.current.Flip.from(flipStateRef.current, {
          duration: 0.35,
          ease: 'focus',
          stagger: 0.02,
          absolute: false,
        });
        flipStateRef.current = null;
      }
    },
    { scope: containerRef, dependencies: [filteredStandard] }
  );

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display font-[780] text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] text-text text-balance">
          Evidence-Labelled Activities
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-[54ch] leading-relaxed">
          Paced breathing, attention anchoring, and movement micro-breaks labelled with scientific replication tiers.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="p-4 sm:p-5 rounded-[16px] border border-border bg-surface-2 space-y-4 shadow-xs">
        {/* Category Filter Chips */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted block">
            Category
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Category filters">
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                selected={category === cat}
                onClick={() => handleCategoryChange(cat)}
                className="capitalize"
              >
                {cat}
              </Chip>
            ))}
          </div>
        </div>

        {/* Max Duration Filter Chips */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-xs font-semibold text-muted block">
            Maximum duration
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Duration filters">
            {DURATION_FILTERS.map((opt) => (
              <Chip
                key={opt.value}
                selected={maxDurationSec === opt.value}
                onClick={() => handleDurationChange(opt.value)}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <section className="space-y-3" aria-label="Practice activities">
        <div className="flex items-center justify-between text-xs text-muted">
          <h2 className="font-semibold text-text text-sm">
            Practice Activities ({filteredStandard.length})
          </h2>
          <span className="tabular-nums font-mono">
            {category !== 'all' || maxDurationSec > 0 ? 'Filtered' : 'All available'}
          </span>
        </div>

        {filteredStandard.length === 0 ? (
          <div className="p-8 rounded-[16px] border border-border bg-surface text-center space-y-4">
            <p className="text-sm text-muted">
              No activities match the selected filters.
            </p>
            <Button variant="primary" onClick={handleResetFilters}>
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStandard.map((activity, index) => (
              <div
                key={activity.id}
                className={clsx('activity-card-item', index === 0 && 'md:col-span-2')}
              >
                <ActivityCard activity={activity} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Control activities for experiments */}
      {controlActivities.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-border" aria-label="Active controls">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-text">
              Active Control Interventions
            </h2>
            <p className="text-xs text-muted">
              Active baseline controls without structured sensory stimulation, used for comparing conditions in experiments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {controlActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ActivityList;
