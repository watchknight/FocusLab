export type EvidenceLevel =
  | 'strong'
  | 'moderate'
  | 'mixed'
  | 'emerging'
  | 'not-supported';

export type CognitiveOutcome =
  | 'sustained-attention'
  | 'working-memory'
  | 'task-persistence'
  | 'autonomic-arousal'
  | 'subjective-mood'
  | 'cognitive-fatigue'
  | 'goal-follow-through'
  | 'task-switching-cost'
  | 'spatial-distractibility';

export interface EvidenceSource {
  id: string;
  citation: string;
  year: number;
  doiOrUrl?: string;
  notes: string;
}

export interface EvidenceRecord {
  id: string;
  level: EvidenceLevel;
  primaryOutcomes: CognitiveOutcome[];
  claimSummary: string;
  counterClaimOrCaveat?: string;
  sources: EvidenceSource[];
}

export interface ActivityDefinition {
  id: string;
  title: string;
  shortDescription: string;
  durationSeconds: number;
  evidenceId: string;
  category: 'breathing' | 'visual' | 'planning' | 'rest' | 'environment';
  instructions: string[];
}

export interface MythDefinition {
  id: string;
  claim: string;
  reality: string;
  evidenceId: string;
  fallacyType: string;
}

export interface SelfCheckLog {
  id: string;
  timestamp: number;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  distractionLevel: 1 | 2 | 3 | 4 | 5;
  moodLevel: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

export interface PracticeSessionLog {
  id: string;
  activityId: string;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  preCheckId?: string;
  postCheckId?: string;
  completedFully: boolean;
}

export interface ExperimentComparison {
  id: string;
  title: string;
  conditionA: string;
  conditionB: string;
  metric: CognitiveOutcome;
  sessionIdsA: string[];
  sessionIdsB: string[];
}
