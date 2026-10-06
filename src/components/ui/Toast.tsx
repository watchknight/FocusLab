'use client';

import React from 'react';
import * as m from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { popVariants, slideVariants } from '@/lib/motion';

export interface ToastProps {
  id?: string;
  open: boolean;
  onClose?: () => void;
  variant?: 'pop' | 'slide';
  type?: 'info' | 'success' | 'warn';
  children: React.ReactNode;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  open,
  onClose,
  variant = 'slide',
  type = 'info',
  children,
  className,
}) => {
  const chosenVariants = variant === 'pop' ? popVariants : slideVariants;

  return (
    <AnimatePresence>
      {open && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 lg:bottom-6 right-4 z-50 pointer-events-none"
        >
          <m.div
            variants={chosenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={clsx(
              'pointer-events-auto min-h-[44px] px-4 py-3 rounded-md border text-sm font-semibold shadow-elevation flex items-center justify-between gap-3 max-w-sm',
              type === 'info' && 'bg-surface-2 text-text border-border',
              type === 'success' && 'bg-surface text-tier-strong border-tier-strong/40',
              type === 'warn' && 'bg-surface text-tier-not-supported border-tier-not-supported/40',
              className
            )}
          >
            <div className="flex-1">{children}</div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-muted hover:text-text min-h-[44px] min-w-[44px] -mr-2 inline-flex items-center justify-center font-bold text-xs rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};
