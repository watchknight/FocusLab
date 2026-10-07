# FocusLab v3 "Rack Focus" Engineering & Art Direction Teardown & Rebuild Plan

## Files Opened and Inspected

The following files were directly opened, inspected, and analyzed to construct this teardown and execution plan:

- **Root & Documentation**:
  - [`AGENTS.md`](file:///d:/Projects/FocusLab/AGENTS.md)
  - [`AGENTS-v3-patch.md`](file:///d:/Projects/FocusLab/AGENTS-v3-patch.md)
  - [`package.json`](file:///d:/Projects/FocusLab/package.json)
  - [`inventory_report.md`](file:///d:/Projects/FocusLab/inventory_report.md)
  - [`docs/DESIGN-V3.md`](file:///d:/Projects/FocusLab/docs/DESIGN-V3.md)
  - [`docs/EVIDENCE.md`](file:///d:/Projects/FocusLab/docs/EVIDENCE.md)
  - [`docs/REDESIGN-AUDIT.md`](file:///d:/Projects/FocusLab/docs/REDESIGN-AUDIT.md)
  - `docs/target/hero.png` (visual specification)
- **Styles & Scripts**:
  - [`src/styles/tokens.css`](file:///d:/Projects/FocusLab/src/styles/tokens.css)
  - [`src/styles/fx.css`](file:///d:/Projects/FocusLab/src/styles/fx.css)
  - [`src/app/globals.css`](file:///d:/Projects/FocusLab/src/app/globals.css)
  - [`src/app/fonts.ts`](file:///d:/Projects/FocusLab/src/app/fonts.ts)
  - [`scripts/generate-sw.mjs`](file:///d:/Projects/FocusLab/scripts/generate-sw.mjs)
- **App Shell & Routes**:
  - [`src/app/layout.tsx`](file:///d:/Projects/FocusLab/src/app/layout.tsx)
  - [`src/app/page.tsx`](file:///d:/Projects/FocusLab/src/app/page.tsx)
  - [`src/app/template.tsx`](file:///d:/Projects/FocusLab/src/app/template.tsx)
  - [`src/app/not-found.tsx`](file:///d:/Projects/FocusLab/src/app/not-found.tsx)
  - [`src/app/robots.ts`](file:///d:/Projects/FocusLab/src/app/robots.ts)
  - [`src/app/sitemap.ts`](file:///d:/Projects/FocusLab/src/app/sitemap.ts)
  - [`src/app/check/page.tsx`](file:///d:/Projects/FocusLab/src/app/check/page.tsx)
  - [`src/app/focus/page.tsx`](file:///d:/Projects/FocusLab/src/app/focus/page.tsx)
  - [`src/app/activities/page.tsx`](file:///d:/Projects/FocusLab/src/app/activities/page.tsx)
  - [`src/app/activities/[id]/page.tsx`](file:///d:/Projects/FocusLab/src/app/activities/%5Bid%5D/page.tsx)
  - [`src/app/experiments/page.tsx`](file:///d:/Projects/FocusLab/src/app/experiments/page.tsx)
  - [`src/app/insights/page.tsx`](file:///d:/Projects/FocusLab/src/app/insights/page.tsx)
  - [`src/app/sounds/page.tsx`](file:///d:/Projects/FocusLab/src/app/sounds/page.tsx)
  - [`src/app/learn/page.tsx`](file:///d:/Projects/FocusLab/src/app/learn/page.tsx)
  - [`src/app/learn/[claimId]/page.tsx`](file:///d:/Projects/FocusLab/src/app/learn/%5BclaimId%5D/page.tsx)
  - [`src/app/learn/how-we-rate/page.tsx`](file:///d:/Projects/FocusLab/src/app/learn/how-we-rate/page.tsx)
  - [`src/app/learn/myths/page.tsx`](file:///d:/Projects/FocusLab/src/app/learn/myths/page.tsx)
  - [`src/app/about/page.tsx`](file:///d:/Projects/FocusLab/src/app/about/page.tsx)
  - [`src/app/privacy/page.tsx`](file:///d:/Projects/FocusLab/src/app/privacy/page.tsx)
  - [`src/app/disclaimer/page.tsx`](file:///d:/Projects/FocusLab/src/app/disclaimer/page.tsx)
- **Landing & Shared Components**:
  - [`src/components/HomeContent.tsx`](file:///d:/Projects/FocusLab/src/components/HomeContent.tsx)
  - [`src/components/HeroLamp.tsx`](file:///d:/Projects/FocusLab/src/components/HeroLamp.tsx)
  - [`src/components/HeroPointerLamp.tsx`](file:///d:/Projects/FocusLab/src/components/HeroPointerLamp.tsx)
  - [`src/components/ReflexLamp.tsx`](file:///d:/Projects/FocusLab/src/components/ReflexLamp.tsx)
  - [`src/components/Lens.tsx`](file:///d:/Projects/FocusLab/src/components/Lens.tsx)
  - [`src/components/AfCursor.tsx`](file:///d:/Projects/FocusLab/src/components/AfCursor.tsx)
  - [`src/components/IrisTransition.tsx`](file:///d:/Projects/FocusLab/src/components/IrisTransition.tsx)
  - [`src/components/SmoothScroll.tsx`](file:///d:/Projects/FocusLab/src/components/SmoothScroll.tsx)
  - [`src/components/ServiceWorkerRegister.tsx`](file:///d:/Projects/FocusLab/src/components/ServiceWorkerRegister.tsx)
  - [`src/components/DataIntegrityGuard.tsx`](file:///d:/Projects/FocusLab/src/components/DataIntegrityGuard.tsx)
  - [`src/components/MotionProvider.tsx`](file:///d:/Projects/FocusLab/src/components/MotionProvider.tsx)
  - [`src/components/motion/MotionProvider.tsx`](file:///d:/Projects/FocusLab/src/components/motion/MotionProvider.tsx)
  - [`src/components/motion/CalmProvider.tsx`](file:///d:/Projects/FocusLab/src/components/motion/CalmProvider.tsx)
- **UI Components**:
  - [`src/components/ui/Navbar.tsx`](file:///d:/Projects/FocusLab/src/components/ui/Navbar.tsx)
  - [`src/components/ui/BottomNav.tsx`](file:///d:/Projects/FocusLab/src/components/ui/BottomNav.tsx)
  - [`src/components/ui/Footer.tsx`](file:///d:/Projects/FocusLab/src/components/ui/Footer.tsx)
  - [`src/components/ui/Button.tsx`](file:///d:/Projects/FocusLab/src/components/ui/Button.tsx)
  - [`src/components/ui/EvidenceBadge.tsx`](file:///d:/Projects/FocusLab/src/components/ui/EvidenceBadge.tsx)
  - [`src/components/ui/EvidenceMeter.tsx`](file:///d:/Projects/FocusLab/src/components/ui/EvidenceMeter.tsx)
  - [`src/components/ui/Plate.tsx`](file:///d:/Projects/FocusLab/src/components/ui/Plate.tsx)
  - [`src/components/ui/Panel.tsx`](file:///d:/Projects/FocusLab/src/components/ui/Panel.tsx)
  - [`src/components/ui/Card.tsx`](file:///d:/Projects/FocusLab/src/components/ui/Card.tsx)
  - [`src/components/ui/ThemeToggle.tsx`](file:///d:/Projects/FocusLab/src/components/ui/ThemeToggle.tsx)
  - [`src/components/ui/LanguageToggle.tsx`](file:///d:/Projects/FocusLab/src/components/ui/LanguageToggle.tsx)
  - [`src/components/ui/Container.tsx`](file:///d:/Projects/FocusLab/src/components/ui/Container.tsx)
  - [`src/components/ui/Stat.tsx`](file:///d:/Projects/FocusLab/src/components/ui/Stat.tsx)
  - [`src/components/ui/Badge.tsx`](file:///d:/Projects/FocusLab/src/components/ui/Badge.tsx)
  - [`src/components/ui/CountUp.tsx`](file:///d:/Projects/FocusLab/src/components/ui/CountUp.tsx)
  - [`src/components/ui/FormControls.tsx`](file:///d:/Projects/FocusLab/src/components/ui/FormControls.tsx)
  - [`src/components/ui/Toast.tsx`](file:///d:/Projects/FocusLab/src/components/ui/Toast.tsx)
  - [`src/components/ui/FeatureErrorBoundary.tsx`](file:///d:/Projects/FocusLab/src/components/ui/FeatureErrorBoundary.tsx)
- **Feature Modules**:
  - `check`: [`FocusCheckRunner.tsx`](file:///d:/Projects/FocusLab/src/features/check/FocusCheckRunner.tsx), [`IntroView.tsx`](file:///d:/Projects/FocusLab/src/features/check/IntroView.tsx), [`PreRatingView.tsx`](file:///d:/Projects/FocusLab/src/features/check/PreRatingView.tsx), [`TestView.tsx`](file:///d:/Projects/FocusLab/src/features/check/TestView.tsx), [`ResultsView.tsx`](file:///d:/Projects/FocusLab/src/features/check/ResultsView.tsx), [`HistoryChart.tsx`](file:///d:/Projects/FocusLab/src/features/check/HistoryChart.tsx)
  - `session`: [`SessionFlow.tsx`](file:///d:/Projects/FocusLab/src/features/session/SessionFlow.tsx), [`SessionSetupView.tsx`](file:///d:/Projects/FocusLab/src/features/session/SessionSetupView.tsx), [`RunStep.tsx`](file:///d:/Projects/FocusLab/src/features/session/RunStep.tsx), [`RingTimer.tsx`](file:///d:/Projects/FocusLab/src/features/session/RingTimer.tsx), [`BreakStep.tsx`](file:///d:/Projects/FocusLab/src/features/session/BreakStep.tsx), [`IfThenPlanEditor.tsx`](file:///d:/Projects/FocusLab/src/features/session/IfThenPlanEditor.tsx), [`IntentionStep.tsx`](file:///d:/Projects/FocusLab/src/features/session/IntentionStep.tsx), [`ParkingLot.tsx`](file:///d:/Projects/FocusLab/src/features/session/ParkingLot.tsx), [`ReflectionStep.tsx`](file:///d:/Projects/FocusLab/src/features/session/ReflectionStep.tsx), [`RhythmStep.tsx`](file:///d:/Projects/FocusLab/src/features/session/RhythmStep.tsx)
  - `activities`: [`ActivityList.tsx`](file:///d:/Projects/FocusLab/src/features/activities/ActivityList.tsx), [`ActivityCard.tsx`](file:///d:/Projects/FocusLab/src/features/activities/ActivityCard.tsx), [`ActivityDetail.tsx`](file:///d:/Projects/FocusLab/src/features/activities/ActivityDetail.tsx), [`players/ActivityPlayer.tsx`](file:///d:/Projects/FocusLab/src/features/activities/players/ActivityPlayer.tsx), [`players/BreathPacer.tsx`](file:///d:/Projects/FocusLab/src/features/activities/players/BreathPacer.tsx), [`players/BreathCounter.tsx`](file:///d:/Projects/FocusLab/src/features/activities/players/BreathCounter.tsx), [`players/MovementSnack.tsx`](file:///d:/Projects/FocusLab/src/features/activities/players/MovementSnack.tsx), [`players/NatureBreak.tsx`](file:///d:/Projects/FocusLab/src/features/activities/players/NatureBreak.tsx), [`players/QuietRest.tsx`](file:///d:/Projects/FocusLab/src/features/activities/players/QuietRest.tsx), [`players/PlayerShell.tsx`](file:///d:/Projects/FocusLab/src/features/activities/players/PlayerShell.tsx)
  - `experiments`: [`ExperimentCreate.tsx`](file:///d:/Projects/FocusLab/src/features/experiments/ExperimentCreate.tsx), [`ExperimentDetail.tsx`](file:///d:/Projects/FocusLab/src/features/experiments/ExperimentDetail.tsx), [`ExperimentDotPlot.tsx`](file:///d:/Projects/FocusLab/src/features/experiments/ExperimentDotPlot.tsx), [`ExperimentRunner.tsx`](file:///d:/Projects/FocusLab/src/features/experiments/ExperimentRunner.tsx)
  - `insights`: [`InsightsOverview.tsx`](file:///d:/Projects/FocusLab/src/features/insights/InsightsOverview.tsx), [`TimeOfDayChart.tsx`](file:///d:/Projects/FocusLab/src/features/insights/TimeOfDayChart.tsx), [`DataManagement.tsx`](file:///d:/Projects/FocusLab/src/features/insights/DataManagement.tsx)
  - `sounds`: [`NoisePlayer.tsx`](file:///d:/Projects/FocusLab/src/features/sounds/NoisePlayer.tsx), [`EvidencePanel.tsx`](file:///d:/Projects/FocusLab/src/features/sounds/EvidencePanel.tsx)
  - `learn`: [`ClaimList.tsx`](file:///d:/Projects/FocusLab/src/features/learn/ClaimList.tsx), [`ClaimCard.tsx`](file:///d:/Projects/FocusLab/src/features/learn/ClaimCard.tsx), [`MythCard.tsx`](file:///d:/Projects/FocusLab/src/features/learn/MythCard.tsx), [`TierRubric.tsx`](file:///d:/Projects/FocusLab/src/features/learn/TierRubric.tsx)
  - `environment`: [`EnvironmentChecklist.tsx`](file:///d:/Projects/FocusLab/src/features/environment/EnvironmentChecklist.tsx)
  - `onboarding`: [`OnboardingModal.tsx`](file:///d:/Projects/FocusLab/src/features/onboarding/OnboardingModal.tsx), [`RestartOnboardingButton.tsx`](file:///d:/Projects/FocusLab/src/features/onboarding/RestartOnboardingButton.tsx)
- **Content & Logic Libraries**:
  - [`src/content/evidence.ts`](file:///d:/Projects/FocusLab/src/content/evidence.ts)
  - [`src/content/activities.ts`](file:///d:/Projects/FocusLab/src/content/activities.ts)
  - [`src/content/myths.ts`](file:///d:/Projects/FocusLab/src/content/myths.ts)
  - [`src/content/types.ts`](file:///d:/Projects/FocusLab/src/content/types.ts)
  - [`src/lib/aperture.ts`](file:///d:/Projects/FocusLab/src/lib/aperture.ts)
  - [`src/lib/fx-script.ts`](file:///d:/Projects/FocusLab/src/lib/fx-script.ts)
  - [`src/lib/gsap.ts`](file:///d:/Projects/FocusLab/src/lib/gsap.ts)
  - [`src/lib/motion-hooks.tsx`](file:///d:/Projects/FocusLab/src/lib/motion-hooks.tsx)
  - [`src/lib/motion.ts`](file:///d:/Projects/FocusLab/src/lib/motion.ts)
  - [`src/lib/pvt.ts`](file:///d:/Projects/FocusLab/src/lib/pvt.ts)
  - [`src/lib/conditions.ts`](file:///d:/Projects/FocusLab/src/lib/conditions.ts)
  - [`src/lib/experiments.ts`](file:///d:/Projects/FocusLab/src/lib/experiments.ts)
  - [`src/lib/noise.ts`](file:///d:/Projects/FocusLab/src/lib/noise.ts)
  - [`src/lib/audio.ts`](file:///d:/Projects/FocusLab/src/lib/audio.ts)
  - [`src/lib/storage.ts`](file:///d:/Projects/FocusLab/src/lib/storage.ts)
  - [`src/lib/theme-transition.ts`](file:///d:/Projects/FocusLab/src/lib/theme-transition.ts)
  - [`src/lib/timer.ts`](file:///d:/Projects/FocusLab/src/lib/timer.ts)
  - [`src/lib/wakelock.ts`](file:///d:/Projects/FocusLab/src/lib/wakelock.ts)
  - [`src/lib/focus-trap.ts`](file:///d:/Projects/FocusLab/src/lib/focus-trap.ts)
  - [`src/lib/recommend.ts`](file:///d:/Projects/FocusLab/src/lib/recommend.ts)
- **Store & i18n**:
  - [`src/store/index.ts`](file:///d:/Projects/FocusLab/src/store/index.ts)
  - [`src/store/types.ts`](file:///d:/Projects/FocusLab/src/store/types.ts)
  - [`src/store/useFocusStore.ts`](file:///d:/Projects/FocusLab/src/store/useFocusStore.ts)
  - [`src/store/validation.ts`](file:///d:/Projects/FocusLab/src/store/validation.ts)
  - [`src/i18n/bn.json`](file:///d:/Projects/FocusLab/src/i18n/bn.json)
  - [`src/i18n/en.json`](file:///d:/Projects/FocusLab/src/i18n/en.json)
  - [`src/i18n/index.ts`](file:///d:/Projects/FocusLab/src/i18n/index.ts)

---

## 1. Inventory of Routes and Shared Components

### 1.1 Routes Inventory

| Route | File Path | Current Status & Assessment | Recommendation |
|---|---|---|---|
| `/` | `src/app/page.tsx`, `src/components/HomeContent.tsx` | Contains v2 `HeroLamp` and 3-column editorial text block. Does not match `docs/DESIGN-V3.md` rack-focus scenes (S0–S6) or `docs/target/hero.png`. | **Rewrite**: Replace `HomeContent.tsx` with dedicated Rack Focus landing scenes (S0–S6) featuring `<Lens>`, bokeh, pinned scene, and transparent counters. |
| `/check` | `src/app/check/page.tsx`, `src/features/check/FocusCheckRunner.tsx` | Timing logic in `pvt.ts` and runner step machine is correct and unit-tested. Stimulus stage uses v2 styling (`bg-accent` circle) rather than viewfinder HUD specs. | **Keep logic, Rewrite test stage**: Keep `FocusCheckRunner` step transitions; rewrite `TestView.tsx` to camera HUD (fixed stage tokens, 80px AF square, instantaneous disc stimulus). Restyle `IntroView`, `PreRatingView`, `ResultsView`. |
| `/focus` | `src/app/focus/page.tsx`, `src/features/session/SessionFlow.tsx` | Timer calculations in `timer.ts` are pure timestamp math. `SessionSetupView.tsx` uses standard input cards instead of the 60-tick lens focus ring dial (`useDial`). | **Keep logic, Restyle/Rewrite setup**: Keep `SessionFlow` and block math; replace rhythm inputs with 60-tick SVG focus ring dial (`useDial`). Restyle `RingTimer` with Martian Mono tabular readout. |
| `/activities` | `src/app/activities/page.tsx`, `src/features/activities/ActivityList.tsx` | Pure filtering logic is sound. Card layout is a plain repetitive grid rather than a Bento-style arrangement with optical AF-lock hover states. | **Keep logic, Restyle**: Keep category filter logic; re-architect grid to Bento-style (first card 2-column span), add optical AF-lock hover brackets, and integrate new `EvidenceMeter`. |
| `/activities/[id]` | `src/app/activities/[id]/page.tsx`, `src/features/activities/ActivityDetail.tsx` | Static params generation is compliant with static export. Breathing players currently animate a basic CSS circle scale instead of aperture iris mechanics. | **Keep logic, Rewrite player**: Re-implement `BreathPacer.tsx` using `<Lens>` driven by `tweenAperture` (opening 0.9 on inhale, closing to 0.15 on exhale). Restyle static detail view. |
| `/experiments` | `src/app/experiments/page.tsx`, `src/features/experiments/ExperimentDetail.tsx` | Pre-post and concurrent analysis math in `experiments.ts` is verified. Dot plot uses default Recharts rendering without photographic film-strip aesthetics or DrawSVG line reveals. | **Keep logic, Restyle**: Retain pair evaluation math; restyle dot plot with clean circle vs. diamond markers, add run frame filmstrip representation, display verdict in high-impact display type. |
| `/insights` | `src/app/insights/page.tsx`, `src/features/insights/InsightsOverview.tsx` | Volume aggregation and time-of-day math are pure. Stat tiles use standard numeric rendering rather than optical numeric scrambles. | **Keep logic, Restyle**: Implement `scrambleTo` on numeric readout cards. Restyle time-of-day histogram bars to neutral tokens. |
| `/sounds` | `src/app/sounds/page.tsx`, `src/features/sounds/NoisePlayer.tsx` | Web Audio buffer generators (white/pink/brown noise) are pure and functional. Volume controls use standard HTML sliders instead of a tactile rotary knob. | **Keep logic, Restyle**: Keep Web Audio generator; add rotary volume knob (`Draggable` rotation) and live audio VU level indicators active strictly when noise is playing and test stage is idle. |
| `/learn` | `src/app/learn/page.tsx`, `src/features/learn/ClaimList.tsx` | Filter mechanics and data links are valid. Uses old `EvidenceBadge` pills. | **Keep logic, Restyle**: Update filter pills to v3 shape tokens (`--radius-full`), replace meter representations with new optical focus-target icons. |
| `/learn/[claimId]` | `src/app/learn/[claimId]/page.tsx` | Reading-width view (`max-w-[720px]`). References properly linked to DOIs/PMCs. | **Keep logic, Restyle**: Restyle to reading container standards with v3 Plate strip and optical EvidenceMeter. |
| `/learn/how-we-rate` | `src/app/learn/how-we-rate/page.tsx`, `src/features/learn/TierRubric.tsx` | Rubric accurately transcribes evaluation criteria from `docs/EVIDENCE.md`. | **Keep logic, Restyle**: Restyle rubric rows to display the 5 focus-target glyphs alongside criteria. |
| `/learn/myths` | `src/app/learn/myths/page.tsx`, `src/features/learn/MythCard.tsx` | Accordion built on accessible native `<details>`. | **Keep logic, Restyle**: Retain `<details>`, apply smooth grid row transition (`grid-template-rows: 0fr -> 1fr`), restyle chips. |
| `/about` | `src/app/about/page.tsx` | Plain reading layout, contains medical disclaimers and honesty rules. | **Keep logic, Restyle**: Update typography tokens and container bounds to v3 Studio neutral tokens. |
| `/privacy` | `src/app/privacy/page.tsx` | Direct integration of local data export/import/delete controls. | **Keep logic, Restyle**: Preserve zero-telemetry copy, restyle nested `DataManagement` container. |
| `/disclaimer` | `src/app/disclaimer/page.tsx` | Non-medical device notice, legal compliance. | **Keep logic, Restyle**: Update typography tokens and container bounds. |
| `not-found` (404) | `src/app/not-found.tsx` | Text card with button. | **Rewrite**: Incorporate `<Lens>` centered hero object at 404 state per `docs/DESIGN-V3.md` section 5. |

---

### 1.2 Shared Components Inventory

| Component | File Path | Status | Action Plan |
|---|---|---|---|
| `Navbar` | `src/components/ui/Navbar.tsx` | **Restyle / Rewrite parts** | Remove the old animated sliding indicator (`indicatorRef`, lines 39–78). Match `docs/target/hero.png` navigation: Left aperture icon + bold wordmark FocusLab, center/right clean text links, far right high-contrast black pill "Start the Check". |
| `BottomNav` | `src/components/ui/BottomNav.tsx` | **Restyle** | Retain fixed bottom positioning on mobile; eliminate raw accent highlights, use v3 neutral tokens (`primary-bg`, `text`), replace generic unicode symbols with clean SVGs. |
| `Footer` | `src/components/ui/Footer.tsx` | **Rewrite** | Replace minimal footer with giant "FocusLab" wordmark that sharpens from `blur(12px)` to 0 on scroll (`useFocusScrub`), followed by legal notice and links. |
| `Button` | `src/components/ui/Button.tsx` | **Rewrite** | Eliminate v2 rectangular `rounded-sm` shape and raw `bg-accent`. Rebuild as 52px tall pill (`--radius-full`, 28px padding), primary button with iridescent sheen sweep and magnetic physics (`useMagnetic`) in `fx="full"`. Secondary = glass with border. Ghost = underline slide. |
| `EvidenceMeter` / `EvidenceBadge` | `src/components/ui/EvidenceMeter.tsx`, `EvidenceBadge.tsx` | **Rewrite** | Delete 4-bar signal visualizer. Rebuild as a 28px photographic focus-target icon with crosshairs, circles, and brackets per tier (`docs/DESIGN-V3.md` section 4). Add rack-focus micro-interaction on hover. |
| `Plate` | `src/components/ui/Plate.tsx` | **Restyle** | Update border radius to 16px (`--radius-md`), integrate caption strip with new optical `EvidenceMeter`, and apply v3 surface tokens. |
| `Panel` | `src/components/ui/Panel.tsx` | **Restyle** | Set 16px radius, 1px neutral hairline border, remove legacy shadows. |
| `Card` | `src/components/ui/Card.tsx` | **Keep / Restyle alias** | Maintain as thin semantic wrapper around `Panel`. |
| `ThemeToggle` | `src/components/ui/ThemeToggle.tsx` | **Rewrite profiles** | Migrate from `daylight`/`night` to `studio`/`darkroom`/`contrast`/`system`. Eliminate v2 CSS transitions, use `document.startViewTransition` with iris circular reveal. |
| `LanguageToggle` | `src/components/ui/LanguageToggle.tsx` | **Restyle** | Retain state store and DOM attribute sync; restyle pill segmented control to v3 neutral tokens. |
| `Container` | `src/components/ui/Container.tsx` | **Restyle** | Set max width 1320px for grid containers, 720px for prose containers. Ensure `layout.tsx` does not wrap landing hero in container padding. |
| `Stat` | `src/components/ui/Stat.tsx` | **Restyle** | Ensure tabular numeric readouts use Martian Mono font tokens. |
| `CountUp` | `src/components/ui/CountUp.tsx` | **Keep / Deprecate for GSAP** | Replace custom rAF easing with GSAP `scrambleTo` where appropriate, or preserve as fallback. |
| `Toast` | `src/components/ui/Toast.tsx` | **Restyle** | Eliminate Motion imports; animate with GSAP `useGSAP` or pure CSS token styling. |
| `FormControls` | `src/components/ui/FormControls.tsx` | **Restyle** | Update input radii to 10px (`--radius-sm`), replace `accent-accent` native controls with neutral dark tokens. |
| `FeatureErrorBoundary` | `src/components/ui/FeatureErrorBoundary.tsx` | **Keep logic, Restyle** | Preserve class boundary and reload logic; restyle error fallback card. |
| `Lens` | `src/components/Lens.tsx` | **Keep (New V3)** | Unzipped in v3 starter. Central photographic SVG object driven by `applyAperture` / `tweenAperture`. |
| `AfCursor` | `src/components/AfCursor.tsx` | **Keep (New V3)** | Unzipped in v3 starter. Viewfinder autofocus corner brackets snapping to interactive elements. |
| `IrisTransition` | `src/components/IrisTransition.tsx` | **Keep (New V3)** | Unzipped in v3 starter. Iris wipe page transition. |
| `SmoothScroll` | `src/components/SmoothScroll.tsx` | **Keep (New V3)** | Unzipped in v3 starter. Lenis smooth scroll for fine pointer only. |
| `MotionProvider` / `CalmProvider` | `src/components/motion/MotionProvider.tsx`, `CalmProvider.tsx` | **Rewrite / Delete Motion** | Delete `motion/react` `LazyMotion` provider. Retain `CalmProvider` logic that syncs `data-calm` attribute to `document.documentElement`. |
| `DataIntegrityGuard` | `src/components/DataIntegrityGuard.tsx` | **Keep logic, Restyle** | Retain corrupted localStorage safeguard and manual recovery screen; update styling to neutral tokens. |
| `ServiceWorkerRegister` | `src/components/ServiceWorkerRegister.tsx` | **Keep logic, Restyle** | Retain service worker lifecycle listener and update notification toast. |

---

### 1.3 Visual Leftovers to Delete

```markdown
1. Tokens (src/styles/tokens.css):
   - Delete --accent: #FFC247 (v2 daylight yellow)
   - Delete --on-accent, --accent-edge, --lamp, --signal
   - Delete [data-theme='daylight'] and [data-theme='night'] blocks
   - Delete v2 font variables: --font-text ('Atkinson Hyperlegible Next'), --font-display ('Archivo'), --font-bn ('Hind Siliguri')
   - Delete legacy box-shadows: --shadow, --shadow-elevation

2. Motion / LazyMotion Code:
   - Delete package dependency "motion" from package.json
   - Delete imports from 'motion/react' and 'motion/react-m' across codebase
   - Delete src/components/motion/MotionProvider.tsx (LazyMotion and MotionConfig)
   - Delete Motion variants in src/lib/motion.ts (fadeVariants, popVariants, slideVariants, heroLensVariants)
   - Delete AnimatePresence from src/features/onboarding/OnboardingModal.tsx and src/features/insights/DataManagement.tsx

3. Old Navigation & Hero Elements:
   - Delete the sliding navigation bar indicator (indicatorRef in src/components/ui/Navbar.tsx lines 39–78)
   - Delete src/components/HeroLamp.tsx
   - Delete src/components/HeroPointerLamp.tsx
   - Delete src/components/ReflexLamp.tsx
   - Delete CSS keyframes .hero-focus-pull, .hero-focus-line-1, .hero-focus-line-2 in src/app/globals.css

4. Old Badges & Chrome:
   - Delete the 4-bar signal visualizer in src/components/ui/EvidenceMeter.tsx lines 81–115
   - Delete template-chrome all-caps tracked eyebrow labels
   - Delete unicode symbols in navigation items (○, ◐, ●, ◇, ◬, ▤, ♬, ◈) in src/components/ui/BottomNav.tsx
```

---

## 2. Mapping Landing Scenes and App Screens

### 2.1 Landing Page Scenes (Route `/`)

| Scene | Purpose & Visual Target | Files to Create / Modify | Core Components | Hooks & GSAP Utilities |
|---|---|---|---|---|
| **S0 Intro** | First-visit overlay (#07080B), closed lens centered; iris opens from 0.08 to 0.95 over 1.1s, then hero reveals. Skippable via Esc. | `src/components/landing/IntroOverlay.tsx`, `src/lib/fx-script.ts` | `<Lens>`, full-screen overlay container | `tweenAperture`, `getFx`, `sessionStorage['focuslab:intro']` |
| **S1 Hero & Live Demo** | 2-column layout (headline + CTA left; giant lens bleeding off-screen right). Live reaction test on lens button with frosted sample HUD chip. Viewfinder corner L-brackets. | `src/components/landing/HeroSection.tsx`, `src/components/Lens.tsx`, `src/app/page.tsx` | `<Lens>`, `<Button>` (primary pill), Reaction HUD chip, 4 HUD corner brackets | `useHeadlineReveal`, `useMagnetic`, `tweenAperture`, `applyAperture`, `scrambleTo`, `quickTo` pointer parallax |
| **S2 Manifesto** | Full-width editorial statement on `bg-deep`. Words rack-focus from blur(6px) & 18% opacity to crisp sharpness as scrolled. | `src/components/landing/ManifestoSection.tsx` | Text container with `data-split="scrub"` | `useFocusScrub` |
| **S3 How It Works** | Pinned 3-panel storyboard at >= 1024px (Check, Practice, Compare) switching via expanding circular clip-path with scroll rail. Stacked Plates under 1024px. | `src/components/landing/HowItWorksSection.tsx`, `src/components/ui/Plate.tsx` | Pinned container `[data-panel]`, UI mock frames (Viewfinder stage, Breathing lens, Dot plot) | `usePinnedScene`, ScrollTrigger |
| **S4 Evidence Sharpness** | 5 optical focus-target meters (strong to not-supported) rack-focusing in sequence on entry. Interactive tab displaying real claim Plates. | `src/components/landing/EvidenceSection.tsx`, `src/components/ui/EvidenceMeter.tsx` | 5 focus-target glyphs, tabbed Plate container | `useGSAP` stagger blur reveal (`blur(10px)` to 0), keyboard tabs handler |
| **S5 Transparency** | 3 empirical counters computed from `src/content` scrambled on viewport entry. Marquee of citations below. | `src/components/landing/TransparencySection.tsx` | Monospace counter readouts, infinite citation marquee | `scrambleTo`, GSAP marquee ticker |
| **S6 FAQ, CTA & Footer** | Native `<details>` FAQ with grid-template-rows expansion. Final CTA with opening lens. Giant "FocusLab" wordmark scrubbing to sharpness in footer. | `src/components/landing/FaqSection.tsx`, `src/components/landing/FinalCtaSection.tsx`, `src/components/ui/Footer.tsx` | FAQ `<details>`, CTA pill button, scrubbed SVG wordmark | `useMagnetic`, `tweenAperture`, `useFocusScrub` |

---

### 2.2 App Screens

| Screen | Target Architecture & HUD Treatment | Files to Modify | Components | Hooks & Utilities |
|---|---|---|---|---|
| **Check (`/check`)** | Viewfinder camera HUD. Calm mode on (`html[data-calm="on"]`). Fixed stage tokens (#07080B background, #FFFFFF stimulus, #F2F3F5 counter, #9AA1AE hud). 80px center AF square. Stimulus appears in 1 frame. Results: DrawSVG trend line, scrambled median RT. | `src/features/check/TestView.tsx`, `src/features/check/ResultsView.tsx`, `src/features/check/IntroView.tsx` | AF square, Viewfinder stage, DrawSVG LineChart, Martian Mono counter | `setCalm(true)`, DrawSVGPlugin, `scrambleTo`, `performance.now()` |
| **Focus (`/focus`)** | Setup: 60-tick SVG focus ring dial (`useDial`, 15–90 min in 5-min steps) paired with range input. Run: calm mode, ring timer updating once per second, Martian Mono time. Break: recommended activity as Plate. | `src/features/session/SessionSetupView.tsx`, `src/features/session/RingTimer.tsx`, `src/features/session/RunStep.tsx` | SVG Dial, SVG Ring Timer, Martian Mono clock, Plate | `useDial`, `Draggable`, `setCalm(true)`, `computeTimerSnapshot` |
| **Breathing (`/activities/[id]`)** | Lens aperture is the breath pacer: inhale opens to 0.9, hold stays, exhale closes to 0.15. Durations from activity pattern phases. Large phase label, thin progress bar. | `src/features/activities/players/BreathPacer.tsx`, `src/components/Lens.tsx` | `<Lens>`, thin progress rail | `tweenAperture`, `applyAperture`, `setCalm(true)` |
| **Activities (`/activities`)** | Bento-style grid (1st card spans 2 columns). Viewfinder AF-lock hover effect. Optical EvidenceMeter on all cards. Flip-animated category filter chips. | `src/features/activities/ActivityList.tsx`, `src/features/activities/ActivityCard.tsx` | Bento grid, Filter chips, Plate, EvidenceMeter | Flip plugin, `AfCursor` target locking |
| **Experiments (`/experiments`)** | Film-strip of run frames (activity vs. rest deltas). Dot plot (circles vs. diamonds) with DrawSVG axis/trend reveals. High-contrast verdict display. | `src/features/experiments/ExperimentDetail.tsx`, `src/features/experiments/ExperimentDotPlot.tsx` | Filmstrip container, ScatterChart with custom SVG shapes | DrawSVGPlugin, Martian Mono metrics |
| **Insights (`/insights`)** | Scrambled stat tiles (`scrambleTo`). Neutral histogram time-of-day volume bars. Data management custody controls. | `src/features/insights/InsightsOverview.tsx`, `src/features/insights/TimeOfDayChart.tsx` | Stat tiles, BarChart, DataManagement panel | `scrambleTo`, Recharts |
| **Sounds (`/sounds`)** | Draggable rotary knob for volume (0.0 to 0.6). Audio VU level meters animated only while audio plays and Check is inactive. | `src/features/sounds/NoisePlayer.tsx` | SVG Rotary Knob, Audio level bars | `Draggable` rotation, Web Audio API |
| **Learn (`/learn` + detail)** | 720px reading-width container. Evidence rubric cards with optical focus targets. Accordion myths with CSS grid row transition. | `src/features/learn/ClaimList.tsx`, `src/features/learn/ClaimCard.tsx`, `src/features/learn/MythCard.tsx` | Reading container, Plate, Details | Native grid-row CSS transition |

---

## 3. Risks & Mitigations

### Risk 1: Check Timing Accuracy vs. Animation Interference
- **Source Citation**: [`src/features/check/TestView.tsx:73-85, 122-165`](file:///d:/Projects/FocusLab/src/features/check/TestView.tsx#L73-L85), [`src/lib/pvt.ts:7-10`](file:///d:/Projects/FocusLab/src/lib/pvt.ts#L7-L10), [`AGENTS.md:21, 40-42`](file:///d:/Projects/FocusLab/AGENTS.md#L21), [`docs/DESIGN-V3.md:162-164`](file:///d:/Projects/FocusLab/docs/DESIGN-V3.md#L162-L164).
- **Hazard**: Running CSS keyframe animations, GSAP tweens, cursor listeners, or smooth scroll tickers on the main thread while the PVT-B reaction test runs introduces frame drops and 10–50 ms of variable display latency jitter, invalidating reaction time baselines.
- **Mitigation**:
  1. Trigger calm mode (`html[data-calm="on"]`) in `TestView.tsx`.
  2. In calm mode, explicitly enforce `gsap.globalTimeline.getChildren().length === 0`.
  3. Stimulus disc rendering must be an instantaneous single-frame paint (zero CSS transitions, zero easing tweens).
  4. Response timestamps must be computed strictly via `performance.now()` from the display callback `requestAnimationFrame`.

### Risk 2: Above-the-Fold Pre-Hide and LCP Regression
- **Source Citation**: [`src/styles/fx.css:16-19`](file:///d:/Projects/FocusLab/src/styles/fx.css#L16-L19), [`docs/DESIGN-V3.md:175-177`](file:///d:/Projects/FocusLab/docs/DESIGN-V3.md#L175-L177), [`AGENTS.md:43`](file:///d:/Projects/FocusLab/AGENTS.md#L43).
- **Hazard**: Elements tagged with `data-hide-until-js` start with `visibility: hidden` before JS hydration. If hydration is delayed, script execution is interrupted, or an error occurs, the primary hero headline remains invisible, crashing Largest Contentful Paint (LCP) and creating a broken blank screen.
- **Mitigation**:
  1. Rely on the CSS keyframe safety net defined in `fx.css`: `animation: fx-safety 0s 2.5s forwards` forces visibility after 2.5 seconds regardless of JS execution.
  2. Set `html[data-js-ready]` immediately when GSAP initializes in `src/app/layout.tsx`.
  3. Never place `data-hide-until-js` on below-the-fold elements.
  4. When `html[data-fx="off"]` is active (prefers-reduced-motion or low power), bypass `data-hide-until-js` entirely so content renders immediately on first paint.

### Risk 3: ScrollTrigger Instance Leaks on Client-Side Navigation
- **Source Citation**: [`src/lib/gsap.ts:14-16`](file:///d:/Projects/FocusLab/src/lib/gsap.ts#L14-L16), [`src/lib/motion-hooks.tsx:1-126`](file:///d:/Projects/FocusLab/src/lib/motion-hooks.tsx#L1-L126), [`src/app/layout.tsx:144-157`](file:///d:/Projects/FocusLab/src/app/layout.tsx#L144-L157).
- **Hazard**: In Next.js App Router, navigating between pages without page reloads leaves ScrollTrigger instances bound to unmounted DOM elements, leaking event listeners, causing scroll position conflicts, and throwing `ScrollTrigger.refresh()` calculation errors.
- **Mitigation**:
  1. Author all GSAP scroll animations exclusively inside `useGSAP` with a scoped `scope: containerRef`, ensuring automatic cleanup of timelines and triggers on component unmount.
  2. In `src/app/template.tsx` or a global navigation observer, trigger `ScrollTrigger.refresh()` after route changes and after `document.fonts.ready` resolves.

### Risk 4: Static Export Compatibility
- **Source Citation**: [`next.config.mjs:20-26`](file:///d:/Projects/FocusLab/next.config.mjs#L20-L26), [`src/app/activities/[id]/page.tsx:12-18`](file:///d:/Projects/FocusLab/src/app/activities/%5Bid%5D/page.tsx#L12-L18), [`src/app/learn/[claimId]/page.tsx:15-21`](file:///d:/Projects/FocusLab/src/app/learn/%5BclaimId%5D/page.tsx#L15-L21).
- **Hazard**: Next.js configured with `output: 'export'` fails build compilation if any route uses runtime server headers, cookies, dynamic URL parameters without static generation, or non-static images.
- **Mitigation**:
  1. Keep `export const dynamicParams = false;` and explicit `generateStaticParams()` on all dynamic routes (`/activities/[id]` and `/learn/[claimId]`).
  2. Maintain `images: { unoptimized: true }` and `trailingSlash: true` in `next.config.mjs`.
  3. Ensure no route components reference server headers, cookies, or middleware.

### Risk 5: Bengali Typography & Script Rendering
- **Source Citation**: [`src/app/fonts.ts:30-36`](file:///d:/Projects/FocusLab/src/app/fonts.ts#L30-L36), [`src/app/globals.css:82-93`](file:///d:/Projects/FocusLab/src/app/globals.css#L82-L93), [`docs/DESIGN-V3.md:52-54`](file:///d:/Projects/FocusLab/docs/DESIGN-V3.md#L52-L54), [`src/i18n/bn.json:1-139`](file:///d:/Projects/FocusLab/src/i18n/bn.json#L1-L139).
- **Hazard**: Bengali script possesses complex conjunct clusters (যুক্তবর্ণ) and distinct vertical ascender/descender metrics compared to Latin letterforms. Applying negative letter-spacing (`-0.02em`) breaks conjunct rendering and clips vertical diacritics under tight display line-heights (`0.92`).
- **Mitigation**:
  1. Self-host `Anek Bangla` (fallback `Hind Siliguri`) via `next/font` with `preload: false` per specification.
  2. In `src/app/globals.css`, enforce `letter-spacing: normal !important` and minimum `line-height: 1.2 !important` whenever `html[lang='bn']` is active.
  3. Verify conjunct rendering in Bengali across mobile and desktop test widths.

### Risk 6: Bundle Size Bloat from GSAP Plugins
- **Source Citation**: [`src/lib/gsap.ts:3-12`](file:///d:/Projects/FocusLab/src/lib/gsap.ts#L3-L12), [`docs/DESIGN-V3.md:175-177`](file:///d:/Projects/FocusLab/docs/DESIGN-V3.md#L175-L177), [`package.json:16-17`](file:///d:/Projects/FocusLab/package.json#L16-L17).
- **Hazard**: Registering all GSAP plugins (ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin, ScrambleTextPlugin, DrawSVGPlugin, CustomEase) in the root bundle exceeds the 160 KB gzipped landing route budget.
- **Mitigation**:
  1. Register only base GSAP, useGSAP, ScrollTrigger, SplitText, and CustomEase in the core `gsap.ts`.
  2. Code-split and register specialized plugins dynamically or on route:
     - `Draggable` and `InertiaPlugin` only on `/focus` and `/sounds`.
     - `Flip` only on `/activities`.
     - `DrawSVGPlugin` only on `/check` and `/experiments`.
     - `ScrambleTextPlugin` only on `/` transparency section, `/check` results, and `/insights`.
  3. Remove the legacy `motion` package to shed its bundle footprint.

### Risk 7: Pinned Storyboard Scenes on Mobile Devices
- **Source Citation**: [`src/lib/motion-hooks.tsx:75-96`](file:///d:/Projects/FocusLab/src/lib/motion-hooks.tsx#L75-L96), [`docs/DESIGN-V3.md:104-106, 172`](file:///d:/Projects/FocusLab/docs/DESIGN-V3.md#L104-L106).
- **Hazard**: Scroll-pinned scenes on mobile touchscreens cause scroll locking, interfere with browser dynamic address-bar resizing, and create disorienting jumps.
- **Mitigation**:
  1. Enforce media query guard in `usePinnedScene`: `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`.
  2. Below 1024px or on touch devices, render S3 (How It Works) as 3 stacked `<Plate>` components with standard native vertical scrolling.

### Risk 8: Stale Service Worker Caches During Visual Rebuild
- **Source Citation**: [`scripts/generate-sw.mjs:9-10, 128-143`](file:///d:/Projects/FocusLab/scripts/generate-sw.mjs#L9-L10), [`src/components/ServiceWorkerRegister.tsx:8-50`](file:///d:/Projects/FocusLab/src/components/ServiceWorkerRegister.tsx#L8-L50), [`public/sw.js:1-60`](file:///d:/Projects/FocusLab/public/sw.js#L1-L60).
- **Hazard**: The PWA service worker utilizes Cache-First strategy for static assets. Returning users will load cached v2 chunks, resulting in mismatched stylesheets, broken chunk imports, and inconsistent UI state.
- **Mitigation**:
  1. Update `generate-sw.mjs` to embed a dynamic build timestamp / commit hash in `CACHE_NAME` (`focuslab-cache-${commitHash}`).
  2. In `ServiceWorkerRegister.tsx`, when `updatefound` detects a new worker waiting, trigger an accessible non-intrusive toast: "New version ready - Reload".
  3. On reload click, send `SKIP_WAITING` to force immediate activation and call `clients.claim()`.
  4. In development and on localhost, ensure automatic unregistration and cache deletion remains active (`ServiceWorkerRegister.tsx:58-71`).

---

## 4. Work Sequence & Execution Order

We review the work sequence:
1. **Foundation**
2. **Shell & Brand**
3. **Hero**
4. **Landing Scenes**
5. **Viewfinder Screens**
6. **Remaining Screens**
7. **Performance**
8. **QA**

### Assessment:
This sequence is validated without alteration.
- **Rationale**:
  - *Foundation* (tokens, typography, fx script, GSAP core setup) must exist before any UI component can consume the neutral tokens or photographic type scales.
  - *Shell & Brand* establishes global viewport constraints, header/nav layout, and cursor/smooth scroll infrastructure required by all pages. Crucially, removing the outer `<Container>` wrap in `layout.tsx` is required before the full-bleed Hero can render.
  - *Hero* introduces the primary `<Lens>` SVG object and validates the central visual target (`docs/target/hero.png`).
  - *Landing Scenes* complete the S0–S6 narrative on route `/`.
  - *Viewfinder Screens* apply the optical camera HUD to the primary interaction loops (Check test stage, focus session dial, breathing lens pacer).
  - *Remaining Screens* restyle Activities, Experiments, Insights, Sounds, and Learn.
  - *Performance & QA* ensure bundle budgets, calm mode timeline checks, responsive bounds, and scientific honesty compliance.

---

## 5. Scientific Claims, Counters, and Data Origins

Every health or cognition claim and numeric counter displayed in the v3 interface originates from verified content files in `src/content/`. Nothing is hard-coded.

### 5.1 Transparency Counters (Landing Scene S5)

- **Counter 1: Studies Cited (`{n} studies cited`)**
  - **Source**: `REFERENCES.length` from [`src/content/evidence.ts:5-76`](file:///d:/Projects/FocusLab/src/content/evidence.ts#L5-L76).
  - **Current Value**: `24` peer-reviewed publications.
  - **Origin**: Verbatim citations transcribed from `docs/EVIDENCE.md`.
- **Counter 2: Claims Graded (`{m} claims graded`)**
  - **Source**: `CLAIMS.length` from [`src/content/evidence.ts:80-177`](file:///d:/Projects/FocusLab/src/content/evidence.ts#L80-L177).
  - **Current Value**: `16` empirical claims.
- **Counter 3: Mixed or Weaker Claims (`{k} graded mixed or weaker. We show those too.`)**
  - **Source**: `CLAIMS.filter(c => ['mixed', 'emerging', 'not-supported'].includes(c.tier)).length` from [`src/content/evidence.ts`](file:///d:/Projects/FocusLab/src/content/evidence.ts).
  - **Current Value**: `7` claims (`breaks-performance`, `nature-attention`, `phone-presence`, `noise`, `binaural`, `brain-training`, `body-doubling`).

### 5.2 Real Claims Displayed by Tier (Landing Scene S4)

| Tier | Claim ID | Target Outcome | Summary / Caveat Source |
|---|---|---|---|
| **Strong** | `if-then` | goal follow-through | [`src/content/evidence.ts:129-134`](file:///d:/Projects/FocusLab/src/content/evidence.ts#L129-L134) (Gollwitzer & Sheeran 2006). Outcome is goal attainment, not attention capacity. |
| **Moderate** | `movement` | executive function | [`src/content/evidence.ts:111-116`](file:///d:/Projects/FocusLab/src/content/evidence.ts#L111-L116) (Moreau & Chou 2019, Chang et al. 2012). Acute exercise bout. |
| **Mixed** | `noise` | attention-task performance | [`src/content/evidence.ts:141-146`](file:///d:/Projects/FocusLab/src/content/evidence.ts#L141-L146) (Nigg et al. 2024). Small benefit for ADHD cohorts; negative for neurotypical controls. |
| **Emerging** | `body-doubling` | starting and sustaining tasks | [`src/content/evidence.ts:159-164`](file:///d:/Projects/FocusLab/src/content/evidence.ts#L159-L164) (Ara et al. 2025). Virtual co-working / presence; preliminary literature. |
| **Not Supported** | `brain-training` | transfer to everyday attention | [`src/content/evidence.ts:153-158`](file:///d:/Projects/FocusLab/src/content/evidence.ts#L153-L158) (Melby-Lervåg et al. 2016, Simons et al. 2016). No far transfer beyond trained tasks. |

### 5.3 Test & Measurement Parameters

- **Focus Check (PVT-B)**:
  - Duration: `3 minutes` (`TOTAL_TEST_DURATION_MS = 180000`, [`src/lib/pvt.ts:7`](file:///d:/Projects/FocusLab/src/lib/pvt.ts#L7)).
  - Random ISI: Uniform `1000 ms to 4000 ms` (`MIN_ISI_MS = 1000`, `MAX_ISI_MS = 4000`, [`src/lib/pvt.ts:9-10`](file:///d:/Projects/FocusLab/src/lib/pvt.ts#L9-L10)).
  - Anticipation / False Start: Reaction time `< 100 ms` (`MIN_VALID_RT_MS = 100`, [`src/lib/pvt.ts:3`](file:///d:/Projects/FocusLab/src/lib/pvt.ts#L3)).
  - Attention Lapse Threshold: Reaction time `>= 355 ms` (`LAPSE_THRESHOLD_MS = 355`, [`src/lib/pvt.ts:4`](file:///d:/Projects/FocusLab/src/lib/pvt.ts#L4), Basner & Dinges 2011).
  - Timeout: `10000 ms` (`TIMEOUT_MS = 10000`, [`src/lib/pvt.ts:5`](file:///d:/Projects/FocusLab/src/lib/pvt.ts#L5)).
- **Focus Session Dial**:
  - Range: `15 to 90 minutes` in `5-minute` steps (`docs/DESIGN-V3.md:120`, inferred to match `useDial` options).
- **Breathing Pacer Durations**:
  - Cyclic Sighing: Inhale 2s, Top-up 1s, Exhale 6s ([`src/content/activities.ts:26-28`](file:///d:/Projects/FocusLab/src/content/activities.ts#L26-L28)).
  - Box Breathing: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s ([`src/content/activities.ts:50-53`](file:///d:/Projects/FocusLab/src/content/activities.ts#L50-L53)).
  - Aperture opening geometry: Inhale opens to 0.9, hold remains steady, exhale closes to 0.15 (`docs/DESIGN-V3.md:124`).

### 5.4 Copy Overstatement Audit

- **The word "objective"**:
  - Rule: Never write "objective" about the Check (`AGENTS.md:32`, `docs/DESIGN-V3.md:91`).
  - Audit: Full-text scan confirms zero instances of "objective" in active UI copy in `src/`. A stale translation in Bengali (`বস্তুনিষ্ঠ`) was previously identified in [`docs/REDESIGN-AUDIT.md:47`](file:///d:/Projects/FocusLab/docs/REDESIGN-AUDIT.md#L47) and resolved in [`src/i18n/bn.json:118`](file:///d:/Projects/FocusLab/src/i18n/bn.json#L118) (`এই সেশনের জন্য আপনার মনোযোগের কার্যকারিতার সংক্ষিপ্ত বিবরণ।`).
- **Informal Validation Notice**:
  - The Focus Check must be labelled with the exact disclaimer: *"Lab version validated; this browser version is informal."* ([`src/features/check/IntroView.tsx:24`](file:///d:/Projects/FocusLab/src/features/check/IntroView.tsx#L24), [`src/features/check/ResultsView.tsx:89`](file:///d:/Projects/FocusLab/src/features/check/ResultsView.tsx#L89), `docs/DESIGN-V3.md:117`).
- **Outcome Naming Discipline**:
  - Claims must name their precise empirical outcome (e.g., vigor, fatigue, arousal, lapses, goal attainment) and must never claim "boosts focus", "improves IQ", or "trains your brain" (`AGENTS.md:12`).

---

## 6. What I Could Not Verify (Explicit Estimations & Inferences)

1. **Exact Gzipped First-Load JS Bundle Size**:
   - *Inferred*: Tree-shaking GSAP plugins per route will maintain first-load landing JS under 160 KB. Exact gzipped bytes cannot be verified until Next.js production build (`npm run build`) runs with chunk analyzer.
2. **Physical Touch-Screen Feel of the SVG Focus Ring Dial**:
   - *Inferred*: The 60-tick rotary dial implemented with `Draggable` rotation and momentum inertia will provide smooth 60fps response on mobile viewports. Exact tactile friction on physical mobile devices requires direct touch device QA.
3. **Cross-Platform Font Rendering Metrics**:
   - *Inferred*: Bricolage Grotesque and Martian Mono font metrics are assumed to load cleanly via `next/font` without layout shifts (CLS < 0.1). Actual optical rendering across different OS font engines (DirectWrite on Windows vs. CoreText on macOS/iOS) must be visually confirmed once font definitions are mounted.
