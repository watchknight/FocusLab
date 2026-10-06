import React from 'react';
import clsx from 'clsx';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'subtle' | 'danger';
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
    'min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-semibold rounded-sm transition duration-150 inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] motion-reduce:active:scale-100';

  const variants: Record<string, string> = {
    primary:
      'bg-accent text-on-accent border-2 border-accent-edge hover:brightness-105 shadow-elevation',
    secondary:
      'bg-surface-2 text-text border border-border-strong hover:bg-surface shadow-elevation',
    ghost:
      'bg-transparent text-text hover:underline focus-visible:underline active:opacity-80',
    subtle:
      'bg-transparent text-text hover:underline focus-visible:underline active:opacity-80',
    danger:
      'bg-surface-2 text-tier-not-supported border border-tier-not-supported hover:bg-surface',
  };

  const selectedVariant = variants[variant] || variants.secondary;

  return (
    <button
      className={clsx(base, selectedVariant, fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  );
};
