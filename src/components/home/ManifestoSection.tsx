'use client';

import React, { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { useFocusScrub } from '@/lib/motion/use-focus-scrub';

export const ManifestoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useFocusScrub(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-label="Manifesto"
      className="w-full bg-[var(--bg-deep)] border-y border-border py-[clamp(88px,12vw,192px)]"
    >
      <Container className="max-w-[1320px]">
        <h2
          data-split="scrub"
          className="font-display font-extrabold text-[clamp(2.25rem,1rem+4.4vw,5rem)] leading-[1.02] tracking-[-0.02em] text-left text-text max-w-[66ch]"
        >
          Distraction is loud. Focus is hard to see. So we measure it: three minutes, one reaction test, and an honest comparison against rest.
        </h2>
      </Container>
    </section>
  );
};

export default ManifestoSection;
