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
