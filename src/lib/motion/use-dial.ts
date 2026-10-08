"use client";
import type { RefObject } from "react";
import { useGSAP } from "@/lib/gsap";

/** Recipe 9: tactile focus-ring dial with inertia. Pair it with an <input type="range"> for keyboards. */
export function useDial(
  ref: RefObject<HTMLElement | null>,
  opts: {
    min: number;
    max: number;
    step: number;
    onValue: (deg: number) => void;
  }
) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    let draggerInstance: { kill: () => void } | null = null;
    import("@/lib/gsap-drag").then(({ Draggable }) => {
      if (!ref.current) return;
      const [dragger] = Draggable.create(el, {
        type: "rotation",
        inertia: true,
        bounds: { minRotation: opts.min, maxRotation: opts.max },
        snap: (v: number) => Math.round(v / opts.step) * opts.step,
        onDrag: () => opts.onValue(dragger.rotation),
        onThrowUpdate: () => opts.onValue(dragger.rotation),
      });
      draggerInstance = dragger;
    });
    return () => {
      if (draggerInstance) draggerInstance.kill();
    };
  }, { scope: ref });
}
