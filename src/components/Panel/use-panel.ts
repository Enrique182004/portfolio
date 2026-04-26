"use client";

import { useEffect, useRef, RefObject, MutableRefObject } from "react";
import gsap from "gsap";
import { NodeId, NodeConfig } from "@/types/node";

interface UsePanelOptions {
  activeNodeId: NodeId | null;
  nodeConfigs: NodeConfig[];
  zoomRef: RefObject<HTMLDivElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onCloseComplete: () => void;
}

export function usePanel({
  activeNodeId,
  nodeConfigs,
  zoomRef,
  panelRef,
  canvasRef,
  onCloseComplete,
}: UsePanelOptions) {
  const prevNodeIdRef = useRef<NodeId | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const zoom = zoomRef.current;
    const panel = panelRef.current;
    const canvas = canvasRef.current;
    if (!zoom || !panel) return;

    const prev = prevNodeIdRef.current;
    if (tlRef.current) tlRef.current.kill();

    if (activeNodeId && !prev) {
      // --- Travel to node ---
      const node = nodeConfigs.find((n) => n.id === activeNodeId);
      if (node && canvas) {
        const ox = node.xRatio * canvas.width;
        const oy = node.yRatio * canvas.height;
        zoom.style.transformOrigin = `${ox}px ${oy}px`;
      }

      gsap.set(panel, { display: "flex", opacity: 0 });

      const tl = gsap.timeline();
      // Zoom canvas toward node
      tl.fromTo(
        zoom,
        { scale: 1, opacity: 1 },
        { scale: 6, duration: 0.9, ease: "power3.in" },
      );
      // Fade out canvas as we arrive
      tl.to(zoom, { opacity: 0, duration: 0.2 }, 0.72);
      // Fade in panel content
      tl.to(panel, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0.85);
      tlRef.current = tl;
    } else if (!activeNodeId && prev) {
      // --- Return to starmap ---
      const tl = gsap.timeline({
        onComplete: () => {
          // Reset zoom state while canvas is invisible
          gsap.set(zoom, { scale: 1, opacity: 0 });
          zoom.style.transformOrigin = "center center";
          gsap.set(panel, { display: "none" });
          // Fade canvas back in
          gsap.to(zoom, { opacity: 1, duration: 0.5, ease: "power2.out" });
          onCloseComplete();
        },
      });
      tl.to(panel, { opacity: 0, duration: 0.3, ease: "power2.in" });
      tlRef.current = tl;
    } else if (activeNodeId && prev && activeNodeId !== prev) {
      // --- Jump between nodes ---
      const node = nodeConfigs.find((n) => n.id === activeNodeId);
      const tl = gsap.timeline();

      // Fade out current content
      tl.to(panel, { opacity: 0, duration: 0.2, ease: "power2.in" });

      // Briefly show canvas zoomed to new node
      tl.call(() => {
        if (node && canvas) {
          const ox = node.xRatio * canvas.width;
          const oy = node.yRatio * canvas.height;
          zoom.style.transformOrigin = `${ox}px ${oy}px`;
        }
        gsap.set(zoom, { scale: 6, opacity: 0 });
      });

      // Fade in new content
      tl.to(panel, { opacity: 1, duration: 0.3, ease: "power2.out" }, "+=0.05");
      tlRef.current = tl;
    }

    prevNodeIdRef.current = activeNodeId;
  }, [
    activeNodeId,
    nodeConfigs,
    zoomRef,
    panelRef,
    canvasRef,
    onCloseComplete,
  ]);
}
