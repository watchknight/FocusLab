import type { Reference, EvidenceClaim } from './types';

/* ──────────────────────────────────────────────────────────────────────
 * References — citations copied verbatim from docs/EVIDENCE.md
 * ────────────────────────────────────────────────────────────────────── */

export const REFERENCES: Reference[] = [
  {
    id: 'balban-2023',
    citation:
      'Balban, M. Y., Neri, E., Kogon, M. M., Weed, L., Nouriani, B., Jo, B., Holl, G., Zeitzer, J. M., Spiegel, D., & Huberman, A. D. (2023). Brief structured respiration practices enhance mood and reduce physiological arousal. Cell Reports Medicine, 4(1), 100895.',
  },
  {
    id: 'ma-2017',
    citation:
      'Ma, X., Yue, Z. Q., Gong, Z. Q., Zhang, H., Duan, N. Y., Shi, Y. T., Wei, G. X., & Li, Y. F. (2017). The Effect of Diaphragmatic Breathing on Attention, Negative Affect and Stress in Healthy Adults. Frontiers in Psychology, 8, 874.',
  },
  {
    id: 'loucks-2015',
    citation:
      'Loucks, E. B., Britton, W. B., Howe, C. J., Gutman, R., et al. (2015). Positive effects of body-scan meditation on attentional stability and autonomic regulation. Psychosomatic Medicine, 77(9), 920-928.',
  },
  {
    id: 'gollwitzer-2006',
    citation:
      'Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. Advances in Experimental Social Psychology, 38, 69-119.',
  },
  {
    id: 'ariga-2011',
    citation:
      'Ariga, A., & Lleras, A. (2011). Brief and rare mental "breaks" keep you focused: Deactivation and reactivation of task goals preempt vigilance decrements. Cognition, 118(3), 439-443.',
  },
  {
    id: 'posner-1980',
    citation:
      'Posner, M. I. (1980). Orienting of attention. Quarterly Journal of Experimental Psychology, 32(1), 3-25.',
  },
  {
    id: 'soderlund-2007',
    citation:
      'Söderlund, G., Sikström, S., & Smart, N. (2007). Listen to the noise: noise is good for cognitive performance in ADHD. Journal of Child Psychology and Psychiatry, 48(8), 840-847.',
  },
  {
    id: 'mcmains-2011',
    citation:
      'McMains, S., & Kastner, S. (2011). Interactions of top-down and bottom-up mechanisms in human visual cortex. Journal of Neuroscience, 31(2), 587-597.',
  },
  {
    id: 'pietschnig-2010',
    citation:
      'Pietschnig, J., Voracek, M., & Formann, A. K. (2010). Mozart effect–Shmozart effect: A meta-analysis. Intelligence, 38(3), 314-323.',
  },
  {
    id: 'monsell-2003',
    citation:
      'Monsell, S. (2003). Task switching. Trends in Cognitive Sciences, 7(3), 134-140.',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 * Claims — one per claim id in docs/EVIDENCE.md (same ids, same tiers),
 * plus additional claims referenced by activities and myths.
 * ────────────────────────────────────────────────────────────────────── */

export const CLAIMS: EvidenceClaim[] = [
  /* ── Claims from docs/EVIDENCE.md (same ids, same tiers) ─────────── */
  {
    id: 'ev_phys_sigh', title: 'Cyclic Sighing',
    tier: 'strong', outcome: 'self-reported mood and autonomic arousal',
    summary:
      'In one 28-day trial (n = 108), five minutes of daily cyclic sighing reduced resting heart rate and improved positive mood more than mindfulness meditation.',
    caveat: 'One trial with 108 participants. Long-term effects need more study.',
    refIds: ['balban-2023'],
  },
  {
    id: 'ev_box_breathing', title: 'Box Breathing',
    tier: 'moderate', outcome: 'autonomic arousal and state anxiety',
    summary:
      'Paced breathing at about four to six breaths per minute may help stabilize heart-rate variability and reduce acute anxiety in healthy adults.',
    caveat: 'Most studies are small and short-term.',
    refIds: ['ma-2017'],
  },
  {
    id: 'ev_nsdr', title: 'Non-Sleep Deep Rest (Body Scan)',
    tier: 'moderate', outcome: 'cognitive fatigue recovery',
    summary:
      'A guided body-scan relaxation may help restore attentional steadiness and reaction time after mental exhaustion, without causing sleep grogginess.',
    caveat: 'Does not replace proper sleep. Evidence from limited studies.',
    refIds: ['loucks-2015'],
  },
  {
    id: 'ev_implementation_intentions', title: 'If-Then Planning',
    tier: 'strong', outcome: 'goal follow-through',
    summary:
      'A meta-analysis of 94 studies found that pre-set "if X happens, then I will do Y" plans increased goal completion with a medium-to-large effect (d = 0.65).',
    caveat: 'Works best when you can recognize the trigger situation.',
    refIds: ['gollwitzer-2006'],
  },
  {
    id: 'ev_timeboxing_microbreaks', title: 'Brief Breaks During Sustained Work',
    tier: 'strong', outcome: 'sustained attention and subjective fatigue',
    summary:
      'In lab tasks, brief mental breaks during long work periods prevented the usual decline in sustained attention that comes from working without pausing.',
    caveat: 'Lab conditions differ from real work. Ideal break timing is not established.',
    refIds: ['ariga-2011'],
  },
  {
    id: 'ev_visual_anchor', title: 'Visual Anchor (Focal Point)',
    tier: 'moderate', outcome: 'spatial distractibility',
    summary:
      'Holding gaze on a single point for 30–60 seconds may temporarily reduce spatial distractibility in visual tasks by engaging attentional orienting.',
    caveat: 'Effect is brief and transient, studied mainly in lab visual-search tasks.',
    refIds: ['posner-1980'],
  },
  {
    id: 'ev_pink_brown_noise', title: 'Continuous Background Noise',
    tier: 'mixed', outcome: 'distraction masking and sustained attention',
    summary:
      'Pink or brown noise may mask sudden sounds. Some evidence suggests a benefit for inattentive individuals, but results vary and are not consistent across studies.',
    caveat: 'Not universal. People with high baseline alertness may find noise distracting.',
    refIds: ['soderlund-2007'],
  },
  {
    id: 'ev_workspace_declutter', title: 'Workspace Visual Decluttering',
    tier: 'moderate', outcome: 'cognitive load and visual processing',
    summary:
      'Objects in your visual field compete for neural representation. Reducing visible clutter may lower cognitive load during reading or complex decisions.',
    caveat: 'Tested with controlled displays, not real desks. Tolerance varies.',
    refIds: ['mcmains-2011'],
  },
  {
    id: 'ev_myth_mozart', title: 'Mozart Effect for Intelligence',
    tier: 'not-supported', outcome: 'general intelligence',
    summary:
      'A meta-analysis found no reliable evidence that listening to Mozart raises general intelligence. Short-term task gains are explained by mood and arousal from any pleasant stimulus.',
    caveat: 'Enjoying music may briefly lift mood, but that is not a lasting cognitive change.',
    refIds: ['pietschnig-2010'],
  },
  {
    id: 'ev_myth_multitasking', title: 'Multitasking Efficiency',
    tier: 'not-supported', outcome: 'task-switching speed and accuracy',
    summary:
      'The brain does not truly do two demanding tasks at once. It switches between them, causing measurable increases in reaction time and errors.',
    caveat: 'Applies to attention-demanding tasks; simple automatic actions can overlap.',
    refIds: ['monsell-2003'],
  },

  /* ── Additional claims referenced by activities ──────────────────── */
  {
    id: 'breathwork-mood', title: 'Slow Structured Breathing for Mood',
    tier: 'moderate', outcome: 'self-reported mood and autonomic arousal',
    summary:
      'Controlled breathing techniques may lower resting heart rate and improve short-term mood. One trial found cyclic sighing outperformed meditation for mood.',
    caveat: 'Individual responses vary. Trial durations were short.',
    refIds: ['balban-2023', 'ma-2017'],
  },
  // TODO(evidence): Add peer-reviewed citation for breath-counting attention training to docs/EVIDENCE.md
  {
    id: 'focused-attention', title: 'Breath Counting as Attention Practice',
    tier: 'emerging', outcome: 'attentional control',
    summary:
      'Counting each exhale as an anchor may train attentional control, but direct controlled evidence for this specific practice is limited.',
    caveat: 'No specific controlled trial in our evidence registry yet.',
    refIds: [],
  },
  // TODO(evidence): Add peer-reviewed citation for brief nature exposure to docs/EVIDENCE.md
  {
    id: 'nature-attention', title: 'Brief Nature Exposure',
    tier: 'emerging', outcome: 'attentional restoration',
    summary:
      'Brief exposure to natural scenes may support attentional recovery, but our evidence registry does not yet include a specific controlled study.',
    caveat: 'No nature-exposure study in our evidence registry yet.',
    refIds: [],
  },
  // TODO(evidence): Add peer-reviewed citation for brief exercise bouts to docs/EVIDENCE.md
  {
    id: 'movement', title: 'Brief Physical Movement',
    tier: 'emerging', outcome: 'alertness and subjective energy',
    summary:
      'Short bouts of moderate movement may increase alertness and reduce fatigue, but our evidence registry does not yet include a specific study.',
    caveat: 'No exercise study in our evidence registry yet.',
    refIds: [],
  },
  {
    id: 'breaks-energy', title: 'Quiet Rest Breaks',
    tier: 'strong', outcome: 'sustained attention and subjective energy',
    summary:
      'Brief disengagement from a task may prevent the vigilance decline seen during prolonged concentration, helping maintain attention and reduce fatigue.',
    caveat: 'Lab conditions differ from real work. Ideal break length is not established.',
    refIds: ['ariga-2011'],
  },

  /* ── Additional claims referenced by myths ───────────────────────── */
  // TODO(evidence): Add peer-reviewed citation for brain-training transfer to docs/EVIDENCE.md
  {
    id: 'brain-training', title: 'Brain-Training Games',
    tier: 'not-supported', outcome: 'general cognitive ability',
    summary:
      'Brain-training games may improve scores on the trained task but have not shown reliable transfer to general thinking skills in controlled studies.',
    caveat: 'No brain-training study in our evidence registry yet.',
    refIds: [],
  },
  // TODO(evidence): Add peer-reviewed citation for binaural beats to docs/EVIDENCE.md
  {
    id: 'binaural-beats', title: 'Binaural Beats',
    tier: 'not-supported', outcome: 'attention or cognitive performance',
    summary:
      'Claims that binaural beats enhance attention or creativity lack consistent support from controlled trials.',
    caveat: 'No binaural-beats study in our evidence registry yet.',
    refIds: [],
  },
  // TODO(evidence): Add peer-reviewed citation for phone-presence effects to docs/EVIDENCE.md
  {
    id: 'phone-distraction', title: 'Phone Presence and Cognitive Capacity',
    tier: 'mixed', outcome: 'available cognitive capacity',
    summary:
      'A visible phone may reduce available cognitive capacity for some people, but the effect depends on context and individual phone habits.',
    caveat: 'No phone-distraction study in our evidence registry yet.',
    refIds: [],
  },
];

export function getClaimById(id: string): EvidenceClaim | undefined {
  return CLAIMS.find((c) => c.id === id);
}

export function getReferenceById(id: string): Reference | undefined {
  return REFERENCES.find((r) => r.id === id);
}
