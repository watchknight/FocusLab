# FocusLab

FocusLab is a free, local-first web application that helps people build sustained focus through evidence-labelled cognitive practices and test what works for them (**Check → Practice → Compare**).

There are no user accounts, no analytics, no external tracking, and no backend servers. All personal data stays directly in your browser. Mobile-first.

---

## 1. What FocusLab Is

Most productivity tools rely on subjective impression or pseudoscientific "brain-training" games. FocusLab takes an empirical approach:

1. **Check (Reaction-Time Baseline)**: Measure sustained vigilance, reaction speed, and attention lapses via an informal 3-minute Psychomotor Vigilance Task (PVT-B) benchmark directly in your browser.
2. **Practice (Evidence-Labelled Tools)**: Engage in structured focus sessions with implementation intentions (If-Then planning), guided breath pacing, movement bouts, and synthetically generated soundscapes—each explicitly labelled with its empirical evidence tier.
3. **Compare (A/B Self-Experiments)**: Run controlled alternating A/B self-experiments comparing active interventions against quiet rest to discover what actually moves your personal needle.

> **Medical Disclaimer**: FocusLab is an educational self-experimentation tool, not a diagnostic or therapeutic medical device. It does not provide medical advice or screen for ADHD or neurological conditions.

---

## 2. What Changed in Design v3 ("Rack Focus")

FocusLab v3 replaces the legacy aesthetic with the **"Rack Focus"** photographic visual language (aperture, viewfinder HUD, bokeh, lens coatings) documented in `docs/DESIGN-V3.md`:

- **The Lens as Hero Object**: The central `<Lens>` SVG component powers the marketing hero, interactive reflex preview, breath pacer, and 404 screen with realistic iris blades driven by GSAP aperture tweens.
- **Neutral Interface**: The interface is strictly neutral with zero accent colours. Colour comes only from optical imagery (bokeh discs, iridescent lens coatings), evidence tiers, and data plots.
- **Three Profiles + System**:
  - **Studio** (Daylight neutral, `--bg: #F1F3F5`)
  - **Darkroom** (Darkroom neutral, `--bg: #0C0E13`)
  - **Contrast** (Monochromatic high-contrast, `--bg: #000000`, WCAG AAA compliant)
- **Fixed Viewfinder Stage Tokens**: Test stages (Check test, Focus run, Breathing players) use fixed stage tokens (`#07080B` canvas, `#FFFFFF` stimulus, `#F2F3F5` counter) that never theme, ensuring reaction test benchmarks remain visually identical and comparable across profiles.
- **GSAP & @gsap/react Motion Engine**: Replaced legacy animation libraries with standard GSAP, registered centrally in `src/lib/gsap.ts` with scoped `useGSAP` hooks and automatic cleanup.
- **Layout & Mobile Polish**:
  - Anchored Desktop Hero reaction HUD chip cleanly relative to the lens container box (bottom: 12%, left: 4%), eliminating collisions with the headline and subhead.
  - Sticky top header upgraded with `bg-bg/85 backdrop-blur-md border-b border-border z-40`, preventing content from scrolling under transparent chrome.
  - Set `scroll-padding-top: var(--header-height, 64px)` on `<html>` and added matching `pt-[var(--header-height)]` to main containers.
  - Eliminated mobile hero vertical dead space using `min-h-[100dvh]` and viewport-proportional lens sizing (`max-h-[38vh]`).
  - Restructured Environment Checklist into a balanced 2-column layout grouping duration/intention configuration on the left and checklist + CTA on the right.
  - Centered Evidence Bank and reading layouts at standard widths (`max-w-[840px]` and `max-w-[720px]`).
- **Complete Social Metadata**: Full OpenGraph and Twitter card (`summary_large_image`) integration with `metadataBase`, 1200×630 `public/og.jpg`, `public/icon.svg`, theme-color per profile, and distinct per-page titles and descriptions.

---

## 3. How to Run

### Prerequisites
- Node.js 18.17.0 or higher (Node 20+ recommended)
- npm 9.0.0 or higher

### Local Development

1. Clone repository and install dependencies:
   ```bash
   git clone https://github.com/watchknight/FocusLab.git
   cd FocusLab
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quality Verification Suite

Before committing or deploying, run all verification steps:

```bash
# Run ESLint rules
npm run lint

# Run strict TypeScript compilation check
npm run typecheck

# Run unit and contract tests via Vitest
npm test

# Build production static export bundle
npm run build
```

---

## 4. Design Tokens

All colors, dimensions, and curves live in `src/styles/tokens.css`. Components consume semantic tokens only; raw hex codes and arbitrary Tailwind palette classes are prohibited.

### Token Values Across Profiles

| Token | Studio | Darkroom | Contrast | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--bg` | `#F1F3F5` | `#0C0E13` | `#000000` | Application canvas |
| `--bg-deep` | `#E6E9ED` | `#07080B` | `#000000` | Dimmed backdrop / calm background |
| `--surface` | `#FFFFFF` | `#14171E` | `#000000` | Primary cards, plates, and panels |
| `--surface-2` | `#F7F8FA` | `#1B1F28` | `#101010` | Nested containers and secondary chips |
| `--border` | `#DDE1E6` | `#2A2F3B` | `#FFFFFF` | Hairline dividers and boundaries (1px) |
| `--border-strong` | `#7D8491` | `#6B7383` | `#FFFFFF` | Form control edges and prominent borders |
| `--text` | `#0E0F12` | `#F2F3F5` | `#FFFFFF` | Primary readable typography |
| `--muted` | `#555B66` | `#A3A9B5` | `#E6E6E6` | Secondary labels, captions, metadata |
| `--primary-bg` | `#0E0F12` | `#F2F3F5` | `#FFFFFF` | Primary button fill |
| `--primary-text` | `#FFFFFF` | `#0C0E13` | `#000000` | Primary button text |
| `--ring` | `#0E0F12` | `#FFFFFF` | `#FFD60A` | Keyboard focus ring |
| `--tier-strong` | `#0A7A47` | `#5FE3A1` | `#6DFFB0` | High-replication evidence grade |
| `--tier-moderate` | `#1F4FD8` | `#7FA8FF` | `#8CD3FF` | Supported evidence grade |
| `--tier-mixed` | `#7A3FD1` | `#C3A6FF` | `#E0C2FF` | Context-dependent evidence grade |
| `--tier-emerging` | `#0A7A7D` | `#4FD6D6` | `#5FFFF0` | Preliminary evidence grade |
| `--tier-not-supported`| `#B42318` | `#FF8A8A` | `#FF9C9C` | Debunked / unsupported evidence grade |

### Specialized Tokens

- **Glass**: `--glass: color-mix(in srgb, var(--surface) 62%, transparent)` with `backdrop-filter: blur(18px) saturate(1.4)`. In `lite` and `off` fx modes, automatically degrades to solid `var(--surface)`.
- **Fixed Viewfinder Stage Tokens**:
  - `--stage-bg`: `#07080B`
  - `--stage-stimulus`: `#FFFFFF`
  - `--stage-counter`: `#F2F3F5`
  - `--stage-hud`: `#9AA1AE`
- **Shape Tokens**: `--radius-xs: 6px`, `--radius-sm: 10px` (inputs/chips), `--radius-md: 16px` (panels/plates), `--radius-lg: 28px` (glass cards), `--radius-full: 999px` (buttons/pills).

---

## 5. Motion Rules & FX Tiers

### FX Tiers (`html[data-fx]`)

The application evaluates hardware constraints and user preferences before first paint via `HEAD_INIT_SCRIPT`:

| Tier | Condition | Capabilities |
| :--- | :--- | :--- |
| **`full`** | > 4 CPU cores, > 4 GB RAM, no save-data, motion allowed | Complete photographic motion: iris reveals, smooth scroll, bokeh drift, pointer parallax, glint reflection, pinned how-it-works scene, subtle grain. |
| **`lite`** | $\le 4$ cores, $\le 4$ GB RAM, or `save-data` active | Opacity and transform reveals only. No blur filters, no custom cursor, no smooth scroll, no pinned scene, no bokeh drift, no grain, solid glass fallbacks. |
| **`off`** | `prefers-reduced-motion: reduce` | Motion disabled. Instant state updates, opacity fades $\le 150\text{ ms}$, content immediately visible. |

### Calm Routes (`html[data-calm="on"]`)

When entering high-vigilance stages (Check reaction test, Focus timer run, Breathing pacer):
1. `html[data-calm="on"]` is activated.
2. Peripheral chrome (`[data-chrome]`) fades out and becomes inert.
3. All decorative tweens and ScrollTriggers are stopped.
4. `gsap.globalTimeline.getChildren().length` must strictly equal `0`.

### Animation Constraints

- **Allowed Properties**: `transform`, `opacity`, and small-area blur filter. Never animate layout properties (`width`, `height`, `top`, `left`).
- **Standard Easing**:
  - Reveals and locks: `focus` (`cubic-bezier(0.16, 1, 0.3, 1)`)
  - Screen wipes: `power3.inOut`
  - Scroll scrub: `none`
- **Standard Durations**: Micro `0.2s`, UI `0.4s`, Reveal `0.9–1.1s`, Scene scrub `0.6s`.

---

## 6. How to Add a Screen (Route)

Follow these steps to add a new route to FocusLab:

1. **Create the Server Component Page**:
   Create `src/app/my-feature/page.tsx` as a Server Component:
   ```tsx
   import React from 'react';
   import type { Metadata } from 'next';
   import { MyFeatureView } from '@/features/my-feature';

   export const metadata: Metadata = {
     title: 'Feature Title — FocusLab',
     description: 'Specific description of this feature without marketing hyperbole.',
     openGraph: {
       title: 'Feature Title | FocusLab',
       description: 'Specific description of this feature without marketing hyperbole.',
     },
   };

   export default function MyFeaturePage() {
     return <MyFeatureView />;
   }
   ```

2. **Create the Client View Component**:
   Create `src/features/my-feature/MyFeatureView.tsx` with `'use client'`:
   ```tsx
   'use client';

   import React from 'react';
   import { FeatureErrorBoundary } from '@/components/ui/FeatureErrorBoundary';

   export const MyFeatureView: React.FC = () => {
     return (
       <FeatureErrorBoundary featureName="My Feature">
         <div className="space-y-6 py-2 max-w-[840px] mx-auto">
           <h1 className="text-2xl font-bold tracking-tight text-text font-display">
             Feature Title
           </h1>
           {/* Feature content */}
         </div>
       </FeatureErrorBoundary>
     );
   };
   ```

3. **Follow Layout and Responsive Rules**:
   - Container widths: use `max-w-[720px] mx-auto px-6` for reading content, `max-w-[840px] mx-auto` for cards/grids, or `max-w-[1320px]` for full layouts.
   - Interactive touch targets must be at least $44\text{ px} \times 44\text{ px}$ (`min-h-[44px]`).
   - Use token colors only (`bg-surface`, `text-text`, `border-border`, etc.).
   - If adding claims or evidence, import from `src/content/evidence.ts` and display the `<EvidenceMeter tier={claim.tier} />`.

4. **Register in Navigation**:
   If the screen belongs in global navigation, add its route to `PRIMARY_FIVE` or `EXTRA_TWO` in `src/components/ui/Navbar.tsx` and `SHEET_NAV` in `src/components/ui/BottomNav.tsx`.

---

## 7. Deploying to Render (Static Site)

FocusLab is configured for static export (`output: 'export'` in `next.config.mjs`).

### Render Configuration

1. In the Render Dashboard, click **New +** → **Static Site**.
2. Connect your GitHub repository.
3. Configure the build parameters:
   - **Name**: `focuslab`
   - **Branch**: `main`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `out`
4. **Environment Variables**:
   - **Key**: `NODE_VERSION`
   - **Value**: `20.18.0`
   - **Key**: `NEXT_PUBLIC_APP_URL`
   - **Value**: `https://<your-subdomain>.onrender.com` (or your custom domain)
5. Click **Create Static Site**.

---

## 8. Post-Deploy Checks

After deploying on Render, perform these verification checks against your deployed URL:

### 1. HTTP Cache Headers Check

Run `curl -I` from your terminal to verify that HTML and service worker files are never cached, while static Next.js assets are cached immutably for 1 year:

```bash
# 1. Root document must have no-cache headers:
curl -I https://your-app.onrender.com/
# Expected: Cache-Control: public, max-age=0, must-revalidate

# 2. Service Worker must NOT be cached:
curl -I https://your-app.onrender.com/sw.js
# Expected: Cache-Control: no-cache, no-store, must-revalidate

# 3. Next.js static asset must be cached immutably:
curl -I https://your-app.onrender.com/_next/static/chunks/main.js
# Expected: Cache-Control: public, max-age=31536000, immutable
```

### 2. Lighthouse Mobile Audit

1. Open Chrome DevTools in an incognito window at your deployed URL.
2. Select **Lighthouse** tab → **Device: Mobile**, categories **Performance**, **Accessibility**, **Best Practices**, **SEO**.
3. Run audits on:
   - `/` (Home landing)
   - `/check` (Reaction test view)
4. Confirm:
   - Performance $\ge 90$
   - Accessibility score is $100$
   - No horizontal overflow at 320px–430px widths.

### 3. PWA Installation & Service Worker Update Toast

1. Open the deployed site in Chrome or Safari on mobile/desktop.
2. Install the PWA via the browser address bar or "Add to Home Screen".
3. Trigger a second deployment on Render.
4. Keep the PWA open; confirm the update notification appears:
   *"An update is available. Reload to get the latest version."*
5. Click **Reload** and confirm the application refreshes smoothly without loss of local data.

### 4. Social Preview Debugger

1. Navigate to [opengraph.xyz](https://www.opengraph.xyz/) or the Twitter Card Validator.
2. Enter your deployed URL.
3. Confirm that:
   - OpenGraph image resolves cleanly to the 1200×630 `og.jpg` asset.
   - Title matches *"FocusLab — Build focus you can measure"*.
   - Twitter card type shows `summary_large_image`.

---

## License

This project is licensed under the [MIT License](LICENSE).
