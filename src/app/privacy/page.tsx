import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { DataManagement } from '@/features/insights/DataManagement';

export const metadata: Metadata = {
  title: 'Privacy Policy | FocusLab',
  description:
    'FocusLab is completely local-first: no accounts, no telemetry, no cookies. All data stays in your browser.',
};

export default function PrivacyPage() {
  return (
    <div className="space-y-6 py-2">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text">Privacy Policy</h1>
        <p className="text-sm text-muted">
          Your cognitive data belongs solely to you. FocusLab is architected to keep it that way.
        </p>
      </div>

      <Card className="p-4 space-y-3 bg-surface border-border">
        <h2 className="text-base font-bold text-text">1. Zero Accounts, Zero Remote Servers</h2>
        <p className="text-xs text-text leading-relaxed">
          FocusLab requires no login, email address, password, or profile. There is no remote backend database storing user entries. Every reaction-time score, focus session, reflection note, and experiment trial is written directly into your device&apos;s browser <code className="text-accent bg-surface-2 px-1 py-0.5 rounded font-mono">localStorage</code>.
        </p>
      </Card>

      <Card className="p-4 space-y-3 bg-surface border-border">
        <h2 className="text-base font-bold text-text">2. No Tracking, Analytics, or Advertising</h2>
        <p className="text-xs text-text leading-relaxed">
          We do not embed Google Analytics, Mixpanel, Meta Pixel, tracking pixels, or advertisement SDKs. We do not use third-party CDN scripts or font trackers. When you use FocusLab, your browser communicates only with the static host delivering the app assets.
        </p>
      </Card>

      <Card className="p-4 space-y-3 bg-surface border-border">
        <h2 className="text-base font-bold text-text">3. Full Data Portability & Eradication</h2>
        <p className="text-xs text-text leading-relaxed">
          Because data is stored locally, you maintain total custody over your records. You can export your full history as a validated JSON file at any time, import it on another device, or wipe all records permanently with a single click.
        </p>
      </Card>

      {/* Embedded Data Management Controls */}
      <div className="space-y-2 pt-2">
        <h2 className="text-base font-bold text-text">Manage Your Local Data</h2>
        <DataManagement />
      </div>

      <div className="pt-2 flex flex-wrap gap-4 text-xs text-muted border-t border-border">
        <Link href="/about" className="hover:text-text underline min-h-[32px] inline-flex items-center">
          About FocusLab
        </Link>
        <Link href="/disclaimer" className="hover:text-text underline min-h-[32px] inline-flex items-center">
          Medical Disclaimer
        </Link>
        <Link href="/insights" className="hover:text-text underline min-h-[32px] inline-flex items-center">
          View Trends & Insights
        </Link>
      </div>
    </div>
  );
}
