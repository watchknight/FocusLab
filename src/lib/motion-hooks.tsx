"use client";
import type { RefObject } from "react";
import { gsap, useGSAP, SplitText, Draggable, getFx } from "@/lib/gsap";
import { applyAperture } from "@/lib/aperture";

/** Recipe 3: hero headline, masked lines, words rise and rack-focus from blur. */
export function useHeadlineReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const el = scope.current?.querySelector<HTMLElement>("[data-split='headline']");
    if (!el) return;
    const fx = getFx();
    if (fx === "off") { gsap.set(el, { autoAlpha: 1 }); return; }
    document.fonts.ready.then(() => {
      gsap.set(el, { autoAlpha: 1 });
      SplitText.create(el, {
        type: "lines, words",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          const vars: gsap.TweenVars = { yPercent: 115, opacity: 0, duration: 1.1, ease: "focus", stagger: 0.045 };
          if (fx === "full") vars.filter = "blur(14px)";
          return gsap.from(self.words, vars);
        },
      });
    });
  }, { scope });
}

/** Recipe 4: statement text that sharpens word by word while you scroll. */
export function useFocusScrub(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const el = scope.current?.querySelector<HTMLElement>("[data-split='scrub']");
    if (!el) return;
    const fx = getFx();
    if (fx === "off") return;
    document.fonts.ready.then(() => {
      SplitText.create(el, {
        type: "words",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            fx === "full" ? { opacity: 0.18, filter: "blur(6px)" } : { opacity: 0.25 },
            { opacity: 1, filter: "blur(0px)", ease: "none", stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 45%", scrub: true } },
          );
        },
      });
    });
  }, { scope });
}

/** Recipe 5: magnetic button (fine pointer, full fx only). */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.3) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
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
export function tweenAperture(svg: SVGSVGElement, from: number, to: number, duration = 1.2) {
  const p = { open: from };
  return gsap.to(p, { open: to, duration, ease: "focus", onUpdate: () => applyAperture(svg, p.open) });
}

/** Recipe 7: pinned story scene. Panels are absolutely stacked children marked [data-panel]. */
export function usePinnedScene(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      if (getFx() !== "full") return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", root);
      gsap.set(panels.slice(1), { autoAlpha: 0, yPercent: 8 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end: `+=${panels.length * 90}%`, scrub: 0.6, pin: true, anticipatePin: 1 },
      });
      panels.forEach((panel, i) => {
        if (i === 0) return;
        tl.to(panels[i - 1], { autoAlpha: 0, yPercent: -8, duration: 0.4 }, i - 0.4)
          .to(panel, { autoAlpha: 1, yPercent: 0, duration: 0.4 }, i - 0.4);
      });
    });
    return () => mm.revert();
  }, { scope });
}
