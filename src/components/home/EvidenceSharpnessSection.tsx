'use client';

import React, { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Plate } from '@/components/ui/Plate';
import { EvidenceMeter, EvidenceTier } from '@/components/ui/EvidenceMeter';
import { EVIDENCE_TIERS, getClaimById } from '@/content/evidence';
import { gsap, useGSAP, getFx } from '@/lib/gsap';

export const EvidenceSharpnessSection: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<EvidenceTier>('strong');
  const [isFading, setIsFading] = useState<boolean>(false);
  const [displayedTier, setDisplayedTier] = useState<EvidenceTier>('strong');

  const sectionRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  // Five meters rack-focus in sequence on entry
  useGSAP(
    () => {
      const fx = getFx();
      if (fx === 'off' || !sectionRef.current) return;

      const meterIcons = sectionRef.current.querySelectorAll('.evidence-rack-target');
      if (!meterIcons.length) return;

      const vars: gsap.TweenVars = {
        opacity: fx === 'full' ? 0.2 : 0.35,
        duration: fx === 'full' ? 0.8 : 0.5,
        stagger: 0.12,
        ease: 'focus',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      };

      if (fx === 'full') {
        vars.filter = 'blur(10px)';
      }

      gsap.from(meterIcons, vars);
    },
    { scope: sectionRef }
  );

  const handleSelectTier = useCallback((tier: EvidenceTier) => {
    if (tier === selectedTier) return;
    setSelectedTier(tier);
    setIsFading(true);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setDisplayedTier(tier);
      setIsFading(false);
    }, 120);
  }, [selectedTier]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (index + 1) % EVIDENCE_TIERS.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (index - 1 + EVIDENCE_TIERS.length) % EVIDENCE_TIERS.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = EVIDENCE_TIERS.length - 1;
      }

      if (nextIndex >= 0) {
        const nextTier = EVIDENCE_TIERS[nextIndex].tier;
        handleSelectTier(nextTier);
        tabRefs.current[nextIndex]?.focus();
      }
    },
    [handleSelectTier]
  );

  const activeItem = EVIDENCE_TIERS.find((t) => t.tier === displayedTier) || EVIDENCE_TIERS[0];
  const claim = getClaimById(activeItem.claimId);

  return (
    <section
      ref={sectionRef}
      aria-label="How sharp is the evidence"
      className="w-full py-[clamp(64px,8vw,128px)] border-t border-border"
    >
      <Container className="max-w-[1320px] space-y-10 sm:space-y-12">
        {/* Heading from copy deck */}
        <div className="space-y-2 max-w-reading">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-text tracking-tight">
            How sharp is the evidence?
          </h2>
          <p className="text-base sm:text-lg text-muted leading-relaxed">
            Every tip carries a grade. We say what it is proven for, and what it is not.
          </p>
        </div>

        {/* Five EvidenceMeters at 96px in a row / column on mobile */}
        <div
          role="tablist"
          aria-label="Evidence tiers"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          {EVIDENCE_TIERS.map((item, idx) => {
            const isSelected = selectedTier === item.tier;
            return (
              <button
                key={item.tier}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                role="tab"
                id={`tab-${item.tier}`}
                aria-selected={isSelected}
                aria-controls="evidence-claim-tabpanel"
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelectTier(item.tier)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`p-4 sm:p-5 rounded-[16px] border text-left flex flex-col justify-between space-y-3 sm:space-y-4 transition-colors min-h-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-ring ${
                  isSelected
                    ? 'bg-surface-2 border-border-strong shadow-elevation'
                    : 'bg-surface border-border hover:bg-surface-2/60'
                }`}
              >
                <div className="flex flex-col items-center sm:items-start space-y-2.5 sm:space-y-3 w-full">
                  <div className="evidence-rack-target flex items-center justify-center p-1 sm:p-2">
                    <EvidenceMeter
                      tier={item.tier}
                      size={96}
                      showLabel={false}
                    />
                  </div>
                  <div className="space-y-1 text-center sm:text-left w-full">
                    <span className="block font-display font-bold text-base text-text">
                      {item.label}
                    </span>
                    <p className="text-xs text-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* One real claim Plate that crossfades (opacity only) when tier changes */}
        {claim && (
          <div
            role="tabpanel"
            id="evidence-claim-tabpanel"
            aria-labelledby={`tab-${displayedTier}`}
            className={`transition-opacity duration-150 ease-out ${
              isFading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Plate
              tier={claim.tier}
              caption={
                <Link
                  href={`/learn/${claim.id}`}
                  className="text-xs font-semibold text-text underline decoration-border-strong hover:decoration-text min-h-[44px] inline-flex items-center"
                >
                  View scientific references for this claim
                </Link>
              }
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-text">
                    {claim.title}
                  </h3>
                </div>
                <div className="text-sm font-medium text-muted">
                  Evidenced outcome: <span className="text-text font-semibold">{claim.outcome}</span>
                </div>
                <p className="text-base text-text leading-relaxed">
                  {claim.summary}
                </p>
                <p className="text-sm text-muted border-t border-border/70 pt-3 leading-relaxed">
                  <strong className="text-text font-semibold">Caveat:</strong> {claim.caveat}
                </p>
              </div>
            </Plate>
          </div>
        )}
      </Container>
    </section>
  );
};

export default EvidenceSharpnessSection;
