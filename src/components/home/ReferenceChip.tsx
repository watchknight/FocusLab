'use client';

import React from 'react';
import type { Reference } from '@/content/types';

export const ReferenceChip: React.FC<{ refItem: Reference; interactive?: boolean }> = ({
  refItem,
  interactive = true,
}) => {
  const label = refItem.label || refItem.id;

  if (interactive && refItem.link) {
    return (
      <a
        href={refItem.link}
        target="_blank"
        rel="noopener noreferrer"
        title={refItem.citation}
        className="px-3.5 py-2 rounded-full border border-border bg-surface hover:bg-surface-2 text-xs font-mono text-muted hover:text-text transition-colors min-h-[44px] inline-flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-ring"
      >
        {label}
      </a>
    );
  }

  return (
    <span
      title={refItem.citation}
      className="px-3.5 py-2 rounded-full border border-border bg-surface text-xs font-mono text-muted inline-flex items-center shrink-0 select-none min-h-[44px]"
    >
      {label}
    </span>
  );
};
