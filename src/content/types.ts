export type EvidenceTier =
  | 'strong'
  | 'moderate'
  | 'mixed'
  | 'emerging'
  | 'not-supported';

export interface Reference {
  id: string;
  citation: string;
  link?: string;
  label?: string;
}

export interface EvidenceClaim {
  id: string;
  title: string;
  tier: EvidenceTier;
  outcome: string;
  summary: string;
  caveat: string;
  refIds: string[];
}

export interface BreathPhase {
  label: string;
  seconds: number;
  optional?: boolean;
}

export interface Activity {
  id: string;
  name: string;
  category: 'breathing' | 'attention' | 'movement' | 'nature' | 'rest';
  durationOptionsSec: number[];
  steps: string[];
  whenToUse: string;
  cautions: string[];
  evidenceId: string;
  testable: boolean;
  isControl?: boolean;
  pattern?: { phases: BreathPhase[] };
}

export interface Myth {
  id: string;
  myth: string;
  verdict: string;
  explanation: string;
  claimId: string;
}
