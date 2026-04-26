import { Particle } from "../starmap.types";

export function initParticles(
  width: number,
  height: number,
  count: number,
): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: Math.random() * 1.5 + 0.5,
    alpha: Math.random(),
    alphaSpeed: Math.random() * 0.006 + 0.002,
    alphaMin: 0.1,
    alphaMax: 0.7,
  }));
}

export function updateParticles(
  particles: Particle[],
  width: number,
  height: number,
) {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha += p.alphaSpeed;

    if (p.alpha > p.alphaMax || p.alpha < p.alphaMin) {
      p.alphaSpeed *= -1;
    }

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
  }
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  globalAlpha: number,
) {
  ctx.save();
  for (const p of particles) {
    const alpha = p.alpha * globalAlpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `rgba(167, 139, 250, ${alpha * 0.6})`;
    ctx.fill();
  }
  ctx.restore();
}
