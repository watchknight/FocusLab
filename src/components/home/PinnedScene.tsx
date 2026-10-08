'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { usePinnedScene } from '@/lib/motion/use-pinned-scene';
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

export const PinnedScene: React.FC = () => {
  const pinnedRootRef = useRef<HTMLDivElement | null>(null);

  usePinnedScene(pinnedRootRef);

  return (
    <div
      ref={pinnedRootRef}
      className="how-it-works-pinned w-full h-[100dvh] relative overflow-hidden bg-bg"
    >
      <Container className="h-full max-w-[1320px] flex items-center justify-between gap-8 sm:gap-12 relative">
        {/* Three-tick progress rail */}
        <div
          aria-hidden="true"
          className="absolute left-6 xl:left-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none"
        >
          <div className="w-[2px] h-48 bg-border relative overflow-hidden rounded-full">
            <div
              data-rail-fill
              className="w-full h-full bg-text origin-top scale-y-0"
            />
          </div>
          <div className="flex flex-col justify-between h-48 absolute inset-0 py-1 items-center">
            {STEPS.map((step, idx) => (
              <div
                key={step.num}
                data-tick={idx}
                className="w-3.5 h-3.5 rounded-full border border-border bg-surface transition-colors data-[active=true]:bg-primary-bg data-[active=true]:border-primary-bg flex items-center justify-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-transparent data-[active=true]:bg-surface" />
              </div>
            ))}
          </div>
        </div>

        {/* Three absolutely stacked panels for clip-path circle switches */}
        <div className="w-full h-full relative pl-10 xl:pl-16">
          {STEPS.map((step) => (
            <div
              key={step.num}
              data-panel
              className="absolute inset-0 w-full h-full flex items-center justify-between gap-12 bg-bg"
            >
              {/* Left column: display numeral, title, copy, text link */}
              <div className="w-full max-w-lg space-y-6 z-10">
                <span className="block font-display font-extrabold text-5xl sm:text-7xl text-muted/60 tabular-nums select-none">
                  {step.num}
                </span>
                <div className="space-y-3">
                  <h3 className="font-display font-extrabold text-3xl sm:text-5xl text-text tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-lg text-muted leading-relaxed max-w-[44ch]">
                    {step.desc}
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href={step.href}
                    className="inline-flex items-center min-h-[44px] text-base font-semibold text-text underline decoration-border-strong hover:decoration-text underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring rounded-xs"
                  >
                    {step.cta}
                  </Link>
                </div>
              </div>

              {/* Right column: static device-frame mock */}
              <div className="w-full max-w-md flex items-center justify-center shrink-0 pr-4">
                {step.mock}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default PinnedScene;
