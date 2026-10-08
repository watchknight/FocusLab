'use client';

import React, { useEffect, useState } from 'react';
import { getFx } from '@/lib/gsap';

interface LevelBarsProps {
  isPlaying: boolean;
}

const BAR_PATTERNS = [
  { minScale: 0.18, maxScale: 0.75, dur: 0.65, delay: 0.0 },
  { minScale: 0.22, maxScale: 1.0, dur: 0.85, delay: 0.1 },
  { minScale: 0.15, maxScale: 0.65, dur: 0.55, delay: 0.2 },
  { minScale: 0.25, maxScale: 0.95, dur: 0.95, delay: 0.05 },
  { minScale: 0.18, maxScale: 0.85, dur: 0.75, delay: 0.15 },
  { minScale: 0.2, maxScale: 0.8, dur: 0.60, delay: 0.25 },
  { minScale: 0.22, maxScale: 0.98, dur: 0.90, delay: 0.12 },
  { minScale: 0.16, maxScale: 0.7, dur: 0.70, delay: 0.18 },
];

export const LevelBars: React.FC<LevelBarsProps> = ({ isPlaying }) => {
  const [isCalm, setIsCalm] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const checkCalm = () => {
      setIsCalm(document.documentElement.dataset.calm === 'on');
    };
    checkCalm();

    const observer = new MutationObserver(checkCalm);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-calm'],
    });

    return () => observer.disconnect();
  }, []);

  const shouldAnimate = isPlaying && !isCalm && getFx() !== 'off';

  return (
    <div
      className="flex items-end justify-center gap-1.5 h-11 px-4 py-1.5 rounded-sm bg-surface-2 border border-border"
      aria-label={isPlaying ? 'Audio output levels active' : 'Audio output idle'}
      role="img"
    >
      {BAR_PATTERNS.map((bar, idx) => (
        <span
          key={idx}
          className={`w-1.5 h-8 origin-bottom rounded-full transition-colors ${
            shouldAnimate ? 'bg-primary-bg' : 'bg-border'
          }`}
          style={{
            transform: shouldAnimate ? undefined : 'scaleY(0.12)',
            opacity: shouldAnimate ? undefined : 0.35,
            animation: shouldAnimate
              ? `levelScalePulse ${bar.dur}s ease-in-out ${bar.delay}s infinite alternate`
              : 'none',
          }}
        />
      ))}

      <style jsx>{`
        @keyframes levelScalePulse {
          0% {
            transform: scaleY(0.18);
            opacity: 0.45;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LevelBars;
