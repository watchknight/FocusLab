"use client";
import type { RefObject } from "react";
import { gsap, useGSAP, ScrollTrigger, getFx } from "@/lib/gsap";

/** Recipe 4: statement text that sharpens word by word while you scroll. */
export function useFocusScrub(scope: RefObject<HTMLElement | null>) {
  useGSAP((context) => {
    const el = scope.current?.querySelector<HTMLElement>("[data-split='scrub']");
    if (!el) return;
    const fx = getFx();
    if (fx === "off") return;
    document.fonts.ready.then(async () => {
      if (!scope.current || !el.isConnected || context.isReverted) return;
      const { SplitText } = await import("@/lib/gsap-text");
      context.add(() => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            const fromVars: gsap.TweenVars =
              fx === "full" ? { opacity: 0.18, filter: "blur(6px)" } : { opacity: 0.25 };
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
