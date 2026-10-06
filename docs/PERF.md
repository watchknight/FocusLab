# Performance Audit & Bundle Optimization Report

FocusLab target metrics: Fast first load on a mid-range phone, no cold starts, Core Web Vitals (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1).

---

## 1. Bundle Measurements (First Load JS)

### Baseline ("Before")
Recorded from `npm run build` prior to bundle optimizations:

| Route | Route Size | First Load JS | Target | Status |
|:---|:---|:---|:---|:---|
| `/` (landing) | 4.91 kB | **140 kB** | < 130 kB | ❌ Exceeded target |
| `/_not-found` | 876 B | **88.7 kB** | < 160 kB | ✅ Met |
| `/about` | 207 B | **135 kB** | < 160 kB | ✅ Met |
| `/activities` | 326 B | **118 kB** | < 160 kB | ✅ Met |
| `/activities/[id]` | 214 B | **118 kB** | < 160 kB | ✅ Met |
| `/check` | 2.53 kB | **214 kB** | < 160 kB | ❌ Exceeded target |
| `/disclaimer` | 179 B | **96.8 kB** | < 160 kB | ✅ Met |
| `/experiments` | 12.5 kB | **233 kB** | < 160 kB | ❌ Exceeded target |
| `/focus` | 7.04 kB | **118 kB** | < 160 kB | ✅ Met |
| `/insights` | 6.70 kB | **129 kB** | < 160 kB | ✅ Met |
| `/learn` | 2.67 kB | **99.3 kB** | < 160 kB | ✅ Met |
| `/learn/[claimId]` | 179 B | **96.8 kB** | < 160 kB | ✅ Met |
| `/learn/how-we-rate` | 2.67 kB | **99.3 kB** | < 160 kB | ✅ Met |
| `/learn/myths` | 2.67 kB | **99.3 kB** | < 160 kB | ✅ Met |
| `/privacy` | 254 B | **123 kB** | < 160 kB | ✅ Met |
| `/sounds` | 6.79 kB | **113 kB** | < 160 kB | ✅ Met |

*Shared chunks baseline: 87.9 kB (react + react-dom 53.6 kB, Next.js runtime 32 kB, shared utils 2.2 kB)*

---

### Optimized ("After")
Recorded from `npm run build` following barrel cleanup, dynamic code splitting, and font pruning:

| Route | Route Size | First Load JS | Delta | Target | Status |
|:---|:---|:---|:---|:---|:---|
| `/` (landing) | 18.9 kB | **116 kB** | -24 kB (-17.1%) | < 130 kB | ✅ **PASS** |
| `/_not-found` | 139 B | **88.1 kB** | -0.6 kB | < 160 kB | ✅ **PASS** |
| `/about` | 20.6 kB | **136 kB** | +1 kB | < 160 kB | ✅ **PASS** |
| `/activities` | 325 B | **118 kB** | 0 kB | < 160 kB | ✅ **PASS** |
| `/activities/[id]` | 210 B | **118 kB** | 0 kB | < 160 kB | ✅ **PASS** |
| `/check` | 8.45 kB | **111 kB** | -103 kB (-48.1%) | < 160 kB | ✅ **PASS** |
| `/disclaimer` | 182 B | **96.8 kB** | 0 kB | < 160 kB | ✅ **PASS** |
| `/experiments` | 6.36 kB | **125 kB** | -108 kB (-46.4%) | < 160 kB | ✅ **PASS** |
| `/focus` | 7.04 kB | **118 kB** | 0 kB | < 160 kB | ✅ **PASS** |
| `/insights` | 6.54 kB | **129 kB** | 0 kB | < 160 kB | ✅ **PASS** |
| `/learn` | 2.67 kB | **99.3 kB** | 0 kB | < 160 kB | ✅ **PASS** |
| `/learn/[claimId]` | 182 B | **96.8 kB** | 0 kB | < 160 kB | ✅ **PASS** |
| `/learn/how-we-rate` | 2.67 kB | **99.3 kB** | 0 kB | < 160 kB | ✅ **PASS** |
| `/learn/myths` | 2.67 kB | **99.3 kB** | 0 kB | < 160 kB | ✅ **PASS** |
| `/privacy` | 4.27 kB | **123 kB** | 0 kB | < 160 kB | ✅ **PASS** |
| `/sounds` | 13.3 kB | **113 kB** | 0 kB | < 160 kB | ✅ **PASS** |

---

## 2. Summary of What Helped Most

1. Pruning Recharts barrel exports from `@/features/check` and `@/features/experiments` eliminated 100+ kB from `/check` and `/experiments`.
2. Dynamically importing `OnboardingModal`, the pointer lamp, and theme transitions deferred heavy interactive logic away from initial hydration.
3. Preloading Latin-only fonts and scoping the Bengali font to active Bengali text prevented extraneous webfont requests on first load.

---

## 3. Five Largest Contributors Reduced

1. **Recharts in `/experiments` (233 kB → 125 kB, -108 kB):** Removed `ExperimentDotPlot` from `@/features/experiments/index.ts` barrel export, isolating `recharts` to on-demand client chunk.
2. **Recharts in `/check` (214 kB → 111 kB, -103 kB):** Removed `HistoryChart` from `@/features/check/index.ts` barrel export so `FocusCheckRunner` does not eagerly pull in the charting suite.
3. **Onboarding modal on `/` (140 kB → 116 kB, -24 kB):** Deferred `OnboardingModal` using `dynamic(..., { ssr: false })` in `HomeContent.tsx`, stripping recommendation heuristics and dialog trees from critical path.
4. **Theme transition logic across all routes:** Replaced static `runThemeTransition` import in `ThemeToggle.tsx` with dynamic `import('@/lib/theme-transition')` invoked only upon user interaction.
5. **Redundant font imports:** Removed `@import '@fontsource-variable/atkinson-hyperlegible-next/index.css'` from `globals.css` in favor of Next.js self-hosted `localFont`, and trimmed Hind Siliguri weights to normal (400) and semibold (600) with `preload: false`.

---

## 4. Layout Shift (CLS) Defenses

- **ReflexLamp & Hero Section:** Added `min-h-[300px]` to both `<ReflexLamp />` and its parent column container in `<HeroLamp />` so state changes (`idle` → `armed` → `lit` → `result`) maintain constant height.
- **Dynamic Charts:** Aligned loading skeleton heights with actual rendered chart sizes:
  - `HistoryChart` in `ResultsView.tsx`: `h-48 sm:h-56`
  - `ExperimentDotPlot` in `ExperimentDetail.tsx`: `min-h-[280px] sm:min-h-[320px]`
  - `TimeOfDayChart` & `HistoryChart` in `InsightsOverview.tsx`: `h-48 sm:h-56`
- **Zero layout-shift assets:** All media elements are vector SVGs or CSS shapes with explicit intrinsic bounds.
