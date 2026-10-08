'use client';

import React from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

interface SleepTimerControlProps {
  sleepTimerMinutes: number;
  sleepRemainingSec: number;
  onSelectDuration: (minutes: number) => void;
}

export const SleepTimerControl: React.FC<SleepTimerControlProps> = ({
  sleepTimerMinutes,
  sleepRemainingSec,
  onSelectDuration,
}) => {
  return (
    <div className="space-y-3 pt-2 border-t border-border">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-text uppercase tracking-wider">Sleep Timer</span>
        {sleepRemainingSec > 0 && (
          <span className="font-mono text-text font-bold tabular-nums">
            {Math.floor(sleepRemainingSec / 60)}m {sleepRemainingSec % 60}s remaining
          </span>
        )}
      </div>
      <SegmentedControl<number>
        name="Sleep Timer"
        value={sleepTimerMinutes}
        onChange={onSelectDuration}
        options={[
          { id: 0, label: 'Off' },
          { id: 15, label: '15m' },
          { id: 30, label: '30m' },
          { id: 60, label: '60m' },
        ]}
        className="w-full justify-between"
      />
    </div>
  );
};

export default SleepTimerControl;
