'use client';

import React, { useEffect } from 'react';
import * as m from 'motion/react-m';
import { useMotionAllowed, easings, setCalm } from '@/lib/motion';

let isFirstRender = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const motionOk = useMotionAllowed();

  useEffect(() => {
    isFirstRender = false;
    setCalm(false);
    return () => {
      setCalm(false);
    };
  }, []);

  const shouldAnimate = motionOk && !isFirstRender;

  return (
    <m.div
      initial={shouldAnimate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: easings.out }}
      className="w-full min-w-0"
    >
      {children}
    </m.div>
  );
}
