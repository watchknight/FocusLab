'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { getEvidenceById } from '@/content/evidence';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type NoiseType = 'brown' | 'pink' | 'white';

export const SoundGenerator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNoise, setSelectedNoise] = useState<NoiseType>('brown');
  const volume = useFocusStore((s) => s.soundVolume);
  const setVolume = useFocusStore((s) => s.setSoundVolume);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const evidence = getEvidenceById('ev_pink_brown_noise');

  const createNoiseBuffer = (
    ctx: AudioContext,
    type: NoiseType
  ): AudioBuffer => {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds looped
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0.0;
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'brown') {
        // Brown noise: integrated white noise (soft, deep rumble)
        lastOut = (lastOut + 0.02 * white) / 1.02;
        output[i] = lastOut * 3.5;
      } else if (type === 'pink') {
        // Pink noise: 1/f noise filter (Paul Kellet's filter)
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        // Pure White noise
        output[i] = white * 0.15;
      }
    }
    return buffer;
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch {
        // Ignore if already stopped
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const startAudio = () => {
    stopAudio();

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContextClass();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    gainNode.connect(ctx.destination);
    gainNodeRef.current = gainNode;

    const buffer = createNoiseBuffer(ctx, selectedNoise);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNode);
    source.start(0);
    sourceNodeRef.current = source;

    setIsPlaying(true);
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        volume * 0.3,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      startAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNoise]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-content-primary">
            Acoustic Soundscapes
          </h1>
          {evidence && <EvidenceBadge level={evidence.level} />}
        </div>
        <p className="text-xs text-content-secondary">
          Synthesized directly in your browser using the Web Audio API. No
          external audio files, stream lag, or network requests.
        </p>
      </div>

      <Card as="section" className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-content-primary block mb-2">
            Sound Profile
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['brown', 'pink', 'white'] as NoiseType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedNoise(type)}
                className={`min-h-[44px] px-3 py-2 text-xs font-semibold rounded border capitalize transition-colors ${
                  selectedNoise === type
                    ? 'border-teal-accent bg-teal-accent text-white'
                    : 'border-surface-border bg-surface-primary text-content-secondary hover:bg-surface-tertiary'
                }`}
                aria-pressed={selectedNoise === type}
              >
                {type} Noise
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-content-secondary">
            <label htmlFor="volume-slider" className="font-semibold">
              Volume
            </label>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-teal-accent"
          />
        </div>

        <div className="pt-2">
          <Button
            variant={isPlaying ? 'secondary' : 'primary'}
            onClick={isPlaying ? stopAudio : startAudio}
            fullWidth
          >
            {isPlaying ? 'Stop Sound' : 'Play Soundscape'}
          </Button>
        </div>
      </Card>

      {evidence && (
        <Card as="aside" className="space-y-2 bg-surface-secondary/60">
          <h2 className="text-xs font-semibold text-content-primary">
            Honest Evidence Note
          </h2>
          <p className="text-xs text-content-secondary">
            {evidence.claimSummary}
          </p>
          <p className="text-xs text-content-muted">
            <em>Caveat:</em> {evidence.counterClaimOrCaveat}
          </p>
        </Card>
      )}
    </div>
  );
};
