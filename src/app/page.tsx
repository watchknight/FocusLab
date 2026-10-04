import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-content-primary">
          FocusLab
        </h1>
        <p className="text-sm text-content-secondary max-w-prose">
          A free, local-first workbench to measure attentional states, practice
          evidence-labelled cognitive protocols, and test what interventions work
          for your personal baseline.
        </p>
        <p className="text-xs text-content-muted">
          No accounts. No backend server. Zero telemetry. All data stays in your browser.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card as="article" className="space-y-2">
          <span className="text-xs font-mono font-semibold text-teal-accent">
            Step 1
          </span>
          <h2 className="text-sm font-semibold text-content-primary">Check</h2>
          <p className="text-xs text-content-secondary">
            Log your current alertness, distraction urges, and affective mood before beginning.
          </p>
          <Link
            href="/check"
            className="inline-block pt-1 text-xs font-semibold text-teal-accent hover:underline"
          >
            Start Check &rarr;
          </Link>
        </Card>

        <Card as="article" className="space-y-2">
          <span className="text-xs font-mono font-semibold text-teal-accent">
            Step 2
          </span>
          <h2 className="text-sm font-semibold text-content-primary">Practice</h2>
          <p className="text-xs text-content-secondary">
            Engage in structured respiration, visual anchor pacing, or implementation planning.
          </p>
          <Link
            href="/practice"
            className="inline-block pt-1 text-xs font-semibold text-teal-accent hover:underline"
          >
            Browse Activities &rarr;
          </Link>
        </Card>

        <Card as="article" className="space-y-2">
          <span className="text-xs font-mono font-semibold text-teal-accent">
            Step 3
          </span>
          <h2 className="text-sm font-semibold text-content-primary">Compare</h2>
          <p className="text-xs text-content-secondary">
            Inspect pre-to-post changes across sessions to determine what works for you.
          </p>
          <Link
            href="/compare"
            className="inline-block pt-1 text-xs font-semibold text-teal-accent hover:underline"
          >
            View Trends &rarr;
          </Link>
        </Card>
      </div>

      <Card as="section" className="space-y-2 border-l-4 border-l-teal-accent">
        <h2 className="text-xs font-semibold text-content-primary">
          Our Scientific Standard
        </h2>
        <p className="text-xs text-content-secondary">
          Every health or cognition claim shown to users comes from peer-reviewed literature cataloged in our Evidence Registry. We state the exact measured outcome (e.g. autonomic arousal, sustained attention, goal follow-through) and never make vague claims.
        </p>
        <div className="flex gap-4 pt-1 text-xs">
          <Link href="/learn" className="text-teal-accent hover:underline font-semibold">
            Explore Evidence & Myths
          </Link>
          <Link href="/environment" className="text-teal-accent hover:underline font-semibold">
            Environment Setup
          </Link>
        </div>
      </Card>
    </div>
  );
}
