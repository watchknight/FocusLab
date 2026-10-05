import { FocusLabSnapshot, CheckResult, Session, ActivityLog, Experiment } from './types';

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function isValidRating(val: unknown): boolean {
  return typeof val === 'number' && [1, 2, 3, 4, 5].includes(val);
}

function validateCheck(chk: unknown): chk is CheckResult {
  if (!isObject(chk)) return false;
  if (typeof chk.id !== 'string' || typeof chk.ts !== 'number') return false;
  if (chk.context !== 'baseline' && chk.context !== 'experiment') return false;
  if (chk.runId !== undefined && typeof chk.runId !== 'string') return false;
  if (
    chk.phase !== undefined &&
    chk.phase !== 'before' &&
    chk.phase !== 'after' &&
    chk.phase !== 'concurrent'
  ) {
    return false;
  }
  if (!isObject(chk.preRatings)) return false;
  if (
    !isValidRating(chk.preRatings.alertness) ||
    !isValidRating(chk.preRatings.mindWandering)
  ) {
    return false;
  }
  if (!Array.isArray(chk.trials)) return false;
  for (const t of chk.trials) {
    if (!isObject(t)) return false;
    if (typeof t.isiMs !== 'number' || typeof t.falseStart !== 'boolean') return false;
    if (t.rtMs !== null && typeof t.rtMs !== 'number') return false;
  }
  if (!isObject(chk.metrics)) return false;
  if (
    typeof chk.metrics.medianRt !== 'number' ||
    typeof chk.metrics.lapses !== 'number' ||
    typeof chk.metrics.falseStarts !== 'number' ||
    typeof chk.metrics.meanReciprocal !== 'number'
  ) {
    return false;
  }
  return true;
}

function validateSession(s: unknown): s is Session {
  if (!isObject(s)) return false;
  if (typeof s.id !== 'string' || typeof s.startedAt !== 'number') return false;
  if (typeof s.intention !== 'string' || typeof s.presetId !== 'string') return false;
  if (typeof s.plannedFocusSec !== 'number' || typeof s.actualFocusSec !== 'number') return false;
  if (typeof s.blocks !== 'number' || typeof s.distractions !== 'number') return false;
  if (!Array.isArray(s.parked)) return false;
  for (const p of s.parked) {
    if (typeof p !== 'string') return false;
  }
  if (s.quality !== undefined && !isValidRating(s.quality)) return false;
  if (s.ifThen !== undefined) {
    if (!isObject(s.ifThen) || typeof s.ifThen.when !== 'string' || typeof s.ifThen.then !== 'string') {
      return false;
    }
  }
  if (s.note !== undefined && typeof s.note !== 'string') return false;
  return true;
}

function validateActivityLog(a: unknown): a is ActivityLog {
  if (!isObject(a)) return false;
  return (
    typeof a.id === 'string' &&
    typeof a.ts === 'number' &&
    typeof a.activityId === 'string' &&
    typeof a.durationSec === 'number' &&
    typeof a.completed === 'boolean'
  );
}

function validateExperiment(e: unknown): e is Experiment {
  if (!isObject(e)) return false;
  if (typeof e.id !== 'string' || typeof e.createdAt !== 'number') return false;
  if (e.design !== 'prepost' && e.design !== 'concurrent') return false;
  if (!Array.isArray(e.conditionIds) || !Array.isArray(e.schedule) || !Array.isArray(e.runs)) {
    return false;
  }
  for (const cid of e.conditionIds) {
    if (typeof cid !== 'string') return false;
  }
  for (const sch of e.schedule) {
    if (!isObject(sch) || typeof sch.conditionId !== 'string') return false;
  }
  for (const r of e.runs) {
    if (!isObject(r) || typeof r.id !== 'string' || typeof r.ts !== 'number' || typeof r.conditionId !== 'string') {
      return false;
    }
    if (!Array.isArray(r.checkIds)) return false;
    for (const chkId of r.checkIds) {
      if (typeof chkId !== 'string') return false;
    }
  }
  return true;
}

export function validateSnapshot(raw: unknown): { valid: boolean; data?: FocusLabSnapshot; error?: string } {
  if (!isObject(raw)) {
    return { valid: false, error: 'Snapshot must be an object' };
  }
  if (raw.version !== 1) {
    return { valid: false, error: 'Unsupported version' };
  }
  if (typeof raw.exportedAt !== 'string') {
    return { valid: false, error: 'Missing exportedAt string' };
  }
  if (!Array.isArray(raw.checks) || !raw.checks.every(validateCheck)) {
    return { valid: false, error: 'Invalid checks collection' };
  }
  if (!Array.isArray(raw.sessions) || !raw.sessions.every(validateSession)) {
    return { valid: false, error: 'Invalid sessions collection' };
  }
  if (!Array.isArray(raw.activityLogs) || !raw.activityLogs.every(validateActivityLog)) {
    return { valid: false, error: 'Invalid activityLogs collection' };
  }
  if (!Array.isArray(raw.experiments) || !raw.experiments.every(validateExperiment)) {
    return { valid: false, error: 'Invalid experiments collection' };
  }
  return {
    valid: true,
    data: {
      version: 1,
      exportedAt: raw.exportedAt as string,
      checks: raw.checks as CheckResult[],
      sessions: raw.sessions as Session[],
      activityLogs: raw.activityLogs as ActivityLog[],
      experiments: raw.experiments as Experiment[],
    },
  };
}
