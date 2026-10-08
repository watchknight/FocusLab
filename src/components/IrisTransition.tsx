"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap, getFx } from "@/lib/gsap";

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

type Nav = (href: string, origin?: { x: number; y: number }) => void;
const Ctx = createContext<Nav>(() => {});
export const useIrisNavigate = () => useContext(Ctx);

/** Recipe 8: iris-wipe page transition. Skip on calm routes, back/forward, and when fx is not "full". */
export function IrisProvider({ children }: { children: ReactNode }) {
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
        // Safety timeout in case navigation is cancelled or identical route
        setTimeout(() => {
          if (busy.current && overlay.current) {
            busy.current = false;
            gsap.set(overlay.current, { visibility: "hidden" });
          }
        }, 2500);
      },
    });
  };

  return (
    <Ctx.Provider value={navigate}>
      {children}
      <div
        ref={overlay}
        aria-hidden="true"
        className="iris"
        style={{ visibility: "hidden" }}
      />
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

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);
      if (e.defaultPrevented) return;

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

      // Skip when current or destination route is calm, or fx is not full
      if (isCalmRoute(pathname) || isCalmRoute(hrefStr) || getFx() !== "full") {
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
