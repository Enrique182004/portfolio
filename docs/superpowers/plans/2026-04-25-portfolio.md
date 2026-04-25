# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Enrique Calleros's portfolio — a full-viewport SC2-inspired animated starmap as primary navigation, GitHub API-powered project panels, Protoss aesthetic, no game terminology.

**Architecture:** Single Next.js 14 page renders an HTML5 Canvas 2D starmap. Clicking nodes opens GSAP-animated panels overlaying the map. GitHub repos fetched server-side via ISR. All ambient animation runs in a Canvas RAF loop; panel transitions are GSAP timelines.

**Tech Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · GSAP · HTML5 Canvas 2D · GitHub REST API v3 · Vitest · Formspree

**Spec:** `docs/superpowers/specs/2026-04-25-portfolio-design.md`

---

## File Map

```
src/
  app/
    page.tsx                          root page — async, fetches repos, renders StarMap
    layout.tsx                        fonts, metadata, global styles
    globals.css                       CSS custom properties, base reset
    api/repos/route.ts                GET /api/repos — GitHub fetch, ISR cache
  components/
    StarMap/
      StarMap.tsx                     main component — canvas, node state, panel state
      starmap.types.ts                NodeId, NodeConfig, CanvasState, BootState types
      canvas/
        use-canvas.ts                 canvas setup, RAF loop, resize handler
        draw-hex-grid.ts              hex grid drawing + mouse glow falloff
        draw-particles.ts             particle system — init, update, draw
        draw-connections.ts           dashed lines + animated signal dots
        draw-nodes.ts                 node rings, cores, breathing glow, hover/active
      use-boot-sequence.ts            GSAP timeline — boot animation on first load
      use-cursor-trail.ts             cursor trail dots on canvas
    Panel/
      Panel.tsx                       animated wrapper — slide up/down, stagger children
      use-panel.ts                    GSAP open, close, swap timeline logic
    panels/
      AboutPanel.tsx
      SkillsPanel.tsx
      ProjectsPanel.tsx
      AiMlPanel.tsx
      ContactPanel.tsx
    SkillTree/
      SkillTree.tsx                   SVG tree — cascade animation, hover tooltip
      skill-tree-data.ts              static skill hierarchy
    RepoCard/
      RepoCard.tsx                    card — hover lift, LIVE badge, demo/code buttons
    DemoModal/
      DemoModal.tsx                   iframe overlay — glassmorphism backdrop
  lib/
    github.ts                         fetch repos, map to Repo type, AI/ML filter
  types/
    repo.ts
    node.ts
  test/
    setup.ts                          @testing-library/jest-dom import
```

---

## Task 1: Project Scaffold

**Files:**

- Create: project root (via `create-next-app`)
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/kuike/Desktop/RANDOM/Portfolio
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

When prompted: No to `Would you like to use Turbopack` (already flagged). Accept all other defaults.

- [ ] **Step 2: Install dependencies**

```bash
npm install gsap
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Create vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 4: Create test setup file**

Create `src/test/setup.ts`:

```typescript
import "@testing-library/jest-dom";
```

- [ ] **Step 5: Add test script to package.json**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Write CSS custom properties**

Replace the contents of `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #060610;
  --bg-deep: #1a0a2e;
  --border: #2d1b69;
  --purple-core: #7c3aed;
  --purple-light: #a78bfa;
  --text-bright: #e9d5ff;
  --text-muted: #6d5fa0;
  --gold: #f0b429;
  --green: #10b981;
  --font-mono: var(--font-space-mono), "Courier New", monospace;
  --font-body: var(--font-inter), system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text-bright);
  font-family: var(--font-body);
  overflow: hidden;
  height: 100%;
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: var(--bg-deep);
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--purple-core);
}
```

- [ ] **Step 7: Update tailwind config**

Replace `tailwind.config.ts` with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-deep": "var(--bg-deep)",
        border: "var(--border)",
        "purple-core": "var(--purple-core)",
        "purple-light": "var(--purple-light)",
        "text-bright": "var(--text-bright)",
        "text-muted": "var(--text-muted)",
        gold: "var(--gold)",
        green: "var(--green)",
      },
      fontFamily: {
        mono: ["var(--font-space-mono)", "Courier New", "monospace"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 8: Verify scaffold builds**

```bash
npm run build
```

Expected: Build succeeds, no TypeScript errors.

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 14 project with GSAP and Vitest"
```

---

## Task 2: Types

**Files:**

- Create: `src/types/repo.ts`
- Create: `src/types/node.ts`
- Create: `src/components/StarMap/starmap.types.ts`

- [ ] **Step 1: Create repo type**

Create `src/types/repo.ts`:

```typescript
export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  topics: string[];
  isLive: boolean;
  isAiMl: boolean;
}
```

- [ ] **Step 2: Create node types**

Create `src/types/node.ts`:

```typescript
export type NodeId =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "ai-ml"
  | "contact";

export interface NodeConfig {
  id: NodeId;
  label: string;
  xRatio: number;
  yRatio: number;
}
```

- [ ] **Step 3: Create StarMap internal types**

Create `src/components/StarMap/starmap.types.ts`:

```typescript
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
```

- [ ] **Step 4: Commit**

```bash
git add src/types/ src/components/StarMap/starmap.types.ts
git commit -m "feat: add Repo, NodeId, and canvas state types"
```

---

## Task 3: GitHub Library + API Route

**Files:**

- Create: `src/lib/github.ts`
- Create: `src/app/api/repos/route.ts`
- Create: `src/lib/github.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/github.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { isAiMlRepo, mapRawRepo } from "./github";

describe("isAiMlRepo", () => {
  it("matches ml keyword in name", () => {
    expect(
      isAiMlRepo({ name: "vanGogh-ml", description: null, topics: [] }),
    ).toBe(true);
  });
  it("matches keyword in description", () => {
    expect(
      isAiMlRepo({
        name: "project",
        description: "A neural network classifier",
        topics: [],
      }),
    ).toBe(true);
  });
  it("matches keyword in topics", () => {
    expect(
      isAiMlRepo({
        name: "project",
        description: null,
        topics: ["deep-learning"],
      }),
    ).toBe(true);
  });
  it("returns false for non-AI repos", () => {
    expect(
      isAiMlRepo({ name: "portfolio", description: "My website", topics: [] }),
    ).toBe(false);
  });
});

describe("mapRawRepo", () => {
  const raw = {
    id: 1,
    name: "test-repo",
    description: "A test",
    html_url: "https://github.com/user/test-repo",
    homepage: "https://test.vercel.app",
    language: "TypeScript",
    stargazers_count: 5,
    updated_at: "2026-01-01T00:00:00Z",
    topics: [],
    private: false,
  };

  it("sets isLive true when homepage is set", () => {
    expect(mapRawRepo(raw).isLive).toBe(true);
  });
  it("sets isLive false when homepage is null", () => {
    expect(mapRawRepo({ ...raw, homepage: null }).isLive).toBe(false);
  });
  it("sets isLive false when homepage is empty string", () => {
    expect(mapRawRepo({ ...raw, homepage: "" }).isLive).toBe(false);
  });
});
```

- [ ] **Step 2: Run to confirm tests fail**

```bash
npm test
```

Expected: FAIL — `Cannot find module './github'`

- [ ] **Step 3: Implement github.ts**

Create `src/lib/github.ts`:

```typescript
import { Repo } from "@/types/repo";

const AI_ML_KEYWORDS = [
  "ml",
  "ai",
  "model",
  "neural",
  "classifier",
  "nlp",
  "deep",
  "predict",
  "dataset",
  "vang",
  "learn",
];

interface RawRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  topics: string[];
  private: boolean;
}

export function isAiMlRepo(r: {
  name: string;
  description: string | null;
  topics: string[];
}): boolean {
  const text =
    `${r.name} ${r.description ?? ""} ${r.topics.join(" ")}`.toLowerCase();
  return AI_ML_KEYWORDS.some((kw) => text.includes(kw));
}

export function mapRawRepo(r: RawRepo): Repo {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    html_url: r.html_url,
    homepage: r.homepage || null,
    language: r.language,
    stargazers_count: r.stargazers_count,
    updated_at: r.updated_at,
    topics: r.topics ?? [],
    isLive: Boolean(r.homepage),
    isAiMl: isAiMlRepo(r),
  };
}

export async function fetchRepos(): Promise<Repo[]> {
  const res = await fetch(
    "https://api.github.com/users/Enrique182004/repos?sort=updated&per_page=100",
    {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github.v3+json" },
    },
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const raw = (await res.json()) as RawRepo[];
  return raw.filter((r) => !r.private).map(mapRawRepo);
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
npm test
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Create API route**

Create `src/app/api/repos/route.ts`:

```typescript
import { fetchRepos } from "@/lib/github";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const repos = await fetchRepos();
    return NextResponse.json(repos);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch repos" },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 6: Verify route works**

```bash
npm run dev
```

Open `http://localhost:3000/api/repos` in browser.
Expected: JSON array of repo objects, each with `isLive` and `isAiMl` fields.

- [ ] **Step 7: Commit**

```bash
git add src/lib/ src/app/api/
git commit -m "feat: GitHub API lib, /api/repos route, and tests"
```

---

## Task 4: Canvas Hook

**Files:**

- Create: `src/components/StarMap/canvas/use-canvas.ts`

- [ ] **Step 1: Create canvas hook**

Create `src/components/StarMap/canvas/use-canvas.ts`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StarMap/canvas/use-canvas.ts
git commit -m "feat: canvas RAF loop hook with resize handling"
```

---

## Task 5: Hex Grid Drawing

**Files:**

- Create: `src/components/StarMap/canvas/draw-hex-grid.ts`
- Create: `src/components/StarMap/canvas/draw-hex-grid.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/components/StarMap/canvas/draw-hex-grid.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { getHexVertices, getHexCenters } from "./draw-hex-grid";

describe("getHexVertices", () => {
  it("returns 6 vertices for a flat-top hex", () => {
    const verts = getHexVertices(100, 100, 30);
    expect(verts).toHaveLength(6);
  });
  it("first vertex is at (cx + R, cy) for flat-top", () => {
    const verts = getHexVertices(100, 100, 30);
    expect(verts[0].x).toBeCloseTo(130);
    expect(verts[0].y).toBeCloseTo(100);
  });
});

describe("getHexCenters", () => {
  it("returns centers covering the canvas", () => {
    const centers = getHexCenters(200, 200, 30);
    expect(centers.length).toBeGreaterThan(0);
    expect(
      centers.every((c) => typeof c.x === "number" && typeof c.y === "number"),
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
npm test
```

Expected: FAIL — `Cannot find module './draw-hex-grid'`

- [ ] **Step 3: Implement draw-hex-grid.ts**

Create `src/components/StarMap/canvas/draw-hex-grid.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests and confirm pass**

```bash
npm test
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/StarMap/canvas/draw-hex-grid.ts src/components/StarMap/canvas/draw-hex-grid.test.ts
git commit -m "feat: hex grid drawing with mouse proximity glow"
```

---

## Task 6: Particle System

**Files:**

- Create: `src/components/StarMap/canvas/draw-particles.ts`

- [ ] **Step 1: Create particle system**

Create `src/components/StarMap/canvas/draw-particles.ts`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StarMap/canvas/draw-particles.ts
git commit -m "feat: particle system — init, update, draw"
```

---

## Task 7: Connection Lines + Signal Dots

**Files:**

- Create: `src/components/StarMap/canvas/draw-connections.ts`

- [ ] **Step 1: Create connection drawing**

Create `src/components/StarMap/canvas/draw-connections.ts`:

```typescript
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

  // Signal dots
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
```

**Note:** All draw functions receive raw `NodeConfig` with `xRatio`/`yRatio` (0–1) plus `width`/`height` and scale internally. Never pre-scale before passing.

- [ ] **Step 2: Commit**

```bash
git add src/components/StarMap/canvas/draw-connections.ts
git commit -m "feat: animated connection lines with signal dots"
```

---

## Task 8: Node Drawing

**Files:**

- Create: `src/components/StarMap/canvas/draw-nodes.ts`

- [ ] **Step 1: Create node drawing**

Create `src/components/StarMap/canvas/draw-nodes.ts`:

```typescript
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
  const labelY = y + outerR + 18;
  ctx.fillText(node.label.toUpperCase(), x, labelY);

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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StarMap/canvas/draw-nodes.ts
git commit -m "feat: node drawing — rings, cores, labels, active/hover states"
```

---

## Task 9: StarMap Component Assembly

**Files:**

- Create: `src/components/StarMap/StarMap.tsx`

- [ ] **Step 1: Create the StarMap component**

Create `src/components/StarMap/StarMap.tsx`:

```typescript
'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { NodeId, NodeConfig } from '@/types/node'
import { Repo } from '@/types/repo'
import { CanvasState, Particle, SignalDot } from './starmap.types'
import { useCanvas } from './canvas/use-canvas'
import { drawHexGrid } from './canvas/draw-hex-grid'
import { initParticles, updateParticles, drawParticles } from './canvas/draw-particles'
import { initSignalDots, updateSignalDots, drawConnections } from './canvas/draw-connections'
import { drawAllNodes } from './canvas/draw-nodes'
import Panel from '@/components/Panel/Panel'
import AboutPanel from '@/components/panels/AboutPanel'
import SkillsPanel from '@/components/panels/SkillsPanel'
import ProjectsPanel from '@/components/panels/ProjectsPanel'
import AiMlPanel from '@/components/panels/AiMlPanel'
import ContactPanel from '@/components/panels/ContactPanel'

const NODE_CONFIGS: NodeConfig[] = [
  { id: 'hero',     label: 'Enrique Calleros', xRatio: 0.5,  yRatio: 0.5  },
  { id: 'about',    label: 'About',            xRatio: 0.22, yRatio: 0.25 },
  { id: 'skills',   label: 'Skills',           xRatio: 0.78, yRatio: 0.25 },
  { id: 'projects', label: 'Projects',         xRatio: 0.18, yRatio: 0.72 },
  { id: 'ai-ml',    label: 'AI / ML',          xRatio: 0.82, yRatio: 0.72 },
  { id: 'contact',  label: 'Contact',          xRatio: 0.5,  yRatio: 0.85 },
]

const SATELLITE_IDS: NodeId[] = ['about', 'skills', 'projects', 'ai-ml', 'contact']

function makeInitialCanvasState(): CanvasState {
  const nodeStates = Object.fromEntries(
    NODE_CONFIGS.map(n => [n.id, { alpha: 0, glowRadius: n.id === 'hero' ? 36 : 28, ringScale: 1 }])
  ) as CanvasState['nodeStates']
  const lineProgresses = Object.fromEntries(
    SATELLITE_IDS.map(id => [id, 0])
  ) as CanvasState['lineProgresses']
  return { globalAlpha: 0, nodeStates, lineProgresses, particlesAlpha: 0, mouseX: -999, mouseY: -999 }
}

interface StarMapProps {
  repos: Repo[]
}

export default function StarMap({ repos }: StarMapProps) {
  const canvasStateRef = useRef<CanvasState>(makeInitialCanvasState())
  const particlesRef = useRef<Particle[]>([])
  const signalDotsRef = useRef<SignalDot[]>(initSignalDots())
  const [activeNodeId, setActiveNodeId] = useState<NodeId | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<NodeId | null>(null)
  const activeNodeRef = useRef<NodeId | null>(null)
  const hoveredNodeRef = useRef<NodeId | null>(null)
  activeNodeRef.current = activeNodeId
  hoveredNodeRef.current = hoveredNodeId

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    const cs = canvasStateRef.current

    drawHexGrid(ctx, width, height, cs.mouseX, cs.mouseY, cs.globalAlpha)
    updateParticles(particlesRef.current, width, height)
    drawParticles(ctx, particlesRef.current, cs.particlesAlpha * cs.globalAlpha)
    updateSignalDots(signalDotsRef.current)
    drawConnections(ctx, NODE_CONFIGS, cs.lineProgresses, signalDotsRef.current, cs.globalAlpha, activeNodeRef.current, width, height)
    drawAllNodes(ctx, NODE_CONFIGS, cs.nodeStates, activeNodeRef.current, hoveredNodeRef.current, width, height)
  }, [])

  const canvasRef = useCanvas({ onDraw: draw })

  // Initialize particles after canvas mounts
  useEffect(() => {
    particlesRef.current = initParticles(window.innerWidth, window.innerHeight, 120)
  }, [])

  // Mouse move — update canvasState and hovered node
  const hitTest = useCallback((clientX: number, clientY: number): NodeId | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const { width, height } = canvas
    for (const n of NODE_CONFIGS) {
      if (n.id === 'hero') continue
      const nx = n.xRatio * width
      const ny = n.yRatio * height
      if (Math.sqrt((clientX - nx) ** 2 + (clientY - ny) ** 2) < 44) return n.id
    }
    return null
  }, [canvasRef])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    canvasStateRef.current.mouseX = e.clientX
    canvasStateRef.current.mouseY = e.clientY
    setHoveredNodeId(hitTest(e.clientX, e.clientY))
  }, [hitTest])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const hit = hitTest(e.clientX, e.clientY)
    if (hit) setActiveNodeId(prev => prev === hit ? null : hit)
  }, [hitTest])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setActiveNodeId(null)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{ display: 'block', cursor: hoveredNodeId ? 'pointer' : 'default' }}
      />
      <Panel
        activeNodeId={activeNodeId}
        onClose={() => setActiveNodeId(null)}
        canvasStateRef={canvasStateRef}
      >
        {activeNodeId === 'about'    && <AboutPanel />}
        {activeNodeId === 'skills'   && <SkillsPanel />}
        {activeNodeId === 'projects' && <ProjectsPanel repos={repos} />}
        {activeNodeId === 'ai-ml'    && <AiMlPanel repos={repos.filter(r => r.isAiMl)} />}
        {activeNodeId === 'contact'  && <ContactPanel />}
      </Panel>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StarMap/StarMap.tsx
git commit -m "feat: StarMap component wiring canvas, mouse, click, panel state"
```

---

## Task 10: Boot Sequence + Cursor Trail

**Files:**

- Create: `src/components/StarMap/use-boot-sequence.ts`
- Create: `src/components/StarMap/use-cursor-trail.ts`
- Modify: `src/components/StarMap/StarMap.tsx`

- [ ] **Step 1: Create boot sequence hook**

Create `src/components/StarMap/use-boot-sequence.ts`:

```typescript
import { useEffect, MutableRefObject } from "react";
import gsap from "gsap";
import { CanvasState } from "./starmap.types";
import { NodeId } from "@/types/node";

const SATELLITE_IDS: NodeId[] = [
  "about",
  "skills",
  "projects",
  "ai-ml",
  "contact",
];

export function useBootSequence(canvasStateRef: MutableRefObject<CanvasState>) {
  useEffect(() => {
    const cs = canvasStateRef.current;
    const tl = gsap.timeline({ delay: 0.2 });

    // 1. Fade in global alpha
    tl.to(cs, { globalAlpha: 1, duration: 0.6, ease: "power2.out" });

    // 2. Hero node alpha
    tl.to(
      cs.nodeStates.hero,
      { alpha: 1, duration: 0.4, ease: "power2.out" },
      "-=0.2",
    );

    // 3. Connection lines draw out + satellite nodes fade in (staggered)
    SATELLITE_IDS.forEach((id, i) => {
      const delay = i * 0.18;
      tl.to(
        cs.lineProgresses,
        { [id]: 1, duration: 0.5, ease: "power2.out" },
        `>-=${0.4 - delay * 0.1}`,
      );
      tl.to(
        cs.nodeStates[id],
        { alpha: 1, duration: 0.35, ease: "power2.out" },
        "<+=0.25",
      );
    });

    // 4. Particles fade in
    tl.to(
      cs,
      { particlesAlpha: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4",
    );

    return () => {
      tl.kill();
    };
  }, [canvasStateRef]);
}
```

- [ ] **Step 2: Create cursor trail hook**

Create `src/components/StarMap/use-cursor-trail.ts`:

```typescript
import { useEffect, useRef } from "react";

interface TrailDot {
  x: number;
  y: number;
  alpha: number;
}

export function useCursorTrail(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  isActive: boolean,
) {
  const trailRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    if (isActive) return;

    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      trailRef.current.unshift({ x: e.clientX, y: e.clientY, alpha: 0.6 });
      if (trailRef.current.length > 8) trailRef.current.pop();
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      trailRef.current = [];
      return;
    }

    let raf: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      for (let i = 0; i < trailRef.current.length; i++) {
        const dot = trailRef.current[i];
        const r = Math.max(0.5, 3 - i * 0.35);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${dot.alpha * (1 - i / 8)})`;
        ctx.fill();
        dot.alpha *= 0.9;
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [canvasRef, isActive]);
}
```

- [ ] **Step 3: Wire both hooks into StarMap.tsx**

Add imports and calls inside `StarMap`:

```typescript
// Add to imports in StarMap.tsx
import { useBootSequence } from "./use-boot-sequence";
import { useCursorTrail } from "./use-cursor-trail";

// Add inside StarMap component, after canvasRef:
useBootSequence(canvasStateRef);
useCursorTrail(canvasRef, activeNodeId !== null);
```

- [ ] **Step 4: Start dev server and verify boot sequence**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected:

- Screen fades in
- Center node appears
- Connection lines draw out to satellite nodes
- Satellite nodes appear along their lines
- Particles fade in
- Cursor trail follows mouse on the canvas
- All ambient animations running

- [ ] **Step 5: Commit**

```bash
git add src/components/StarMap/use-boot-sequence.ts src/components/StarMap/use-cursor-trail.ts src/components/StarMap/StarMap.tsx
git commit -m "feat: boot sequence GSAP timeline and cursor trail"
```

---

## Task 11: Panel Component + GSAP Animations

**Files:**

- Create: `src/components/Panel/use-panel.ts`
- Create: `src/components/Panel/Panel.tsx`

- [ ] **Step 1: Create panel animation hook**

Create `src/components/Panel/use-panel.ts`:

```typescript
import { useEffect, useRef, MutableRefObject } from "react";
import gsap from "gsap";
import { NodeId } from "@/types/node";
import { CanvasState } from "@/components/StarMap/starmap.types";

interface UsePanelOptions {
  activeNodeId: NodeId | null;
  panelRef: React.RefObject<HTMLDivElement>;
  canvasStateRef: MutableRefObject<CanvasState>;
  onCloseComplete: () => void;
}

export function usePanel({
  activeNodeId,
  panelRef,
  canvasStateRef,
  onCloseComplete,
}: UsePanelOptions) {
  const prevNodeIdRef = useRef<NodeId | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const prev = prevNodeIdRef.current;

    if (tlRef.current) tlRef.current.kill();

    if (activeNodeId && !prev) {
      // Open from closed
      const tl = gsap.timeline();
      tl.set(panel, { y: "100%", opacity: 1, display: "flex" });
      tl.to(
        canvasStateRef.current,
        { globalAlpha: 0.2, duration: 0.35, ease: "power2.out" },
        0,
      );
      tl.to(panel, { y: "0%", duration: 0.45, ease: "back.out(1.2)" }, 0.1);
      tlRef.current = tl;
    } else if (!activeNodeId && prev) {
      // Close
      const tl = gsap.timeline({ onComplete: onCloseComplete });
      tl.to(panel, { y: "100%", duration: 0.35, ease: "power2.in" });
      tl.to(
        canvasStateRef.current,
        { globalAlpha: 1, duration: 0.4, ease: "power2.out" },
        0.1,
      );
      tlRef.current = tl;
    } else if (activeNodeId && prev && activeNodeId !== prev) {
      // Node-to-node swap
      const prevNode = prev;
      const slideOut = prevNode < activeNodeId ? "-120%" : "120%";
      const slideIn = prevNode < activeNodeId ? "120%" : "-120%";

      const tl = gsap.timeline();
      tl.to(panel, { x: slideOut, duration: 0.25, ease: "power2.in" });
      tl.to(
        canvasStateRef.current,
        { globalAlpha: 0.35, duration: 0.15 },
        0.05,
      );
      tl.to(canvasStateRef.current, { globalAlpha: 0.2, duration: 0.15 }, 0.2);
      tl.set(panel, { x: slideIn });
      tl.to(panel, { x: "0%", duration: 0.35, ease: "back.out(1.1)" });
      tlRef.current = tl;
    }

    prevNodeIdRef.current = activeNodeId;
  }, [activeNodeId, panelRef, canvasStateRef, onCloseComplete]);
}
```

- [ ] **Step 2: Create Panel wrapper component**

Create `src/components/Panel/Panel.tsx`:

```typescript
'use client'

import { useRef, useState, useEffect, MutableRefObject } from 'react'
import { NodeId } from '@/types/node'
import { CanvasState } from '@/components/StarMap/starmap.types'
import { usePanel } from './use-panel'

interface PanelProps {
  activeNodeId: NodeId | null
  onClose: () => void
  canvasStateRef: MutableRefObject<CanvasState>
  children: React.ReactNode
}

export default function Panel({ activeNodeId, onClose, canvasStateRef, children }: PanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [displayedNodeId, setDisplayedNodeId] = useState<NodeId | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (activeNodeId) {
      setDisplayedNodeId(activeNodeId)
      setIsVisible(true)
    }
  }, [activeNodeId])

  usePanel({
    activeNodeId,
    panelRef,
    canvasStateRef,
    onCloseComplete: () => {
      setIsVisible(false)
      setDisplayedNodeId(null)
    },
  })

  if (!isVisible && !activeNodeId) return null

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'transparent',
          zIndex: 10,
          display: isVisible ? 'block' : 'none',
        }}
      />
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: '5%',
          right: '5%',
          height: '78vh',
          background: 'rgba(9, 9, 26, 0.96)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--purple-core)',
          borderLeft: '1px solid var(--border)',
          borderRight: '1px solid var(--border)',
          borderRadius: '8px 8px 0 0',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          transform: 'translateY(100%)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Panel header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 24px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--purple-core)', boxShadow: '0 0 8px var(--purple-core)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 4, color: 'var(--purple-light)', textTransform: 'uppercase' }}>
            {displayedNodeId?.replace('-', ' / ') ?? ''}
          </span>
          <button
            onClick={onClose}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, cursor: 'pointer' }}
          >
            [ ESC ]
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Verify panel opens and closes**

```bash
npm run dev
```

Click any node — panel should slide up. Press ESC or click outside — panel slides down. Starmap dims when panel is open.

- [ ] **Step 4: Commit**

```bash
git add src/components/Panel/
git commit -m "feat: Panel component with GSAP open/close/swap animations"
```

---

## Task 12: About Panel

**Files:**

- Create: `src/components/panels/AboutPanel.tsx`

- [ ] **Step 1: Create About panel**

Create `src/components/panels/AboutPanel.tsx`:

```typescript
export default function AboutPanel() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 22, letterSpacing: 3, color: 'var(--text-bright)', marginBottom: 8 }}>
        Enrique Calleros
      </h2>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 4, color: 'var(--purple-light)', marginBottom: 32, textTransform: 'uppercase' }}>
        Researcher &amp; Developer
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40, alignItems: 'start' }}>
        {/* Avatar placeholder */}
        <div style={{
          width: '100%', aspectRatio: '1',
          border: '1px solid var(--border)',
          borderRadius: 4,
          background: 'rgba(45, 27, 105, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', border: '1px solid var(--purple-core)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
            <span style={{ fontSize: 32, color: 'var(--purple-light)' }}>⬡</span>
          </div>
        </div>

        <div>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24, fontSize: 14 }}>
            Computer Science student at the University of Texas at El Paso (UTEP), focused on full-stack web development, machine learning, and building things that are actually useful. I work across the entire stack — from UI to infrastructure — and gravitate toward projects that combine data, interaction, and clean engineering.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'University', value: 'UTEP' },
              { label: 'Degree', value: 'Computer Science' },
              { label: 'Focus', value: 'Full Stack + AI/ML' },
              { label: 'GitHub', value: 'Enrique182004' },
            ].map(({ label, value }) => (
              <div key={label} style={{ borderLeft: '2px solid var(--border)', paddingLeft: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 3, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-bright)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify About panel renders**

```bash
npm run dev
```

Click About node — panel should show bio and grid of info items.

- [ ] **Step 3: Commit**

```bash
git add src/components/panels/AboutPanel.tsx
git commit -m "feat: About panel with bio and info grid"
```

---

## Task 13: Skill Tree Data + Component

**Files:**

- Create: `src/components/SkillTree/skill-tree-data.ts`
- Create: `src/components/SkillTree/SkillTree.tsx`

- [ ] **Step 1: Create skill tree data**

Create `src/components/SkillTree/skill-tree-data.ts`:

```typescript
export interface SkillNode {
  id: string;
  label: string;
  proficiency: number; // 0-1, controls glow intensity
  projects?: string[];
  children?: SkillNode[];
}

export const SKILL_TREE: SkillNode = {
  id: "root",
  label: "Enrique Calleros",
  proficiency: 1,
  children: [
    {
      id: "frontend",
      label: "Frontend",
      proficiency: 0.95,
      children: [
        {
          id: "react",
          label: "React / Next.js",
          proficiency: 0.95,
          projects: ["Portfolio", "ToDoList"],
        },
        {
          id: "html-css",
          label: "HTML5 / CSS3",
          proficiency: 1,
          projects: ["Portfolio"],
        },
        {
          id: "d3",
          label: "D3.js / Recharts",
          proficiency: 0.75,
          projects: ["Data visualizations"],
        },
        { id: "figma", label: "Figma", proficiency: 0.7 },
      ],
    },
    {
      id: "backend",
      label: "Backend",
      proficiency: 0.9,
      children: [
        {
          id: "nodejs",
          label: "Node.js",
          proficiency: 0.85,
          projects: ["Portfolio", "Crawler"],
        },
        {
          id: "python-web",
          label: "Flask / FastAPI",
          proficiency: 0.85,
          projects: ["Crawler", "ML APIs"],
        },
        { id: "sql-firebase", label: "SQL / Firebase", proficiency: 0.8 },
        {
          id: "docker",
          label: "Docker",
          proficiency: 0.75,
          projects: ["Crawler"],
        },
      ],
    },
    {
      id: "ai-ml",
      label: "AI / ML",
      proficiency: 0.85,
      children: [
        {
          id: "sklearn",
          label: "scikit-learn / XGBoost",
          proficiency: 0.85,
          projects: ["Classifiers"],
        },
        {
          id: "pandas",
          label: "Pandas / NumPy",
          proficiency: 0.9,
          projects: ["Data pipelines"],
        },
        { id: "jupyter", label: "Jupyter", proficiency: 0.9 },
      ],
    },
    {
      id: "other",
      label: "Other",
      proficiency: 0.7,
      children: [
        { id: "java", label: "Java / Java Swing", proficiency: 0.8 },
        { id: "dart", label: "Dart (Flutter)", proficiency: 0.65 },
        { id: "php-haskell", label: "PHP / Haskell", proficiency: 0.5 },
      ],
    },
  ],
};
```

- [ ] **Step 2: Create SkillTree component**

Create `src/components/SkillTree/SkillTree.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { SkillNode, SKILL_TREE } from './skill-tree-data'

interface TooltipState {
  nodeId: string | null
  x: number
  y: number
}

function SkillLeaf({ node, depth }: { node: SkillNode; depth: number }) {
  const [tooltip, setTooltip] = useState<TooltipState>({ nodeId: null, x: 0, y: 0 })
  const isLeaf = !node.children || node.children.length === 0
  const glow = `rgba(167, 139, 250, ${node.proficiency * 0.5})`
  const border = depth === 0
    ? 'var(--purple-light)'
    : depth === 1
    ? 'var(--purple-core)'
    : 'var(--border)'
  const color = depth === 0
    ? 'var(--text-bright)'
    : depth === 1
    ? 'var(--purple-light)'
    : 'var(--text-muted)'
  const fontSize = depth === 0 ? 13 : depth === 1 ? 11 : 10

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      <div
        onMouseEnter={e => isLeaf && setTooltip({ nodeId: node.id, x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setTooltip({ nodeId: null, x: 0, y: 0 })}
        style={{
          position: 'relative',
          padding: '5px 14px',
          border: `1px solid ${border}`,
          borderRadius: 3,
          fontSize,
          fontFamily: 'var(--font-mono)',
          letterSpacing: 2,
          color,
          background: `rgba(45, 27, 105, ${node.proficiency * 0.12})`,
          boxShadow: depth <= 1 ? `0 0 ${node.proficiency * 12}px ${glow}` : 'none',
          cursor: isLeaf ? 'default' : 'default',
          whiteSpace: 'nowrap',
        }}
      >
        {node.label}

        {/* Tooltip */}
        {tooltip.nodeId === node.id && node.projects && (
          <div style={{
            position: 'fixed',
            left: tooltip.x + 12,
            top: tooltip.y - 32,
            background: 'var(--bg-deep)',
            border: '1px solid var(--border)',
            borderRadius: 3,
            padding: '6px 10px',
            fontSize: 9,
            fontFamily: 'var(--font-mono)',
            letterSpacing: 1,
            color: 'var(--text-muted)',
            zIndex: 100,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            Used in: {node.projects.join(', ')}
          </div>
        )}
      </div>

      {node.children && (
        <>
          {/* Vertical connector down */}
          <div style={{ width: 1, height: 14, background: 'linear-gradient(to bottom, var(--border), transparent)' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {node.children.map((child, i) => (
              <div key={child.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Horizontal tick */}
                {node.children!.length > 1 && (
                  <div style={{ width: 1, height: 10, background: 'var(--border)', marginBottom: 0 }} />
                )}
                <SkillLeaf node={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function SkillTree() {
  return (
    <div style={{ overflowX: 'auto', padding: '8px 0 24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 'max-content' }}>
        <SkillLeaf node={SKILL_TREE} depth={0} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SkillTree/
git commit -m "feat: skill tree data and interactive SVG-style tree component"
```

---

## Task 14: Skills Panel

**Files:**

- Create: `src/components/panels/SkillsPanel.tsx`

- [ ] **Step 1: Create Skills panel**

Create `src/components/panels/SkillsPanel.tsx`:

```typescript
import SkillTree from '@/components/SkillTree/SkillTree'

export default function SkillsPanel() {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, letterSpacing: 3, color: 'var(--text-bright)', marginBottom: 6 }}>
        Skills
      </h2>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--text-muted)', marginBottom: 32, textTransform: 'uppercase' }}>
        Technology stack — hover leaf nodes for project context
      </p>
      <SkillTree />
    </div>
  )
}
```

- [ ] **Step 2: Verify tree renders in Skills panel**

```bash
npm run dev
```

Click Skills node — research tree should render with all 4 branches and their leaves.

- [ ] **Step 3: Commit**

```bash
git add src/components/panels/SkillsPanel.tsx
git commit -m "feat: Skills panel with research tree"
```

---

## Task 15: Repo Card + Demo Modal

**Files:**

- Create: `src/components/RepoCard/RepoCard.tsx`
- Create: `src/components/DemoModal/DemoModal.tsx`

- [ ] **Step 1: Create RepoCard**

Create `src/components/RepoCard/RepoCard.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Repo } from '@/types/repo'
import DemoModal from '@/components/DemoModal/DemoModal'

interface RepoCardProps {
  repo: Repo
}

export default function RepoCard({ repo }: RepoCardProps) {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <>
      <div
        style={{
          position: 'relative',
          background: 'rgba(45, 27, 105, 0.06)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          padding: 16,
          transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
          cursor: 'default',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor = 'var(--purple-core)'
          el.style.transform = 'translateY(-4px)'
          el.style.boxShadow = '0 8px 24px rgba(124,58,237,0.15)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.borderColor = 'var(--border)'
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }}
      >
        {repo.isLive && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            fontSize: 7, padding: '2px 6px',
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid var(--green)',
            color: 'var(--green)',
            borderRadius: 2,
            fontFamily: 'var(--font-mono)',
            letterSpacing: 1,
          }}>
            LIVE
          </div>
        )}

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-bright)', marginBottom: 8, paddingRight: repo.isLive ? 48 : 0 }}>
          {repo.name}
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12, minHeight: 36 }}>
          {repo.description ?? 'No description'}
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
          {repo.language && (
            <span style={{ fontSize: 8, padding: '2px 6px', background: 'rgba(124,58,237,0.12)', border: '1px solid var(--border)', color: 'var(--purple-light)', borderRadius: 2, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
              {repo.language}
            </span>
          )}
          {repo.topics.slice(0, 2).map(t => (
            <span key={t} style={{ fontSize: 8, padding: '2px 6px', background: 'rgba(124,58,237,0.08)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 2, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
              {t}
            </span>
          ))}
          <span style={{ fontSize: 8, color: 'var(--text-muted)', marginLeft: 'auto', alignSelf: 'center' }}>
            ★ {repo.stargazers_count}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {repo.isLive && (
            <button
              onClick={() => setDemoOpen(true)}
              style={{
                fontSize: 8, padding: '4px 12px',
                background: 'rgba(124,58,237,0.18)',
                border: '1px solid var(--purple-core)',
                color: 'var(--text-bright)',
                borderRadius: 2,
                fontFamily: 'var(--font-mono)',
                letterSpacing: 2,
                cursor: 'pointer',
                boxShadow: '0 0 8px rgba(124,58,237,0.2)',
              }}
            >
              ▶ DEMO
            </button>
          )}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 8, padding: '4px 12px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              borderRadius: 2,
              fontFamily: 'var(--font-mono)',
              letterSpacing: 2,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            ⌥ CODE
          </a>
        </div>
      </div>

      {demoOpen && repo.homepage && (
        <DemoModal url={repo.homepage} name={repo.name} onClose={() => setDemoOpen(false)} />
      )}
    </>
  )
}
```

- [ ] **Step 2: Create DemoModal**

Create `src/components/DemoModal/DemoModal.tsx`:

```typescript
'use client'

import { useEffect } from 'react'

interface DemoModalProps {
  url: string
  name: string
  onClose: () => void
}

export default function DemoModal({ url, name, onClose }: DemoModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(6, 6, 16, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 50,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%', maxWidth: 1100,
          height: '85vh',
          background: 'var(--bg-deep)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--purple-core)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, color: 'var(--purple-light)' }}>
            {name.toUpperCase()}
          </span>
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ marginLeft: 'auto', fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, textDecoration: 'none' }}>
            ↗ OPEN
          </a>
          <button onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, cursor: 'pointer', marginLeft: 8 }}>
            [ ESC ]
          </button>
        </div>

        <iframe
          src={url}
          title={name}
          style={{ flex: 1, border: 'none', background: '#fff' }}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/RepoCard/ src/components/DemoModal/
git commit -m "feat: RepoCard with hover effects and DemoModal iframe overlay"
```

---

## Task 16: Projects, AI/ML, and Contact Panels

**Files:**

- Create: `src/components/panels/ProjectsPanel.tsx`
- Create: `src/components/panels/AiMlPanel.tsx`
- Create: `src/components/panels/ContactPanel.tsx`

- [ ] **Step 1: Create Projects panel**

Create `src/components/panels/ProjectsPanel.tsx`:

```typescript
import { Repo } from '@/types/repo'
import RepoCard from '@/components/RepoCard/RepoCard'

interface ProjectsPanelProps {
  repos: Repo[]
}

export default function ProjectsPanel({ repos }: ProjectsPanelProps) {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, letterSpacing: 3, color: 'var(--text-bright)', marginBottom: 6 }}>
        Projects
      </h2>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--text-muted)', marginBottom: 32, textTransform: 'uppercase' }}>
        Public repositories · Sorted by last updated
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {repos.map(repo => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create AI/ML panel**

Create `src/components/panels/AiMlPanel.tsx`:

```typescript
import { Repo } from '@/types/repo'
import RepoCard from '@/components/RepoCard/RepoCard'

interface AiMlPanelProps {
  repos: Repo[]
}

export default function AiMlPanel({ repos }: AiMlPanelProps) {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, letterSpacing: 3, color: 'var(--text-bright)', marginBottom: 6 }}>
        AI / ML
      </h2>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>
        Machine learning, data science, and AI experimentation
      </p>
      {repos.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 40, textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>
          No AI/ML repositories detected yet.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 24 }}>
          {repos.map(repo => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create Contact panel**

Create `src/components/panels/ContactPanel.tsx`:

```typescript
'use client'

import { useState, FormEvent } from 'react'

export default function ContactPanel() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) { setStatus('sent'); form.reset() }
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(45,27,105,0.1)',
    border: '1px solid var(--border)',
    borderRadius: 3,
    padding: '10px 14px',
    color: 'var(--text-bright)',
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    outline: 'none',
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, letterSpacing: 3, color: 'var(--text-bright)', marginBottom: 6 }}>
        Contact
      </h2>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--text-muted)', marginBottom: 32, textTransform: 'uppercase' }}>
        Get in touch
      </p>

      {/* Links */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
        {[
          { label: 'GitHub', href: 'https://github.com/Enrique182004', icon: '⌥' },
          { label: 'Email', href: 'mailto:ecalleros4@miners.utep.edu', icon: '✉' },
        ].map(({ label, href, icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 18px',
              border: '1px solid var(--border)',
              borderRadius: 3,
              color: 'var(--purple-light)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 2,
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--purple-core)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <span>{icon}</span> {label}
          </a>
        ))}
      </div>

      {/* Contact form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <input name="name" required placeholder="Name" style={inputStyle} />
          <input name="email" type="email" required placeholder="Email" style={inputStyle} />
        </div>
        <textarea name="message" required placeholder="Message" rows={5} style={{ ...inputStyle, resize: 'vertical' }} />

        <button
          type="submit"
          disabled={status === 'sending' || status === 'sent'}
          style={{
            padding: '10px 24px',
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid var(--purple-core)',
            borderRadius: 3,
            color: 'var(--text-bright)',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: 3,
            cursor: status === 'sent' ? 'default' : 'pointer',
            boxShadow: '0 0 12px rgba(124,58,237,0.2)',
          }}
        >
          {status === 'idle' && 'SEND MESSAGE'}
          {status === 'sending' && 'SENDING...'}
          {status === 'sent' && 'MESSAGE SENT ✓'}
          {status === 'error' && 'RETRY'}
        </button>
      </form>
    </div>
  )
}
```

**Note:** Replace `YOUR_FORM_ID` in `ContactPanel.tsx` with your Formspree form ID. Get one free at formspree.io.

- [ ] **Step 4: Verify all panels render**

```bash
npm run dev
```

Click each node in turn. All 5 panels should open with correct content.

- [ ] **Step 5: Commit**

```bash
git add src/components/panels/
git commit -m "feat: Projects, AI/ML, and Contact panels"
```

---

## Task 17: Root Page + Layout

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update layout.tsx**

Replace `src/app/layout.tsx` with:

```typescript
import type { Metadata } from 'next'
import { Space_Mono, Inter } from 'next/font/google'
import './globals.css'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Enrique Calleros — Researcher & Developer',
  description: 'Full-stack developer and researcher focused on web development, machine learning, and AI. UTEP Computer Science.',
  openGraph: {
    title: 'Enrique Calleros — Researcher & Developer',
    description: 'Full-stack developer and researcher focused on web development, machine learning, and AI.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Update page.tsx**

Replace `src/app/page.tsx` with:

```typescript
import { fetchRepos } from '@/lib/github'
import StarMap from '@/components/StarMap/StarMap'

export const revalidate = 3600

export default async function Home() {
  let repos = []
  try {
    repos = await fetchRepos()
  } catch {
    // Render with empty repos if GitHub API fails
  }

  return <StarMap repos={repos} />
}
```

- [ ] **Step 3: Full build check**

```bash
npm run build
```

Expected: Clean build, no TypeScript errors.

- [ ] **Step 4: Full smoke test in browser**

```bash
npm run dev
```

Verify:

- Boot sequence plays on load
- All 6 nodes visible
- Clicking each node opens correct panel
- Node-to-node navigation works without full close
- ESC closes panel
- Repos appear in Projects and AI/ML panels
- LIVE badge and DEMO button appear on repos with homepage set
- Demo modal opens iframe

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat: root layout with fonts and metadata, async page with repo fetch"
```

---

## Task 18: Responsive Styles

**Files:**

- Modify: `src/components/StarMap/StarMap.tsx`
- Modify: `src/components/Panel/Panel.tsx`
- Modify: `src/components/panels/ProjectsPanel.tsx`
- Modify: `src/components/panels/AiMlPanel.tsx`

- [ ] **Step 1: Reduce particle count on mobile**

In `src/components/StarMap/StarMap.tsx`, change the `initParticles` call in `useEffect`:

```typescript
useEffect(() => {
  const count = (navigator.hardwareConcurrency ?? 4) <= 4 ? 60 : 120;
  particlesRef.current = initParticles(
    window.innerWidth,
    window.innerHeight,
    count,
  );
}, []);
```

- [ ] **Step 2: Make panel full-screen on mobile**

In `src/components/Panel/Panel.tsx`, replace the panel outer div's style with:

```typescript
style={{
  position: 'fixed',
  bottom: 0,
  left: typeof window !== 'undefined' && window.innerWidth < 768 ? '0' : '5%',
  right: typeof window !== 'undefined' && window.innerWidth < 768 ? '0' : '5%',
  height: typeof window !== 'undefined' && window.innerWidth < 768 ? '92vh' : '78vh',
  background: 'rgba(9, 9, 26, 0.96)',
  backdropFilter: 'blur(12px)',
  borderTop: '1px solid var(--purple-core)',
  borderLeft: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : '1px solid var(--border)',
  borderRight: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : '1px solid var(--border)',
  borderRadius: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px 12px 0 0' : '8px 8px 0 0',
  zIndex: 20,
  display: 'flex',
  flexDirection: 'column',
  transform: 'translateY(100%)',
  overflow: 'hidden',
}}
```

- [ ] **Step 3: Responsive repo grid**

In both `ProjectsPanel.tsx` and `AiMlPanel.tsx`, replace the grid style:

```typescript
style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: 14,
}}
```

- [ ] **Step 4: Verify on mobile viewport**

In Chrome DevTools, toggle to mobile (375px width). Verify:

- Starmap still renders with all nodes
- Panel opens full-width
- Repo grid is single column

- [ ] **Step 5: Commit**

```bash
git add src/components/StarMap/StarMap.tsx src/components/Panel/Panel.tsx src/components/panels/ProjectsPanel.tsx src/components/panels/AiMlPanel.tsx
git commit -m "feat: responsive adjustments for mobile — panel, grid, particle count"
```

---

## Task 19: Deploy to Vercel

**Files:**

- Create: `.gitignore` additions
- Create: `vercel.json` (optional)

- [ ] **Step 1: Confirm .gitignore covers .superpowers**

Open `.gitignore` and verify it contains (add if not present):

```
.superpowers/
```

- [ ] **Step 2: Add Formspree form ID**

In `src/components/panels/ContactPanel.tsx`, replace `YOUR_FORM_ID`:

1. Go to formspree.io, create a free account
2. Create a new form
3. Copy the form ID (format: `xyzabc12`)
4. Replace: `https://formspree.io/f/YOUR_FORM_ID` → `https://formspree.io/f/xyzabc12`

- [ ] **Step 3: Final build**

```bash
npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 4: Push to GitHub**

```bash
git remote add origin https://github.com/Enrique182004/portfolio.git
git branch -M main
git push -u origin main
```

(Create the `portfolio` repo on GitHub first if it doesn't exist)

- [ ] **Step 5: Deploy on Vercel**

1. Go to vercel.com, import the GitHub repo `Enrique182004/portfolio`
2. Framework: Next.js (auto-detected)
3. No environment variables needed (GitHub API is public)
4. Deploy

- [ ] **Step 6: Verify live deployment**

Open the Vercel URL. Verify:

- Boot sequence plays
- All nodes clickable, all panels open
- GitHub repos load (Projects + AI/ML panels)
- Contact form submits via Formspree

- [ ] **Step 7: Final commit**

```bash
git add .gitignore
git commit -m "chore: add .superpowers to gitignore, ready for deploy"
git push
```

---

## Verification Checklist

- [ ] `npm test` — all tests pass
- [ ] `npm run build` — clean TypeScript build
- [ ] Boot sequence plays on first load (~2s, nodes appear one by one)
- [ ] All 6 nodes visible on starmap
- [ ] Hex grid glows near cursor
- [ ] Particle field drifts
- [ ] Signal dots travel along connection lines
- [ ] Cursor trail visible on starmap, hidden when panel is open
- [ ] Clicking each node opens correct panel with correct content
- [ ] Node-to-node swap works (click one node while another's panel is open)
- [ ] ESC closes panel, starmap returns to full opacity
- [ ] Active node turns gold while panel is open
- [ ] `/api/repos` returns repo JSON
- [ ] Repos with `homepage` show LIVE badge + DEMO button
- [ ] Demo modal opens iframe, ESC closes it
- [ ] Skill tree renders all 4 branches, hover tooltips work
- [ ] Contact form submits (status changes to SENT)
- [ ] Mobile: panel full-width, repo grid single column
- [ ] Deployed Vercel URL resolves
