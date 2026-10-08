'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { getFx } from '@/lib/gsap';

export function FxFullDecorations() {
  const [Decorations, setDecorations] = useState<{
    AfCursor: ComponentType;
    SmoothScroll: ComponentType;
  } | null>(null);

  useEffect(() => {
    if (getFx() === 'full') {
      Promise.all([
        import('@/components/AfCursor'),
        import('@/components/SmoothScroll'),
      ]).then(([cursorMod, scrollMod]) => {
        setDecorations({
          AfCursor: cursorMod.AfCursor,
          SmoothScroll: scrollMod.SmoothScroll,
        });
      });
    }
  }, []);

  if (!Decorations) return null;
  const { AfCursor, SmoothScroll } = Decorations;
  return (
    <>
      <AfCursor />
      <SmoothScroll />
    </>
  );
}
