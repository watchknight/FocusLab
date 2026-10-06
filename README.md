# FocusLab

FocusLab is a free, open-source, local-first web application that helps people build sustained focus through evidence-labelled cognitive practices and test what works for them using reaction-time benchmarks (**Check → Practice → Compare**).

There are no user accounts, no analytics, no external tracking, and no servers. All personal data stays directly in your browser.

---

## What FocusLab Is

Most productivity tools rely on subjective impression or pseudoscientific "brain-training" games. FocusLab takes an empirical approach:

1. **Check (Reaction-Time Baseline)**: Measure sustained vigilance, reaction speed, and attention lapses via a 3-minute Psychomotor Vigilance Task (PVT-B) benchmark in your browser.
2. **Practice (Evidence-Labelled Tools)**: Engage in structured focus sessions with implementation intentions (If-Then planning), guided breath pacing, movement bouts, and synthetically generated soundscapes—each explicitly labelled with its empirical evidence tier.
3. **Compare (A/B Self-Experiments)**: Run controlled alternating A/B self-experiments comparing active interventions against quiet rest or ambient noise against silence to discover what measurably moves your personal needle.

> **Medical Disclaimer**: FocusLab is an educational self-experimentation tool, not a diagnostic or therapeutic medical device. It does not provide medical advice or screen for ADHD or neurological conditions.

---

## How Evidence Is Rated

Every health or cognition claim shown to users comes strictly from [`docs/EVIDENCE.md`](./docs/EVIDENCE.md) and [`src/content/evidence.ts`](./src/content/evidence.ts). FocusLab never claims an intervention "boosts IQ" or "enhances focus" generally; every claim explicitly names the exact outcome for which evidence exists (e.g., *vigor and fatigue*, *sustained attention*, *physiological arousal*).

Claims are classified into five transparent tiers, displayed with both an icon and text:

| Tier | Label | Criteria |
| :--- | :--- | :--- |
| **Strong** | High-Replication | Multiple independent, pre-registered randomized controlled trials or high-quality meta-analyses with consistent positive effects on the named outcome. |
| **Moderate** | Supported | Multi-trial controlled studies or replicated findings with small-to-medium effect sizes on the named outcome. |
| **Mixed** | Conflicting / Context-Dependent | Replicated studies showing differing or contradictory results depending on user baseline, cognitive style, or task demands. |
| **Emerging** | Preliminary | Single peer-reviewed pilot trials or laboratory investigations with small cohorts requiring further replication. |
| **Not Supported** | Debunked / Ineffective | Rigorous trials or systematic reviews demonstrating no meaningful effect beyond expectancy or placebo. |

---

## Getting Started

### Prerequisites
- Node.js 18.17.0 or higher
- npm 9.0.0 or higher

### Installation & Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/watchknight/FocusLab.git
   cd FocusLab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quality Verification Commands

Before committing changes, ensure all quality gates pass:

```bash
# Run ESLint checks
npm run lint

# Run strict TypeScript compilation check
npm run typecheck

# Run unit tests via Vitest
npm test

# Build production Next.js bundle and verify static page generation
npm run build
```

---

## How to Add an Activity or Claim

FocusLab enforces strict research integrity: no code component hardcodes empirical claims from memory.

### 1. Document the Research
1. Add the peer-reviewed citation, sample size, methodology, and observed effect size to [`docs/EVIDENCE.md`](./docs/EVIDENCE.md).
2. Note both the specific outcome and practical caveats (e.g., student samples, multi-week requirement).

### 2. Register the Claim in Content
Add the claim entry and its literature references to [`src/content/evidence.ts`](./src/content/evidence.ts):

```typescript
{
  id: 'your-claim-id',
  title: 'Descriptive Practice Title',
  tier: 'moderate', // 'strong' | 'moderate' | 'mixed' | 'emerging' | 'not-supported'
  outcome: 'exact evidenced outcome (e.g. sustained attention)',
  summary: 'One or two sentences summarizing the meta-analytic or trial findings.',
  caveat: 'Explicit boundary conditions, limitations, or sample constraints.',
  refIds: ['author2024'],
}
```

### 3. Add the Activity Entry
Add the activity to [`src/content/activities.ts`](./src/content/activities.ts), linking it to your claim ID:

```typescript
{
  id: 'your-activity-id',
  name: 'Activity Name',
  category: 'breathwork', // 'breathwork' | 'movement' | 'environment' | 'rest'
  evidenceId: 'your-claim-id',
  durationOptionsSec: [180, 300, 600],
  whenToUse: 'Concrete situation when this activity is appropriate.',
  steps: [
    'Step 1 instructions.',
    'Step 2 instructions.',
  ],
  cautions: ['Physical safety precautions or contraindications.'],
}
```

### 4. Implement Guided Player (If Applicable)
If the activity includes interactive guidance (timers, visual pacer), create a player component under `src/features/activities/players/` wrapped inside `PlayerShell` to inherit accessibility controls (Esc to exit, pause/resume, reduced-motion fallback, audio cues).

---

## Privacy & Local-First Architecture

- **No Remote Backend**: FocusLab operates completely offline. No user data is sent over the network.
- **Zero Third-Party Telemetry**: No Google Analytics, no trackers, no cookies, no third-party CDNs, and no external web fonts.
- **Client Storage**: All tests, sessions, logs, and experiment schedules reside in local browser storage (`localStorage` key `focuslab:v1`).
- **Data Sovereignty**:
  - **Export JSON**: Download your complete history as a structured JSON file at any time.
  - **Import JSON**: Restore backups with strict validation (including a 5 MB payload limit and data sanitization).
  - **Delete All Data**: Completely wipe all locally stored records in one click.

---

## License

This project is licensed under the [MIT License](LICENSE).
