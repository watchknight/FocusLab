'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PlayerShell } from './PlayerShell';
import { Activity, BreathPhase } from '@/content/types';
import { playSoftChime } from '@/lib/audio';

interface BreathPacerProps {
  activity: Activity;
  durationSec: number;
  onClose: () => void;
}

const DEFAULT_PHASES: BreathPhase[] = [
  { label: 'Inhale', seconds: 4 },
  { label: 'Exhale', seconds: 4 },
];

interface PacerContentProps {
  elapsedSec: number;
  isPaused: boolean;
  audioEnabled: boolean;
  reducedMotion: boolean;
  activePhases: BreathPhase[];
  hasOptionalHolds: boolean;
  cycleDuration: number;
  skipHolds: boolean;
  onToggleSkipHolds: (val: boolean) => void;
}

const PacerContent: React.FC<PacerContentProps> = ({
  elapsedSec,
  isPaused,
  audioEnabled,
  reducedMotion,
  activePhases,
  hasOptionalHolds,
  cycleDuration,
  skipHolds,
  onToggleSkipHolds,
}) => {
  const lastPhaseIndexRef = useRef<number>(-1);
  const timeInCycle = elapsedSec % (cycleDuration || 1);

  let accumulated = 0;
  let currentPhase = activePhases[0] || DEFAULT_PHASES[0];
  let phaseIndex = 0;
  let phaseElapsed = 0;

  for (let i = 0; i < activePhases.length; i++) {
    const p = activePhases[i];
    if (timeInCycle < accumulated + p.seconds) {
      currentPhase = p;
      phaseIndex = i;
      phaseElapsed = timeInCycle - accumulated;
      break;
    }
    accumulated += p.seconds;
  }

  // Play gentle chime on phase shift if audio is enabled
  useEffect(() => {
    if (!isPaused && audioEnabled && phaseIndex !== lastPhaseIndexRef.current) {
      lastPhaseIndexRef.current = phaseIndex;
      playSoftChime();
    }
  }, [phaseIndex, isPaused, audioEnabled]);

  const phaseProgress = Math.min(1, phaseElapsed / (currentPhase.seconds || 1));
  const secondsRemainingInPhase = Math.max(1, currentPhase.seconds - phaseElapsed);

  // Calculate visual circle scale based on phase type
  const isExpanding = currentPhase.label.toLowerCase().includes('inhale');
  const isContracting = currentPhase.label.toLowerCase().includes('exhale');

  let scale = 1.0;
  if (isExpanding) {
    scale = 0.75 + phaseProgress * 0.45; // 0.75 -> 1.20
  } else if (isContracting) {
    scale = 1.20 - phaseProgress * 0.45; // 1.20 -> 0.75
  } else {
    scale = 1.20; // hold
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-sm w-full text-center">
      {hasOptionalHolds && (
        <label className="flex items-center gap-2 text-xs text-muted cursor-pointer min-h-[36px]">
          <input
            type="checkbox"
            checked={skipHolds}
            onChange={(e) => onToggleSkipHolds(e.target.checked)}
            className="rounded border-border text-accent focus:ring-accent"
          />
          <span>Skip hold phases</span>
        </label>
      )}

      {reducedMotion ? (
        // Reduced motion: static text plus a progress bar only
        <div className="w-full space-y-4 p-6 rounded-xl border border-border bg-surface-2">
          <span className="text-3xl font-bold tracking-tight text-accent block">
            {currentPhase.label}
          </span>
          <span className="text-lg font-mono text-muted block">
            {secondsRemainingInPhase}s
          </span>
          <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border">
            <div
              className="bg-accent h-full transition-all duration-300"
              style={{ width: `${Math.round(phaseProgress * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        // Normal animated circle
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border-2 border-accent/20 bg-accent/5 dark:bg-accent/10 transition-transform duration-500 ease-out"
            style={{ transform: `scale(${scale})` }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
            <span className="text-2xl font-bold text-text">
              {currentPhase.label}
            </span>
            <span className="text-xl font-mono text-accent">
              {secondsRemainingInPhase}s
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-1.5 justify-center pt-2">
        {activePhases.map((p, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all ${
              idx === phaseIndex
                ? 'w-6 bg-accent'
                : 'w-2 bg-surface-2 border border-border'
            }`}
            aria-label={`${p.label} phase`}
          />
        ))}
      </div>
    </div>
  );
};

export const BreathPacer: React.FC<BreathPacerProps> = ({
  activity,
  durationSec,
  onClose,
}) => {
  const [skipHolds, setSkipHolds] = useState(false);

  const rawPhases = useMemo(
    () => activity.pattern?.phases || DEFAULT_PHASES,
    [activity.pattern?.phases]
  );

  const activePhases: BreathPhase[] = useMemo(() => {
    if (!skipHolds) return rawPhases;
    return rawPhases.filter((p) => !p.optional);
  }, [rawPhases, skipHolds]);

  const hasOptionalHolds = useMemo(
    () => rawPhases.some((p) => p.optional),
    [rawPhases]
  );

  const cycleDuration = useMemo(
    () => activePhases.reduce((acc, p) => acc + p.seconds, 0),
    [activePhases]
  );

  return (
    <PlayerShell activity={activity} durationSec={durationSec} onClose={onClose}>
      {(props) => (
        <PacerContent
          {...props}
          activePhases={activePhases}
          hasOptionalHolds={hasOptionalHolds}
          cycleDuration={cycleDuration}
          skipHolds={skipHolds}
          onToggleSkipHolds={setSkipHolds}
        />
      )}
    </PlayerShell>
  );
};
