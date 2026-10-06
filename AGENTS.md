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

## Design (v2, replaces the old Design section)
Direction: "Cyanotype & Lamp". Attention is a lens: what you attend to is sharp and lit, everything else softens. Three colour profiles (Night, Daylight, Contrast) plus System. Colours come only from CSS variables in src/styles/tokens.css; no raw hex or Tailwind palette colours in components.
Typography: Atkinson Hyperlegible Next (text), Archivo (display, variable width), Hind Siliguri (Bengali), self-hosted through next/font. Body at least 16px, line length at most 70ch, tabular numerals on every timer, score and stat.
Avoid template chrome: no all-caps tracked eyebrow labels, no arrows appended to links or buttons, no "A · B · C" meta strings, no identical rounded cards everywhere, no single accented word in a headline, no gradient washes, no fade-up on every section, no hover-lift on non-interactive cards. Numerals 1-2-3 only for the real Check → Practice → Compare sequence.
Spend boldness in one place: the landing hero. Everything else stays quiet.
Copy: plain, active, sentence case. A button says exactly what happens. Never write "objective" about the Check; it is an informal browser test.

## Motion rules
- Library: Motion (package "motion", import from "motion/react"). Use LazyMotion with the m component; load domAnimation lazily. Do not use domMax or layout animations.
- Animate only transform, opacity and, briefly and on small areas, filter. Never width, height, top or left.
- Timing, easing and spring values live in src/lib/motion.ts. No magic numbers in components.
- Non-user-triggered motion is limited to the hero focus-pull and the hero pointer lamp. Everything else responds to a user action.
- prefers-reduced-motion: opacity-only fades of at most 150 ms; no parallax, pointer lamp or blur.
- Calm mode: while the Check test, a focus session or a breathing player runs, all decorative animation is off (data-calm="on" on <html>) and nothing animates on the main thread during the Check test.
- Low-end mode: if hardwareConcurrency <= 4, deviceMemory <= 4 or saveData is on (feature-detect each), disable blur, backdrop-filter and the pointer lamp.
- Never flash; nothing changes more than 3 times per second.
- Never put a transform on an ancestor of a position: fixed element.

## Responsive rules
- Mobile-first. Breakpoints 360, 640, 768, 1024, 1280, 1536. Test widths 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920.
- No horizontal scroll at any width. A nav never uses a scrollbar. Use min-w-0 on flex and grid children, dvh instead of vh, env(safe-area-inset-*) on fixed bars, scroll-padding-top equal to the sticky header height.
- Fluid type and spacing with clamp(). Container max-width 1200px (reading pages 720px). Content must reflow at 320px width and at 200% text zoom.

## Dependencies and hosting
Allowed new dependency: motion. Fonts through next/font only (or @fontsource-variable packages if next/font lacks a font). FocusLab has no server features: prefer Next.js static export on a Render Static Site (confirm in the audit).

## Workflow for every task
1. Reply with a plan of 8 lines or fewer (files to touch, risks). Do not wait for approval unless something is ambiguous.
2. Implement only what the task asks. Do not refactor unrelated files.
3. Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. Fix every error at its root cause.
4. End with a checklist of the acceptance criteria: done or not done, and how you verified each.
