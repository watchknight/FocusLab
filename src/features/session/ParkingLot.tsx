'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ParkingLotProps {
  thoughts: string[];
  onAddThought: (thought: string) => void;
}

export const ParkingLot: React.FC<ParkingLotProps> = ({ thoughts, onAddThought }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAddThought(input.trim());
    setInput('');
  };

  return (
    <Card className="p-4 space-y-3">
      <label htmlFor="park-thought" className="block text-xs font-semibold text-text">
        Parking lot (Jot down sudden thoughts)
      </label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          id="park-thought"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Capture distraction to review later..."
          className="flex-1 min-h-[44px] px-3 py-1.5 text-xs rounded-xs border border-border bg-surface text-text focus-visible:outline-2 focus-visible:outline-ring"
        />
        <Button type="submit" variant="secondary" className="text-xs px-3 min-h-[44px]">
          Park
        </Button>
      </form>
      {thoughts.length > 0 ? (
        <ul className="text-xs text-muted space-y-1.5 max-h-36 overflow-y-auto pt-1 border-t border-border">
          {thoughts.map((t, idx) => (
            <li key={idx} className="truncate bg-surface p-1.5 rounded-xs border border-border">
              • {t}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[11px] text-muted italic">
          No parked thoughts yet. Unload thoughts here to keep focus clear.
        </p>
      )}
    </Card>
  );
};
