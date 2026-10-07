import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DataManagement } from '@/features/insights/DataManagement';

export const metadata: Metadata = {
  title: 'Privacy Policy | FocusLab',
  description:
    'FocusLab is completely local-first: no accounts, no telemetry, no cookies. All data stays in your browser.',
  openGraph: {
    title: 'Privacy Policy | FocusLab',
    description:
      'FocusLab is completely local-first: no accounts, no telemetry, no cookies. All data stays in your browser.',
  },
};

export default function PrivacyPage() {
  return (
    <div className="space-y-6 py-2 max-w-[720px] mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text">Privacy Policy</h1>
        <p className="text-base text-muted">
          Your cognitive data belongs solely to you. FocusLab is architected to keep it that way.
        </p>
      </div>

      <div className="border-t border-border divide-y divide-border">
        <section className="py-6 space-y-3">
          <h2 className="text-lg font-bold text-text">Zero accounts, zero remote servers</h2>
          <p className="text-base text-text leading-relaxed">
            FocusLab requires no login, email address, password, or profile. There is no remote backend database storing user entries. Every reaction-time score, focus session, reflection note, and experiment trial is written directly into your device&apos;s browser <code className="text-accent bg-surface-2 px-1.5 py-0.5 rounded font-mono text-sm">localStorage</code>.
          </p>
        </section>

        <section className="py-6 space-y-3">
          <h2 className="text-lg font-bold text-text">No tracking, analytics, or advertising</h2>
          <p className="text-base text-text leading-relaxed">
            We do not embed Google Analytics, Mixpanel, Meta Pixel, tracking pixels, or advertisement SDKs. We do not use third-party CDN scripts or font trackers. When you use FocusLab, your browser communicates only with the static host delivering the app assets.
          </p>
        </section>

        <section className="py-6 space-y-3">
          <h2 className="text-lg font-bold text-text">Full data portability and eradication</h2>
          <p className="text-base text-text leading-relaxed">
            Because data is stored locally, you maintain total custody over your records. You can export your full history as a validated JSON file at any time, import it on another device, or wipe all records permanently with a single click.
          </p>
        </section>
      </div>

      {/* Embedded Data Management Controls */}
      <div className="space-y-2 pt-2">
        <h2 className="text-lg font-bold text-text">Manage Your Local Data</h2>
        <DataManagement />
      </div>

      <div className="pt-2 flex flex-wrap gap-4 text-sm text-muted border-t border-border">
        <Link href="/about" className="hover:text-text underline min-h-[44px] inline-flex items-center">
          About FocusLab
        </Link>
        <Link href="/disclaimer" className="hover:text-text underline min-h-[44px] inline-flex items-center">
          Medical Disclaimer
        </Link>
        <Link href="/insights" className="hover:text-text underline min-h-[44px] inline-flex items-center">
          View Trends & Insights
        </Link>
      </div>
    </div>
  );
}
