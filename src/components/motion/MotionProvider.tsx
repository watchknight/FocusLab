'use client';

import React, { useEffect } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';
import { loadDomAnimation, initPerformanceAttributes } from '@/lib/motion';
import { CalmProvider } from './CalmProvider';

interface MotionProviderProps {
  children: React.ReactNode;
}

export const MotionProvider: React.FC<MotionProviderProps> = ({ children }) => {
  useEffect(() => {
    initPerformanceAttributes();
  }, []);

  return (
    <LazyMotion features={loadDomAnimation} strict>
      <MotionConfig reducedMotion="user">
        <CalmProvider>{children}</CalmProvider>
      </MotionConfig>
    </LazyMotion>
  );
};
