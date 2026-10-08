"use client";
import { gsap } from "@/lib/gsap";
import { applyAperture } from "@/lib/aperture";

/** Recipe 11: drive the aperture (intro, breath pacer). */
export function tweenAperture(
  svg: SVGSVGElement,
  from: number,
  to: number,
  duration = 1.2,
  ease: string | gsap.EaseFunction = "focus"
) {
  const p = { open: from };
  return gsap.to(p, { open: to, duration, ease, onUpdate: () => applyAperture(svg, p.open) });
}
