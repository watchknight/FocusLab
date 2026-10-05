'use client';

import React, { useState } from 'react';
import { IntentionStep } from './IntentionStep';
import { EnvironmentChecklist } from '@/features/environment';
import { RhythmStep, RhythmConfig } from './RhythmStep';
import { RunStep } from './RunStep';
import { BreakStep } from './BreakStep';
import { ReflectionStep } from './ReflectionStep';
import { computeFlexibleBreakSec } from '@/lib/timer';

type SessionStage = 'intention' | 'checklist' | 'rhythm' | 'run' | 'break' | 'reflection';

export const SessionFlow: React.FC = () => {
  const [stage, setStage] = useState<SessionStage>('intention');

  // Session state accumulated across blocks
  const [sessionStartedAt, setSessionStartedAt] = useState<number>(0);
  const [intention, setIntention] = useState<string>('');
  const [ifThen, setIfThen] = useState<{ when: string; then: string } | undefined>(undefined);
  const [rhythm, setRhythm] = useState<RhythmConfig>({
    presetId: '25_5',
    focusSec: 1500,
    breakSec: 300,
    isFlexible: false,
  });

  const [blocksCount, setBlocksCount] = useState<number>(0);
  const [plannedFocusSec, setPlannedFocusSec] = useState<number>(0);
  const [totalActualFocusSec, setTotalActualFocusSec] = useState<number>(0);
  const [totalDistractions, setTotalDistractions] = useState<number>(0);
  const [allParkedThoughts, setAllParkedThoughts] = useState<string[]>([]);
  const [currentBreakSec, setCurrentBreakSec] = useState<number>(300);

  const handleIntentionComplete = (
    task: string,
    plan?: { when: string; then: string }
  ) => {
    setIntention(task);
    setIfThen(plan);
    setStage('checklist');
  };

  const handleSelectRhythm = (config: RhythmConfig) => {
    setRhythm(config);
    setPlannedFocusSec(config.focusSec);
    setSessionStartedAt(Date.now());
    setStage('run');
  };

  const handleFinishBlock = (
    blockFocusSec: number,
    distractions: number,
    parked: string[]
  ) => {
    const newBlockNum = blocksCount + 1;
    setBlocksCount(newBlockNum);
    setTotalActualFocusSec((prev) => prev + blockFocusSec);
    setTotalDistractions((prev) => prev + distractions);
    setAllParkedThoughts((prev) => [...prev, ...parked]);

    // Calculate break length
    let nextBreak = rhythm.breakSec;
    if (rhythm.isFlexible) {
      nextBreak = computeFlexibleBreakSec(blockFocusSec);
    }
    setCurrentBreakSec(nextBreak);
    setStage('break');
  };

  const handleResetSession = () => {
    setStage('intention');
    setBlocksCount(0);
    setTotalActualFocusSec(0);
    setTotalDistractions(0);
    setAllParkedThoughts([]);
  };

  return (
    <div className="w-full">
      {stage === 'intention' && (
        <IntentionStep onContinue={handleIntentionComplete} />
      )}

      {stage === 'checklist' && (
        <EnvironmentChecklist
          onContinue={() => setStage('rhythm')}
          onBack={() => setStage('intention')}
        />
      )}

      {stage === 'rhythm' && (
        <RhythmStep
          onSelectRhythm={handleSelectRhythm}
          onBack={() => setStage('checklist')}
        />
      )}

      {stage === 'run' && (
        <RunStep
          intention={intention}
          ifThen={ifThen}
          rhythm={rhythm}
          onFinishBlock={handleFinishBlock}
          onAbort={() => setStage('rhythm')}
        />
      )}

      {stage === 'break' && (
        <BreakStep
          breakSec={currentBreakSec}
          blockNumber={blocksCount}
          onNextBlock={() => setStage('run')}
          onFinishSession={() => setStage('reflection')}
        />
      )}

      {stage === 'reflection' && (
        <ReflectionStep
          sessionStartedAt={sessionStartedAt}
          intention={intention}
          ifThen={ifThen}
          presetId={rhythm.presetId}
          plannedFocusSec={plannedFocusSec}
          actualFocusSec={totalActualFocusSec}
          blocksCount={blocksCount}
          totalDistractions={totalDistractions}
          allParkedThoughts={allParkedThoughts}
          onComplete={handleResetSession}
        />
      )}
    </div>
  );
};
