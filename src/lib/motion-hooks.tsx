"use client";
import type { RefObject } from "react";
import { gsap, useGSAP, ScrollTrigger, SplitText, Draggable, getFx } from "@/lib/gsap";
import { applyAperture } from "@/lib/aperture";

/** Recipe 3: hero headline, masked lines, words rise and rack-focus from blur. */
export function useHeadlineReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const el = scope.current?.querySelector<HTMLElement>("[data-split='headline']");
    if (!el) return;
    const fx = getFx();
    if (fx !== "full") { gsap.set(el, { autoAlpha: 1 }); return; }
    document.fonts.ready.then(() => {
      gsap.set(el, { autoAlpha: 1 });
      SplitText.create(el, {
        type: "lines, words",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          const vars: gsap.TweenVars = { yPercent: 115, opacity: 0, duration: 1.1, ease: "focus", stagger: 0.045, filter: "blur(14px)" };
          return gsap.from(self.words, vars);
        },
      });
    });
  }, { scope });
}

/** Recipe 4: statement text that sharpens word by word while you scroll. */
export function useFocusScrub(scope: RefObject<HTMLElement | null>) {
  useGSAP((context) => {
    const el = scope.current?.querySelector<HTMLElement>("[data-split='scrub']");
    if (!el) return;
    const fx = getFx();
    if (fx === "off") return;
    document.fonts.ready.then(() => {
      if (!scope.current || !el.isConnected || context.isReverted) return;
      context.add(() => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            const fromVars: gsap.TweenVars = fx === "full" ? { opacity: 0.18, filter: "blur(6px)" } : { opacity: 0.25 };
            const toVars: gsap.TweenVars = {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: {
                trigger: el,
                start: "top 82%",
                end: "bottom 45%",
                scrub: true,
              },
            };
            if (fx === "full") {
              toVars.filter = "blur(0px)";
            }
            return gsap.fromTo(self.words, fromVars, toVars);
          },
        });
        ScrollTrigger.refresh();
      });
    });
  }, { scope });
}

/** Recipe 5: magnetic button (fine pointer, full fx only). */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.3) {
  useGSAP(() => {
    const el = ref.current;
    if (!el || strength <= 0) return;
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      if (getFx() !== "full") return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => { xTo(0); yTo(0); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
    });
    return () => mm.revert();
  }, { scope: ref });
}

/** Recipe 9: tactile focus-ring dial with inertia. Pair it with an <input type="range"> for keyboards. */
export function useDial(ref: RefObject<HTMLElement | null>, opts: { min: number; max: number; step: number; onValue: (deg: number) => void }) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const [dragger] = Draggable.create(el, {
      type: "rotation",
      inertia: true,
      bounds: { minRotation: opts.min, maxRotation: opts.max },
      snap: (v: number) => Math.round(v / opts.step) * opts.step,
      onDrag: () => opts.onValue(dragger.rotation),
      onThrowUpdate: () => opts.onValue(dragger.rotation),
    });
  }, { scope: ref });
}

/** Recipe 10: scramble a readout to its value (use after a result, never during the Check). */
export function scrambleTo(el: HTMLElement, value: string) {
  if (getFx() === "off") { el.textContent = value; return; }
  gsap.to(el, { duration: 0.9, scrambleText: { text: value, chars: "0123456789", speed: 0.6 } });
}

/** Recipe 11: drive the aperture (intro, breath pacer). */
export function tweenAperture(svg: SVGSVGElement, from: number, to: number, duration = 1.2, ease: string | gsap.EaseFunction = "focus") {
  const p = { open: from };
  return gsap.to(p, { open: to, duration, ease, onUpdate: () => applyAperture(svg, p.open) });
}

/** Recipe 7: pinned story scene with circle clip-path switches and progress rail. */
export function usePinnedScene(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      if (getFx() !== "full") return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", root);
      if (panels.length < 2) return;

      const railFill = root.querySelector<HTMLElement>("[data-rail-fill]");
      const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]", root);

      const updateActiveState = (activeIndex: number) => {
        ticks.forEach((tick, idx) => {
          if (idx <= activeIndex) {
            tick.setAttribute("data-active", "true");
          } else {
            tick.removeAttribute("data-active");
          }
        });
        panels.forEach((panel, idx) => {
          if (idx === activeIndex) {
            panel.removeAttribute("inert");
            panel.removeAttribute("aria-hidden");
          } else {
            panel.setAttribute("inert", "");
            panel.setAttribute("aria-hidden", "true");
          }
        });
      };

      panels.forEach((panel, i) => {
        gsap.set(panel, {
          zIndex: i + 1,
          autoAlpha: 1,
        });
        if (i > 0) {
          gsap.set(panel, {
            clipPath: "circle(0% at 72% 50%)",
          });
        }
      });

      // Initialize active state for panel 0
      updateActiveState(0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${panels.length * 90}%`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const activeIndex = p < 0.33 ? 0 : p < 0.75 ? 1 : 2;
            updateActiveState(activeIndex);
          },
        },
      });

      if (railFill) {
        tl.to(railFill, { scaleY: 1, ease: "none", duration: 1 }, 0);
      }

      // Panel 0 hold: 0.00-0.20 | Wipe 1: 0.20-0.45 | Panel 1 hold: 0.45-0.70 | Wipe 2: 0.70-0.95 | Panel 2 hold: 0.95-1.00
      if (panels[1]) {
        tl.fromTo(
          panels[1],
          { clipPath: "circle(0% at 72% 50%)" },
          { clipPath: "circle(150% at 72% 50%)", ease: "power2.inOut", duration: 0.25 },
          0.20
        );
      }
      if (panels[2]) {
        tl.fromTo(
          panels[2],
          { clipPath: "circle(0% at 72% 50%)" },
          { clipPath: "circle(150% at 72% 50%)", ease: "power2.inOut", duration: 0.25 },
          0.70
        );
      }

      document.fonts.ready.then(() => {
        if (!scope.current || !root.isConnected) return;
        ScrollTrigger.refresh();
      });

      return () => {
        ticks.forEach((tick) => tick.removeAttribute("data-active"));
        panels.forEach((panel) => {
          panel.removeAttribute("inert");
          panel.removeAttribute("aria-hidden");
        });
      };
    });
    return () => mm.revert();
  }, { scope });
}
