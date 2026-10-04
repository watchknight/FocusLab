import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-content-primary">
          About FocusLab
        </h1>
        <p className="text-xs text-content-secondary">
          Principles, scientific integrity, and local-first architecture.
        </p>
      </div>

      <Card as="section" className="space-y-3">
        <h2 className="text-sm font-semibold text-content-primary">
          Core Mission
        </h2>
        <p className="text-xs text-content-secondary">
          FocusLab is built to provide an honest, distraction-free environment for
          exploring personal focus and cognitive regulation. Rather than making
          grandiose claims like &ldquo;boost your brain power&rdquo;, we catalog
          exact, peer-reviewed cognitive mechanisms and encourage users to test
          what reliably moves their needle using a Check &rarr; Practice &rarr;
          Compare cycle.
        </p>
      </Card>

      <Card as="section" className="space-y-3">
        <h2 className="text-sm font-semibold text-content-primary">
          Honesty & Scientific Rigor
        </h2>
        <p className="text-xs text-content-secondary">
          All scientific claims in FocusLab stem strictly from our registered
          peer-reviewed catalog in{' '}
          <Link href="/learn" className="text-teal-accent underline">
            Evidence Registry
          </Link>
          . No claims are generated from intuition or marketing buzzwords. Every
          activity explicitly specifies its target outcome (e.g., autonomic
          arousal, vigilance decrement, or goal follow-through).
        </p>
      </Card>

      <Card as="section" className="space-y-3 border-l-4 border-l-teal-accent">
        <h2 className="text-sm font-semibold text-content-primary">
          Medical Device & Diagnostic Statement
        </h2>
        <p className="text-xs text-content-secondary">
          FocusLab is an educational and self-directed experimentation app. It is{' '}
          <strong>not a medical device</strong>, does not provide medical advice,
          does not offer psychological diagnoses, and is not an ADHD screening
          system. Anyone seeking clinical assessment or treatment should consult
          a licensed medical professional.
        </p>
      </Card>
    </div>
  );
}
