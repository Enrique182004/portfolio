export interface Point {
  x: number;
  y: number;
}

export function getHexVertices(cx: number, cy: number, r: number): Point[] {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

export function getHexCenters(
  width: number,
  height: number,
  r: number,
): Point[] {
  const w = r * 2;
  const h = Math.sqrt(3) * r;
  const cols = Math.ceil(width / (w * 0.75)) + 2;
  const rows = Math.ceil(height / h) + 2;
  const centers: Point[] = [];

  for (let col = -1; col < cols; col++) {
    for (let row = -1; row < rows; row++) {
      const x = col * w * 0.75;
      const y = row * h + (col % 2 === 0 ? 0 : h / 2);
      centers.push({ x, y });
    }
  }
  return centers;
}

export function drawHexGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  globalAlpha: number,
) {
  const r = 28;
  const glowRadius = 140;
  const centers = getHexCenters(width, height, r);

  ctx.save();
  for (const { x, y } of centers) {
    const dx = x - mouseX;
    const dy = y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const proximity = Math.max(0, 1 - dist / glowRadius);
    const baseAlpha = 0.18 * globalAlpha;
    const glowAlpha = baseAlpha + proximity * 0.25 * globalAlpha;

    ctx.strokeStyle = `rgba(45, 27, 105, ${glowAlpha})`;
    ctx.lineWidth = 0.6;

    const verts = getHexVertices(x, y, r);
    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    for (let i = 1; i < 6; i++) ctx.lineTo(verts[i].x, verts[i].y);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}
