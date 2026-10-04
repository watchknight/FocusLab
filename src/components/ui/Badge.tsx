import React from 'react';
import clsx from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'ok' | 'warn' | 'muted';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const base =
    'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border';

  const variants = {
    default: 'bg-surface-2 border-border text-text',
    accent: 'bg-surface-2 border-accent text-accent',
    ok: 'bg-surface-2 border-ok text-ok',
    warn: 'bg-surface-2 border-warn text-warn',
    muted: 'bg-surface-2 border-border text-muted',
  };

  return (
    <span className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
