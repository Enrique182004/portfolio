# Portfolio Website — Design Spec

**Date:** 2026-04-25  
**Owner:** Enrique Calleros  
**GitHub:** Enrique182004

---

## Overview

A personal portfolio website that doubles as the GitHub profile landing page. Visually inspired by StarCraft 2's Protoss faction — dark space aesthetic, geometric hexagons, glowing purple energy — but with entirely clean, professional language (no in-game terminology). The centerpiece is an interactive galaxy starmap used as the primary navigation mechanism.

---

## Visual Language

### Color Palette

| Token            | Hex       | Usage                                    |
| ---------------- | --------- | ---------------------------------------- |
| `--bg`           | `#060610` | Page background                          |
| `--bg-deep`      | `#1a0a2e` | Panel backgrounds                        |
| `--border`       | `#2d1b69` | All borders, connection lines            |
| `--purple-core`  | `#7c3aed` | Primary glow, node cores, active states  |
| `--purple-light` | `#a78bfa` | Text highlights, node rings              |
| `--text-bright`  | `#e9d5ff` | Headings                                 |
| `--text-muted`   | `#6d5fa0` | Body text, descriptions                  |
| `--gold`         | `#f0b429` | Active node indicator, selected state    |
| `--green`        | `#10b981` | "Live" badge on repos with deployed URLs |

### Typography

- **Headings / Labels:** Space Mono (Google Fonts) — monospace, wide letter-spacing
- **Body / Descriptions:** Inter
- Label style: uppercase, `letter-spacing: 3–4px`, small size (9–10px)

---

## Architecture

### Pages / Routes

```
/                  → Starmap (home, full viewport)
/api/repos         → Server route — fetches GitHub repos, cached ISR 1hr
```

No other routes. All content is rendered inside panels overlaid on the starmap.

### Tech Stack

| Layer       | Choice                                                                 |
| ----------- | ---------------------------------------------------------------------- |
| Framework   | Next.js 14 (App Router), TypeScript                                    |
| Styling     | Tailwind CSS + CSS custom properties                                   |
| Animations  | GSAP (panel transitions, node interactions) + CSS animations (ambient) |
| Starmap     | HTML5 Canvas 2D — hex grid + particles drawn procedurally              |
| GitHub Data | GitHub REST API v3, fetched server-side, ISR revalidate 3600s          |
| Fonts       | Space Mono + Inter (Google Fonts)                                      |
| Deployment  | Vercel (auto-deploy from `main`)                                       |

### Data Flow

```
Page load
  └─ Next.js server fetches GET /users/Enrique182004/repos
       └─ Filters: public, sorted by updated_at
       └─ Checks homepage field → marks repos with live URLs as LIVE
       └─ Passes as props to StarMap component

Client
  └─ Canvas renders hex grid + particles
  └─ GSAP manages all panel transitions
  └─ No client-side API calls (data pre-fetched)
```

---

## Sections / Nodes

Six nodes arranged around a central hero node on the starmap:

| Node          | Position      | Content                                               |
| ------------- | ------------- | ----------------------------------------------------- |
| Hero (center) | Center        | Name, title, brief tagline, the starmap itself        |
| About         | Upper-left    | Bio paragraph, photo/avatar, education (UTEP)         |
| Skills        | Upper-right   | Research tree — branching skill hierarchy             |
| Projects      | Lower-left    | GitHub repos grid with live demo support              |
| AI / ML       | Lower-right   | AI and ML focused projects, highlighted separately    |
| Contact       | Bottom-center | Email, GitHub, LinkedIn links + optional contact form |

---

## Starmap — Canvas 2D

### Background (always rendering)

- **Hex grid:** Procedurally drawn hexagons tiling the full canvas. Hexagons within ~120px of the cursor glow slightly brighter — smooth falloff.
- **Particle field:** ~120 particles. Each has its own position, velocity (slow drift), opacity cycle, and size (1–4px). They float independently — no two move the same way.
- **Connection lines:** Dashed lines from center node to each satellite node. Small bright dots travel along each line at different speeds, looping — like data signals in transit.

### Nodes

- Each node: outer ring, inner ring (40% opacity), glowing core
- **Idle:** slow breathing glow pulse on a 3–4s sine cycle, each node offset so they never sync
- **Hover:** ring expands 10%, connection line brightens, cursor becomes pointer
- **Active (panel open):** ring and core turn gold, orbiting micro-particle appears

### Boot Sequence (first load)

1. Screen fades in from black (~400ms)
2. Center node appears with a radial burst
3. Connection lines draw outward one by one (200ms stagger)
4. Satellite nodes fade in along their lines
5. Ambient animation begins
   Total: ~2s

### Cursor Trail

6–8 dots follow the cursor across the canvas. Each dot decreases in size and opacity from front to back. Only visible on the starmap — hidden when a panel is open.

---

## Panel System

### Open Sequence (on node click)

1. Node flashes gold → radial burst ripple expands outward (300ms)
2. All connection lines briefly glow white then settle
3. Starmap fades to 20% opacity
4. Panel slides up from bottom with spring easing (slight overshoot, settles)
5. Panel header renders first
6. Content items stagger in from below, 60ms apart

### Node-to-Node Jump (panel already open)

1. Current panel slides out left or right (based on new node position relative to old)
2. Starmap briefly brightens, canvas translates slightly toward new node (2D pan effect via GSAP)
3. New node flashes gold
4. New panel slides in from opposite side

### Close Sequence

- ESC, clicking outside the panel, or close button
- Panel slides back down
- Starmap fades back to full opacity
- Active node returns to idle state

### Panel Visual

- Background: `#09091a` with slight backdrop blur
- Top border: 1px `--purple-core` line
- Header row: section title left, `[ ESC ]` right
- Scrollable content area with custom scrollbar (thin, purple-tinted)

---

## Section Designs

### About

- Short bio (2–3 sentences)
- Profile photo or geometric avatar placeholder
- Education: UTEP — degree, graduation year
- Animated in: text lines slide in left-to-right with stagger

### Skills — Research Tree

Branching hierarchy, rendered as an SVG tree:

```
Enrique Calleros
├── Frontend
│   ├── React / Next.js
│   ├── HTML5 / CSS3
│   ├── D3.js / Recharts
│   └── Figma
├── Backend
│   ├── Node.js
│   ├── Python (Flask / FastAPI)
│   ├── SQL / Firebase
│   └── Docker
├── AI / ML
│   ├── scikit-learn / XGBoost
│   ├── Pandas / NumPy
│   └── Jupyter
└── Mobile / Other
    ├── Dart (Flutter)
    ├── Java / Java Swing
    └── PHP / Haskell
```

- Nodes cascade in on open (60ms stagger, root → branches → leaves)
- Hover a leaf: tooltip shows "Used in: [project name(s)]", branch path highlights
- Leaf glow intensity = rough proficiency indicator (brighter = more proficient)

### Projects — GitHub Repos

- Grid of repo cards (3 columns desktop, 2 tablet, 1 mobile)
- Fetched live from GitHub API, sorted by last updated
- Each card: repo name, description, language tags, star count
- **LIVE badge** (green) if `repo.homepage` is set
- **▶ DEMO** button → opens demo modal (iframe + full-screen link)
- **⌥ CODE** button → opens GitHub repo in new tab
- Card hover: lifts 4px, border glows purple, gradient sweep
- Demo modal: full-screen overlay, iframe, glassmorphism backdrop

### AI / ML

- Subset of repos whose name or description contains any of: `ml`, `ai`, `model`, `neural`, `classifier`, `nlp`, `deep`, `learn`, `predict`, `dataset`, `vang` (vanGogh)
- Filtering happens in `lib/github.ts` at build time — no client logic needed
- Same card layout as Projects but with an intro paragraph: "Projects focused on machine learning, data science, and AI experimentation."
- Cards show language (Python dominant), stars, and demo/code buttons same as Projects

### Contact

- Email link (mailto)
- GitHub profile link
- LinkedIn link
- Contact form (name, email, message) → submits to Formspree (no backend needed, free tier sufficient)

---

## Responsive Behavior

- **Desktop (≥1024px):** Full starmap, all nodes visible, 3-column repo grid
- **Tablet (768–1023px):** Starmap scales down, nodes slightly closer to center, 2-column grid
- **Mobile (<768px):** Starmap still renders but nodes are larger and spaced for tap targets. Panels are full-screen bottom sheets. 1-column grid.

---

## Performance

- Canvas render loop uses `requestAnimationFrame`, cancelled on unmount
- Particle count drops to 60 on mobile (detected via `navigator.hardwareConcurrency`)
- GitHub API response cached at build time (ISR), no runtime API cost per visitor
- Images: Next.js `<Image>` with lazy loading
- Fonts: preloaded in `<head>`

---

## File Structure

```
src/
  app/
    page.tsx              ← root page, passes repo data to StarMap
    layout.tsx            ← global layout, fonts, metadata
    api/
      repos/route.ts      ← GitHub API fetch + cache
  components/
    StarMap.tsx           ← Canvas + node layout + GSAP orchestration
    Node.tsx              ← individual node component
    Panel.tsx             ← animated panel wrapper
    panels/
      AboutPanel.tsx
      SkillsPanel.tsx
      ProjectsPanel.tsx
      AiPanel.tsx
      ContactPanel.tsx
    RepoCard.tsx          ← individual project card
    DemoModal.tsx         ← iframe demo overlay
    SkillTree.tsx         ← SVG research tree
  hooks/
    use-canvas.ts         ← canvas setup + render loop
    use-gsap-panel.ts     ← panel open/close animation logic
  lib/
    github.ts             ← GitHub API client
    skill-tree-data.ts    ← static skill tree definition
  types/
    repo.ts
    node.ts
```

---

## Verification

1. `npm run dev` — starmap renders, boot sequence plays, nodes visible
2. Click each node — panel opens with correct content, animation plays
3. Node-to-node jump — seamless panel swap without full close/reopen
4. ESC closes panel — starmap returns to full opacity
5. `/api/repos` endpoint returns JSON array of repos
6. Repos with `homepage` field show LIVE badge + Demo button
7. Demo modal opens iframe for a live repo
8. Skills tree: all branches visible, hover tooltip works
9. `npm run build` — no TypeScript errors, clean build
10. Deployed to Vercel — live URL resolves, ISR cache working
