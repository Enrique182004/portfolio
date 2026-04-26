import { NodeId, NodeConfig } from "@/types/node";
import { NodeDrawState } from "../starmap.types";

export function drawNode(
  ctx: CanvasRenderingContext2D,
  node: NodeConfig,
  state: NodeDrawState,
  isHero: boolean,
  isActive: boolean,
  isHovered: boolean,
  canvasWidth: number,
  canvasHeight: number,
) {
  const x = node.xRatio * canvasWidth;
  const y = node.yRatio * canvasHeight;
  const { alpha, ringScale } = state;

  const outerR = (isHero ? 36 : 28) * ringScale;
  const innerR = outerR * 0.7;
  const coreR = isHero ? 10 : 8;

  const color = isActive
    ? `rgba(240, 180, 41, ${alpha})`
    : `rgba(124, 58, 237, ${alpha})`;
  const glowColor = isActive
    ? `rgba(240, 180, 41, ${alpha * 0.4})`
    : `rgba(124, 58, 237, ${alpha * 0.4})`;
  const coreColor = isActive
    ? `rgba(240, 180, 41, ${alpha})`
    : `rgba(167, 139, 250, ${alpha})`;

  ctx.save();

  // Outer ring
  ctx.beginPath();
  ctx.arc(x, y, outerR, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.shadowBlur = isHovered ? 20 : 12;
  ctx.shadowColor = glowColor;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Inner ring
  ctx.beginPath();
  ctx.arc(x, y, innerR, 0, Math.PI * 2);
  ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${alpha * 0.4})`);
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Core
  ctx.beginPath();
  ctx.arc(x, y, coreR, 0, Math.PI * 2);
  ctx.fillStyle = coreColor;
  ctx.shadowBlur = 16;
  ctx.shadowColor = coreColor;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Label
  ctx.font = `10px var(--font-space-mono, monospace)`;
  ctx.fillStyle = isActive
    ? `rgba(240, 180, 41, ${alpha})`
    : `rgba(167, 139, 250, ${alpha})`;
  ctx.textAlign = "center";
  ctx.letterSpacing = "3px";
  ctx.fillText(node.label.toUpperCase(), x, y + outerR + 18);

  ctx.restore();
}

export function drawAllNodes(
  ctx: CanvasRenderingContext2D,
  nodes: NodeConfig[],
  nodeStates: Record<NodeId, NodeDrawState>,
  activeNodeId: NodeId | null,
  hoveredNodeId: NodeId | null,
  canvasWidth: number,
  canvasHeight: number,
) {
  for (const node of nodes) {
    const state = nodeStates[node.id];
    if (!state || state.alpha <= 0) continue;
    drawNode(
      ctx,
      node,
      state,
      node.id === "hero",
      node.id === activeNodeId,
      node.id === hoveredNodeId,
      canvasWidth,
      canvasHeight,
    );
  }
}
