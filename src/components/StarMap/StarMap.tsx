"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { NodeId, NodeConfig } from "@/types/node";
import { Repo } from "@/types/repo";
import { CanvasState, Particle, SignalDot } from "./starmap.types";
import { useCanvas } from "./canvas/use-canvas";
import { drawHexGrid } from "./canvas/draw-hex-grid";
import {
  initParticles,
  updateParticles,
  drawParticles,
} from "./canvas/draw-particles";
import {
  initSignalDots,
  updateSignalDots,
  drawConnections,
} from "./canvas/draw-connections";
import { drawAllNodes } from "./canvas/draw-nodes";
import { useBootSequence } from "./use-boot-sequence";
import { useCursorTrail } from "./use-cursor-trail";
import Panel from "@/components/Panel/Panel";
import AboutPanel from "@/components/panels/AboutPanel";
import SkillsPanel from "@/components/panels/SkillsPanel";
import ProjectsPanel from "@/components/panels/ProjectsPanel";
import AiMlPanel from "@/components/panels/AiMlPanel";
import ContactPanel from "@/components/panels/ContactPanel";

const NODE_CONFIGS: NodeConfig[] = [
  { id: "hero", label: "Enrique Calleros", xRatio: 0.5, yRatio: 0.5 },
  { id: "about", label: "About", xRatio: 0.22, yRatio: 0.25 },
  { id: "skills", label: "Skills", xRatio: 0.78, yRatio: 0.25 },
  { id: "projects", label: "Projects", xRatio: 0.18, yRatio: 0.72 },
  { id: "ai-ml", label: "AI / ML", xRatio: 0.82, yRatio: 0.72 },
  { id: "contact", label: "Contact", xRatio: 0.5, yRatio: 0.85 },
];

const SATELLITE_IDS: NodeId[] = [
  "about",
  "skills",
  "projects",
  "ai-ml",
  "contact",
];

function makeInitialCanvasState(): CanvasState {
  const nodeStates = Object.fromEntries(
    NODE_CONFIGS.map((n) => [
      n.id,
      { alpha: 0, glowRadius: n.id === "hero" ? 36 : 28, ringScale: 1 },
    ]),
  ) as CanvasState["nodeStates"];
  const lineProgresses = Object.fromEntries(
    SATELLITE_IDS.map((id) => [id, 0]),
  ) as CanvasState["lineProgresses"];
  return {
    globalAlpha: 0,
    nodeStates,
    lineProgresses,
    particlesAlpha: 0,
    mouseX: -999,
    mouseY: -999,
  };
}

interface StarMapProps {
  repos: Repo[];
}

export default function StarMap({ repos }: StarMapProps) {
  const canvasStateRef = useRef<CanvasState>(makeInitialCanvasState());
  const particlesRef = useRef<Particle[]>([]);
  const signalDotsRef = useRef<SignalDot[]>(initSignalDots());
  const [activeNodeId, setActiveNodeId] = useState<NodeId | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<NodeId | null>(null);
  const activeNodeRef = useRef<NodeId | null>(null);
  const hoveredNodeRef = useRef<NodeId | null>(null);
  activeNodeRef.current = activeNodeId;
  hoveredNodeRef.current = hoveredNodeId;

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);
      const cs = canvasStateRef.current;

      drawHexGrid(ctx, width, height, cs.mouseX, cs.mouseY, cs.globalAlpha);
      updateParticles(particlesRef.current, width, height);
      drawParticles(
        ctx,
        particlesRef.current,
        cs.particlesAlpha * cs.globalAlpha,
      );
      updateSignalDots(signalDotsRef.current);
      drawConnections(
        ctx,
        NODE_CONFIGS,
        cs.lineProgresses,
        signalDotsRef.current,
        cs.globalAlpha,
        activeNodeRef.current,
        width,
        height,
      );
      drawAllNodes(
        ctx,
        NODE_CONFIGS,
        cs.nodeStates,
        activeNodeRef.current,
        hoveredNodeRef.current,
        width,
        height,
      );
    },
    [],
  );

  const canvasRef = useCanvas({ onDraw: draw });

  useEffect(() => {
    const count =
      typeof navigator !== "undefined" &&
      (navigator.hardwareConcurrency ?? 4) <= 4
        ? 60
        : 120;
    particlesRef.current = initParticles(
      window.innerWidth,
      window.innerHeight,
      count,
    );
  }, []);

  useBootSequence(canvasStateRef);
  useCursorTrail(canvasRef, activeNodeId !== null);

  const hitTest = useCallback(
    (clientX: number, clientY: number): NodeId | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const { width, height } = canvas;
      for (const n of NODE_CONFIGS) {
        if (n.id === "hero") continue;
        const nx = n.xRatio * width;
        const ny = n.yRatio * height;
        if (Math.sqrt((clientX - nx) ** 2 + (clientY - ny) ** 2) < 44)
          return n.id;
      }
      return null;
    },
    [canvasRef],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      canvasStateRef.current.mouseX = e.clientX;
      canvasStateRef.current.mouseY = e.clientY;
      setHoveredNodeId(hitTest(e.clientX, e.clientY));
    },
    [hitTest],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const hit = hitTest(e.clientX, e.clientY);
      if (hit) setActiveNodeId((prev) => (prev === hit ? null : hit));
    },
    [hitTest],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveNodeId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{
          display: "block",
          cursor: hoveredNodeId ? "pointer" : "default",
        }}
      />
      <Panel
        activeNodeId={activeNodeId}
        onClose={() => setActiveNodeId(null)}
        canvasStateRef={canvasStateRef}
      >
        {activeNodeId === "about" && <AboutPanel />}
        {activeNodeId === "skills" && <SkillsPanel />}
        {activeNodeId === "projects" && <ProjectsPanel repos={repos} />}
        {activeNodeId === "ai-ml" && (
          <AiMlPanel repos={repos.filter((r) => r.isAiMl)} />
        )}
        {activeNodeId === "contact" && <ContactPanel />}
      </Panel>
    </div>
  );
}
