import { Repo } from "@/types/repo";

const GITHUB_OWNER = "Enrique182004";

// Word-boundary patterns prevent false positives:
// - "html5" contains "ml" as substring → use \bml\b
// - game bot descriptions say "AI opponents" → exclude that phrase
const AI_ML_PATTERNS: RegExp[] = [
  /\bml\b/,
  /\bai\b(?! opponent| opponents)/,
  /\bmodel\b/,
  /neural/,
  /classifier/,
  /\bnlp\b/,
  /\bdeep.?learn/,
  /\bpredict/,
  /\bdataset\b/,
  /vangogh|vang\b/,
  /machine.?learn/,
  /\bllm\b/,
];

const GAME_PATTERN =
  /chess|connect4|connect-4|\bgame\b|checkers|puzzle|sudoku/i;

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
  has_pages: boolean;
}

export function isAiMlRepo(r: {
  name: string;
  description: string | null;
  topics: string[];
}): boolean {
  const text = `${r.name} ${r.description ?? ""} ${r.topics.join(" ")}`;
  return AI_ML_PATTERNS.some((p) => p.test(text));
}

export function isGameRepo(r: {
  name: string;
  description: string | null;
  topics: string[];
}): boolean {
  const text = `${r.name} ${r.description ?? ""} ${r.topics.join(" ")}`;
  return GAME_PATTERN.test(text);
}

export function mapRawRepo(r: RawRepo): Repo {
  const liveUrl =
    r.homepage ||
    (r.has_pages
      ? `https://${GITHUB_OWNER.toLowerCase()}.github.io/${r.name}`
      : null);
  const game = isGameRepo(r);
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    html_url: r.html_url,
    homepage: liveUrl,
    language: r.language,
    stargazers_count: r.stargazers_count,
    updated_at: r.updated_at,
    topics: r.topics ?? [],
    isLive: Boolean(liveUrl),
    isAiMl: !game && isAiMlRepo(r),
    isGame: game,
  };
}

export async function fetchRepos(): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_OWNER}/repos?sort=updated&per_page=100`,
    {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github.v3+json" },
    },
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const raw = (await res.json()) as RawRepo[];
  return raw.filter((r) => !r.private).map(mapRawRepo);
}
