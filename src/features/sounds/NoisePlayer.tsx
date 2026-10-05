'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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

const STORAGE_KEY = 'focuslab:noise_settings';

export const NoisePlayer: React.FC = () => {
  const router = useRouter();
  const addExperiment = useFocusLabStore((state) => state.addExperiment);

  const [settings, setSettings] = useState<NoiseSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return { ...DEFAULT_NOISE_SETTINGS, ...JSON.parse(stored), color: 'off' };
        }
      } catch {
        // Fallback to defaults
      }
    }
    return DEFAULT_NOISE_SETTINGS;
  });

  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number>(0); // 0 = off
  const [sleepRemainingSec, setSleepRemainingSec] = useState<number>(0);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync settings to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ volume: settings.volume, softness: settings.softness })
        );
      } catch {
        // Ignored
      }
    }
  }, [settings.volume, settings.softness]);

  // Handle sleep timer countdown
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

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopNoise();
    };
  }, []);

  const handleSelectColor = (color: NoiseColor | 'off') => {
    const updated = { ...settings, color };
    setSettings(updated);
    if (color === 'off') {
      stopNoise();
    } else {
      startNoise(updated);
    }
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

  return (
    <Card className="p-4 sm:p-5 space-y-6 bg-surface-2 border-border">
      {/* Sound Color Selector */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
          Sound Selection
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['off', 'white', 'pink', 'brown'] as const).map((color) => {
            const isSelected = settings.color === color;
            return (
              <button
                type="button"
                key={color}
                onClick={() => handleSelectColor(color)}
                className={`min-h-[44px] px-3 py-2 text-sm font-semibold rounded-md border transition-colors capitalize ${
                  isSelected
                    ? 'bg-accent border-accent text-accent-contrast'
                    : 'bg-surface border-border text-text hover:bg-surface-2'
                }`}
              >
                {color === 'off' ? 'Off' : `${color} Noise`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Volume Slider (Max 0.6) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <label htmlFor="volume-slider" className="font-semibold text-text">
              Volume (Max 60%)
            </label>
            <span className="font-mono text-muted">
              {Math.round((settings.volume / 0.6) * 100)}%
            </span>
          </div>
          <input
            id="volume-slider"
            type="range"
            min={0}
            max={0.6}
            step={0.01}
            value={settings.volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-full accent-accent h-2 bg-surface rounded-lg cursor-pointer"
          />
        </div>

        {/* Softness (Lowpass filter) Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <label htmlFor="softness-slider" className="font-semibold text-text">
              Tone Softness (Low-pass)
            </label>
            <span className="font-mono text-muted">
              {Math.round((1 - settings.softness) * 100)}% soft
            </span>
          </div>
          <input
            id="softness-slider"
            type="range"
            min={0}
            max={1.0}
            step={0.01}
            value={settings.softness}
            onChange={(e) => handleSoftnessChange(Number(e.target.value))}
            className="w-full accent-accent h-2 bg-surface rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Sleep Timer */}
      <div className="space-y-2 pt-1 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text uppercase tracking-wider">
            Sleep Timer
          </span>
          {sleepRemainingSec > 0 && (
            <span className="font-mono text-accent">
              {Math.floor(sleepRemainingSec / 60)}m {sleepRemainingSec % 60}s left
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Off', val: 0 },
            { label: '15 min', val: 15 },
            { label: '30 min', val: 30 },
            { label: '60 min', val: 60 },
          ].map((t) => (
            <button
              type="button"
              key={t.label}
              onClick={() => setSleepTimerMinutes(t.val)}
              className={`min-h-[36px] px-3 py-1 text-xs rounded border transition-colors ${
                sleepTimerMinutes === t.val
                  ? 'bg-accent border-accent text-accent-contrast'
                  : 'bg-surface border-border text-text hover:bg-surface-2'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Test This Sound Button */}
      <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button
          variant="primary"
          disabled={settings.color === 'off'}
          onClick={handleTestSound}
          className="w-full sm:w-auto"
        >
          Test this sound in an experiment →
        </Button>
        <span className="text-xs text-muted">
          Compare {settings.color === 'off' ? 'noise' : `${settings.color} noise`} against silence
        </span>
      </div>
    </Card>
  );
};
