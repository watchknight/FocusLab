'use client';

import React, { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { REFERENCES, CLAIMS } from '@/content/evidence';
import { Reference } from '@/content/types';
import { useGSAP, ScrollTrigger } from '@/lib/gsap';
import { scrambleTo } from '@/lib/motion-hooks';

const ReferenceChip: React.FC<{ refItem: Reference; interactive?: boolean }> = ({
  refItem,
  interactive = true,
}) => {
  const label = refItem.label || refItem.id;

  if (interactive && refItem.link) {
    return (
      <a
        href={refItem.link}
        target="_blank"
        rel="noopener noreferrer"
        title={refItem.citation}
        className="px-3.5 py-2 rounded-full border border-border bg-surface hover:bg-surface-2 text-xs font-mono text-muted hover:text-text transition-colors min-h-[44px] inline-flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-ring"
      >
        {label}
      </a>
    );
  }

  return (
    <span
      title={refItem.citation}
      className="px-3.5 py-2 rounded-full border border-border bg-surface text-xs font-mono text-muted inline-flex items-center shrink-0 select-none min-h-[44px]"
    >
      {label}
    </span>
  );
};

export const TransparencySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const studiesRef = useRef<HTMLSpanElement | null>(null);
  const claimsRef = useRef<HTMLSpanElement | null>(null);
  const mixedRef = useRef<HTMLSpanElement | null>(null);

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

          {/* Marquee in fx full & lite */}
          <div className="block [[data-fx=off]_&]:hidden w-full overflow-hidden py-2 select-none [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="flex w-max animate-marquee-loop hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
              <div className="flex items-center gap-3 pr-3">
                {REFERENCES.map((ref) => (
                  <ReferenceChip key={`a-${ref.id}`} refItem={ref} />
                ))}
              </div>
              <div aria-hidden="true" className="flex items-center gap-3 pr-3">
                {REFERENCES.map((ref) => (
                  <ReferenceChip key={`b-${ref.id}`} refItem={ref} interactive={false} />
                ))}
              </div>
            </div>
          </div>

          {/* Static wrapped list in fx off */}
          <div className="hidden [[data-fx=off]_&]:flex flex-wrap gap-2.5 max-w-4xl py-2">
            {REFERENCES.map((ref) => (
              <ReferenceChip key={`off-${ref.id}`} refItem={ref} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TransparencySection;
