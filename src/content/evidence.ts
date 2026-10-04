import type { Reference, EvidenceClaim } from './types';

/* ──────────────────────────────────────────────────────────────────────
 * References — citations copied verbatim from docs/EVIDENCE.md
 * ────────────────────────────────────────────────────────────────────── */

export const REFERENCES: Reference[] = [
  {
    id: 'albulescu2022',
    citation:
      'Albulescu P, Macsinga I, Rusu A, Sulea C, Bodnaru A, Tulbure BT (2022). "Give me a break!" A systematic review and meta-analysis on the efficacy of micro-breaks for increasing well-being and performance. PLOS ONE 17(8): e0272460.',
    link: 'https://doi.org/10.1371/journal.pone.0272460',
  },
  {
    id: 'biwer2023',
    citation:
      'Biwer F, et al. (2023). Understanding effort regulation: Comparing "Pomodoro" breaks and self-regulated breaks. British Journal of Educational Psychology 93(S2): 353-367. PMID 36859717',
  },
  {
    id: 'ariga2011',
    citation:
      'Ariga A, Lleras A (2011). Brief and rare mental "breaks" keep you focused: Deactivation and reactivation of task goals preempt vigilance decrements. Cognition 118(3): 439-443.',
    link: 'https://doi.org/10.1016/j.cognition.2010.12.007',
  },
  {
    id: 'behavsci2025',
    citation:
      'Self-regulated, Pomodoro and Flowtime break-taking among students. Behavioral Sciences 15(7): 861 (2025).',
    link: 'https://www.mdpi.com/2076-328X/15/7/861',
  },
  {
    id: 'behavsci2026',
    citation:
      'Systematic short (Pomodoro) versus self-regulated breaks: subjective experience and learning. Behavioral Sciences 16(7): 1158 (2026).',
    link: 'https://doi.org/10.3390/bs16071158',
  },
  {
    id: 'zainal2024',
    citation:
      'Zainal NH, Newman MG (2024). Mindfulness enhances cognitive functioning: a meta-analysis of 111 randomized controlled trials. Health Psychology Review 18(2): 369-395.',
    link: 'https://doi.org/10.1080/17437199.2023.2248222',
  },
  {
    id: 'goldberg2022',
    citation:
      'Goldberg SB, et al. (2022). The empirical status of mindfulness-based interventions: a systematic review of 44 meta-analyses of randomized controlled trials. Perspectives on Psychological Science.',
    link: 'https://doi.org/10.1177/1745691620968771',
  },
  {
    id: 'levinson2014',
    citation:
      'Levinson DB, Stoll EL, Kindy SD, Merry HL, Davidson RJ (2014). A mind you can count on: validating breath counting as a behavioral measure of mindfulness. Frontiers in Psychology 5: 1202.',
  },
  {
    id: 'balban2023',
    citation:
      'Balban MY, Neri E, Kogon MM, Weed L, Nouriani B, Jo B, Holl G, Zeitzer JM, Spiegel D, Huberman AD (2023). Brief structured respiration practices enhance mood and reduce physiological arousal. Cell Reports Medicine 4(1): 100895.',
    link: 'https://doi.org/10.1016/j.xcrm.2022.100895',
  },
  {
    id: 'lee2015',
    citation:
      'Lee KE, Williams KJH, Sargent LD, Williams NSG, Johnson KA (2015). 40-second green roof views sustain attention: The role of micro-breaks in attention restoration. Journal of Environmental Psychology 42: 182-189.',
  },
  {
    id: 'ohly2016',
    citation:
      'Ohly H, White MP, Wheeler BW, Bethel A, Ukoumunne OC, Nikolaou V, Garside R (2016). Attention Restoration Theory: A systematic review of the attention restoration potential of exposure to natural environments. Journal of Toxicology and Environmental Health B 19(7): 305-343.',
    link: 'https://doi.org/10.1080/10937404.2016.1196155',
  },
  {
    id: 'stevenson2018',
    citation:
      'Stevenson MP, Schilhab T, Bentsen P (2018). Attention Restoration Theory II: a systematic review to clarify attention processes affected by exposure to natural environments. Journal of Toxicology and Environmental Health B 21(4): 227-268.',
    link: 'https://doi.org/10.1080/10937404.2018.1505571',
  },
  {
    id: 'moreau2019',
    citation:
      'Moreau D, Chou E (2019). The acute effect of high-intensity exercise on executive function: a meta-analysis. Perspectives on Psychological Science 14(5): 734-764.',
    link: 'https://doi.org/10.1177/1745691619850568',
  },
  {
    id: 'chang2012',
    citation:
      'Chang YK, Labban JD, Gapin JI, Etnier JL (2012). The effects of acute exercise on cognitive performance: a meta-analysis. Brain Research 1453: 87-101.',
  },
  {
    id: 'castelo2025',
    citation:
      'Castelo N, Esterman M, Kushlev K, Reiner PB, Ward AF (2025). Blocking mobile internet on smartphones improves sustained attention, mental health, and subjective well-being. PNAS Nexus 4(2): pgaf017.',
    link: 'https://academic.oup.com/pnasnexus/article/4/2/pgaf017/8016017',
  },
  {
    id: 'ward2017',
    citation:
      'Ward AF, Duke K, Gneezy A, Bos MW (2017). Brain drain: The mere presence of one\'s own smartphone reduces available cognitive capacity. Journal of the Association for Consumer Research 2(2): 140-154.',
  },
  {
    id: 'gollwitzer2006',
    citation:
      'Gollwitzer PM, Sheeran P (2006). Implementation intentions and goal achievement: a meta-analysis of effects and processes. Advances in Experimental Social Psychology 38: 69-119.',
  },
  {
    id: 'lim2010',
    citation:
      'Lim J, Dinges DF (2010). A meta-analysis of the impact of short-term sleep deprivation on cognitive variables. Psychological Bulletin 136(3): 375-389.',
  },
  {
    id: 'basner2011sleep',
    citation:
      'Basner M, Dinges DF (2011). Maximizing sensitivity of the Psychomotor Vigilance Test (PVT) to sleep loss. Sleep 34(5): 581-591.',
    link: 'https://doi.org/10.1093/sleep/34.5.581',
  },
  {
    id: 'nigg2024',
    citation:
      'Nigg JT, et al. (2024). Systematic review and meta-analysis: do white noise or pink noise help with task performance in youth with ADHD or with elevated attention problems? PubMed Central PMC11283987',
  },
  {
    id: 'garciaargibay2019',
    citation:
      'Garcia-Argibay M, Santed MA, Reales JM (2019). Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis. Psychological Research 83(2): 357-372.',
    link: 'https://doi.org/10.1007/s00426-018-1066-8',
  },
  {
    id: 'binaural2023',
    citation:
      'Potential of binaural beats intervention for improving memory and attention: insights from meta-analysis and systematic review. Psychological Research 87(4): 951-963 (2023). PMID 35842538',
  },
  {
    id: 'melbylervag2016',
    citation:
      'Melby-Lervåg M, Redick TS, Hulme C (2016). Working memory training does not improve performance on measures of intelligence or other measures of "far transfer". Perspectives on Psychological Science 11(4): 512-534.',
  },
  {
    id: 'simons2016',
    citation:
      'Simons DJ, et al. (2016). Do "brain-training" programs work? Psychological Science in the Public Interest 17(3): 103-186.',
  },
  {
    id: 'ara2025',
    citation:
      'Ara Z, et al. (2025). You are not alone: designing body doubling for ADHD in virtual reality (n=12 preprint). arXiv:2509.12153',
  },
  {
    id: 'mark2008',
    citation:
      'Mark G, Gudith D, Klocke U (2008). The cost of interrupted work: more speed and stress. Proceedings of CHI \'08: 107-110.',
  },
  {
    id: 'leroy2009',
    citation:
      'Leroy S (2009). Why is it so hard to do my work? The challenge of attention residue when switching between work tasks. Organizational Behavior and Human Decision Processes 109(2): 168-181.',
  },
  {
    id: 'basner2011pvtb',
    citation:
      'Basner M, Mollicone D, Dinges DF (2011). Validity and sensitivity of a brief psychomotor vigilance test (PVT-B) to total and partial sleep deprivation. Acta Astronautica 69(11-12): 949-959.',
    link: 'https://doi.org/10.1016/j.actaastro.2011.07.015',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 * Claims — exactly 16 claims from docs/EVIDENCE.md (same ids, same tiers)
 * ────────────────────────────────────────────────────────────────────── */

export const CLAIMS: EvidenceClaim[] = [
  {
    id: 'breaks-energy',
    title: 'Short Breaks Between Work Blocks',
    tier: 'moderate',
    outcome: 'vigor and fatigue',
    summary:
      'A 2022 meta-analysis of 22 studies found breaks of 10 minutes or less gave small boosts in vigor and small reductions in fatigue.',
    caveat: 'Mostly student and workplace studies; measured effects are small.',
    refIds: ['albulescu2022'],
  },
  {
    id: 'breaks-performance',
    title: 'Break Ratios and Task Performance',
    tier: 'mixed',
    outcome: 'task performance and concentration',
    summary:
      'Meta-analysis found no clear overall gain in performance from micro-breaks. Studies on fixed 25/5 versus self-paced breaks show conflicting results; no ratio is proven best.',
    caveat: 'No work/break ratio is proven best. Keep timers flexible.',
    refIds: ['albulescu2022', 'biwer2023', 'ariga2011', 'behavsci2025', 'behavsci2026'],
  },
  {
    id: 'focused-attention',
    title: 'Focused-Attention Practice (Breath Counting)',
    tier: 'moderate',
    outcome: 'sustained attention and executive attention',
    summary:
      'A 2024 meta-analysis found multi-week mindfulness programs had small-to-moderate effects on sustained attention, executive attention, and working-memory accuracy versus active controls.',
    caveat: 'Evidence comes from multi-week programs; effects of a single short session are much less certain.',
    refIds: ['zainal2024', 'goldberg2022', 'levinson2014'],
  },
  {
    id: 'breathwork-mood',
    title: 'Cyclic Sighing and Box Breathing',
    tier: 'moderate',
    outcome: 'mood and physiological arousal',
    summary:
      'In a one-month study, 5 minutes a day of breathing exercises improved mood and lowered anxiety; exhale-focused cyclic sighing lowered breathing rate more than mindfulness meditation.',
    caveat: 'Outcomes were mood and arousal, not attention. Pacing seconds are app defaults, not from the study.',
    refIds: ['balban2023'],
  },
  {
    id: 'nature-attention',
    title: 'A 40-Second Nature View',
    tier: 'mixed',
    outcome: 'sustained attention',
    summary:
      'In one experiment, a 40-second view of a green roof led to fewer errors on a sustained-attention task. Broader reviews show mixed effects across different attention types.',
    caveat: 'Studied in lab tasks with simulated views. Real views were not tested; effects are small.',
    refIds: ['lee2015', 'ohly2016', 'stevenson2018'],
  },
  {
    id: 'movement',
    title: 'A Short Bout of Exercise',
    tier: 'moderate',
    outcome: 'executive function',
    summary:
      'Meta-analyses show a single bout of exercise has a small temporary positive effect on executive function, with little difference between high and moderate intensity.',
    caveat: 'Bout lengths vary across studies; shorter bouts are less studied. Check that it suits your health.',
    refIds: ['moreau2019', 'chang2012'],
  },
  {
    id: 'phone-blocking',
    title: 'Blocking Mobile Internet',
    tier: 'moderate',
    outcome: 'sustained attention, mental health and well-being',
    summary:
      'In a randomized trial of 467 people, blocking mobile internet on phones for two weeks improved objectively measured sustained attention, mental health, and well-being.',
    caveat: 'Mobile internet was completely blocked, not just phone put away. Replication is still needed.',
    refIds: ['castelo2025'],
  },
  {
    id: 'phone-presence',
    title: 'A Phone Merely Nearby',
    tier: 'mixed',
    outcome: 'attention and working memory',
    summary:
      'Earlier lab reports found having a phone nearby reduced cognitive capacity, but follow-up studies have not always replicated this effect.',
    caveat: 'Treat putting your phone out of sight as a habit to test, not a proven fix.',
    refIds: ['ward2017', 'castelo2025'],
  },
  {
    id: 'if-then',
    title: '"If X Happens, I Will Y" Plans',
    tier: 'strong',
    outcome: 'goal follow-through',
    summary:
      'A large meta-analysis found that making specific "if X happens, I will Y" plans helps people start and carry out intended actions, with a medium-to-large effect.',
    caveat: 'Evidence is for goal attainment, not for improving the ability to concentrate.',
    refIds: ['gollwitzer2006'],
  },
  {
    id: 'sleep',
    title: 'Sleep and Alertness',
    tier: 'strong',
    outcome: 'attention lapses and alertness',
    summary:
      'Meta-analytic evidence shows short-term sleep loss reliably worsens attention and alertness, with large increases in lapses on vigilance tasks.',
    caveat: 'Individual sensitivity to sleep loss varies widely across people.',
    refIds: ['lim2010', 'basner2011sleep'],
  },
  {
    id: 'noise',
    title: 'White and Pink Noise',
    tier: 'mixed',
    outcome: 'attention-task performance',
    summary:
      'A meta-analysis found continuous white or pink noise gave a small benefit for youth with ADHD or elevated attention problems, but a small negative effect for others.',
    caveat: 'Lab tasks in children and young adults; no studies evaluated brown noise. Test on yourself.',
    refIds: ['nigg2024'],
  },
  {
    id: 'binaural',
    title: 'Binaural Beats',
    tier: 'mixed',
    outcome: 'memory and attention',
    summary:
      'Meta-analyses report average effects on cognition and anxiety, but individual studies conflict, especially when comparing different brainwave frequencies.',
    caveat: 'Results depend on frequency, volume, and timing. More robust trials are needed.',
    refIds: ['garciaargibay2019', 'binaural2023'],
  },
  {
    id: 'brain-training',
    title: 'Brain-Training Games',
    tier: 'not-supported',
    outcome: 'transfer to everyday attention or intelligence',
    summary:
      'A meta-analysis of 87 publications found working-memory games improve trained tasks, but show no convincing transfer to broader intelligence or everyday attention against active controls.',
    caveat: 'FocusLab uses reaction tasks solely to measure, never to claim brain-training benefits.',
    refIds: ['melbylervag2016', 'simons2016'],
  },
  {
    id: 'body-doubling',
    title: 'Working Alongside Another Person',
    tier: 'emerging',
    outcome: 'starting and sustaining tasks',
    summary:
      'Many people report that working alongside another person helps them start and sustain tasks, but controlled experimental evidence remains very limited.',
    caveat: 'Supported mostly by surveys and clinical consensus; not an ADHD treatment.',
    refIds: ['ara2025'],
  },
  {
    id: 'multitasking',
    title: 'Task Switching and Interruptions',
    tier: 'moderate',
    outcome: 'cost of switching',
    summary:
      'Interrupted work leads to more stress and effort. Unfinished tasks leave "attention residue" that measurably slows down and impairs performance on the next task.',
    caveat: 'Mostly lab and observational workplace studies; individual effect sizes vary.',
    refIds: ['mark2008', 'leroy2009'],
  },
  {
    id: 'pvt-check',
    title: 'Brief Reaction-Time Test as a Measurement',
    tier: 'moderate',
    outcome: 'detecting sleep-loss-related lapses in alertness',
    summary:
      'A 3-minute brief Psychomotor Vigilance Test was designed to match the sensitivity of the standard 10-minute lab test to sleep loss.',
    caveat: 'Web browser timing adds noise. Compare only with yourself on the same device.',
    refIds: ['basner2011pvtb'],
  },
];

export function getClaimById(id: string): EvidenceClaim | undefined {
  return CLAIMS.find((c) => c.id === id);
}

export function getReferenceById(id: string): Reference | undefined {
  return REFERENCES.find((r) => r.id === id);
}
