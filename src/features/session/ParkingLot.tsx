'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ParkingLotProps {
  thoughts: string[];
  onAddThought: (thought: string) => void;
  stageMode?: boolean;
}

export const ParkingLot: React.FC<ParkingLotProps> = ({ thoughts, onAddThought, stageMode = false }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAddThought(input.trim());
    setInput('');
  };

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-[16px] border space-y-3 ${
        stageMode
          ? 'bg-[#14171E] border-[#2A2F3B] text-[#F2F3F5]'
          : 'bg-surface border-border text-text shadow-elevation'
      }`}
    >
      <label
        htmlFor="park-thought"
        className={`block text-xs font-semibold ${stageMode ? 'text-[#F2F3F5]' : 'text-text'}`}
      >
        Parking lot (Jot down sudden thoughts)
      </label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          id="park-thought"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Capture distraction to review later..."
          className={`flex-1 min-h-[44px] px-3 py-1.5 text-xs rounded-sm border focus-visible:outline-2 focus-visible:outline-ring ${
            stageMode
              ? 'bg-[#07080B] border-[#2A2F3B] text-[#F2F3F5] placeholder:text-[#9AA1AE]/60 focus-visible:outline-[#F2F3F5]'
              : 'bg-surface border-border text-text'
          }`}
        />
        <Button
          type="submit"
          variant="secondary"
          className={`text-xs px-3 min-h-[44px] ${
            stageMode
              ? 'bg-[#1B1F28] border-[#2A2F3B] text-[#F2F3F5] hover:bg-[#2A2F3B]'
              : ''
          }`}
        >
          Park
        </Button>
      </form>
      {thoughts.length > 0 ? (
        <ul
          className={`text-xs space-y-1.5 max-h-32 overflow-y-auto pt-1 border-t ${
            stageMode ? 'border-[#2A2F3B] text-[#9AA1AE]' : 'border-border text-muted'
          }`}
        >
          {thoughts.map((t, idx) => (
            <li
              key={idx}
              className={`truncate p-1.5 rounded-sm border ${
                stageMode
                  ? 'bg-[#07080B] border-[#2A2F3B] text-[#F2F3F5]'
                  : 'bg-surface border-border text-text'
              }`}
            >
              • {t}
            </li>
          ))}
        </ul>
      ) : (
        <p className={`text-[11px] italic ${stageMode ? 'text-[#9AA1AE]/70' : 'text-muted'}`}>
          No parked thoughts yet. Unload thoughts here to keep focus clear.
        </p>
      )}
    </div>
  );
};

export default ParkingLot;
