import { ACTIVITIES, getActivityById } from '@/content/activities';

export interface ExperimentCondition {
  id: string; // e.g. 'activity:cyclic-sighing' or 'rest'
  name: string;
  category: 'activity' | 'sound' | 'rest';
  activityId?: string;
  description: string;
  defaultDurationSec: number;
}

/**
 * Returns the condition definition for 'rest' (quiet-rest control).
 */
export const REST_CONDITION: ExperimentCondition = {
  id: 'rest',
  name: 'Quiet Rest',
  category: 'rest',
  activityId: 'quiet-rest',
  description: 'Unstructured baseline rest without screens or phones.',
  defaultDurationSec: 180,
};

/**
 * Resolves an experiment condition object from its conditionId string.
 */
export function getConditionById(conditionId: string): ExperimentCondition {
  if (conditionId === 'rest') {
    return REST_CONDITION;
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

/**
 * Lists all testable activity conditions registered in FocusLab.
 */
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
