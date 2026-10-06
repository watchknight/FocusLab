'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { EnvironmentChecklist } from '@/features/environment';
import { getClaimById } from '@/content/evidence';
import { IfThenPlanEditor } from './IfThenPlanEditor';
import { RhythmConfig } from './RhythmStep';

interface SessionSetupViewProps {
  initialIntention?: string;
  initialIfThen?: { when: string; then: string };
  initialRhythm?: RhythmConfig;
  onStartSession: (
    intention: string,
    ifThen: { when: string; then: string } | undefined,
    rhythm: RhythmConfig
  ) => void;
}

const PRESETS = [
  { id: '25_5', label: '25 / 5', desc: 'Classic 25m focus + 5m break', focusMin: 25, breakMin: 5 },
  { id: '50_10', label: '50 / 10', desc: 'Extended 50m focus + 10m break', focusMin: 50, breakMin: 10 },
  { id: '90_20', label: '90 / 20', desc: 'Ultradian 90m focus + 20m break', focusMin: 90, breakMin: 20 },
  { id: 'flexible', label: 'Flexible', desc: 'Open-ended focus (break = 1/5th time)', focusMin: 0, breakMin: 0 },
  { id: 'custom', label: 'Custom', desc: 'Set custom intervals', focusMin: 30, breakMin: 5 },
] as const;

export const SessionSetupView: React.FC<SessionSetupViewProps> = ({
  initialIntention = '',
  initialIfThen,
  initialRhythm,
  onStartSession,
}) => {
  const [intention, setIntention] = useState(initialIntention);
  const [showIfThen, setShowIfThen] = useState(Boolean(initialIfThen));
  const [whenTrigger, setWhenTrigger] = useState(initialIfThen?.when || '');
  const [thenAction, setThenAction] = useState(initialIfThen?.then || '');

  const [selectedPresetId, setSelectedPresetId] = useState<RhythmConfig['presetId']>(
    initialRhythm?.presetId || '25_5'
  );
  const [customFocusMin, setCustomFocusMin] = useState(30);
  const [customBreakMin, setCustomBreakMin] = useState(5);

  const breaksClaim = getClaimById('breaks-performance');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intention.trim()) return;

    const plan =
      showIfThen && whenTrigger.trim() && thenAction.trim()
        ? { when: whenTrigger.trim(), then: thenAction.trim() }
        : undefined;

    let computedRhythm: RhythmConfig;
    if (selectedPresetId === 'flexible') {
      computedRhythm = { presetId: 'flexible', focusSec: 0, breakSec: 0, isFlexible: true };
    } else if (selectedPresetId === 'custom') {
      computedRhythm = {
        presetId: 'custom',
        focusSec: Math.max(1, customFocusMin) * 60,
        breakSec: Math.max(1, customBreakMin) * 60,
        isFlexible: false,
      };
    } else {
      const preset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
      computedRhythm = {
        presetId: preset.id,
        focusSec: preset.focusMin * 60,
        breakSec: preset.breakMin * 60,
        isFlexible: false,
      };
    }

    onStartSession(intention.trim(), plan, computedRhythm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text">Focus Session Setup</h1>
        <p className="text-xs sm:text-sm text-muted">
          Define your intention, select your rhythm, and prepare your space.
        </p>
      </div>

      {/* Two columns on desktop, one column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Intention and Plan */}
        <div className="space-y-4">
          <Card className="space-y-3">
            <label htmlFor="task-input" className="block text-sm font-semibold text-text">
              What is the single task you will work on?
            </label>
            <input
              id="task-input"
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="e.g. Write section 2 of the project proposal"
              maxLength={120}
              className="w-full min-h-[44px] px-3 py-2 rounded-xs border border-border-strong bg-surface text-text text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              autoFocus
            />
          </Card>

          <IfThenPlanEditor
            showIfThen={showIfThen}
            onToggleShow={setShowIfThen}
            whenTrigger={whenTrigger}
            onWhenChange={setWhenTrigger}
            thenAction={thenAction}
            onThenChange={setThenAction}
          />
        </div>

        {/* Right Column: Rhythm and Environment Checklist */}
        <div className="space-y-4">
          <Card className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-text">Choose rhythm</span>
              {breaksClaim && <EvidenceBadge tier={breaksClaim.tier} />}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`p-2.5 text-left rounded-md border transition-colors min-h-[44px] flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-ring ${
                      isSelected
                        ? 'border-accent bg-surface ring-2 ring-ring'
                        : 'border-border bg-surface-2 hover:bg-surface'
                    }`}
                  >
                    <span className="text-sm font-bold text-text block">{preset.label}</span>
                    <span className="text-[11px] text-muted block mt-0.5 line-clamp-1">{preset.desc}</span>
                  </button>
                );
              })}
            </div>

            {selectedPresetId === 'custom' && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                <div>
                  <label htmlFor="custom-focus" className="block text-xs text-muted mb-1">Focus (min)</label>
                  <input
                    id="custom-focus"
                    type="number"
                    min="1"
                    max="180"
                    value={customFocusMin}
                    onChange={(e) => setCustomFocusMin(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3 py-1 text-sm rounded border border-border bg-surface text-text"
                  />
                </div>
                <div>
                  <label htmlFor="custom-break" className="block text-xs text-muted mb-1">Break (min)</label>
                  <input
                    id="custom-break"
                    type="number"
                    min="1"
                    max="60"
                    value={customBreakMin}
                    onChange={(e) => setCustomBreakMin(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3 py-1 text-sm rounded border border-border bg-surface text-text"
                  />
                </div>
              </div>
            )}
          </Card>

          <EnvironmentChecklist embedded />
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={!intention.trim()}
          className="w-full sm:w-auto min-h-[48px] px-6 text-base font-semibold"
        >
          Start Focus Block
        </Button>
      </div>
    </form>
  );
};
