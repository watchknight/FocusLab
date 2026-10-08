"use client";

import React, { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, getFx } from "@/lib/gsap";
import { isCalmRoute, type Nav } from "./IrisTransition";

export interface IrisOverlayFullProps {
  onRegister: (nav: Nav | null) => void;
}

export function IrisOverlayFull({ onRegister }: IrisOverlayFullProps) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const origin = useRef({ x: 0.5, y: 0.5 });
  const busy = useRef(false);

  useEffect(() => {
    if (!busy.current || !overlay.current) return;
    const { x, y } = origin.current;
    gsap.to(overlay.current, {
      clipPath: `circle(0vmax at ${x * 100}% ${y * 100}%)`,
      duration: 0.7,
      ease: "power3.inOut",
      onComplete: () => {
        busy.current = false;
        if (overlay.current) gsap.set(overlay.current, { visibility: "hidden" });
      },
    });
  }, [pathname]);

  useEffect(() => {
    const navigate: Nav = (href, o) => {
      const el = overlay.current;
      if (!el || getFx() !== "full" || busy.current || isCalmRoute(pathname) || isCalmRoute(href)) {
        router.push(href);
        return;
      }
      busy.current = true;
      origin.current = o
        ? { x: o.x / window.innerWidth, y: o.y / window.innerHeight }
        : { x: 0.5, y: 0.5 };
      const { x, y } = origin.current;
      gsap.set(el, {
        visibility: "visible",
        clipPath: `circle(0vmax at ${x * 100}% ${y * 100}%)`,
      });
      gsap.to(el, {
        clipPath: `circle(150vmax at ${x * 100}% ${y * 100}%)`,
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: () => {
          router.push(href);
          setTimeout(() => {
            if (busy.current && overlay.current) {
              busy.current = false;
              gsap.set(overlay.current, { visibility: "hidden" });
            }
          }, 2500);
        },
      });
    };

    onRegister(navigate);
    return () => {
      onRegister(null);
    };
  }, [pathname, router, onRegister]);

  return (
    <div
      ref={overlay}
      aria-hidden="true"
      className="iris"
      style={{ visibility: "hidden" }}
    />
  );
}

export default IrisOverlayFull;
