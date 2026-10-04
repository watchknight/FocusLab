'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CheckFormProps {
  onSaved?: (checkId: string) => void;
  title?: string;
  description?: string;
}

export const CheckForm: React.FC<CheckFormProps> = ({
  onSaved,
  title = 'Self-Check',
  description = 'Rate your current mental state before or after a focused work interval. No scores are shared.',
}) => {
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [distraction, setDistraction] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const addCheckLog = useFocusStore((s) => s.addCheckLog);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = addCheckLog({
      energyLevel: energy,
      distractionLevel: distraction,
      moodLevel: mood,
      note: note.trim() || undefined,
    });
    setSubmitted(true);
    if (onSaved) {
      onSaved(newLog.id);
    }
  };

  const renderScale = (
    label: string,
    value: 1 | 2 | 3 | 4 | 5,
    onChange: (val: 1 | 2 | 3 | 4 | 5) => void,
    lowLabel: string,
    highLabel: string
  ) => {
    const levels: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5];
    return (
      <fieldset className="space-y-1.5">
        <legend className="text-xs font-semibold text-content-primary">
          {label}
        </legend>
        <div className="flex items-center justify-between text-xs text-content-muted">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
        <div className="flex gap-2">
          {levels.map((lvl) => {
            const isSelected = value === lvl;
            return (
              <button
                type="button"
                key={lvl}
                onClick={() => onChange(lvl)}
                className={`flex-1 min-h-[44px] rounded border text-sm font-semibold transition-colors ${
                  isSelected
                    ? 'border-teal-accent bg-teal-accent text-white'
                    : 'border-surface-border bg-surface-primary text-content-primary hover:bg-surface-tertiary'
                }`}
                aria-pressed={isSelected}
                aria-label={`${label} rating ${lvl} of 5`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  };

  if (submitted && !onSaved) {
    return (
      <Card className="text-center py-6 space-y-3">
        <p className="text-sm font-semibold text-teal-accent">
          Self-check recorded locally.
        </p>
        <p className="text-xs text-content-secondary">
          Check completed. You can proceed to practice an activity or compare your trends.
        </p>
        <Button variant="secondary" onClick={() => setSubmitted(false)}>
          Record Another Check
        </Button>
      </Card>
    );
  }

  return (
    <Card as="section" className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-content-primary">{title}</h2>
        <p className="text-xs text-content-secondary mt-1">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {renderScale('Current Alertness / Energy', energy, setEnergy, '1 (Lethargic)', '5 (Energized)')}
        {renderScale('Internal Distraction Urge', distraction, setDistraction, '1 (Calm & Clear)', '5 (Scattered)')}
        {renderScale('Valence / Mood', mood, setMood, '1 (Low / Tense)', '5 (Pleasant / Calm)')}

        <div className="space-y-1">
          <label htmlFor="check-note" className="block text-xs font-semibold text-content-primary">
            Context note (optional, e.g. task name, noise level)
          </label>
          <input
            id="check-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={100}
            placeholder="e.g., Reading documentation after lunch"
            className="w-full min-h-[44px] px-3 py-2 text-sm bg-surface-primary border border-surface-border rounded-md text-content-primary focus-visible:ring-2 focus-visible:ring-teal-accent"
          />
        </div>

        <Button type="submit" variant="primary" fullWidth>
          Save Check Entry
        </Button>
      </form>
    </Card>
  );
};
