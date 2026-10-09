"use client";
import type { RefObject } from "react";
import { gsap, useGSAP, getFx } from "@/lib/gsap";

/** Recipe 3: hero headline, masked lines, words rise and rack-focus from blur. */
export function useHeadlineReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP((context) => {
    const el = scope.current?.querySelector<HTMLElement>("[data-split='headline']");
    if (!el) return;
    const fx = getFx();
    if (fx !== "full") {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    // Keep the headline hidden until fonts are ready and SplitText splits into opacity: 0 words
    gsap.set(el, { autoAlpha: 0 });

    let isDone = false;
    const safetyTimer = setTimeout(() => {
      if (!isDone && el.isConnected && !context.isReverted) {
        gsap.set(el, { autoAlpha: 1 });
      }
    }, 2500);

    const fontsPromise =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready
        : Promise.resolve();

    fontsPromise
      .then(async () => {
        if (!scope.current || !el.isConnected || context.isReverted) return;
        const { SplitText } = await import("@/lib/gsap-text");
        if (context.isReverted || !el.isConnected) return;
        isDone = true;
        clearTimeout(safetyTimer);

        context.add(() => {
          let hasAnimated = false;
          SplitText.create(el, {
            type: "lines, words",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              if (!hasAnimated) {
                hasAnimated = true;
                const tween = gsap.fromTo(
                  self.words,
                  {
                    yPercent: 115,
                    opacity: 0,
                    filter: "blur(14px)",
                  },
                  {
                    yPercent: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1.1,
                    ease: "focus",
                    stagger: 0.045,
                  }
                );
                // Reveal the container element now that words are initialized to opacity: 0
                gsap.set(el, { autoAlpha: 1 });
                return tween;
              } else {
                // On subsequent resize auto-splits, preserve visible words without replaying entrance animation
                gsap.set(self.words, { yPercent: 0, opacity: 1, filter: "none" });
                gsap.set(el, { autoAlpha: 1 });
              }
            },
          });
        });
      })
      .catch(() => {
        isDone = true;
        clearTimeout(safetyTimer);
        if (el.isConnected && !context.isReverted) {
          gsap.set(el, { autoAlpha: 1 });
        }
      });

    return () => {
      clearTimeout(safetyTimer);
    };
  }, { scope });
}
