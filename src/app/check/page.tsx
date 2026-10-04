'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckForm } from '@/features/check/CheckForm';

export default function CheckPage() {
  const router = useRouter();

  const handleSaved = () => {
    router.push('/practice');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-content-primary">
          Attentional State Check
        </h1>
        <p className="text-xs text-content-secondary">
          Track baseline state parameters. After recording, proceed to select an activity.
        </p>
      </div>

      <CheckForm onSaved={handleSaved} />
    </div>
  );
}
