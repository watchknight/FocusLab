'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExperimentCreate, ExperimentDetail } from '@/features/experiments';
import { useFocusLabStore } from '@/store';

export function ExperimentsClient() {
  const searchParams = useSearchParams();
  const prefillActivity = searchParams.get('activity') || undefined;

  const experiments = useFocusLabStore((state) => state.experiments);
  const [activeExperimentId, setActiveExperimentId] = useState<string | null>(null);

  const selectedExperiment = activeExperimentId
    ? experiments.find((e) => e.id === activeExperimentId)
    : null;

  return (
    <div className="py-2">
      {selectedExperiment ? (
        <ExperimentDetail
          experiment={selectedExperiment}
          onBack={() => setActiveExperimentId(null)}
        />
      ) : (
        <ExperimentCreate
          initialActivityId={prefillActivity}
          onSelectExperiment={(id) => setActiveExperimentId(id)}
        />
      )}
    </div>
  );
}
