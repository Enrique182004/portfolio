"use client";

import { useEffect, MutableRefObject } from "react";
import gsap from "gsap";
import { CanvasState } from "./starmap.types";
import { NodeId } from "@/types/node";

const SATELLITE_IDS: NodeId[] = [
  "about",
  "skills",
  "projects",
  "ai-ml",
  "contact",
];

export function useBootSequence(canvasStateRef: MutableRefObject<CanvasState>) {
  useEffect(() => {
    const cs = canvasStateRef.current;
    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(cs, { globalAlpha: 1, duration: 0.6, ease: "power2.out" });
    tl.to(
      cs.nodeStates.hero,
      { alpha: 1, duration: 0.4, ease: "power2.out" },
      "-=0.2",
    );

    SATELLITE_IDS.forEach((id, i) => {
      const offset = i * 0.18;
      tl.to(
        cs.lineProgresses,
        { [id]: 1, duration: 0.5, ease: "power2.out" },
        `>-=${0.4 - offset * 0.1}`,
      );
      tl.to(
        cs.nodeStates[id],
        { alpha: 1, duration: 0.35, ease: "power2.out" },
        "<+=0.25",
      );
    });

    tl.to(
      cs,
      { particlesAlpha: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4",
    );

    return () => {
      tl.kill();
    };
  }, [canvasStateRef]);
}
