import React from 'react';
import clsx from 'clsx';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  selected = false,
  className,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={clsx(
        'inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] motion-reduce:active:scale-100',
        selected
          ? 'bg-primary-bg text-primary-text border border-transparent shadow-sm'
          : 'bg-surface-2 text-muted hover:text-text border border-border hover:bg-surface',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Chip;
