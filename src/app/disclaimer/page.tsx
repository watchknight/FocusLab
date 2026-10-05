import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Medical Disclaimer | FocusLab',
  description:
    'FocusLab is an educational self-experimentation tool, not a medical device or ADHD screening instrument.',
  openGraph: {
    title: 'Medical Disclaimer | FocusLab',
    description:
      'FocusLab is an educational self-experimentation tool, not a medical device or ADHD screening instrument.',
  },
};

export default function DisclaimerPage() {
  return (
    <div className="space-y-6 py-2">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Medical Disclaimer
        </h1>
        <p className="text-sm text-muted">
          Important notice regarding the scope, limitations, and purpose of FocusLab.
        </p>
      </div>

      <Card className="p-4 space-y-3 bg-surface border-border">
        <h2 className="text-base font-bold text-text">Not a Medical or Diagnostic Device</h2>
        <p className="text-xs text-text leading-relaxed">
          FocusLab is designed exclusively as an educational, informal self-tracking project. It is <strong>not</strong> a medical device, is not approved by regulatory medical agencies (such as the FDA or EMA), and does not provide diagnostic services, psychological screening, or clinical advice.
        </p>
        <p className="text-xs text-text leading-relaxed">
          Neither the Focus Check (PVT-B reaction-time test) nor any self-ratings, questionnaires, or experiment reports constitute an assessment or diagnosis for Attention-Deficit/Hyperactivity Disorder (ADHD), narcolepsy, sleep apnea, clinical depression, anxiety disorders, or any other medical or neurological condition.
        </p>
      </Card>

      <Card className="p-4 space-y-3 bg-surface border-border">
        <h2 className="text-base font-bold text-text">Seek Licensed Professional Care</h2>
        <p className="text-xs text-text leading-relaxed">
          If you are experiencing persistent difficulties with attention, chronic exhaustion, brain fog, executive dysfunction, or emotional distress that impairs your work, education, or personal life, please consult a licensed medical doctor, psychiatrist, or clinical psychologist.
        </p>
        <p className="text-xs text-text leading-relaxed">
          Self-experimentation tools should never be used as a replacement for evidence-based clinical treatment, psychotherapy, or prescribed pharmacotherapy.
        </p>
      </Card>

      <Card className="p-4 space-y-3 bg-surface-2 border-border">
        <h2 className="text-base font-bold text-text">Measurement Limitations</h2>
        <p className="text-xs text-muted leading-relaxed">
          Consumer computer monitors, mobile phone touchscreens, and web browser rendering engines introduce uncontrolled hardware latency (typically 10–50 ms of jitter). While reaction-time tasks in FocusLab use high-precision browser timestamps (<code className="text-accent font-mono text-[11px]">performance.now()</code> and frame painting callbacks), measurements are intended solely for relative self-comparison on the same physical device, not standardized clinical benchmarking.
        </p>
      </Card>

      <div className="pt-2 flex flex-wrap gap-4 text-xs text-muted border-t border-border">
        <Link href="/about" className="hover:text-text underline min-h-[32px] inline-flex items-center">
          About FocusLab
        </Link>
        <Link href="/privacy" className="hover:text-text underline min-h-[32px] inline-flex items-center">
          Privacy Policy
        </Link>
        <Link href="/learn" className="hover:text-text underline min-h-[32px] inline-flex items-center">
          Evidence Bank
        </Link>
      </div>
    </div>
  );
}
