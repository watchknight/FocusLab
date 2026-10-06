'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { NoiseColor, NoiseSettings, DEFAULT_NOISE_SETTINGS, startNoise, updateNoiseSettings, stopNoise } from '@/lib/noise';
import { createExperimentSchedule } from '@/lib/experiments';
import { useMotionAllowed, useCalm } from '@/lib/motion';
import { useFocusLabStore } from '@/store';
import { Experiment } from '@/store/types';

const STORAGE_KEY = 'focuslab:noise_settings';

// Exactly 12 bars with staggered delays for audio visualizer
const BAR_DELAYS = ['0.0s', '0.18s', '0.36s', '0.54s', '0.12s', '0.42s', '0.24s', '0.6s', '0.3s', '0.48s', '0.15s', '0.33s'];

export const NoisePlayer: React.FC = () => {
  const router = useRouter();
  const motionAllowed = useMotionAllowed();
  const { calm } = useCalm();
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
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume: settings.volume, softness: settings.softness })); } catch { /* Ignored */ }
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
    return () => { if (sleepTimerRef.current) clearInterval(sleepTimerRef.current); };
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
  const isAnimated = isPlaying && motionAllowed && !calm;

  return (
    <Panel variant="surface-2" className="space-y-6">
      {/* 1. Noise type as a segmented control */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted block">Noise Profile</label>
        <div role="radiogroup" aria-label="Noise profile selection" className="grid grid-cols-4 p-1 rounded-sm border border-border bg-surface">
          {(['off', 'white', 'pink', 'brown'] as const).map((color) => {
            const isSelected = settings.color === color;
            return (
              <button
                type="button"
                key={color}
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelectColor(color)}
                className={`min-h-[44px] px-2 py-2 text-xs sm:text-sm font-semibold rounded-xs transition-colors capitalize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  isSelected ? 'bg-accent text-on-accent border border-accent-edge shadow-elevation' : 'text-muted hover:text-text'
                }`}
              >
                {color === 'off' ? 'Off' : `${color}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 12-bar level indicator */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs text-muted">
          <span className="font-semibold text-text">Output Level</span>
          <span className="font-mono tabular-nums">{isPlaying ? `${settings.color} noise active` : 'Inactive'}</span>
        </div>
        <div className="flex items-end justify-center gap-1.5 sm:gap-2 h-12 py-1 px-4 rounded-md bg-surface border border-border overflow-hidden" aria-hidden="true">
          {BAR_DELAYS.map((delay, idx) => (
            <div
              key={idx}
              className={`w-2 sm:w-2.5 h-9 rounded-xs transition-transform ${isPlaying ? 'bg-accent' : 'bg-border'} ${isAnimated ? 'sound-bar-animating' : ''}`}
              style={{ animationDelay: delay, transform: !isAnimated ? 'scaleY(0.18)' : undefined, transformOrigin: 'bottom' }}
            />
          ))}
        </div>
      </div>

      {/* Empty State Banner when audio is inactive */}
      {!isPlaying && (
        <div className="p-3.5 rounded-sm bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-text font-medium">Select a noise profile above to play background sound and mask auditory distractions.</span>
          <Button variant="primary" onClick={() => handleSelectColor('brown')} className="text-xs min-h-[44px] shrink-0">
            Play Brown Noise
          </Button>
        </div>
      )}

      {/* Volume & Softness Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <label htmlFor="volume-slider" className="font-semibold text-text">Volume (Max 60%)</label>
            <span className="font-mono tabular-nums text-muted">{Math.round((settings.volume / 0.6) * 100)}%</span>
          </div>
          <div className="min-h-[44px] flex items-center">
            <input
              id="volume-slider"
              type="range"
              min={0}
              max={0.6}
              step={0.01}
              value={settings.volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              aria-label="Volume slider, maximum 60 percent"
              className="w-full accent-accent h-2 bg-surface rounded-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <label htmlFor="softness-slider" className="font-semibold text-text">Tone Softness (Low-pass)</label>
            <span className="font-mono tabular-nums text-muted">{Math.round((1 - settings.softness) * 100)}% soft</span>
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
              className="w-full accent-accent h-2 bg-surface rounded-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
          </div>
        </div>
      </div>

      {/* Sleep Timer */}
      <div className="space-y-2 pt-1 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text">Sleep Timer</span>
          {sleepRemainingSec > 0 && (
            <span className="font-mono text-accent tabular-nums">{Math.floor(sleepRemainingSec / 60)}m {sleepRemainingSec % 60}s left</span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-sm border border-border bg-surface">
          {[{ label: 'Off', val: 0 }, { label: '15m', val: 15 }, { label: '30m', val: 30 }, { label: '60m', val: 60 }].map((t) => (
            <button
              type="button"
              key={t.label}
              onClick={() => setSleepTimerMinutes(t.val)}
              className={`min-h-[44px] py-1 text-xs font-semibold rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                sleepTimerMinutes === t.val ? 'bg-accent text-on-accent border border-accent-edge shadow-elevation' : 'text-muted hover:text-text'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Test Button */}
      <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button variant="secondary" disabled={!isPlaying} onClick={handleTestSound} className="w-full sm:w-auto">
          Test this sound
        </Button>
        <span className="text-xs text-muted">Compare {settings.color === 'off' ? 'noise' : `${settings.color} noise`} against silence</span>
      </div>
    </Panel>
  );
};

export default NoisePlayer;
