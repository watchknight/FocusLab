# FocusLab design bible v3: "Rack Focus"

Read this before any UI task. Target look: `docs/target/hero.png` (Studio profile). Match its composition, scale and polish, then improve on it.

## 1. Idea

Rack focus is the cinematographer's move of shifting sharpness from one subject to another. FocusLab tells the same story: the world is blurry with distractions, and the product helps you measure what brings you into focus. The visual language is photographic: aperture, viewfinder HUD, bokeh, lens coatings.

Principles
1. One hero object per screen. On marketing pages it is the lens. On test screens it is the stimulus.
2. Sharpness is meaning. Evidence strength is shown as sharpness; during tests everything except the task softens (calm mode).
3. Measured, never hyped. No invented numbers, testimonials or "% improved" claims. Proof is transparency: every counter is computed from `src/content`.
4. Instruments, not decoration. HUD brackets, readouts and dials appear only where they carry information or invite interaction.
5. Expressive when idle, silent when measuring. Rich motion on marketing and results screens; nothing decorative during the Check, a focus run or a breathing player.

## 2. Colour

The interface is neutral. Colour comes only from imagery (bokeh, lens coatings), evidence tiers and charts. There is no accent colour. All pairs below were verified for WCAG contrast (text 4.5:1, UI 3:1).

| Token | Studio | Darkroom | Contrast |
|---|---|---|---|
| bg | #F1F3F5 | #0C0E13 | #000000 |
| bg-deep | #E6E9ED | #07080B | #000000 |
| surface | #FFFFFF | #14171E | #000000 |
| surface-2 | #F7F8FA | #1B1F28 | #101010 |
| border | #DDE1E6 | #2A2F3B | #FFFFFF |
| border-strong | #7D8491 | #6B7383 | #FFFFFF |
| text | #0E0F12 | #F2F3F5 | #FFFFFF |
| muted | #555B66 | #A3A9B5 | #E6E6E6 |
| primary-bg | #0E0F12 | #F2F3F5 | #FFFFFF |
| primary-text | #FFFFFF | #0C0E13 | #000000 |
| ring | #0E0F12 | #FFFFFF | #FFD60A |
| tier-strong | #0A7A47 | #5FE3A1 | #6DFFB0 |
| tier-moderate | #1F4FD8 | #7FA8FF | #8CD3FF |
| tier-mixed | #7A3FD1 | #C3A6FF | #E0C2FF |
| tier-emerging | #0A7A7D | #4FD6D6 | #5FFFF0 |
| tier-not-supported | #B42318 | #FF8A8A | #FF9C9C |

Glass (derived, not a hex): `--glass: color-mix(in srgb, var(--surface) 62%, transparent)` with `backdrop-filter: blur(18px) saturate(1.4)` and a 1px border. At most 3 glass elements per viewport; solid surface in lite and off modes.

Fixed viewfinder stage (never themed, so the Check looks identical every day and results stay comparable across profiles): stage-bg #07080B, stimulus #FFFFFF, counter #F2F3F5, hud #9AA1AE.

Imagery-only colour
- Bokeh, Studio: #CDBBFF, #FFC9A9, #B4F0D8, #B4D8FF, #FFD9EC. Darkroom: #5B3DFF at 35%, #00BFA6 at 28%, #FF9F43 at 25%, #FF5C93 at 22%. Contrast: none.
- Lens coatings (three hairline rings on the lens): #C03CFF 30%, #35FFA5 24%, #FFB84A 22%. The iridescent coating may appear in only three UI places: the lens rim, the primary-button hover sheen, the focus-ring outer glow.

Profiles: default System. The user may force Studio, Darkroom or Contrast. Test stages always use the fixed stage tokens.

## 3. Type

- Bricolage Grotesque (axes opsz, wdth; weights 200-800) for text and display.
- Martian Mono (400, 500) for HUD readouts and live counters only.
- Anek Bangla for Bengali (fallback Hind Siliguri). Bengali font: preload false.
- Self-host through `next/font`. If a font is missing from `next/font/google`, use its `@fontsource` package.

Display style: weight 780, font-stretch 92%, letter-spacing -0.02em (never tighter; glyphs must not touch), line-height 0.92, `text-wrap: balance`.

Scale: h1 `clamp(3rem, 1.2rem + 8vw, 8.5rem)`; h2 `clamp(2.25rem, 1rem + 4.4vw, 5rem)`; h3 `clamp(1.375rem, 1.05rem + 1.2vw, 2rem)`; body 1.0625rem/1.6 (1rem under 640px); small and HUD 0.875rem. Max line length 66ch. Tabular numerals on every counter.

## 4. Layout, shape, components

- Grid: 12 columns, max width 1320px, gutter `clamp(16px, 2.2vw, 32px)`, page margin `clamp(20px, 5vw, 72px)`. Section padding-block `clamp(88px, 12vw, 192px)`. Hero `min-height: 100svh`.
- Radii: 10 (inputs, chips), 16 (panels, plates), 28 (glass cards), 999 (buttons, pills). Hairline 1px `border`.
- Button: pill, 52px tall (44px minimum), padding-inline 28px. Primary = primary-bg / primary-text. Secondary = glass with border. Ghost = text with an underline that grows from the left. Primary hover: an iridescent sheen sweeps across (600ms) and, in fx full, the button is magnetic.
- Chip and segmented control: pill, selected = primary.
- Panel: surface, radius 16, 1px border. Plate: a Panel with a caption strip at the bottom that holds the EvidenceMeter.
- EvidenceMeter: a 28px focus-target icon plus the tier label. strong = solid circle, crosshair, four corner brackets. moderate = solid circle, crosshair, two brackets. mixed = dashed circle plus crosshair. emerging = dotted circle. not-supported = circle with a diagonal slash. Tier colour on strokes and label; never colour alone. On hover or focus (fx full) the icon rack-focuses (blur 3px to 0, 300ms).
- HUD marks: four 28px corner brackets, 2px, 55% opacity, at the corners of the hero and the test stage.
- Focus ring: 2px `ring` colour, 2px offset, plus the iridescent outer glow where allowed.

## 5. Imagery and texture

- `<Lens>` (SVG, `src/components/Lens.tsx`) is the hero object, the intro, the breath pacer and the 404. Drive it with `applyAperture` / `tweenAperture`.
- Bokeh: radial-gradient divs, no big CSS blur filters. At most 7 large (140-330px) and 10 small crisp discs (14-46px, 1px white edge). Drift and pointer parallax only in fx full.
- Glint: a conic-gradient highlight (about 25% white) rotating once per 24s over the lens housing, fx full only, paused off-screen.
- Grain: the static `.grain` overlay at 5%. Never animated.
- No stock photos, no emoji, no clip-art icons. Icons are inline SVG, 1.75px stroke.

## 6. Copy deck (plain, active, sentence case)

- H1: "Build focus you can measure."
- Subhead: "Take a 3-minute reaction test, try short practices, and see which ones beat plain rest for you. Free, private, no account."
- Primary CTA: "Start the 3-minute Check". Text link: "How we rate evidence".
- Lens caption states: "Tap the lens to try one reflex." / "Wait for it." / "Too early. Tap the lens to try again." / result "One tap is noisy. The 3-minute Check gives you a baseline."
- Manifesto: "Distraction is loud. Focus is hard to see. So we measure it: three minutes, one reaction test, and an honest comparison against rest."
- How it works: Check, "Three minutes, one tap at a time. You get a baseline that belongs to you." Practice, "Short, graded exercises: breathing, breath counting, a nature break, a walk." Compare, "Run the Check after a practice and after plain rest. See which one actually helps you."
- Evidence section: "How sharp is the evidence?" Sub: "Every tip carries a grade. We say what it is proven for, and what it is not."
- Transparency counters (computed from `src/content`): "{n} studies cited", "{m} claims graded", "{k} graded mixed or weaker. We show those too."
- Final CTA: "Find out what helps you focus." with the primary button.
- Footer notice: "FocusLab is an educational self-experimentation tool and does not provide medical advice, diagnosis, or treatment. Your data stays in your browser."
- Never write "objective" about the Check.

## 7. Landing scenes (route "/")

S0 Intro (first visit per session only). Server-rendered full-screen overlay (#07080B) with the closed lens centred. GSAP opens the iris (`tweenAperture` 0.08 to 0.95, 1.1s), fades the overlay, and the hero starts. Skippable by Esc or any key. Only fx full and `sessionStorage["focuslab:intro"]` unset; set it after playing. lite and off: no overlay. `<noscript>` hides it.

S1 Hero and live demo. Two columns at 1024px and up: headline, subhead and CTAs on the left; the lens on the right, bleeding off the right and bottom edges. Under 1024px: headline, subhead, buttons, then a smaller lens cropped at the bottom. Bokeh field behind. Corner HUD marks. A glass chip over the lens shows the live readout: "Your reaction" with "- ms" until the user taps. The lens IS the demo (a `<button>` with aria-label "Try one reflex"): tap or Space arms it (iris closes to 0.12, label "Wait for it."); after a random 1-4s the iris snaps open (this is the stimulus); the next tap measures with `performance.now()`; the chip scrambles to the result (`scrambleTo`); the iris eases back to 0.5. An early tap shows "Too early. Tap the lens to try again." Not saved. aria-live polite announces only the result. Entrance (fx full): headline masked-line reveal with rack focus (`useHeadlineReveal`); subhead and buttons rise 24px and fade (stagger 0.08); the lens sharpens from blur(18px) and scale 1.06 over 1.4s. Pointer parallax on lens and bokeh (`quickTo`, fine pointer). Primary CTA is magnetic.

S2 Manifesto. One statement at h2 size on `bg-deep`, left aligned. Words sharpen from blur(6px) and 18% opacity to crisp as you scroll (`useFocusScrub`). lite: opacity only.

S3 How it works. At 1024px and up in fx full: a pinned scene with three panels (Check, Practice, Compare) switching by an expanding clip-path circle (`usePinnedScene`, 90% of a viewport of scroll per panel). Left: large display numeral, title, two sentences, a text link. Right: a static device-frame mock built from real components (Check stage with the lens and a "- ms" counter; the breathing lens; a small dot plot of circles versus diamonds). A three-tick progress rail fills with scroll. Everywhere else: three stacked Plates, no pin.

S4 Evidence sharpness. Heading from the copy deck. Five EvidenceMeters at 96px in a row (a column on mobile), each with its label and one line (from the how-we-rate content). In fx full they rack-focus in order on entry (blur 10px to 0, stagger 0.12). Below, one Plate that changes with the selected tier (tabs pattern, arrow keys) and shows one real claim from `src/content`: strong, sleep or if-then; moderate, movement; mixed, noise; emerging, body-doubling; not-supported, brain-training. Title, outcome, summary, caveat.

S5 Transparency. Three counters computed from `src/content`, scrambled to their values on entry. Below, a slow marquee of reference labels (author and year), duplicated for a seamless loop, paused on hover and focus; under off it is a static wrapped list.

S6 FAQ, final CTA, footer. FAQ as `<details>` (five questions) with a CSS grid-template-rows 0fr to 1fr transition. Final CTA: heading from the copy deck, magnetic button, a small lens behind that opens as the section enters. Footer: giant "FocusLab" wordmark that sharpens (blur 12px to 0, scrubbed), notice, links.

## 8. App screens (the viewfinder HUD)

- Check. Intro Panel at reading width; pre-ratings as two 5-step segmented controls. Test stage: fixed stage tokens, calm mode on, corner brackets, a central 80px AF square, the stimulus disc appearing in one frame (no tween), the counter in Martian Mono below. Nothing else moves. Results: median RT scrambles to its value, the trend line draws (DrawSVG), lapses and false starts are labelled numbers, the measurement caution below. Note next to the title: "Lab version validated; this browser version is informal."
- Focus. Setup: a dial (a lens focus ring with 60 SVG ticks, `useDial`, 15 to 90 minutes in 5-minute steps) plus an `<input type="range">` for keyboards; intention and if-then plan; environment checklist. Run: calm mode, ring timer (progress updated once per second), time in Martian Mono, pause / end / "I got distracted", parking lot. Break: the suggested activity as a Plate.
- Breathing. The lens is the pacer: inhale opens it to 0.9, hold stays, exhale closes it to 0.15, durations from `activity.pattern.phases`. Large phase label, thin progress bar. fx off: text and bar only.
- Activities. Bento-style grid (the first card spans two columns), AF-lock hover, EvidenceMeter on every card, filter chips animated with Flip.
- Experiments. A film-strip of run frames (activity versus rest, with the change in ms), a dot plot (circles versus diamonds, DrawSVG), the verdict in large type with the caution directly under it.
- Insights. Stat tiles that scramble when values change, histogram-style time-of-day bars, "Your data" panel.
- Sounds. A knob (Draggable rotation) for volume, level bars that move only while sound plays and no Check is running.
- Learn. Plates with meters; claim pages at reading width with side notes on wide screens; myths as `<details>`.

## 9. Motion system

| data-fx | When | Allowed |
|---|---|---|
| full | no reduced motion, more than 4 cores, deviceMemory above 4 if present, no save-data | everything in this document |
| lite | 4 cores or fewer, deviceMemory 4 or less, or save-data | opacity and transform reveals only; no blur, no cursor, no smooth scroll, no pinned scene, no bokeh drift, no grain, plain fade instead of iris, no intro |
| off | prefers-reduced-motion | no motion; content visible at once; state changes instant; opacity fades up to 150ms |

Calm routes (Check test stage, focus run, breathing players): `data-calm="on"`, no cursor, no smooth scroll, no ScrollTrigger, no page transition, no decorative tweens. While calm, `gsap.globalTimeline.getChildren().length` must be 0; log a console warning in development if it is not.

Easing and time: ease "focus" (cubic-bezier .16, 1, .3, 1) for reveals and locks; power3.inOut for wipes; none for scrubbed scroll. Durations: micro 0.2s, ui 0.4s, reveal 0.9-1.1s, scene scrub 0.6.

Rules: animate transform, opacity and small-area blur only. Pointer effects (cursor, magnetic, parallax) only for `(hover: hover) and (pointer: fine)`. Pinned scenes only from 1024px. Never trap scroll or focus. Call `ScrollTrigger.refresh()` after `document.fonts.ready` and after route layout changes. Nothing flashes; nothing changes faster than 3 times per second.

Budgets (targets, report actual): landing route at most 160 KB gzipped first-load JS, other routes at most 180 KB; register plugins per route (Draggable and Inertia only on Focus and Sounds, Flip only where filters exist, ScrambleText only on result and counter screens). LCP at most 2.5s, INP at most 200ms, CLS at most 0.1.

## 10. Share card (optional, last)

A canvas image (1080 x 1350): the lens, the user's median reaction time and the date, no claims, no health language. Web Share API with a download fallback. Built only from the user's own latest Check.
