import { describe, it, expect } from 'vitest';
import { validateImportData, serializeExport, FocusLabDataExport } from '../storage';

describe('storage validation and serialization', () => {
  const sampleData: FocusLabDataExport = {
    version: 1,
    exportedAt: '2026-10-05T00:00:00.000Z',
    checkLogs: [
      {
        id: 'chk_1',
        timestamp: 1700000000,
        energyLevel: 3,
        distractionLevel: 4,
        moodLevel: 3,
      },
    ],
    sessionLogs: [
      {
        id: 'sess_1',
        activityId: 'act_phys_sigh',
        startedAt: 1700000000,
        completedAt: 1700000120,
        durationMs: 120000,
        completedFully: true,
      },
    ],
    userPreferences: {
      theme: 'dark',
      soundVolume: 0.8,
    },
  };

  it('serializes and parses data correctly', () => {
    const json = serializeExport(sampleData);
    const parsed = JSON.parse(json);
    const validation = validateImportData(parsed);

    expect(validation.success).toBe(true);
    expect(validation.data?.checkLogs.length).toBe(1);
    expect(validation.data?.userPreferences.theme).toBe('dark');
  });

  it('rejects payload with invalid version', () => {
    const invalid = { ...sampleData, version: 2 };
    const validation = validateImportData(invalid);
    expect(validation.success).toBe(false);
    expect(validation.error).toContain('Unsupported data version');
  });

  it('rejects corrupted check logs', () => {
    const invalid = {
      ...sampleData,
      checkLogs: [{ id: 123, energyLevel: 'high' }],
    };
    const validation = validateImportData(invalid);
    expect(validation.success).toBe(false);
    expect(validation.error).toContain('Invalid check log entry');
  });
});
