import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'subtle' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses =
    'min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-150 inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-teal-accent focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-teal-accent text-white hover:bg-teal-accent-hover shadow-sm',
    secondary:
      'bg-surface-secondary text-content-primary border border-surface-border hover:bg-surface-tertiary',
    subtle:
      'bg-transparent text-content-secondary hover:bg-surface-secondary hover:text-content-primary',
    danger:
      'bg-surface-secondary text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30',
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
