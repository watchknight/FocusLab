'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { setCalmMode, subscribeCalm, getCalmState } from '@/lib/motion';

interface CalmContextType {
  calm: boolean;
  setCalm: (action: boolean | ((prev: boolean) => boolean)) => void;
}

const CalmContext = createContext<CalmContextType>({
  calm: false,
  setCalm: () => {},
});

export const CalmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calm, setCalmState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return getCalmState();
  });

  useEffect(() => {
    setCalmState(getCalmState());
    return subscribeCalm((val) => setCalmState(val));
  }, []);

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
