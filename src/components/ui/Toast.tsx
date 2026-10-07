'use client';

import React, { useRef } from 'react';
import clsx from 'clsx';
import { durations, easings, useGsapPresence } from '@/lib/motion';
import { gsap, useGSAP } from '@/lib/gsap';

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);

  const { isRendered, onExitComplete } = useGsapPresence(open);

  useGSAP(
    () => {
      if (!isRendered || !toastRef.current) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (open) {
          if (variant === 'pop') {
            gsap.fromTo(
              toastRef.current,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1, duration: durations.quick, ease: easings.out, overwrite: 'auto' }
            );
          } else {
            gsap.fromTo(
              toastRef.current,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: durations.quick, ease: easings.out, overwrite: 'auto' }
            );
          }
        } else {
          if (variant === 'pop') {
            gsap.to(toastRef.current, {
              opacity: 0,
              scale: 0.96,
              duration: 0.14,
              ease: easings.out,
              overwrite: 'auto',
              onComplete: onExitComplete,
            });
          } else {
            gsap.to(toastRef.current, {
              opacity: 0,
              y: 12,
              duration: 0.14,
              ease: easings.out,
              overwrite: 'auto',
              onComplete: onExitComplete,
            });
          }
        }
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (open) {
          gsap.fromTo(
            toastRef.current,
            { opacity: 0 },
            { opacity: 1, duration: durations.instant, ease: easings.out, overwrite: 'auto' }
          );
        } else {
          gsap.to(toastRef.current, {
            opacity: 0,
            duration: durations.instant,
            ease: easings.out,
            overwrite: 'auto',
            onComplete: onExitComplete,
          });
        }
      });
    },
    { scope: containerRef, dependencies: [open, isRendered, variant] }
  );

  if (!isRendered) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      className="fixed bottom-16 lg:bottom-6 right-4 z-50 pointer-events-none"
    >
      <div
        ref={toastRef}
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
      </div>
    </div>
  );
};
