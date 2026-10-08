'use client';

import React from 'react';
import { REFERENCES } from '@/content/evidence';
import { ReferenceChip } from './ReferenceChip';

export const ReferencesMarquee: React.FC = () => {
  return (
    <div className="w-full overflow-hidden py-2 select-none [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
      <div className="flex w-max animate-marquee-loop hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        <div className="flex items-center gap-3 pr-3">
          {REFERENCES.map((ref) => (
            <ReferenceChip key={`a-${ref.id}`} refItem={ref} />
          ))}
        </div>
        <div aria-hidden="true" className="flex items-center gap-3 pr-3">
          {REFERENCES.map((ref) => (
            <ReferenceChip key={`b-${ref.id}`} refItem={ref} interactive={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferencesMarquee;
