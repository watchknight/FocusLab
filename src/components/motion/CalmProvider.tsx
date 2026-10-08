'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { setCalmMode, subscribeCalm, getCalmState } from '@/lib/motion';
import { gsap } from '@/lib/gsap';
import { isCalmRoute } from '@/components/IrisTransition';

interface CalmContextType {
  calm: boolean;
  setCalm: (action: boolean | ((prev: boolean) => boolean)) => void;
}

const CalmContext = createContext<CalmContextType>({
  calm: false,
  setCalm: () => {},
});

export const CalmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [calm, setCalmState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return getCalmState();
  });

  useEffect(() => {
    setCalmState(getCalmState());
    return subscribeCalm((val) => setCalmState(val));
  }, []);

  // Ensure calm mode resets on route change if leaving calm routes
  useEffect(() => {
    if (!isCalmRoute(pathname) && getCalmState()) {
      setCalmMode(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && calm) {
      const checkId = setTimeout(() => {
        const activeChildren = gsap.globalTimeline.getChildren();
        const nonInstrument = activeChildren.filter((t) => {
          const vars = t.vars as Record<string, unknown> | undefined;
          return !(vars && 'open' in vars);
        });
        if (nonInstrument.length > 0) {
          console.warn('FocusLab calm route warning: gsap.globalTimeline has children during calm mode:', nonInstrument);
        }
      }, 100);
      return () => clearTimeout(checkId);
    }
  }, [calm]);

  const setCalm = (action: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof action === 'function' ? action(getCalmState()) : action;
    setCalmMode(next);
  };

  return (
    <CalmContext.Provider value={{ calm, setCalm }}>
      {children}
    </CalmContext.Provider>
  );
};

export function useCalm(): CalmContextType {
  return useContext(CalmContext);
}
