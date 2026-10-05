import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import type { Myth } from '@/content/types';

interface MythCardProps {
  myth: Myth;
}

export const MythCard: React.FC<MythCardProps> = ({ myth }) => {
  const isNotSupported = myth.verdict.toLowerCase().includes('not supported');

  return (
    <Card className="p-4 space-y-3 bg-surface border-border">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border ${
            isNotSupported
              ? 'bg-warn/10 text-warn border-warn/30'
              : 'bg-surface-2 text-text border-border'
          }`}
        >
          <span aria-hidden="true" className="font-mono">
            {isNotSupported ? '✕' : '◐'}
          </span>
          <span>Verdict: {myth.verdict}</span>
        </span>

        {myth.claimId && (
          <Link
            href={`/learn/${myth.claimId}`}
            className="text-xs font-semibold text-accent hover:underline inline-flex items-center min-h-[32px]"
          >
            Read Claim Data →
          </Link>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-xs font-semibold text-muted uppercase tracking-wider">
          Popular Belief
        </div>
        <p className="text-sm font-bold text-text italic">
          &ldquo;{myth.myth}&rdquo;
        </p>
      </div>

      <div className="space-y-1 pt-1 border-t border-border/50">
        <div className="text-xs font-semibold text-muted uppercase tracking-wider">
          What Research Shows
        </div>
        <p className="text-xs text-text leading-relaxed">
          {myth.explanation}
        </p>
      </div>
    </Card>
  );
};
