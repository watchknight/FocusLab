import type { Myth } from './types';

export const MYTHS: Myth[] = [
  {
    id: 'myth-brain-training',
    myth: 'Brain-training games improve general intelligence and cognitive ability.',
    verdict: 'Not Supported',
    explanation:
      'Working-memory training improves the trained tasks, but reviews find no convincing transfer to broader intelligence or everyday attention compared with active control groups.',
    claimId: 'brain-training',
  },
  {
    id: 'myth-multitasking',
    myth: 'You can efficiently do two demanding mental tasks at the same time.',
    verdict: 'Not Supported',
    explanation:
      'Interrupted work increases stress and frustration. Thinking about an unfinished task leaves attention residue that slows and impairs performance on the next task.',
    claimId: 'multitasking',
  },
  {
    id: 'myth-binaural-beats',
    myth: 'Binaural beats reliably enhance focus and memory for everyone.',
    verdict: 'Mixed',
    explanation:
      'Average effects across reviews are mixed, and individual studies conflict depending on frequency and timing. More robust trials are needed.',
    claimId: 'binaural',
  },
  {
    id: 'myth-pomodoro-optimal',
    myth: 'The 25-minute work / 5-minute break Pomodoro ratio is scientifically optimal.',
    verdict: 'Not Supported',
    explanation:
      'Studies comparing fixed 25/5 breaks with self-paced breaks show conflicting results. No work-to-break ratio has been proven best; timers should remain flexible.',
    claimId: 'breaks-performance',
  },
  {
    id: 'myth-noise-universal',
    myth: 'White or brown noise improves focus for everyone.',
    verdict: 'Mixed',
    explanation:
      'A meta-analysis found white or pink noise gave a small benefit for people with ADHD or attention challenges, but a small negative effect for others. Brown noise has not been studied.',
    claimId: 'noise',
  },
  {
    id: 'myth-phone-desk',
    myth: 'Having your phone visible on your desk always ruins your focus.',
    verdict: 'Mixed',
    explanation:
      'Earlier lab findings that merely having your own phone nearby reduces cognitive capacity have not always replicated. Treat putting it out of sight as a habit to test.',
    claimId: 'phone-presence',
  },
];
