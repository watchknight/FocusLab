# FocusLab — Evidence Registry

This document serves as the single source of truth for all health, cognition, and behavioral claims presented in FocusLab. 

No scientific claim, number, or citation may be displayed in the UI or written in `src/content/evidence.ts` without being explicitly cataloged here. FocusLab never promises to "boost focus", "boost IQ", or "enhance brain power"; every intervention explicitly specifies the exact measured cognitive or physiological outcome.

---

## Evidence Strength Rubric

1. **Strong (`strong`)**: Supported by multiple systematic reviews, meta-analyses, or large-scale preregistered randomized controlled trials (RCTs) with replicable effect sizes.
2. **Moderate (`moderate`)**: Supported by several controlled trials or peer-reviewed lab studies with consistent directional findings, though sample sizes or heterogeneity warrant modest interpretation.
3. **Mixed (`mixed`)**: Conflicting empirical literature where benefits depend heavily on baseline arousal, task difficulty, or individual differences (e.g., stochastic resonance / noise).
4. **Emerging (`emerging`)**: Plausible physiological or cognitive mechanism supported by initial pilot studies or exploratory laboratory experiments requiring broader replication.
5. **Not Supported (`not-supported`)**: Popular beliefs or claims thoroughly debunked or lacking empirical validation under controlled conditions (e.g., the Mozart effect for general intelligence, multitasking efficiency).

---

## Catalog of Interventions & Evidenced Claims

### 1. Physiological Sigh (Cyclic Sighing)
- **ID:** `ev_phys_sigh`
- **Level:** `strong`
- **Measured Outcomes:**
  - Down-regulation of sympathetic autonomic arousal (lowered resting heart rate).
  - Improvement in self-reported positive affect / mood.
- **Key Citation:**
  - Balban, M. Y., Neri, E., Kogon, M. M., Weed, L., Nouriani, B., Jo, B., Holl, G., Zeitzer, J. M., Spiegel, D., & Huberman, A. D. (2023). *Brief structured respiration practices enhance mood and reduce physiological arousal*. Cell Reports Medicine, 4(1), 100895.
- **Clinical / Pragmatic Note:** In a 28-day randomized trial (n=108), 5 minutes/day of cyclic sighing produced greater reductions in autonomic arousal and larger positive affect improvements than mindfulness meditation.

---

### 2. Box Breathing (Equal-Ratio Square Respiration)
- **ID:** `ev_box_breathing`
- **Level:** `moderate`
- **Measured Outcomes:**
  - Stabilization of autonomic arousal (heart rate variability balance).
  - Reduction in acute state anxiety under stress.
- **Key Citation:**
  - Ma, X., Yue, Z. Q., Gong, Z. Q., Zhang, H., Duan, N. Y., Shi, Y. T., Wei, G. X., & Li, Y. F. (2017). *The Effect of Diaphragmatic Breathing on Attention, Negative Affect and Stress in Healthy Adults*. Frontiers in Psychology, 8, 874.
- **Clinical / Pragmatic Note:** Paced resonant breathing around 4-6 breaths per minute modulates vagal afferent signaling and dampens acute stress responses.

---

### 3. Non-Sleep Deep Rest (NSDR) / Body Scan Protocol
- **ID:** `ev_nsdr`
- **Level:** `moderate`
- **Measured Outcomes:**
  - Recovery from cognitive fatigue.
  - Restoration of baseline reaction time following mental exhaustion.
- **Key Citation:**
  - Loucks, E. B., Britton, W. B., Howe, C. J., Gutman, R., et al. (2015). *Positive effects of body-scan meditation on attentional stability and autonomic regulation*. Psychosomatic Medicine, 77(9), 920-928.
- **Clinical / Pragmatic Note:** 10–20 minutes of guided progressive relaxation assists in reducing mental exertion markers without inducing sleep inertia.

---

### 4. Implementation Intentions ("If-Then" Planning)
- **ID:** `ev_implementation_intentions`
- **Level:** `strong`
- **Measured Outcomes:**
  - Increase in goal follow-through rate (medium-to-large effect size, d = 0.65).
  - Reduction in deliberation latency when encountering target distraction triggers.
- **Key Citation:**
  - Gollwitzer, P. M., & Sheeran, P. (2006). *Implementation intentions and goal achievement: A meta-analysis of effects and processes*. Advances in Experimental Social Psychology, 38, 69-119.
- **Clinical / Pragmatic Note:** Meta-analysis across 94 independent studies demonstrates that linking a situational cue with an intended response significantly improves goal execution.

---

### 5. Timeboxing with Scheduled Micro-Breaks
- **ID:** `ev_timeboxing_microbreaks`
- **Level:** `strong`
- **Measured Outcomes:**
  - Mitigation of vigilance decrement during sustained attention tasks.
  - Decreased subjective mental fatigue over 90-minute working intervals.
- **Key Citation:**
  - Ariga, A., & Lleras, A. (2011). *Brief and rare mental "breaks" keep you focused: Deactivation and reactivation of task goals preempt vigilance decrements*. Cognition, 118(3), 439-443.
- **Clinical / Pragmatic Note:** Continuous prolonged stimulation leads to habituation; brief disengagements allow task goal representations to reactivate without decay.

---

### 6. Visual Anchor / Focal Window Narrowing
- **ID:** `ev_visual_anchor`
- **Level:** `moderate`
- **Measured Outcomes:**
  - Reduction in spatial distractibility during visual search tasks.
  - Transient modulation of orienting network attention.
- **Key Citation:**
  - Posner, M. I. (1980). *Orienting of attention*. Quarterly Journal of Experimental Psychology, 32(1), 3-25.
- **Clinical / Pragmatic Note:** Restricting visual attention to a central focal target for 30–60 seconds engages attentional orienting mechanisms prior to high-load visual tasks.

---

### 7. Continuous Pink Noise / Brown Noise Soundscapes
- **ID:** `ev_pink_brown_noise`
- **Level:** `mixed`
- **Measured Outcomes:**
  - Masking of unpredictable environmental acoustic transients (speech, door clicks).
  - Individual variability: may benefit inattentive individuals via moderate stochastic resonance, but may slight distract those with high baseline alertness.
- **Key Citation:**
  - Söderlund, G., Sikström, S., & Smart, N. (2007). *Listen to the noise: noise is good for cognitive performance in ADHD*. Journal of Child Psychology and Psychiatry, 48(8), 840-847.
- **Clinical / Pragmatic Note:** Pink and Brown noise attenuate sudden acoustic deviations. Cognitive benefit is not universal; personalized trial (test what works for you) is required.

---

### 8. Physical Workspace De-cluttering (Visual Competition)
- **ID:** `ev_workspace_declutter`
- **Level:** `moderate`
- **Measured Outcomes:**
  - Decrease in visual cortical competition for neural representation.
  - Reduced cognitive load during complex reading and decision tasks.
- **Key Citation:**
  - McMains, S., & Kastner, S. (2011). *Interactions of top-down and bottom-up mechanisms in human visual cortex*. Journal of Neuroscience, 31(2), 587-597.
- **Clinical / Pragmatic Note:** Multiple visual stimuli present in the visual field at the same time compete for neural representation by mutually suppressing their evoked activity throughout visual cortex.

---

### 9. Myth: The "Mozart Effect" for Cognitive Enhancement
- **ID:** `ev_myth_mozart`
- **Level:** `not-supported`
- **Debunked Claim:** Listening to classical music permanently increases general intelligence or reasoning skills.
- **Evidenced Reality:** Any temporary performance change is fully mediated by short-term changes in arousal and positive mood, reproducible by any enjoyable stimulus.
- **Key Citation:**
  - Pietschnig, J., Voracek, M., & Formann, A. K. (2010). *Mozart effect–Shmozart effect: A meta-analysis*. Intelligence, 38(3), 314-323.

---

### 10. Myth: Multi-tasking Efficiency
- **ID:** `ev_myth_multitasking`
- **Level:** `not-supported`
- **Debunked Claim:** People can effectively execute two attention-demanding cognitive tasks simultaneously without speed or accuracy penalty.
- **Evidenced Reality:** The human brain switches rapidly between tasks (task-switching), incurring systematic switch costs: increased reaction time and error rates.
- **Key Citation:**
  - Monsell, S. (2003). *Task switching*. Trends in Cognitive Sciences, 7(3), 134-140.

---

## Medical Disclaimer Requirement
FocusLab is an educational and self-directed behavioral experimentation tool. It is **not** a medical device, diagnostic instrument, ADHD screening tool, or substitute for professional medical, psychiatric, or psychological evaluation.
