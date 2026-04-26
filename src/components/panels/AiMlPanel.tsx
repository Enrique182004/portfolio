import { Repo } from "@/types/repo";
import RepoCard from "@/components/RepoCard/RepoCard";

interface AiMlPanelProps {
  repos: Repo[];
}

export default function AiMlPanel({ repos }: AiMlPanelProps) {
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
        AI / ML
      </h2>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: 3,
          color: "var(--text-muted)",
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        Machine learning, data science, and AI experimentation
      </p>
      {repos.length === 0 ? (
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 12,
            marginTop: 40,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            letterSpacing: 2,
          }}
        >
          No AI/ML repositories detected yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 14,
            marginTop: 24,
          }}
        >
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}
