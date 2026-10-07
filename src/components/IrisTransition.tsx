"use client";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, getFx } from "@/lib/gsap";

type Nav = (href: string, origin?: { x: number; y: number }) => void;
const Ctx = createContext<Nav>(() => {});
export const useIrisNavigate = () => useContext(Ctx);

/** Recipe 8: iris-wipe page transition. Skip on calm routes and when fx is not "full". */
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
      clipPath: `circle(0vmax at ${x * 100}% ${y * 100}%)`, duration: 0.7, ease: "power3.inOut",
      onComplete: () => { busy.current = false; gsap.set(overlay.current, { visibility: "hidden" }); },
    });
  }, [pathname]);

  const navigate: Nav = (href, o) => {
    const el = overlay.current;
    if (!el || getFx() !== "full" || busy.current) { router.push(href); return; }
    busy.current = true;
    origin.current = o ? { x: o.x / window.innerWidth, y: o.y / window.innerHeight } : { x: 0.5, y: 0.5 };
    const { x, y } = origin.current;
    gsap.set(el, { visibility: "visible", clipPath: `circle(0vmax at ${x * 100}% ${y * 100}%)` });
    gsap.to(el, { clipPath: `circle(150vmax at ${x * 100}% ${y * 100}%)`, duration: 0.7, ease: "power3.inOut", onComplete: () => router.push(href) });
  };

  return (
    <Ctx.Provider value={navigate}>
      {children}
      <div ref={overlay} aria-hidden="true" className="iris" style={{ visibility: "hidden" }} />
    </Ctx.Provider>
  );
}
