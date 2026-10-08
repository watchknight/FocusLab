'use client';

import React from 'react';
import { Lens } from '@/components/Lens';
import { EvidenceMeter } from '@/components/ui/EvidenceMeter';

/** Mock 1: Check test stage with the lens and a "- ms" counter */
export const CheckDeviceMock: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[280px] sm:max-w-[340px] aspect-[9/13] rounded-[24px] border border-border bg-[#07080B] text-[#F2F3F5] p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-elevation select-none"
    >
      {/* 4 Viewfinder corner brackets */}
      <span className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#9AA1AE]/55 pointer-events-none" />
      <span className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#9AA1AE]/55 pointer-events-none" />
      <span className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#9AA1AE]/55 pointer-events-none" />
      <span className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#9AA1AE]/55 pointer-events-none" />

      {/* Top HUD strip */}
      <div className="flex items-center justify-between text-xs font-mono text-[#9AA1AE] pt-1">
        <span>Check (PVT-B)</span>
        <span className="px-2 py-0.5 rounded-full border border-border/40 text-[11px]">
          Esc
        </span>
      </div>

      {/* Centred Lens stimulus */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          <Lens open={0.25} className="w-full h-full" />
        </div>
      </div>

      {/* Bottom readout */}
      <div className="flex flex-col items-center text-center space-y-1 pb-1">
        <span className="text-[11px] font-mono text-[#9AA1AE]">
          Reaction time
        </span>
        <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F3F5] tabular-nums">
          — ms
        </div>
        <span className="text-[11px] text-[#9AA1AE]/80">
          Tap anywhere on stimulus
        </span>
      </div>
    </div>
  );
};

/** Mock 2: Practice stage mock with the breathing lens */
export const PracticeDeviceMock: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[280px] sm:max-w-[340px] aspect-[9/13] rounded-[24px] border border-border bg-surface text-text p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-elevation select-none"
    >
      {/* Top header */}
      <div className="flex items-center justify-between text-xs font-mono text-muted pt-1">
        <span className="px-2.5 py-1 rounded-full border border-border bg-surface-2 font-medium">
          Cyclic sighing
        </span>
        <span className="tabular-nums font-mono text-text">05:00</span>
      </div>

      {/* Center breathing lens with phase label */}
      <div className="flex flex-col items-center justify-center my-auto space-y-3">
        <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          <Lens open={0.82} className="w-full h-full" />
        </div>
        <div className="text-center">
          <div className="font-display font-bold text-xl sm:text-2xl text-text">
            Inhale
          </div>
          <div className="text-xs text-muted">Deep breath in (nose)</div>
        </div>
      </div>

      {/* Bottom progress bar & evidence badge */}
      <div className="space-y-3 pb-1">
        <div className="w-full bg-surface-2 h-1 rounded-full overflow-hidden border border-border/50">
          <div className="bg-primary-bg h-full w-[45%] rounded-full" />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted text-[11px]">Phase 1 of 3</span>
          <EvidenceMeter tier="moderate" size={18} />
        </div>
      </div>
    </div>
  );
};

/** Mock 3: Compare stage mock with a small dot plot of circles versus diamonds */
export const CompareDeviceMock: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[280px] sm:max-w-[340px] aspect-[9/13] rounded-[24px] border border-border bg-surface text-text p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-elevation select-none"
    >
      {/* Top header */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="font-mono text-muted text-[11px]">
          Protocol runs
        </span>
        <span className="px-2 py-0.5 rounded-full border border-tier-strong/40 text-tier-strong font-mono text-xs font-semibold">
          −18 ms
        </span>
      </div>

      {/* Dot plot: Circles (Practice) vs Diamonds (Rest) */}
      <div className="my-auto py-2">
        <svg
          viewBox="0 0 240 140"
          className="w-full h-auto overflow-visible"
          aria-hidden="true"
        >
          {/* Subtle grid lines */}
          <line x1="20" y1="20" x2="220" y2="20" stroke="var(--border)" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1="20" y1="60" x2="220" y2="60" stroke="var(--border)" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1="20" y1="100" x2="220" y2="100" stroke="var(--border)" strokeDasharray="3 3" strokeWidth="0.8" />

          {/* Y Axis labels */}
          <text x="14" y="24" fontSize="9" fill="var(--muted)" textAnchor="end" fontFamily="var(--font-mono)">280</text>
          <text x="14" y="64" fontSize="9" fill="var(--muted)" textAnchor="end" fontFamily="var(--font-mono)">250</text>
          <text x="14" y="104" fontSize="9" fill="var(--muted)" textAnchor="end" fontFamily="var(--font-mono)">220</text>

          {/* Session 1: Run 1 */}
          <line x1="60" y1="42" x2="60" y2="78" stroke="var(--border-strong)" strokeWidth="1" />
          <polygon points="60,36 65,42 60,48 55,42" fill="var(--text)" />
          <circle cx="60" cy="78" r="5" fill="var(--primary-bg)" stroke="var(--border)" strokeWidth="1" />
          <text x="60" y="125" fontSize="10" fill="var(--muted)" textAnchor="middle" fontFamily="var(--font-mono)">Run 1</text>

          {/* Session 2: Run 2 */}
          <line x1="120" y1="48" x2="120" y2="84" stroke="var(--border-strong)" strokeWidth="1" />
          <polygon points="120,42 125,48 120,54 115,48" fill="var(--text)" />
          <circle cx="120" cy="84" r="5" fill="var(--primary-bg)" stroke="var(--border)" strokeWidth="1" />
          <text x="120" y="125" fontSize="10" fill="var(--muted)" textAnchor="middle" fontFamily="var(--font-mono)">Run 2</text>

          {/* Session 3: Run 3 */}
          <line x1="180" y1="52" x2="180" y2="90" stroke="var(--border-strong)" strokeWidth="1" />
          <polygon points="180,46 185,52 180,58 175,52" fill="var(--text)" />
          <circle cx="180" cy="90" r="5" fill="var(--primary-bg)" stroke="var(--border)" strokeWidth="1" />
          <text x="180" y="125" fontSize="10" fill="var(--muted)" textAnchor="middle" fontFamily="var(--font-mono)">Run 3</text>
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-muted pt-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-bg inline-block" />
            Practice
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-text inline-block" />
            Plain rest
          </span>
        </div>
      </div>

      {/* Bottom verdict strip */}
      <div className="pt-2 border-t border-border/70 flex items-center justify-between text-xs">
        <span className="font-semibold text-text text-[11px] truncate mr-2">
          Practice beat rest in 3 runs
        </span>
        <EvidenceMeter tier="emerging" size={18} />
      </div>
    </div>
  );
};
