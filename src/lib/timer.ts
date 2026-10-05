/**
 * Pure timer logic computed strictly from timestamps to eliminate tick-count drift.
 */

export interface PauseInterval {
  pausedAt: number;
  resumedAt: number;
}

export interface TimerSnapshot {
  elapsedMs: number;
  remainingMs: number;
  progressPercent: number; // 0 to 100
  isFinished: boolean;
  isPaused: boolean;
  formattedMinutesSeconds: string;
}

/**
 * Calculates total elapsed time in milliseconds given a start timestamp,
 * a list of completed pause intervals, and an optional active pause timestamp.
 */
export function calculateElapsedMs(
  startedAt: number,
  pauses: PauseInterval[],
  currentlyPausedAt: number | null,
  now: number
): number {
  if (now < startedAt) return 0;

  // Calculate total time spent in completed pauses
  const completedPauseMs = pauses.reduce(
    (sum, p) => sum + Math.max(0, p.resumedAt - p.pausedAt),
    0
  );

  // If currently paused, calculate active pause time up to `now`
  const currentPauseMs =
    currentlyPausedAt !== null ? Math.max(0, now - currentlyPausedAt) : 0;

  const totalPauseMs = completedPauseMs + currentPauseMs;
  return Math.max(0, now - startedAt - totalPauseMs);
}

/**
 * Computes flexible break time in whole minutes:
 * Break is one fifth of focus time, rounded to whole minutes, minimum 2 minutes.
 */
export function computeFlexibleBreakMinutes(actualFocusSec: number): number {
  if (actualFocusSec <= 0) return 2;
  const rawMinutes = actualFocusSec / 5 / 60;
  return Math.max(2, Math.round(rawMinutes));
}

/**
 * Computes flexible break time in seconds.
 */
export function computeFlexibleBreakSec(actualFocusSec: number): number {
  return computeFlexibleBreakMinutes(actualFocusSec) * 60;
}

/**
 * Calculates accurate timer status based on start timestamp, total duration,
 * pauses, and current timestamp.
 */
export function computeTimerSnapshot(
  startedAt: number,
  totalDurationMs: number,
  now: number,
  pauses: PauseInterval[] = [],
  currentlyPausedAt: number | null = null
): TimerSnapshot {
  if (totalDurationMs <= 0) {
    return {
      elapsedMs: 0,
      remainingMs: 0,
      progressPercent: 100,
      isFinished: true,
      isPaused: currentlyPausedAt !== null,
      formattedMinutesSeconds: '00:00',
    };
  }

  const rawElapsed = calculateElapsedMs(startedAt, pauses, currentlyPausedAt, now);
  const elapsedMs = Math.min(totalDurationMs, rawElapsed);
  const remainingMs = Math.max(0, totalDurationMs - elapsedMs);
  const progressPercent = Math.min(100, (elapsedMs / totalDurationMs) * 100);
  const isFinished = elapsedMs >= totalDurationMs;

  return {
    elapsedMs,
    remainingMs,
    progressPercent,
    isFinished,
    isPaused: currentlyPausedAt !== null,
    formattedMinutesSeconds: formatTimeRemaining(remainingMs),
  };
}

/**
 * Formats milliseconds into a zero-padded MM:SS string.
 */
export function formatTimeRemaining(remainingMs: number): string {
  const totalSeconds = Math.ceil(Math.max(0, remainingMs) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${mm}:${ss}`;
}
