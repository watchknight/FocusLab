"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, getFx } from "@/lib/gsap";
import { isCalmRoute } from "@/components/IrisTransition";
import { useCalm } from "@/components/motion/CalmProvider";

/**
 * Recipe 12: smooth scroll for fine pointers only; native scroll everywhere else.
 * Explicitly disabled on calm routes (/check, /focus, breathing players) and calm mode.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const { calm } = useCalm();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isCalm = isCalmRoute(pathname) || calm;

    const ok =
      getFx() === "full" &&
      !isCalm &&
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!ok) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [pathname, calm]);

  return null;
}
