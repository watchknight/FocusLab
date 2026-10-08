'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Plate } from '@/components/ui/Plate';
import { getFx } from '@/lib/gsap';
import {
  CheckDeviceMock,
  PracticeDeviceMock,
  CompareDeviceMock,
} from './DeviceMocks';

interface StepData {
  num: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  tier: 'moderate' | 'emerging';
  caption: string;
  mock: React.ReactNode;
}

const STEPS: StepData[] = [
  {
    num: '01',
    title: 'Check',
    desc: 'Three minutes, one tap at a time. You get a baseline that belongs to you.',
    cta: 'Start the 3-minute Check',
    href: '/check',
    tier: 'moderate',
    caption: 'Brief reaction-time test (PVT-B)',
    mock: <CheckDeviceMock />,
  },
  {
    num: '02',
    title: 'Practice',
    desc: 'Short, graded exercises: breathing, breath counting, a nature break, a walk.',
    cta: 'Explore focus practices',
    href: '/activities',
    tier: 'moderate',
    caption: 'Evidence-graded protocols',
    mock: <PracticeDeviceMock />,
  },
  {
    num: '03',
    title: 'Compare',
    desc: 'Run the Check after a practice and after plain rest. See which one actually helps you.',
    cta: 'Test what works for you',
    href: '/experiments',
    tier: 'emerging',
    caption: 'Self-experimentation protocol',
    mock: <CompareDeviceMock />,
  },
];

export const HowItWorksSection: React.FC = () => {
  const [PinnedSceneComponent, setPinnedSceneComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (
      getFx() === 'full' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1024px)').matches
    ) {
      import('./PinnedScene').then((mod) => {
        setPinnedSceneComponent(() => mod.PinnedScene);
      });
    }
  }, []);

  return (
    <section aria-label="How it works" className="w-full relative py-[clamp(64px,8vw,128px)]">
      {/* ── DESKTOP PINNED SCENE (runs only at 1024px+ and fx full) ── */}
      {PinnedSceneComponent ? <PinnedSceneComponent /> : null}

      {/* ── STACKED PLATES (under 1024px or fx lite/off) ── */}
      <div className="how-it-works-stacked w-full">
        <Container className="max-w-[1320px] space-y-8">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text">
              Check, practice, compare.
            </h2>
          </div>

          <div className="space-y-6">
            {STEPS.map((step) => (
              <Plate
                key={step.num}
                tier={step.tier}
                caption={step.caption}
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-muted/60 tabular-nums">
                      {step.num}
                    </span>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-text">
                      {step.title}
                    </h3>
                    <p className="text-base text-muted leading-relaxed">
                      {step.desc}
                    </p>
                    <div className="pt-1">
                      <Link
                        href={step.href}
                        className="inline-flex items-center min-h-[44px] text-sm font-semibold text-text underline decoration-border-strong hover:decoration-text underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring rounded-xs"
                      >
                        {step.cta}
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    {step.mock}
                  </div>
                </div>
              </Plate>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
};

export default HowItWorksSection;
