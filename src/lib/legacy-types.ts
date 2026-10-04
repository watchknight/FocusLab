/**
 * Legacy types from the original content system.
 * Kept to avoid breaking existing lib modules until they are migrated
 * to the new store types in src/store/types.ts.
 */

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
