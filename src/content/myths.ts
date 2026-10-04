import { MythDefinition } from './types';

export const MYTHS: MythDefinition[] = [
  {
    id: 'myth_mozart',
    claim: 'Listening to classical music permanently boosts general intelligence and focus.',
    reality:
      'Meta-analyses confirm that any temporary cognitive change is mediated solely by short-term changes in arousal and positive mood, which any music or pleasant stimulus you enjoy can equally provide.',
    evidenceId: 'ev_myth_mozart',
    fallacyType: 'Media over-generalization of short-term arousal effects',
  },
  {
    id: 'myth_multitasking',
    claim: 'Practicing multitasking trains your brain to handle simultaneous demanding tasks without cost.',
    reality:
      'Cognitive neuroscience consistently demonstrates serial bottlenecking: humans rapidly switch back and forth, incurring measurable switch costs in cognitive latency and accuracy.',
    evidenceId: 'ev_myth_multitasking',
    fallacyType: 'Illusion of productivity via rapid task-switching',
  },
];
