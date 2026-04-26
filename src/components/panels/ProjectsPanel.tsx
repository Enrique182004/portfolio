import { Repo } from "@/types/repo";
import RepoCard from "@/components/RepoCard/RepoCard";

interface ProjectsPanelProps {
  repos: Repo[];
}

export default function ProjectsPanel({ repos }: ProjectsPanelProps) {
  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 18,
          letterSpacing: 3,
          color: "var(--text-bright)",
          marginBottom: 6,
        }}
      >
        Projects
      </h2>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: 3,
          color: "var(--text-muted)",
          marginBottom: 32,
          textTransform: "uppercase",
        }}
      >
        Public repositories · Sorted by last updated
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 14,
        }}
      >
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}
