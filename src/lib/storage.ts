/**
 * @deprecated Legacy export validation logic preserved for backwards compatibility with v0 backups.
 * Active application uses store snapshot validation in src/store/validation.ts.
 */
import { SelfCheckLog, PracticeSessionLog } from './legacy-types';

export interface FocusLabDataExport {
  version: 1;
  exportedAt: string;
  checkLogs: SelfCheckLog[];
  sessionLogs: PracticeSessionLog[];
  userPreferences: {
    theme: 'system' | 'daylight' | 'night' | 'contrast' | 'light' | 'dark';
    soundVolume: number;
  };
}

export function validateImportData(raw: unknown): {
  success: boolean;
  data?: FocusLabDataExport;
  error?: string;
} {
  if (typeof raw !== 'object' || raw === null) {
    return { success: false, error: 'Import payload must be a JSON object.' };
  }

  const candidate = raw as Record<string, unknown>;

  if (candidate.version !== 1) {
    return {
      success: false,
      error: 'Unsupported data version. Only version 1 is supported.',
    };
  }

  if (!Array.isArray(candidate.checkLogs)) {
    return { success: false, error: 'Field "checkLogs" must be an array.' };
  }

  for (const item of candidate.checkLogs) {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof item.id !== 'string' ||
      typeof item.timestamp !== 'number' ||
      typeof item.energyLevel !== 'number' ||
      typeof item.distractionLevel !== 'number' ||
      typeof item.moodLevel !== 'number'
    ) {
      return { success: false, error: 'Invalid check log entry detected.' };
    }
  }

  if (!Array.isArray(candidate.sessionLogs)) {
    return { success: false, error: 'Field "sessionLogs" must be an array.' };
  }

  for (const item of candidate.sessionLogs) {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof item.id !== 'string' ||
      typeof item.activityId !== 'string' ||
      typeof item.startedAt !== 'number' ||
      typeof item.completedAt !== 'number' ||
      typeof item.durationMs !== 'number' ||
      typeof item.completedFully !== 'boolean'
    ) {
      return { success: false, error: 'Invalid session log entry detected.' };
    }
  }

  const preferences = (candidate.userPreferences || {}) as Record<string, unknown>;
  const rawTheme = preferences.theme;
  const theme =
    rawTheme === 'daylight' ||
    rawTheme === 'night' ||
    rawTheme === 'contrast' ||
    rawTheme === 'light' ||
    rawTheme === 'dark'
      ? rawTheme
      : 'system';
  const soundVolume =
    typeof preferences.soundVolume === 'number'
      ? Math.max(0, Math.min(1, preferences.soundVolume))
      : 0.5;

  return {
    success: true,
    data: {
      version: 1,
      exportedAt:
        typeof candidate.exportedAt === 'string'
          ? candidate.exportedAt
          : new Date().toISOString(),
      checkLogs: candidate.checkLogs as SelfCheckLog[],
      sessionLogs: candidate.sessionLogs as PracticeSessionLog[],
      userPreferences: { theme, soundVolume },
    },
  };
}

export function serializeExport(data: FocusLabDataExport): string {
  return JSON.stringify(data, null, 2);
}
