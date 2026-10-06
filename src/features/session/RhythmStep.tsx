'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { getClaimById } from '@/content/evidence';

export interface RhythmConfig {
  presetId: '25_5' | '50_10' | '90_20' | 'custom' | 'flexible';
  focusSec: number; // 0 for flexible
  breakSec: number; // 0 for flexible (computed dynamically)
  isFlexible: boolean;
}

interface RhythmStepProps {
  onSelectRhythm: (config: RhythmConfig) => void;
  onBack: () => void;
}

const PRESETS = [
  { id: '25_5', label: '25 / 5', desc: 'Classic 25m focus + 5m break', focusMin: 25, breakMin: 5 },
  { id: '50_10', label: '50 / 10', desc: 'Extended 50m focus + 10m break', focusMin: 50, breakMin: 10 },
  { id: '90_20', label: '90 / 20', desc: 'Ultradian 90m focus + 20m break', focusMin: 90, breakMin: 20 },
  { id: 'flexible', label: 'Flexible', desc: 'Open-ended focus; break is 1/5th of focus time (min 2m)', focusMin: 0, breakMin: 0 },
  { id: 'custom', label: 'Custom', desc: 'Set your own custom intervals', focusMin: 30, breakMin: 5 },
] as const;

export const RhythmStep: React.FC<RhythmStepProps> = ({ onSelectRhythm, onBack }) => {
  const [selectedId, setSelectedId] = useState<RhythmConfig['presetId']>('25_5');
  const [customFocusMin, setCustomFocusMin] = useState(30);
  const [customBreakMin, setCustomBreakMin] = useState(5);

  const claim = getClaimById('breaks-performance');

  const handleStart = () => {
    if (selectedId === 'flexible') {
      onSelectRhythm({
        presetId: 'flexible',
        focusSec: 0,
        breakSec: 0,
        isFlexible: true,
      });
      return;
    }

    if (selectedId === 'custom') {
      onSelectRhythm({
        presetId: 'custom',
        focusSec: Math.max(1, customFocusMin) * 60,
        breakSec: Math.max(1, customBreakMin) * 60,
        isFlexible: false,
      });
      return;
    }

    const preset = PRESETS.find((p) => p.id === selectedId);
    if (preset) {
      onSelectRhythm({
        presetId: preset.id,
        focusSec: preset.focusMin * 60,
        breakSec: preset.breakMin * 60,
        isFlexible: false,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-text">Choose your rhythm</h2>
        <p className="text-sm text-muted">
          Select a structured work/break ratio or run an open-ended flexible interval.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRESETS.map((preset) => {
          const isSelected = selectedId === preset.id;
          return (
            <button
              type="button"
              key={preset.id}
              onClick={() => setSelectedId(preset.id)}
              className={`p-3.5 text-left rounded-md border transition-colors min-h-[44px] flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                isSelected
                  ? 'border-accent bg-surface ring-2 ring-ring'
                  : 'border-border bg-surface-2 hover:bg-surface'
              }`}
            >
              <div>
                <span className="text-base font-bold text-text block">{preset.label}</span>
                <span className="text-xs text-muted block mt-1">{preset.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedId === 'custom' && (
        <Card className="p-4 space-y-3 bg-surface-2 border-border">
          <span className="text-xs font-semibold text-text block">
            Custom interval settings
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="custom-focus" className="block text-xs font-medium text-muted mb-1">
                Focus (minutes)
              </label>
              <input
                id="custom-focus"
                type="number"
                min={1}
                max={180}
                value={customFocusMin}
                onChange={(e) => setCustomFocusMin(Number(e.target.value))}
                className="w-full min-h-[44px] px-3 py-2 rounded-xs border border-border-strong bg-surface text-text text-sm tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
            </div>
            <div>
              <label htmlFor="custom-break" className="block text-xs font-medium text-muted mb-1">
                Break (minutes)
              </label>
              <input
                id="custom-break"
                type="number"
                min={1}
                max={60}
                value={customBreakMin}
                onChange={(e) => setCustomBreakMin(Number(e.target.value))}
                className="w-full min-h-[44px] px-3 py-2 rounded-xs border border-border-strong bg-surface text-text text-sm tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
            </div>
          </div>
        </Card>
      )}

      {claim && (
        <Card className="space-y-2 border-border bg-surface-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text">Breaks and Performance</span>
            <EvidenceBadge tier={claim.tier} />
          </div>
          <p className="text-muted">
            Breaks support vigor and reduce fatigue, but research shows no single work/break ratio is proven best for task performance.
          </p>
          <p className="text-muted italic">{claim.summary}</p>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Button variant="primary" onClick={handleStart} className="w-full sm:w-auto">
          Start Focus Block
        </Button>
        <Button variant="subtle" onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
      </div>
    </div>
  );
};
