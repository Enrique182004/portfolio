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
import { usePanel } from "@/components/Panel/use-panel";
import Panel from "@/components/Panel/Panel";
import AboutPanel from "@/components/panels/AboutPanel";
import SkillsPanel from "@/components/panels/SkillsPanel";
import ProjectsPanel from "@/components/panels/ProjectsPanel";
import AiMlPanel from "@/components/panels/AiMlPanel";
import GamesPanel from "@/components/panels/GamesPanel";
import ContactPanel from "@/components/panels/ContactPanel";

// 6-node hex layout around center — evenly spaced, symmetric
const NODE_CONFIGS: NodeConfig[] = [
  { id: "hero", label: "Enrique Calleros", xRatio: 0.5, yRatio: 0.5 },
  { id: "about", label: "About", xRatio: 0.22, yRatio: 0.22 },
  { id: "skills", label: "Skills", xRatio: 0.78, yRatio: 0.22 },
  { id: "projects", label: "Projects", xRatio: 0.1, yRatio: 0.55 },
  { id: "ai-ml", label: "AI / ML", xRatio: 0.9, yRatio: 0.55 },
  { id: "games", label: "Games", xRatio: 0.25, yRatio: 0.83 },
  { id: "contact", label: "Contact", xRatio: 0.75, yRatio: 0.83 },
];

const SATELLITE_IDS: NodeId[] = [
  "about",
  "skills",
  "projects",
  "ai-ml",
  "games",
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
  const [displayedNodeId, setDisplayedNodeId] = useState<NodeId | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<NodeId | null>(null);
  const activeNodeRef = useRef<NodeId | null>(null);
  const hoveredNodeRef = useRef<NodeId | null>(null);
  activeNodeRef.current = activeNodeId;
  hoveredNodeRef.current = hoveredNodeId;

  const zoomRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // draw callback — reads from refs, no state deps
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

  // canvasRef must be created before usePanel
  const canvasRef = useCanvas({ onDraw: draw });

  const onCloseComplete = useCallback(() => {
    setDisplayedNodeId(null);
  }, []);

  // Zoom-travel + panel fade animation
  usePanel({
    activeNodeId,
    nodeConfigs: NODE_CONFIGS,
    zoomRef,
    panelRef,
    canvasRef,
    onCloseComplete,
  });

  // Keep displayedNodeId in sync so panel content persists during close animation
  useEffect(() => {
    if (activeNodeId) setDisplayedNodeId(activeNodeId);
  }, [activeNodeId]);

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
        if (Math.sqrt((clientX - nx) ** 2 + (clientY - ny) ** 2) < 48)
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
      if (hit) setActiveNodeId(hit);
    },
    [hitTest],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveNodeId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
      {/* Zoom container — GSAP scales this toward the clicked node */}
      <div
        ref={zoomRef}
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "center center",
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
      </div>

      <Panel
        panelRef={panelRef}
        activeNodeId={activeNodeId}
        displayedNodeId={displayedNodeId}
        onClose={() => setActiveNodeId(null)}
        canvasStateRef={canvasStateRef}
      >
        {displayedNodeId === "about" && <AboutPanel />}
        {displayedNodeId === "skills" && <SkillsPanel />}
        {displayedNodeId === "projects" && <ProjectsPanel repos={repos} />}
        {displayedNodeId === "ai-ml" && (
          <AiMlPanel repos={repos.filter((r) => r.isAiMl)} />
        )}
        {displayedNodeId === "games" && (
          <GamesPanel repos={repos.filter((r) => r.isGame)} />
        )}
        {displayedNodeId === "contact" && <ContactPanel />}
      </Panel>
    </div>
  );
}
