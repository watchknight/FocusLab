'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/Hero';
import { ManifestoSection } from '@/components/home/ManifestoSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { EvidenceSharpnessSection } from '@/components/home/EvidenceSharpnessSection';
import { TransparencySection } from '@/components/home/TransparencySection';
import { FaqCtaSection } from '@/components/home/FaqCtaSection';
import { ScrollTrigger } from '@/lib/gsap';

const OnboardingModal = dynamic(
  () => import('@/features/onboarding').then((mod) => mod.OnboardingModal),
  { ssr: false }
);

export const HomeContent: React.FC = () => {
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <OnboardingModal />

      {/* S1: Hero & Live reflex demo */}
      <Hero />

      {/* S2: Manifesto (bg-deep band with scrub sharpening) */}
      <ManifestoSection />

      {/* S3: How it works (pinned 3-panel scene on desktop / stacked Plates) */}
      <HowItWorksSection />

      {/* S4: Evidence sharpness (rack-focus meters & tabs pattern) */}
      <EvidenceSharpnessSection />

      {/* S5: Transparency (computed counters & literature marquee) */}
      <TransparencySection />

      {/* S6: FAQ (details grid-template-rows) & Final CTA (opening lens + magnetic button) */}
      <FaqCtaSection />
    </div>
  );
};

export default HomeContent;
