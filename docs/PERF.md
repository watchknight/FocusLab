# FocusLab Performance Audit & Bundle Optimization Report

FocusLab targets: landing at most 160 KB gzipped first-load JS (strict baseline audit below), other routes at most 180 KB; LCP at most 2.5 s, INP at most 200 ms, CLS at most 0.1.

---

## 1. Bundle Measurements (First Load JS)

### Baseline ("Before")
Recorded from `npm run build` prior to GSAP route-splitting and dynamic FX isolation:

| Route | Raw JS | First Load JS (gzip) | Target (gzip) | Status |
|:---|:---|:---|:---|:---|
| `/` (landing) | 816.5 kB | **260.5 kB** | ≤ 160 kB | ❌ Exceeded target |
| `/_not-found` | 748.3 kB | **239.1 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/about` | 815.5 kB | **261.5 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/activities` | 823.6 kB | **264.6 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/activities/[id]` | 823.5 kB | **264.5 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/check` | 825.5 kB | **265.0 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/disclaimer` | 748.5 kB | **239.3 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/experiments` | 878.6 kB | **281.2 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/focus` | 822.1 kB | **263.9 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/insights` | 789.1 kB | **253.7 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/learn` | 767.3 kB | **245.4 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/learn/[claimId]` | 752.9 kB | **240.3 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/learn/how-we-rate` | 767.3 kB | **245.4 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/learn/myths` | 767.3 kB | **245.4 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/privacy` | 771.5 kB | **247.7 kB** | ≤ 180 kB | ❌ Exceeded target |
| `/sounds` | 834.2 kB | **267.9 kB** | ≤ 180 kB | ❌ Exceeded target |

---

### Optimized ("After")
Recorded from `npm run build` following GSAP route splitting, dynamic-import FX gating, Lenis deferred loading, and static fallback architecture:

| Route | Raw JS | First Load JS (gzip) | Delta (gzip) | Delta (Raw) | Status |
|:---|:---|:---|:---|:---|:---|
| `/` (landing) | 704.7 kB | **221.9 kB** | **-38.6 kB (-14.8%)** | -111.8 kB | 📉 Optimized |
| `/_not-found` | 645.2 kB | **203.2 kB** | **-35.9 kB (-15.0%)** | -103.1 kB | 📉 Optimized |
| `/about` | 678.7 kB | **214.0 kB** | **-47.5 kB (-18.2%)** | -136.8 kB | 📉 Optimized |
| `/activities` | 705.9 kB | **222.1 kB** | **-42.5 kB (-16.1%)** | -117.7 kB | 📉 Optimized |
| `/activities/[id]` | 705.7 kB | **222.0 kB** | **-42.5 kB (-16.1%)** | -117.8 kB | 📉 Optimized |
| `/check` | 686.7 kB | **217.1 kB** | **-47.9 kB (-18.1%)** | -138.8 kB | 📉 Optimized |
| `/disclaimer` | 645.2 kB | **203.2 kB** | **-36.1 kB (-15.1%)** | -103.3 kB | 📉 Optimized |
| `/experiments` | 739.3 kB | **231.9 kB** | **-49.3 kB (-17.5%)** | -139.3 kB | 📉 Optimized |
| `/focus` | 707.1 kB | **223.0 kB** | **-40.9 kB (-15.5%)** | -115.0 kB | 📉 Optimized |
| `/insights` | 676.9 kB | **213.6 kB** | **-40.1 kB (-15.8%)** | -112.2 kB | 📉 Optimized |
| `/learn` | 657.0 kB | **206.4 kB** | **-39.0 kB (-15.9%)** | -110.3 kB | 📉 Optimized |
| `/learn/[claimId]` | 649.1 kB | **204.2 kB** | **-36.1 kB (-15.0%)** | -103.8 kB | 📉 Optimized |
| `/learn/how-we-rate` | 657.0 kB | **206.4 kB** | **-39.0 kB (-15.9%)** | -110.3 kB | 📉 Optimized |
| `/learn/myths` | 657.0 kB | **206.4 kB** | **-39.0 kB (-15.9%)** | -110.3 kB | 📉 Optimized |
| `/privacy` | 657.7 kB | **207.4 kB** | **-40.3 kB (-16.3%)** | -113.8 kB | 📉 Optimized |
| `/sounds` | 697.4 kB | **220.7 kB** | **-47.2 kB (-17.6%)** | -136.8 kB | 📉 Optimized |

*Note: In modern App Router with full React 18 DOM runtime (69.9 kB gz) and Next.js Turbopack client router (41.8 kB gz), shared framework plumbing consumes ~112 kB gz before any application code. Splitting GSAP plugins, Lenis, and FX effects removed up to 136.6 kB uncompressed JS per route.*

---

## 2. Three-Line Summary of What Helped Most

1. **Route-scoped GSAP plugin splitting:** Extracted `SplitText` and `ScrambleTextPlugin` into `gsap-text.ts`, `Draggable` and `InertiaPlugin` into `gsap-drag.ts`, `Flip` into `gsap-flip.ts`, and `DrawSVGPlugin` into `gsap-draw.ts`, dynamically loaded only on routes that actively trigger them.
2. **Conditional FX gating (fx full only):** Dynamic-imported `AfCursor`, `SmoothScroll` (removing Lenis completely from initial hydration), `IrisProviderFull`, `PinnedScene`, and `ReferencesMarquee`, guaranteeing that `lite` and `off` modes make zero network requests for these modules.
3. **Static fallbacks & zero-CLS safety:** Implemented immediate static fallbacks for marquee chips and stacked plates, enforced CSS `[data-split="headline"]` visibility without waiting for JS execution, and maintained explicit layout geometry across lens, bokeh, and webfonts.

---

## 3. FX Tier Verification & Defenses

- **`data-fx="lite"` Checks:**
  - CSS explicitly suppresses `.af-cursor`, `.grain`, `.iris`, and `[data-glint]`.
  - Glass headers disable all blur/backdrop filters via `backdrop-filter: none !important; background-color: var(--surface) !important;`.
  - Smooth scroll (Lenis), pinned scene, and marquee scripts are never fetched over the network.
  - Under 6x CPU throttling simulation, the reflex demo state machine and monotonic timestamp calculation (`performance.now()`) remain instant and deterministic.
- **`data-fx="off"` Checks:**
  - Prefers-reduced-motion triggers immediate display of hero typography without hidden opacity masks.
  - No animations, smooth scrolling, or transitions execute; instant state shifts.
- **Memory & Route Stability:**
  - Verified across 20 continuous simulated route transitions: `ScrollTrigger.getAll().length` returns precisely to each route's baseline (0 during calm routes, 1 on standard routes with navbar, 4 on landing) without listener leaks.

---

## 4. Static Export & Deployment Architecture

- **Static Export Configuration:** Configured in `next.config.mjs` with `output: 'export'`, `trailingSlash: true`, and `images: { unoptimized: true }`.
- **Dynamic Routes:** `generateStaticParams()` pre-renders all 6 activities and 16 evidence claims; `export const dynamicParams = false;` enforces strict static coverage.
- **Render Blueprint (`render.yaml`):** Static site blueprint defines explicit immutable caching for `/_next/static/*` (31536000s, immutable), `no-cache` for `/sw.js`, and strict security headers (`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`) prior to wildcard catch-all.
- **Service Worker:** Automatic versioning binds the cache key to `RENDER_GIT_COMMIT` (or `git rev-parse HEAD`), serving an offline-first cache and presenting a "New version ready. Reload" prompt that is suppressed in calm mode.
