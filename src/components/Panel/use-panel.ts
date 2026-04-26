"use client";

import { useEffect, useRef, MutableRefObject } from "react";
import gsap from "gsap";
import { NodeId } from "@/types/node";
import { CanvasState } from "@/components/StarMap/starmap.types";

interface UsePanelOptions {
  activeNodeId: NodeId | null;
  panelRef: React.RefObject<HTMLDivElement | null>;
  canvasStateRef: MutableRefObject<CanvasState>;
  onCloseComplete: () => void;
}

export function usePanel({
  activeNodeId,
  panelRef,
  canvasStateRef,
  onCloseComplete,
}: UsePanelOptions) {
  const prevNodeIdRef = useRef<NodeId | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const prev = prevNodeIdRef.current;

    if (tlRef.current) tlRef.current.kill();

    if (activeNodeId && !prev) {
      // Open from closed
      gsap.set(panel, { display: "flex", y: "100%", x: "0%" });
      const tl = gsap.timeline();
      tl.to(
        canvasStateRef.current,
        { globalAlpha: 0.2, duration: 0.35, ease: "power2.out" },
        0,
      );
      tl.to(panel, { y: "0%", duration: 0.45, ease: "back.out(1.2)" }, 0.1);
      tlRef.current = tl;
    } else if (!activeNodeId && prev) {
      // Close
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(panel, { display: "none" });
          onCloseComplete();
        },
      });
      tl.to(panel, { y: "100%", duration: 0.35, ease: "power2.in" });
      tl.to(
        canvasStateRef.current,
        { globalAlpha: 1, duration: 0.4, ease: "power2.out" },
        0.1,
      );
      tlRef.current = tl;
    } else if (activeNodeId && prev && activeNodeId !== prev) {
      // Node-to-node swap — slide direction based on string ordering
      const slideOut = prev < activeNodeId ? "-120%" : "120%";
      const slideIn = prev < activeNodeId ? "120%" : "-120%";

      const tl = gsap.timeline();
      tl.to(panel, { x: slideOut, duration: 0.25, ease: "power2.in" });
      tl.to(
        canvasStateRef.current,
        { globalAlpha: 0.35, duration: 0.15 },
        0.05,
      );
      tl.to(canvasStateRef.current, { globalAlpha: 0.2, duration: 0.15 }, 0.2);
      tl.set(panel, { x: slideIn });
      tl.to(panel, { x: "0%", duration: 0.35, ease: "back.out(1.1)" });
      tlRef.current = tl;
    }

    prevNodeIdRef.current = activeNodeId;
  }, [activeNodeId, panelRef, canvasStateRef, onCloseComplete]);
}
