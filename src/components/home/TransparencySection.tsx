'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { REFERENCES, CLAIMS } from '@/content/evidence';
import { useGSAP, ScrollTrigger, getFx } from '@/lib/gsap';
import { scrambleTo } from '@/lib/motion/scramble-to';
import { ReferenceChip } from './ReferenceChip';

export const TransparencySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const studiesRef = useRef<HTMLSpanElement | null>(null);
  const claimsRef = useRef<HTMLSpanElement | null>(null);
  const mixedRef = useRef<HTMLSpanElement | null>(null);
  const [MarqueeComponent, setMarqueeComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (getFx() === 'full') {
      import('./ReferencesMarquee').then((mod) => {
        setMarqueeComponent(() => mod.ReferencesMarquee);
      });
    }
  }, []);

  // Directly computed from content
  const studiesCount = REFERENCES.length;
  const claimsCount = CLAIMS.length;
  const mixedOrWeakerCount = CLAIMS.filter(
    (c) => c.tier === 'mixed' || c.tier === 'emerging' || c.tier === 'not-supported'
  ).length;

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (studiesRef.current) scrambleTo(studiesRef.current, String(studiesCount));
          if (claimsRef.current) scrambleTo(claimsRef.current, String(claimsCount));
          if (mixedRef.current) scrambleTo(mixedRef.current, String(mixedOrWeakerCount));
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Transparency and evidence counts"
      className="w-full py-[clamp(64px,8vw,128px)] border-t border-border bg-surface-2"
    >
      <Container className="max-w-[1320px] space-y-12 sm:space-y-16">
        {/* Three computed counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Studies cited */}
          <div className="space-y-2 border-l-2 border-border pl-6 py-1">
            <div className="font-mono text-5xl sm:text-6xl font-extrabold text-text tabular-nums tracking-tight">
              <span ref={studiesRef}>{studiesCount}</span>
            </div>
            <p className="font-display font-medium text-lg text-muted">
              studies cited
            </p>
          </div>

          {/* Claims graded */}
          <div className="space-y-2 border-l-2 border-border pl-6 py-1">
            <div className="font-mono text-5xl sm:text-6xl font-extrabold text-text tabular-nums tracking-tight">
              <span ref={claimsRef}>{claimsCount}</span>
            </div>
            <p className="font-display font-medium text-lg text-muted">
              claims graded
            </p>
          </div>

          {/* Graded mixed or weaker */}
          <div className="space-y-2 border-l-2 border-border pl-6 py-1">
            <div className="font-mono text-5xl sm:text-6xl font-extrabold text-text tabular-nums tracking-tight">
              <span ref={mixedRef}>{mixedOrWeakerCount}</span>
            </div>
            <p className="font-display font-medium text-lg text-muted">
              graded mixed or weaker. We show those too.
            </p>
          </div>
        </div>

        {/* Marquee of reference labels */}
        <div className="space-y-4 pt-4">
          <div className="text-sm font-medium text-muted">
            Peer-reviewed literature catalog
          </div>

          {/* Marquee in fx full only */}
          {MarqueeComponent ? (
            <MarqueeComponent />
          ) : (
            /* Static wrapped list in fx lite, fx off, and before hydration */
            <div className="flex flex-wrap gap-2.5 max-w-4xl py-2">
              {REFERENCES.map((ref) => (
                <ReferenceChip key={`off-${ref.id}`} refItem={ref} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default TransparencySection;
