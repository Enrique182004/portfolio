import { useEffect, useRef, useCallback } from "react";

interface UseCanvasOptions {
  onDraw: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => void;
}

export function useCanvas({ onDraw }: UseCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const onDrawRef = useRef(onDraw);
  onDrawRef.current = onDraw;

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    onDrawRef.current(ctx, canvas.width, canvas.height);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setSize();
    window.addEventListener("resize", setSize);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [loop]);

  return canvasRef;
}
