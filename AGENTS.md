# FocusLab — project rules (read before every task)

## What we are building
FocusLab: a free, local-first web app that helps people build focus through evidence-labelled activities and lets them test what works for them (Check → Practice → Compare). No accounts, no backend, no tracking. Mobile-first.

## Stack (do not add dependencies without asking)
Next.js (App Router), TypeScript (strict), Tailwind CSS, Zustand (persist to localStorage), Recharts, Web Audio API, Vitest. Package manager: npm. Before using any API, read the installed version in package.json and write code for that version.

## Structure
src/app (routes) · src/components/ui · src/features/{check,session,activities,experiments,sounds,insights,learn,environment} · src/lib (pure logic, unit-tested) · src/content (types.ts, evidence.ts, activities.ts, myths.ts) · src/store · docs/

## Honesty rules (most important)
1. Every health or cognition claim shown to users comes from src/content/evidence.ts, which comes from docs/EVIDENCE.md. Never write a scientific claim, number or citation from memory. If a needed source is missing, leave a TODO(evidence) comment and tell me.
2. Every claim names the outcome it is evidenced for (mood, arousal, sustained attention, goal follow-through...). Never say "boosts IQ", "boosts focus" or "brain power".
3. Show the EvidenceBadge (strong / moderate / mixed / emerging / not-supported) wherever an activity or claim appears. Badges use icon + text, never colour alone.
4. FocusLab is not a medical device: no diagnosis, no ADHD screening, no medical advice. The footer, About and Disclaimer pages say so.

## Code rules
- Complete files only. No placeholders, no "// rest of code", no unexplained TODOs.
- Pure logic lives in src/lib with Vitest tests; UI components stay thin. Files under 250 lines. No `any`. No unused code.
- Timing uses performance.now(); timers are computed from timestamps, never from tick counts.
- Accessibility: keyboard operable, visible focus, contrast at least 4.5:1, respects prefers-reduced-motion, aria-live for timers (once per minute), never colour-only meaning, touch targets at least 44px.
- Performance: no image over 100 KB, lazy-load charts, no external fonts, CDNs or analytics.
- Privacy: all data stays in the browser. Provide Export JSON, Import JSON (validated) and Delete all data.
- Never run destructive git commands. Never run `npm audit fix --force`.

## Design (v3, replaces the old Design and Motion sections)
Direction: "Rack Focus" (photographic language: aperture, viewfinder HUD, bokeh, lens coatings). The full specification is docs/DESIGN-V3.md. Read it before any UI task. The target look is docs/target/hero.png.
The interface is neutral and has no accent colour. Colours come only from tokens in src/styles/tokens.css; no raw hex or Tailwind palette colours in components. Three profiles (Studio, Darkroom, Contrast) plus System. Test stages (Check, focus run, breathing players) use the fixed stage tokens in every profile.
Type: Bricolage Grotesque (text and display), Martian Mono (HUD readouts and live counters only), Anek Bangla (Bengali), self-hosted through next/font. Display letter-spacing never tighter than -0.02em.
Avoid template chrome: no all-caps tracked eyebrows, no arrows on links or buttons, no "A · B · C" meta strings, no identical rounded cards in a row, no gradient washes (the iridescent coating is allowed only on the lens rim, the primary-button hover sheen and the focus-ring glow), no stock imagery, no fake numbers, testimonials or "% improved" claims. Never write "objective" about the Check.

## Motion rules (v3, GSAP)
- Library: GSAP from the public "gsap" package with "@gsap/react" (useGSAP). Every plugin we use (ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin, ScrambleTextPlugin, DrawSVGPlugin, CustomEase) is free and ships in "gsap". Never look for a licence, trial package or private registry. Lenis only for smooth scroll. Remove the old "motion" package and every Motion import.
- Register plugins in src/lib/gsap.ts. Animate only inside useGSAP with a scope (automatic cleanup). Never mix a CSS transition and GSAP on the same property.
- Animate transform, opacity and, on small areas, filter blur. Never width, height, top or left. Use quickTo for pointer-driven values.
- fx tiers come from html[data-fx] (full, lite, off), set before first paint by FX_SCRIPT. lite (low-end or save-data): opacity and transform reveals only; no blur, cursor, smooth scroll, pinned scene, bokeh drift or grain. off (prefers-reduced-motion): no motion, content visible at once, opacity fades of at most 150 ms.
- Calm routes (Check test stage, focus run, breathing players): html[data-calm="on"], every decorative animation off, no ScrollTrigger, cursor, smooth scroll or page transition. While calm, gsap.globalTimeline.getChildren().length must be 0.
- Above-the-fold animated elements carry data-hide-until-js; set data-js-ready on <html> when GSAP mounts. Below-the-fold elements are never pre-hidden.
- Pointer effects only for (hover: hover) and (pointer: fine). Pinned scenes only from 1024px. Never trap scroll or focus.
- Call ScrollTrigger.refresh() after document.fonts.ready and after route layout changes. Nothing flashes; nothing changes faster than 3 times per second.
- Easing "focus" (cubic-bezier .16,1,.3,1) for reveals and locks, power3.inOut for wipes, none for scrubbed scroll. Durations: micro 0.2, ui 0.4, reveal 0.9-1.1, scene scrub 0.6.

## Responsive rules
- Mobile-first. Breakpoints 360, 640, 768, 1024, 1280, 1536. Test widths 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920.
- No horizontal scroll at any width. A nav never uses a scrollbar. Use min-w-0 on flex and grid children, dvh instead of vh, env(safe-area-inset-*) on fixed bars, scroll-padding-top equal to the sticky header height.
- Fluid type and spacing with clamp(). Container max-width 1200px (reading pages 720px). Content must reflow at 320px width and at 200% text zoom.

## Dependencies and hosting (updated)
Allowed new dependencies: gsap, @gsap/react, lenis. Fonts through next/font only (or @fontsource packages if next/font lacks a font). Keep the Responsive rules and the Honesty rules unchanged.

## Workflow for every task
1. Reply with a plan of 8 lines or fewer (files to touch, risks). Do not wait for approval unless something is ambiguous.
2. Implement only what the task asks. Do not refactor unrelated files.
3. Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. Fix every error at its root cause.
4. End with a checklist of the acceptance criteria: done or not done, and how you verified each.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
