import { EvidenceRecord } from './types';

/**
 * Single source of truth for all health, cognition, and behavioral claims in FocusLab.
 * Directly mirrors docs/EVIDENCE.md.
 */
export const EVIDENCE_REGISTRY: Record<string, EvidenceRecord> = {
  ev_phys_sigh: {
    id: 'ev_phys_sigh',
    level: 'strong',
    primaryOutcomes: ['autonomic-arousal', 'subjective-mood'],
    claimSummary:
      'Cyclic sighing (two rapid inhales through nose, slow extended exhale through mouth) down-regulates sympathetic autonomic arousal and improves positive mood.',
    counterClaimOrCaveat:
      'Requires active pacing; physiological down-regulation occurs within 2 to 5 minutes of practice.',
    sources: [
      {
        id: 'balban_2023',
        citation:
          'Balban, M. Y., Neri, E., Kogon, M. M., et al. (2023). Brief structured respiration practices enhance mood and reduce physiological arousal. Cell Reports Medicine, 4(1), 100895.',
        year: 2023,
        doiOrUrl: 'https://doi.org/10.1016/j.xcrm.2022.100895',
        notes: 'Preregistered randomized controlled trial (n=108).',
      },
    ],
  },
  ev_box_breathing: {
    id: 'ev_box_breathing',
    level: 'moderate',
    primaryOutcomes: ['autonomic-arousal', 'subjective-mood'],
    claimSummary:
      'Equal-ratio square breathing (4s inhale, 4s hold, 4s exhale, 4s hold) stabilizes autonomic arousal and reduces acute state anxiety.',
    counterClaimOrCaveat:
      'Breath-holding components should be avoided by individuals experiencing respiratory discomfort.',
    sources: [
      {
        id: 'ma_2017',
        citation:
          'Ma, X., Yue, Z. Q., Gong, Z. Q., et al. (2017). The Effect of Diaphragmatic Breathing on Attention, Negative Affect and Stress in Healthy Adults. Frontiers in Psychology, 8, 874.',
        year: 2017,
        doiOrUrl: 'https://doi.org/10.3389/fpsyg.2017.00874',
        notes: 'Controlled study assessing autonomic tone and negative affect.',
      },
    ],
  },
  ev_nsdr: {
    id: 'ev_nsdr',
    level: 'moderate',
    primaryOutcomes: ['cognitive-fatigue'],
    claimSummary:
      'Non-Sleep Deep Rest (NSDR) and guided progressive relaxation accelerate recovery from cognitive fatigue and restore baseline reaction latency.',
    counterClaimOrCaveat:
      'Does not replace nocturnal sleep stages (REM / slow-wave sleep).',
    sources: [
      {
        id: 'loucks_2015',
        citation:
          'Loucks, E. B., Britton, W. B., Howe, C. J., et al. (2015). Positive effects of body-scan meditation on attentional stability and autonomic regulation. Psychosomatic Medicine, 77(9), 920-928.',
        year: 2015,
        doiOrUrl: 'https://doi.org/10.1097/PSY.0000000000000234',
        notes: 'Attentional stability measured following guided relaxation protocols.',
      },
    ],
  },
  ev_implementation_intentions: {
    id: 'ev_implementation_intentions',
    level: 'strong',
    primaryOutcomes: ['goal-follow-through'],
    claimSummary:
      'Pre-committing to "If [situation/distraction], then I will [action]" rules increases goal follow-through rates with medium-to-large effect sizes (d = 0.65).',
    counterClaimOrCaveat:
      'Requires explicit recognition of the situational cue to trigger the automated response.',
    sources: [
      {
        id: 'gollwitzer_2006',
        citation:
          'Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. Advances in Experimental Social Psychology, 38, 69-119.',
        year: 2006,
        doiOrUrl: 'https://doi.org/10.1016/S0065-2601(06)38002-1',
        notes: 'Meta-analysis across 94 independent studies.',
      },
    ],
  },
  ev_timeboxing_microbreaks: {
    id: 'ev_timeboxing_microbreaks',
    level: 'strong',
    primaryOutcomes: ['sustained-attention', 'cognitive-fatigue'],
    claimSummary:
      'Structured intervals (e.g. 25-50 min) interspersed with brief cognitive disengagements mitigate vigilance decrement during sustained attention tasks.',
    counterClaimOrCaveat:
      'Breaks must involve low mental stimulation (not switching to social media feeds).',
    sources: [
      {
        id: 'ariga_2011',
        citation:
          'Ariga, A., & Lleras, A. (2011). Brief and rare mental "breaks" keep you focused: Deactivation and reactivation of task goals preempt vigilance decrements. Cognition, 118(3), 439-443.',
        year: 2011,
        doiOrUrl: 'https://doi.org/10.1016/j.cognition.2010.12.007',
        notes: 'Controlled vigilance and attention test paradigms.',
      },
    ],
  },
  ev_visual_anchor: {
    id: 'ev_visual_anchor',
    level: 'moderate',
    primaryOutcomes: ['spatial-distractibility', 'sustained-attention'],
    claimSummary:
      'Anchoring gaze on a single focal point for 30 to 60 seconds narrows spatial attention and dampens orienting reflex distractibility.',
    counterClaimOrCaveat:
      'Effects are acute and transient; best deployed immediately prior to focused work.',
    sources: [
      {
        id: 'posner_1980',
        citation:
          'Posner, M. I. (1980). Orienting of attention. Quarterly Journal of Experimental Psychology, 32(1), 3-25.',
        year: 1980,
        doiOrUrl: 'https://doi.org/10.1080/00335558008248231',
        notes: 'Foundational framework for attentional orienting networks.',
      },
    ],
  },
  ev_pink_brown_noise: {
    id: 'ev_pink_brown_noise',
    level: 'mixed',
    primaryOutcomes: ['sustained-attention'],
    claimSummary:
      'Continuous low-frequency soundscapes (pink and brown noise) mask unpredictable acoustic transients; effectiveness varies by individual baseline arousal.',
    counterClaimOrCaveat:
      'While beneficial for masking speech and for some inattentive states via stochastic resonance, high baseline arousal users may find continuous noise intrusive.',
    sources: [
      {
        id: 'soderlund_2007',
        citation:
          'Söderlund, G., Sikström, S., & Smart, N. (2007). Listen to the noise: noise is good for cognitive performance in ADHD. Journal of Child Psychology and Psychiatry, 48(8), 840-847.',
        year: 2007,
        doiOrUrl: 'https://doi.org/10.1111/j.1469-7610.2007.01749.x',
        notes: 'Moderate brain arousal model of stochastic resonance.',
      },
    ],
  },
  ev_workspace_declutter: {
    id: 'ev_workspace_declutter',
    level: 'moderate',
    primaryOutcomes: ['spatial-distractibility', 'cognitive-fatigue'],
    claimSummary:
      'Minimizing peripheral visual clutter reduces involuntary competition in visual cortical processing, lowering cognitive fatigue during visual tasks.',
    counterClaimOrCaveat:
      'Individual tolerance for spatial stimuli varies depending on habituation.',
    sources: [
      {
        id: 'mcmains_2011',
        citation:
          'McMains, S., & Kastner, S. (2011). Interactions of top-down and bottom-up mechanisms in human visual cortex. Journal of Neuroscience, 31(2), 587-597.',
        year: 2011,
        doiOrUrl: 'https://doi.org/10.1523/JNEUROSCI.3766-10.2011',
        notes: 'fMRI investigation of visual stimulus competition.',
      },
    ],
  },
  ev_myth_mozart: {
    id: 'ev_myth_mozart',
    level: 'not-supported',
    primaryOutcomes: ['working-memory'],
    claimSummary:
      'Scientific consensus disconfirms that listening to classical music enhances general intelligence or structural reasoning capabilities.',
    counterClaimOrCaveat:
      'Any observed temporary task enhancement is accounted for by brief arousal and positive mood shifts, obtainable from any preferred auditory stimulus.',
    sources: [
      {
        id: 'pietschnig_2010',
        citation:
          'Pietschnig, J., Voracek, M., & Formann, A. K. (2010). Mozart effect–Shmozart effect: A meta-analysis. Intelligence, 38(3), 314-323.',
        year: 2010,
        doiOrUrl: 'https://doi.org/10.1016/j.intell.2010.03.001',
        notes: 'Comprehensive meta-analysis of Mozart effect replication trials.',
      },
    ],
  },
  ev_myth_multitasking: {
    id: 'ev_myth_multitasking',
    level: 'not-supported',
    primaryOutcomes: ['task-switching-cost', 'sustained-attention'],
    claimSummary:
      'Simultaneous processing of multiple attention-demanding cognitive tasks without speed and error penalties is biologically unsupported.',
    counterClaimOrCaveat:
      'The brain sequentially switches attentional focus, incurring measurable switch costs in response time and error likelihood.',
    sources: [
      {
        id: 'monsell_2003',
        citation:
          'Monsell, S. (2003). Task switching. Trends in Cognitive Sciences, 7(3), 134-140.',
        year: 2003,
        doiOrUrl: 'https://doi.org/10.1016/S1364-6613(03)00028-7',
        notes: 'Comprehensive review of executive control and task-set reconfiguration.',
      },
    ],
  },
};

export function getEvidenceById(id: string): EvidenceRecord | undefined {
  return EVIDENCE_REGISTRY[id];
}
