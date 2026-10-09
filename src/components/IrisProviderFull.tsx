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
  const safetyTimer = useRef<NodeJS.Timeout | null>(null);

  const clearSafetyTimer = () => {
    if (safetyTimer.current) {
      clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
  };

  useEffect(() => {
    // Reset and abort iris overlay on browser back/forward or bfcache restore
    const handlePopState = () => {
      clearSafetyTimer();
      if (overlay.current) {
        gsap.killTweensOf(overlay.current);
        gsap.set(overlay.current, { visibility: "hidden", clipPath: "circle(0vmax at 50% 50%)" });
      }
      busy.current = false;
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted || busy.current) {
        handlePopState();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      clearSafetyTimer();
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    if (!busy.current || !overlay.current) return;
    clearSafetyTimer();
    if (isCalmRoute(pathname)) {
      gsap.killTweensOf(overlay.current);
      gsap.set(overlay.current, { visibility: "hidden", clipPath: "circle(0vmax at 50% 50%)" });
      busy.current = false;
      return;
    }
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
    const isSameRoute = (current: string | null | undefined, target: string | null | undefined): boolean => {
      if (!current || !target) return false;
      const c = current.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
      const t = target.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
      return c === t;
    };

    const navigate: Nav = (href, o) => {
      // Rapid double clicks or duplicate navigation while transition is already running: ignore
      if (busy.current) {
        return;
      }
      const el = overlay.current;
      if (!el || getFx() !== "full" || isCalmRoute(pathname) || isCalmRoute(href) || isSameRoute(pathname, href)) {
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
          clearSafetyTimer();
          safetyTimer.current = setTimeout(() => {
            if (busy.current && overlay.current) {
              gsap.killTweensOf(overlay.current);
              busy.current = false;
              gsap.set(overlay.current, { visibility: "hidden" });
            }
          }, 2500);
        },
      });
    };

    onRegister(navigate);
    return () => {
      clearSafetyTimer();
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
