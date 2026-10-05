import { ACTIVITIES, getActivityById } from '@/content/activities';

export interface ExperimentCondition {
  id: string; // e.g. 'activity:cyclic-sighing', 'sound:white', or 'rest'
  name: string;
  category: 'activity' | 'sound' | 'rest';
  activityId?: string;
  soundType?: 'white' | 'pink' | 'brown' | 'silence';
  description: string;
  defaultDurationSec: number;
}

export const REST_CONDITION: ExperimentCondition = {
  id: 'rest',
  name: 'Quiet Rest',
  category: 'rest',
  activityId: 'quiet-rest',
  description: 'Unstructured baseline rest without screens or phones.',
  defaultDurationSec: 180,
};

export const SILENCE_CONDITION: ExperimentCondition = {
  id: 'sound:silence',
  name: 'Silence Control',
  category: 'sound',
  soundType: 'silence',
  description: 'Quiet environment without auditory stimulation.',
  defaultDurationSec: 180,
};

export const SOUND_CONDITIONS: Record<string, ExperimentCondition> = {
  'sound:white': {
    id: 'sound:white',
    name: 'White Noise',
    category: 'sound',
    soundType: 'white',
    description: 'Equal energy across all audible frequencies.',
    defaultDurationSec: 180,
  },
  'sound:pink': {
    id: 'sound:pink',
    name: 'Pink Noise',
    category: 'sound',
    soundType: 'pink',
    description: 'Deeper noise with energy decreasing by 3 dB per octave.',
    defaultDurationSec: 180,
  },
  'sound:brown': {
    id: 'sound:brown',
    name: 'Brown Noise',
    category: 'sound',
    soundType: 'brown',
    description: 'Deep, low-frequency rumble decreasing by 6 dB per octave.',
    defaultDurationSec: 180,
  },
  'sound:silence': SILENCE_CONDITION,
};

export function getConditionById(conditionId: string): ExperimentCondition {
  if (conditionId === 'rest') {
    return REST_CONDITION;
  }

  if (SOUND_CONDITIONS[conditionId]) {
    return SOUND_CONDITIONS[conditionId];
  }

  if (conditionId.startsWith('activity:')) {
    const activityId = conditionId.replace('activity:', '');
    const act = getActivityById(activityId);
    if (act) {
      return {
        id: conditionId,
        name: act.name,
        category: 'activity',
        activityId: act.id,
        description: act.whenToUse,
        defaultDurationSec: act.durationOptionsSec[0] || 180,
      };
    }
  }

  return {
    id: conditionId,
    name: conditionId,
    category: 'activity',
    description: '',
    defaultDurationSec: 180,
  };
}

export function getTestableActivityConditions(): ExperimentCondition[] {
  return ACTIVITIES.filter((a) => a.testable && !a.isControl).map((act) => ({
    id: `activity:${act.id}`,
    name: act.name,
    category: 'activity',
    activityId: act.id,
    description: act.whenToUse,
    defaultDurationSec: act.durationOptionsSec[0] || 180,
  }));
}

export function getTestableSoundConditions(): ExperimentCondition[] {
  return [
    SOUND_CONDITIONS['sound:white'],
    SOUND_CONDITIONS['sound:pink'],
    SOUND_CONDITIONS['sound:brown'],
  ];
}
