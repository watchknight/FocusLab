"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin, ScrambleTextPlugin, DrawSVGPlugin, CustomEase);
  ScrollTrigger.config({ ignoreMobileResize: true });
  CustomEase.create("focus", "0.16, 1, 0.3, 1");
  (window as unknown as { gsap: typeof gsap }).gsap = gsap;
}

export { gsap, useGSAP, ScrollTrigger, SplitText, Flip, Draggable };

export type Fx = "full" | "lite" | "off";
/** Set before first paint by the inline script in <head> (see recipe 0). */
export const getFx = (): Fx =>
  typeof document === "undefined" ? "off" : ((document.documentElement.dataset.fx as Fx | undefined) ?? "off");
