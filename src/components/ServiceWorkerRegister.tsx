'use client';

import React, { useState, useEffect } from 'react';
import { Toast } from '@/components/ui/Toast';
import { useCalm } from '@/lib/motion';

export const ServiceWorkerRegister: React.FC = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const { calm } = useCalm();

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' &&
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      const handleLoad = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            // Check if there is already a waiting worker from a previous visit
            if (reg.waiting) {
              setWaitingWorker(reg.waiting);
            }

            // Listen for newly installed worker waiting for activation
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (!newWorker) return;

              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  setWaitingWorker(newWorker);
                }
              });
            });
          })
          .catch((err) => {
            console.error('Service worker registration failed:', err);
          });
      };

      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    } else if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      (process.env.NODE_ENV === 'development' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')
    ) {
      // In local dev/testing, ensure any stale SW registered previously on localhost is cleaned up
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
    }
  }, []);

  const handleReload = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    // Explicit manual reload requested by user action only
    window.location.reload();
  };

  const showToast = Boolean(waitingWorker) && !calm && !dismissed;

  if (!showToast) {
    return null;
  }

  return (
    <Toast
      open={showToast}
      onClose={() => setDismissed(true)}
      type="info"
      aria-label="Application update ready"
    >
      <div className="flex items-center gap-2 text-sm text-text">
        <span>New version ready.</span>
        <button
          type="button"
          onClick={handleReload}
          className="font-bold underline text-link hover:text-text min-h-[44px] px-2 py-1 inline-flex items-center focus-visible:outline-2 focus-visible:outline-ring"
        >
          Reload
        </button>
      </div>
    </Toast>
  );
};

export default ServiceWorkerRegister;
