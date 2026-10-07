"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, getFx } from "@/lib/gsap";

/** Recipe 12: smooth scroll for fine pointers only; native scroll everywhere else. */
export function SmoothScroll() {
  useEffect(() => {
    const ok = getFx() === "full" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!ok) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return null;
}
