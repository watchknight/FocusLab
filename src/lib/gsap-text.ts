"use client";
import { gsap } from "./gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrambleTextPlugin);
}

export { SplitText, ScrambleTextPlugin };
