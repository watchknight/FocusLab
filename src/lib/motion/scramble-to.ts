"use client";
import { gsap, getFx } from "@/lib/gsap";

/** Recipe 10: scramble a readout to its value (use after a result, never during the Check). */
export function scrambleTo(el: HTMLElement, value: string) {
  if (getFx() === "off") {
    el.textContent = value;
    return;
  }
  import("@/lib/gsap-text").then(() => {
    gsap.to(el, {
      duration: 0.9,
      scrambleText: { text: value, chars: "0123456789", speed: 0.6 },
    });
  });
}
