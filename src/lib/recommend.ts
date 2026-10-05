import { getClaimById } from '@/content/evidence';
import { EvidenceTier } from '@/content/types';

export type UserGoal = 'study' | 'work' | 'creative' | 'other';

export type UserObstacle =
  | 'phone'
  | 'racing_thoughts'
  | 'tiredness'
  | 'noise'
  | 'cant_start';

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  claimId: string;
  tier: EvidenceTier;
  outcome: string;
  whyThis: string;
}

/**
 * Deterministically generates evidence-backed recommendations for a given obstacle.
 */
export function getRecommendationsForObstacle(
  obstacle: UserObstacle
): RecommendationItem[] {
  switch (obstacle) {
    case 'phone': {
      const claim1 = getClaimById('phone-presence');
      const claim2 = getClaimById('if-then');
      return [
        {
          id: 'env-phone',
          title: 'Environment Checklist',
          description: 'Place your phone out of reach and silence notifications before working.',
          actionLabel: 'Open Environment Checklist',
          actionHref: '/focus',
          claimId: 'phone-presence',
          tier: claim1?.tier || 'mixed',
          outcome: claim1?.outcome || 'attention and working memory',
          whyThis:
            'Testing whether moving your phone out of sight reduces cognitive friction.',
        },
        {
          id: 'focus-if-then',
          title: 'Focus Session with If-Then Plan',
          description: 'Set a pre-commitment: "When I reach for my phone, I will take one slow breath."',
          actionLabel: 'Start Focus Session',
          actionHref: '/focus',
          claimId: 'if-then',
          tier: claim2?.tier || 'strong',
          outcome: claim2?.outcome || 'goal follow-through',
          whyThis:
            'Meta-analyses show specific if-then plans produce medium-to-large effects on carrying out intended actions.',
        },
      ];
    }

    case 'racing_thoughts': {
      const claim1 = getClaimById('focused-attention');
      const claim2 = getClaimById('breathwork-mood');
      return [
        {
          id: 'breath-counting',
          title: 'Breath Counting Practice',
          description: 'Count exhales from 1 to 9 to anchor wandering attention.',
          actionLabel: 'Try Breath Counting',
          actionHref: '/activities/breath-counting',
          claimId: 'focused-attention',
          tier: claim1?.tier || 'moderate',
          outcome: claim1?.outcome || 'sustained attention and executive attention',
          whyThis:
            'Multi-week mindfulness practice shows small-to-moderate effects on sustained and executive attention.',
        },
        {
          id: 'cyclic-sighing',
          title: 'Cyclic Sighing',
          description: 'Two inhales followed by a prolonged exhale to lower physiological arousal.',
          actionLabel: 'Try Cyclic Sighing',
          actionHref: '/activities/cyclic-sighing',
          claimId: 'breathwork-mood',
          tier: claim2?.tier || 'moderate',
          outcome: claim2?.outcome || 'mood and physiological arousal',
          whyThis:
            'Controlled trials found 5 minutes of cyclic sighing improved mood and reduced breathing rate.',
        },
      ];
    }

    case 'tiredness': {
      const claim1 = getClaimById('movement');
      const claim2 = getClaimById('sleep');
      return [
        {
          id: 'movement-snack',
          title: 'Movement Snack',
          description: 'A 5 to 10 minute bout of moderate physical movement to clear mental fatigue.',
          actionLabel: 'Start Movement Snack',
          actionHref: '/activities/movement-snack',
          claimId: 'movement',
          tier: claim1?.tier || 'moderate',
          outcome: claim1?.outcome || 'executive function',
          whyThis:
            'Meta-analyses find a single acute bout of exercise has a small positive effect on executive function.',
        },
        {
          id: 'sleep-card',
          title: 'Sleep and Alertness Review',
          description: 'Recognize the biological limits of focus when experiencing sleep debt.',
          actionLabel: 'Read Sleep Evidence',
          actionHref: '/learn/sleep',
          claimId: 'sleep',
          tier: claim2?.tier || 'strong',
          outcome: claim2?.outcome || 'attention lapses and alertness',
          whyThis:
            'Sleep loss reliably worsens vigilance and alertness; no hack substitutes for adequate sleep.',
        },
      ];
    }

    case 'noise': {
      const claim1 = getClaimById('noise');
      const claim2 = getClaimById('multitasking');
      return [
        {
          id: 'sound-experiment',
          title: 'Ambient Noise Self-Experiment',
          description: 'Test whether white, pink, or brown noise improves or hinders your personal RT.',
          actionLabel: 'Explore Soundscapes',
          actionHref: '/sounds',
          claimId: 'noise',
          tier: claim1?.tier || 'mixed',
          outcome: claim1?.outcome || 'attention-task performance',
          whyThis:
            'Effects of noise depend on individual attention profiles; test it on yourself rather than assuming.',
        },
        {
          id: 'env-noise',
          title: 'Environment Distraction Control',
          description: 'Close unnecessary background audio tabs and reduce notification interruptions.',
          actionLabel: 'Check Environment',
          actionHref: '/focus',
          claimId: 'multitasking',
          tier: claim2?.tier || 'moderate',
          outcome: claim2?.outcome || 'cost of switching',
          whyThis:
            'Task switching and interruptions increase reported stress and produce lingering attention residue.',
        },
      ];
    }

    case 'cant_start': {
      const claim1 = getClaimById('if-then');
      const claim2 = getClaimById('breaks-energy');
      return [
        {
          id: 'if-then-start',
          title: 'If-Then Implementation Intention',
          description: 'Write down: "When I sit down at my desk, I will open only document X."',
          actionLabel: 'Set Focus Intention',
          actionHref: '/focus',
          claimId: 'if-then',
          tier: claim1?.tier || 'strong',
          outcome: claim1?.outcome || 'goal follow-through',
          whyThis:
            'Specific if-then plans produce a medium-to-large effect on initiating intended actions.',
        },
        {
          id: 'micro-focus-block',
          title: 'Short 10-Minute Focus Block',
          description: 'Lower the barrier to entry by committing to only 10 minutes of initial work.',
          actionLabel: 'Start Custom Block',
          actionHref: '/focus',
          claimId: 'breaks-energy',
          tier: claim2?.tier || 'moderate',
          outcome: claim2?.outcome || 'vigor and fatigue',
          whyThis:
            'Micro-breaks and manageable intervals help maintain vigor and prevent fatigue build-up.',
        },
      ];
    }
  }
}
