'use client';

import React, { useEffect } from 'react';
import { initPerformanceAttributes } from '@/lib/motion';
import { CalmProvider } from './CalmProvider';

interface MotionProviderProps {
  children: React.ReactNode;
}

export const MotionProvider: React.FC<MotionProviderProps> = ({ children }) => {
  useEffect(() => {
    initPerformanceAttributes();
  }, []);

  return <CalmProvider>{children}</CalmProvider>;
};
