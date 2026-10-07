import type { Myth } from './types';

// TODO(evidence): The explanations below are derived summaries directly linked to peer-reviewed claims in evidence.ts via claimId.
export const MYTHS: Myth[] = [
  {
    id: 'myth-brain-training',
    myth: 'Brain-training games improve general intelligence and everyday attention.',
    verdict: 'Not Supported',
    explanation:
      'A meta-analysis of 87 publications found working-memory training improves trained tasks, but there is no convincing transfer to broader abilities compared with active controls.',
    claimId: 'brain-training',
  },
  {
    id: 'myth-multitasking',
    myth: 'You can efficiently do two demanding mental tasks at the same time.',
    verdict: 'Not Supported',
    explanation:
      'Interrupted people work faster to compensate but report more stress, frustration, and effort. Unfinished tasks leave "attention residue" that slows the next task.',
    claimId: 'multitasking',
  },
  {
    id: 'myth-binaural-beats',
    myth: 'Binaural beats reliably enhance focus and memory for everyone.',
    verdict: 'Mixed',
    explanation:
      'Meta-analyses report average effects on cognition and anxiety, but individual studies conflict, especially across different brainwave frequencies. More robust trials are needed.',
    claimId: 'binaural',
  },
  {
    id: 'myth-pomodoro-optimal',
    myth: 'The 25-minute work / 5-minute break Pomodoro ratio is scientifically optimal.',
    verdict: 'Not Supported',
    explanation:
      'Studies comparing fixed 25/5 breaks with self-paced breaks show conflicting results. No specific work-to-break ratio has been proven best; keep timers flexible.',
    claimId: 'breaks-performance',
  },
  {
    id: 'myth-noise-universal',
    myth: 'White or brown noise improves focus for everyone.',
    verdict: 'Mixed',
    explanation:
      'A meta-analysis found white or pink noise gave a small benefit for people with ADHD or attention problems, but a small negative effect for others. No brown noise studies were found.',
    claimId: 'noise',
  },
  {
    id: 'myth-phone-desk',
    myth: 'Having your phone visible on your desk always ruins your focus.',
    verdict: 'Mixed',
    explanation:
      'Earlier lab findings that a nearby phone reduces cognitive capacity have not always replicated. Putting your phone out of sight is a low-cost habit to test, not a proven fix.',
    claimId: 'phone-presence',
  },
];
