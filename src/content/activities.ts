import type { Activity } from './types';

const BREATHING_CAUTIONS: string[] = [
  'Skip breath holds if they feel uncomfortable.',
  'Stop the exercise if you feel dizzy or lightheaded.',
  'Talk to a clinician if you have a breathing, heart, or pregnancy-related concern.',
];

const MOVEMENT_CAUTIONS: string[] = [
  'Choose a movement that suits your current health and fitness.',
  'Stop if you feel pain or severe discomfort.',
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'cyclic-sighing',
    name: 'Cyclic Sighing',
    category: 'breathing',
    durationOptionsSec: [180, 300],
    evidenceId: 'breathwork-mood',
    testable: true,
    whenToUse: 'Before focused work or when you feel tense and want to lower arousal.',
    cautions: BREATHING_CAUTIONS,
    pattern: {
      phases: [
        { label: 'Inhale', seconds: 2 },
        { label: 'Top-up inhale', seconds: 1 },
        { label: 'Exhale', seconds: 6 },
      ],
    },
    steps: [
      'Breathe in through your nose for about 2 seconds.',
      'At the top, take a second short sniff in through your nose (about 1 second) to fully expand your lungs.',
      'Slowly exhale all the air out through your mouth for about 6 seconds.',
      'Repeat at a comfortable pace for the chosen duration.',
      'Note: these second counts are app defaults for pacing, not values taken from the study.',
    ],
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    category: 'breathing',
    durationOptionsSec: [180, 300],
    evidenceId: 'breathwork-mood',
    testable: true,
    whenToUse: 'When you feel anxious or want a calm, even breathing rhythm.',
    cautions: BREATHING_CAUTIONS,
    pattern: {
      phases: [
        { label: 'Inhale', seconds: 4 },
        { label: 'Hold', seconds: 4, optional: true },
        { label: 'Exhale', seconds: 4 },
        { label: 'Hold', seconds: 4, optional: true },
      ],
    },
    steps: [
      'Breathe in slowly through your nose for 4 seconds.',
      'Hold gently for 4 seconds (skip this hold if it feels uncomfortable).',
      'Exhale slowly through your mouth for 4 seconds.',
      'Hold empty for 4 seconds (skip if uncomfortable).',
      'Repeat for the chosen duration.',
    ],
  },
  {
    id: 'breath-counting',
    name: 'Breath Counting',
    category: 'attention',
    durationOptionsSec: [180, 300, 600],
    evidenceId: 'focused-attention',
    testable: true,
    whenToUse: 'As a warm-up before deep work to settle your attention.',
    cautions: BREATHING_CAUTIONS,
    steps: [
      'Breathe naturally. After each exhale, silently count: 1, 2, 3 … up to 9.',
      'After reaching 9, start again at 1.',
      'If you lose count or catch your mind wandering, gently restart at 1.',
      'The goal is not to reach a high number — it is to notice when your attention drifts.',
    ],
  },
  {
    id: 'nature-microbreak',
    name: 'Nature Micro-Break',
    category: 'nature',
    durationOptionsSec: [40, 120],
    evidenceId: 'nature-attention',
    testable: true,
    whenToUse: 'Between work blocks when you can look out a window or step outside briefly.',
    cautions: [],
    steps: [
      'Look at a natural scene — trees, sky, a garden, or even a photo of nature.',
      'Let your eyes relax and take in the scene without trying to analyze it.',
      'Breathe normally and allow your attention to rest.',
    ],
  },
  {
    id: 'movement-snack',
    name: 'Movement Snack',
    category: 'movement',
    durationOptionsSec: [300, 600, 900],
    evidenceId: 'movement',
    testable: true,
    whenToUse: 'When you feel sluggish or have been sitting for a long stretch.',
    cautions: MOVEMENT_CAUTIONS,
    steps: [
      'Walk briskly, do bodyweight exercises, or move in a way you enjoy.',
      'Aim for an effort that feels somewhat hard but safe — you should be able to talk.',
      'Return to your workspace when the timer ends.',
    ],
  },
  {
    id: 'quiet-rest',
    name: 'Quiet Rest',
    category: 'rest',
    durationOptionsSec: [180, 300],
    evidenceId: 'breaks-energy',
    testable: true,
    isControl: true,
    whenToUse: 'Between work blocks as a baseline break condition (no stimulation).',
    cautions: [],
    steps: [
      'Put your phone out of sight and close or minimize all screens.',
      'Sit or recline comfortably.',
      'Do nothing in particular — just rest quietly until the timer ends.',
    ],
  },
];

export function getActivityById(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
