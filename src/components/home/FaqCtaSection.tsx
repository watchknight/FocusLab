'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Lens } from '@/components/Lens';
import { gsap, useGSAP, getFx } from '@/lib/gsap';
import { applyAperture } from '@/lib/aperture';

const FAQ_ITEMS = [
  {
    q: 'Is this a medical or ADHD test?',
    a: 'No. FocusLab is an educational self-experimentation tool and does not provide medical advice, diagnosis, or treatment. It helps you informally track your own reaction-time stability across different conditions.',
  },
  {
    q: 'Why measure reaction time instead of focus directly?',
    a: 'Reaction time on simple vigilance tasks (like the brief Psychomotor Vigilance Test) is a validated, sensitive laboratory marker of alertness lapses. It gives you a clean number you can compare against yourself over time.',
  },
  {
    q: 'Are the practices and exercises proven?',
    a: 'Every practice carries a strict evidence grade from peer-reviewed literature. We distinguish interventions supported by randomized controlled trials from those with mixed or emerging support, and always name the specific outcome tested.',
  },
  {
    q: 'Where does my data go?',
    a: 'All data stays entirely in your browser through local storage. There are no accounts, no server databases, and no tracking cookies. You can export JSON or wipe everything at any moment.',
  },
  {
    q: 'Why compare practices against plain rest?',
    a: 'Almost any break can briefly restore subjective energy. FocusLab encourages pairing active protocols against plain quiet rest so you can measure whether an exercise provides a genuine advantage for your attention.',
  },
];

export const FaqCtaSection: React.FC = () => {
  const ctaSectionRef = useRef<HTMLDivElement | null>(null);
  const lensSvgRef = useRef<SVGSVGElement | null>(null);

  // Small lens opens as the section enters (scrubbed tweenAperture / applyAperture)
  useGSAP(
    () => {
      const svg = lensSvgRef.current;
      const section = ctaSectionRef.current;
      if (!svg || !section) return;

      const fx = getFx();
      if (fx === 'off') {
        applyAperture(svg, 0.7);
        return;
      }

      const iris = { open: 0.1 };
      gsap.to(iris, {
        open: 0.82,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'bottom 60%',
          scrub: true,
        },
        onUpdate: () => {
          applyAperture(svg, iris.open);
        },
      });
    },
    { scope: ctaSectionRef }
  );

  return (
    <section aria-label="Frequently asked questions and get started" className="w-full py-[clamp(64px,8vw,128px)] border-t border-border">
      <Container className="max-w-[1320px] space-y-16 sm:space-y-24">
        {/* 1. FAQ as <details> with CSS grid-template-rows transition */}
        <div className="space-y-8 max-w-[800px] mx-auto">
          <div className="space-y-2 text-center">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-text tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-base text-muted">
              Clear answers on methodology, privacy, and scientific standards.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <details
                key={idx}
                className="group rounded-[16px] border border-border bg-surface p-5 sm:p-6 transition-colors"
              >
                <summary className="cursor-pointer font-display font-semibold text-text flex items-center justify-between min-h-[44px] select-none list-none focus-visible:outline-2 focus-visible:outline-ring rounded-xs">
                  <span className="text-base sm:text-lg pr-4">{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="text-muted shrink-0 text-xl font-mono transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="pt-3.5 text-sm sm:text-base text-muted leading-relaxed max-w-[66ch]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* 2. Final CTA band with small lens opening behind and magnetic button */}
        <div
          ref={ctaSectionRef}
          className="relative rounded-[24px] border border-border bg-surface overflow-hidden p-8 sm:p-14 md:p-20 text-center flex flex-col items-center justify-center space-y-6 shadow-elevation"
        >
          {/* Small lens behind that opens as the section enters */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 sm:opacity-25"
          >
            <div className="w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96">
              <Lens ref={lensSvgRef} open={0.1} className="w-full h-full" />
            </div>
          </div>

          {/* Foreground content */}
          <div className="relative z-10 space-y-3 max-w-reading">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-text tracking-tight">
              Find out what helps you focus.
            </h2>
            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Take the 3-minute reaction test, test graded practices, and see what actually beats plain rest for you.
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <Link href="/check" className="focus-visible:outline-none">
              <Button
                variant="primary"
                magnetic
                className="h-[52px] px-8 text-base font-semibold"
              >
                Start the 3-minute Check
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FaqCtaSection;
