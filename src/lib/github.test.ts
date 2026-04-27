import { describe, it, expect } from "vitest";
import { isAiMlRepo, isGameRepo, mapRawRepo } from "./github";

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
  // Regression: "html5" contains "ml" as substring — must not match
  it("does not match html5 as ml", () => {
    expect(
      isAiMlRepo({
        name: "Restaurant-POS",
        description: "Built with HTML5, CSS3 & JavaScript",
        topics: [],
      }),
    ).toBe(false);
  });
  // Regression: "AI opponents" in a game description — must not match
  it("does not match AI opponents in game description", () => {
    expect(
      isAiMlRepo({
        name: "Connect4",
        description: "Connect 4 game with AI opponents",
        topics: [],
      }),
    ).toBe(false);
  });
});

describe("isGameRepo", () => {
  it("matches chess in name", () => {
    expect(
      isGameRepo({ name: "ChessGame", description: null, topics: [] }),
    ).toBe(true);
  });
  it("matches connect4 in name", () => {
    expect(
      isGameRepo({ name: "Connect4-Haskell", description: null, topics: [] }),
    ).toBe(true);
  });
  it("returns false for non-game repos", () => {
    expect(
      isGameRepo({ name: "portfolio", description: "My website", topics: [] }),
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
    has_pages: false,
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
  it("sets isLive true when has_pages is true and no homepage", () => {
    expect(mapRawRepo({ ...raw, homepage: null, has_pages: true }).isLive).toBe(
      true,
    );
  });
  it("sets isGame true for chess repo", () => {
    expect(mapRawRepo({ ...raw, name: "ChessGame" }).isGame).toBe(true);
  });
  it("game repos are not flagged as isAiMl", () => {
    const repo = mapRawRepo({
      ...raw,
      name: "Connect4",
      description: "Game with AI opponents",
    });
    expect(repo.isGame).toBe(true);
    expect(repo.isAiMl).toBe(false);
  });
});
