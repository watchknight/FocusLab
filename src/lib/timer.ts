/**
 * Pure timer logic computed strictly from timestamps to eliminate tick-count drift.
 */

export interface TimerSnapshot {
  elapsedMs: number;
  remainingMs: number;
  progressPercent: number; // 0 to 100
  isFinished: boolean;
  formattedMinutesSeconds: string;
}

/**
 * Calculates accurate timer status based on start timestamp, total duration, and current timestamp.
 * Both startTimestampMs and nowMs can come from performance.now() or Date.now().
 */
export function computeTimerSnapshot(
  startTimestampMs: number,
  totalDurationMs: number,
  nowMs: number
): TimerSnapshot {
  if (totalDurationMs <= 0) {
    return {
      elapsedMs: 0,
      remainingMs: 0,
      progressPercent: 100,
      isFinished: true,
      formattedMinutesSeconds: '00:00',
    };
  }

  const rawElapsed = Math.max(0, nowMs - startTimestampMs);
  const elapsedMs = Math.min(totalDurationMs, rawElapsed);
  const remainingMs = Math.max(0, totalDurationMs - elapsedMs);
  const progressPercent = Math.min(100, (elapsedMs / totalDurationMs) * 100);
  const isFinished = elapsedMs >= totalDurationMs;

  return {
    elapsedMs,
    remainingMs,
    progressPercent,
    isFinished,
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
