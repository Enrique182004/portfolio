import { fetchRepos } from "@/lib/github";
import StarMap from "@/components/StarMap/StarMap";

export const revalidate = 3600;

export default async function Home() {
  let repos: Awaited<ReturnType<typeof fetchRepos>> = [];
  try {
    repos = await fetchRepos();
  } catch {
    // Render with empty repos if GitHub API is unreachable
  }

  return <StarMap repos={repos} />;
}
