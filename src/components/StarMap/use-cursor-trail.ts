"use client";

import { useEffect, useRef } from "react";

interface TrailDot {
  x: number;
  y: number;
}

export function useCursorTrail(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isActive: boolean,
) {
  const trailRef = useRef<TrailDot[]>([]);

  useEffect(() => {
    if (isActive) {
      trailRef.current = [];
      return;
    }

    const handleMove = (e: MouseEvent) => {
      trailRef.current.unshift({ x: e.clientX, y: e.clientY });
      if (trailRef.current.length > 8) trailRef.current.pop();
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isActive]);

  useEffect(() => {
    if (isActive) return;

    let raf: number;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (ctx) {
        for (let i = 0; i < trailRef.current.length; i++) {
          const dot = trailRef.current[i];
          const r = Math.max(0.5, 3 - i * 0.35);
          const alpha = (1 - i / 8) * 0.5;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [canvasRef, isActive]);
}
