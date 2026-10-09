"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getFx } from "@/lib/gsap";

export function isCalmRoute(path?: string | null): boolean {
  if (typeof document !== "undefined" && document.documentElement.getAttribute("data-calm") === "on") {
    return true;
  }
  if (!path) return false;
  const clean = path.split("?")[0].split("#")[0];
  return (
    clean === "/check" ||
    clean.startsWith("/check/") ||
    clean === "/focus" ||
    clean.startsWith("/focus/") ||
    clean.startsWith("/activities/cyclic-sighing") ||
    clean.startsWith("/activities/box-breathing") ||
    clean.startsWith("/activities/breath-counting") ||
    clean.startsWith("/activities/nature-microbreak") ||
    clean.startsWith("/activities/movement-snack") ||
    clean.startsWith("/activities/quiet-rest")
  );
}

export type Nav = (href: string, origin?: { x: number; y: number }) => void;
export const Ctx = createContext<Nav>(() => {});
export const useIrisNavigate = () => useContext(Ctx);

/**
 * Recipe 8: iris-wipe page transition.
 * Keeps React tree stable: children never remount.
 * Dynamically loads IrisOverlayFull only in fx full.
 */
export function IrisProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const customNavRef = useRef<Nav | null>(null);
  const [OverlayComp, setOverlayComp] = useState<React.ComponentType<{
    onRegister: (nav: Nav | null) => void;
  }> | null>(null);

  useEffect(() => {
    if (getFx() === "full") {
      import("./IrisProviderFull").then((mod) => {
        setOverlayComp(() => mod.IrisOverlayFull);
      });
    }
  }, []);

  const navigate: Nav = useCallback(
    (href, origin) => {
      if (customNavRef.current) {
        customNavRef.current(href, origin);
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const handleRegister = useCallback((nav: Nav | null) => {
    customNavRef.current = nav;
  }, []);

  return (
    <Ctx.Provider value={navigate}>
      {children}
      {OverlayComp ? <OverlayComp onRegister={handleRegister} /> : null}
    </Ctx.Provider>
  );
}

export type TransitionLinkProps = ComponentPropsWithoutRef<typeof Link>;

/**
 * Link component that navigates with an iris wipe if fx is full and route is not calm.
 * Automatically skips for modifier-clicks, new-tab links, back/forward, and calm routes.
 */
export const TransitionLink = React.forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ href, onClick, target, children, ...rest }, ref) {
    const navigate = useIrisNavigate();
    const pathname = usePathname();
    const lastClickRef = useRef<number>(0);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);
      if (e.defaultPrevented) return;

      // Prevent rapid double-clicks on links
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (now - lastClickRef.current < 400) {
        e.preventDefault();
        return;
      }
      lastClickRef.current = now;

      // Skip for modifier-clicks, non-primary clicks, or new tabs
      if (
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        target === "_blank"
      ) {
        return;
      }

      const hrefStr = typeof href === "object" ? href.pathname || "" : href;
      if (
        !hrefStr ||
        hrefStr.startsWith("http") ||
        hrefStr.startsWith("mailto:") ||
        hrefStr.startsWith("#")
      ) {
        return;
      }

      // Skip when navigating to the current path, current or destination route is calm, or fx is not full
      const currentClean = (pathname || "").split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
      const targetClean = hrefStr.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
      if (
        currentClean === targetClean ||
        isCalmRoute(pathname) ||
        isCalmRoute(hrefStr) ||
        getFx() !== "full"
      ) {
        return;
      }

      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const origin = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      navigate(hrefStr, origin);
    };

    return (
      <Link ref={ref} href={href} target={target} onClick={handleClick} {...rest}>
        {children}
      </Link>
    );
  }
);
