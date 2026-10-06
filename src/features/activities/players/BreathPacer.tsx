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

  // Calculate visual circle scale based on phase type (transform only)
  const isExpanding = currentPhase.label.toLowerCase().includes('inhale');
  const isContracting = currentPhase.label.toLowerCase().includes('exhale');

  let scale = 1.0;
  if (isExpanding) {
    scale = 0.8 + phaseProgress * 0.35; // 0.80 -> 1.15
  } else if (isContracting) {
    scale = 1.15 - phaseProgress * 0.35; // 1.15 -> 0.80
  } else {
    scale = 1.15; // hold
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 max-w-sm w-full text-center">
      {hasOptionalHolds && (
        <label className="flex items-center gap-2 text-xs text-muted cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={skipHolds}
            onChange={(e) => onToggleSkipHolds(e.target.checked)}
            className="w-4 h-4 rounded-xs border border-border bg-surface text-accent accent-accent focus-visible:outline-2 focus-visible:outline-ring cursor-pointer"
          />
          <span>Skip hold phases</span>
        </label>
      )}

      {reducedMotion ? (
        // Reduced motion: large phase label and thin progress bar only (no scale circle)
        <div className="w-full space-y-3 p-5 rounded-md border border-border bg-surface-2">
          <span className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-text block">
            {currentPhase.label}
          </span>
          <span className="text-lg font-mono tabular-nums text-muted block">
            {secondsRemainingInPhase}s
          </span>
          <div className="w-full max-w-[200px] mx-auto bg-surface h-1 rounded-full overflow-hidden border border-border">
            <div
              className="bg-accent h-full"
              style={{ width: `${Math.round(phaseProgress * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        // Animated circle: scales with transform only, large phase label, thin progress bar
        <div className="space-y-4 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border-2 border-accent bg-surface-2 transition-transform duration-500 ease-out will-change-transform"
              style={{ transform: `scale(${scale})` }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5 pointer-events-none">
              <span className="text-2xl sm:text-3xl font-display font-bold text-text">
                {currentPhase.label}
              </span>
              <span className="text-base font-mono tabular-nums text-muted">
                {secondsRemainingInPhase}s
              </span>
            </div>
          </div>

          {/* Thin progress bar */}
          <div className="w-36 sm:w-44 bg-surface-2 h-1 rounded-full overflow-hidden border border-border">
            <div
              className="bg-accent h-full transition-all duration-200"
              style={{ width: `${Math.round(phaseProgress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Cycle indicators */}
      <div className="flex gap-1.5 justify-center pt-1">
        {activePhases.map((p, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all ${
              idx === phaseIndex
                ? 'w-5 bg-accent'
                : 'w-1.5 bg-surface-2 border border-border'
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
