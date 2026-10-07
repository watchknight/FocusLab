# FocusLab

FocusLab is a free, open-source, local-first web application that helps people build sustained focus through evidence-labelled cognitive practices and test what works for them using reaction-time benchmarks (**Check → Practice → Compare**).

There are no user accounts, no analytics, no external tracking, and no servers. All personal data stays directly in your browser.

---

## What FocusLab Is

Most productivity tools rely on subjective impression or pseudoscientific "brain-training" games. FocusLab takes an empirical approach:

1. **Check (Reaction-Time Baseline)**: Measure sustained vigilance, reaction speed, and attention lapses via an informal 3-minute Psychomotor Vigilance Task (PVT-B) benchmark in your browser.
2. **Practice (Evidence-Labelled Tools)**: Engage in structured focus sessions with implementation intentions (If-Then planning), guided breath pacing, movement bouts, and synthetically generated soundscapes—each explicitly labelled with its empirical evidence tier.
3. **Compare (A/B Self-Experiments)**: Run controlled alternating A/B self-experiments comparing active interventions against quiet rest or ambient noise against silence to discover what measurably moves your personal needle.

> **Medical Disclaimer**: FocusLab is an educational self-experimentation tool, not a diagnostic or therapeutic medical device. It does not provide medical advice or screen for ADHD or neurological conditions.

---

## What Changed in Redesign v2

The v2 redesign introduces a unified design language, robust offline-first infrastructure, and strict verification:

- **"Cyanotype & Lamp" Direction**: Visual metaphor where attention acts as a lens—the object of focus is sharp and illuminated while peripheral chrome softens.
- **Strict Design Tokens**: All colours derive exclusively from CSS custom properties in `src/styles/tokens.css` with zero raw hex or hardcoded Tailwind palette colours.
- **Accessible Typography**: Self-hosted `Atkinson Hyperlegible Next` (body), `Archivo` (variable-width display), and `Hind Siliguri` (Bengali) through `next/font`. Body font size is strictly $\ge 16\text{ px}$, line length capped at $70\text{ ch}$, and tabular numbers applied to all timers and metrics.
- **Refined Motion System**: Centralized motion engine in `src/lib/motion.ts` with spring/duration tokens, automatic Calm Mode (`data-calm="on"`) during tests and breathwork, Low-End hardware detection, and instantaneous `prefers-reduced-motion` fallbacks.
- **Bilingual Internationalization**: Complete English and Bengali support with hydration-safe store initialization and typed translation hooks (`useT`).
- **Resilient Data Guard**: Storage integrity checks that catch corruption at launch without mistaking simple UI rendering errors for data loss, reinforced by feature-level error boundaries.
- **Review & Audit Findings Resolved**:
  - **Check Test Silenced**: Eliminated the live 60–120fps requestAnimationFrame millisecond ticker during stimulus presentation. The stimulus circle is completely motionless and quiet; reaction time is presented only upon response in the feedback phase.
  - **Calm Sentence Case**: Converted all-caps prompt (`"RESPOND NOW"`) to calm sentence case (`"Respond now"`).
  - **Single Lamp Focal Hierarchy**: Removed ambient background radial gradients from `HeroPointerLamp`, toned down the header CTA button, and gave the resting `ReflexLamp` an amber pilot ring with high-contrast edge boundaries.
  - **Honest Audio Indicators**: Replaced the decorative 12-bar bouncing CSS visualizer in `NoisePlayer` with a quiet, honest output state indicator.
  - **Editorial Layout Rhythm**: Removed repetitive card containers from "How it works" and the Evidence rubric, adopting open typography with 1px divider lines.
  - **Accessible Typography**: Raised body and description copy across plates, claim cards, and panels to $\ge 16\text{ px}$ (`text-base`) or $14\text{ px}$ minimum for metadata.
  - **Strict Contrast Framing**: Ensured all amber accents are framed by `--accent-edge: #0A1D36` in daylight mode to guarantee contrast compliance against paper backgrounds.

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
- Node.js 18.17.0 or higher (Node 20+ recommended)
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

Before committing changes or deploying, ensure all quality gates pass:

```bash
# Run ESLint checks
npm run lint

# Run strict TypeScript compilation check
npm run typecheck

# Run unit tests via Vitest
npm test

# Build production Next.js static export bundle
npm run build
```

---

## Design Tokens

FocusLab's design system lives in `src/styles/tokens.css`. It supports three dedicated colour profiles plus a System mode:

1. **Daylight**: Crisp cyanotype ink and blue-tinted paper tones for bright daytime environments.
2. **Night**: Deep indigo, midnight navy, and warm lamp accents for evening focus and dark-mode displays.
3. **Contrast**: High-contrast monochromatic palette exceeding WCAG AAA standards ($\ge 7:1$) and respecting `forced-colors: active`.

### Core Token Variables

| Token | Daylight | Night | Contrast | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `--bg` | `#EDF3FA` | `#070D18` | `#000000` | Application canvas background |
| `--surface` | `#FCFDFE` | `#0E1726` | `#121212` | Elevated cards and containers |
| `--surface-2` | `#E3ECF6` | `#162236` | `#1C1C1C` | Secondary plates and inputs |
| `--text` | `#0A192F` | `#E6EDF5` | `#FFFFFF` | Primary readable typography |
| `--muted` | `#3F5878` | `#8BA2C1` | `#E0E0E0` | Secondary metadata and labels |
| `--accent` | `#0B5CAB` | `#4BA2F2` | `#FFFFFF` | Interactive action states and lamp glow |
| `--border` | `#B8CDE3` | `#22344F` | `#888888` | Plate borders and dividers |
| `--ring` | `#0B5CAB` | `#70B8F8` | `#FFFFFF` | Visible `:focus-visible` keyboard rings |

> **Contrast Rule**: All text tokens against their respective backgrounds are tested in `src/styles/contrast.test.ts` to ensure strict compliance with WCAG AA ($\ge 4.5:1$) and AAA ($\ge 7:1$).

---

## Motion Rules

FocusLab treats motion as functional feedback, not gratuitous decoration:

- **Permitted Properties**: Only `transform`, `opacity`, and localized `filter` (blur) may be animated. Animating layout properties (`width`, `height`, `top`, `left`) is strictly prohibited.
- **Timing Tokens**: All animation timings are defined in `src/lib/motion.ts`:
  - `durations.instant` ($0\text{ s}$)
  - `durations.quick` ($0.2\text{ s}$)
  - `durations.base` ($0.3\text{ s}$)
  - `durations.slow` ($0.5\text{ s}$)
  - `durations.hero` ($1.2\text{ s}$)
- **Reduced Motion**: Under `prefers-reduced-motion: reduce`, animations collapse to opacity fades of $\le 150\text{ ms}$; all positional transforms, lamp pointers, and blurs are disabled.
- **Calm Mode**: When the user enters the reaction test (`/check`), a breathing player, or an active focus session, the application sets `data-calm="on"` on `<html>`. This disables all ambient animations and prevents thread interference during millisecond-critical timings.
- **Low-End Mode**: Hardware is detected dynamically via `hardwareConcurrency <= 4`, `deviceMemory <= 4`, or `saveData`. On constrained hardware, backdrop filters and heavy pointer lamps are bypassed.

---

## How to Add a Theme

To add a new colour profile (e.g., `sepia`):

1. **Define CSS Variables in `src/styles/tokens.css`**:
   ```css
   [data-theme='sepia'],
   .sepia {
     --bg: #F4ECD8;
     --surface: #FCF8EE;
     --surface-2: #E8DCBE;
     --text: #2C2216;
     --muted: #6B5B45;
     --border: #D5C4A1;
     --accent: #8C481A;
     --ring: #8C481A;
     /* Define remaining tokens adhering to contrast guidelines */
   }
   ```

2. **Register the Profile**:
   Add the new identifier to `ThemeProfile` in `src/components/ui/ThemeToggle.tsx` and provide its display label and icon in `THEME_OPTIONS`.

3. **Add Contrast Tests**:
   Add the token pairings to `src/styles/contrast.test.ts` to ensure automated verification against WCAG AA requirements:
   ```bash
   npm test
   ```

---

## How to Add a Screen (Route)

1. **Create the Route File**:
   Create `src/app/your-route/page.tsx`. Use Next.js App Router conventions:
   ```tsx
   import React from 'react';
   import type { Metadata } from 'next';
   import { Container } from '@/components/ui/Container';
   import { FeatureErrorBoundary } from '@/components/ui/FeatureErrorBoundary';

   export const metadata: Metadata = {
     title: 'Your Screen Title',
     description: 'Accessible description of this screen.',
   };

   export default function YourScreenPage() {
     return (
       <FeatureErrorBoundary featureName="Your Screen">
         <Container className="py-6 space-y-6">
           <h1 className="text-2xl font-bold tracking-tight text-text">Your Screen Title</h1>
           <p className="text-base text-muted">Page body copy adhering to >= 16px font standard.</p>
         </Container>
       </FeatureErrorBoundary>
     );
   }
   ```

2. **Follow UI Rules**:
   - Container max width: `max-w-[1200px]` (or `max-w-[720px]` for long-form reading).
   - Touch targets: interactive controls must have `min-h-[44px]` and `min-w-[44px]`.
   - Never use raw hex codes; use semantic Tailwind token classes (`bg-surface`, `text-text`, `border-border`).
   - Add localized text entries in `src/i18n/en.json` and `src/i18n/bn.json`.

3. **Link in Navigation**:
   If the screen belongs in main navigation, add its key and route to `PRIMARY_NAV` or `EXTRA_NAV` in `src/components/ui/Navbar.tsx` and `SHEET_NAV` in `src/components/ui/BottomNav.tsx`.

---

## Deploying to Render (Static Site)

FocusLab is a fully client-side application configured for static export (`output: 'export'` in `next.config.mjs`).

### Option A: Using the `render.yaml` Blueprint

1. Push your repository to GitHub.
2. In the Render Dashboard, click **New +** → **Blueprint**.
3. Connect your repository. Render will automatically parse `render.yaml` and configure the static site, build commands, and HTTP cache headers.

### Option B: Creating a Static Site Manually

1. In the Render Dashboard, click **New +** → **Static Site**.
2. Connect your GitHub repository (`FocusLab`).
3. Set the following configuration:
   - **Name**: `focuslab`
   - **Branch**: `main` (or your active release branch)
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `out`
4. **Environment Variables**:
   - If Render defaults to an older Node.js version and fails, add an environment variable:
     - **Key**: `NODE_VERSION`
     - **Value**: `20.18.0`
5. Click **Create Static Site**.

---

## Post-Deploy Checks

After deployment completes on Render, run these verification checks against your production URL (replace `https://your-app.onrender.com` with your domain):

### 1. HTTP Cache Headers Check

Run `curl -I` from your terminal to verify that HTML and service worker files are never cached, while static Next.js assets are cached immutably for 1 year:

```bash
# Root document must have no-cache headers:
curl -I https://your-app.onrender.com/
# Expected header: Cache-Control: public, max-age=0, must-revalidate

# Service Worker must NOT be cached:
curl -I https://your-app.onrender.com/sw.js
# Expected header: Cache-Control: no-cache, no-store, must-revalidate

# Hashed Next.js static asset must be cached immutably for 1 year:
curl -I https://your-app.onrender.com/_next/static/chunks/117-*.js
# Expected header: Cache-Control: public, max-age=31536000, immutable
```

### 2. Lighthouse Mobile Audit

1. Open Chrome DevTools in an incognito window and navigate to `https://your-app.onrender.com/`.
2. Open the **Lighthouse** tab.
3. Select **Mode: Navigation**, **Device: Mobile**, and categories **Performance**, **Accessibility**, **Best Practices**, and **SEO**.
4. Click **Analyze page load** for:
   - `/` (Landing page)
   - `/check` (Reaction test view)
5. Verify:
   - Performance $\ge 90$
   - Accessibility score is $100$
   - Zero horizontal overflow warnings at mobile viewports ($320\text{ px} - 430\text{ px}$).

### 3. PWA Installation & Service Worker Update Check

1. **Install PWA**:
   - Open `https://your-app.onrender.com/` in Chrome or mobile Safari.
   - Click the browser install icon or "Add to Home Screen".
   - Confirm the app opens in standalone mode with full offline functionality.
2. **Update Toast Verification**:
   - Trigger a second deployment on Render (e.g., a documentation tweak or empty commit).
   - While keeping the installed PWA open, wait for the background service worker lifecycle to detect the new cache name (`focuslab-cache-<commit>`).
   - Confirm the update toast appears: *"An update is available. Reload to get the latest version."*
   - Click **Reload** and confirm the application updates smoothly without loss of local data.

---

## License

This project is licensed under the [MIT License](LICENSE).
