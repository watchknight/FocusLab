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

## Design
Calm and low-stimulation. Tokens as CSS variables: warm-grey surfaces, one deep-teal accent, 8px grid, max text width 65ch, two font weights. Dark mode via prefers-color-scheme plus a toggle. No confetti, streak-loss guilt, urgency timers or dark patterns.

## Workflow for every task
1. Reply with a plan of 8 lines or fewer (files to touch, risks). Do not wait for approval unless something is ambiguous.
2. Implement only what the task asks. Do not refactor unrelated files.
3. Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. Fix every error at its root cause.
4. End with a checklist of the acceptance criteria: done or not done, and how you verified each.
