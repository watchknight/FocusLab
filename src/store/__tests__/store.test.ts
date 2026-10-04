import { describe, it, expect, beforeEach } from 'vitest';
import { useFocusLabStore } from '../index';
import { CheckResult, Session, ActivityLog, Experiment } from '../types';

describe('Zustand store export/import round-trip', () => {
  beforeEach(() => {
    useFocusLabStore.getState().deleteAll();
  });

  it('performs export and import round-trip successfully', () => {
    const check: CheckResult = {
      id: 'chk_1',
      ts: 1700000000,
      context: 'baseline',
      preRatings: { alertness: 4, mindWandering: 2 },
      trials: [
        { isiMs: 2000, rtMs: 280, falseStart: false },
        { isiMs: 3500, rtMs: null, falseStart: true },
      ],
      metrics: {
        medianRt: 280,
        lapses: 0,
        falseStarts: 1,
        meanReciprocal: 3.57,
      },
    };

    const session: Session = {
      id: 'sess_1',
      startedAt: 1700000000,
      intention: 'Draft unit test suite',
      ifThen: {
        when: 'Distracted by tab',
        then: 'Return to editor',
      },
      presetId: 'pomodoro_25',
      plannedFocusSec: 1500,
      actualFocusSec: 1500,
      blocks: 1,
      quality: 5,
      distractions: 0,
      parked: ['Follow up with review'],
      note: 'Very high focus',
    };

    const activityLog: ActivityLog = {
      id: 'act_log_1',
      ts: 1700000000,
      activityId: 'phys_sigh',
      durationSec: 120,
      completed: true,
    };

    const experiment: Experiment = {
      id: 'exp_1',
      createdAt: 1700000000,
      design: 'prepost',
      conditionIds: ['cond_silent', 'cond_brown_noise'],
      schedule: [{ conditionId: 'cond_silent' }],
      runs: [
        {
          id: 'run_1',
          ts: 1700000000,
          conditionId: 'cond_silent',
          checkIds: ['chk_1'],
        },
      ],
    };

    const store = useFocusLabStore.getState();
    store.addCheck(check);
    store.addSession(session);
    store.addActivityLog(activityLog);
    store.addExperiment(experiment);

    // Export data
    const exportedJson = store.exportData();
    expect(typeof exportedJson).toBe('string');

    // Wipe store
    store.deleteAll();
    expect(useFocusLabStore.getState().checks.length).toBe(0);
    expect(useFocusLabStore.getState().sessions.length).toBe(0);
    expect(useFocusLabStore.getState().activityLogs.length).toBe(0);
    expect(useFocusLabStore.getState().experiments.length).toBe(0);

    // Import data
    const importSuccess = store.importData(exportedJson);
    expect(importSuccess).toBe(true);

    const reloaded = useFocusLabStore.getState();
    expect(reloaded.checks.length).toBe(1);
    expect(reloaded.checks[0].id).toBe('chk_1');
    expect(reloaded.sessions.length).toBe(1);
    expect(reloaded.sessions[0].intention).toBe('Draft unit test suite');
    expect(reloaded.activityLogs.length).toBe(1);
    expect(reloaded.experiments.length).toBe(1);
  });

  it('rejects malformed json or schema without mutating state', () => {
    const store = useFocusLabStore.getState();
    const badJson = '{"version": 1, "checks": "not-an-array"}';

    const result = store.importData(badJson);
    expect(result).toBe(false);
    expect(store.checks.length).toBe(0);
  });
});
