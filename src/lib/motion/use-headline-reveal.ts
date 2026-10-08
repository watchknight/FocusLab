"use client";
import type { RefObject } from "react";
import { gsap, useGSAP, getFx } from "@/lib/gsap";

/** Recipe 3: hero headline, masked lines, words rise and rack-focus from blur. */
export function useHeadlineReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const el = scope.current?.querySelector<HTMLElement>("[data-split='headline']");
    if (!el) return;
    const fx = getFx();
    if (fx !== "full") {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }
    document.fonts.ready.then(async () => {
      if (!scope.current || !el.isConnected) return;
      const { SplitText } = await import("@/lib/gsap-text");
      gsap.set(el, { autoAlpha: 1 });
      SplitText.create(el, {
        type: "lines, words",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          const vars: gsap.TweenVars = {
            yPercent: 115,
            opacity: 0,
            duration: 1.1,
            ease: "focus",
            stagger: 0.045,
            filter: "blur(14px)",
          };
          return gsap.from(self.words, vars);
        },
      });
    });
  }, { scope });
}
