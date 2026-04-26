import { NodeId, NodeConfig } from "@/types/node";
import { SignalDot } from "../starmap.types";

const SATELLITE_IDS: NodeId[] = [
  "about",
  "skills",
  "projects",
  "ai-ml",
  "contact",
];

export function initSignalDots(): SignalDot[] {
  return SATELLITE_IDS.map((nodeId, i) => ({
    nodeId,
    progress: i * 0.2,
    speed: 0.003 + Math.random() * 0.002,
  }));
}

export function updateSignalDots(dots: SignalDot[]) {
  for (const dot of dots) {
    dot.progress += dot.speed;
    if (dot.progress > 1) dot.progress = 0;
  }
}

export function drawConnections(
  ctx: CanvasRenderingContext2D,
  nodes: NodeConfig[],
  lineProgresses: Record<NodeId, number>,
  signalDots: SignalDot[],
  globalAlpha: number,
  activeNodeId: NodeId | null,
  width: number,
  height: number,
) {
  const hero = nodes.find((n) => n.id === "hero");
  if (!hero) return;

  const hx = hero.xRatio * width;
  const hy = hero.yRatio * height;

  ctx.save();

  for (const node of nodes) {
    if (node.id === "hero") continue;
    const progress = lineProgresses[node.id] ?? 0;
    if (progress <= 0) continue;

    const isActive = node.id === activeNodeId;
    const lineAlpha = (isActive ? 0.5 : 0.25) * globalAlpha;

    const nx = node.xRatio * width;
    const ny = node.yRatio * height;
    const endX = hx + (nx - hx) * progress;
    const endY = hy + (ny - hy) * progress;

    ctx.setLineDash([5, 8]);
    ctx.strokeStyle = `rgba(45, 27, 105, ${lineAlpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  for (const dot of signalDots) {
    const node = nodes.find((n) => n.id === dot.nodeId);
    if (!node) continue;
    const progress = lineProgresses[dot.nodeId] ?? 0;
    if (progress < dot.progress) continue;

    const t = dot.progress;
    const nx = node.xRatio * width;
    const ny = node.yRatio * height;
    const x = hx + (nx - hx) * t;
    const y = hy + (ny - hy) * t;
    const dotAlpha = 0.7 * globalAlpha;

    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(167, 139, 250, ${dotAlpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(167, 139, 250, ${dotAlpha})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}
