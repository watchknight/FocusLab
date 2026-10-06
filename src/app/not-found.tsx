import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 space-y-4 max-w-md mx-auto">
      <div className="text-4xl font-extrabold font-display text-accent tabular-nums">
        404
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-text">
        Page not found
      </h1>
      <p className="text-sm text-muted leading-relaxed">
        The link you followed may have moved or does not exist. All FocusLab tools work offline and keep data directly in your browser.
      </p>
      <div className="pt-2">
        <Link href="/">
          <Button variant="primary" className="min-h-[44px] px-5 py-2.5">
            Back to laboratory
          </Button>
        </Link>
      </div>
    </div>
  );
}
