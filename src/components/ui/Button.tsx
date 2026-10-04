import React from 'react';
import clsx from 'clsx';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'subtle' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  fullWidth = false,
  className,
  ...props
}) => {
  const base =
    'min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-150 inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-accent text-accent-contrast hover:opacity-90 shadow-sm',
    secondary: 'bg-surface-2 text-text border border-border hover:bg-surface',
    subtle: 'bg-transparent text-muted hover:bg-surface-2 hover:text-text',
    danger: 'bg-surface-2 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30',
  };

  return (
    <button
      className={clsx(base, variants[variant], fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  );
};
