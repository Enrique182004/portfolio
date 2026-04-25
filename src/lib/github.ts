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
