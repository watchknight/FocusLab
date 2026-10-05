'use client';

import React from 'react';
import { FocusCheckRunner } from '@/features/check';

export default function CheckPage() {
  return (
    <div className="py-2">
      <FocusCheckRunner onComplete={() => {}} />
    </div>
  );
}
