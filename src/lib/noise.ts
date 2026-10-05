export type NoiseColor = 'white' | 'pink' | 'brown';

export interface NoiseSettings {
  color: NoiseColor | 'off';
  volume: number; // 0.0 to 0.6
  softness: number; // 0.0 (very soft/filtered) to 1.0 (bright/open)
}

export const DEFAULT_NOISE_SETTINGS: NoiseSettings = {
  color: 'off',
  volume: 0.2,
  softness: 0.5,
};

const DURATION_SEC = 20;
const MAX_VOLUME = 0.6;

let audioCtx: AudioContext | null = null;
const bufferCache: Partial<Record<NoiseColor, AudioBuffer>> = {};

let activeSource: AudioBufferSourceNode | null = null;
let activeGain: GainNode | null = null;
let activeFilter: BiquadFilterNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function generateNoiseBuffer(ctx: AudioContext, color: NoiseColor): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * DURATION_SEC;
  const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const output = buffer.getChannelData(channel);

    if (color === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (color === 'pink') {
      // Paul Kellet's filter method
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        output[i] = pink * 0.11;
      }
    } else if (color === 'brown') {
      // Integrated brownian noise (random walk with leaky integrator)
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        output[i] = lastOut * 3.5;
      }
    }
  }

  return buffer;
}

function mapSoftnessToFrequency(softness: number): number {
  // Map 0.0 -> 500 Hz (very soft), 1.0 -> 18000 Hz (open)
  const clamped = Math.max(0, Math.min(1, softness));
  return 500 * Math.pow(18000 / 500, clamped);
}

export function startNoise(settings: NoiseSettings): void {
  if (settings.color === 'off') {
    stopNoise();
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  // Stop any currently running noise with short fade
  stopNoise();

  if (!bufferCache[settings.color]) {
    bufferCache[settings.color] = generateNoiseBuffer(ctx, settings.color);
  }
  const buffer = bufferCache[settings.color]!;

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(mapSoftnessToFrequency(settings.softness), ctx.currentTime);

  const gain = ctx.createGain();
  const targetVol = Math.max(0, Math.min(MAX_VOLUME, settings.volume));
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.12);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(0);

  activeSource = source;
  activeFilter = filter;
  activeGain = gain;
}

export function updateNoiseSettings(settings: Partial<NoiseSettings>): void {
  const ctx = getAudioContext();
  if (!ctx || !activeGain || !activeFilter) return;

  if (settings.volume !== undefined) {
    const targetVol = Math.max(0, Math.min(MAX_VOLUME, settings.volume));
    activeGain.gain.setValueAtTime(activeGain.gain.value, ctx.currentTime);
    activeGain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.05);
  }

  if (settings.softness !== undefined) {
    const freq = mapSoftnessToFrequency(settings.softness);
    activeFilter.frequency.setValueAtTime(activeFilter.frequency.value, ctx.currentTime);
    activeFilter.frequency.linearRampToValueAtTime(freq, ctx.currentTime + 0.05);
  }
}

export function stopNoise(): void {
  if (!activeGain || !activeSource) return;

  const ctx = getAudioContext();
  const currentSource = activeSource;
  const currentGain = activeGain;

  activeSource = null;
  activeGain = null;
  activeFilter = null;

  if (ctx && ctx.state !== 'closed') {
    const now = ctx.currentTime;
    currentGain.gain.setValueAtTime(currentGain.gain.value, now);
    currentGain.gain.linearRampToValueAtTime(0.0001, now + 0.1);
    currentSource.stop(now + 0.11);
  } else {
    try {
      currentSource.stop(0);
    } catch {
      // Ignored
    }
  }
}
