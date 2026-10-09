'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Rating1To5, Session } from '@/store/types';
import { useFocusLabStore } from '@/store';

interface ReflectionStepProps {
  sessionStartedAt: number;
  intention: string;
  ifThen?: { when: string; then: string };
  presetId: string;
  plannedFocusSec: number;
  actualFocusSec: number;
  blocksCount: number;
  totalDistractions: number;
  allParkedThoughts: string[];
  onComplete: () => void;
}

const QUALITY_OPTIONS: Rating1To5[] = [1, 2, 3, 4, 5];

export const ReflectionStep: React.FC<ReflectionStepProps> = ({
  sessionStartedAt,
  intention,
  ifThen,
  presetId,
  plannedFocusSec,
  actualFocusSec,
  blocksCount,
  totalDistractions,
  allParkedThoughts,
  onComplete,
}) => {
  const [quality, setQuality] = useState<Rating1To5 | null>(null);
  const [distractions, setDistractions] = useState(totalDistractions);
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const addSession = useFocusLabStore((state) => state.addSession);

  const handleCopyParked = async () => {
    if (allParkedThoughts.length === 0) return;
    try {
      await navigator.clipboard.writeText(allParkedThoughts.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newSession: Session = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      startedAt: sessionStartedAt,
      intention,
      ifThen,
      presetId,
      plannedFocusSec,
      actualFocusSec,
      blocks: blocksCount,
      quality: quality ?? undefined,
      distractions,
      parked: allParkedThoughts,
      note: note.trim() || undefined,
    };

    addSession(newSession);
    setIsSaved(true);
  };

  if (isSaved) {
    const focusMinutes = Math.round(actualFocusSec / 60);
    return (
      <Card className="p-6 text-center space-y-4 bg-surface-2 border-border">
        <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <h2 className="text-xl font-bold text-text">Session Completed & Saved</h2>
        <p className="text-sm text-muted">
          Completed {blocksCount} block{blocksCount !== 1 ? 's' : ''} ({focusMinutes} minute{focusMinutes !== 1 ? 's' : ''} total focus).
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            onClick={onComplete}
            className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
          >
            Done
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display font-[780] text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] text-text text-balance">
          Session Reflection
        </h2>
        <p className="text-base sm:text-lg text-muted max-w-[54ch] leading-relaxed">
          Record your subjective focus quality and review distractions.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-text" id="quality-label">
          Focus Quality
        </label>
        <div
          role="radiogroup"
          aria-labelledby="quality-label"
          className="grid grid-cols-5 p-1.5 rounded-full bg-surface-2 border border-border shadow-xs"
        >
          {QUALITY_OPTIONS.map((val) => {
            const isSelected = quality === val;
            return (
              <button
                type="button"
                key={val}
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected || (quality === null && val === 1) ? 0 : -1}
                onClick={() => setQuality(val)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    setQuality((prev) => (prev ? (Math.min(5, prev + 1) as Rating1To5) : 2));
                  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    setQuality((prev) => (prev ? (Math.max(1, prev - 1) as Rating1To5) : 1));
                  }
                }}
                className={`min-h-[44px] min-w-[44px] rounded-full text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-ring tabular-nums flex items-center justify-center ${
                  isSelected
                    ? 'bg-primary-bg text-primary-text shadow-sm'
                    : 'text-text hover:bg-surface'
                }`}
              >
                {val}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between items-center text-xs text-muted px-2">
          <span>1 — Scattered</span>
          <span>5 — Deeply absorbed</span>
        </div>
      </div>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="distractions-input" className="block text-sm font-semibold text-text">
            Distractions Noticed
          </label>
          <span className="text-xs text-muted font-mono">{distractions} logged</span>
        </div>
        <input
          id="distractions-input"
          type="number"
          min={0}
          value={distractions}
          onChange={(e) => setDistractions(Math.max(0, Number(e.target.value)))}
          className="w-full min-h-[44px] px-3 py-2 rounded-md border border-border bg-surface text-text text-sm focus-visible:outline-2 focus-visible:outline-accent"
        />
      </Card>

      {allParkedThoughts.length > 0 && (
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text">
              Parked Thoughts ({allParkedThoughts.length})
            </span>
            <button
              type="button"
              onClick={handleCopyParked}
              className="text-xs text-accent hover:underline min-h-[44px] inline-flex items-center"
            >
              {copied ? 'Copied!' : 'Copy list'}
            </button>
          </div>
          <ul className="text-xs text-muted space-y-1.5 max-h-36 overflow-y-auto bg-surface p-2.5 rounded border border-border">
            {allParkedThoughts.map((thought, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="font-mono text-muted">•</span>
                <span className="text-text">{thought}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="space-y-2">
        <label htmlFor="note-input" className="block text-sm font-semibold text-text">
          Session Note (Optional)
        </label>
        <textarea
          id="note-input"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any observations on your environment, energy, or task..."
          className="w-full p-3 rounded-md border border-border bg-surface text-text text-sm focus-visible:outline-2 focus-visible:outline-accent resize-none"
        />
      </Card>

      <Button
        type="submit"
        variant="primary"
        className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 rounded-full text-sm font-semibold"
      >
        Save Session
      </Button>
    </form>
  );
};
