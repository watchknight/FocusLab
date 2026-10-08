"use client";
import type { RefObject } from "react";
import { gsap, useGSAP, ScrollTrigger, getFx } from "@/lib/gsap";

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
