"use client";
import { gsap } from "./gsap";
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

export { Flip };
export type FlipState = Flip.FlipState;
