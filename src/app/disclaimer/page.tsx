import React from 'react';
import { Card } from '@/components/ui/Card';

export default function DisclaimerPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-content-primary">
          Disclaimer & Ethical Standards
        </h1>
        <p className="text-xs text-content-secondary">
          Important disclosures regarding medical classification and scientific boundaries.
        </p>
      </div>

      <Card as="section" className="space-y-3 border-l-4 border-l-teal-accent">
        <h2 className="text-sm font-semibold text-content-primary">
          Not a Medical Device
        </h2>
        <div className="space-y-2 text-xs text-content-secondary">
          <p>
            <strong>1. No Medical Advice:</strong> FocusLab and its creators do not provide medical, psychiatric, psychological, or clinical health advice. The materials, protocols, and self-checks presented in this application are for informational, educational, and self-directed behavioral experimentation only.
          </p>
          <p>
            <strong>2. No Diagnostic or ADHD Screening:</strong> FocusLab is strictly not an ADHD screening tool, diagnostic instrument, or clinical assessment. Nothing in this application should be interpreted as diagnosing, treating, curing, or preventing Attention Deficit Hyperactivity Disorder (ADHD) or any other cognitive, neurological, or mental health condition.
          </p>
          <p>
            <strong>3. Seek Professional Guidance:</strong> If you suspect you may have ADHD, depression, anxiety, or any medical or psychological condition, please seek prompt evaluation and care from a qualified healthcare professional.
          </p>
        </div>
      </Card>

      <Card as="section" className="space-y-3">
        <h2 className="text-sm font-semibold text-content-primary">
          Evidence Boundaries
        </h2>
        <p className="text-xs text-content-secondary">
          Interventions labeled as &ldquo;strong&rdquo; or &ldquo;moderate&rdquo; evidence reflect empirical trends in peer-reviewed cohorts. Individual biological and environmental variance means results differ from person to person. That is why FocusLab operates on the &ldquo;Check &rarr; Practice &rarr; Compare&rdquo; model to assist you in observing what works for you individually.
        </p>
      </Card>
    </div>
  );
}
