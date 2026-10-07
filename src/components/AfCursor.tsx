"use client";
import { useRef } from "react";
import { gsap, useGSAP, getFx } from "@/lib/gsap";

const LOCKABLE = "a, button, [role='button'], [role='slider'], summary, input, select, textarea, [data-lock]";

/** Recipe 6: autofocus-bracket cursor that snaps to interactive elements. Corners are 4 spans styled in CSS. */
export function AfCursor() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      if (getFx() !== "full" || !root.current) return;
      const corners = gsap.utils.toArray<HTMLElement>("[data-corner]", root.current);
      const size = 28, pad = 8;
      const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      let locked: DOMRect | null = null;
      let raf = 0;
      const place = () => {
        const r = locked ?? new DOMRect(mouse.x - size / 2, mouse.y - size / 2, size, size);
        const p = locked ? pad : 0;
        const pts = [[r.left - p, r.top - p], [r.right + p, r.top - p], [r.left - p, r.bottom + p], [r.right + p, r.bottom + p]];
        corners.forEach((c, i) => gsap.to(c, { x: pts[i][0], y: pts[i][1], duration: locked ? 0.35 : 0.12, ease: locked ? "focus" : "power3.out", overwrite: "auto" }));
      };
      const schedule = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; place(); }); };
      const move = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; if (!locked) schedule(); };
      const over = (e: PointerEvent) => {
        const t = (e.target as Element | null)?.closest(LOCKABLE) ?? null;
        locked = t ? t.getBoundingClientRect() : null;
        root.current?.toggleAttribute("data-locked", !!t);
        schedule();
      };
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerover", over, { passive: true });
      gsap.set(root.current, { autoAlpha: 1 });
      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerover", over);
        cancelAnimationFrame(raf);
        gsap.set(root.current, { autoAlpha: 0 });
      };
    });
    return () => mm.revert();
  }, { scope: root });
  return (
    <div ref={root} aria-hidden="true" className="af-cursor" style={{ opacity: 0 }}>
      {[0, 1, 2, 3].map((i) => <span key={i} data-corner className={`af-corner af-corner-${i}`} />)}
    </div>
  );
}
