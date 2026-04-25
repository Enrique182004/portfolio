import { NodeId } from "@/types/node";

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  alphaSpeed: number;
  alphaMin: number;
  alphaMax: number;
}

export interface SignalDot {
  nodeId: NodeId;
  progress: number;
  speed: number;
}

export interface NodeDrawState {
  alpha: number;
  glowRadius: number;
  ringScale: number;
}

export interface CanvasState {
  globalAlpha: number;
  nodeStates: Record<NodeId, NodeDrawState>;
  lineProgresses: Record<NodeId, number>;
  particlesAlpha: number;
  mouseX: number;
  mouseY: number;
}
