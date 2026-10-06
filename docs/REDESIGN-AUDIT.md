# FocusLab Redesign Audit

> **Date:** 2026-10-06  
> **Auditor:** Automated five-pass code review  
> **Scope:** Every route at 320–1920 px; correctness; performance; accessibility; honesty copy  
> **Status:** READ-ONLY — no source files were edited

---

## Build Summary

| Metric | Value |
|---|---|
| Next.js | 14.2.35, `output: 'export'` (static) |
| Server-only features used | **None** — can remain a static export |
| Shared first-load JS | 87.8 kB |
| Heaviest routes (first-load JS) | `/experiments` 228 kB · `/check` 211 kB · `/` 186 kB |
| Total static pages | 40 |
| Build result | ✅ Exit 0, no type or lint errors |

### Five biggest JS contributors

| Chunk | Size | Likely contents |
|---|---|---|
| `fd9d1056-…` | 53.6 kB | React runtime |
| `117-…` | 32 kB | Zustand + i18n + motion + shared UI |
| `/` page chunk | 60.3 kB | HomeContent + HeroLamp + OnboardingModal |
| `/experiments` page chunk | 11.7 kB | ExperimentCreate + DotPlot + Recharts shim |
| `/sounds` page chunk | 11.4 kB | NoisePlayer + EvidencePanel + Web Audio |

---

## Findings

| ID | Sev | Route / File:Line | Symptom | Root Cause | Fix |
|---|---|---|---|---|---|
| **R01** | blocker | `EvidenceBadge.tsx:23-47` | Badge renders literal `[High-Replication]`, `[Controlled-Trials]`, etc. as visible text alongside "Evidence: Strong" | The `icon` field in `TIER_CONFIG` contains bracket-tagged strings like `'● [High-Replication]'`. Both the icon span (L72-74) and the label span (L75) render, producing doubled noisy output. | Remove the bracket tags from `icon`; keep only the Unicode glyph (`●`, `◈`, `◐`, `◇`, `✕`). The tags were never part of the badge spec (five tiers: strong / moderate / mixed / emerging / not-supported). |
| **R02** | blocker | `ThemeToggle.tsx:12-26` | Theme flashes to daylight on first paint for dark-mode users, then snaps to correct theme | No blocking `<script>` in `<head>` reads `localStorage` before first paint. `applyTheme` runs inside `useEffect`, which fires after hydration. | Add a tiny inline script in `layout.tsx` (or `<head>`) that reads `focuslab:theme` from localStorage and sets `data-theme` + class on `<html>` before React mounts. |
| **R03** | blocker | `i18n/index.ts:18-36` | Hydration mismatch when saved language is Bengali: server renders `'en'`, client Zustand store initializes with `'bn'` from localStorage | `getInitialLocale()` runs at module evaluation time and reads `localStorage` synchronously. On the server (static export), `window` is undefined so it returns `'en'`; on the client it returns the stored value. | Defer the localStorage read into a `useEffect` or use a `useSyncExternalStore` shim with identical server/client snapshot (`'en'`), then update to stored locale after mount. |
| **R04** | blocker | `DataIntegrityGuard.tsx:106-131` | Any React render error (even a simple UI bug) shows the "Storage Recovery Mode" screen and offers "Reset Storage", tricking users into deleting all data | `IntegrityErrorBoundary` wraps the entire app and treats every caught error as data corruption. It offers a destructive "Reset Storage" button. | Separate concerns: use a generic error boundary for UI crashes (show retry, no data-delete button), and reserve the corruption screen only for the JSON-parse guard in lines 137-152. Add per-feature error boundaries. |
| **R05** | major | `Navbar.tsx:43, 33` | Desktop nav clipped at 1920 px; only ~5 of 8 links visible, rest behind a horizontal scrollbar | The `<nav>` is inside a `max-w-container` (1200 px) flex row with `min-w-0` but no `flex-wrap` or `overflow-hidden`. Eight link items + logo + toggles exceed the 1200 px budget. At 1920 px the header is only 1200 px wide, and nav links shrink/clip. | Either (a) increase max-width of the header's inner container, (b) add `flex-wrap` to the nav, or (c) collapse low-priority links into a "More" dropdown at `md`/`lg` breakpoints (matching the mobile BottomNav strategy). |
| **R06** | major | `LanguageToggle.tsx:21-26` | Button reads "বাং বাংলা" (duplicated Bengali fragment) on screens ≥ 640 px | Line 22 always renders `'বাং'` as a short icon label. Line 24-26 adds `hidden sm:inline` full text `'বাংলা'`. Above `sm` both are visible, producing the concatenated "বাং বাংলা". | On `sm+`, hide the short icon span when the full label is visible. Use `sm:hidden` on the icon span, or merge them into a single conditional render. |
| **R07** | major | `ThemeToggle.tsx:92-99` | Theme button text wraps to multiple lines ("System" stacks under icon) | No `whitespace-nowrap` or `shrink-0` on the button. In a tight flex container with nav links competing for space, the button is allowed to shrink. | Add `whitespace-nowrap shrink-0` to the button class list. |
| **R08** | major | `HomeContent.tsx:58,72,93-94,109,115,132,138-139` + `about/page.tsx:30-44` + `IntroView.tsx:28,34` | Body text on cards is 12 px (`text-xs` = 0.75rem). AGENTS.md requires ≥ 16 px body text. | Pervasive use of Tailwind `text-xs` for paragraph and description text across home, about, check, and FAQ content. | Replace `text-xs` on body/paragraph elements with `text-sm` (14 px minimum) or the design-token `var(--text-base)` (≥ 16 px). Reserve `text-xs` for labels, badges, and metadata only. |
| **R09** | major | `IntroView.tsx:16-23` | Focus Check shows an EvidenceBadge reading "Evidence: Moderate" next to the title, implying the Check itself is a moderately evidenced *intervention* | Line 16 fetches `getClaimById('pvt-check')` and line 23 renders `<EvidenceBadge tier={claim.tier}>`. The `pvt-check` claim (evidence.ts:171-176) describes the *measurement validity* of the lab PVT-B, not an intervention's efficacy. Showing the badge inline with the title conflates tool validity with treatment evidence. | Remove the EvidenceBadge from the title row. Instead, display the claim card (already at L33-38) with a clear header like "About this measurement" to distinguish it from activity evidence badges. |
| **R10** | major | `en.json:43` | Copy reads "…disproven claims" — overstates the evidence tier "not-supported" | The i18n string `home.evidenceStripSub` says "disproven claims". The tier is "not-supported", which means insufficient supporting evidence, not definitive disproof. "Disproven" implies absolute falsification. | Change to "…claims that lack supporting evidence" or "…claims rated not-supported". Update `bn.json:43` ("ভুল প্রমাণিত") to match. |
| **R11** | major | `bn.json:112` | Bengali results page says "বস্তুনিষ্ঠ" (objective) — the English equivalent was already fixed to avoid "objective" | Stale translation. `en.json:112` correctly says "Here is your attention performance summary…" but the Bengali still contains "বস্তুনিষ্ঠ" (objective), violating the rule that the Check is an informal browser test, not objective. | Retranslate `check.resultsSub` in `bn.json` to remove "বস্তুনিষ্ঠ", matching the English phrasing. |
| **R12** | major | `Navbar.tsx:32` + `check/page.tsx` | Two horizontal lines appear under the header on `/check` | The `<header>` has `border-b border-border` (Navbar.tsx:32). On the `/check` route, the `<main>` wrapper (layout.tsx:72) has its own top padding + the IntroView's Card (IntroView.tsx:34) has `border border-border`. When the content starts immediately, the header border and the card's top border appear as a double line. | Either remove the header's bottom border globally (relying on the sticky background for visual separation), or add enough spacing/background between the header and the first content card to visually separate them. |
| **R13** | major | `layout.tsx:72` + `Navbar.tsx:33` | Content column is ~660 px on a 1920 px screen; header nav squeezed into same width | Both `<main>` and the Navbar's inner `<div>` use `max-w-container` (1200 px) via Tailwind config. But at 1200 px with `px-4` padding the usable width is ~1168 px. The nav has 8 links + logo + 2 toggle buttons all competing inside this width, causing clipping. The content area appears narrower because of additional padding/margins in child components. | Widen the header to `max-w-[1536px]` or full-width, keeping only the content area at `max-w-container`. This gives the nav room to breathe without making content lines too long. |
| **R14** | major | `store/index.ts:136-141` | Zustand `migrate` function is a no-op — adding new store fields in future versions will silently drop them | The `migrate` callback returns `persistedState as FocusLabStore` regardless of version, never adding default values for new fields. | Implement actual migration logic: when `version < N`, spread defaults for new fields onto the persisted state. |
| **R15** | major | `sw.js:3` | Service worker `APP_VERSION` is hardcoded; forgetting to bump it on deploy serves stale content indefinitely | The version string `'v1.0.1'` must be manually updated. If not bumped, the `install` event won't fire and old caches persist. | Inject a build hash or timestamp into `sw.js` at build time (e.g., via `next.config.mjs` `generateBuildId`), or use a Workbox-style precache manifest. |
| **R16** | major | `DataIntegrityGuard.tsx:137-152` | Guard only checks `typeof parsed === 'object'` — does not validate store schema | A JSON object like `{"foo": "bar"}` passes the guard and is treated as valid data, potentially causing downstream crashes when the store tries to read `checks`, `sessions`, etc. | Call `validateSnapshot` (from `store/validation.ts`) or at minimum check for the presence of expected arrays (`checks`, `sessions`, etc.). |
| **R17** | major | `EvidenceBadge.tsx:64` | Badge `text-xs` (12 px) is below 16 px minimum; and tap target when inside a `<Link>` (HomeContent.tsx:100) is ~28 px tall, below 44 px minimum | The badge has `py-1` (4 px top + bottom) and `text-xs`, producing a ~24-28 px tall element. When wrapped in a `<Link>` without extra padding, the tap target fails the 44 px rule. | Add `min-h-[44px] inline-flex items-center` to the wrapping `<Link>` elements, or increase badge padding. |
| **R18** | minor | `en.json:29` | "Move beyond subjective guesswork through structured self-experimentation" — subtly overstates by implying the Check eliminates subjectivity | Browser-based PVT-B is less subjective than self-report but still noisy (browser timing jitter, environment). "Guesswork" is dismissive of self-report. | Soften to "structured self-tracking" or "Add a behavioural measure alongside your own impressions." |
| **R19** | minor | `about/page.tsx:52` | Copy mentions "boost IQ", "enhance focus", "brain power" — even in denial, search engines and screen readers encounter the exact prohibited phrases | The sentence "We never promise to 'boost IQ', 'enhance focus', or give 'brain power'" contains the forbidden phrases as quoted strings. | Rephrase without quoting the exact prohibited phrases, e.g., "We avoid vague performance promises. Every claim names a specific measured outcome." |
| **R20** | minor | `HomeContent.tsx:72` | Card description text uses `text-xs text-muted` — low contrast grey at small size | `text-muted` maps to `--fog-day` (`#3F5878`) on `--paper` (`#EDF3FA`). At 12 px, readability is poor even though the contrast ratio (~4.5:1) narrowly passes AA for large text but fails for 12 px text, which is "normal" size. | Use `text-sm text-text` for card descriptions. Keep `text-muted` for metadata labels only. |
| **R21** | minor | `BottomNav.tsx:106,124` | Bottom nav label text is `text-[10px]` (10 px) — below any reasonable minimum | Mobile nav labels at 10 px are extremely small and may be illegible on low-DPI screens. | Increase to `text-[11px]` minimum, or better, use `text-xs` (12 px). |
| **R22** | minor | `BottomNav.tsx:51` | "More Sections" label is hardcoded in English, not using i18n | The string "More Sections" and "More" (L124) are not translated via `t()`. | Add i18n keys `nav.moreSections` and `nav.more` and use `t()`. |
| **R23** | minor | `TestView.tsx:153` | `visibilitychange` listener is not properly removed in cleanup | Line 153 registers an anonymous arrow function `() => document.hidden && abortOnHidden()`. The cleanup (L163) tries to remove `abortOnHidden` directly, which is a different reference. The anonymous wrapper is never removed. | Store the `visibilitychange` handler in a `const` and remove that exact reference in cleanup. |
| **R24** | minor | `TestView.tsx:166` | `handleResponse` is in the `useEffect` dependency array but changes every render because it depends on `phase` state | `handleResponse` is a `useCallback` depending on `phase`, so it changes on every phase transition. This causes the `useEffect` at L126 to re-run (re-registering keydown listeners, restarting timers). With `startNextTrial` also in the deps, this creates a re-initialization loop. | Use refs for the response handler, or move keyboard listeners into a separate effect that reads phase from a ref. |
| **R25** | minor | `sounds/EvidencePanel.tsx:14,31,34` | Hardcoded English strings ("What the Science Says", "Try it, then test it.", full paragraph) bypass i18n | These strings are not in `en.json` or `bn.json`. Bengali users see English text in the sounds evidence panel. | Move strings to i18n JSON files. |
| **R26** | minor | `ResultsView.tsx:72-75` | "Interpretation Note" card text is hardcoded English, not i18n | The card text ("Compare with your own earlier checks…") bypasses `t()`. | Add i18n keys for the interpretation note heading and body. |
| **R27** | minor | `check/ResultsView.tsx:48` | Heading hierarchy: page starts at `<h2>` without a preceding `<h1>` | The results view renders `<h2>` as the top-level heading. After the Check test completes, the page has no `<h1>`, breaking the heading hierarchy for screen readers. | Change to `<h1>` or ensure the parent page provides an `<h1>`. |
| **R28** | minor | `storage.ts:1` | Dead import: `import { SelfCheckLog, PracticeSessionLog } from './legacy-types'` | `storage.ts` uses old types from `legacy-types.ts`. Neither `storage.ts` nor `legacy-types.ts` are imported anywhere in the active app. They are dead code from a previous version. | Delete both `storage.ts` and `legacy-types.ts`, or mark them explicitly as deprecated. |
| **R29** | minor | `about/page.tsx:77-81` | Footer links have `min-h-[32px]` — below the 44 px touch target minimum | The About page's bottom links use `min-h-[32px]` instead of `min-h-[44px]`. | Change to `min-h-[44px]`. |
| **R30** | minor | `Navbar.tsx:51` | Nav link text uses `text-xs` (12 px) — small for primary navigation | Desktop nav links are 12 px, making them hard to scan and click. | Use `text-sm` (14 px) for nav links. |
| **R31** | minor | `BreathPacer.tsx:88` (reported by a11y audit) | "Skip hold phases" checkbox label has `min-h-[36px]` — below 44 px | Touch target for the checkbox toggle is 36 px tall. | Change to `min-h-[44px]`. |
| **R32** | minor | `myths.ts:8-49` | Myth explanations are hardcoded scientific claims not sourced from `evidence.ts` | Each myth has an `explanation` string that restates evidence claims. While each myth has a `claimId` linking to `evidence.ts`, the `explanation` text itself is a separate, potentially divergent summary. | Either render the linked claim's `summary` from `evidence.ts` directly, or add a `TODO(evidence)` comment noting these are derived summaries. |
| **R33** | minor | `store/index.ts:82` | `addExperimentRun` spreads `...e.runs` without null check | If an older persisted experiment object lacks a `runs` array (due to schema migration gap R14), this line throws `TypeError: e.runs is not iterable`. | Add `(e.runs ?? [])` fallback. |
| **R34** | minor | `sw.js:6-23` | Precache list uses extensionless paths (`/check`, `/focus`, etc.) but static export generates `/check/index.html` with `trailingSlash: true` | Depending on the hosting server's URL normalization, `/check` may not match the cached `/check/` (with trailing slash). The SW might fail to serve cached pages offline. | Add trailing slashes to precache paths, or normalize URLs in the fetch handler. |
| **R35** | minor | `i18n/index.ts:36` + `layout.tsx:54` | Language mismatch: `<html lang="en">` is hardcoded in the server-rendered layout; `setLocale` updates it imperatively, but any re-render of the layout resets it to `"en"` | The `lang` attribute is set statically at build time in the `<html>` tag. The i18n module updates it imperatively via `document.documentElement.lang`, but this is fragile. | Use a client component wrapper that reads the store and sets `lang` dynamically, or accept the SSR/hydration limitation and document it. |
| **R36** | minor | global | No per-feature error boundaries | Only the global `IntegrityErrorBoundary` exists. A crash in `FocusCheckRunner`, `SessionFlow`, or `DataManagement` takes down the entire app and shows the misleading "Storage Recovery" screen (see R04). | Add lightweight error boundaries around `FocusCheckRunner`, `SessionFlow`, `ExperimentRunner`, and `DataManagement`. |
| **R37** | minor | `HomeContent.tsx:65` | Loop cards lack `rounded-*` class — they use raw borders without rounded corners, while other cards use `rounded-lg` | Visual inconsistency between Card component (rounded-lg) and the manually styled loop step cards (no rounding). | Add `rounded-lg` to the loop card `<div>` for consistency, or remove rounding from Card if the design is intentionally sharp. |
| **R38** | minor | `TestView.tsx:196` | Large RT values at 320 px width could overflow | `text-4xl font-mono` for "1250 ms" at 320 px minus padding leaves ~280 px. Four-digit numbers in monospace at 36 px may clip. | Add `text-3xl sm:text-4xl` or use `clamp()`. Already uses `sm:text-5xl` — just needs a smaller base. |
| **R39** | minor | `Footer.tsx:14` | Footer link text `text-xs` (12 px) — below 16 px body minimum | Footer navigation links are 12 px. | Use `text-sm`. |
| **R40** | minor | `HomeContent.tsx:57,131` | Section headings `text-xl` → 20 px, while sub-headings inside cards are `text-base` → 16 px, and body is `text-xs` → 12 px. Compressed typographic scale makes hierarchy unclear | The jump from 20 px heading to 12 px body skips too many steps, especially with muted color reducing contrast further. | Use the design-token scale: heading at `text-display`, sub-heading at `text-lead`, body at `text-base` (all ≥ 16 px). |

---

## Top 5 Changes to Most Improve First Impressions

### 1. Fix the EvidenceBadge (R01)
Remove the `[High-Replication]` / `[Controlled-Trials]` bracket tags from the icon strings. Every badge currently looks broken — this is the first thing a visitor notices on the home page's evidence strip. A one-line-per-tier fix.

### 2. Fix the nav at desktop widths (R05 + R13)
Widen the header container beyond `max-w-container` (or make it full-width with internal padding) so all 8 links + toggles fit without clipping. This also fixes the squeezed look at 1920 px and eliminates the horizontal scrollbar.

### 3. Fix the language and theme toggle buttons (R06 + R07)
The "বাং বাংলা" duplication and the three-line "System" label are immediately visible in the top-right corner. Adding `sm:hidden` to the short Bengali icon span and `whitespace-nowrap shrink-0` to the theme button resolves both.

### 4. Increase body text to ≥ 16 px (R08 + R20 + R40)
The pervasive `text-xs` (12 px) on card descriptions, FAQ answers, and about-page paragraphs makes the app feel cramped and hard to read. Switching to `text-sm` or `var(--text-base)` for body text dramatically improves readability and meets the project's own rule.

### 5. Eliminate the theme flash (R02)
A 10-line blocking `<script>` in `<head>` that reads `focuslab:theme` from localStorage and applies `data-theme` before React mounts eliminates the jarring light-to-dark flash for night-mode users. This is one of the most-noticed PWA quality issues.

---

## Static Export Confirmation

The app uses `output: 'export'` in `next.config.mjs`. No server-only features (no `getServerSideProps`, no API routes, no `headers()` / `cookies()` / `revalidate`). The build generates 40 static HTML pages into `out/`. **The app can remain a Render Static Site with no changes.**

## Fonts & Images

- **Fonts:** Atkinson Hyperlegible Next Variable via `@fontsource-variable` (self-hosted woff2). Archivo and Hind Siliguri via `next/font`. 14 woff2 files total, all < 50 kB each. ✅
- **Images:** Only three icons: `icon.svg`, `icon-192.png`, `icon-512.png`. All under 100 kB. ✅
- **Recharts:** Lazy-loaded via `next/dynamic` in `ResultsView.tsx:12`. ✅
- **Unused dependencies:** None found — all `package.json` dependencies are imported somewhere. The `storage.ts` + `legacy-types.ts` dead code does not pull in extra deps.
