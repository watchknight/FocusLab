'use client';

import React, { forwardRef, useRef } from 'react';
import clsx from 'clsx';
import { useMagnetic } from '@/lib/motion-hooks';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'secondary-glass' | 'ghost' | 'subtle' | 'danger';
  fullWidth?: boolean;
  magnetic?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'secondary',
    fullWidth = false,
    magnetic = false,
    className,
    ...props
  },
  ref
) {
  const innerRef = useRef<HTMLButtonElement | null>(null);

  // Magnetic button only in fx full when requested (e.g. primary CTAs)
  useMagnetic(innerRef, magnetic ? 0.3 : 0);

  const setRefs = (node: HTMLButtonElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    }
  };

  const base =
    'h-[52px] min-h-[44px] px-7 text-sm font-semibold rounded-full transition-colors duration-150 inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] motion-reduce:active:scale-100';

  const variants: Record<string, string> = {
    primary:
      'bg-primary-bg text-primary-text border border-transparent relative overflow-hidden group hover:opacity-95 before:content-[""] before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-600 before:ease-in-out before:[background-image:var(--coating-sheen)] before:pointer-events-none',
    secondary:
      'bg-[var(--glass)] backdrop-blur-[18px] text-text border border-border hover:bg-surface',
    'secondary-glass':
      'bg-[var(--glass)] backdrop-blur-[18px] text-text border border-border hover:bg-surface',
    ghost:
      'bg-transparent text-text relative after:content-[""] after:absolute after:bottom-3 after:left-7 after:right-7 after:h-[1px] after:bg-text after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200',
    subtle:
      'bg-transparent text-text relative after:content-[""] after:absolute after:bottom-3 after:left-7 after:right-7 after:h-[1px] after:bg-text after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200',
    danger:
      'bg-surface-2 text-tier-not-supported border border-tier-not-supported hover:bg-surface',
  };

  const selectedVariant = variants[variant] || variants.secondary;

  return (
    <button
      ref={setRefs}
      className={clsx(base, selectedVariant, fullWidth && 'w-full', className)}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
});

export default Button;
