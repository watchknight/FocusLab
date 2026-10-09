'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
  NoiseColor,
  NoiseSettings,
  DEFAULT_NOISE_SETTINGS,
  startNoise,
  updateNoiseSettings,
  stopNoise,
} from '@/lib/noise';
import { createExperimentSchedule } from '@/lib/experiments';
import { useFocusLabStore } from '@/store';
import { Experiment } from '@/store/types';
import { VolumeKnob } from './VolumeKnob';
import { LevelBars } from './LevelBars';
import { SleepTimerControl } from './SleepTimerControl';

const STORAGE_KEY = 'focuslab:noise_settings';

export const NoisePlayer: React.FC = () => {
  const router = useRouter();
  const addExperiment = useFocusLabStore((state) => state.addExperiment);

  const [settings, setSettings] = useState<NoiseSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return { ...DEFAULT_NOISE_SETTINGS, ...JSON.parse(stored), color: 'off' };
      } catch { /* Fallback */ }
    }
    return DEFAULT_NOISE_SETTINGS;
  });

  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number>(0);
  const [sleepRemainingSec, setSleepRemainingSec] = useState<number>(0);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume: settings.volume, softness: settings.softness }));
      } catch { /* Ignored */ }
    }
  }, [settings.volume, settings.softness]);

  useEffect(() => {
    if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    if (sleepTimerMinutes > 0 && settings.color !== 'off') {
      setSleepRemainingSec(sleepTimerMinutes * 60);
      sleepTimerRef.current = setInterval(() => {
        setSleepRemainingSec((prev) => {
          if (prev <= 1) {
            if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
            stopNoise();
            setSettings((s) => ({ ...s, color: 'off' }));
            setSleepTimerMinutes(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSleepRemainingSec(0);
    }
    return () => {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    };
  }, [sleepTimerMinutes, settings.color]);

  useEffect(() => () => { stopNoise(); }, []);

  const handleSelectColor = (color: NoiseColor | 'off') => {
    const updated = { ...settings, color };
    setSettings(updated);
    if (color === 'off') stopNoise();
    else startNoise(updated);
  };

  const handleVolumeChange = (vol: number) => {
    const clamped = Math.max(0, Math.min(0.6, vol));
    setSettings((s) => ({ ...s, volume: clamped }));
    updateNoiseSettings({ volume: clamped });
  };

  const handleSoftnessChange = (softness: number) => {
    const clamped = Math.max(0, Math.min(1.0, softness));
    setSettings((s) => ({ ...s, softness: clamped }));
    updateNoiseSettings({ softness: clamped });
  };

  const handleTestSound = () => {
    if (settings.color === 'off') return;
    stopNoise();
    const activeConditionId = `sound:${settings.color}`;
    const schedule = createExperimentSchedule(activeConditionId, 'sound:silence');
    const newExperiment: Experiment = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      design: 'concurrent',
      conditionIds: [activeConditionId, 'sound:silence'],
      schedule,
      runs: [],
    };
    addExperiment(newExperiment);
    router.push('/experiments');
  };

  const isPlaying = settings.color !== 'off';

  return (
    <Panel variant="surface-2" className="space-y-6">
      {/* 1. Noise type as segmented control */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted block">
          Noise profile
        </label>
        <SegmentedControl<NoiseColor | 'off'>
          name="Noise Profile Selection"
          value={settings.color}
          onChange={handleSelectColor}
          options={[
            { id: 'off', label: 'Off' },
            { id: 'white', label: 'White' },
            { id: 'pink', label: 'Pink' },
            { id: 'brown', label: 'Brown' },
          ]}
          className="w-full justify-between"
        />
      </div>

      {/* 2. Output indicator & Real-time level bars */}
      <div className="p-4 sm:p-5 rounded-md bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full border transition-colors ${
              isPlaying ? 'bg-primary-bg border-border-strong' : 'bg-surface-2 border-border'
            }`}
            aria-hidden="true"
          />
          <div>
            <span className="text-sm font-bold text-text font-display block">
              {isPlaying
                ? `${settings.color.charAt(0).toUpperCase() + settings.color.slice(1)} noise active`
                : 'Sound stopped'}
            </span>
            <span className="text-xs text-muted">
              {isPlaying
                ? `Volume ${Math.round((settings.volume / 0.6) * 100)}%, softness ${Math.round(settings.softness * 100)}%`
                : 'Select a noise profile above to play'}
            </span>
          </div>
        </div>

        {/* Level bars that move only while sound plays and no Check is running */}
        <div className="shrink-0 flex items-center gap-3">
          <LevelBars isPlaying={isPlaying} />
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${
              isPlaying
                ? 'bg-tier-strong/10 text-tier-strong border-tier-strong/30'
                : 'bg-surface-2 text-muted border-border'
            }`}
          >
            {isPlaying ? 'Active' : 'Muted'}
          </span>
        </div>
      </div>

      {/* Empty state when sound is stopped: one sentence and a primary button */}
      {!isPlaying && (
        <div className="p-4 rounded-sm bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-text font-medium leading-relaxed">
            Select a noise profile above to play background sound and mask auditory distractions.
          </span>
          <Button variant="primary" onClick={() => handleSelectColor('brown')} className="text-xs shrink-0">
            Play Brown Noise
          </Button>
        </div>
      )}

      {/* Volume Knob & Softness control */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 items-center">
        <div className="p-4 rounded-sm bg-surface border border-border">
          <VolumeKnob volume={settings.volume} maxVolume={0.6} onChange={handleVolumeChange} />
        </div>

        <div className="p-4 rounded-sm bg-surface border border-border space-y-4">
          <div className="flex justify-between text-xs">
            <label htmlFor="softness-slider" className="font-semibold text-text">
              Tone softness (Low-pass)
            </label>
            <span className="font-mono tabular-nums text-text font-bold">
              {Math.round((1 - settings.softness) * 100)}% soft
            </span>
          </div>
          <div className="min-h-[44px] flex items-center">
            <input
              id="softness-slider"
              type="range"
              min={0}
              max={1.0}
              step={0.01}
              value={settings.softness}
              onChange={(e) => handleSoftnessChange(Number(e.target.value))}
              aria-label="Tone softness low-pass filter slider"
              className="w-full h-2 bg-surface-2 border border-border rounded-full accent-primary-bg cursor-pointer focus-visible:outline-2 focus-visible:outline-ring"
            />
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Lowers high-frequency hiss for gentler, less fatiguing acoustic masking.
          </p>
        </div>
      </div>

      {/* Sleep Timer */}
      <SleepTimerControl
        sleepTimerMinutes={sleepTimerMinutes}
        sleepRemainingSec={sleepRemainingSec}
        onSelectDuration={(val) => setSleepTimerMinutes(val)}
      />

      {/* Test this sound button */}
      <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button variant="secondary" disabled={!isPlaying} onClick={handleTestSound} className="w-full sm:w-auto">
          Test this sound
        </Button>
        <span className="text-xs text-muted">
          Compare {settings.color === 'off' ? 'noise' : `${settings.color} noise`} against silence in a 10-run self-experiment.
        </span>
      </div>
    </Panel>
  );
};

export default NoisePlayer;
