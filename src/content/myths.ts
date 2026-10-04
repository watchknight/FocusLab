import type { Myth } from './types';

export const MYTHS: Myth[] = [
  {
    id: 'myth-brain-training',
    myth: 'Brain-training games improve general intelligence and cognitive ability.',
    verdict: 'Not Supported',
    explanation:
      'These games may improve your score on the trained task, but controlled studies have not shown reliable transfer to broader thinking skills or everyday cognitive ability.',
    claimId: 'brain-training',
  },
  {
    id: 'myth-multitasking',
    myth: 'You can efficiently do two demanding mental tasks at the same time.',
    verdict: 'Not Supported',
    explanation:
      'The brain rapidly switches between tasks rather than running them in parallel, resulting in measurable increases in both reaction time and error rates.',
    claimId: 'ev_myth_multitasking',
  },
  {
    id: 'myth-binaural-beats',
    myth: 'Binaural beats can reliably enhance your focus and creativity.',
    verdict: 'Not Supported',
    explanation:
      'Despite popular claims, controlled studies have not found consistent evidence that binaural beats improve attention, memory, or creativity.',
    claimId: 'binaural-beats',
  },
  {
    id: 'myth-pomodoro-optimal',
    myth: 'The 25-minute work / 5-minute break Pomodoro ratio is scientifically optimal.',
    verdict: 'Not Supported',
    explanation:
      'Research supports taking breaks during long tasks to maintain attention, but no study has validated 25/5 as the ideal ratio. The best timing likely varies by person and task.',
    claimId: 'ev_timeboxing_microbreaks',
  },
  {
    id: 'myth-noise-universal',
    myth: 'White or brown noise improves focus for everyone.',
    verdict: 'Mixed',
    explanation:
      'Continuous noise can mask distracting sounds, and some evidence suggests a benefit for inattentive individuals. However, people with high baseline alertness may find it distracting. Test what works for you.',
    claimId: 'ev_pink_brown_noise',
  },
  {
    id: 'myth-phone-desk',
    myth: 'Having your phone visible on your desk always ruins your focus.',
    verdict: 'Mixed',
    explanation:
      'A visible phone may reduce available cognitive capacity for some people, but the effect depends on your personal habits and how attached you are to the device. Try testing both conditions.',
    claimId: 'phone-distraction',
  },
];
