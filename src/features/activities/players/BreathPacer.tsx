'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PlayerShell } from './PlayerShell';
import { Activity, BreathPhase } from '@/content/types';
import { playSoftChime } from '@/lib/audio';
import { Lens } from '@/components/Lens';
import { tweenAperture } from '@/lib/motion-hooks';
import { getFx } from '@/lib/gsap';

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
  const lensRef = useRef<SVGSVGElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const currentApertureRef = useRef<number>(0.15);
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

  const phaseProgress = Math.min(1, phaseElapsed / (currentPhase.seconds || 1));
  const secondsRemainingInPhase = Math.max(1, currentPhase.seconds - phaseElapsed);

  const fx = getFx();
  const isFxOff = fx === 'off' || reducedMotion;

  // Drive aperture tween on phase change
  useEffect(() => {
    if (isFxOff || !lensRef.current) return;

    if (phaseIndex !== lastPhaseIndexRef.current) {
      lastPhaseIndexRef.current = phaseIndex;

      // Play soft chime on phase shift if audio is enabled
      if (!isPaused && audioEnabled) {
        playSoftChime();
      }

      // Determine target aperture: inhale -> 0.9 (or 0.75 if followed by top-up), top-up -> 0.95, hold -> stays, exhale -> 0.15
      const label = currentPhase.label.toLowerCase();
      let targetAperture = currentApertureRef.current;
      if (label.includes('top-up')) {
        targetAperture = 0.95;
      } else if (label.includes('inhale')) {
        const hasTopUp = activePhases.some((p) => p.label.toLowerCase().includes('top-up'));
        targetAperture = hasTopUp ? 0.75 : 0.9;
      } else if (label.includes('exhale')) {
        targetAperture = 0.15;
      } // hold stays at currentApertureRef.current

      // Kill previous tween
      if (tweenRef.current) {
        tweenRef.current.kill();
      }

      const fromAperture = currentApertureRef.current;
      currentApertureRef.current = targetAperture;

      if (!isPaused && fromAperture !== targetAperture) {
        tweenRef.current = tweenAperture(
          lensRef.current,
          fromAperture,
          targetAperture,
          currentPhase.seconds,
          'power1.inOut'
        );
      }
    }
  }, [phaseIndex, currentPhase, isPaused, audioEnabled, isFxOff, activePhases]);

  // Pause / resume tween when isPaused toggles
  useEffect(() => {
    if (isPaused) {
      tweenRef.current?.pause();
    } else {
      tweenRef.current?.resume();
    }
  }, [isPaused]);

  // Clean up tween on unmount
  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 max-w-sm w-full text-center select-none">
      {hasOptionalHolds && (
        <label className="flex items-center gap-2 text-xs text-[#9AA1AE] cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={skipHolds}
            onChange={(e) => onToggleSkipHolds(e.target.checked)}
            className="w-4 h-4 rounded-xs border border-[#2A2F3B] bg-[#14171E] text-[#F2F3F5] accent-white focus-visible:outline-2 focus-visible:outline-[#F2F3F5] cursor-pointer"
          />
          <span>Skip optional hold phases</span>
        </label>
      )}

      {isFxOff ? (
        // fx off / reduced motion: text label and thin progress bar only
        <div className="w-full space-y-3 p-6 rounded-[16px] border border-[#2A2F3B] bg-[#14171E]">
          <span className="text-3xl sm:text-4xl landscape:text-2xl font-display font-bold tracking-tight text-[#F2F3F5] block">
            {currentPhase.label}
          </span>
          <span className="text-lg font-mono tabular-nums text-[#9AA1AE] block">
            {secondsRemainingInPhase}s
          </span>
          <div className="w-full max-w-[200px] mx-auto bg-[#07080B] h-1 rounded-full overflow-hidden border border-[#2A2F3B]">
            <div
              className="bg-[#F2F3F5] h-full"
              style={{ width: `${Math.round(phaseProgress * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        // Standard: Lens pacer driven per phase with tweenAperture
        <div className="space-y-3 sm:space-y-4 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 landscape:w-28 landscape:h-28 flex items-center justify-center">
            <Lens
              ref={lensRef}
              open={0.15}
              className="w-full h-full drop-shadow-md"
              title={`${currentPhase.label} breathing pacer`}
            />
          </div>

          {/* Large phase label */}
          <div className="space-y-0.5">
            <span className="text-3xl sm:text-4xl landscape:text-2xl font-display font-bold tracking-tight text-[#F2F3F5] block">
              {currentPhase.label}
            </span>
            <span className="text-sm font-mono tabular-nums text-[#9AA1AE] block">
              {secondsRemainingInPhase}s
            </span>
          </div>

          {/* Thin progress bar */}
          <div className="w-44 sm:w-56 landscape:w-36 bg-[#1B1F28] h-1 rounded-full overflow-hidden border border-[#2A2F3B]">
            <div
              className="bg-[#F2F3F5] h-full transition-all duration-200"
              style={{ width: `${Math.round(phaseProgress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Cycle phase pips */}
      <div className="flex gap-1.5 justify-center pt-1" aria-hidden="true">
        {activePhases.map((p, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all ${
              idx === phaseIndex ? 'w-5 bg-[#F2F3F5]' : 'w-1.5 bg-[#1B1F28] border border-[#2A2F3B]'
            }`}
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

  const rawPhases = activity.pattern?.phases || DEFAULT_PHASES;
  const hasOptionalHolds = useMemo(
    () => rawPhases.some((p) => p.optional),
    [rawPhases]
  );

  const activePhases = useMemo(() => {
    if (skipHolds) {
      return rawPhases.filter((p) => !p.optional);
    }
    return rawPhases;
  }, [rawPhases, skipHolds]);

  const cycleDuration = useMemo(
    () => activePhases.reduce((acc, p) => acc + p.seconds, 0),
    [activePhases]
  );

  return (
    <PlayerShell activity={activity} durationSec={durationSec} onClose={onClose}>
      {({ elapsedSec, isPaused, audioEnabled, reducedMotion }) => (
        <PacerContent
          elapsedSec={elapsedSec}
          isPaused={isPaused}
          audioEnabled={audioEnabled}
          reducedMotion={reducedMotion}
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

export default BreathPacer;
