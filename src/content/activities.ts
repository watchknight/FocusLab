import { ActivityDefinition } from './types';

export const ACTIVITIES: ActivityDefinition[] = [
  {
    id: 'act_phys_sigh',
    title: 'Physiological Sigh',
    shortDescription:
      'Two rapid inhales through nose, followed by a long, slow exhale to reduce autonomic arousal.',
    durationSeconds: 120, // 2 minutes
    evidenceId: 'ev_phys_sigh',
    category: 'breathing',
    instructions: [
      'Take a deep breath in through your nose.',
      'At the top of the breath, take a second quick sharp inhale through your nose to fully expand lung alveoli.',
      'Slowly and gently exhale all air through your mouth with a relaxed sigh.',
      'Repeat gently for 2 to 5 minutes without straining.',
    ],
  },
  {
    id: 'act_box_breathing',
    title: 'Box Breathing',
    shortDescription:
      'Equal 4-second ratio of inhale, hold, exhale, and hold to steady autonomic balance.',
    durationSeconds: 180, // 3 minutes
    evidenceId: 'ev_box_breathing',
    category: 'breathing',
    instructions: [
      'Inhale slowly through your nose for 4 seconds.',
      'Hold your breath comfortably for 4 seconds.',
      'Exhale smoothly through your mouth for 4 seconds.',
      'Hold empty for 4 seconds before the next cycle.',
    ],
  },
  {
    id: 'act_visual_anchor',
    title: 'Visual Anchor (Focal Restraint)',
    shortDescription:
      'Keep gaze pinned on a central focal point to calibrate orienting attention before complex work.',
    durationSeconds: 60, // 1 minute
    evidenceId: 'ev_visual_anchor',
    category: 'visual',
    instructions: [
      'Rest your gaze on the central target point on screen or across your room.',
      'Maintain gentle visual attention without straining or forcing your eyes wide.',
      'When your attention wanders to peripheral movement, calmly guide it back to the point.',
    ],
  },
  {
    id: 'act_if_then_plan',
    title: 'If-Then Distraction Plan',
    shortDescription:
      'Define clear situational contingencies to safeguard task persistence against predictable interruptions.',
    durationSeconds: 180, // 3 minutes
    evidenceId: 'ev_implementation_intentions',
    category: 'planning',
    instructions: [
      'Identify the single most likely distraction for your upcoming session (e.g., checking email/messages).',
      'Formulate your contingency: "If I feel the urge to open messages, then I will note it on paper and finish this interval."',
      'Mentally visualize executing this exact rule when the cue occurs.',
    ],
  },
  {
    id: 'act_nsdr_reset',
    title: 'Non-Sleep Deep Rest (NSDR)',
    shortDescription:
      'Progressive bodily relaxation to recover from cognitive fatigue without entering deep sleep.',
    durationSeconds: 600, // 10 minutes
    evidenceId: 'ev_nsdr',
    category: 'rest',
    instructions: [
      'Sit comfortably or recline with your spine supported.',
      'Progressively relax muscle groups from forehead down through feet.',
      'Allow mental effort to subside while remaining gently awake.',
    ],
  },
];

export function getActivityById(id: string): ActivityDefinition | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
