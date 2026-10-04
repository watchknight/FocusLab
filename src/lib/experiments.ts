import { SelfCheckLog, PracticeSessionLog } from '../content/types';

export interface DeltaStats {
  count: number;
  meanEnergyDelta: number;
  meanDistractionDelta: number;
  meanMoodDelta: number;
}

export function computeActivityDeltas(
  activityId: string,
  sessions: PracticeSessionLog[],
  checkLogs: SelfCheckLog[]
): DeltaStats {
  const checkMap = new Map<string, SelfCheckLog>();
  for (const log of checkLogs) {
    checkMap.set(log.id, log);
  }

  const matchingSessions = sessions.filter(
    (s) => s.activityId === activityId && s.preCheckId && s.postCheckId
  );

  if (matchingSessions.length === 0) {
    return {
      count: 0,
      meanEnergyDelta: 0,
      meanDistractionDelta: 0,
      meanMoodDelta: 0,
    };
  }

  let totalEnergyDelta = 0;
  let totalDistractionDelta = 0;
  let totalMoodDelta = 0;
  let validPairs = 0;

  for (const session of matchingSessions) {
    const pre = session.preCheckId ? checkMap.get(session.preCheckId) : undefined;
    const post = session.postCheckId ? checkMap.get(session.postCheckId) : undefined;

    if (pre && post) {
      totalEnergyDelta += post.energyLevel - pre.energyLevel;
      totalDistractionDelta += post.distractionLevel - pre.distractionLevel;
      totalMoodDelta += post.moodLevel - pre.moodLevel;
      validPairs++;
    }
  }

  if (validPairs === 0) {
    return {
      count: 0,
      meanEnergyDelta: 0,
      meanDistractionDelta: 0,
      meanMoodDelta: 0,
    };
  }

  return {
    count: validPairs,
    meanEnergyDelta: Number((totalEnergyDelta / validPairs).toFixed(2)),
    meanDistractionDelta: Number((totalDistractionDelta / validPairs).toFixed(2)),
    meanMoodDelta: Number((totalMoodDelta / validPairs).toFixed(2)),
  };
}
