import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-surface-border bg-surface-secondary/70 py-6 px-4">
      <div className="max-w-prose mx-auto text-xs text-content-muted space-y-3">
        <p className="font-semibold text-content-secondary">
          FocusLab is an educational and self-directed behavioral experiment tool.
        </p>
        <p>
          <strong>Medical Notice:</strong> FocusLab is not a medical device. It does not provide medical advice, diagnosis, treatment, or ADHD screening. If you have clinical concerns regarding mental health or attention, consult a qualified healthcare provider.
        </p>
        <div className="flex flex-wrap gap-4 pt-2 text-content-secondary">
          <Link href="/about" className="hover:text-teal-accent underline">
            About FocusLab
          </Link>
          <Link href="/disclaimer" className="hover:text-teal-accent underline">
            Disclaimer & Ethics
          </Link>
          <Link href="/privacy" className="hover:text-teal-accent underline">
            Local Data & Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};
