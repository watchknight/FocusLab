'use client';

import React from 'react';
import clsx from 'clsx';

export interface SegmentedControlOption<T extends string | number> {
  id: T;
  label: React.ReactNode;
  ariaLabel?: string;
}

export interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  name?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  className,
  name,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={clsx(
        'inline-flex items-center gap-1 p-1 bg-surface-2 border border-border rounded-full select-none max-w-full overflow-x-auto',
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = opt.id === value;
        return (
          <button
            key={String(opt.id)}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={opt.ariaLabel}
            onClick={() => onChange(opt.id)}
            className={clsx(
              'min-h-[44px] px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-150 inline-flex items-center justify-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] motion-reduce:active:scale-100',
              isSelected
                ? 'bg-primary-bg text-primary-text shadow-sm'
                : 'text-muted hover:text-text hover:bg-surface'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
