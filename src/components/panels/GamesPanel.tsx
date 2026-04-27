import { Repo } from "@/types/repo";
import RepoCard from "@/components/RepoCard/RepoCard";

interface GamesPanelProps {
  repos: Repo[];
}

export default function GamesPanel({ repos }: GamesPanelProps) {
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
        Games
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
        Game projects &amp; interactive applications
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
          No game repositories found.
        </p>
      ) : (
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
      )}
    </div>
  );
}
