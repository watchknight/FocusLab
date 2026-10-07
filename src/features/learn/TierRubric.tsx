import React from 'react';
import { EvidenceBadge, EvidenceTier } from '@/components/ui/EvidenceBadge';

interface TierDefinition {
  tier: EvidenceTier;
  title: string;
  definition: string;
  criteria: string;
  example: string;
}

const TIER_DEFINITIONS: TierDefinition[] = [
  {
    tier: 'strong',
    title: 'Strong Evidence',
    definition:
      'Consistent findings across several randomized controlled trials (RCTs) or meta-analyses for the specific named outcome.',
    criteria:
      'High statistical power, replications across independent lab groups, and clear methodology.',
    example: 'Implementation intentions ("if-then" plans), sleep loss effects on vigilance.',
  },
  {
    tier: 'moderate',
    title: 'Moderate Evidence',
    definition:
      'Several controlled studies or meta-analyses showing small-to-moderate effect sizes.',
    criteria:
      'Meaningful empirical support, though effect sizes may be small or tested primarily in specific cohorts.',
    example: 'Short breaks for vigor, acute exercise bouts, cyclic sighing for physiological arousal.',
  },
  {
    tier: 'mixed',
    title: 'Mixed Evidence',
    definition:
      'Conflicting trial results across research teams, or outcomes that strongly depend on individual differences.',
    criteria:
      'Benefits observed in some populations but neutral or counterproductive in others.',
    example: 'Background noise (helpful for attention deficits, distracting for others), Pomodoro fixed ratios.',
  },
  {
    tier: 'emerging',
    title: 'Emerging Evidence',
    definition:
      'Few or small-scale studies, pilot investigations, or self-reported observational surveys.',
    criteria:
      'Promising early observations that lack rigorous preregistered replication or large active controls.',
    example: 'Body doubling / virtual co-working practices.',
  },
  {
    tier: 'not-supported',
    title: 'Not Supported',
    definition:
      'Well-tested interventions where rigorous trials fail to demonstrate the claimed benefit.',
    criteria:
      'Active-control trials show no transfer beyond the specific practice task itself.',
    example: 'Brain-training games claiming to increase general intelligence or everyday focus.',
  },
];

export const TierRubric: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="text-base text-muted leading-relaxed space-y-1">
        <p>
          In FocusLab, scientific claims are rated according to strict, transparent criteria.
          A rating applies <strong>strictly to the named outcome</strong> (e.g. physiological arousal,
          reaction time, or goal attainment), not to vague performance promises.
        </p>
      </div>

      <div className="border-y border-border divide-y divide-border">
        {TIER_DEFINITIONS.map((item) => (
          <div key={item.tier} className="py-5 space-y-2">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3 className="text-base font-bold text-text">{item.title}</h3>
              <EvidenceBadge tier={item.tier} />
            </div>

            <p className="text-sm text-text leading-relaxed">
              {item.definition}
            </p>

            <div className="pt-2 text-sm space-y-1 text-muted">
              <div>
                <strong className="text-text">Standard:</strong> {item.criteria}
              </div>
              <div>
                <strong className="text-text">Examples in literature:</strong> {item.example}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
