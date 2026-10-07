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

## Dependencies and hosting (updated)
Allowed new dependencies: gsap, @gsap/react, lenis. Fonts through next/font only (or @fontsource packages if next/font lacks a font). Keep the Responsive rules and the Honesty rules unchanged.
