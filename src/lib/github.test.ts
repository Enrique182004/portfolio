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
